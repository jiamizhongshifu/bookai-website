/**
 * 搜索功能实现
 * 包含搜索历史、结果高亮等功能
 */

// 搜索数据
const searchData = [
    {
        title: "ChatGPT注册指南",
        description: "详细介绍如何注册和使用ChatGPT，包括常见问题解决方案。",
        url: "articles/chatgpt-registration-guide.html",
        category: "ChatGPT"
    },
    {
        title: "ChatGPT提示词工程",
        description: "学习如何编写高效的提示词，让AI更好地理解你的需求。",
        url: "articles/chatgpt-prompt-engineering.html",
        category: "ChatGPT"
    },
    {
        title: "Cursor完全指南",
        description: "从入门到精通的Cursor IDE使用教程。",
        url: "articles/cursor-ultimate-guide.html",
        category: "Cursor"
    },
    {
        title: "Deepseek入门指南",
        description: "全面了解Deepseek的功能和使用方法。",
        url: "articles/deepseek-guide.html",
        category: "Deepseek"
    }
];

// 搜索历史存储键
const SEARCH_HISTORY_KEY = 'searchHistory';

// 获取搜索历史
function getSearchHistory() {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
}

// 保存搜索历史
function saveSearchHistory(term) {
    let history = getSearchHistory();
    history = history.filter(item => item !== term);
    history.unshift(term);
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
}

// 高亮搜索结果
function highlightText(text, searchTerm) {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// 处理搜索
function handleSearch(event) {
    event.preventDefault();
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        showError('请输入搜索关键词');
        return;
    }

    try {
        saveSearchHistory(searchTerm);
        const results = searchData.filter(item => 
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm)
        );
        displaySearchResults(results, searchTerm);
    } catch (error) {
        console.error('搜索出错：', error);
        showError('搜索过程中出现错误，请稍后重试');
    }
}

// 显示搜索结果
function displaySearchResults(results, searchTerm) {
    const searchResults = document.getElementById('searchResults');
    const searchModal = new bootstrap.Modal(document.getElementById('searchModal'));
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="text-center my-4">
                <p class="mb-3">未找到相关结果</p>
                <div class="search-suggestions">
                    <h6>搜索历史</h6>
                    ${displaySearchHistory()}
                </div>
            </div>
        `;
    } else {
        let html = '<div class="list-group">';
        results.forEach(result => {
            html += `
                <a href="${result.url}" class="list-group-item list-group-item-action">
                    <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">${highlightText(result.title, searchTerm)}</h6>
                        <small class="text-muted">${result.category}</small>
                    </div>
                    <p class="mb-1">${highlightText(result.description, searchTerm)}</p>
                </a>
            `;
        });
        html += '</div>';
        searchResults.innerHTML = html;
    }
    
    searchModal.show();
}

// 显示搜索历史
function displaySearchHistory() {
    const history = getSearchHistory();
    if (history.length === 0) {
        return '<p class="text-muted">暂无搜索历史</p>';
    }
    
    return `
        <div class="search-history-tags">
            ${history.map(term => `
                <button class="btn btn-sm btn-outline-secondary me-2 mb-2" 
                        onclick="searchHistoryTerm('${term}')">
                    ${term}
                </button>
            `).join('')}
        </div>
    `;
}

// 点击历史记录进行搜索
function searchHistoryTerm(term) {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = term;
    handleSearch(new Event('submit'));
}

// 显示错误信息
function showError(message) {
    const searchResults = document.getElementById('searchResults');
    const searchModal = new bootstrap.Modal(document.getElementById('searchModal'));
    
    searchResults.innerHTML = `
        <div class="alert alert-danger" role="alert">
            ${message}
        </div>
    `;
    
    searchModal.show();
}

// 初始化搜索功能
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', handleSearch);

        // 添加输入建议
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                handleSearch(new Event('submit'));
            }
        });
    }
}); 