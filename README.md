# BetterClip 文档站

BetterClip（Windows 剪贴板管理器）的用户文档，使用 [Docusaurus](https://docusaurus.io/) 生成静态站点。

**文档网站：** https://betterclip-docs.liud0519.workers.dev/

- GitHub：https://github.com/ceastld/betterclip-docs

产品源码在 [ceastld/CeaQuickerTools](https://github.com/ceastld/CeaQuickerTools)；本仓只放面向最终用户的 Markdown。

## 安装

```powershell
npm ci
```

## 本地开发

```powershell
npm run start -- --host 127.0.0.1 --port 3000 --no-open
```

浏览器打开 http://127.0.0.1:3000/

## 构建

```powershell
npm run build
```

产物在 `build/`。

## 发布（Cloudflare Workers）

本站当前通过 **Cloudflare Workers**（静态资源 + Workers Builds）发布：https://betterclip-docs.liud0519.workers.dev/ 。推送 `main` 后由 Cloudflare Git 集成构建；也可由 GitHub Actions `wrangler deploy`（需 Secrets）。

| 项 | 值 |
|----|-----|
| 框架 | Docusaurus |
| 构建命令 | `npm run build` |
| 静态资源目录 | `build`（`wrangler.jsonc` → `assets.directory`） |
| 生产分支 | `main` |
| Node | 22 |

### 本机直接上传

```powershell
npm run pages:deploy
```

（脚本名历史遗留，实际执行 `wrangler deploy`。）

### Cloudflare 控制台 Build 设置（Workers Builds）

若 Git 集成构建失败，请确认：

| 项 | 建议值 |
|----|--------|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/`（空） |
| Node version | `22` |
### 更新记录如何进站

产品仓 `ceastld/CeaQuickerTools` 的 `release-notes/vX.Y.Z.md` 是源。发版后：

1. **GitHub Actions**（产品仓 Release 成功，且已设 `DOCS_REPO_TOKEN`）会把**尚未出现**的版本插入 `docs/changelog.md` 并 push
2. 本机也可：`npm run sync-changelog`（读旁边 `quicker-workspace/clip/main/release-notes`）

已有 changelog 条目**不会被覆盖**（便于手工改写）。功能说明页仍需按 DESIGN / UI 人工维护。

GitHub Secrets（本仓）：

| Secret | 用途 |
|--------|------|
| `CLOUDFLARE_API_TOKEN` | Pages 部署（权限：Account → Cloudflare Pages → Edit） |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户 ID |
| `CLIP_REPO_TOKEN` | 可选；仅当要从本仓 workflow 拉取私有产品仓 release-notes |

## 目录

- `docs/`：用户可见文档（简介、功能介绍、更新记录）
- `src/`：站点样式与主题覆盖
- `static/`：静态资源

## 文档写作

面向最终用户：可见行为、步骤、限制。不要把内部类名、协议或启动流细节当主线。

发版 changelog 仍以产品仓 `clip/main/release-notes/` 为源；上站时人工把用户可见条目改写进 `docs/changelog.md`。
