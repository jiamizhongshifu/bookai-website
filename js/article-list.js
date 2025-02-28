/**
 * 文章列表页面JavaScript
 * 实现AJAX异步加载和分页功能
 */

// 模拟文章数据（实际项目中应从服务器获取）
const articleData = [
    {
        id: 1,
        title: "ChatGPT从零精通：万字长文教你玩转提示词工程",
        summary: "学习如何编写高效的提示词，让ChatGPT输出更精准的内容。本文详细介绍了提示词工程的核心原则和实践技巧。",
        date: "2024-02-25",
        views: 12543,
        category: "ChatGPT",
        url: "chatgpt-prompt-engineering.html"
    },
    {
        id: 2,
        title: "Cursor终极指南：AI写代码比Copilot更强？",
        summary: "全面了解Cursor的功能和使用技巧，提升编程效率。本文对比了Cursor与其他AI编程助手的优缺点。",
        date: "2024-02-22",
        views: 8347,
        category: "Cursor",
        url: "cursor-ultimate-guide.html"
    },
    {
        id: 3,
        title: "爆肝50小时，DeepSeek使用技巧，你收藏这一篇就够了！",
        summary: "全面的DeepSeek使用技巧和最佳实践，从基础操作到高级应用，一篇文章全部掌握。",
        date: "2024-02-20",
        views: 6723,
        category: "DeepSeek",
        url: "deepseek-tips.html"
    },
    {
        id: 4,
        title: "ChatGPT被封号怎么办？2024最新国内访问稳定方案",
        summary: "解决ChatGPT访问限制问题的完整指南，包括账号注册、稳定访问和防封号技巧。",
        date: "2024-02-18",
        views: 5921,
        category: "ChatGPT",
        url: "chatgpt-access-solutions.html"
    },
    {
        id: 5,
        title: "GPTs商店完全指南：创建、使用与变现自定义GPT",
        summary: "学习如何创建和使用自定义GPT，并探索变现机会。从零开始打造你的AI助手并获得收益。",
        date: "2024-02-15",
        views: 4231,
        category: "ChatGPT",
        url: "gpts-store-guide.html"
    },
    {
        id: 6,
        title: "DeepSeek新手必看：从注册到API调用的完整指南",
        summary: "学习如何注册和使用DeepSeek，包括API调用方法。本文适合刚接触DeepSeek的新手用户。",
        date: "2024-02-12",
        views: 3876,
        category: "DeepSeek",
        url: "deepseek-guide.html"
    },
    {
        id: 7,
        title: "Cursor中文配置教程：如何用本地模型替代GPT-4？",
        summary: "学习如何配置Cursor使用中文本地模型，提高响应速度，降低使用成本，提升开发效率。",
        date: "2024-02-10",
        views: 3542,
        category: "Cursor",
        url: "cursor-chinese-config.html"
    },
    {
        id: 8,
        title: "Cursor与GitHub Copilot对比：开发者真实体验报告",
        summary: "详细对比两款AI编程助手的优缺点，帮助你做出选择。基于实际项目开发的真实体验分享。",
        date: "2024-02-08",
        views: 3128,
        category: "Cursor",
        url: "cursor-vs-copilot.html"
    },
    {
        id: 9,
        title: "DeepSeek高阶用法：如何用MoE架构优化企业级AI应用？",
        summary: "探索DeepSeek的高级功能和企业级应用场景，了解混合专家模型如何提升AI应用性能。",
        date: "2024-02-05",
        views: 2876,
        category: "DeepSeek",
        url: "deepseek-advanced.html"
    },
    {
        id: 10,
        title: "ChatGPT变现案例分析：10个普通人月入过万的实操方法",
        summary: "分析10个利用ChatGPT实现收入增长的真实案例，从内容创作到自动化服务，适合各类用户。",
        date: "2024-02-02",
        views: 2543,
        category: "ChatGPT",
        url: "chatgpt-monetization-cases.html"
    },
    {
        id: 11,
        title: "Cursor团队协作指南：如何提升10人以上团队的开发效率",
        summary: "探讨Cursor在团队环境中的应用策略，包括代码共享、协作编程和知识管理的最佳实践。",
        date: "2024-01-30",
        views: 2187,
        category: "Cursor",
        url: "cursor-team-efficiency.html"
    },
    {
        id: 12,
        title: "Monica与DeepSeek结合使用：打造最强AI助手工作流",
        summary: "详解如何将Monica与DeepSeek结合使用，创建高效的AI辅助工作流程，提升工作效率。",
        date: "2024-01-28",
        views: 1986,
        category: "DeepSeek",
        url: "monica-deepseek.html"
    }
];

// 全局变量
let currentPage = 1;
const itemsPerPage = 10;
let currentCategory = "all";
let currentSort = "newest";
let filteredArticles = [...articleData];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化文章列表
    initArticleList();
    
    // 初始化分页
    setupPagination();
    
    // 初始化筛选和排序
    setupFilters();
});

/**
 * 初始化文章列表
 */
function initArticleList() {
    // 应用筛选和排序
    applyFiltersAndSort();
    
    // 模拟AJAX加载延迟
    showLoadingSpinner();
    
    setTimeout(() => {
        // 渲染文章列表
        renderArticleList();
        hideLoadingSpinner();
    }, 800); // 模拟网络延迟
}

/**
 * 应用筛选和排序
 */
function applyFiltersAndSort() {
    // 筛选文章
    if (currentCategory === "all") {
        filteredArticles = [...articleData];
    } else {
        filteredArticles = articleData.filter(article => article.category === currentCategory);
    }
    
    // 排序文章
    switch (currentSort) {
        case "newest":
            filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case "oldest":
            filteredArticles.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case "popular":
            filteredArticles.sort((a, b) => b.views - a.views);
            break;
    }
}

/**
 * 渲染文章列表
 */
function renderArticleList() {
    const articleList = document.getElementById('article-list');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredArticles.length);
    const currentPageArticles = filteredArticles.slice(startIndex, endIndex);
    
    // 清空列表容器（除了加载动画）
    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) {
        articleList.innerHTML = '';
        articleList.appendChild(loadingSpinner);
        loadingSpinner.style.display = 'none';
    } else {
        articleList.innerHTML = '';
    }
    
    // 如果没有文章
    if (currentPageArticles.length === 0) {
        const noArticles = document.createElement('div');
        noArticles.className = 'text-center py-5';
        noArticles.innerHTML = '<p>没有找到符合条件的文章</p>';
        articleList.appendChild(noArticles);
        return;
    }
    
    // 创建文章列表
    currentPageArticles.forEach(article => {
        const articleItem = document.createElement('div');
        articleItem.className = 'article-item';
        
        // 格式化日期
        const formattedDate = formatDate(article.date);
        
        // 格式化阅读量
        const formattedViews = formatViews(article.views);
        
        articleItem.innerHTML = `
            <h5><a href="${article.url}" class="article-title">${article.title}</a></h5>
            <p class="article-summary">${article.summary}</p>
            <div class="article-meta">
                <div class="article-views">
                    <i class="fas fa-eye"></i> ${formattedViews}
                </div>
                <div class="article-date">${formattedDate}</div>
            </div>
        `;
        
        articleList.appendChild(articleItem);
    });
    
    // 更新分页
    updatePagination();
}

/**
 * 设置分页
 */
function setupPagination() {
    const pagination = document.getElementById('pagination');
    
    // 监听分页点击事件
    pagination.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (e.target.tagName === 'A') {
            const pageLink = e.target;
            
            // 上一页
            if (pageLink.textContent === '上一页') {
                if (currentPage > 1) {
                    currentPage--;
                    initArticleList();
                }
                return;
            }
            
            // 下一页
            if (pageLink.textContent === '下一页') {
                const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    initArticleList();
                }
                return;
            }
            
            // 数字页码
            if (pageLink.dataset.page) {
                currentPage = parseInt(pageLink.dataset.page);
                initArticleList();
            }
        }
    });
}

/**
 * 更新分页控件
 */
function updatePagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    
    // 清空分页
    pagination.innerHTML = '';
    
    // 上一页按钮
    const prevItem = document.createElement('li');
    prevItem.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevItem.innerHTML = `<a class="page-link" href="#" ${currentPage === 1 ? 'tabindex="-1" aria-disabled="true"' : ''}>上一页</a>`;
    pagination.appendChild(prevItem);
    
    // 页码按钮
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
        pageItem.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
        pagination.appendChild(pageItem);
    }
    
    // 下一页按钮
    const nextItem = document.createElement('li');
    nextItem.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextItem.innerHTML = `<a class="page-link" href="#" ${currentPage === totalPages ? 'tabindex="-1" aria-disabled="true"' : ''}>下一页</a>`;
    pagination.appendChild(nextItem);
}

/**
 * 设置筛选和排序
 */
function setupFilters() {
    // 分类筛选
    const categoryDropdown = document.getElementById('categoryDropdown');
    const categoryItems = document.querySelectorAll('.dropdown-menu[aria-labelledby="categoryDropdown"] .dropdown-item');
    
    categoryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 更新按钮文本
            categoryDropdown.textContent = this.textContent;
            
            // 更新当前分类
            if (this.textContent === '全部分类') {
                currentCategory = 'all';
            } else {
                currentCategory = this.textContent.replace('教程', '');
            }
            
            // 重置到第一页
            currentPage = 1;
            
            // 重新加载文章列表
            initArticleList();
        });
    });
    
    // 排序方式
    const sortDropdown = document.getElementById('sortDropdown');
    const sortItems = document.querySelectorAll('.dropdown-menu[aria-labelledby="sortDropdown"] .dropdown-item');
    
    sortItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 更新按钮文本
            sortDropdown.textContent = this.textContent;
            
            // 更新当前排序
            if (this.textContent === '最新发布') {
                currentSort = 'newest';
            } else if (this.textContent === '最早发布') {
                currentSort = 'oldest';
            } else if (this.textContent === '阅读量最高') {
                currentSort = 'popular';
            }
            
            // 重置到第一页
            currentPage = 1;
            
            // 重新加载文章列表
            initArticleList();
        });
    });
}

/**
 * 显示加载动画
 */
function showLoadingSpinner() {
    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = 'flex';
    }
}

/**
 * 隐藏加载动画
 */
function hideLoadingSpinner() {
    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
}

/**
 * 格式化日期
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 格式化阅读量
 */
function formatViews(views) {
    if (views >= 10000) {
        return (views / 10000).toFixed(1) + 'w';
    } else if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'k';
    } else {
        return views.toString();
    }
} 