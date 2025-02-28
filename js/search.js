// 搜索功能实现
class ArticleSearch {
    constructor() {
        this.searchIndex = [];
        this.searchInput = document.getElementById('searchInput');
        this.searchResults = document.getElementById('searchResults');
        this.searchData = null;
        
        this.init();
    }

    async init() {
        try {
            // 加载搜索数据
            const response = await fetch('/search-data.json');
            this.searchData = await response.json();
            
            // 初始化搜索事件监听
            if (this.searchInput) {
                this.searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
            }
        } catch (error) {
            console.error('Failed to initialize search:', error);
        }
    }

    // 处理搜索
    handleSearch(event) {
        const query = event.target.value.toLowerCase().trim();
        
        if (!query) {
            this.clearResults();
            return;
        }

        const results = this.searchData.filter(item => {
            return item.title.toLowerCase().includes(query) ||
                   item.description.toLowerCase().includes(query) ||
                   item.content.toLowerCase().includes(query);
        });

        this.displayResults(results, query);
    }

    // 显示搜索结果
    displayResults(results, query) {
        if (!this.searchResults) return;

        if (results.length === 0) {
            this.searchResults.innerHTML = '<p class="text-center">未找到相关内容</p>';
            return;
        }

        const resultsHtml = results.map(result => {
            // 获取内容中包含搜索词的片段
            const snippet = this.getContentSnippet(result.content, query);
            
            return `
                <div class="search-result-item">
                    <h3><a href="${result.url}">${this.highlightText(result.title, query)}</a></h3>
                    <p class="text-muted">${this.highlightText(snippet, query)}</p>
                </div>
            `;
        }).join('');

        this.searchResults.innerHTML = resultsHtml;
    }

    // 获取内容片段
    getContentSnippet(content, query) {
        const maxLength = 200;
        const queryIndex = content.toLowerCase().indexOf(query);
        
        if (queryIndex === -1) {
            return content.substring(0, maxLength) + '...';
        }

        const start = Math.max(0, queryIndex - 100);
        const end = Math.min(content.length, queryIndex + 100);
        
        let snippet = content.substring(start, end);
        if (start > 0) snippet = '...' + snippet;
        if (end < content.length) snippet = snippet + '...';
        
        return snippet;
    }

    // 高亮搜索词
    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // 清除搜索结果
    clearResults() {
        if (this.searchResults) {
            this.searchResults.innerHTML = '';
        }
    }

    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// 初始化搜索功能
document.addEventListener('DOMContentLoaded', () => {
    new ArticleSearch();
}); 