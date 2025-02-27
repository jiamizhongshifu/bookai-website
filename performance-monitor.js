/**
 * 性能监控工具
 * 用于监控页面加载性能和用户交互，收集核心Web指标
 * 
 * 使用方法：
 * 1. 在HTML文件底部引入此脚本
 * 2. 初始化监控：
 *    performanceMonitor.init({
 *      sampleRate: 0.5, // 采样率，0-1之间
 *      logToConsole: true // 是否在控制台输出结果
 *    });
 */

(function() {
  // 性能监控对象
  const performanceMonitor = {
    // 配置选项
    options: {
      sampleRate: 1.0, // 默认采样率100%
      logToConsole: true, // 默认在控制台输出
      trackErrors: true, // 默认跟踪错误
      trackResources: true, // 默认跟踪资源加载
      trackInteractions: true, // 默认跟踪用户交互
      trackMemory: false, // 默认不跟踪内存使用（仅Chrome支持）
      trackLongTasks: true, // 默认跟踪长任务
      trackCoreWebVitals: true // 默认跟踪核心Web指标
    },
    
    // 性能数据
    metrics: {
      navigationTiming: null,
      resourceTiming: [],
      coreWebVitals: {
        lcp: null, // Largest Contentful Paint
        fid: null, // First Input Delay
        cls: null, // Cumulative Layout Shift
        ttfb: null // Time to First Byte
      },
      errors: [],
      interactions: [],
      longTasks: [],
      memory: null
    },
    
    // 初始化函数
    init: function(options) {
      // 合并选项
      this.options = { ...this.options, ...options };
      
      // 应用采样率
      if (Math.random() > this.options.sampleRate) {
        console.log('性能监控：根据采样率跳过监控');
        return;
      }
      
      console.log('%c性能监控已启动', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
      
      // 收集导航计时
      this.collectNavigationTiming();
      
      // 收集资源计时
      if (this.options.trackResources) {
        this.collectResourceTiming();
      }
      
      // 跟踪核心Web指标
      if (this.options.trackCoreWebVitals) {
        this.trackCoreWebVitals();
      }
      
      // 跟踪错误
      if (this.options.trackErrors) {
        this.trackErrors();
      }
      
      // 跟踪用户交互
      if (this.options.trackInteractions) {
        this.trackInteractions();
      }
      
      // 跟踪长任务
      if (this.options.trackLongTasks) {
        this.trackLongTasks();
      }
      
      // 跟踪内存使用
      if (this.options.trackMemory) {
        this.trackMemory();
      }
      
      // 页面卸载前记录数据
      window.addEventListener('beforeunload', () => {
        this.logMetrics();
      });
      
      // 页面加载完成后记录初始数据
      window.addEventListener('load', () => {
        // 延迟执行，确保所有指标都已收集
        setTimeout(() => {
          this.logMetrics();
        }, 3000);
      });
    },
    
    // 收集导航计时
    collectNavigationTiming: function() {
      if (!window.performance || !window.performance.timing) {
        console.warn('性能监控：浏览器不支持Performance Timing API');
        return;
      }
      
      const timing = window.performance.timing;
      const navigationStart = timing.navigationStart;
      
      this.metrics.navigationTiming = {
        // DNS查询时间
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        // TCP连接时间
        tcp: timing.connectEnd - timing.connectStart,
        // 请求响应时间
        request: timing.responseEnd - timing.requestStart,
        // DOM解析时间
        dom: timing.domComplete - timing.domLoading,
        // 页面加载时间
        load: timing.loadEventEnd - navigationStart,
        // 首次内容绘制时间（估算）
        firstPaint: this.getFirstPaint(),
        // 首次可交互时间
        interactive: timing.domInteractive - navigationStart,
        // 首字节时间
        ttfb: timing.responseStart - timing.requestStart
      };
    },
    
    // 获取首次绘制时间
    getFirstPaint: function() {
      let firstPaint = 0;
      
      // 尝试从Performance API获取
      if (window.performance && window.performance.getEntriesByType) {
        const paintMetrics = window.performance.getEntriesByType('paint');
        const firstPaintEntry = paintMetrics.find(entry => entry.name === 'first-paint');
        
        if (firstPaintEntry) {
          firstPaint = firstPaintEntry.startTime;
        }
      }
      
      return firstPaint;
    },
    
    // 收集资源计时
    collectResourceTiming: function() {
      if (!window.performance || !window.performance.getEntriesByType) {
        console.warn('性能监控：浏览器不支持Resource Timing API');
        return;
      }
      
      const resources = window.performance.getEntriesByType('resource');
      
      this.metrics.resourceTiming = resources.map(resource => {
        return {
          name: resource.name,
          type: resource.initiatorType,
          duration: resource.duration,
          size: resource.transferSize || 0,
          startTime: resource.startTime
        };
      });
      
      // 按加载时间排序
      this.metrics.resourceTiming.sort((a, b) => b.duration - a.duration);
    },
    
    // 跟踪核心Web指标
    trackCoreWebVitals: function() {
      // 跟踪Largest Contentful Paint (LCP)
      this.trackLCP();
      
      // 跟踪First Input Delay (FID)
      this.trackFID();
      
      // 跟踪Cumulative Layout Shift (CLS)
      this.trackCLS();
      
      // 跟踪Time to First Byte (TTFB)
      this.trackTTFB();
    },
    
    // 跟踪Largest Contentful Paint (LCP)
    trackLCP: function() {
      if (!window.PerformanceObserver) {
        console.warn('性能监控：浏览器不支持PerformanceObserver');
        return;
      }
      
      try {
        const lcpObserver = new PerformanceObserver(entryList => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          this.metrics.coreWebVitals.lcp = lastEntry.startTime;
        });
        
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        console.warn('性能监控：无法跟踪LCP', e);
      }
    },
    
    // 跟踪First Input Delay (FID)
    trackFID: function() {
      if (!window.PerformanceObserver) {
        console.warn('性能监控：浏览器不支持PerformanceObserver');
        return;
      }
      
      try {
        const fidObserver = new PerformanceObserver(entryList => {
          const entries = entryList.getEntries();
          const firstEntry = entries[0];
          
          this.metrics.coreWebVitals.fid = firstEntry.processingStart - firstEntry.startTime;
        });
        
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch (e) {
        console.warn('性能监控：无法跟踪FID', e);
      }
    },
    
    // 跟踪Cumulative Layout Shift (CLS)
    trackCLS: function() {
      if (!window.PerformanceObserver) {
        console.warn('性能监控：浏览器不支持PerformanceObserver');
        return;
      }
      
      try {
        let clsValue = 0;
        let clsEntries = [];
        
        const clsObserver = new PerformanceObserver(entryList => {
          const entries = entryList.getEntries();
          
          entries.forEach(entry => {
            // 只有不是由用户交互引起的布局偏移才计入CLS
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              clsEntries.push(entry);
            }
          });
          
          this.metrics.coreWebVitals.cls = clsValue;
        });
        
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        console.warn('性能监控：无法跟踪CLS', e);
      }
    },
    
    // 跟踪Time to First Byte (TTFB)
    trackTTFB: function() {
      if (!window.performance || !window.performance.timing) {
        console.warn('性能监控：浏览器不支持Performance Timing API');
        return;
      }
      
      const timing = window.performance.timing;
      this.metrics.coreWebVitals.ttfb = timing.responseStart - timing.navigationStart;
    },
    
    // 跟踪错误
    trackErrors: function() {
      window.addEventListener('error', event => {
        this.metrics.errors.push({
          message: event.message,
          source: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          timestamp: Date.now()
        });
      });
      
      window.addEventListener('unhandledrejection', event => {
        this.metrics.errors.push({
          message: `Unhandled Promise Rejection: ${event.reason}`,
          timestamp: Date.now()
        });
      });
    },
    
    // 跟踪用户交互
    trackInteractions: function() {
      const interactionEvents = ['click', 'scroll', 'keydown'];
      
      interactionEvents.forEach(eventType => {
        window.addEventListener(eventType, event => {
          // 限制记录的交互数量
          if (this.metrics.interactions.length >= 50) return;
          
          let interactionData = {
            type: eventType,
            timestamp: Date.now()
          };
          
          // 记录点击的元素
          if (eventType === 'click' && event.target) {
            interactionData.target = {
              tagName: event.target.tagName,
              id: event.target.id,
              className: event.target.className
            };
          }
          
          this.metrics.interactions.push(interactionData);
        }, { passive: true });
      });
    },
    
    // 跟踪长任务
    trackLongTasks: function() {
      if (!window.PerformanceObserver) {
        console.warn('性能监控：浏览器不支持PerformanceObserver');
        return;
      }
      
      try {
        const longTaskObserver = new PerformanceObserver(entryList => {
          const entries = entryList.getEntries();
          
          entries.forEach(entry => {
            this.metrics.longTasks.push({
              duration: entry.duration,
              startTime: entry.startTime,
              attribution: entry.attribution
            });
          });
        });
        
        longTaskObserver.observe({ type: 'longtask', buffered: true });
      } catch (e) {
        console.warn('性能监控：无法跟踪长任务', e);
      }
    },
    
    // 跟踪内存使用
    trackMemory: function() {
      if (!window.performance || !window.performance.memory) {
        console.warn('性能监控：浏览器不支持Memory API');
        return;
      }
      
      // 每10秒记录一次内存使用
      const memoryInterval = setInterval(() => {
        this.metrics.memory = {
          jsHeapSizeLimit: window.performance.memory.jsHeapSizeLimit,
          totalJSHeapSize: window.performance.memory.totalJSHeapSize,
          usedJSHeapSize: window.performance.memory.usedJSHeapSize,
          timestamp: Date.now()
        };
      }, 10000);
      
      // 页面卸载前清除定时器
      window.addEventListener('beforeunload', () => {
        clearInterval(memoryInterval);
      });
    },
    
    // 记录指标
    logMetrics: function() {
      if (!this.options.logToConsole) return;
      
      console.group('%c页面性能指标', 'color: #2196F3; font-weight: bold; font-size: 14px;');
      
      // 导航计时
      if (this.metrics.navigationTiming) {
        console.group('导航计时');
        console.log('DNS查询时间:', this.formatTime(this.metrics.navigationTiming.dns));
        console.log('TCP连接时间:', this.formatTime(this.metrics.navigationTiming.tcp));
        console.log('请求响应时间:', this.formatTime(this.metrics.navigationTiming.request));
        console.log('DOM解析时间:', this.formatTime(this.metrics.navigationTiming.dom));
        console.log('页面加载时间:', this.formatTime(this.metrics.navigationTiming.load));
        console.log('首次内容绘制时间:', this.formatTime(this.metrics.navigationTiming.firstPaint));
        console.log('首次可交互时间:', this.formatTime(this.metrics.navigationTiming.interactive));
        console.log('首字节时间:', this.formatTime(this.metrics.navigationTiming.ttfb));
        console.groupEnd();
      }
      
      // 核心Web指标
      console.group('核心Web指标');
      console.log('Largest Contentful Paint (LCP):', this.formatTime(this.metrics.coreWebVitals.lcp));
      console.log('First Input Delay (FID):', this.formatTime(this.metrics.coreWebVitals.fid));
      console.log('Cumulative Layout Shift (CLS):', this.metrics.coreWebVitals.cls?.toFixed(3) || 'N/A');
      console.log('Time to First Byte (TTFB):', this.formatTime(this.metrics.coreWebVitals.ttfb));
      console.groupEnd();
      
      // 资源计时
      if (this.metrics.resourceTiming.length > 0) {
        console.group('资源加载时间 (Top 5)');
        this.metrics.resourceTiming.slice(0, 5).forEach(resource => {
          console.log(`${resource.name.split('/').pop()} (${resource.type}):`, this.formatTime(resource.duration));
        });
        console.groupEnd();
      }
      
      // 错误
      if (this.metrics.errors.length > 0) {
        console.group('错误 (最近5个)');
        this.metrics.errors.slice(-5).forEach(error => {
          console.log(`${new Date(error.timestamp).toLocaleTimeString()}: ${error.message}`);
        });
        console.groupEnd();
      }
      
      // 长任务
      if (this.metrics.longTasks.length > 0) {
        console.group('长任务');
        console.log('长任务数量:', this.metrics.longTasks.length);
        console.log('最长任务持续时间:', this.formatTime(Math.max(...this.metrics.longTasks.map(task => task.duration))));
        console.log('总阻塞时间:', this.formatTime(this.metrics.longTasks.reduce((sum, task) => sum + task.duration, 0)));
        console.groupEnd();
      }
      
      // 内存使用
      if (this.metrics.memory) {
        console.group('内存使用');
        console.log('已用堆大小:', this.formatSize(this.metrics.memory.usedJSHeapSize));
        console.log('总堆大小:', this.formatSize(this.metrics.memory.totalJSHeapSize));
        console.log('堆大小限制:', this.formatSize(this.metrics.memory.jsHeapSizeLimit));
        console.groupEnd();
      }
      
      console.groupEnd();
      
      // 性能评分
      this.calculatePerformanceScore();
    },
    
    // 计算性能评分
    calculatePerformanceScore: function() {
      let score = 100;
      let issues = [];
      
      // LCP评分 (应小于2.5秒)
      if (this.metrics.coreWebVitals.lcp) {
        if (this.metrics.coreWebVitals.lcp > 2500) {
          const penalty = Math.min(30, Math.floor((this.metrics.coreWebVitals.lcp - 2500) / 100));
          score -= penalty;
          issues.push(`LCP过高 (${this.formatTime(this.metrics.coreWebVitals.lcp)})，减${penalty}分`);
        }
      }
      
      // FID评分 (应小于100毫秒)
      if (this.metrics.coreWebVitals.fid) {
        if (this.metrics.coreWebVitals.fid > 100) {
          const penalty = Math.min(20, Math.floor((this.metrics.coreWebVitals.fid - 100) / 10));
          score -= penalty;
          issues.push(`FID过高 (${this.formatTime(this.metrics.coreWebVitals.fid)})，减${penalty}分`);
        }
      }
      
      // CLS评分 (应小于0.1)
      if (this.metrics.coreWebVitals.cls) {
        if (this.metrics.coreWebVitals.cls > 0.1) {
          const penalty = Math.min(20, Math.floor(this.metrics.coreWebVitals.cls * 100));
          score -= penalty;
          issues.push(`CLS过高 (${this.metrics.coreWebVitals.cls.toFixed(3)})，减${penalty}分`);
        }
      }
      
      // 页面加载时间评分 (应小于3秒)
      if (this.metrics.navigationTiming && this.metrics.navigationTiming.load) {
        if (this.metrics.navigationTiming.load > 3000) {
          const penalty = Math.min(20, Math.floor((this.metrics.navigationTiming.load - 3000) / 200));
          score -= penalty;
          issues.push(`页面加载时间过长 (${this.formatTime(this.metrics.navigationTiming.load)})，减${penalty}分`);
        }
      }
      
      // 错误数量评分
      if (this.metrics.errors.length > 0) {
        const penalty = Math.min(20, this.metrics.errors.length * 5);
        score -= penalty;
        issues.push(`存在${this.metrics.errors.length}个JavaScript错误，减${penalty}分`);
      }
      
      // 长任务评分
      if (this.metrics.longTasks.length > 0) {
        const penalty = Math.min(10, this.metrics.longTasks.length);
        score -= penalty;
        issues.push(`存在${this.metrics.longTasks.length}个长任务，减${penalty}分`);
      }
      
      // 输出评分
      console.group('%c性能评分', 'color: #FF9800; font-weight: bold; font-size: 14px;');
      
      let scoreColor;
      if (score >= 90) {
        scoreColor = '#4CAF50'; // 绿色
      } else if (score >= 70) {
        scoreColor = '#FF9800'; // 橙色
      } else {
        scoreColor = '#F44336'; // 红色
      }
      
      console.log(`%c总分: ${score}/100`, `color: ${scoreColor}; font-weight: bold; font-size: 16px;`);
      
      if (issues.length > 0) {
        console.log('性能问题:');
        issues.forEach(issue => {
          console.log(`- ${issue}`);
        });
      }
      
      // 优化建议
      console.log('优化建议:');
      if (this.metrics.coreWebVitals.lcp > 2500) {
        console.log('- 优化LCP: 压缩图片，使用CDN，优化关键渲染路径');
      }
      if (this.metrics.coreWebVitals.fid > 100) {
        console.log('- 优化FID: 减少主线程阻塞，拆分长任务，延迟加载非关键JavaScript');
      }
      if (this.metrics.coreWebVitals.cls > 0.1) {
        console.log('- 优化CLS: 为图片和视频设置尺寸，避免动态插入内容，使用transform动画');
      }
      if (this.metrics.navigationTiming && this.metrics.navigationTiming.load > 3000) {
        console.log('- 优化加载时间: 减少资源大小，使用浏览器缓存，优化资源加载顺序');
      }
      if (this.metrics.errors.length > 0) {
        console.log('- 修复JavaScript错误，提高代码质量');
      }
      
      console.groupEnd();
    },
    
    // 格式化时间
    formatTime: function(ms) {
      if (ms === undefined || ms === null) return 'N/A';
      
      if (ms < 1) return '< 1ms';
      if (ms < 1000) return `${Math.round(ms)}ms`;
      return `${(ms / 1000).toFixed(2)}s`;
    },
    
    // 格式化大小
    formatSize: function(bytes) {
      if (bytes === undefined || bytes === null) return 'N/A';
      
      if (bytes < 1024) return `${bytes}B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`;
      return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
    }
  };
  
  // 导出为全局对象
  window.performanceMonitor = performanceMonitor;
})(); 