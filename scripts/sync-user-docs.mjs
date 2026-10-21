#!/usr/bin/env node
/**
 * Generate the site's docs/ from the product repo's user docs (docs/user).
 *
 * Source of truth: ceastld/CeaQuickerTools main → docs/user/*.md
 * Output:          docs/*.md (fully regenerated) + sidebars.generated.json
 *
 * Usage:
 *   node scripts/sync-user-docs.mjs --src <path-to-docs/user> [--out docs] [--check]
 *
 * Do not hand-edit docs/: change docs/user in the product repo instead.
 * Hand-maintained pages that are not generated live in legacy/ and are copied as-is.
 */

import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Known source files → site page. Order = sidebar order.
 * `group` puts the page into a sidebar category.
 */
const PAGES = [
  {src: "README.md", id: "index", slug: "/", title: "简介", label: "简介"},
  {src: "usage.md", id: "usage", title: "使用说明"},
  {src: "features.md", id: "features", title: "功能清单"},
  {src: "install.md", id: "install", title: "安装和配置"},
  {src: "hotkeys.md", id: "hotkeys", title: "快捷键", group: "快捷键和设置"},
  {src: "settings.md", id: "settings", title: "设置", group: "快捷键和设置"},
  {src: "faq.md", id: "faq", title: "常见问题"},
  {src: "known-issues.md", id: "known-issues", title: "已知问题"},
  {src: "CHANGELOG.md", id: "changelog", title: "更新日志"},
];

/** Hand-maintained pages copied from legacy/ (appended to the sidebar). */
const LEGACY = [{file: "legacy-changelog.md", id: "legacy-changelog", group: "历史存档"}];

/** Anything matching these must never reach the public site. */
const FORBIDDEN = [
  [/gh[pousr]_[A-Za-z0-9]{20,}/, "GitHub token"],
  [/github_pat_[A-Za-z0-9_]{20,}/, "GitHub fine-grained token"],
  [/\b[A-Za-z0-9_-]{40}\b(?=.*(token|secret|key))/i, "token-like string"],
  [/\b(?:api[_-]?key|secret|password|passwd)\s*[:=]\s*\S+/i, "credential assignment"],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "private key"],
  [/\b[A-Z]:\\(?:source|repos|Users)\\/i, "local absolute path"],
  [/\/home\/[a-z0-9_-]+\//i, "local home path"],
  [/\b(?:10|192\.168|172\.(?:1[6-9]|2\d|3[01]))\.\d+\.\d+(?:\.\d+)?\b/, "private IP"],
];

function parseArgs(argv) {
  const out = {src: null, out: path.join(ROOT, "docs"), check: false};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--check") out.check = true;
    else if (a === "--src") out.src = argv[++i];
    else if (a === "--out") out.out = argv[++i];
  }
  if (!out.src) {
    console.error("usage: sync-user-docs.mjs --src <docs/user dir> [--out docs] [--check]");
    process.exit(2);
  }
  return {src: path.resolve(out.src), out: path.resolve(out.out), check: out.check};
}

/** Remove internal "> TODO（…）" notes (and their continuation lines). */
function stripTodos(md) {
  const lines = md.split(/\r?\n/);
  const kept = [];
  let skipping = false;
  for (const line of lines) {
    if (/^\s*>\s*(TODO|FIXME|待确认|待补充|待核对)/.test(line)) {
      skipping = true;
      continue;
    }
    if (skipping && /^\s*>/.test(line)) continue;
    skipping = false;
    kept.push(line);
  }
  return kept.join("\n").replace(/\n{3,}/g, "\n\n");
}

/** Rewrite links to sibling source files so they resolve to the generated files. */
function rewriteLinks(md, fileMap) {
  return md.replace(/\]\(([^)\s#]+\.md)(#[^)\s]*)?\)/g, (m, target, hash = "") => {
    if (/^[a-z]+:\/\//i.test(target)) return m;
    const base = path.posix.basename(target);
    const mapped = fileMap.get(base) ?? fileMap.get(base.toLowerCase());
    if (!mapped) {
      console.warn(`warn: link to unknown doc ${target}`);
      return m;
    }
    return `](./${mapped}${hash})`;
  });
}

function firstH1(md) {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : null;
}

function firstParagraph(md) {
  const body = md.replace(/^#\s+.+$/m, "");
  for (const block of body.split(/\n\s*\n/)) {
    const t = block.trim();
    if (!t || /^[#>|\-*`!<]/.test(t)) continue;
    return t.replace(/\s+/g, " ").replace(/[*`[\]]/g, "").replace(/\(([^)]*)\)/g, "").slice(0, 150);
  }
  return null;
}

function yamlStr(s) {
  return JSON.stringify(String(s));
}

function frontMatter(fields) {
  const lines = ["---"];
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined || v === null) continue;
    lines.push(`${k}: ${typeof v === "number" ? v : yamlStr(v)}`);
  }
  lines.push("---", "");
  return lines.join("\n");
}

function scanForbidden(name, text) {
  const hits = [];
  text.split(/\r?\n/).forEach((line, i) => {
    for (const [re, what] of FORBIDDEN) {
      if (re.test(line)) hits.push(`${name}:${i + 1}: ${what}`);
    }
  });
  return hits;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(args.src)) throw new Error(`source not found: ${args.src}`);

  const srcFiles = fs.readdirSync(args.src).filter((f) => f.toLowerCase().endsWith(".md")).sort();
  const known = new Map(PAGES.map((p) => [p.src.toLowerCase(), p]));
  const pages = PAGES.filter((p) => srcFiles.some((f) => f.toLowerCase() === p.src.toLowerCase()));
  // Extra pages added to docs/user later are published too (after the known ones).
  for (const f of srcFiles) {
    if (known.has(f.toLowerCase())) continue;
    const id = f.replace(/\.md$/i, "").toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    pages.splice(pages.length - 1, 0, {src: f, id, title: null});
  }

  const fileMap = new Map();
  for (const p of pages) {
    fileMap.set(p.src, `${p.id}.md`);
    fileMap.set(p.src.toLowerCase(), `${p.id}.md`);
  }

  /** @type {Map<string, string>} */
  const outputs = new Map();
  const problems = [];
  pages.forEach((p, i) => {
    const raw = fs.readFileSync(path.join(args.src, p.src), "utf8").replace(/^\uFEFF/, "");
    problems.push(...scanForbidden(`docs/user/${p.src}`, raw));
    let body = rewriteLinks(stripTodos(raw), fileMap).trimEnd() + "\n";
    const h1 = firstH1(body);
    const title = p.title ?? h1 ?? p.id;
    const fm = frontMatter({
      id: p.id,
      title: p.id === "index" ? (h1 ?? title) : title,
      sidebar_label: p.label ?? title,
      sidebar_position: i + 1,
      slug: p.slug,
      description: firstParagraph(body) ?? undefined,
      custom_edit_url: null,
    }).replace('custom_edit_url: "null"', "custom_edit_url: null");
    const banner =
      "<!-- 本页由 scripts/sync-user-docs.mjs 从产品仓 docs/user 自动生成，请勿直接修改。 -->\n\n";
    outputs.set(`${p.id}.md`, fm + banner + body);
  });

  for (const l of LEGACY) {
    const file = path.join(ROOT, "legacy", l.file);
    if (fs.existsSync(file)) outputs.set(l.file, fs.readFileSync(file, "utf8"));
  }

  if (problems.length) {
    console.error("Refusing to publish: possible private content found:\n  " + problems.join("\n  "));
    process.exit(1);
  }

  // Sidebar: known order, grouped categories.
  const sidebar = [];
  const groups = new Map();
  const push = (id, group) => {
    if (!group) return sidebar.push(id);
    let cat = groups.get(group);
    if (!cat) {
      cat = {type: "category", label: group, collapsed: false, items: []};
      groups.set(group, cat);
      sidebar.push(cat);
    }
    cat.items.push(id);
  };
  for (const p of pages) push(p.id, p.group);
  for (const l of LEGACY) if (outputs.has(l.file)) push(l.id, l.group);
  for (const c of groups.values()) if (c.label === "历史存档") c.collapsed = true;
  const sidebarJson = JSON.stringify({docsSidebar: sidebar}, null, 2) + "\n";

  // Compare with current state.
  const existing = fs.existsSync(args.out)
    ? fs.readdirSync(args.out).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    : [];
  const sidebarPath = path.join(ROOT, "sidebars.generated.json");
  const changed = [];
  for (const [name, text] of outputs) {
    const p = path.join(args.out, name);
    if (!fs.existsSync(p) || fs.readFileSync(p, "utf8") !== text) changed.push(name);
  }
  const removed = existing.filter((f) => !outputs.has(f));
  const sidebarChanged = !fs.existsSync(sidebarPath) || fs.readFileSync(sidebarPath, "utf8") !== sidebarJson;

  if (args.check) {
    if (changed.length || removed.length || sidebarChanged) {
      console.log(`out of date: changed=[${changed}] removed=[${removed}] sidebar=${sidebarChanged}`);
      process.exit(1);
    }
    console.log("docs up to date");
    return;
  }

  fs.mkdirSync(args.out, {recursive: true});
  for (const f of removed) fs.rmSync(path.join(args.out, f));
  for (const name of changed) fs.writeFileSync(path.join(args.out, name), outputs.get(name), "utf8");
  if (sidebarChanged) fs.writeFileSync(sidebarPath, sidebarJson, "utf8");
  console.log(
    `pages: ${[...outputs.keys()].join(", ")}\nchanged: ${changed.join(", ") || "-"}; removed: ${removed.join(", ") || "-"}; sidebar: ${sidebarChanged ? "updated" : "same"}`,
  );
}

main();
