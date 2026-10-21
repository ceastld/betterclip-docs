---
id: "changelog"
title: "更新日志"
sidebar_label: "更新日志"
sidebar_position: 7
description: "只列出在 ceastld/eaclip 公开发布的版本。每版完整说明见对应 Release 页面。"
---
<!-- 本页由 scripts/sync-user-docs.mjs 从产品仓 docs/user 自动生成，请勿直接修改。 -->

# 更新记录

只列出在 [ceastld/eaclip](https://github.com/ceastld/eaclip/releases) 公开发布的版本。每版完整说明见对应 Release 页面。

0.31.18、0.31.19、0.31.20、0.31.22 是未公开发布的候选版本，其内容分别由 0.31.21 和 0.31.23 承接，因此不单独列出。

## 0.31.23（2026-10-20）

[Release](https://github.com/ceastld/eaclip/releases/tag/rust-v0.31.23) · Windows x64 / ARM64

- 修复部分电脑开机早期自动启动时，可能提示 `overflow when subtracting duration from instant` 并退出的问题。
- 修正采集状态及全局采集抑制状态的初始化，默认仍立即允许采集。
- 改进设置窗口打开失败时的诊断信息。
- 剪贴板 n10 与超级菜单 n10 要求宿主 `0.31.23.0`；入口 DLL 继续复用 `0.31.14.1`。

## 0.31.21（2026-10-20）

[Release](https://github.com/ceastld/eaclip/releases/tag/rust-v0.31.21) · Windows x64 / ARM64

- 新增 Windows 设备间可选剪贴板同步（文本、静态图片），总开关及每台设备的发送、接收初始关闭。
- 每台设备可分别选择是否保存到历史、是否替换当前剪贴板；文件继续手动互传。
- 新增「收到文件后加入剪贴板列表」（初始关闭）。
- 局域网互传贴附剪贴板右侧，与编辑共用右栏；精简消息、文件卡片与输入框。
- 超级菜单六分类切换栏移到当前屏幕顶部居中；修复「全局菜单设置」误打开剪贴板；超级菜单相关设置合并为一个侧栏分类。
- 优化数字键粘贴与外部输入衔接，补充状态及暂停原因；历史搜索框更紧凑。
- 修复部分显示缩放下短消息只显示首字，以及右栏打开时靠屏边拖动主窗口回跳。

## 0.31.17（2026-10-19）

[Release](https://github.com/ceastld/eaclip/releases/tag/rust-v0.31.17) · Windows x64 / ARM64

- 修正显卡设备重建时的资源释放顺序，降低显示器恢复、显卡驱动重置时的崩溃风险。
- 增加主窗口关闭、主动退出及正常结束的诊断记录（不含剪贴板正文）。
- 完善原生局域网设备与传输界面。
- 历史列表删除后局部更新，减少连续删除时的跳动；调整暗色图标、文本编辑等细节。

## 0.31.16（2026-10-18）

[Release](https://github.com/ceastld/eaclip/releases/tag/rust-v0.31.16) · Windows x64 / ARM64

- 历史条目使用更紧凑的右键菜单，整合常用操作、收藏和局域网发送。
- 收藏支持保存到总目录、悬停选择指定目录和路径搜索，保存后显示位置并可撤销。
- 列表常用设置改为右下角紧凑弹层；恢复返回顶部按钮，新增默认关闭的闲置回顶选项。
- 图片列表按可见内容加载并共享缓存预算；显示缩图不改写原图。
- 补充启动失败提示和可导出的诊断信息。

## 0.31.15（2026-10-16）

[Release](https://github.com/ceastld/eaclip/releases/tag/rust-v0.31.15) · Windows x64 / ARM64

- 文件对话框目录跳转不再向第三方进程加载辅助 DLL。
- 限制本地 API 的浏览器访问来源，阻止外部网页读取剪贴板接口。
- 补齐程序的 Windows 产品名称和文件版本信息；发布流程增加文件身份检查和 Defender 扫描。
- 尚无可信发布者代码签名，也未取得卡巴斯基复测确认。

## 0.31.14（2026-10-16）

[Release](https://github.com/ceastld/eaclip/releases/tag/rust-v0.31.14) · Windows x64 / ARM64

- 修复按住 Alt 连续便捷粘贴时浮窗不出现或提前关闭；修复超级菜单窗口分类空闲后卡住。
- 修正显示器断连 / 恢复时隐藏窗口被错误显示。
- 编辑窗口吸附在剪贴板右侧，编辑器分"内容 / 属性"两页。
- 搜索移入标题栏，剪贴板与收藏用图标切换，暂停和设置移到底栏。
- 新增"网址"分类；"富文本"加入出厂分类；文字提示中的网址可点击。
- 改进收藏拖放提示、Chrome 等另存为窗口的目录跳转与文件名保留，减少复制提示闪烁。

## 0.31.13（2026-10-15）

[Release](https://github.com/ceastld/eaclip/releases/tag/rust-v0.31.13) · Windows x64 / ARM64

- 新增 Windows ARM64 原生便携包。
- 发布 Quicker 入口 DLL `0.31.14.1`：由 DLL 按系统原生架构选择并下载宿主，支持官方依赖与 Bitiful 两个来源。
- 改进"打开 / 另存为"窗口的文件夹跳转，保留已填写的文件名。
- 完善资源管理器设置；收藏、面板、自定义目录和分类支持拖拽整理。
- 修复长 HTML、纯数字内容及聊天富文本的预览与保留问题；修复连续便捷粘贴的后续快捷键提交。

## 0.31.12（2026-10-15）

[Release](https://github.com/ceastld/eaclip/releases/tag/rust-v0.31.12) · Windows x64

- 修复 Windows 程序文件与窗口缺少应用图标；托盘改用剪贴板产品图标。
- 修正 Quicker V2 的旧宿主版本，使用 GPUI 原生界面。

## 更早版本

0.31.12 之前的 Rust 版本（0.31.0–0.31.11）和 .NET 10 时代的 0.30.x 未在 eaclip 发布。
