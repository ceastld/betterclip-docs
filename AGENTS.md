# AGENTS — betterclip-docs（Cea 剪贴板文档站）

Docusaurus 3 静态站。内容**由产品仓 `ceastld/CeaQuickerTools` main 的 `docs/user/` 生成**，见 README。

## 边界

| 做 | 不做 |
|----|------|
| 改站点外壳：配置、样式、同步脚本、workflow | 直接改 `docs/*.md`（会被下一次同步覆盖） |
| 内容问题 → 改产品仓 `docs/user/` 并通过其公开安全检查 | 往站点放 token、内部路径、私有信息 |
| 推 `main` → Cloudflare Workers Builds 部署 | `docusaurus deploy`（GitHub Pages） |

## 命令

```powershell
npm ci
node scripts/sync-user-docs.mjs --src ../CeaQuickerTools/docs/user
npm run build
```

- `routeBasePath: '/'`；`.md` 按 CommonMark 解析（`markdown.format: 'detect'`），不支持 MDX 组件。
- 侧栏来自 `sidebars.generated.json`（脚本生成）。
- `wrangler.jsonc` 是 Workers 配置（`assets.directory: build`），**不要**写 `pages_build_output_dir`。
- push `main` = 生产发布；未经用户要求不 push。
