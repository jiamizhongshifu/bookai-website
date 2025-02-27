/**
 * 简单的构建脚本
 * 用于压缩CSS和JavaScript文件，优化图片
 * 
 * 使用方法：
 * 1. 安装依赖：npm install terser clean-css-cli imagemin-cli
 * 2. 运行脚本：node build.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const config = {
  // 源文件目录
  srcDir: './',
  // 输出目录
  distDir: './dist',
  // 需要复制的文件和目录
  copyFiles: [
    'index.html',
    'articles',
    'images',
    'fonts',
    'manifest.json',
    'sw.js',
    'offline.html'
  ],
  // 需要压缩的JavaScript文件
  jsFiles: [
    'js/main.js',
    'js/utils.js',
    'js/carousel.js',
    'js/lazy-loading.js',
    'js/article-toc.js',
    'js/article-rating.js',
    'js/performance-monitor.js'
  ],
  // 需要压缩的CSS文件
  cssFiles: [
    'css/style.css',
    'css/article.css',
    'css/icons.css'
  ],
  // 需要优化的图片目录
  imageDir: 'images'
};

// 创建输出目录
function createDistDir() {
  console.log('创建输出目录...');
  if (fs.existsSync(config.distDir)) {
    // 清空输出目录
    fs.rmSync(config.distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(config.distDir);
  fs.mkdirSync(path.join(config.distDir, 'js'), { recursive: true });
  fs.mkdirSync(path.join(config.distDir, 'css'), { recursive: true });
}

// 复制文件和目录
function copyFiles() {
  console.log('复制文件和目录...');
  config.copyFiles.forEach(file => {
    const srcPath = path.join(config.srcDir, file);
    const distPath = path.join(config.distDir, file);
    
    if (fs.existsSync(srcPath)) {
      if (fs.lstatSync(srcPath).isDirectory()) {
        // 复制目录
        fs.mkdirSync(distPath, { recursive: true });
        copyDir(srcPath, distPath);
      } else {
        // 复制文件
        fs.copyFileSync(srcPath, distPath);
      }
    } else {
      console.warn(`文件或目录不存在: ${srcPath}`);
    }
  });
}

// 复制目录
function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  entries.forEach(entry => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// 压缩JavaScript文件
function minifyJS() {
  console.log('压缩JavaScript文件...');
  config.jsFiles.forEach(file => {
    const srcPath = path.join(config.srcDir, file);
    const distPath = path.join(config.distDir, file);
    
    if (fs.existsSync(srcPath)) {
      try {
        // 使用terser压缩JavaScript
        execSync(`npx terser ${srcPath} -o ${distPath} --compress --mangle`);
        console.log(`压缩成功: ${file}`);
      } catch (error) {
        console.error(`压缩失败: ${file}`, error.message);
        // 如果压缩失败，复制原文件
        fs.copyFileSync(srcPath, distPath);
      }
    } else {
      console.warn(`JavaScript文件不存在: ${srcPath}`);
    }
  });
}

// 压缩CSS文件
function minifyCSS() {
  console.log('压缩CSS文件...');
  config.cssFiles.forEach(file => {
    const srcPath = path.join(config.srcDir, file);
    const distPath = path.join(config.distDir, file);
    
    if (fs.existsSync(srcPath)) {
      try {
        // 使用clean-css压缩CSS
        execSync(`npx cleancss -o ${distPath} ${srcPath}`);
        console.log(`压缩成功: ${file}`);
      } catch (error) {
        console.error(`压缩失败: ${file}`, error.message);
        // 如果压缩失败，复制原文件
        fs.copyFileSync(srcPath, distPath);
      }
    } else {
      console.warn(`CSS文件不存在: ${srcPath}`);
    }
  });
}

// 优化图片
function optimizeImages() {
  console.log('优化图片...');
  const srcImageDir = path.join(config.srcDir, config.imageDir);
  const distImageDir = path.join(config.distDir, config.imageDir);
  
  if (fs.existsSync(srcImageDir)) {
    try {
      // 使用imagemin优化图片
      execSync(`npx imagemin "${srcImageDir}/**/*.{jpg,png,svg}" --out-dir="${distImageDir}"`);
      console.log('图片优化成功');
    } catch (error) {
      console.error('图片优化失败', error.message);
      // 如果优化失败，复制原图片
      if (!fs.existsSync(distImageDir)) {
        fs.mkdirSync(distImageDir, { recursive: true });
      }
      copyDir(srcImageDir, distImageDir);
    }
  } else {
    console.warn(`图片目录不存在: ${srcImageDir}`);
  }
}

// 修改HTML文件中的路径
function updateHTMLPaths() {
  console.log('更新HTML文件中的路径...');
  const htmlFiles = [
    path.join(config.distDir, 'index.html'),
    ...findFiles(path.join(config.distDir, 'articles'), '.html')
  ];
  
  htmlFiles.forEach(file => {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      
      // 移除开发工具脚本
      content = content.replace(/<script src="path-checker\.js"><\/script>/g, '');
      content = content.replace(/<script src="image-optimizer\.js"><\/script>/g, '');
      content = content.replace(/<script src="performance-monitor\.js"><\/script>/g, '');
      
      // 移除性能监控初始化代码
      content = content.replace(/\/\/ 初始化性能监控[\s\S]*?}\s*}/g, '');
      
      fs.writeFileSync(file, content, 'utf8');
      console.log(`更新成功: ${file}`);
    }
  });
}

// 查找指定扩展名的文件
function findFiles(dir, ext) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      files.push(...findFiles(fullPath, ext));
    } else if (entry.isFile() && entry.name.endsWith(ext)) {
      files.push(fullPath);
    }
  });
  
  return files;
}

// 创建package.json文件
function createPackageJSON() {
  console.log('创建package.json文件...');
  const packageJSON = {
    name: 'aixueba',
    version: '1.0.0',
    description: 'AI学霸网站 - AI工具教程与资源',
    scripts: {
      build: 'node build.js',
      serve: 'npx http-server dist -p 8000'
    },
    devDependencies: {
      'terser': '^5.16.1',
      'clean-css-cli': '^5.6.2',
      'imagemin-cli': '^7.0.0',
      'http-server': '^14.1.1'
    }
  };
  
  fs.writeFileSync(
    path.join(config.srcDir, 'package.json'),
    JSON.stringify(packageJSON, null, 2),
    'utf8'
  );
  console.log('package.json文件创建成功');
}

// 主函数
function build() {
  console.log('开始构建...');
  
  createDistDir();
  copyFiles();
  minifyJS();
  minifyCSS();
  optimizeImages();
  updateHTMLPaths();
  
  console.log('构建完成！');
  console.log(`输出目录: ${path.resolve(config.distDir)}`);
}

// 创建package.json文件
createPackageJSON();

// 执行构建
build(); 