/**
 * 网站主入口文件
 * 负责加载和初始化各个功能模块
 */

// 加载顺序很重要，先加载工具函数和性能监控
document.addEventListener('DOMContentLoaded', function() {
  // 先加载工具函数库
  loadScript('js/utils.js').then(() => {
    // 初始化网站基础功能
    initBasicFeatures();
    
    // 按需加载其他模块
    loadModules();
  }).catch(error => {
    console.error('加载工具函数库失败:', error);
    // 即使工具库加载失败，也尝试初始化基础功能
    initBasicFeatures();
    loadModules();
  });
});

/**
 * 初始化网站基础功能
 */
function initBasicFeatures() {
  try {
    // 初始化深色模式
    initDarkMode();
    
    // 初始化移动端菜单
    initMobileMenu();
    
    // 初始化搜索功能
    initSearch();
    
    // 全局错误处理
    initErrorHandling();
  } catch (error) {
    console.error('初始化基础功能失败:', error);
  }
}

/**
 * 按需加载其他模块
 */
function loadModules() {
  // 检测当前页面类型
  const isHomePage = document.querySelector('.hero') !== null;
  const isArticlePage = document.querySelector('.article-content') !== null;
  
  // 首页特定功能
  if (isHomePage) {
    // 首页特定功能可以在这里添加
  }
  
  // 文章页特定功能
  if (isArticlePage) {
    // 加载文章相关功能
    Promise.all([
      loadScript('js/article-toc.js'),
      loadScript('js/article-rating.js')
    ]).then(() => {
      // 初始化文章目录
      if (window.tocModule) {
        window.tocModule.init();
      }
      
      // 初始化文章评分
      if (window.ratingModule) {
        window.ratingModule.init();
      }
      
      // 初始化阅读进度
      initReadingProgress();
      
      // 初始化返回顶部按钮
      initBackToTop();
      
      // 初始化文章浏览量统计
      initArticleViews();
    }).catch(error => {
      console.error('加载文章模块失败:', error);
    });
  }
  
  // 所有页面都需要的功能
  
  // 加载懒加载模块
  loadScript('js/lazy-loading.js').then(() => {
    if (window.lazyLoadingModule) {
      window.lazyLoadingModule.init();
    }
  }).catch(error => {
    console.error('加载懒加载模块失败:', error);
    // 降级处理：直接加载所有图片
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      img.src = img.dataset.src || 'images/placeholder.svg';
    });
  });
  
  // 检查是否需要加载PWA功能
  if ('serviceWorker' in navigator) {
    // 延迟注册Service Worker，优先加载核心内容
    setTimeout(() => {
      registerServiceWorker();
    }, 3000);
  }
}

/**
 * 加载脚本文件
 * @param {string} src 脚本文件路径
 * @returns {Promise} 加载完成的Promise
 */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * 初始化深色模式
 */
function initDarkMode() {
  const darkModeToggle = document.querySelector('.dark-mode-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // 检查本地存储中的主题设置
  const savedTheme = localStorage.getItem('theme');
  
  // 应用主题
  if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    document.body.classList.add('dark-mode');
    updateDarkModeIcon(true);
  }
  
  // 切换深色模式
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDarkMode = document.body.classList.contains('dark-mode');
      
      // 更新图标
      updateDarkModeIcon(isDarkMode);
      
      // 保存设置
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });
  }
  
  // 监听系统主题变化
  prefersDarkScheme.addEventListener('change', (e) => {
    // 只有当用户没有手动设置主题时才跟随系统
    if (!localStorage.getItem('theme')) {
      const shouldBeDark = e.matches;
      document.body.classList.toggle('dark-mode', shouldBeDark);
      updateDarkModeIcon(shouldBeDark);
    }
  });
}

/**
 * 更新深色模式图标
 * @param {boolean} isDarkMode 是否为深色模式
 */
function updateDarkModeIcon(isDarkMode) {
  const icon = document.querySelector('.dark-mode-toggle i');
  if (icon) {
    if (isDarkMode) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  }
}

/**
 * 初始化移动端菜单
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      menuToggle.classList.toggle('active');
      
      // 切换图标
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
    
    // 点击导航链接后关闭菜单
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        menuToggle.classList.remove('active');
        
        // 恢复图标
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }
}

/**
 * 初始化搜索功能
 */
function initSearch() {
  const searchForm = document.querySelector('.search-form');
  const searchInput = document.querySelector('.search-input');
  const searchResults = document.querySelector('.search-results');
  
  if (searchForm && searchInput && searchResults) {
    // 防抖处理搜索输入
    const debouncedSearch = debounce(performSearch, 300);
    
    searchInput.addEventListener('input', () => {
      debouncedSearch(searchInput.value);
    });
    
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      performSearch(searchInput.value);
    });
    
    // 点击其他区域关闭搜索结果
    document.addEventListener('click', (e) => {
      if (!searchForm.contains(e.target)) {
        searchResults.style.display = 'none';
      }
    });
  }
  
  /**
   * 执行搜索
   * @param {string} query 搜索关键词
   */
  function performSearch(query) {
    if (!query || query.length < 2) {
      searchResults.style.display = 'none';
      return;
    }
    
    // 这里可以实现实际的搜索逻辑
    // 简单示例：显示一些模拟结果
    searchResults.innerHTML = `
      <div class="search-result-item">
        <a href="/articles/deepseek-tips.html">
          <h4>DeepSeek使用技巧</h4>
          <p>包含 "${query}" 的搜索结果...</p>
        </a>
      </div>
    `;
    searchResults.style.display = 'block';
  }
}

/**
 * 防抖函数
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
 * 初始化全局错误处理
 */
function initErrorHandling() {
  // 全局错误捕获
  window.addEventListener('error', function(event) {
    console.error('全局错误:', event.error);
    
    // 检查是否是字体加载错误
    if (event.target && event.target.tagName === 'LINK' && event.target.rel === 'stylesheet') {
      document.body.classList.add('font-failed');
    }
    
    return false;
  }, true);
  
  // 资源加载错误处理
  document.addEventListener('DOMContentLoaded', function() {
    // 检查字体是否正确加载
    try {
      const testElement = document.createElement('span');
      testElement.style.position = 'absolute';
      testElement.style.visibility = 'hidden';
      testElement.style.fontFamily = 'FontAwesome';
      testElement.textContent = '\uf000'; // FontAwesome字符
      document.body.appendChild(testElement);
      
      // 如果字体未加载，宽度会不同
      const width = testElement.offsetWidth;
      document.body.removeChild(testElement);
      
      // 设置一个通用字体的对照组
      const testElement2 = document.createElement('span');
      testElement2.style.position = 'absolute';
      testElement2.style.visibility = 'hidden';
      testElement2.style.fontFamily = 'Arial';
      testElement2.textContent = '\uf000';
      document.body.appendChild(testElement2);
      
      const width2 = testElement2.offsetWidth;
      document.body.removeChild(testElement2);
      
      // 如果宽度相同，说明FontAwesome没有加载，使用的是后备字体
      if (Math.abs(width - width2) < 2) {
        document.body.classList.add('font-failed');
      }
    } catch (e) {
      console.error('字体加载检测失败:', e);
    }
    
    // 为所有图片添加错误处理
    const images = document.querySelectorAll('img:not([data-src])');
    images.forEach(img => {
      if (!img.hasAttribute('data-error-handled')) {
        img.setAttribute('data-error-handled', 'true');
        img.addEventListener('error', function() {
          this.src = 'images/placeholder.svg';
          this.classList.add('img-error');
        });
      }
    });
  });
}

/**
 * 初始化阅读进度
 */
function initReadingProgress() {
  const progressBar = document.querySelector('.reading-progress-bar');
  if (!progressBar) return;
  
  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.scrollY;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${progress}%`;
  });
}

/**
 * 初始化返回顶部按钮
 */
function initBackToTop() {
  const backToTopButton = document.querySelector('.back-to-top');
  if (!backToTopButton) return;
  
  // 显示/隐藏按钮
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });
  
  // 点击返回顶部
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 初始化文章浏览量统计
 */
function initArticleViews() {
  const articleId = document.querySelector('article')?.id;
  if (!articleId) return;
  
  try {
    // 从本地存储获取浏览记录
    const viewedArticles = JSON.parse(localStorage.getItem('viewed_articles') || '{}');
    
    // 检查是否已经浏览过
    if (!viewedArticles[articleId]) {
      // 更新浏览次数（这里可以替换为实际的API调用）
      viewedArticles[articleId] = Date.now();
      localStorage.setItem('viewed_articles', JSON.stringify(viewedArticles));
      
      // 更新显示的浏览次数
      const viewCountElement = document.querySelector('.article-views-count');
      if (viewCountElement) {
        const currentCount = parseInt(viewCountElement.textContent, 10) || 0;
        viewCountElement.textContent = currentCount + 1;
      }
    }
  } catch (error) {
    console.error('更新文章浏览量失败:', error);
  }
}

/**
 * 注册Service Worker
 */
function registerServiceWorker() {
  navigator.serviceWorker.register('sw.js')
    .then(function(registration) {
      console.log('Service Worker 注册成功，作用域为: ', registration.scope);
    })
    .catch(function(error) {
      console.log('Service Worker 注册失败: ', error);
    });
} 