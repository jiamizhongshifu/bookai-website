# Nunjucks模板系统使用指南

## 简介

本项目使用Nunjucks作为模板引擎，实现了模板继承和复用，使网站维护更加高效。Nunjucks是Mozilla开发的一个功能丰富的模板引擎，类似于Jinja2（Python）和Twig（PHP）。

## 目录结构

```
templates/
├── base.html          # 基础模板，包含共享的头部、导航和底部
├── article-detail.html # 文章详情页模板，继承自base.html
└── README.md          # 本文档
```

## 模板说明

### base.html

基础模板定义了网站的整体结构，包括：

- `<head>` 部分：包含元数据、CSS引用和基本JavaScript
- 网站头部：包含logo、导航菜单和搜索框
- 主内容区域：使用 `{% block content %}{% endblock %}` 定义，允许子模板替换
- 网站底部：包含版权信息、链接和社交媒体图标

#### 可用的块（Blocks）

base.html 定义了以下可在子模板中替换的块：

- `{% block title %}{% endblock %}` - 页面标题
- `{% block meta %}{% endblock %}` - 额外的元数据标签
- `{% block og_tags %}{% endblock %}` - Open Graph 标签
- `{% block twitter_tags %}{% endblock %}` - Twitter Card 标签
- `{% block content %}{% endblock %}` - 主内容区域
- `{% block breadcrumb %}{% endblock %}` - 面包屑导航
- `{% block author_name %}{% endblock %}` - 作者名称
- `{% block current_year %}{% endblock %}` - 当前年份
- `{% block extra_js %}{% endblock %}` - 额外的JavaScript代码

### article-detail.html

文章详情页模板，继承自base.html，用于显示从Markdown转换的文章内容：

- 替换了base.html中定义的所有块
- 添加了文章特有的元素：标题、作者信息、发布日期、阅读时间等
- 实现了文章内容的结构化布局
- 添加了分享选项、上一篇/下一篇导航、相关文章等功能
- 侧边栏包含目录、作者信息、热门文章和标签云

## 使用方法

### 渲染模板

使用 `scripts/render-templates.js` 脚本渲染模板：

```bash
# 使用npm脚本
npm run render-templates

# 或直接使用Node.js
node scripts/render-templates.js
```

### 模板变量

在渲染article-detail.html时，需要提供以下变量：

- `article` - 文章对象，包含以下属性：
  - `title` - 文章标题
  - `date` - 发布日期
  - `author` - 作者名称
  - `category` - 分类
  - `tags` - 标签数组
  - `summary` - 摘要
  - `content` - HTML格式的文章内容
  - `views` - 阅读量
  - `read_time` - 阅读时间
  - `slug` - URL友好的文章标识符
  - `toc` - 目录结构数组
  - `url` - 完整的文章URL
- `related_articles` - 相关文章数组
- `popular_articles` - 热门文章数组
- `all_tags` - 所有标签数组
- `prev_article` - 上一篇文章对象（可为null）
- `next_article` - 下一篇文章对象（可为null）
- `current_year` - 当前年份

### 自定义过滤器

模板系统定义了以下自定义过滤器：

- `urlencode` - URL编码字符串：`{{ article.title | urlencode }}`

## 扩展模板系统

### 添加新模板

1. 在templates目录下创建新的.html文件
2. 使用 `{% extends "base.html" %}` 继承基础模板
3. 使用 `{% block content %}...{% endblock %}` 替换内容区域
4. 根据需要替换其他块

### 添加新的过滤器或函数

在 `scripts/render-templates.js` 中添加：

```javascript
// 添加自定义过滤器
env.addFilter('filterName', function(str, arg1, arg2) {
  // 过滤器逻辑
  return result;
});

// 添加全局函数
env.addGlobal('functionName', function(arg1, arg2) {
  // 函数逻辑
  return result;
});
```

## 最佳实践

1. 保持模板文件结构清晰，避免过度嵌套
2. 使用注释 `{# 这是注释 #}` 说明复杂的模板逻辑
3. 对于重复使用的模板片段，使用 `{% include "fragment.html" %}` 引入
4. 对于条件性显示的内容，使用 `{% if condition %}...{% endif %}`
5. 对于循环内容，使用 `{% for item in items %}...{% endfor %}`

## 总结与未来计划

### 已完成功能

- ✅ 基础模板（base.html）实现，包含共享的头部、导航和底部
- ✅ 文章详情页模板（article-detail.html）实现，继承自base.html
- ✅ Markdown转HTML工具集成，支持从Markdown文件生成文章页面
- ✅ 模板渲染脚本实现，支持批量渲染所有文章
- ✅ 相关文章、热门文章和标签云功能实现
- ✅ 文章目录自动生成功能
- ✅ 上一篇/下一篇文章导航功能

### 未来计划

- 🔲 添加分类页面模板，显示特定分类下的所有文章
- 🔲 添加标签页面模板，显示特定标签下的所有文章
- 🔲 添加搜索结果页面模板，显示搜索结果
- 🔲 添加作者页面模板，显示作者信息和文章列表
- 🔲 添加归档页面模板，按时间线显示所有文章
- 🔲 添加首页模板，替代当前的静态首页
- 🔲 添加更多自定义过滤器，如日期格式化、文本截断等
- 🔲 添加部分渲染功能，只渲染修改过的文章
- 🔲 添加缓存机制，提高渲染性能

## 参考资料

- [Nunjucks官方文档](https://mozilla.github.io/nunjucks/)
- [Nunjucks模板语法](https://mozilla.github.io/nunjucks/templating.html)

## Markdown渲染功能

本项目使用markdown-it及其插件来增强Markdown渲染功能，主要特性包括：

1. **代码高亮**：使用highlight.js实现代码语法高亮，支持多种编程语言
2. **自动锚点链接**：为标题自动生成锚点链接，方便引用和导航
3. **目录生成**：自动生成文章目录(TOC)，支持多级嵌套
4. **图片懒加载**：优化页面加载性能，图片在进入视口时才加载
5. **表格样式**：美化表格显示，支持表头、边框和交替行颜色
6. **引用样式**：增强引用块的视觉效果

### 使用方法

在Markdown文件中，可以使用以下特性：

#### 目录生成

在Markdown文件中添加以下标记来生成目录：

```markdown
[[toc]]
```

#### 代码高亮

使用标准的Markdown代码块语法，并指定语言：

```markdown
​```javascript
const hello = 'world';
console.log(hello);
​```
```

#### 自动锚点

所有的标题（h1-h4）会自动生成锚点链接，可以通过点击标题旁边的 `#` 符号跳转。

### 测试Markdown渲染

可以使用以下命令测试Markdown渲染效果：

```bash
npm run test-markdown
```

这将处理`articles/test-markdown-it.md`文件并生成HTML预览。 