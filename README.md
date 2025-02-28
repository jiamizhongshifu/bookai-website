# AI学霸网站

AI学霸网站是一个提供AI工具教程与资源的平台，专注于ChatGPT、Cursor、Deepseek等AI工具的使用教程。

## 功能特点

- 基于Markdown的内容管理
- 自动提取文章元数据
- 自动生成目录结构
- 阅读进度条
- 上一篇/下一篇导航
- 相关文章推荐
- 自动生成sitemap.xml
- 文件监听模式（实时预览）
- 动态生成分类文章列表（按日期倒序）
- 分页导航（每页10条）
- 自动提取文章首段作为摘要
- 最新文章提示角标（NEW标签）

## 目录结构

```
.
├── articles/            # Markdown文章目录
├── css/                 # CSS样式文件
├── js/                  # JavaScript文件
├── scripts/             # 构建脚本
│   ├── build.js         # 主构建脚本
│   ├── test-build.js    # 测试构建脚本
│   └── test-markdown-it.js # Markdown渲染测试脚本
├── templates/           # HTML模板
│   ├── article-detail.html # 文章详情模板
│   ├── article-list.html   # 文章列表模板
│   ├── home.html          # 首页模板
│   └── base.html        # 基础模板
└── package.json         # 项目配置
```

## 安装

1. 克隆仓库

```bash
git clone https://github.com/yourusername/aixueba.git
cd aixueba
```

2. 安装依赖

```bash
npm install
```

## 使用方法

### 构建网站

```bash
npm run build
```

### 开发模式（文件监听）

```bash
npm run dev
```

### 测试Markdown渲染

```bash
npm run test-markdown
```

### 测试构建过程

```bash
npm run test-build
```

## 文章格式

文章使用Markdown格式，支持Front Matter元数据：

```markdown
---
title: 文章标题
summary: 文章摘要
category: chatgpt
tags: [ChatGPT, AI, 教程]
date: 2025-02-28
author: AI进化论-花生
---

# 文章标题

> 文章摘要

## 目录

[[toc]]

## 正文内容

这里是正文内容...
```

如果不提供摘要，系统会自动提取文章的第一段作为摘要。

## 自定义配置

主要配置在`scripts/build.js`文件中的`CONFIG`对象：

```javascript
const CONFIG = {
  articlesDir: path.join(__dirname, '..', 'articles'),
  outputDir: process.env.OUTPUT_DIR || path.join(__dirname, '..'),
  templatesDir: path.join(__dirname, '..', 'templates'),
  sitemapPath: process.env.OUTPUT_DIR 
    ? path.join(process.env.OUTPUT_DIR, 'sitemap.xml')
    : path.join(__dirname, '..', 'sitemap.xml'),
  baseUrl: 'https://aixueba.club',
  watchMode: process.argv.includes('--watch'),
  categories: ['chatgpt', 'cursor', 'deepseek', 'tools'],
  defaultAuthor: 'AI进化论-花生',
  articlesPerPage: 10,
  newArticleDays: 7 // 发布7天内的文章标记为"新"
};
```

## 许可证

MIT