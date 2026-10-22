# Cea 剪贴板文档站

Cea 剪贴板（eaclip / ClipHost，Rust + GPUI）的用户文档站，使用 [Docusaurus](https://docusaurus.io/) 生成。

- 文档网站：https://clip.alinko.cc/ （Cloudflare Workers，push `main` 自动部署）
- Cloudflare Pages 项目 `betterclip-docs`：https://betterclip-docs.pages.dev/ （需配置 `CLOUDFLARE_API_TOKEN` 后由 Actions 上传）
- 下载：[ceastld/eaclip Releases](https://github.com/ceastld/eaclip/releases/latest)

## 内容来源

`docs/` 里的页面**全部自动生成**，唯一来源是产品仓 `ceastld/CeaQuickerTools` main 分支的 `docs/user/`。
不要直接改 `docs/*.md`，改产品仓的 `docs/user/` 即可。

| docs/user | 站点页面 |
| --- | --- |
| README.md | `/`（简介） |
| usage.md | `/usage` 使用说明 |
| features.md | `/features` 功能清单 |
| install.md | `/install` 安装和配置 |
| hotkeys.md、settings.md | `/hotkeys`、`/settings`（「快捷键和设置」分组） |
| faq.md | `/faq` 常见问题 |
| known-issues.md | `/known-issues` 已知问题 |
| CHANGELOG.md | `/changelog` 更新日志 |
| 其它新增 .md | 自动加入侧栏（更新日志之前） |

`legacy/legacy-changelog.md` 是 .NET 时代 BetterClip 0.30.x 的手工存档，原样复制到「历史存档」。

`scripts/sync-user-docs.mjs` 负责：映射文件名与侧栏顺序、改写相对链接、去掉 `> TODO（…）` 内部备注、生成 front matter 和 `sidebars.generated.json`，并在发现 token、本机路径、内网 IP 等疑似私有内容时拒绝生成。

## 自动更新

`.github/workflows/site.yml`：

- 触发：push `main`、手动、每 30 分钟定时、`repository_dispatch`（`user-docs-updated` / `clip-release`）。
- 有 `CLIP_REPO_TOKEN` 时，sparse checkout 产品仓 `docs/user`，重新生成 `docs/`；有变化就提交到 `main`，Cloudflare Workers Builds 随之重建部署。
- 有 `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` 时，同时把 `build/` 上传到 Pages 项目 `betterclip-docs`。

| Secret | 用途 |
| --- | --- |
| `CLIP_REPO_TOKEN` | 细粒度 PAT：仅 `ceastld/CeaQuickerTools`，Contents 只读 |
| `CLOUDFLARE_API_TOKEN` | 可选：Account → Cloudflare Pages → Edit |
| `CLOUDFLARE_ACCOUNT_ID` | 可选：Cloudflare 账户 ID |

## 本地命令

```powershell
npm ci
npm run sync-docs        # 读取 ../CeaQuickerTools/docs/user
npm run start -- --host 127.0.0.1 --port 3000 --no-open
npm run build
npm run workers:deploy   # 手动部署 Worker（需 wrangler 登录）
npm run pages:deploy     # 手动上传 Pages（需 Pages 权限）
```

其它位置的 docs/user：`node scripts/sync-user-docs.mjs --src <路径>/docs/user`；`--check` 只检查是否需要更新。
