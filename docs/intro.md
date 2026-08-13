---
title: 简介
description: BetterClip 是什么，以及它与 Quicker 的关系
slug: /
sidebar_position: 1
---

import ClipboardWindowPreview from '@site/src/components/ClipboardWindowPreview';

# 简介

**BetterClip** 是 Windows 上的剪贴板管理器：托盘常驻、主窗口管理历史与收藏，并支持多种窗口收起方式、便捷粘贴、超级面板/菜单与局域网互传等能力。

它**不依赖 Quicker 才能运行**。未安装 Quicker 时，剪贴板历史、粘贴和设置等核心能力仍可使用。

<ClipboardWindowPreview />

## 适合谁

- 需要频繁复制粘贴、回看历史、置顶或收藏内容的 Windows 用户
- 已使用 Quicker 的用户：可通过热键或动作唤起同一套 BetterClip，而不必再开一套进程内剪贴板界面

## 和 Quicker 的关系

| | 说明 |
|--|------|
| 独立运行 | BetterClip 是独立桌面程序；剪贴板业务在本程序内完成 |
| 可选增强 | 安装 Quicker 后，可用动作（例如「剪贴板 n10」）启动或管理本程序，并使用部分增强能力 |
| 未装 Quicker | 仅相关增强不可用，**不影响**启动与日常使用 |

详见 [与 Quicker](./quicker.md)。

## 与旧版剪贴板

BetterClip（当前 0.30.x 一代）与旧版 Quicker 进程内剪贴板插件（0.8.x）是**并存的两代产品**，不是同一界面的两套皮肤。新功能默认落在 BetterClip 这一代。

## 程序与数据位置

| 用途 | 路径 |
|------|------|
| 程序安装目录 | `%LocalAppData%\Programs\BetterClip` |
| 用户数据 | `%LocalAppData%\BetterClip\` |

详见 [数据与路径](./data.md)。

## 关于云同步

云同步相关界面当前未作为正式能力开放；本文档不提供云同步使用教程。

## 接下来

- [快速开始](./getting-started.md)
- [功能总览](./features.md)
- [更新记录](./changelog.md)
