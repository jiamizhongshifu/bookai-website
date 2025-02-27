/**
 * 图像转WebP格式转换脚本
 * 
 * 此脚本用于将网站中的JPG、JPEG和PNG图像转换为WebP格式
 * 需要安装sharp库: npm install sharp
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 需要扫描的目录
const directories = ['images', '_site/images'];

// 支持的图像格式
const supportedFormats = ['.jpg', '.jpeg', '.png'];

// 转换选项
const webpOptions = {
  quality: 80, // WebP质量，0-100
  lossless: false, // 是否无损压缩
};

/**
 * 递归扫描目录并转换图像
 * @param {string} directory 要扫描的目录
 */
async function processDirectory(directory) {
  try {
    // 确保目录存在
    if (!fs.existsSync(directory)) {
      console.log(`目录不存在: ${directory}`);
      return;
    }

    const files = fs.readdirSync(directory);
    
    for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // 递归处理子目录
        await processDirectory(filePath);
      } else {
        // 处理文件
        const ext = path.extname(file).toLowerCase();
        if (supportedFormats.includes(ext)) {
          await convertToWebP(filePath);
        }
      }
    }
  } catch (error) {
    console.error(`处理目录时出错 ${directory}:`, error);
  }
}

/**
 * 将图像转换为WebP格式
 * @param {string} filePath 图像文件路径
 */
async function convertToWebP(filePath) {
  try {
    const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    // 检查WebP文件是否已存在且比原始文件新
    if (fs.existsSync(webpPath)) {
      const originalStat = fs.statSync(filePath);
      const webpStat = fs.statSync(webpPath);
      
      // 如果WebP文件比原始文件新，则跳过
      if (webpStat.mtime > originalStat.mtime) {
        console.log(`跳过 ${filePath} (WebP已是最新)`);
        return;
      }
    }
    
    // 转换图像
    await sharp(filePath)
      .webp(webpOptions)
      .toFile(webpPath);
    
    console.log(`已转换: ${filePath} -> ${webpPath}`);
  } catch (error) {
    console.error(`转换文件时出错 ${filePath}:`, error);
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('开始转换图像为WebP格式...');
  
  for (const directory of directories) {
    console.log(`处理目录: ${directory}`);
    await processDirectory(directory);
  }
  
  console.log('转换完成!');
}

// 执行主函数
main().catch(error => {
  console.error('程序执行出错:', error);
  process.exit(1);
}); 