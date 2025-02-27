# 爱学霸网站

这是一个专注于AI学习和应用的教程平台，帮助用户掌握人工智能技术。网站提供了丰富的AI工具教程、资源和应用推荐，包括ChatGPT、Cursor、Deepseek等AI工具的使用技巧。

## 项目结构

- `index.html` - 网站首页
- `articles/` - 文章内容目录
  - `deepseek-tips.html` - DeepSeek使用技巧文章
  - `chatgpt-guide.html` - ChatGPT使用指南文章
- `css/` - 样式文件目录
  - `style.css` - 全局样式
  - `article.css` - 文章页面样式
- `js/` - JavaScript 文件目录
  - `main.js` - 主入口文件，负责加载和初始化各个模块
  - `utils.js` - 工具函数库
  - `carousel.js` - 轮播图模块
  - `lazy-loading.js` - 图片懒加载模块
  - `performance-monitor.js` - 性能监控模块
- `images/` - 图片资源目录
  - `icons/` - 图标资源
  - `placeholder.svg` - 图片加载失败占位图
- `sw.js` - Service Worker文件，用于离线缓存
- `manifest.json` - Web App Manifest文件，支持PWA功能
- `offline.html` - 离线页面
- `convert-to-webp.js` - WebP图片转换脚本

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
- PWA支持，实现离线访问

## 已实现页面

1. **首页** - 包含网站导航、热门教程卡片、资源推荐和作者开发的应用列表
2. **DeepSeek使用技巧** - 完整的"DeepSeek使用技巧"文章，包含目录、章节、侧边栏等
3. **ChatGPT使用指南** - 从入门到精通的ChatGPT使用指南，包含基础和高级技巧

## 如何使用

### 访问网站
1. 克隆本仓库
2. 安装依赖：`npm install`
3. 转换图片为WebP格式（可选）：`npm run convert-webp`
4. 在浏览器中打开 `index.html` 文件浏览首页
5. 点击教程卡片中的"阅读更多"链接，查看完整文章
6. 使用搜索功能查找感兴趣的内容
7. 在文章页面底部发表评论
8. 点击右上角的月亮/太阳图标切换深色/浅色模式

## 本地服务器使用说明

为了解决图片路径问题并方便本地预览，我们提供了一个简单的本地服务器启动脚本：

### 使用Python启动本地服务器

1. 双击项目根目录下的 `start-server.bat` 文件
2. 服务器将在 http://localhost:8000 启动
3. 在浏览器中访问 http://localhost:8000 即可预览网站

### 路径说明

- 本地开发时，请使用相对路径（如 `images/logo.svg`）而非绝对路径（如 `/images/logo.svg`）
- 相对路径可以确保在本地服务器和生产环境中都能正确加载资源

### 常见问题

- 如果图片无法加载，请检查路径是否正确（使用相对路径）
- 如果服务器无法启动，请确保已安装Python（本项目使用Python的内置HTTP服务器）

## 部署说明

### 本地开发
1. 克隆仓库：`git clone <仓库URL>`
2. 进入项目目录：`cd aixueba`
3. 安装依赖：`npm install`
4. 启动本地服务器：`npm run serve`
5. 访问 `http://localhost:3000` 查看网站

### 生产部署
1. 构建项目：`npm run build`
2. 将 `_site` 目录中的文件部署到您的Web服务器
3. 确保服务器配置正确的MIME类型，特别是WebP图片格式

## 技术栈

- HTML5
- CSS3 (Flexbox, Grid, 变量, 媒体查询)
- JavaScript (ES6+, 模块化)
- SVG (自定义图标)
- LocalStorage (用于保存评论和主题偏好)
- Service Worker (离线缓存)
- PWA (渐进式Web应用)

## 性能优化

网站采用了多种性能优化策略，确保在各种网络环境和设备上都能提供良好的用户体验：

### 代码模块化

网站采用了模块化的代码结构，提高了代码的可维护性和性能：

1. **核心模块分离**：将主要功能拆分为独立模块，按需加载
   - `utils.js` - 通用工具函数库
   - `carousel.js` - 轮播图模块
   - `lazy-loading.js` - 图片懒加载模块
   - `performance-monitor.js` - 性能监控模块

2. **按需加载**：根据页面类型动态加载所需模块，减少不必要的资源加载
   - 首页加载轮播图模块
   - 文章页加载目录和评分模块

3. **延迟加载**：非关键功能延迟加载，优先加载核心内容
   - Service Worker注册延迟3秒
   - 性能监控模块在核心内容加载完成后初始化

### 图片优化

网站使用了多种图片优化技术：

1. **WebP格式支持**：自动检测浏览器支持并提供WebP格式图片，减少约30%的图片大小
2. **懒加载技术**：图片仅在滚动到视口附近时才加载，减少初始加载时间
3. **占位图**：使用轻量级SVG占位图，提升用户体验
4. **错误处理**：图片加载失败时自动使用占位图替代
5. **批量转换工具**：提供`convert-to-webp.js`脚本，自动将JPG/PNG图片转换为WebP格式

### 离线支持与缓存策略

网站实现了完整的PWA功能，支持离线访问：

1. **Service Worker**：实现资源缓存和离线访问
   - 静态资源缓存优先策略
   - HTML页面网络优先策略
   - 图片和字体资源缓存优先策略

2. **离线页面**：网络不可用时显示友好的离线页面
   - 显示已缓存的可访问内容
   - 提供重新连接选项

3. **Web App Manifest**：支持添加到主屏幕
   - 自定义图标和启动画面
   - 全屏显示模式

### 错误处理

网站实现了全面的错误处理机制：

1. **全局错误捕获**：捕获并记录JavaScript运行时错误
2. **资源加载失败处理**：图片、字体等资源加载失败时提供替代方案
3. **功能降级**：核心功能（如轮播图）失败时提供静态替代方案
4. **错误日志**：记录错误信息便于调试

### 性能监控

网站集成了性能监控模块，收集和分析用户体验数据：

1. **核心Web指标**：监控LCP、FID、CLS等关键性能指标
2. **资源加载性能**：跟踪关键资源的加载时间
3. **用户交互**：记录用户点击和页面浏览行为
4. **错误跟踪**：捕获并上报JavaScript错误
5. **采样策略**：使用采样率控制数据收集量

## 未来改进方向

1. **代码分割与懒加载**：进一步优化JavaScript代码，实现更细粒度的代码分割
2. **资源压缩**：实现CSS和JavaScript的压缩流程，减小文件体积
3. **图像优化**：添加响应式图像和自动尺寸调整功能
4. **缓存策略**：完善Service Worker缓存策略，实现更智能的资源更新
5. **性能监控**：扩展性能监控功能，收集更多用户体验数据
6. **后端集成**：添加后端API支持，实现评论、用户账户等功能
7. **内容管理系统**：集成CMS，方便内容更新和管理 