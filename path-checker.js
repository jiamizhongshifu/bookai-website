/**
 * 路径检查工具
 * 用于检测HTML文件中的绝对路径，避免本地开发和生产环境的路径问题
 * 
 * 使用方法：
 * 1. 在HTML文件底部引入此脚本
 * 2. 工具会自动检查页面中的图片、脚本、样式表等资源路径
 * 3. 如果发现绝对路径，会在控制台中显示警告
 */

(function() {
  // 仅在开发环境中运行
  if (window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1') {
    return;
  }

  // 检查的资源类型和属性
  const resourceTypes = [
    { selector: 'img', attr: 'src' },
    { selector: 'img', attr: 'data-src' },
    { selector: 'link[rel="stylesheet"]', attr: 'href' },
    { selector: 'script', attr: 'src' },
    { selector: 'a', attr: 'href' },
    { selector: 'source', attr: 'src' },
    { selector: 'video', attr: 'src' },
    { selector: 'audio', attr: 'src' },
    { selector: 'iframe', attr: 'src' },
    { selector: 'object', attr: 'data' },
    { selector: 'embed', attr: 'src' },
    { selector: 'track', attr: 'src' },
    { selector: 'input[type="image"]', attr: 'src' },
    { selector: 'div', attr: 'style' },
    { selector: 'section', attr: 'style' },
    { selector: 'body', attr: 'style' }
  ];

  // 检查内联样式中的URL
  function checkInlineStyles(element) {
    const style = element.getAttribute('style');
    if (!style) return [];
    
    const urlMatches = style.match(/url\(['"]?([^'")]+)['"]?\)/g) || [];
    const absoluteUrls = [];
    
    urlMatches.forEach(match => {
      const url = match.replace(/url\(['"]?([^'")]+)['"]?\)/, '$1');
      if (url.startsWith('/') && !url.startsWith('//')) {
        absoluteUrls.push({
          element: element,
          attribute: 'style',
          value: url,
          suggestion: url.substring(1)
        });
      }
    });
    
    return absoluteUrls;
  }

  // 检查CSS文件中的绝对路径
  function checkCSSFiles() {
    const styleSheets = Array.from(document.styleSheets);
    const issues = [];
    
    styleSheets.forEach(sheet => {
      try {
        // 跳过跨域样式表
        if (sheet.href && new URL(sheet.href).origin !== window.location.origin) {
          return;
        }
        
        const rules = Array.from(sheet.cssRules || []);
        rules.forEach(rule => {
          if (rule.style && rule.style.cssText) {
            const urlMatches = rule.style.cssText.match(/url\(['"]?([^'")]+)['"]?\)/g) || [];
            
            urlMatches.forEach(match => {
              const url = match.replace(/url\(['"]?([^'")]+)['"]?\)/, '$1');
              if (url.startsWith('/') && !url.startsWith('//')) {
                issues.push({
                  stylesheet: sheet.href || '内联样式',
                  selector: rule.selectorText,
                  value: url,
                  suggestion: url.substring(1)
                });
              }
            });
          }
        });
      } catch (e) {
        // 跨域样式表会抛出安全错误，忽略
        console.log('无法检查样式表:', sheet.href, e.message);
      }
    });
    
    return issues;
  }

  // 主检查函数
  function checkPaths() {
    console.log('%c路径检查工具已启动', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
    
    let issues = [];
    
    // 检查HTML元素属性
    resourceTypes.forEach(type => {
      const elements = document.querySelectorAll(type.selector);
      
      elements.forEach(element => {
        if (type.attr === 'style') {
          issues = issues.concat(checkInlineStyles(element));
        } else {
          const value = element.getAttribute(type.attr);
          
          if (value && value.startsWith('/') && !value.startsWith('//')) {
            // 排除锚点链接
            if (type.attr === 'href' && value.startsWith('/#')) {
              return;
            }
            
            issues.push({
              element: element,
              attribute: type.attr,
              value: value,
              suggestion: value.substring(1)
            });
          }
        }
      });
    });
    
    // 检查CSS文件
    const cssIssues = checkCSSFiles();
    issues = issues.concat(cssIssues);
    
    // 输出结果
    if (issues.length > 0) {
      console.warn(`%c发现 ${issues.length} 个绝对路径问题`, 'color: #FF5722; font-weight: bold; font-size: 14px;');
      console.warn('在本地开发环境中，应使用相对路径而非绝对路径，以避免资源加载问题。');
      
      issues.forEach((issue, index) => {
        if (issue.element) {
          console.group(`%c问题 #${index + 1}: ${issue.element.tagName.toLowerCase()} [${issue.attribute}="${issue.value}"]`, 'color: #FF9800;');
          console.log('元素:', issue.element);
          console.log('当前值:', issue.value);
          console.log('建议修改为:', issue.suggestion);
          console.groupEnd();
        } else {
          console.group(`%c问题 #${index + 1}: CSS 文件中的绝对路径`, 'color: #FF9800;');
          console.log('样式表:', issue.stylesheet);
          console.log('选择器:', issue.selector);
          console.log('当前值:', issue.value);
          console.log('建议修改为:', issue.suggestion);
          console.groupEnd();
        }
      });
      
      console.log('%c修复建议: 将所有以 "/" 开头的路径改为相对路径', 'color: #2196F3; font-weight: bold;');
    } else {
      console.log('%c未发现路径问题，所有资源路径正确', 'color: #4CAF50;');
    }
    
    return issues;
  }

  // 页面加载完成后执行检查
  window.addEventListener('load', function() {
    // 延迟执行，确保所有资源都已加载
    setTimeout(checkPaths, 1000);
  });

  // 导出为全局函数，方便手动调用
  window.checkPaths = checkPaths;
})(); 