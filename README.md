# AI学霸网站

AI学霸是一个专注于AI工具教程与资源的网站，帮助用户快速掌握各种AI工具的使用方法，提高学习和工作效率。

## 项目特点

- 🚀 快速加载 - 优化的前端性能
- 📱 响应式设计 - 适配各种设备
- 🔍 SEO友好 - 结构化数据和优化的元标签
- 📖 丰富的教程 - 涵盖各种AI工具的使用指南
- 🛠️ 离线支持 - 通过Service Worker实现
- 🌙 暗色模式 - 保护用户眼睛

## 技术栈

- 纯HTML/CSS/JavaScript构建
- 无框架依赖，轻量级实现
- 使用Service Worker实现离线功能
- 懒加载图片和资源

## 开发环境设置

### 前提条件

- Node.js (推荐v14或更高版本)
- npm (通常随Node.js一起安装)

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/jiamizhongshifu/bookai-website.git
cd bookai-website
```

2. 安装依赖
```bash
npm install
```

3. 启动本地服务器
```bash
python -m http.server 8000
```
或者使用批处理文件：
```bash
start-server.bat
```

4. 在浏览器中访问 http://localhost:8000

## 构建生产版本

1. 运行构建脚本
```bash
node build.js
```

2. 构建后的文件将位于 `dist` 目录中

## 项目结构

```
bookai-website/
├── css/                # 样式文件
├── js/                 # JavaScript文件
├── images/             # 图片资源
├── articles/           # 文章内容
├── fonts/              # 字体文件
├── index.html          # 主页
├── sw.js               # Service Worker
├── manifest.json       # Web App清单
├── offline.html        # 离线页面
├── build.js            # 构建脚本
├── path-checker.js     # 路径检查工具
├── image-optimizer.js  # 图片优化工具
├── performance-monitor.js # 性能监控工具
└── README.md           # 项目说明
```

## 开发指南

### 添加新文章

1. 在 `articles` 目录下创建新的HTML文件
2. 使用现有文章作为模板
3. 更新 `index.html` 中的文章列表

### 修改样式

- 主要样式在 `css/style.css` 文件中
- 文章页面样式在 `css/article.css` 文件中

### 添加新功能

1. 在 `js` 目录下创建新的JavaScript文件
2. 在 `index.html` 中引入新文件
3. 确保遵循现有的代码风格和最佳实践

## 贡献指南

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 LICENSE 文件 