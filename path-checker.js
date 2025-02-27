/**
 * 路径检查工具
 * 用于检查和修复项目中的路径问题
 * 
 * 使用方法：
 * 1. 在浏览器控制台中加载此脚本
 * 2. 调用 checkPaths() 函数检查页面中的路径
 * 3. 调用 fixPaths() 函数修复页面中的路径
 */

/**
 * 检查页面中的路径
 * @returns {Object} 包含检查结果的对象
 */
function checkPaths() {
  const results = {
    scripts: [],
    images: [],
    links: [],
    total: 0,
    absolutePaths: 0
  };
  
  // 检查脚本路径
  document.querySelectorAll('script[src]').forEach(script => {
    const src = script.getAttribute('src');
    const isAbsolute = src.startsWith('/') && !src.startsWith('//');
    
    if (isAbsolute) {
      results.scripts.push({
        element: script,
        path: src,
        isAbsolute: true
      });
      results.absolutePaths++;
    }
    
    results.total++;
  });
  
  // 检查图片路径
  document.querySelectorAll('img[src], img[data-src]').forEach(img => {
    const src = img.getAttribute('src');
    const dataSrc = img.getAttribute('data-src');
    const dataWebp = img.getAttribute('data-webp');
    
    if (src && src.startsWith('/') && !src.startsWith('//')) {
      results.images.push({
        element: img,
        path: src,
        attribute: 'src',
        isAbsolute: true
      });
      results.absolutePaths++;
    }
    
    if (dataSrc && dataSrc.startsWith('/') && !dataSrc.startsWith('//')) {
      results.images.push({
        element: img,
        path: dataSrc,
        attribute: 'data-src',
        isAbsolute: true
      });
      results.absolutePaths++;
    }
    
    if (dataWebp && dataWebp.startsWith('/') && !dataWebp.startsWith('//')) {
      results.images.push({
        element: img,
        path: dataWebp,
        attribute: 'data-webp',
        isAbsolute: true
      });
      results.absolutePaths++;
    }
    
    results.total++;
  });
  
  // 检查链接路径
  document.querySelectorAll('link[href]').forEach(link => {
    const href = link.getAttribute('href');
    const isAbsolute = href.startsWith('/') && !href.startsWith('//');
    
    if (isAbsolute) {
      results.links.push({
        element: link,
        path: href,
        isAbsolute: true
      });
      results.absolutePaths++;
    }
    
    results.total++;
  });
  
  // 输出检查结果
  console.log('路径检查结果:', results);
  console.log(`共检查了 ${results.total} 个路径，其中 ${results.absolutePaths} 个是绝对路径`);
  
  return results;
}

/**
 * 修复页面中的路径
 * @returns {Object} 包含修复结果的对象
 */
function fixPaths() {
  const results = checkPaths();
  const fixed = {
    scripts: 0,
    images: 0,
    links: 0,
    total: 0
  };
  
  // 修复脚本路径
  results.scripts.forEach(item => {
    if (item.isAbsolute) {
      const newPath = item.path.substring(1); // 移除开头的斜杠
      item.element.setAttribute('src', newPath);
      fixed.scripts++;
      fixed.total++;
    }
  });
  
  // 修复图片路径
  results.images.forEach(item => {
    if (item.isAbsolute) {
      const newPath = item.path.substring(1); // 移除开头的斜杠
      item.element.setAttribute(item.attribute, newPath);
      fixed.images++;
      fixed.total++;
    }
  });
  
  // 修复链接路径
  results.links.forEach(item => {
    if (item.isAbsolute) {
      const newPath = item.path.substring(1); // 移除开头的斜杠
      item.element.setAttribute('href', newPath);
      fixed.links++;
      fixed.total++;
    }
  });
  
  // 输出修复结果
  console.log('路径修复结果:', fixed);
  console.log(`共修复了 ${fixed.total} 个路径，包括 ${fixed.scripts} 个脚本路径、${fixed.images} 个图片路径和 ${fixed.links} 个链接路径`);
  
  return fixed;
}

// 导出函数
window.pathChecker = {
  check: checkPaths,
  fix: fixPaths
}; 