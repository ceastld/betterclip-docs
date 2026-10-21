---
id: "install"
title: "安装和配置"
sidebar_label: "安装和配置"
sidebar_position: 4
description: "适用版本：eaclip / Rust ClipHost 0.31.12 及以后（GPUI 原生界面）。当前最新公开版本见 eaclip Releases。"
---
<!-- 本页由 scripts/sync-user-docs.mjs 从产品仓 docs/user 自动生成，请勿直接修改。 -->

# 安装与配置

适用版本：eaclip / Rust ClipHost 0.31.12 及以后（GPUI 原生界面）。当前最新公开版本见 [eaclip Releases](https://github.com/ceastld/eaclip/releases/latest)。

GPUI 版本**不需要 WebView2**，也不需要 .NET 运行时。

## 选哪种架构

| Windows | 选择 |
| --- | --- |
| 普通 Intel / AMD 64 位电脑 | x64 |
| Windows on ARM（如骁龙笔记本） | ARM64 |

在 ARM64 Windows 上，即使 Quicker 以 x64 模拟方式运行，Quicker 安装入口也会按系统原生架构选择 ARM64 宿主。

ARM64 的已知边界（来自各版本说明）：文件对话框的部分原生增强目前只有 x64 实现；完整的 Quicker 桌面流程、输入法、OLE 拖放和第三方应用回贴仍在等待实机验证。

## 方式一：通过 Quicker 动作「剪贴板 n10」

1. 在 Quicker 中安装分享动作 [剪贴板 n10](https://getquicker.net/Sharedaction?code=df6cc8fc-1a67-4576-fcb0-08deace01986)。
2. 运行该动作。动作先从 Quicker 官方依赖库下载入口 DLL，再由入口 DLL 按系统架构下载并安装宿主（来源为 Quicker 官方依赖库，Bitiful 为备用源）。
3. 宿主安装在 `%LOCALAPPDATA%\Programs\ClipHostRust`。

版本要求：

| 项目 | 要求 |
| --- | --- |
| 入口 DLL | 当前发布版本复用 `0.31.14.1` |
| x64 宿主所需最低入口版本 | `0.31.7.0` |
| ARM64 宿主所需最低入口版本 | `0.31.14.1` |
| 0.31.23 对应的动作宿主要求 | 剪贴板 n10 与超级菜单 n10 要求宿主 `0.31.23.0` |

## 方式二：便携包

1. 打开 [eaclip Releases](https://github.com/ceastld/eaclip/releases/latest)，按架构下载 `eaclip-<版本>-windows-x64.zip` 或 `eaclip-<版本>-windows-arm64.zip`。
2. 可选：用同名的 `.SHA256SUMS.txt` 核对 ZIP 的 SHA-256。
3. **完整解压整个目录**，运行 `cliphost-app.exe`，不要单独拿出 EXE（同目录 DLL 需要保留）。

便携包里还附带启动诊断入口 `Start-ClipHostDiagnostics.cmd`，用法见 [常见问题](./faq.md#启动失败或闪退)。

## 升级

- 用 Quicker 安装的，运行「剪贴板 n10」时按动作要求的最低宿主版本更新。
- 便携包直接下载新版本 ZIP 解压替换。
- 0.31.x 各版本说明均写明：升级**不移动用户数据**，继续读取原有历史、收藏、配置及图片目录，也不会自动迁移到实验中的新存储格式。

## 数据位置

在 **设置 → 数据管理 → 数据文件夹** 查看或修改。

- 首次启动时会检测并直接使用已有的旧版数据文件夹，之后记住该位置，不搬动已有数据。
- 默认位置为 `%LOCALAPPDATA%\BetterClipTauri`；在设置中留空即恢复默认。
- 自定义位置需填写**程序目录以外**的绝对路径；保存时会确认并重启。**更改位置不会自动迁移数据**，需要的话请先自行复制。

## 开机自启与权限

在 **设置 → 系统**：

| 选项 | 说明 |
| --- | --- |
| 开机自启 | 当前用户登录 Windows 时自动启动 |
| 以管理员身份运行 | 冷启动时尝试管理员权限；更改后按提示重启 |

## 卸载
