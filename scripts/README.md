# 脚本工具使用指南

本目录包含了网站维护和内容管理所需的各种脚本工具。

## 目录结构

```
scripts/
├── md-to-html.js           # Markdown转HTML工具
├── render-templates.js      # Nunjucks模板渲染工具
├── markdown-config.js       # Markdown-it配置工具
├── convert-articles.bat     # Windows批处理文件
├── convert-articles.sh      # Linux/macOS shell脚本
└── README.md               # 本文档
```

## 工具说明

### Markdown转HTML工具 (md-to-html.js)

这个工具用于将Markdown文件转换为HTML文件，并提取元数据。

#### 功能特点

- 遍历`/articles`目录查找所有`.md`文件
- 提取文章元数据（标题、摘要、分类、标签等）
- 将Markdown转换为HTML
- 使用Nunjucks模板渲染HTML文件
- 按照`/{category}/{slug}.html`的结构输出文件

#### 使用方法

```bash
# 直接使用Node.js
node scripts/md-to-html.js

# 使用npm脚本
npm run convert-articles

# 使用批处理文件（Windows）
scripts/convert-articles.bat

# 使用shell脚本（Linux/macOS）
./scripts/convert-articles.sh
```

#### 注意事项

- 需要安装Node.js环境
- 元数据提取不需要标准Front Matter格式
- 从文件名生成slug，从内容关键词判断分类
- 如果HTML文件已存在，将被覆盖

### Markdown-it配置工具 (markdown-config.js)

这个工具用于配置markdown-it及其插件，实现高级Markdown渲染功能。

#### 功能特点

- 自动添加锚点标题（h2-h6）
- 代码块语法高亮（集成highlight.js）
- 图片懒加载（替换`<img>`为`<img loading="lazy">`）
- 自动生成文章目录树（嵌套ul结构）

#### 使用方法

```javascript
// 在其他脚本中引入
const { 
  createMarkdownIt, 
  renderMarkdown, 
  generateTOC, 
  extractHeadings, 
  generateNestedTOC 
} = require('./markdown-config');

// 创建markdown-it实例
const md = createMarkdownIt();

// 渲染Markdown为HTML
const html = renderMarkdown(content, true); // 第二个参数为是否包含目录

// 生成目录HTML
const tocHtml = generateTOC(content);

// 提取标题结构
const headings = extractHeadings(content);

// 生成嵌套目录结构
const nestedTOC = generateNestedTOC(headings);
```

#### 配置选项

markdown-it实例配置了以下选项：

- `html: true` - 启用HTML标签
- `xhtmlOut: true` - 使用'/'闭合单标签
- `breaks: false` - 不将换行符转换为`<br>`
- `linkify: true` - 自动将URL转换为链接
- `typographer: true` - 启用语言中立的替换和引号美化
- `highlight` - 使用highlight.js进行代码高亮

### Nunjucks模板渲染工具 (render-templates.js)

这个工具用于使用Nunjucks模板引擎渲染HTML文件。

#### 功能特点

- 使用Nunjucks模板引擎渲染HTML文件
- 支持从Markdown文件生成文章HTML
- 自动提取文章目录结构
- 生成相关文章推荐
- 查找热门文章
- 收集所有标签
- 查找上一篇和下一篇文章

#### 使用方法

```bash
# 直接使用Node.js
node scripts/render-templates.js

# 使用npm脚本
npm run render-templates
```

#### 注意事项

- 需要安装Nunjucks和Markdown-it依赖
- 需要在`templates`目录下有相应的模板文件
- 渲染结果将按照`/{category}/{slug}.html`的结构输出

### 批处理文件 (convert-articles.bat)

Windows环境下的批处理文件，用于执行Markdown转HTML和模板渲染工具。

#### 功能特点

- 检查Node.js是否安装
- 检查依赖包是否安装
- 执行Markdown转HTML工具
- 执行模板渲染工具

#### 使用方法

双击`scripts/convert-articles.bat`文件或在命令行中运行：

```bash
scripts/convert-articles.bat
```

### Shell脚本 (convert-articles.sh)

Linux/macOS环境下的shell脚本，用于执行Markdown转HTML和模板渲染工具。

#### 功能特点

- 检查Node.js是否安装
- 检查依赖包是否安装
- 执行Markdown转HTML工具
- 执行模板渲染工具

#### 使用方法

```bash
# 添加执行权限
chmod +x scripts/convert-articles.sh

# 执行脚本
./scripts/convert-articles.sh
```

## 工作流程

1. 在`articles`目录下创建Markdown文件
2. 运行转换工具（`convert-articles.bat`或`convert-articles.sh`）
3. 工具会自动：
   - 提取文章元数据
   - 将Markdown转换为HTML
   - 使用Nunjucks模板渲染文章页面
   - 按照`/{category}/{slug}.html`的结构输出文件

## 未来计划

- 添加自动生成索引页面功能
- 添加自动生成站点地图功能
- 添加自动生成RSS订阅功能
- 添加增量更新功能，只处理修改过的文件
- 添加图片优化和压缩功能
- 添加自动部署功能 