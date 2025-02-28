/**
 * 文章详情页专用JavaScript
 * 实现浮动目录导航、阅读进度条、代码高亮和图片懒加载功能
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化各项功能
    initTableOfContents();
    initReadingProgress();
    initBackToTop();
    initCodeHighlight();
    initLazyLoading();
    initArticleNavigation();
});

/**
 * 初始化文章目录
 * 添加目录项点击事件和滚动监听
 */
function initTableOfContents() {
    // 获取所有目录链接
    const tocLinks = document.querySelectorAll('.toc-link');
    
    // 为所有目录链接添加平滑滚动效果
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // 计算目标位置，考虑固定头部的高度
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                // 平滑滚动到目标位置
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 更新URL哈希，但不触发滚动
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // 监听滚动事件，高亮当前可见的章节
    window.addEventListener('scroll', debounce(highlightCurrentSection, 100));
    
    // 初始高亮
    highlightCurrentSection();
}

/**
 * 高亮当前可见的章节
 */
function highlightCurrentSection() {
    // 获取所有章节
    const sections = document.querySelectorAll('.article-section');
    const headerHeight = document.querySelector('header').offsetHeight;
    
    // 找到当前可见的章节
    let currentSection = null;
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionBottom = section.getBoundingClientRect().bottom;
        
        // 章节顶部在视口内，或者章节底部在视口内，或者章节高度超过视口
        if ((sectionTop <= headerHeight + 100 && sectionBottom > headerHeight + 100) || 
            (sectionTop < 0 && sectionBottom > window.innerHeight)) {
            currentSection = section;
        }
    });
    
    // 移除所有活动类
    document.querySelectorAll('.toc-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // 如果找到当前章节，高亮对应的目录项
    if (currentSection) {
        const currentId = currentSection.getAttribute('id');
        const correspondingLink = document.querySelector(`.toc-link[href="#${currentId}"]`);
        
        if (correspondingLink) {
            correspondingLink.classList.add('active');
            
            // 确保目录中的活动项可见（自动滚动目录）
            const tocContainer = document.querySelector('.sidebar-toc');
            if (tocContainer) {
                const linkTop = correspondingLink.offsetTop;
                const containerTop = tocContainer.scrollTop;
                const containerHeight = tocContainer.offsetHeight;
                
                if (linkTop < containerTop || linkTop > containerTop + containerHeight) {
                    tocContainer.scrollTop = linkTop - containerHeight / 2;
                }
            }
        }
    }
}

/**
 * 初始化阅读进度条
 */
function initReadingProgress() {
    const progressBar = document.querySelector('.reading-progress-bar');
    
    if (progressBar) {
        window.addEventListener('scroll', function() {
            // 计算阅读进度百分比
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrollPosition = window.scrollY;
            const progress = (scrollPosition / documentHeight) * 100;
            
            // 更新进度条宽度
            progressBar.style.width = `${progress}%`;
        });
    }
}

/**
 * 初始化返回顶部按钮
 */
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        // 监听滚动事件，控制按钮显示/隐藏
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // 点击返回顶部
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * 初始化代码高亮
 */
function initCodeHighlight() {
    // 检查是否已加载Prism.js
    if (window.Prism) {
        Prism.highlightAll();
    } else {
        // 如果没有加载Prism.js，动态加载
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js';
        script.onload = function() {
            // 加载核心库后加载常用语言支持
            const languages = ['javascript', 'css', 'html', 'python', 'bash', 'json'];
            
            let loadedCount = 0;
            languages.forEach(lang => {
                const langScript = document.createElement('script');
                langScript.src = `https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-${lang}.min.js`;
                langScript.onload = function() {
                    loadedCount++;
                    if (loadedCount === languages.length) {
                        Prism.highlightAll();
                    }
                };
                document.head.appendChild(langScript);
            });
            
            // 加载样式
            const style = document.createElement('link');
            style.rel = 'stylesheet';
            style.href = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css';
            document.head.appendChild(style);
        };
        document.head.appendChild(script);
    }
    
    // 为代码块添加复制按钮
    addCopyButtons();
}

/**
 * 为代码块添加复制按钮
 */
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach(block => {
        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.title = '复制代码';
        
        // 添加复制功能
        copyButton.addEventListener('click', function() {
            const code = block.querySelector('code').innerText;
            
            // 使用Clipboard API复制文本
            navigator.clipboard.writeText(code).then(() => {
                // 复制成功，更改按钮状态
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                copyButton.classList.add('copied');
                
                // 2秒后恢复按钮状态
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    copyButton.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('复制失败:', err);
                copyButton.innerHTML = '<i class="fas fa-times"></i>';
                
                // 2秒后恢复按钮状态
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            });
        });
        
        // 将按钮添加到代码块
        block.style.position = 'relative';
        block.appendChild(copyButton);
    });
    
    // 添加复制按钮样式
    const style = document.createElement('style');
    style.textContent = `
        .copy-button {
            position: absolute;
            top: 5px;
            right: 5px;
            background-color: rgba(0, 0, 0, 0.3);
            color: #fff;
            border: none;
            border-radius: 4px;
            padding: 5px 8px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
            opacity: 0;
        }
        
        pre:hover .copy-button {
            opacity: 1;
        }
        
        .copy-button:hover {
            background-color: rgba(0, 0, 0, 0.5);
        }
        
        .copy-button.copied {
            background-color: #28a745;
        }
    `;
    document.head.appendChild(style);
}

/**
 * 初始化图片懒加载
 */
function initLazyLoading() {
    // 检查是否已有懒加载模块
    if (window.lazyLoadingModule) {
        window.lazyLoadingModule.init();
        return;
    }
    
    // 获取所有带有data-src属性的图片
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    // 如果没有需要懒加载的图片，直接返回
    if (lazyImages.length === 0) {
        return;
    }
    
    // 检查浏览器是否支持IntersectionObserver
    if ('IntersectionObserver' in window) {
        // 创建观察者实例
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    
                    // 设置图片源
                    lazyImage.src = lazyImage.dataset.src;
                    
                    // 图片加载完成后添加loaded类
                    lazyImage.onload = () => {
                        lazyImage.classList.add('loaded');
                        lazyImage.removeAttribute('data-src');
                    };
                    
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
        function lazyLoad() {
            lazyImages.forEach(lazyImage => {
                if (lazyImage.dataset.src) {
                    const rect = lazyImage.getBoundingClientRect();
                    const isInViewport = (
                        rect.top <= (window.innerHeight + 50) &&
                        rect.bottom >= 0
                    );
                    
                    if (isInViewport) {
                        lazyImage.src = lazyImage.dataset.src;
                        
                        lazyImage.onload = () => {
                            lazyImage.classList.add('loaded');
                            lazyImage.removeAttribute('data-src');
                        };
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
}

/**
 * 初始化文章导航（上一篇/下一篇）
 */
function initArticleNavigation() {
    // 这里可以添加AJAX加载上一篇/下一篇文章的功能
    // 或者预加载上一篇/下一篇文章的内容
    
    // 示例：为导航链接添加过渡效果
    const navLinks = document.querySelectorAll('.prev-article, .next-article');
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
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