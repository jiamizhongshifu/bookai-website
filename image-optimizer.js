/**
 * 图片优化工具
 * 用于检查和优化项目中的图片
 * 
 * 使用方法：
 * 1. 在浏览器控制台中加载此脚本
 * 2. 调用 checkImages() 函数检查页面中的图片
 * 3. 调用 optimizeImages() 函数优化页面中的图片
 */

/**
 * 检查页面中的图片
 * @returns {Object} 包含检查结果的对象
 */
function checkImages() {
  const results = {
    total: 0,
    withoutAlt: 0,
    withoutLazyLoading: 0,
    withoutWebP: 0,
    tooLarge: 0,
    images: []
  };
  
  // 检查所有图片
  document.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src') || img.getAttribute('data-src') || '';
    const alt = img.getAttribute('alt') || '';
    const width = img.naturalWidth || 0;
    const height = img.naturalHeight || 0;
    const hasLazyLoading = img.hasAttribute('loading') || img.hasAttribute('data-src');
    const hasWebP = img.hasAttribute('data-webp');
    
    const imageInfo = {
      element: img,
      src: src,
      alt: alt,
      width: width,
      height: height,
      hasLazyLoading: hasLazyLoading,
      hasWebP: hasWebP,
      issues: []
    };
    
    // 检查alt属性
    if (!alt) {
      imageInfo.issues.push('缺少alt属性');
      results.withoutAlt++;
    }
    
    // 检查懒加载
    if (!hasLazyLoading) {
      imageInfo.issues.push('未使用懒加载');
      results.withoutLazyLoading++;
    }
    
    // 检查WebP支持
    if (!hasWebP && (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png'))) {
      imageInfo.issues.push('未提供WebP版本');
      results.withoutWebP++;
    }
    
    // 检查图片尺寸（如果可用）
    if (width > 1200 || height > 1200) {
      imageInfo.issues.push('图片尺寸过大');
      results.tooLarge++;
    }
    
    results.images.push(imageInfo);
    results.total++;
  });
  
  // 输出检查结果
  console.log('图片检查结果:', results);
  console.log(`共检查了 ${results.total} 张图片，其中 ${results.withoutAlt} 张缺少alt属性，${results.withoutLazyLoading} 张未使用懒加载，${results.withoutWebP} 张未提供WebP版本，${results.tooLarge} 张尺寸过大`);
  
  return results;
}

/**
 * 优化页面中的图片
 * @returns {Object} 包含优化结果的对象
 */
function optimizeImages() {
  const results = checkImages();
  const optimized = {
    addedAlt: 0,
    addedLazyLoading: 0,
    total: 0
  };
  
  // 优化图片
  results.images.forEach(imageInfo => {
    const img = imageInfo.element;
    
    // 添加alt属性
    if (!img.getAttribute('alt')) {
      // 从文件名或上下文中提取可能的alt文本
      let altText = '';
      const src = img.getAttribute('src') || img.getAttribute('data-src') || '';
      if (src) {
        // 从文件名中提取可能的描述
        const fileName = src.split('/').pop().split('.')[0];
        altText = fileName.replace(/[-_]/g, ' ');
        
        // 首字母大写
        altText = altText.charAt(0).toUpperCase() + altText.slice(1);
      }
      
      img.setAttribute('alt', altText || '图片');
      optimized.addedAlt++;
      optimized.total++;
    }
    
    // 添加懒加载
    if (!img.hasAttribute('loading') && !img.hasAttribute('data-src')) {
      img.setAttribute('loading', 'lazy');
      optimized.addedLazyLoading++;
      optimized.total++;
    }
  });
  
  // 输出优化结果
  console.log('图片优化结果:', optimized);
  console.log(`共优化了 ${optimized.total} 张图片，其中为 ${optimized.addedAlt} 张添加了alt属性，为 ${optimized.addedLazyLoading} 张添加了懒加载`);
  
  return optimized;
}

/**
 * 生成WebP转换脚本
 * 输出一个可以批量转换图片为WebP格式的脚本
 */
function generateWebPScript() {
  const results = checkImages();
  const imagesToConvert = [];
  
  results.images.forEach(imageInfo => {
    const src = imageInfo.src;
    if (!imageInfo.hasWebP && (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png'))) {
      imagesToConvert.push(src);
    }
  });
  
  if (imagesToConvert.length === 0) {
    console.log('没有需要转换为WebP格式的图片');
    return;
  }
  
  // 生成Node.js脚本
  const script = `
/**
 * WebP转换脚本
 * 将JPG/PNG图片转换为WebP格式
 * 
 * 使用方法：
 * 1. 安装依赖：npm install sharp
 * 2. 运行脚本：node convert-to-webp.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 需要转换的图片
const imagesToConvert = ${JSON.stringify(imagesToConvert, null, 2)};

// 转换图片
async function convertToWebP() {
  for (const imagePath of imagesToConvert) {
    try {
      // 构建输入和输出路径
      const inputPath = path.join(__dirname, imagePath);
      const outputPath = inputPath.replace(/\\.(jpg|jpeg|png)$/i, '.webp');
      
      // 检查输入文件是否存在
      if (!fs.existsSync(inputPath)) {
        console.error(\`文件不存在: \${inputPath}\`);
        continue;
      }
      
      // 转换为WebP
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);
      
      console.log(\`已转换: \${imagePath} -> \${outputPath}\`);
    } catch (error) {
      console.error(\`转换失败: \${imagePath}\`, error);
    }
  }
  
  console.log('转换完成');
}

convertToWebP();
`;
  
  console.log('WebP转换脚本:');
  console.log(script);
  
  // 如果在浏览器环境中，创建一个可下载的链接
  if (typeof document !== 'undefined') {
    const blob = new Blob([script], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'convert-to-webp.js';
    link.textContent = '下载WebP转换脚本';
    link.style.display = 'block';
    link.style.margin = '10px 0';
    
    document.body.appendChild(link);
    
    console.log('已创建下载链接，点击可下载WebP转换脚本');
  }
}

// 导出函数
window.imageOptimizer = {
  check: checkImages,
  optimize: optimizeImages,
  generateWebPScript: generateWebPScript
}; 