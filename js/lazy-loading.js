/**
 * 图片懒加载模块
 * 负责处理网站中的图片懒加载功能
 */

/**
 * 初始化懒加载功能
 */
function initLazyLoading() {
  try {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (lazyImages.length === 0) {
      console.log('没有找到需要懒加载的图片');
      return;
    }
    
    // 检查WebP支持的函数
    const checkWebPSupport = (window.utils && window.utils.supportsWebP) ? 
      window.utils.supportsWebP : 
      function() {
        return new Promise(resolve => {
          const webP = new Image();
          webP.onload = webP.onerror = function() {
            resolve(webP.height === 2);
          };
          webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
      };
    
    // 错误日志函数
    const logError = (window.utils && window.utils.logError) ? 
      window.utils.logError : 
      function(error, context = '') {
        console.error(`[错误${context ? ' - ' + context : ''}]:`, error);
      };
    
    // 防抖函数
    const debounce = (window.utils && window.utils.debounce) ? 
      window.utils.debounce : 
      function(func, wait) {
        let timeout;
        return function() {
          const context = this;
          const args = arguments;
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            func.apply(context, args);
          }, wait);
        };
      };
    
    // 检查是否支持IntersectionObserver
    if ('IntersectionObserver' in window) {
      // 创建观察者实例
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target;
            
            // 检查WebP支持并设置合适的图片源
            checkWebPSupport().then(supportsWebP => {
              // 检查文件类型
              const isSvg = lazyImage.dataset.src && lazyImage.dataset.src.toLowerCase().endsWith('.svg');
              
              // SVG文件不需要WebP转换
              if (isSvg) {
                lazyImage.src = lazyImage.dataset.src;
              } else if (supportsWebP && lazyImage.dataset.webp) {
                lazyImage.src = lazyImage.dataset.webp;
              } else {
                lazyImage.src = lazyImage.dataset.src;
              }
              
              // 图片加载错误时使用占位图
              lazyImage.onerror = () => {
                console.log(`图片加载失败: ${lazyImage.src}`);
                lazyImage.src = 'images/placeholder.svg';
                lazyImage.classList.add('img-error');
                logError(new Error(`图片加载失败: ${lazyImage.dataset.src}`), '懒加载');
              };
              
              // 图片加载完成后移除data-src属性
              lazyImage.onload = () => {
                lazyImage.removeAttribute('data-src');
                if (!isSvg) {
                  lazyImage.removeAttribute('data-webp');
                }
              };
            });
            
            // 停止观察已处理的图片
            imageObserver.unobserve(lazyImage);
          }
        });
      }, {
        rootMargin: '50px 0px', // 提前50px开始加载
        threshold: 0.01 // 只要有1%可见就开始加载
      });
      
      // 开始观察所有懒加载图片
      lazyImages.forEach(image => {
        imageObserver.observe(image);
      });
      
    } else {
      // 降级方案：使用滚动事件
      console.log('浏览器不支持IntersectionObserver，使用滚动事件实现懒加载');
      
      // 检查图片是否在视口中
      function lazyLoad() {
        lazyImages.forEach(lazyImage => {
          if (lazyImage.dataset.src) {
            const rect = lazyImage.getBoundingClientRect();
            const isInViewport = (
              rect.top <= (window.innerHeight + 50) &&
              rect.bottom >= 0
            );
            
            if (isInViewport) {
              // 检查WebP支持并设置合适的图片源
              checkWebPSupport().then(supportsWebP => {
                // 检查文件类型
                const isSvg = lazyImage.dataset.src && lazyImage.dataset.src.toLowerCase().endsWith('.svg');
                
                // SVG文件不需要WebP转换
                if (isSvg) {
                  lazyImage.src = lazyImage.dataset.src;
                } else if (supportsWebP && lazyImage.dataset.webp) {
                  lazyImage.src = lazyImage.dataset.webp;
                } else {
                  lazyImage.src = lazyImage.dataset.src;
                }
                
                // 图片加载错误时使用占位图
                lazyImage.onerror = () => {
                  console.log(`图片加载失败: ${lazyImage.src}`);
                  lazyImage.src = 'images/placeholder.svg';
                  lazyImage.classList.add('img-error');
                  logError(new Error(`图片加载失败: ${lazyImage.dataset.src}`), '懒加载');
                };
                
                // 图片加载完成后移除data-src属性
                lazyImage.onload = () => {
                  lazyImage.removeAttribute('data-src');
                  if (!isSvg) {
                    lazyImage.removeAttribute('data-webp');
                  }
                };
              });
            }
          }
        });
      }
      
      // 添加滚动事件监听
      const scrollHandler = debounce(lazyLoad, 20);
      window.addEventListener('scroll', scrollHandler);
      window.addEventListener('resize', scrollHandler);
      window.addEventListener('orientationchange', scrollHandler);
      
      // 初始加载
      lazyLoad();
    }
    
  } catch (error) {
    console.error('初始化懒加载失败:', error);
    if (window.utils && window.utils.logError) {
      window.utils.logError(error, '懒加载初始化');
    }
    
    // 降级处理：直接加载所有图片
    try {
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => {
        img.src = img.dataset.src || 'images/placeholder.svg';
      });
    } catch (fallbackError) {
      console.error('懒加载降级处理失败:', fallbackError);
    }
  }
}

// 导出懒加载模块
window.lazyLoadingModule = {
  init: initLazyLoading
}; 