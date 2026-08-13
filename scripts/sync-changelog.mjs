#!/usr/bin/env node
/**
 * Incrementally insert missing BetterClip versions into docs/changelog.md
 * from product-repo release-notes/vX.Y.Z.md files.
 *
 * Existing changelog entries are never rewritten (manual polish is kept).
 */

import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(__dirname, "..");

const DEFAULT_HEADER = `---
title: 更新记录
description: BetterClip 0.30.x 版本更新摘要
sidebar_position: 13
---

# 更新记录

按版本列出用户可见变更（由产品仓 release notes 同步；已有条目不覆盖）。发版后请以软件内实际行为为准。

`;

/**
 * @typedef {{version: string, date: string | null, bullets: string[]}} NoteEntry
 */

/**
 * @param {string[]} argv
 * @returns {{notesDir: string, changelog: string, minSeries: string, dryRun: boolean}}
 */
function parseArgs(argv) {
  /** @type {Record<string, string | boolean>} */
  const out = {
    notesDir: path.resolve(DOCS_ROOT, "..", "quicker-workspace", "clip", "main", "release-notes"),
    changelog: path.join(DOCS_ROOT, "docs", "changelog.md"),
    minSeries: "0.30",
    dryRun: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run") {
      out.dryRun = true;
      continue;
    }
    const next = argv[i + 1];
    if (arg === "--notes-dir" && next) {
      out.notesDir = next;
      i++;
    } else if (arg === "--changelog" && next) {
      out.changelog = next;
      i++;
    } else if (arg === "--min-series" && next) {
      out.minSeries = next;
      i++;
    }
  }
  return {
    notesDir: path.resolve(String(out.notesDir)),
    changelog: path.resolve(String(out.changelog)),
    minSeries: String(out.minSeries),
    dryRun: Boolean(out.dryRun),
  };
}

/**
 * @param {string} series like "0.30" or "0.30.0"
 */
function padVersion(series) {
  const parts = series.split(".");
  while (parts.length < 3) {
    parts.push("0");
  }
  return parts.join(".");
}

/**
 * Include this version when it is >= --min-series (e.g. 0.30 → 0.30.0 and later).
 * @param {string} version
 * @param {string} minSeries
 */
function isAtLeastSeries(version, minSeries) {
  return versionKey(version) >= versionKey(padVersion(minSeries));
}

/**
 * @param {string} version
 */
function versionKey(version) {
  const parts = version.split(".").map((p) => Number.parseInt(p, 10));
  return parts[0] * 1_000_000 + parts[1] * 1_000 + parts[2];
}

/**
 * @param {string} raw
 */
function padDate(raw) {
  const m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!m) {
    return raw;
  }
  return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
}

/**
 * Light, mechanical cleanup — not a full rewrite.
 * @param {string} bullet
 */
function rewriteBullet(bullet) {
  return bullet
    .replace(/\bClipHost\b/g, "程序")
    .replace(/管道通信/g, "通信")
    .replace(/程序集冲突/g, "连接冲突")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * @param {string} text
 * @returns {NoteEntry | null}
 */
function parseNoteFile(text) {
  const heading = text.match(
    /^##\s+v?(\d+\.\d+\.\d+)\s*(?:[\(（]\s*(\d{4}-\d{1,2}-\d{1,2})\s*[\)）])?/m,
  );
  if (!heading) {
    return null;
  }
  const version = heading[1];
  const date = heading[2] ? padDate(heading[2]) : null;
  const bullets = [];
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*-\s+(.+)$/);
    if (!m) {
      continue;
    }
    const item = rewriteBullet(m[1]);
    if (item) {
      bullets.push(item);
    }
  }
  if (bullets.length === 0) {
    return null;
  }
  return {version, date, bullets};
}

/**
 * @param {string} notesDir
 * @param {string} minSeries
 * @returns {NoteEntry[]}
 */
function loadNotes(notesDir, minSeries) {
  if (!fs.existsSync(notesDir)) {
    throw new Error(`release-notes directory not found: ${notesDir}`);
  }
  /** @type {NoteEntry[]} */
  const entries = [];
  for (const name of fs.readdirSync(notesDir)) {
    const m = name.match(/^v(\d+\.\d+\.\d+)\.md$/i);
    if (!m || !isAtLeastSeries(m[1], minSeries)) {
      continue;
    }
    const text = fs.readFileSync(path.join(notesDir, name), "utf8");
    const parsed = parseNoteFile(text);
    if (parsed) {
      entries.push(parsed);
    }
  }
  entries.sort((a, b) => versionKey(b.version) - versionKey(a.version));
  return entries;
}

/**
 * @param {string} markdown
 * @returns {Set<string>}
 */
function existingVersions(markdown) {
  const found = new Set();
  const re = /^##\s+(.+)$/gm;
  let m;
  while ((m = re.exec(markdown))) {
    for (const hit of m[1].matchAll(/v(\d+\.\d+\.\d+)/g)) {
      found.add(hit[1]);
    }
  }
  return found;
}

/**
 * @param {NoteEntry} entry
 */
function formatSection(entry) {
  const title = entry.date
    ? `## v${entry.version}（${entry.date}）`
    : `## v${entry.version}`;
  const bullets = entry.bullets.map((b) => `- ${b}`).join("\n");
  return `${title}\n\n${bullets}\n`;
}

/**
 * @param {string} markdown
 * @param {NoteEntry[]} missing
 */
function insertSections(markdown, missing) {
  const block = missing.map(formatSection).join("\n");
  const firstHeading = markdown.search(/^##\s+v\d+\.\d+\.\d+/m);
  if (firstHeading === -1) {
    const base = markdown.trimEnd() ? `${markdown.trimEnd()}\n\n` : DEFAULT_HEADER;
    return `${base}${block}`;
  }
  return `${markdown.slice(0, firstHeading)}${block}\n${markdown.slice(firstHeading)}`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const notes = loadNotes(args.notesDir, args.minSeries);
  const changelogText = fs.existsSync(args.changelog)
    ? fs.readFileSync(args.changelog, "utf8")
    : DEFAULT_HEADER;
  const have = existingVersions(changelogText);
  const missing = notes.filter((n) => !have.has(n.version));

  if (missing.length === 0) {
    console.log(`changelog unchanged (${have.size} versions already present)`);
    return;
  }

  const next = insertSections(changelogText, missing);
  if (args.dryRun) {
    console.log(`dry-run: would add ${missing.map((n) => "v" + n.version).join(", ")}`);
    return;
  }

  fs.mkdirSync(path.dirname(args.changelog), {recursive: true});
  fs.writeFileSync(args.changelog, next, "utf8");
  console.log(`added ${missing.map((n) => "v" + n.version).join(", ")}`);
}

main();
