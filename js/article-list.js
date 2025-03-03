/**
 * 文章列表页面JavaScript
 * 实现AJAX异步加载和分页功能
 */

// 模拟文章数据（实际项目中应从服务器获取）
const articleData = [
    // ChatGPT系列
    {
        id: 1,
        title: "ChatGPT从零精通：万字长文教你玩转提示词工程",
        summary: "从基础概念到高级应用，全面掌握ChatGPT提示词工程，让AI更好地理解和执行你的需求。",
        date: "2024-03-01",
        views: 12543,
        category: "ChatGPT",
        url: "/chatgpt/chatgpt-prompt-engineering.html"
    },
    {
        id: 2,
        title: "ChatGPT被封号怎么办？2024最新国内访问稳定方案",
        summary: "解决ChatGPT账号被封、无法访问等问题的最新方案，确保稳定使用ChatGPT。",
        date: "2024-03-01",
        views: 5932,
        category: "ChatGPT",
        url: "/chatgpt/chatgpt-access-solutions.html"
    },
    {
        id: 3,
        title: "ChatGPT Python编程教程：入门到精通",
        summary: "零基础也能快速上手Python，ChatGPT辅助编程实战指南，包含完整案例和实践技巧。",
        date: "2024-03-02",
        views: 3812,
        category: "ChatGPT",
        url: "/chatgpt/chatgpt-python-tutorial.html"
    },
    {
        id: 4,
        title: "ChatGPT Plus全面评测：值不值得订阅？",
        summary: "深度分析ChatGPT Plus的功能、价格和价值，帮你做出明智决定。全面对比免费版与Plus版本。",
        date: "2024-03-02",
        views: 4278,
        category: "ChatGPT",
        url: "/chatgpt/chatgpt-plus-review.html"
    },
    {
        id: 5,
        title: "ChatGPT写作指南：让AI成为你的专业写手",
        summary: "学会使用ChatGPT创作高质量内容的完整教程，适合各类写作需求，从文案到学术论文全方位指导。",
        date: "2024-03-02",
        views: 3931,
        category: "ChatGPT",
        url: "/chatgpt/chatgpt-writing-guide.html"
    },
    {
        id: 6,
        title: "ChatGPT注册教程：国内用户从零开始的完整指南",
        summary: "详细图文教程，解决国内用户注册ChatGPT的所有难题，包括手机验证和付款问题的解决方案。",
        date: "2024-03-02",
        views: 4765,
        category: "ChatGPT",
        url: "/chatgpt/chatgpt-registration-guide.html"
    },
    {
        id: 7,
        title: "ChatGPT电商应用指南：提升销量和客户服务",
        summary: "电商从业者必看，ChatGPT在产品描述、客服和营销中的应用技巧，让你的电商业务更上一层楼。",
        date: "2024-03-02",
        views: 3124,
        category: "ChatGPT",
        url: "/chatgpt/chatgpt-ecommerce-guide.html"
    },
    {
        id: 8,
        title: "ChatGPT教育应用指南：学习效率提升技巧",
        summary: "学生和教师使用ChatGPT辅助学习和教学的最佳实践，提高学习效率和教学质量的完整方案。",
        date: "2024-03-02",
        views: 3789,
        category: "ChatGPT",
        url: "/chatgpt/chatgpt-education-guide.html"
    },
    {
        id: 9,
        title: "ChatGPT赚钱指南：AI创业和副业全攻略",
        summary: "利用ChatGPT开发产品、提供服务和创建内容的变现方法，从零开始打造你的AI业务。",
        date: "2024-03-02",
        views: 6823,
        category: "ChatGPT",
        url: "/chatgpt/chatgpt-money-making-guide.html"
    },
    {
        id: 10,
        title: "ChatGPT商店使用指南：发现和使用优质GPTs",
        summary: "探索GPTs商店中的精品应用，提升ChatGPT使用效率。从挑选到使用自定义GPT的完整教程。",
        date: "2024-03-02",
        views: 4231,
        category: "ChatGPT",
        url: "/chatgpt/chatgpt-store-guide.html"
    },
    
    // Cursor系列
    {
        id: 11,
        title: "Cursor终极指南：AI写代码比Copilot更强？",
        summary: "深入解析Cursor的核心功能和使用技巧，提升编程效率的必备工具。",
        date: "2024-03-02",
        views: 8321,
        category: "Cursor",
        url: "/cursor/cursor-ultimate-guide.html"
    },
    {
        id: 12,
        title: "Cursor vs Copilot：两大AI编程助手全方位对比",
        summary: "深度对比Cursor和GitHub Copilot的功能、性能和使用体验，帮你选择最适合自己的AI编程助手。",
        date: "2024-03-02",
        views: 7214,
        category: "Cursor",
        url: "/cursor/cursor-vs-copilot.html"
    },
    {
        id: 13,
        title: "Cursor本地模型使用指南：离线也能高效编程",
        summary: "Cursor本地模型的安装、配置和使用教程，适合无网络环境或对保密性要求高的开发场景。",
        date: "2024-03-02",
        views: 3542,
        category: "Cursor",
        url: "/cursor/cursor-local-model-guide.html"
    },
    {
        id: 14,
        title: "Cursor插件开发指南：打造你的专属AI编程工具",
        summary: "从入门到精通，学习开发Cursor插件扩展AI编程功能，为特定编程场景定制化你的编程体验。",
        date: "2024-03-02",
        views: 2947,
        category: "Cursor",
        url: "/cursor/cursor-plugin-guide.html"
    },
    {
        id: 15,
        title: "Cursor团队协作指南：多人AI编程最佳实践",
        summary: "如何在团队中高效使用Cursor，提升协作效率的技巧和工作流，让整个开发团队效率倍增。",
        date: "2024-03-02",
        views: 3265,
        category: "Cursor",
        url: "/cursor/cursor-team-guide.html"
    },
    {
        id: 16,
        title: "Cursor企业版全面介绍：为大型团队打造的AI编程解决方案",
        summary: "Cursor企业版的功能、部署和管理指南，适合企业级用户。包含安全性、可扩展性和团队管理等方面的详细说明。",
        date: "2024-03-02",
        views: 2879,
        category: "Cursor",
        url: "/cursor/cursor-enterprise.html"
    },
    
    // DeepSeek系列
    {
        id: 17,
        title: "DeepSeek全面使用指南：中国最强开源大模型",
        summary: "深入了解DeepSeek大模型的功能、优势和使用技巧，从基础操作到高级应用，一篇文章全部掌握。",
        date: "2024-03-02",
        views: 6154,
        category: "DeepSeek",
        url: "/deepseek/deepseek-guide.html"
    },
    {
        id: 18,
        title: "DeepSeek API开发指南：接入中国顶级开源大模型",
        summary: "DeepSeek API的接入、调用和最佳实践，适合开发者使用。从API申请到实际应用的全流程教程。",
        date: "2024-03-03",
        views: 3412,
        category: "DeepSeek",
        url: "/deepseek/deepseek-api-guide.html"
    },
    {
        id: 19,
        title: "DeepSeek MoE企业版详解：为企业打造的高性能AI模型",
        summary: "DeepSeek MoE企业版的功能、部署和应用场景分析，适合企业级用户探索大模型应用的可能性。",
        date: "2024-03-03",
        views: 2731,
        category: "DeepSeek",
        url: "/deepseek/deepseek-moe-enterprise.html"
    },
    {
        id: 20,
        title: "DeepSeek R1微调指南：定制你的专属大模型",
        summary: "从数据准备到模型部署，DeepSeek R1模型微调全流程教程，让大模型更好地适应你的特定需求。",
        date: "2024-03-03",
        views: 3158,
        category: "DeepSeek",
        url: "/deepseek/deepseek-r1-fine-tuning-guide.html"
    },
    {
        id: 21,
        title: "DeepSeek Monica R1使用指南：打造智能编程助手",
        summary: "DeepSeek Monica R1模型的功能、性能和编程应用技巧，让编程效率和质量实现质的飞跃。",
        date: "2024-03-03",
        views: 2967,
        category: "DeepSeek",
        url: "/deepseek/deepseek-monica-r1-guide.html"
    }
];

const articlesData = [];

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