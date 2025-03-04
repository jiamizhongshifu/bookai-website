// 标签页面功能模块
const Tags = {
    // 配置
    config: {
        currentTag: '',
        searchQuery: ''
    },

    // 初始化
    init() {
        this.loadTagCloud();
        this.loadPopularTags();
        this.loadLatestArticles();
        this.setupEventListeners();
        
        // 从URL获取标签参数
        const urlParams = new URLSearchParams(window.location.search);
        const tag = urlParams.get('tag');
        if (tag) {
            this.showTagArticles(tag);
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
                count,
                weight: Math.ceil((count / maxCount) * 5)
            }));
            
            // 显示标签云
            const container = document.querySelector('.tags-cloud');
            container.innerHTML = tags
                .sort((a, b) => b.count - a.count)
                .map(({tag, count, weight}) => `
                    <a href="?tag=${encodeURIComponent(tag)}" 
                       class="tag-cloud-item" 
                       data-weight="${weight}"
                       data-tag="${tag}">
                        ${tag}
                        <span class="tag-count">${count}</span>
                    </a>
                `).join('');
        } catch (error) {
            console.error('加载标签云失败:', error);
            this.showError('加载标签云失败，请稍后重试');
        }
    },

    // 加载热门标签
    async loadPopularTags() {
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
            
            // 获取前10个最热门的标签
            const popularTags = Object.entries(tagCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10);
            
            // 显示热门标签
            const container = document.querySelector('.popular-tags');
            container.innerHTML = popularTags.map(([tag, count]) => `
                <a href="?tag=${encodeURIComponent(tag)}" 
                   class="popular-tag-item"
                   data-tag="${tag}">
                    ${tag}
                    <span class="tag-count">${count}</span>
                </a>
            `).join('');
        } catch (error) {
            console.error('加载热门标签失败:', error);
        }
    },

    // 加载最新文章
    async loadLatestArticles() {
        try {
            const response = await fetch('/search-data.json');
            const articles = await response.json();
            
            // 获取最新的5篇文章
            const latestArticles = articles
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5);
            
            // 显示最新文章
            const container = document.querySelector('.latest-articles');
            container.innerHTML = latestArticles.map(article => `
                <div class="latest-article-item">
                    ${article.image ? `
                        <img src="${article.image}" 
                             alt="${article.title}" 
                             class="latest-article-image">
                    ` : ''}
                    <div class="latest-article-content">
                        <h3 class="latest-article-title">
                            <a href="${article.url}">${article.title}</a>
                        </h3>
                        <div class="latest-article-meta">
                            ${new Date(article.date).toLocaleDateString('zh-CN')}
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('加载最新文章失败:', error);
        }
    },

    // 显示特定标签的文章
    async showTagArticles(tag) {
        try {
            const response = await fetch('/search-data.json');
            const articles = await response.json();
            
            // 更新当前标签
            this.config.currentTag = tag;
            
            // 过滤出包含该标签的文章
            const tagArticles = articles.filter(article => 
                article.tags.includes(tag)
            ).sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // 更新标题
            const titleElement = document.querySelector('.tag-title');
            titleElement.innerHTML = `
                标签: <span class="tag-name">${tag}</span>
                <small class="text-muted">(${tagArticles.length}篇文章)</small>
            `;
            
            // 显示文章列表
            const container = document.querySelector('.articles-list');
            if (tagArticles.length > 0) {
                container.innerHTML = tagArticles.map(article => this.createArticleCard(article)).join('');
            } else {
                container.innerHTML = `
                    <div class="alert alert-info">
                        暂无与标签 "${tag}" 相关的文章
                    </div>
                `;
            }
            
            // 更新URL，但不刷新页面
            const url = new URL(window.location);
            url.searchParams.set('tag', tag);
            window.history.pushState({}, '', url);
            
            // 滚动到文章列表
            document.querySelector('.tag-articles').scrollIntoView({
                behavior: 'smooth'
            });
        } catch (error) {
            console.error('加载标签文章失败:', error);
            this.showError('加载文章失败，请稍后重试');
        }
    },

    // 创建文章卡片HTML
    createArticleCard(article) {
        return `
            <article class="article-card">
                ${article.image ? `
                    <img src="${article.image}" 
                         alt="${article.title}" 
                         class="article-card-image">
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
                    </div>
                    <p class="article-card-excerpt">${article.description}</p>
                    <div class="article-card-tags">
                        ${article.tags.map(tag => `
                            <a href="?tag=${encodeURIComponent(tag)}" 
                               class="article-tag"
                               data-tag="${tag}">
                                ${tag}
                            </a>
                        `).join('')}
                    </div>
                </div>
            </article>
        `;
    },

    // 设置事件监听器
    setupEventListeners() {
        // 标签点击
        document.addEventListener('click', e => {
            const tagLink = e.target.closest('[data-tag]');
            if (tagLink) {
                e.preventDefault();
                const tag = tagLink.dataset.tag;
                this.showTagArticles(tag);
            }
        });
        
        // 搜索
        document.querySelector('.search-form').addEventListener('submit', e => {
            e.preventDefault();
            const query = e.target.querySelector('input').value.trim();
            
            if (query) {
                this.searchTags(query);
            }
        });
    },

    // 搜索标签
    searchTags(query) {
        const tagItems = document.querySelectorAll('.tag-cloud-item');
        const searchRegex = new RegExp(query, 'i');
        
        tagItems.forEach(item => {
            const tag = item.dataset.tag;
            if (searchRegex.test(tag)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
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

// 当页面加载完成时初始化标签功能
document.addEventListener('DOMContentLoaded', () => {
    Tags.init();
}); 