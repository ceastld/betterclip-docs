---
id: "faq"
title: "常见问题"
sidebar_label: "常见问题"
sidebar_position: 6
description: "不需要。0.31.12 起正式版使用 GPUI 原生界面，不依赖 WebView2；程序是 Rust 原生程序，也不需要 .NET 运行时。"
---
<!-- 本页由 scripts/sync-user-docs.mjs 从产品仓 docs/user 自动生成，请勿直接修改。 -->

# 常见问题

## 需要安装 WebView2 或 .NET 吗？

不需要。0.31.12 起正式版使用 GPUI 原生界面，不依赖 WebView2；程序是 Rust 原生程序，也不需要 .NET 运行时。

## 应该下载 x64 还是 ARM64？

按 Windows 系统架构选择：Intel / AMD 电脑选 x64，Windows on ARM 电脑选 ARM64。详见 [安装与配置](./install.md#选哪种架构)。

## 便携包解压后打不开

- 确认**完整解压了整个目录**，运行的是目录里的 `cliphost-app.exe`，同目录的 DLL 都还在。
- 可用同名 `.SHA256SUMS.txt` 核对下载文件是否完整。
- 仍然不行，按下一节收集诊断。

## 启动失败或闪退

1. 启动错误或程序崩溃（Rust panic）时会弹出原生错误框，显示原因、诊断日志位置和栈摘要；按 `Ctrl` + `C` 可复制内容。
2. 双击便携包里的 `Start-ClipHostDiagnostics.cmd`（Quicker 安装版的程序目录通常是 `%LOCALAPPDATA%\Programs\ClipHostRust`）。诊断结束后把提示的反馈 ZIP 和复现说明一起发送。
3. 诊断输出在 `%LOCALAPPDATA%\ClipHostRust\diagnostics`，**不会自动上传**；不采集剪贴板正文、历史 / 收藏数据库、账号凭据或完整配置，但日志里可能含本机路径，发送前可自行查看。

已有 ClipHost 进程时，诊断只采集现况，不会重启或结束它。

## 开机自启后提示 `overflow when subtracting duration from instant` 并退出

部分电脑开机早期自启时可能出现此错误，**0.31.23 已修复**，请升级到 0.31.23 或更新版本。

## 杀毒软件（如卡巴斯基）报毒

0.31.15 起已移除文件对话框导航时向其它进程加载 DLL 的做法，并限制本地接口的浏览器访问来源；发布前会对原始 ZIP 做 Defender 扫描。但程序**尚未配置可信发布者代码签名**，也尚未取得卡巴斯基复测确认，不能保证所有安全软件都不再告警。请从 [eaclip Releases](https://github.com/ceastld/eaclip/releases) 或 Quicker 动作获取程序，并可用 SHA-256 核对。

## 升级会丢数据吗？

0.31.x 各版本都继续读取原有历史、收藏、配置及图片目录，不移动用户数据，也不会自动转换成实验中的新存储格式。图片显示缓存与原图分离，清理缓存不会删除原图。

## 数据存在哪里？怎么换位置？

见 [安装与配置 · 数据位置](./install.md#数据位置)。更改位置不会自动迁移数据。

## 提示"旧数据库格式不受支持"

请通过 [反馈仓库](https://github.com/QuickerHub/cea-action-issues/issues) 联系作者。作者可按需提供只读的结构采集脚本 `Get-ClipHostStorageSchema.cmd`：只读取表名和列名，不读取内容、不修改数据库。

## 快捷键没反应

- 确认 ClipHost 正在运行（系统托盘有图标）。
- 到 **设置 → 触发** / **设置 → 便捷粘贴** 查看该快捷键是否被留空，或是否提示与其它快捷键 / 软件冲突。
- `Win` + `V` 需要开启"使用 Win+V 打开剪贴板"并**重启 Windows 资源管理器**。

## 设备同步没有生效

同步默认关闭：需要在局域网 **设备与连接** 中打开总开关，并为对应设备分别开启发送 / 接收；图片同步需单独开启。配对或打开互传窗口不会自动授权同步。

## 「剪贴板」和「剪贴板 n10」有什么区别？

本文档对应 Quicker 动作 **「剪贴板 n10」**（启动 eaclip / Rust ClipHost）。

## 问题反馈

[QuickerHub/cea-action-issues](https://github.com/QuickerHub/cea-action-issues/issues)
