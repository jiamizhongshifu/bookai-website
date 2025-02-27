/**
 * 工具函数库
 * 包含网站通用的工具函数
 */

/**
 * 防抖函数 - 限制函数在一定时间内只执行一次
 * @param {Function} func 要执行的函数
 * @param {number} wait 等待时间（毫秒）
 * @returns {Function} 防抖处理后的函数
 */
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * 检测浏览器是否支持WebP格式
 * @returns {Promise<boolean>} 是否支持WebP的Promise
 */
function supportsWebP() {
  return new Promise(resolve => {
    const webP = new Image();
    webP.onload = webP.onerror = function() {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * 记录错误信息
 * @param {Error} error 错误对象
 * @param {string} context 错误上下文
 */
function logError(error, context = '') {
  console.error(`[错误${context ? ' - ' + context : ''}]:`, error);
  
  // 如果有性能监控服务，可以发送错误信息
  if (window.errorTracker) {
    window.errorTracker.captureError(error, { context });
  }
  
  // 存储到本地存储以便后续分析
  try {
    const errors = JSON.parse(localStorage.getItem('site_errors') || '[]');
    errors.push({
      message: error.message,
      stack: error.stack,
      context,
      time: new Date().toISOString()
    });
    // 只保留最近的50条错误记录
    if (errors.length > 50) {
      errors.shift();
    }
    localStorage.setItem('site_errors', JSON.stringify(errors));
  } catch (e) {
    console.error('无法保存错误信息到本地存储:', e);
  }
}

/**
 * 加载脚本文件
 * @param {string} src 脚本文件路径
 * @param {boolean} async 是否异步加载
 * @returns {Promise} 加载完成的Promise
 */
function loadScript(src, async = true) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * 检测设备类型
 * @returns {Object} 设备信息对象
 */
function detectDevice() {
  const ua = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  
  return {
    isMobile,
    isIOS,
    isAndroid,
    isSafari,
    isTouch: 'ontouchstart' in window
  };
}

// 导出工具函数
window.utils = {
  debounce,
  supportsWebP,
  logError,
  loadScript,
  detectDevice
}; 