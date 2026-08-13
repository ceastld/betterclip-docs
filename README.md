# BetterClip 文档站

BetterClip（Windows 剪贴板管理器）的用户文档，使用 [Docusaurus](https://docusaurus.io/) 生成静态站点。

- GitHub：https://github.com/ceastld/betterclip-docs
- 生产预览：https://betterclip-docs.pages.dev（Cloudflare Pages，连接仓库后可用）

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

## 发布（Cloudflare Pages）

推送 `main` 后由 Cloudflare Pages 自动构建，**不要**使用 `npm run deploy`。

控制台新建 Pages 项目并连接本仓库时填写：

| 项 | 值 |
|----|-----|
| 框架预设 | Docusaurus |
| 构建命令 | `npm run build` |
| 输出目录 | `build` |
| 根目录 | （空） |
| 生产分支 | `main` |
| Node 版本 | 20 或 22 |

其它分支用于预览部署。自定义域名可稍后绑定。

## 目录

- `docs/`：用户可见文档（简介、功能介绍、更新记录）
- `src/`：站点样式与主题覆盖
- `static/`：静态资源

## 文档写作

面向最终用户：可见行为、步骤、限制。不要把内部类名、协议或启动流细节当主线。

发版 changelog 仍以产品仓 `clip/main/release-notes/` 为源；上站时人工把用户可见条目改写进 `docs/changelog.md`。
