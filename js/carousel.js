/**
 * 轮播图模块
 * 负责处理网站中的轮播图功能
 */

/**
 * 初始化轮播图功能
 */
function initCarousel() {
  try {
    const carouselContainer = document.querySelector('.carousel-container');
    const carouselTrack = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    if (!carouselContainer || !carouselTrack || slides.length === 0) {
      console.warn('轮播图元素不存在，跳过初始化');
      return;
    }
    
    let currentIndex = 0;
    let slideWidth = 0;
    let slidesToShow = 1;
    let autoplayInterval = null;
    
    try {
      // 获取轮播图尺寸
      slideWidth = slides[0].offsetWidth;
      slidesToShow = getSlidesToShow();
    } catch (error) {
      console.error('获取轮播图尺寸失败:', error);
      // 设置默认值
      slideWidth = carouselContainer.offsetWidth;
      slidesToShow = 1;
    }
    
    // 防抖函数，如果utils不存在则使用本地定义的防抖函数
    const debounceFn = (window.utils && window.utils.debounce) ? 
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
    
    // 监听窗口大小变化，更新轮播图
    try {
      window.addEventListener('resize', debounceFn(() => {
        slideWidth = slides[0].offsetWidth;
        slidesToShow = getSlidesToShow();
        updateCarousel();
      }, 200));
    } catch (error) {
      console.error('设置轮播图窗口大小监听失败:', error);
    }
    
    // 更新轮播图位置
    function updateCarousel() {
      try {
        carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        
        // 更新指示器状态
        indicators.forEach((indicator, index) => {
          indicator.classList.toggle('active', index === currentIndex);
        });
      } catch (error) {
        console.error('更新轮播图位置失败:', error);
      }
    }
    
    // 添加按钮事件监听
    if (prevButton) prevButton.addEventListener('click', goToPrev);
    if (nextButton) nextButton.addEventListener('click', goToNext);
    
    // 添加指示器事件监听
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        goToSlide(index);
      });
    });
    
    // 添加触摸事件支持
    let touchStartX = 0;
    let touchEndX = 0;
    
    carouselContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });
    
    carouselContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoplay();
    }, { passive: true });
    
    carouselContainer.addEventListener('mouseenter', stopAutoplay);
    carouselContainer.addEventListener('mouseleave', startAutoplay);
    
    // 自动播放
    function startAutoplay() {
      if (autoplayInterval) clearInterval(autoplayInterval);
      autoplayInterval = setInterval(() => {
        goToNext();
      }, 5000);
    }
    
    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    }
    
    // 处理滑动
    function handleSwipe() {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        goToNext();
      }
      if (touchEndX > touchStartX + swipeThreshold) {
        goToPrev();
      }
    }
    
    // 跳转到指定幻灯片
    function goToSlide(index) {
      if (index < 0) {
        index = slides.length - slidesToShow;
      } else if (index > slides.length - slidesToShow) {
        index = 0;
      }
      currentIndex = index;
      updateCarousel();
    }
    
    // 上一张
    function goToPrev() {
      goToSlide(currentIndex - 1);
    }
    
    // 下一张
    function goToNext() {
      goToSlide(currentIndex + 1);
    }
    
    // 根据屏幕宽度确定显示的幻灯片数量
    function getSlidesToShow() {
      const containerWidth = carouselContainer.offsetWidth;
      if (containerWidth < 600) return 1;
      if (containerWidth < 900) return 2;
      return 3;
    }
    
    // 初始化轮播图
    updateCarousel();
    startAutoplay();
    
  } catch (error) {
    console.error('初始化轮播图失败:', error);
    
    // 降级处理：显示静态内容
    try {
      const carouselContainer = document.querySelector('.carousel-container');
      const slides = document.querySelectorAll('.carousel-slide');
      
      if (carouselContainer && slides.length > 0) {
        // 移除轮播样式，改为静态网格布局
        carouselContainer.style.overflow = 'visible';
        carouselContainer.style.display = 'grid';
        carouselContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
        carouselContainer.style.gap = '20px';
        
        // 隐藏轮播控制元素
        const controls = carouselContainer.querySelectorAll('.carousel-arrow, .carousel-indicators');
        controls.forEach(control => control.style.display = 'none');
      }
    } catch (fallbackError) {
      console.error('轮播图降级处理失败:', fallbackError);
    }
  }
}

// 导出轮播图模块
window.carouselModule = {
  init: initCarousel
}; 