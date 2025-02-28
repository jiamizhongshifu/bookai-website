// 文章列表功能模块
const Articles = {
    // 配置
    config: {
        articlesPerPage: 10,
        currentPage: 1,
        currentFilter: 'all',
        searchQuery: ''
    },

    // 初始化
    init() {
        this.loadArticles();
        this.setupEventListeners();
        this.loadCategories();
        this.loadTagCloud();
        this.loadPopularArticles();
    },

    // 加载文章列表
    async loadArticles() {
        try {
            const response = await fetch('/search-data.json');
            const articles = await response.json();
            
            // 过滤和排序文章
            let filteredArticles = this.filterArticles(articles);
            
            // 更新分页
            this.updatePagination(filteredArticles.length);
            
            // 显示当前页的文章
            this.displayArticles(filteredArticles);
        } catch (error) {
            console.error('加载文章失败:', error);
            this.showError('加载文章列表失败，请稍后重试');
        }
    },

    // 过滤文章
    filterArticles(articles) {
        return articles.filter(article => {
            // 根据搜索关键词过滤
            if (this.config.searchQuery) {
                const searchRegex = new RegExp(this.config.searchQuery, 'i');
                if (!searchRegex.test(article.title) && 
                    !searchRegex.test(article.description) && 
                    !searchRegex.test(article.content)) {
                    return false;
                }
            }
            
            // 根据分类过滤
            if (this.config.currentFilter !== 'all') {
                return article.category === this.config.currentFilter;
            }
            
            return true;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    // 显示文章列表
    displayArticles(articles) {
        const container = document.querySelector('.articles-list');
        const start = (this.config.currentPage - 1) * this.config.articlesPerPage;
        const end = start + this.config.articlesPerPage;
        const pageArticles = articles.slice(start, end);
        
        container.innerHTML = pageArticles.map(article => this.createArticleCard(article)).join('');
    },

    // 创建文章卡片HTML
    createArticleCard(article) {
        return `
            <article class="article-card">
                ${article.image ? `
                    <img src="${article.image}" alt="${article.title}" class="article-card-image">
                ` : ''}
                <div class="article-card-content">
                    <h2 class="article-card-title">
                        <a href="${article.url}">${article.title}</a>
                    </h2>
                    <div class="article-card-meta">
                        <span class="article-date">
                            <svg class="bi me-2" width="16" height="16" fill="currentColor">
                                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM4.5 7.5a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1h-5z"/>
                            </svg>
                            ${new Date(article.date).toLocaleDateString('zh-CN')}
                        </span>
                        <span class="article-category">
                            <svg class="bi me-2" width="16" height="16" fill="currentColor">
                                <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
                            </svg>
                            ${article.category}
                        </span>
                    </div>
                    <p class="article-card-excerpt">${article.description}</p>
                    <div class="article-card-tags">
                        ${article.tags.map(tag => `
                            <a href="/tags/${tag}" class="article-tag">${tag}</a>
                        `).join('')}
                    </div>
                </div>
            </article>
        `;
    },

    // 更新分页
    updatePagination(totalArticles) {
        const totalPages = Math.ceil(totalArticles / this.config.articlesPerPage);
        const pagination = document.querySelector('.articles-pagination ul');
        
        let paginationHTML = '';
        
        // 上一页
        paginationHTML += `
            <li class="page-item ${this.config.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.config.currentPage - 1}">
                    上一页
                </a>
            </li>
        `;
        
        // 页码
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${i === this.config.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        
        // 下一页
        paginationHTML += `
            <li class="page-item ${this.config.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.config.currentPage + 1}">
                    下一页
                </a>
            </li>
        `;
        
        pagination.innerHTML = paginationHTML;
    },

    // 加载分类列表
    async loadCategories() {
        try {
            const response = await fetch('/search-data.json');
            const articles = await response.json();
            
            // 统计每个分类的文章数量
            const categories = articles.reduce((acc, article) => {
                acc[article.category] = (acc[article.category] || 0) + 1;
                return acc;
            }, {});
            
            // 显示分类列表
            const container = document.querySelector('.categories-list');
            container.innerHTML = Object.entries(categories)
                .map(([category, count]) => `
                    <a href="#" class="category-item" data-category="${category}">
                        <span>${category}</span>
                        <span class="category-count">${count}</span>
                    </a>
                `).join('');
        } catch (error) {
            console.error('加载分类失败:', error);
        }
    },

    // 加载标签云
    async loadTagCloud() {
        try {
            const response = await fetch('/search-data.json');
            const articles = await response.json();
            
            // 统计标签出现次数
            const tagCounts = articles.reduce((acc, article) => {
                article.tags.forEach(tag => {
                    acc[tag] = (acc[tag] || 0) + 1;
                });
                return acc;
            }, {});
            
            // 计算标签权重
            const maxCount = Math.max(...Object.values(tagCounts));
            const tags = Object.entries(tagCounts).map(([tag, count]) => ({
                tag,
                weight: Math.ceil((count / maxCount) * 5)
            }));
            
            // 显示标签云
            const container = document.querySelector('.tags-cloud');
            container.innerHTML = tags
                .sort(() => Math.random() - 0.5) // 随机排序
                .map(({tag, weight}) => `
                    <a href="/tags/${tag}" class="tag-cloud-item" data-weight="${weight}">
                        ${tag}
                    </a>
                `).join('');
        } catch (error) {
            console.error('加载标签云失败:', error);
        }
    },

    // 加载热门文章
    async loadPopularArticles() {
        try {
            const response = await fetch('/search-data.json');
            const articles = await response.json();
            
            // 获取最新的5篇文章
            const popularArticles = articles
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5);
            
            // 显示热门文章
            const container = document.querySelector('.popular-articles');
            container.innerHTML = popularArticles.map(article => `
                <div class="popular-article-item">
                    ${article.image ? `
                        <img src="${article.image}" alt="${article.title}" class="popular-article-image">
                    ` : ''}
                    <div class="popular-article-content">
                        <h3 class="popular-article-title">
                            <a href="${article.url}">${article.title}</a>
                        </h3>
                        <div class="popular-article-meta">
                            ${new Date(article.date).toLocaleDateString('zh-CN')}
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('加载热门文章失败:', error);
        }
    },

    // 设置事件监听器
    setupEventListeners() {
        // 分类过滤
        document.querySelector('.articles-filter').addEventListener('click', e => {
            if (e.target.matches('[data-filter]')) {
                e.preventDefault();
                const filter = e.target.dataset.filter;
                
                // 更新按钮状态
                document.querySelectorAll('[data-filter]').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.filter === filter);
                });
                
                // 更新过滤器并重新加载文章
                this.config.currentFilter = filter;
                this.config.currentPage = 1;
                this.loadArticles();
            }
        });
        
        // 分页
        document.querySelector('.articles-pagination').addEventListener('click', e => {
            if (e.target.matches('.page-link')) {
                e.preventDefault();
                const page = parseInt(e.target.dataset.page);
                
                if (page && page !== this.config.currentPage) {
                    this.config.currentPage = page;
                    this.loadArticles();
                    
                    // 滚动到顶部
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            }
        });
        
        // 搜索
        document.querySelector('.search-form').addEventListener('submit', e => {
            e.preventDefault();
            const query = e.target.querySelector('input').value.trim();
            
            this.config.searchQuery = query;
            this.config.currentPage = 1;
            this.loadArticles();
        });
        
        // 分类点击
        document.querySelector('.categories-list').addEventListener('click', e => {
            if (e.target.matches('.category-item')) {
                e.preventDefault();
                const category = e.target.dataset.category;
                
                this.config.currentFilter = category;
                this.config.currentPage = 1;
                
                // 更新过滤器按钮状态
                document.querySelectorAll('[data-filter]').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.filter === category);
                });
                
                this.loadArticles();
            }
        });
    },

    // 显示错误信息
    showError(message) {
        const container = document.querySelector('.articles-list');
        container.innerHTML = `
            <div class="alert alert-danger" role="alert">
                ${message}
            </div>
        `;
    }
};

// 当页面加载完成时初始化文章列表功能
document.addEventListener('DOMContentLoaded', () => {
    Articles.init();
}); 