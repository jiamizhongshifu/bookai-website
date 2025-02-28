# ChatGPT教程系列文章

本目录包含一系列关于ChatGPT使用的教程文章，分为通用技能篇和行业应用篇。

## 通用技能篇

1. [✅ ChatGPT从零精通：万字长文教你玩转提示词工程（附模板库）](./chatgpt-prompt-engineering.md)
2. [✅ ChatGPT被封号怎么办？2024最新国内访问稳定方案汇总](./chatgpt-access-solutions.md)
3. [ChatGPT注册指南：解决+86手机号限制的完整教程](./chatgpt-registration-guide.md)
4. [✅ GPTs商店完全指南：创建、使用与变现自定义GPT的终极教程](./gpts-store-guide.md)
5. [ChatGPT Plus值不值得买？全面对比免费版与付费版功能差异](./chatgpt-plus-review.md)

## 行业应用篇

1. [✅ 用ChatGPT月入过万：自媒体/电商/教育行业的落地案例](./chatgpt-monetization-cases.md)
2. [ChatGPT编程实战：自动生成Python爬虫+数据分析脚本](./chatgpt-coding-tutorial.md)
3. [ChatGPT写作指南：如何生成高质量的SEO文章和营销文案](./chatgpt-writing-guide.md)
4. [ChatGPT助力跨境电商：选品、文案与客服自动化全攻略](./chatgpt-ecommerce-guide.md)
5. [教育工作者的ChatGPT指南：备课、教案与个性化学习方案设计](./chatgpt-education-guide.md)

## Cursor教程系列

### 开发工具篇

1. [✅ Cursor终极指南：AI写代码比Copilot更强？全功能实测报告](./cursor-ultimate-guide.md)
2. [✅ Cursor中文配置教程：如何用本地模型替代GPT-4？](./cursor-chinese-config.md)
3. [Cursor插件开发指南：打造你的专属AI编程助手](./cursor-plugin-development.md)

### 团队协作篇

1. [✅ Cursor团队版实测：如何用AI工具提升开发效率50%？](./cursor-team-efficiency.md)
2. [✅ Cursor与GitHub Copilot对比：开发者真实体验报告](./cursor-vs-copilot.md)
3. [Cursor企业级应用：数据安全与合规性全解析](./cursor-enterprise-security.md)

## DeepSeek教程系列

### 基础入门篇

1. [✅ DeepSeek新手必看：从注册到API调用的完整指南（附免费试用技巧）](./deepseek-guide.md)
2. [✅ 爆肝50小时，DeepSeek使用技巧，你收藏这一篇就够了！](./deepseek-tips.md)
3. [✅ 如何通过Monica使用DeepSeek R1：完整配置指南](./monica-deepseek.md)

### 高级应用篇

1. [✅ DeepSeek-R1模型微调实战：定制你的行业专属AI助手](./deepseek-finetune.md)
2. [✅ DeepSeek高阶用法：如何用MoE架构优化企业级AI应用？](./deepseek-advanced.md)
3. [DeepSeek API开发指南：构建智能应用的最佳实践](./deepseek-api-development.md)

## 互动工具

1. [提示词效率评分工具](../tools/prompt-efficiency-scorer.html)
2. [案例工具包下载](../tools/case-toolkit-download.html)
3. [开发效率计算器](../tools/dev-efficiency-calculator.html)
4. [Cursor快速入门视频](../tools/cursor-quick-start-video.html)

## 贡献指南

如果你有任何建议或想要贡献内容，请参考[贡献指南](./CONTRIBUTING.md)。

## 最近更新

- 2024-06-25: 添加了《DeepSeek新手必看：从注册到API调用的完整指南》
- 2024-06-25: 添加了《爆肝50小时，DeepSeek使用技巧，你收藏这一篇就够了！》
- 2024-06-25: 添加了《DeepSeek-R1模型微调实战：定制你的行业专属AI助手》
- 2024-06-25: 添加了《DeepSeek高阶用法：如何用MoE架构优化企业级AI应用？》
- 2024-06-25: 添加了《如何通过Monica使用DeepSeek R1：完整配置指南》
- 2024-06-22: 添加了《Cursor团队版实测：如何用AI工具提升开发效率50%？》
- 2024-06-20: 添加了《Cursor与GitHub Copilot对比：开发者真实体验报告》
- 2024-06-18: 添加了《Cursor中文配置教程：如何用本地模型替代GPT-4？》
- 2024-06-16: 添加了《Cursor终极指南：AI写代码比Copilot更强？全功能实测报告》
- 2024-06-15: 添加了《ChatGPT从零精通：万字长文教你玩转提示词工程》
- 2024-06-15: 添加了《ChatGPT被封号怎么办？2024最新国内访问稳定方案汇总》
- 2024-06-15: 添加了《GPTs商店完全指南：创建、使用与变现自定义GPT的终极教程》
- 2024-06-15: 添加了《用ChatGPT月入过万：自媒体/电商/教育行业的落地案例》

# 文章模板使用说明

本文档提供了关于如何使用 AiXueba 网站文章模板的详细说明。这个统一的模板设计用于创建结构一致、功能完善的教程详情页面，包含目录导航、相关文章推荐等功能。

## 目录

- [快速开始](#快速开始)
- [模板结构](#模板结构)
- [内容编辑指南](#内容编辑指南)
- [特殊元素使用](#特殊元素使用)
- [常见问题](#常见问题)

## 快速开始

要创建一篇新的文章，请按照以下步骤操作：

1. 复制 `articles/article-template.html` 文件
2. 将复制的文件重命名为你的文章标题（使用英文，用连字符替代空格），例如：`chatgpt-advanced-tips.html`
3. 使用代码编辑器打开新文件
4. 修改文件中的元数据（标题、描述、关键词等）
5. 编辑文章内容，替换模板中的占位文本
6. 保存文件并在浏览器中预览效果

## 模板结构

文章模板由以下几个主要部分组成：

### 1. 头部元数据

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>文章标题 - AiXueba</title>
    <meta name="description" content="文章描述内容，简要概括文章的主要内容和价值">
    <!-- 其他元数据 -->
</head>
```

请确保修改以下元素：
- `<title>` - 文章标题
- `<meta name="description">` - 文章描述
- `<meta name="keywords">` - 关键词
- Open Graph 和 Twitter 卡片标签

### 2. 文章头部信息

```html
<div class="article-header">
    <div class="article-category">
        <a href="../categories/category-name.html" class="category-tag">分类名称</a>
    </div>
    <h1 class="article-title">文章标题</h1>
    <div class="article-meta">
        <!-- 文章元数据 -->
    </div>
    <div class="article-tags">
        <!-- 文章标签 -->
    </div>
</div>
```

请修改：
- 分类链接和名称
- 文章标题
- 发布日期、作者信息
- 阅读时间
- 文章标签

### 3. 文章目录

```html
<div class="article-toc" id="article-toc">
    <div class="toc-header">
        <h3 class="toc-title">目录</h3>
        <button class="toc-toggle" aria-label="折叠目录">
            <i class="fas fa-chevron-up"></i>
        </button>
    </div>
    <div class="toc-content">
        <ul>
            <!-- 目录项 -->
        </ul>
    </div>
</div>
```

根据你的文章结构修改目录项，确保每个链接都指向正确的章节 ID。

### 4. 文章内容

```html
<div class="article-content">
    <!-- 文章章节 -->
    <section id="section1" class="article-section">
        <h2>第一部分：标题</h2>
        <!-- 章节内容 -->
    </section>
    
    <!-- 更多章节 -->
</div>
```

替换模板中的示例内容，添加你自己的文章内容。确保每个章节都有唯一的 ID，与目录中的链接对应。

### 5. 侧边栏

```html
<div class="article-sidebar">
    <!-- 作者信息 -->
    <div class="author-card">
        <!-- 作者信息内容 -->
    </div>
    
    <!-- 目录导航 -->
    <div class="sidebar-toc">
        <!-- 目录内容 -->
    </div>
    
    <!-- 相关文章 -->
    <div class="related-articles">
        <!-- 相关文章列表 -->
    </div>
    
    <!-- 其他侧边栏元素 -->
</div>
```

修改作者信息、相关文章和标签云等侧边栏内容。

## 内容编辑指南

### 文章结构

一篇好的教程文章通常包含以下结构：

1. **引言/简介** - 简要介绍文章内容和读者将获得的收益
2. **主体内容** - 分为多个章节，逐步讲解主题
3. **总结/结论** - 总结文章要点，提供进一步学习的建议

### 章节命名

为了保持一致性，建议使用以下格式命名章节 ID：

- 主章节：`section1`, `section2`, `section3` 等
- 子章节：`section1-1`, `section1-2`, `section2-1` 等

### 图片使用

添加图片时，请遵循以下最佳实践：

```html
<figure class="article-image">
    <img src="../images/your-image.jpg" alt="描述图片内容" width="600" height="400">
    <figcaption>图片说明文字</figcaption>
</figure>
```

- 使用相对路径引用图片
- 始终添加 `alt` 属性描述图片内容
- 指定图片尺寸（width 和 height）
- 添加 `figcaption` 提供额外说明

### 代码示例

添加代码示例时，使用以下格式：

```html
<pre><code class="language-javascript">// 这是一段JavaScript代码示例
function example() {
    console.log("Hello, AI world!");
    return true;
}

// 调用函数
example();</code></pre>
```

- 使用 `language-xxx` 类指定代码语言（如 `language-javascript`, `language-python` 等）
- 确保代码缩进一致，便于阅读

## 特殊元素使用

模板提供了多种特殊元素，可以增强文章的可读性和交互性：

### 信息提示框

```html
<div class="info-box">
    <div class="info-icon"><i class="fas fa-info-circle"></i></div>
    <div class="info-content">
        <p>这是一个信息提示框，可以用来强调重要信息或提供额外的说明。</p>
    </div>
</div>
```

### 技巧提示框

```html
<div class="tip-box">
    <div class="tip-icon"><i class="fas fa-lightbulb"></i></div>
    <div class="tip-content">
        <p>这是一个提示框，可以用来分享实用技巧或建议。</p>
    </div>
</div>
```

### 警告提示框

```html
<div class="warning-box">
    <div class="warning-icon"><i class="fas fa-exclamation-triangle"></i></div>
    <div class="warning-content">
        <p>这是一个警告框，可以用来提醒读者注意事项或潜在问题。</p>
    </div>
</div>
```

### 示例框

```html
<div class="example-box">
    <div class="example-header">实例演示</div>
    <div class="example-content">
        <p>这里可以展示一个完整的实例，帮助读者理解如何应用所学知识。</p>
    </div>
</div>
```

### 引用

```html
<blockquote>
    <p>这是一段引用文字，可以是名人名言或者重要观点。</p>
    <cite>— 引用来源</cite>
</blockquote>
```

### 系列文章导航

如果你的文章是系列教程的一部分，可以使用系列文章导航：

```html
<div class="article-series">
    <h3>系列文章</h3>
    <div class="series-list">
        <a href="#" class="series-item">
            <span class="series-number">1</span>
            <span class="series-title">系列文章标题一</span>
        </a>
        <a href="#" class="series-item current">
            <span class="series-number">2</span>
            <span class="series-title">当前文章标题</span>
        </a>
        <!-- 更多系列文章 -->
    </div>
</div>
```

为当前文章添加 `current` 类。

## 常见问题

### 目录不显示或不正确

确保：
- 每个章节都有唯一的 ID
- 目录链接正确指向这些 ID
- JavaScript 文件 `article.js` 已正确加载

### 图片显示问题

如果图片无法显示：
- 检查图片路径是否正确（使用相对于文章的路径）
- 确认图片文件存在且格式正确
- 验证图片文件名中没有特殊字符或空格

### 代码高亮不工作

代码高亮依赖于 Prism.js 库，它会在页面加载时自动引入。如果代码高亮不工作：
- 检查网络连接是否正常
- 确认没有 JavaScript 错误
- 验证代码块使用了正确的语言类（如 `language-javascript`）

### 响应式布局问题

如果在移动设备上显示不正确：
- 使用浏览器开发者工具测试不同屏幕尺寸
- 确保没有固定宽度的元素破坏响应式布局
- 检查媒体查询是否正确应用

---

如有任何问题或建议，请联系网站管理员。 