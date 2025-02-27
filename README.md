# BookAI 网站复刻

这是一个复刻 [BookAI.top](https://www.bookai.top/) 网站的项目。BookAI 是一个提供 AI 相关教程和资源的网站，包括 ChatGPT、Cursor、Deepseek 等 AI 工具的使用技巧。

## 项目结构

- `index.html` - 网站首页
- `_articles/` - 文章内容目录（Markdown格式）
  - `deepseek-tips.md` - DeepSeek使用技巧文章
  - `chatgpt-guide.md` - ChatGPT使用指南文章
- `_resources/` - 资源内容目录
- `_apps/` - 应用内容目录
- `_layouts/` - 页面布局模板
  - `article.html` - 文章页面模板
- `_data/` - 网站数据
  - `navigation.yml` - 导航菜单配置
- `css/` - 样式文件目录
  - `style.css` - 全局样式
  - `article.css` - 文章页面样式
- `js/` - JavaScript 文件目录
  - `main.js` - 主要交互功能
- `images/` - 图片资源目录
  - 自定义SVG图标
- `admin/` - Netlify CMS管理界面
  - `index.html` - CMS入口页面
  - `config.yml` - CMS配置文件

## 功能特点

- 响应式设计，适配各种设备（电脑、平板、手机）
- 简洁现代的用户界面，符合苹果设计风格
- 提供 AI 工具教程和资源链接
- 精美的自定义SVG图标
- 完整的文章页面布局
- 交互动画效果
- 深色模式支持
- 搜索功能
- 用户评论系统
- 优化的页面加载速度
- **内容管理系统**（Netlify CMS）

## 已实现页面

1. **首页** - 包含网站导航、热门教程卡片、资源推荐和作者开发的应用列表
2. **DeepSeek使用技巧** - 完整的"DeepSeek使用技巧"文章，包含目录、章节、侧边栏等
3. **ChatGPT使用指南** - 从入门到精通的ChatGPT使用指南，包含基础和高级技巧

## 如何使用

### 访问网站
1. 克隆本仓库
2. 在浏览器中打开 `index.html` 文件浏览首页
3. 点击教程卡片中的"阅读更多"链接，查看完整文章
4. 使用搜索功能查找感兴趣的内容
5. 在文章页面底部发表评论
6. 点击右上角的月亮/太阳图标切换深色/浅色模式

### 使用内容管理系统
1. 访问 `/admin` 路径进入CMS管理界面
2. 使用Netlify Identity登录
3. 在CMS中可以：
   - 创建、编辑和删除文章
   - 管理资源和应用信息
   - 配置导航菜单
   - 上传媒体文件

## 部署说明

### 本地开发
1. 安装 [Jekyll](https://jekyllrb.com/docs/installation/)
2. 克隆仓库：`git clone <仓库URL>`
3. 进入项目目录：`cd bookai`
4. 安装依赖：`bundle install`
5. 启动本地服务器：`bundle exec jekyll serve`
6. 访问 `http://localhost:4000` 查看网站

### Netlify部署
1. 在 [Netlify](https://www.netlify.com/) 创建账号
2. 点击"New site from Git"
3. 选择GitHub并授权访问
4. 选择本仓库
5. 构建设置已在 `netlify.toml` 中配置
6. 点击"Deploy site"
7. 在Netlify后台启用Identity服务
8. 配置Git Gateway

## 技术栈

- HTML5
- CSS3 (Flexbox, Grid, 变量, 媒体查询)
- JavaScript (原生JS)
- SVG (自定义图标)
- LocalStorage (用于保存评论和主题偏好)
- Jekyll (静态站点生成器)
- Netlify CMS (内容管理系统)

## 性能优化

- 使用预加载关键资源
- 延迟加载非关键JavaScript
- 优化图像（使用SVG）
- CSS变量实现主题切换
- 响应式图像

## 未来改进方向

1. 添加更多文章页面
2. 实现后端数据库存储评论
3. 添加用户账户系统
4. 实现文章分类和标签系统
5. 添加相关文章推荐算法 