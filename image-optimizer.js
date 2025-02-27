/**
 * 图片优化工具
 * 用于检测和优化页面中的图片，提供WebP支持和图片懒加载
 * 
 * 使用方法：
 * 1. 在HTML文件底部引入此脚本
 * 2. 工具会自动检查页面中的图片并提供优化建议
 * 3. 可以通过控制台调用 optimizeImages() 手动优化图片
 */

(function() {
  // 仅在开发环境中运行
  if (window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1') {
    return;
  }

  // 检查浏览器是否支持WebP
  function checkWebPSupport() {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  }

  // 检查图片尺寸是否合适
  function checkImageSize(img) {
    if (!img.complete) return null;
    
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    const displayWidth = img.clientWidth;
    const displayHeight = img.clientHeight;
    
    // 如果图片尺寸是显示尺寸的2倍以上，则认为过大
    if (naturalWidth > 0 && displayWidth > 0) {
      const ratio = naturalWidth / displayWidth;
      if (ratio > 2) {
        return {
          naturalSize: { width: naturalWidth, height: naturalHeight },
          displaySize: { width: displayWidth, height: displayHeight },
          ratio: ratio,
          recommendation: `建议将图片缩小到 ${Math.ceil(naturalWidth / 2)}x${Math.ceil(naturalHeight / 2)} 像素`
        };
      }
    }
    
    return null;
  }

  // 检查图片格式
  function checkImageFormat(src) {
    const extension = src.split('.').pop().toLowerCase();
    const webpSupported = checkWebPSupport();
    
    if (webpSupported && (extension === 'jpg' || extension === 'jpeg' || extension === 'png')) {
      return {
        currentFormat: extension,
        recommendedFormat: 'webp',
        recommendation: `建议将图片转换为WebP格式，可减小约30%的文件大小`
      };
    }
    
    return null;
  }

  // 检查图片是否使用懒加载
  function checkLazyLoading(img) {
    const hasLazyLoading = img.hasAttribute('loading') || 
                          img.hasAttribute('data-src') || 
                          img.hasAttribute('data-lazy-src');
    
    if (!hasLazyLoading) {
      return {
        recommendation: `建议添加 loading="lazy" 属性或使用懒加载库`
      };
    }
    
    return null;
  }

  // 检查图片是否有alt属性
  function checkAltAttribute(img) {
    const hasAlt = img.hasAttribute('alt');
    
    if (!hasAlt) {
      return {
        recommendation: `建议添加alt属性以提高可访问性和SEO`
      };
    }
    
    return null;
  }

  // 检查图片是否有width和height属性
  function checkDimensions(img) {
    const hasWidth = img.hasAttribute('width');
    const hasHeight = img.hasAttribute('height');
    
    if (!hasWidth || !hasHeight) {
      return {
        recommendation: `建议添加width和height属性以避免布局偏移`
      };
    }
    
    return null;
  }

  // 估算图片文件大小
  function estimateImageSize(img) {
    if (!img.complete) return null;
    
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    
    if (naturalWidth === 0 || naturalHeight === 0) return null;
    
    // 根据图片格式和尺寸估算大小
    const src = img.src;
    const extension = src.split('.').pop().toLowerCase();
    let bytesPerPixel = 0;
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        bytesPerPixel = 0.25; // 假设JPEG压缩率为4:1
        break;
      case 'png':
        bytesPerPixel = 0.5; // 假设PNG压缩率为2:1
        break;
      case 'webp':
        bytesPerPixel = 0.15; // 假设WebP压缩率为6.67:1
        break;
      default:
        bytesPerPixel = 0.3; // 默认压缩率
    }
    
    const estimatedSize = naturalWidth * naturalHeight * bytesPerPixel;
    
    if (estimatedSize > 200 * 1024) { // 大于200KB
      return {
        estimatedSize: Math.round(estimatedSize / 1024),
        recommendation: `图片估计大小约为 ${Math.round(estimatedSize / 1024)} KB，建议进一步优化`
      };
    }
    
    return null;
  }

  // 主优化函数
  function optimizeImages() {
    console.log('%c图片优化工具已启动', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
    
    const images = document.querySelectorAll('img');
    const issues = [];
    
    images.forEach((img, index) => {
      const src = img.src || img.getAttribute('data-src');
      if (!src) return;
      
      const imgIssues = {
        element: img,
        src: src,
        issues: []
      };
      
      // 检查图片尺寸
      const sizeIssue = checkImageSize(img);
      if (sizeIssue) {
        imgIssues.issues.push({
          type: '图片尺寸过大',
          details: sizeIssue
        });
      }
      
      // 检查图片格式
      const formatIssue = checkImageFormat(src);
      if (formatIssue) {
        imgIssues.issues.push({
          type: '图片格式可优化',
          details: formatIssue
        });
      }
      
      // 检查懒加载
      const lazyLoadingIssue = checkLazyLoading(img);
      if (lazyLoadingIssue) {
        imgIssues.issues.push({
          type: '未使用懒加载',
          details: lazyLoadingIssue
        });
      }
      
      // 检查alt属性
      const altIssue = checkAltAttribute(img);
      if (altIssue) {
        imgIssues.issues.push({
          type: '缺少alt属性',
          details: altIssue
        });
      }
      
      // 检查width和height属性
      const dimensionsIssue = checkDimensions(img);
      if (dimensionsIssue) {
        imgIssues.issues.push({
          type: '缺少尺寸属性',
          details: dimensionsIssue
        });
      }
      
      // 估算图片大小
      const sizeEstimation = estimateImageSize(img);
      if (sizeEstimation) {
        imgIssues.issues.push({
          type: '图片文件可能过大',
          details: sizeEstimation
        });
      }
      
      if (imgIssues.issues.length > 0) {
        issues.push(imgIssues);
      }
    });
    
    // 输出结果
    if (issues.length > 0) {
      console.warn(`%c发现 ${issues.length} 个图片可以优化`, 'color: #FF5722; font-weight: bold; font-size: 14px;');
      
      issues.forEach((item, index) => {
        console.group(`%c图片 #${index + 1}: ${item.src.split('/').pop()}`, 'color: #FF9800;');
        console.log('元素:', item.element);
        console.log('路径:', item.src);
        
        item.issues.forEach(issue => {
          console.log(`%c${issue.type}:`, 'color: #F44336;', issue.details.recommendation);
        });
        
        console.groupEnd();
      });
      
      console.log('%c优化建议:', 'color: #2196F3; font-weight: bold;');
      console.log('1. 使用适当尺寸的图片，避免加载过大的图片');
      console.log('2. 将JPEG和PNG图片转换为WebP格式');
      console.log('3. 为所有图片添加懒加载');
      console.log('4. 为所有图片添加alt属性');
      console.log('5. 为所有图片添加width和height属性');
      console.log('6. 压缩大于200KB的图片');
      
      // 提供WebP转换命令
      console.log('%c转换为WebP的命令:', 'color: #2196F3;');
      console.log('npm install -g imagemin-cli imagemin-webp');
      console.log('imagemin images/*.{jpg,png} --plugin=webp --out-dir=images/webp');
    } else {
      console.log('%c所有图片已优化，未发现问题', 'color: #4CAF50;');
    }
    
    return issues;
  }

  // 添加WebP支持检测
  function addWebPSupportInfo() {
    const supported = checkWebPSupport();
    console.log(`%c浏览器${supported ? '支持' : '不支持'} WebP 格式`, `color: ${supported ? '#4CAF50' : '#F44336'};`);
    return supported;
  }

  // 页面加载完成后执行检查
  window.addEventListener('load', function() {
    // 延迟执行，确保所有图片都已加载
    setTimeout(function() {
      addWebPSupportInfo();
      optimizeImages();
    }, 1500);
  });

  // 导出为全局函数，方便手动调用
  window.optimizeImages = optimizeImages;
  window.checkWebPSupport = checkWebPSupport;
})(); 