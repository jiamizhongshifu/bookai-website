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
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim().toLowerCase();
            
            if (query.length < 2) {
                if (searchResults) {
                    searchResults.innerHTML = '<p>请输入至少2个字符进行搜索</p>';
                    searchResults.style.display = 'block';
                }
                return;
            }
            
            // 模拟搜索结果（实际项目中应该从数据库或API获取）
            const articles = [
                { title: 'Deepseek简介', url: '#', excerpt: '了解Deepseek AI的基本功能和使用方法' },
                { title: 'DeepSeek使用技巧', url: 'deepseek-tips.html', excerpt: '全面的DeepSeek使用技巧和最佳实践' },
                { title: '我用DeepSeek流量赚到的第一笔钱', url: 'deepseek-money.html', excerpt: '如何利用DeepSeek进行联盟营销赚取收入' },
                { title: 'DeepSeek太卡了？这有5+1种DeepSeek R1最强满血替代方案', url: 'deepseek-alt.html', excerpt: '探索DeepSeek的替代方案和解决方法' },
                { title: 'ChatGPT使用指南', url: 'chatgpt-guide.html', excerpt: 'ChatGPT的基本使用方法和高级技巧' },
                { title: 'Cursor编程助手教程', url: 'cursor-tutorial.html', excerpt: '如何使用Cursor提升编程效率' }
            ];
            
            // 过滤搜索结果
            const filteredResults = articles.filter(article => 
                article.title.toLowerCase().includes(query) || 
                article.excerpt.toLowerCase().includes(query)
            );
            
            // 显示搜索结果
            if (searchResults) {
                if (filteredResults.length > 0) {
                    let resultsHTML = '<ul>';
                    filteredResults.forEach(result => {
                        resultsHTML += `
                            <li>
                                <a href="${result.url}">
                                    <h4>${result.title}</h4>
                                    <p>${result.excerpt}</p>
                                </a>
                            </li>
                        `;
                    });
                    resultsHTML += '</ul>';
                    searchResults.innerHTML = resultsHTML;
                } else {
                    searchResults.innerHTML = '<p>没有找到相关结果</p>';
                }
                searchResults.style.display = 'block';
            }
        });
        
        // 点击页面其他区域关闭搜索结果
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.search-container') && searchResults) {
                searchResults.style.display = 'none';
            }
        });
    }
    
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
}); 