/**
 * 性能监控模块
 * 负责收集和分析网站性能数据
 */

/**
 * 性能监控类
 */
class PerformanceMonitor {
  constructor(options = {}) {
    this.options = Object.assign({
      sampleRate: 0.1, // 采样率，默认10%的用户
      maxEntries: 50,  // 最大存储条目数
      storageKey: 'performance_metrics',
      sendInterval: 60000, // 发送间隔，默认1分钟
      endpoint: null,  // 数据发送端点
      autoStart: true, // 是否自动开始监控
      debug: false     // 是否开启调试模式
    }, options);
    
    this.metrics = {
      navigation: null,
      resources: [],
      errors: [],
      interactions: [],
      vitals: {}
    };
    
    this.isMonitoring = false;
    this.sendTimer = null;
    
    // 如果设置了自动开始，则初始化后立即开始监控
    if (this.options.autoStart) {
      this.start();
    }
  }
  
  /**
   * 开始性能监控
   */
  start() {
    if (this.isMonitoring) return;
    
    // 检查是否应该对当前用户进行采样
    if (Math.random() > this.options.sampleRate) {
      this.log('用户未被采样，不进行性能监控');
      return;
    }
    
    this.isMonitoring = true;
    this.log('开始性能监控');
    
    // 监控页面加载性能
    this.monitorPageLoad();
    
    // 监控资源加载性能
    this.monitorResources();
    
    // 监控用户交互
    this.monitorInteractions();
    
    // 监控Web Vitals
    this.monitorWebVitals();
    
    // 设置定时发送数据
    if (this.options.endpoint) {
      this.sendTimer = setInterval(() => {
        this.sendData();
      }, this.options.sendInterval);
    }
    
    // 页面卸载前发送数据
    window.addEventListener('beforeunload', () => {
      this.sendData();
    });
  }
  
  /**
   * 停止性能监控
   */
  stop() {
    if (!this.isMonitoring) return;
    
    this.isMonitoring = false;
    this.log('停止性能监控');
    
    if (this.sendTimer) {
      clearInterval(this.sendTimer);
      this.sendTimer = null;
    }
  }
  
  /**
   * 监控页面加载性能
   */
  monitorPageLoad() {
    try {
      // 等待页面完全加载
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = window.performance.timing;
          
          this.metrics.navigation = {
            // DNS查询时间
            dnsTime: perfData.domainLookupEnd - perfData.domainLookupStart,
            // TCP连接时间
            tcpTime: perfData.connectEnd - perfData.connectStart,
            // 请求响应时间
            responseTime: perfData.responseEnd - perfData.responseStart,
            // DOM解析时间
            domParseTime: perfData.domInteractive - perfData.responseEnd,
            // DOM内容加载时间
            domContentLoadedTime: perfData.domContentLoadedEventEnd - perfData.navigationStart,
            // 页面完全加载时间
            loadTime: perfData.loadEventEnd - perfData.navigationStart,
            // 首次绘制时间（如果可用）
            firstPaint: this.getFirstPaint(),
            // 页面URL
            url: window.location.href,
            // 用户代理
            userAgent: navigator.userAgent,
            // 时间戳
            timestamp: new Date().toISOString()
          };
          
          this.log('页面加载性能数据:', this.metrics.navigation);
          this.saveMetrics();
        }, 0);
      });
    } catch (error) {
      this.logError('监控页面加载性能失败', error);
    }
  }
  
  /**
   * 获取首次绘制时间
   */
  getFirstPaint() {
    try {
      const entries = performance.getEntriesByType('paint');
      const firstPaint = entries.find(entry => entry.name === 'first-paint');
      return firstPaint ? firstPaint.startTime : null;
    } catch (error) {
      this.logError('获取首次绘制时间失败', error);
      return null;
    }
  }
  
  /**
   * 监控资源加载性能
   */
  monitorResources() {
    try {
      // 使用PerformanceObserver监控资源加载
      if (window.PerformanceObserver) {
        const observer = new PerformanceObserver(list => {
          const entries = list.getEntries();
          
          entries.forEach(entry => {
            // 只关注关键资源类型
            if (['script', 'link', 'img', 'css', 'fetch', 'xmlhttprequest'].includes(entry.initiatorType)) {
              this.metrics.resources.push({
                name: entry.name,
                type: entry.initiatorType,
                duration: entry.duration,
                size: entry.transferSize || 0,
                timestamp: new Date().toISOString()
              });
              
              // 限制资源条目数量
              if (this.metrics.resources.length > this.options.maxEntries) {
                this.metrics.resources.shift();
              }
            }
          });
          
          this.saveMetrics();
        });
        
        observer.observe({ entryTypes: ['resource'] });
      }
    } catch (error) {
      this.logError('监控资源加载性能失败', error);
    }
  }
  
  /**
   * 监控用户交互
   */
  monitorInteractions() {
    try {
      // 监控点击事件
      document.addEventListener('click', event => {
        const target = event.target;
        const tagName = target.tagName.toLowerCase();
        const id = target.id;
        const className = target.className;
        
        this.metrics.interactions.push({
          type: 'click',
          element: {
            tagName,
            id,
            className: typeof className === 'string' ? className : ''
          },
          path: this.getElementPath(target),
          timestamp: new Date().toISOString()
        });
        
        // 限制交互条目数量
        if (this.metrics.interactions.length > this.options.maxEntries) {
          this.metrics.interactions.shift();
        }
        
        this.saveMetrics();
      });
    } catch (error) {
      this.logError('监控用户交互失败', error);
    }
  }
  
  /**
   * 获取元素路径
   */
  getElementPath(element, maxDepth = 5) {
    try {
      const path = [];
      let currentElement = element;
      let depth = 0;
      
      while (currentElement && depth < maxDepth) {
        const tagName = currentElement.tagName.toLowerCase();
        const id = currentElement.id ? `#${currentElement.id}` : '';
        const className = currentElement.className && typeof currentElement.className === 'string' 
          ? `.${currentElement.className.split(' ').join('.')}` 
          : '';
        
        path.unshift(`${tagName}${id}${className}`);
        currentElement = currentElement.parentElement;
        depth++;
      }
      
      return path.join(' > ');
    } catch (error) {
      this.logError('获取元素路径失败', error);
      return 'unknown';
    }
  }
  
  /**
   * 监控Web Vitals
   */
  monitorWebVitals() {
    try {
      // 如果有Web Vitals库，使用它来监控核心指标
      if (typeof webVitals !== 'undefined') {
        webVitals.getCLS(metric => {
          this.metrics.vitals.cls = metric.value;
          this.saveMetrics();
        });
        
        webVitals.getFID(metric => {
          this.metrics.vitals.fid = metric.value;
          this.saveMetrics();
        });
        
        webVitals.getLCP(metric => {
          this.metrics.vitals.lcp = metric.value;
          this.saveMetrics();
        });
        
        webVitals.getFCP(metric => {
          this.metrics.vitals.fcp = metric.value;
          this.saveMetrics();
        });
        
        webVitals.getTTFB(metric => {
          this.metrics.vitals.ttfb = metric.value;
          this.saveMetrics();
        });
      }
    } catch (error) {
      this.logError('监控Web Vitals失败', error);
    }
  }
  
  /**
   * 保存性能指标到本地存储
   */
  saveMetrics() {
    try {
      localStorage.setItem(this.options.storageKey, JSON.stringify(this.metrics));
    } catch (error) {
      this.logError('保存性能指标失败', error);
    }
  }
  
  /**
   * 发送性能数据到服务器
   */
  sendData() {
    if (!this.options.endpoint || !this.isMonitoring) return;
    
    try {
      const data = {
        metrics: this.metrics,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId()
      };
      
      // 使用Beacon API发送数据，这样即使页面关闭也能发送成功
      if (navigator.sendBeacon) {
        navigator.sendBeacon(this.options.endpoint, JSON.stringify(data));
      } else {
        // 降级为XHR
        const xhr = new XMLHttpRequest();
        xhr.open('POST', this.options.endpoint, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
      }
      
      this.log('性能数据已发送');
    } catch (error) {
      this.logError('发送性能数据失败', error);
    }
  }
  
  /**
   * 获取或创建会话ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('performance_session_id');
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('performance_session_id', sessionId);
    }
    return sessionId;
  }
  
  /**
   * 记录调试日志
   */
  log(...args) {
    if (this.options.debug) {
      console.log('[性能监控]', ...args);
    }
  }
  
  /**
   * 记录错误日志
   */
  logError(message, error) {
    console.error('[性能监控错误]', message, error);
    
    this.metrics.errors.push({
      message,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    // 限制错误条目数量
    if (this.metrics.errors.length > this.options.maxEntries) {
      this.metrics.errors.shift();
    }
    
    this.saveMetrics();
  }
}

// 创建性能监控实例
window.performanceMonitor = new PerformanceMonitor({
  debug: false,
  sampleRate: 0.1,
  // 如果有后端API接收性能数据，可以设置endpoint
  // endpoint: 'https://example.com/api/performance'
}); 