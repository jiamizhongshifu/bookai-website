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

// 处理搜索
function handleSearch(event) {
    event.preventDefault();
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        return;
    }

    const results = searchData.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
    );

    displaySearchResults(results);
}

// 显示搜索结果
function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    const searchModal = new bootstrap.Modal(document.getElementById('searchModal'));
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p class="text-center">未找到相关结果</p>';
    } else {
        let html = '<div class="list-group">';
        results.forEach(result => {
            html += `
                <a href="${result.url}" class="list-group-item list-group-item-action">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${result.title}</h5>
                        <small class="text-muted">${result.category}</small>
                    </div>
                    <p class="mb-1">${result.description}</p>
                </a>
            `;
        });
        html += '</div>';
        searchResults.innerHTML = html;
    }
    
    searchModal.show();
}

// 初始化搜索功能
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('form');
    const searchInput = document.querySelector('input[type="search"]');
    const searchModal = new bootstrap.Modal(document.getElementById('searchModal'));

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', handleSearch);

        // 实时搜索（可选）
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                const results = searchData.filter(item => 
                    item.title.toLowerCase().includes(query) ||
                    item.description.toLowerCase().includes(query) ||
                    item.category.toLowerCase().includes(query)
                );
                displaySearchResults(results);
            }
        });
    }
}); 