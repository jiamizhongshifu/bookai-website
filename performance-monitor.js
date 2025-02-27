/**
 * 性能监控工具
 * 用于监控网站的性能指标
 * 
 * 使用方法：
 * 1. 在页面中引入此脚本
 * 2. 调用 initPerformanceMonitor() 函数初始化性能监控
 */

/**
 * 初始化性能监控
 * @param {Object} options 配置选项
 */
function initPerformanceMonitor(options = {}) {
  const config = {
    // 是否启用性能监控
    enabled: true,
    // 采样率（0-1之间的数字，表示监控的概率）
    samplingRate: 0.1,
    // 是否记录核心Web指标
    recordCoreWebVitals: true,
    // 是否记录资源加载性能
    recordResourceTiming: true,
    // 是否记录用户交互
    recordUserInteraction: true,
    // 是否记录JavaScript错误
    recordErrors: true,
    // 是否在控制台输出性能数据
    logToConsole: true,
    // 自定义上报接口
    reportUrl: '',
    ...options
  };
  
  // 如果未启用或未通过采样，则不执行监控
  if (!config.enabled || Math.random() > config.samplingRate) {
    console.log('性能监控未启用或未通过采样');
    return;
  }
  
  // 性能数据
  const performanceData = {
    // 页面信息
    page: {
      url: window.location.href,
      referrer: document.referrer,
      title: document.title
    },
    // 用户代理信息
    userAgent: navigator.userAgent,
    // 设备信息
    device: {
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      pixelRatio: window.devicePixelRatio || 1
    },
    // 网络信息
    network: getNetworkInfo(),
    // 核心Web指标
    coreWebVitals: {},
    // 资源加载性能
    resources: [],
    // 用户交互
    interactions: [],
    // JavaScript错误
    errors: []
  };
  
  // 获取网络信息
  function getNetworkInfo() {
    const connection = navigator.connection || 
                      navigator.mozConnection || 
                      navigator.webkitConnection;
    
    if (connection) {
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    
    return {};
  }
  
  // 记录核心Web指标
  if (config.recordCoreWebVitals) {
    // 记录FCP (First Contentful Paint)
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const fcp = entries[0];
        performanceData.coreWebVitals.fcp = {
          value: fcp.startTime,
          rating: getFCPRating(fcp.startTime)
        };
        
        if (config.logToConsole) {
          console.log('FCP:', fcp.startTime, 'ms', getFCPRating(fcp.startTime));
        }
      }
    });
    
    try {
      fcpObserver.observe({ type: 'paint', buffered: true });
    } catch (e) {
      console.error('FCP监控失败:', e);
    }
    
    // 记录LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      performanceData.coreWebVitals.lcp = {
        value: lastEntry.startTime,
        rating: getLCPRating(lastEntry.startTime)
      };
      
      if (config.logToConsole) {
        console.log('LCP:', lastEntry.startTime, 'ms', getLCPRating(lastEntry.startTime));
      }
    });
    
    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.error('LCP监控失败:', e);
    }
    
    // 记录CLS (Cumulative Layout Shift)
    let clsValue = 0;
    let clsEntries = [];
    
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        // 只有不是由用户交互引起的布局偏移才计入CLS
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      }
      
      performanceData.coreWebVitals.cls = {
        value: clsValue,
        rating: getCLSRating(clsValue)
      };
      
      if (config.logToConsole) {
        console.log('CLS:', clsValue, getCLSRating(clsValue));
      }
    });
    
    try {
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.error('CLS监控失败:', e);
    }
    
    // 记录FID (First Input Delay)
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const firstInput = entries[0];
        const inputDelay = firstInput.processingStart - firstInput.startTime;
        
        performanceData.coreWebVitals.fid = {
          value: inputDelay,
          rating: getFIDRating(inputDelay)
        };
        
        if (config.logToConsole) {
          console.log('FID:', inputDelay, 'ms', getFIDRating(inputDelay));
        }
      }
    });
    
    try {
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.error('FID监控失败:', e);
    }
  }
  
  // 记录资源加载性能
  if (config.recordResourceTiming) {
    const resourceObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      
      entries.forEach(entry => {
        // 过滤掉不需要的资源类型
        if (entry.initiatorType === 'fetch' || 
            entry.initiatorType === 'xmlhttprequest' || 
            entry.initiatorType === 'img' || 
            entry.initiatorType === 'script' || 
            entry.initiatorType === 'link') {
          
          performanceData.resources.push({
            name: entry.name,
            type: entry.initiatorType,
            startTime: entry.startTime,
            duration: entry.duration,
            transferSize: entry.transferSize,
            decodedBodySize: entry.decodedBodySize
          });
        }
      });
    });
    
    try {
      resourceObserver.observe({ type: 'resource', buffered: true });
    } catch (e) {
      console.error('资源加载性能监控失败:', e);
    }
  }
  
  // 记录用户交互
  if (config.recordUserInteraction) {
    // 记录点击事件
    document.addEventListener('click', (event) => {
      const target = event.target;
      const tagName = target.tagName.toLowerCase();
      const id = target.id;
      const className = target.className;
      const text = target.textContent?.substring(0, 50);
      
      performanceData.interactions.push({
        type: 'click',
        tagName,
        id,
        className,
        text,
        timestamp: Date.now()
      });
    });
    
    // 记录页面浏览时长
    let pageLoadTime = Date.now();
    let pageVisibleTime = 0;
    let isPageVisible = true;
    
    // 页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        isPageVisible = false;
        pageVisibleTime += Date.now() - pageLoadTime;
      } else {
        isPageVisible = true;
        pageLoadTime = Date.now();
      }
    });
    
    // 页面卸载前记录总浏览时长
    window.addEventListener('beforeunload', () => {
      if (isPageVisible) {
        pageVisibleTime += Date.now() - pageLoadTime;
      }
      
      performanceData.pageVisibleTime = pageVisibleTime;
      
      // 如果配置了上报接口，则上报数据
      if (config.reportUrl) {
        // 使用sendBeacon API上报数据，这样即使页面关闭也能保证数据发送
        navigator.sendBeacon(config.reportUrl, JSON.stringify(performanceData));
      }
    });
  }
  
  // 记录JavaScript错误
  if (config.recordErrors) {
    window.addEventListener('error', (event) => {
      performanceData.errors.push({
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: Date.now()
      });
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      performanceData.errors.push({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        type: 'unhandledrejection',
        timestamp: Date.now()
      });
    });
  }
  
  // 评级函数
  function getFCPRating(value) {
    if (value <= 1800) return 'good';
    if (value <= 3000) return 'needs-improvement';
    return 'poor';
  }
  
  function getLCPRating(value) {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }
  
  function getCLSRating(value) {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }
  
  function getFIDRating(value) {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  }
  
  // 提供一个获取性能数据的方法
  window.getPerformanceData = function() {
    return performanceData;
  };
  
  // 如果配置了在控制台输出，则在页面加载完成后输出汇总数据
  if (config.logToConsole) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        console.log('性能监控数据:', performanceData);
      }, 3000); // 延迟3秒，等待更多数据收集
    });
  }
  
  return {
    getPerformanceData: window.getPerformanceData
  };
}

// 导出函数
window.performanceMonitor = {
  init: initPerformanceMonitor
}; 