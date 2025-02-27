// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单切换
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
    
    // 点击页面其他区域关闭菜单
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.mobile-menu-toggle') && !event.target.closest('.main-nav')) {
            if (mainNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
            }
        }
    });
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // 减去头部高度
                    behavior: 'smooth'
                });
                
                // 如果在移动端，点击后关闭菜单
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                }
            }
        });
    });
    
    // 滚动时添加头部阴影效果
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 10) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // 添加卡片动画效果
    const cards = document.querySelectorAll('.tutorial-card, .resource-card, .app-card');
    if (cards.length > 0) {
        // 简单的入场动画
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }
    
    // 深色模式切换功能
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        // 检查本地存储中的深色模式设置
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        
        // 根据设置应用深色模式
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.querySelector('i').classList.remove('fa-moon');
            darkModeToggle.querySelector('i').classList.add('fa-sun');
        }
        
        // 切换深色模式
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            
            // 更新图标
            if (isDark) {
                this.querySelector('i').classList.remove('fa-moon');
                this.querySelector('i').classList.add('fa-sun');
            } else {
                this.querySelector('i').classList.remove('fa-sun');
                this.querySelector('i').classList.add('fa-moon');
            }
            
            // 保存设置到本地存储
            localStorage.setItem('darkMode', isDark);
        });
    }
    
    // 搜索功能
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (searchForm && searchInput) {
        // 缓存搜索数据
        let searchData = null;
        let searchDataLoaded = false;
        
        // 预加载搜索数据
        fetch('/search-data.json')
            .then(response => response.json())
            .then(data => {
                searchData = data;
                searchDataLoaded = true;
            })
            .catch(error => {
                console.error('搜索数据加载失败:', error);
            });
        
        // 输入事件监听，实现实时搜索提示
        searchInput.addEventListener('input', debounce(function() {
            const query = this.value.trim().toLowerCase();
            
            if (query.length < 2) {
                if (searchResults) {
                    searchResults.style.display = 'none';
                }
                return;
            }
            
            if (!searchDataLoaded) {
                if (searchResults) {
                    searchResults.innerHTML = '<p>正在加载搜索数据...</p>';
                    searchResults.style.display = 'block';
                }
                return;
            }
            
            // 过滤搜索结果，最多显示5个
            const filteredResults = searchData.filter(item => {
                const titleMatch = item.title.toLowerCase().includes(query);
                const contentMatch = item.content.toLowerCase().includes(query);
                const tagsMatch = item.tags && item.tags.some(tag => 
                    tag.toLowerCase().includes(query)
                );
                const categoryMatch = item.categories && item.categories.some(category => 
                    category.toLowerCase().includes(query)
                );
                
                return titleMatch || contentMatch || tagsMatch || categoryMatch;
            }).slice(0, 5);
            
            // 显示搜索结果
            if (searchResults) {
                if (filteredResults.length > 0) {
                    let resultsHTML = '<ul>';
                    filteredResults.forEach(result => {
                        // 高亮标题中的匹配
                        let highlightedTitle = result.title;
                        const titleRegex = new RegExp(query, 'gi');
                        highlightedTitle = highlightedTitle.replace(titleRegex, match => `<mark>${match}</mark>`);
                        
                        resultsHTML += `
                            <li>
                                <a href="${result.url}">
                                    <h4>${highlightedTitle}</h4>
                                    <p>${result.excerpt}</p>
                                </a>
                            </li>
                        `;
                    });
                    resultsHTML += '</ul>';
                    
                    if (filteredResults.length >= 5) {
                        resultsHTML += `<div class="search-more"><a href="/search.html?q=${encodeURIComponent(query)}">查看更多结果</a></div>`;
                    }
                    
                    searchResults.innerHTML = resultsHTML;
                } else {
                    searchResults.innerHTML = '<p>没有找到相关结果</p>';
                }
                searchResults.style.display = 'block';
            }
        }, 300));
        
        // 表单提交事件
        searchForm.addEventListener('submit', function(e) {
            const query = searchInput.value.trim();
            
            if (query.length < 2) {
                e.preventDefault();
                alert('请输入至少2个字符进行搜索');
            }
        });
        
        // 点击页面其他区域关闭搜索结果
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.search-container') && searchResults) {
                searchResults.style.display = 'none';
            }
        });
    }
    
    // 防抖函数
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
    
    // 计算阅读时间
    function calculateReadingTime() {
        const articleContent = document.getElementById('articleContent');
        const readingTimeElement = document.querySelector('.article-reading-time');
        
        if (!articleContent || !readingTimeElement) return;
        
        // 获取文章内容
        const text = articleContent.textContent || articleContent.innerText;
        
        // 计算字数
        const wordCount = text.trim().replace(/\s+/g, ' ').split(' ').length;
        
        // 中文阅读速度：约300字/分钟
        // 英文阅读速度：约200词/分钟
        // 这里我们使用中文计算方式
        const chineseCharCount = text.replace(/\s+/g, '').length;
        const readingTime = Math.ceil(chineseCharCount / 300);
        
        // 更新阅读时间显示
        readingTimeElement.textContent = `${readingTime} 分钟阅读`;
    }
    
    // 在页面加载完成后计算阅读时间
    calculateReadingTime();
    
    // 评论系统
    const commentForm = document.querySelector('.comment-form');
    const commentsList = document.querySelector('.comments-list');
    
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = this.querySelector('input[name="name"]');
            const commentInput = this.querySelector('textarea[name="comment"]');
            
            if (!nameInput || !commentInput) return;
            
            const name = nameInput.value.trim();
            const comment = commentInput.value.trim();
            
            if (name === '' || comment === '') {
                alert('请填写姓名和评论内容');
                return;
            }
            
            // 创建新评论
            if (commentsList) {
                const newComment = document.createElement('div');
                newComment.className = 'comment';
                
                const date = new Date();
                const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
                
                newComment.innerHTML = `
                    <div class="comment-header">
                        <h4>${name}</h4>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="comment-content">
                        <p>${comment}</p>
                    </div>
                `;
                
                commentsList.appendChild(newComment);
                
                // 清空表单
                nameInput.value = '';
                commentInput.value = '';
                
                // 保存评论到本地存储（实际项目中应该保存到数据库）
                saveComments();
            }
        });
        
        // 加载评论
        loadComments();
    }
    
    // 保存评论到本地存储
    function saveComments() {
        if (!commentsList) return;
        
        const comments = [];
        const commentElements = commentsList.querySelectorAll('.comment');
        
        commentElements.forEach(comment => {
            const name = comment.querySelector('h4').textContent;
            const date = comment.querySelector('span').textContent;
            const content = comment.querySelector('p').textContent;
            
            comments.push({ name, date, content });
        });
        
        // 获取当前页面URL作为键
        const pageUrl = window.location.pathname;
        localStorage.setItem(`comments_${pageUrl}`, JSON.stringify(comments));
    }
    
    // 从本地存储加载评论
    function loadComments() {
        if (!commentsList) return;
        
        // 获取当前页面URL作为键
        const pageUrl = window.location.pathname;
        const savedComments = localStorage.getItem(`comments_${pageUrl}`);
        
        if (savedComments) {
            const comments = JSON.parse(savedComments);
            
            comments.forEach(comment => {
                const newComment = document.createElement('div');
                newComment.className = 'comment';
                
                newComment.innerHTML = `
                    <div class="comment-header">
                        <h4>${comment.name}</h4>
                        <span>${comment.date}</span>
                    </div>
                    <div class="comment-content">
                        <p>${comment.content}</p>
                    </div>
                `;
                
                commentsList.appendChild(newComment);
            });
        }
    }
    
    // 侧边栏浮动广告模块功能
    const floatingAd = document.getElementById('floatingAd');
    const adToggle = document.getElementById('adToggle');
    const adToggleCollapsed = document.getElementById('adToggleCollapsed');
    const adGrid = document.getElementById('adGrid');
    
    // 默认广告数据
    const defaultAds = [
        {
            id: 1,
            title: 'ChatGPT Plus会员',
            description: '解锁AI对话的无限可能',
            image: 'https://via.placeholder.com/150x100?text=ChatGPT+Plus',
            link: '#'
        },
        {
            id: 2,
            title: 'Midjourney高级账户',
            description: 'AI绘画神器，释放创意',
            image: 'https://via.placeholder.com/150x100?text=Midjourney',
            link: '#'
        },
        {
            id: 3,
            title: 'Claude Pro订阅',
            description: '体验更强大的AI助手',
            image: 'https://via.placeholder.com/150x100?text=Claude+Pro',
            link: '#'
        },
        {
            id: 4,
            title: 'AI学习资源包',
            description: '从入门到精通的完整指南',
            image: 'https://via.placeholder.com/150x100?text=AI+学习资源',
            link: '#'
        }
    ];
    
    // 从本地存储加载广告数据
    function loadAds() {
        const savedAds = localStorage.getItem('adData');
        return savedAds ? JSON.parse(savedAds) : defaultAds;
    }
    
    // 保存广告数据到本地存储
    function saveAds(ads) {
        localStorage.setItem('adData', JSON.stringify(ads));
    }
    
    // 渲染广告内容
    function renderAds() {
        const ads = loadAds();
        if (!adGrid) return;
        
        adGrid.innerHTML = '';
        
        ads.forEach(ad => {
            const adItem = document.createElement('div');
            adItem.className = 'ad-item';
            adItem.innerHTML = `
                <img src="${ad.image}" alt="${ad.title}" class="ad-image">
                <div class="ad-info">
                    <h4>${ad.title}</h4>
                    <p>${ad.description}</p>
                    <a href="${ad.link}" class="ad-link" target="_blank">了解更多</a>
                </div>
            `;
            adGrid.appendChild(adItem);
        });
    }
    
    // 初始化广告模块
    function initAds() {
        if (!floatingAd || !adToggle || !adToggleCollapsed) return;
        
        renderAds();
        
        // 检查广告模块状态
        const isCollapsed = localStorage.getItem('adCollapsed') === 'true';
        if (isCollapsed) {
            floatingAd.classList.add('collapsed');
            adToggleCollapsed.style.display = 'flex';
        }
        
        // 切换广告模块展开/收起状态
        adToggle.addEventListener('click', () => {
            floatingAd.classList.add('collapsed');
            adToggleCollapsed.style.display = 'flex';
            localStorage.setItem('adCollapsed', 'true');
        });
        
        // 展开广告模块
        adToggleCollapsed.addEventListener('click', () => {
            floatingAd.classList.remove('collapsed');
            adToggleCollapsed.style.display = 'none';
            localStorage.setItem('adCollapsed', 'false');
        });
    }
    
    // 管理员功能：更新广告
    function initAdminFeatures() {
        // 检查是否在管理页面
        if (window.location.pathname.includes('/admin')) {
            // 创建广告管理界面
            const adminContainer = document.createElement('div');
            adminContainer.className = 'admin-ad-container';
            adminContainer.innerHTML = `
                <h2>广告位管理</h2>
                <div id="adManager"></div>
                <button id="saveAdsBtn" class="btn btn-primary">保存更改</button>
            `;
            
            // 添加到页面
            const adminContent = document.querySelector('.admin-content');
            if (adminContent) {
                adminContent.appendChild(adminContainer);
                
                // 渲染广告管理界面
                const adManager = document.getElementById('adManager');
                const saveAdsBtn = document.getElementById('saveAdsBtn');
                
                // 加载当前广告
                const currentAds = loadAds();
                
                // 创建编辑表单
                adManager.innerHTML = '';
                currentAds.forEach((ad, index) => {
                    const adForm = document.createElement('div');
                    adForm.className = 'ad-form';
                    adForm.innerHTML = `
                        <h3>广告 #${index + 1}</h3>
                        <div class="form-group">
                            <label>标题</label>
                            <input type="text" class="ad-title" value="${ad.title}">
                        </div>
                        <div class="form-group">
                            <label>描述</label>
                            <input type="text" class="ad-description" value="${ad.description}">
                        </div>
                        <div class="form-group">
                            <label>图片URL</label>
                            <input type="text" class="ad-image" value="${ad.image}">
                        </div>
                        <div class="form-group">
                            <label>链接URL</label>
                            <input type="text" class="ad-link" value="${ad.link}">
                        </div>
                    `;
                    adManager.appendChild(adForm);
                });
                
                // 保存更改
                saveAdsBtn.addEventListener('click', () => {
                    const adForms = document.querySelectorAll('.ad-form');
                    const updatedAds = Array.from(adForms).map((form, index) => {
                        return {
                            id: currentAds[index].id,
                            title: form.querySelector('.ad-title').value,
                            description: form.querySelector('.ad-description').value,
                            image: form.querySelector('.ad-image').value,
                            link: form.querySelector('.ad-link').value
                        };
                    });
                    
                    saveAds(updatedAds);
                    alert('广告设置已保存！');
                });
            }
        }
    }
    
    // 初始化广告功能
    initAds();
    initAdminFeatures();
    
    // 阅读进度指示器
    initReadingProgress();
    
    // 返回顶部按钮
    initBackToTop();
    
    // 文章评分系统
    initArticleRating();
    
    // 初始化文章目录
    initArticleToc();
    
    // 初始化热门文章轮播
    initCarousel();
    
    // 初始化文章阅读量统计
    initArticleViews();
});

// 初始化阅读进度指示器
function initReadingProgress() {
    const progressBar = document.getElementById('readingProgressBar');
    if (!progressBar) return;
    
    window.addEventListener('scroll', function() {
        // 计算滚动百分比
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // 更新进度条宽度
        progressBar.style.width = scrollPercent + '%';
    });
}

// 初始化返回顶部按钮
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;
    
    // 滚动事件监听
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // 点击事件
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 初始化文章评分系统
function initArticleRating() {
    const ratingStars = document.getElementById('ratingStars');
    const ratingCount = document.getElementById('ratingCount');
    if (!ratingStars || !ratingCount) return;
    
    // 获取当前页面URL作为评分的唯一标识
    const pageUrl = window.location.pathname;
    
    // 从本地存储获取评分数据
    let ratingsData = JSON.parse(localStorage.getItem('articleRatings')) || {};
    
    // 如果当前页面没有评分数据，初始化
    if (!ratingsData[pageUrl]) {
        ratingsData[pageUrl] = {
            totalRating: 0,
            ratingCount: 0,
            userRating: 0
        };
    }
    
    // 更新评分显示
    updateRatingDisplay(ratingsData[pageUrl]);
    
    // 为每个星星添加点击事件
    const stars = ratingStars.querySelectorAll('i');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            
            // 如果用户已经评分，减去之前的评分
            if (ratingsData[pageUrl].userRating > 0) {
                ratingsData[pageUrl].totalRating -= ratingsData[pageUrl].userRating;
                ratingsData[pageUrl].ratingCount--;
            }
            
            // 添加新评分
            ratingsData[pageUrl].totalRating += rating;
            ratingsData[pageUrl].ratingCount++;
            ratingsData[pageUrl].userRating = rating;
            
            // 更新本地存储
            localStorage.setItem('articleRatings', JSON.stringify(ratingsData));
            
            // 更新评分显示
            updateRatingDisplay(ratingsData[pageUrl]);
        });
        
        // 鼠标悬停效果
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(stars, rating);
        });
        
        star.addEventListener('mouseout', function() {
            highlightStars(stars, ratingsData[pageUrl].userRating);
        });
    });
}

// 更新评分显示
function updateRatingDisplay(ratingData) {
    const ratingStars = document.getElementById('ratingStars');
    const ratingCount = document.getElementById('ratingCount');
    if (!ratingStars || !ratingCount) return;
    
    const stars = ratingStars.querySelectorAll('i');
    const averageRating = ratingData.ratingCount > 0 ? ratingData.totalRating / ratingData.ratingCount : 0;
    
    // 更新星星显示
    highlightStars(stars, ratingData.userRating);
    
    // 更新评分计数
    ratingCount.textContent = `(${ratingData.ratingCount} 评分, 平均 ${averageRating.toFixed(1)})`;
}

// 高亮星星
function highlightStars(stars, rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}

// 初始化文章目录
function initArticleToc() {
    const articleContent = document.getElementById('articleContent');
    const tocContent = document.getElementById('tocContent');
    const tocToggle = document.getElementById('tocToggle');
    
    if (!articleContent || !tocContent) return;
    
    // 获取所有标题元素
    const headings = articleContent.querySelectorAll('h2, h3, h4');
    
    if (headings.length === 0) {
        // 如果没有标题，隐藏目录
        const articleToc = document.getElementById('articleToc');
        if (articleToc) {
            articleToc.style.display = 'none';
        }
        return;
    }
    
    // 生成目录HTML
    let tocHtml = '<ul>';
    let prevLevel = 2;
    let levelStack = []; // 用于跟踪嵌套级别
    
    headings.forEach((heading, index) => {
        // 为每个标题添加ID，如果没有的话
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        
        const level = parseInt(heading.tagName.substring(1));
        const text = heading.textContent;
        
        // 处理嵌套
        if (level > prevLevel) {
            tocHtml += '<ul>';
            levelStack.push(prevLevel);
        } else if (level < prevLevel) {
            // 关闭之前的嵌套
            while (levelStack.length > 0 && levelStack[levelStack.length - 1] >= level) {
                tocHtml += '</ul>';
                levelStack.pop();
            }
        }
        
        tocHtml += `<li><a href="#${heading.id}" data-id="${heading.id}">${text}</a></li>`;
        prevLevel = level;
    });
    
    // 关闭所有剩余的嵌套
    while (levelStack.length > 0) {
        tocHtml += '</ul>';
        levelStack.pop();
    }
    
    tocHtml += '</ul>';
    
    // 添加目录到页面
    tocContent.innerHTML = tocHtml;
    
    // 添加目录切换功能
    if (tocToggle) {
        tocToggle.addEventListener('click', function() {
            tocContent.classList.toggle('collapsed');
            this.classList.toggle('collapsed');
            
            // 保存用户偏好
            const isCollapsed = tocContent.classList.contains('collapsed');
            localStorage.setItem('tocCollapsed', isCollapsed);
        });
        
        // 检查用户偏好
        const isCollapsed = localStorage.getItem('tocCollapsed') === 'true';
        if (isCollapsed) {
            tocContent.classList.add('collapsed');
            tocToggle.classList.add('collapsed');
        }
    }
    
    // 添加滚动监听，高亮当前标题
    window.addEventListener('scroll', highlightTocOnScroll);
    
    // 为目录链接添加点击事件
    const tocLinks = tocContent.querySelectorAll('a');
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // 平滑滚动到目标位置
                window.scrollTo({
                    top: targetElement.offsetTop - 100, // 减去头部高度和一些额外空间
                    behavior: 'smooth'
                });
                
                // 更新URL哈希，但不触发滚动
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // 初始检查URL哈希
    if (window.location.hash) {
        setTimeout(() => {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
}

// 高亮当前滚动位置的目录项
function highlightTocOnScroll() {
    const articleContent = document.getElementById('articleContent');
    const tocContent = document.getElementById('tocContent');
    
    if (!articleContent || !tocContent) return;
    
    const headings = articleContent.querySelectorAll('h2, h3, h4');
    const tocLinks = tocContent.querySelectorAll('a');
    
    if (headings.length === 0 || tocLinks.length === 0) return;
    
    // 获取当前滚动位置
    const scrollPosition = window.scrollY;
    
    // 找到当前可见的标题
    let currentHeadingIndex = -1;
    
    headings.forEach((heading, index) => {
        const headingTop = heading.offsetTop - 120; // 减去头部高度和一些额外空间
        
        if (scrollPosition >= headingTop) {
            currentHeadingIndex = index;
        }
    });
    
    // 移除所有活动类
    tocLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // 如果找到当前标题，添加活动类
    if (currentHeadingIndex >= 0 && currentHeadingIndex < tocLinks.length) {
        tocLinks[currentHeadingIndex].classList.add('active');
    }
}

/**
 * 初始化热门文章轮播功能
 */
function initCarousel() {
    const track = document.querySelector('.carousel-slides');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    if (!track || slides.length === 0) return;
    
    let currentIndex = 0;
    let slideWidth = slides[0].getBoundingClientRect().width;
    let slidesToShow = getSlidesToShow();
    let maxIndex = Math.max(0, slides.length - slidesToShow);
    
    // 监听窗口大小变化，重新计算轮播参数
    window.addEventListener('resize', debounce(function() {
        slideWidth = slides[0].getBoundingClientRect().width;
        slidesToShow = getSlidesToShow();
        maxIndex = Math.max(0, slides.length - slidesToShow);
        
        // 确保当前索引不超过最大索引
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }
        
        updateCarousel();
    }, 250));
    
    // 根据窗口宽度确定显示的幻灯片数量
    function getSlidesToShow() {
        const windowWidth = window.innerWidth;
        if (windowWidth < 768) return 1;
        if (windowWidth < 992) return 2;
        return 3;
    }
    
    // 更新轮播位置
    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        
        // 更新指示器状态
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        // 更新按钮状态
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === maxIndex;
        
        // 视觉反馈
        prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextButton.style.opacity = currentIndex === maxIndex ? '0.5' : '1';
    }
    
    // 移动到指定幻灯片
    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateCarousel();
    }
    
    // 上一张幻灯片
    function goToPrev() {
        goToSlide(currentIndex - 1);
    }
    
    // 下一张幻灯片
    function goToNext() {
        goToSlide(currentIndex + 1);
    }
    
    // 添加事件监听器
    prevButton.addEventListener('click', goToPrev);
    nextButton.addEventListener('click', goToNext);
    
    // 指示器点击事件
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });
    
    // 触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50; // 最小滑动距离
        if (touchStartX - touchEndX > swipeThreshold) {
            // 向左滑动，显示下一张
            goToNext();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // 向右滑动，显示上一张
            goToPrev();
        }
    }
    
    // 自动轮播
    let autoplayInterval;
    
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            if (currentIndex < maxIndex) {
                goToNext();
            } else {
                goToSlide(0); // 回到第一张
            }
        }, 5000); // 5秒切换一次
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // 鼠标悬停时暂停自动轮播
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', stopAutoplay);
    carouselContainer.addEventListener('mouseleave', startAutoplay);
    
    // 触摸时暂停自动轮播
    carouselContainer.addEventListener('touchstart', stopAutoplay, { passive: true });
    carouselContainer.addEventListener('touchend', startAutoplay, { passive: true });
    
    // 初始化
    updateCarousel();
    startAutoplay();
}

/**
 * 初始化文章阅读量统计
 */
function initArticleViews() {
    const articleViewsElement = document.getElementById('articleViews');
    if (!articleViewsElement) return;
    
    const articleId = window.location.pathname;
    
    // 从本地存储获取阅读量数据
    let viewsData = JSON.parse(localStorage.getItem('articleViews')) || {};
    
    // 如果是新文章，初始化阅读量
    if (!viewsData[articleId]) {
        viewsData[articleId] = {
            count: 0,
            lastViewed: null
        };
    }
    
    const now = new Date().getTime();
    const lastViewed = viewsData[articleId].lastViewed;
    
    // 如果是首次访问或距离上次访问超过1小时，增加阅读量
    if (!lastViewed || (now - lastViewed > 3600000)) {
        viewsData[articleId].count++;
        viewsData[articleId].lastViewed = now;
        
        // 保存到本地存储
        localStorage.setItem('articleViews', JSON.stringify(viewsData));
    }
    
    // 更新显示
    articleViewsElement.textContent = viewsData[articleId].count;
} 