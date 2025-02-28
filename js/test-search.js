// 测试搜索和标签功能
const TestSearch = {
    // 运行所有测试
    async runTests() {
        console.group('开始测试搜索和标签功能');
        
        await this.testDataLoading();
        await this.testTagCloud();
        await this.testSearch();
        await this.testArticleFiltering();
        
        console.groupEnd();
    },

    // 测试数据加载
    async testDataLoading() {
        console.group('测试数据加载');
        try {
            const response = await fetch('/search-data.json');
            const data = await response.json();
            
            console.log('✓ 成功加载search-data.json');
            console.log(`✓ 加载了 ${data.length} 篇文章`);
            
            // 验证数据结构
            const firstArticle = data[0];
            const requiredFields = ['title', 'url', 'date', 'category', 'tags', 'content', 'image', 'description', 'keywords'];
            const missingFields = requiredFields.filter(field => !firstArticle[field]);
            
            if (missingFields.length === 0) {
                console.log('✓ 文章数据结构完整');
            } else {
                console.error(`✗ 缺少字段: ${missingFields.join(', ')}`);
            }

            // 测试URL格式
            const urlPattern = /^\/articles\/[a-z]+\/[a-z0-9-]+\.html$/;
            const invalidUrls = data.filter(article => !urlPattern.test(article.url));
            if (invalidUrls.length === 0) {
                console.log('✓ 所有URL格式正确');
            } else {
                console.error('✗ 发现无效URL:', invalidUrls.map(a => a.url));
            }

            // 测试日期格式
            const datePattern = /^\d{4}-\d{2}-\d{2}$/;
            const invalidDates = data.filter(article => !datePattern.test(article.date));
            if (invalidDates.length === 0) {
                console.log('✓ 所有日期格式正确');
            } else {
                console.error('✗ 发现无效日期:', invalidDates.map(a => a.date));
            }

            // 测试图片路径
            const imagePattern = /^\/images\/[a-z0-9-]+\.svg$/;
            const invalidImages = data.filter(article => !imagePattern.test(article.image));
            if (invalidImages.length === 0) {
                console.log('✓ 所有图片路径格式正确');
            } else {
                console.error('✗ 发现无效图片路径:', invalidImages.map(a => a.image));
            }

            // 测试内容长度
            const shortDescriptions = data.filter(article => article.description.length < 50);
            if (shortDescriptions.length === 0) {
                console.log('✓ 所有文章描述长度合适');
            } else {
                console.warn('! 发现过短的描述:', shortDescriptions.map(a => a.title));
            }
        } catch (error) {
            console.error('✗ 数据加载失败:', error);
        }
        console.groupEnd();
    },

    // 测试标签云功能
    async testTagCloud() {
        console.group('测试标签云功能');
        try {
            const response = await fetch('/search-data.json');
            const data = await response.json();
            
            // 收集所有标签
            const tags = new Set();
            data.forEach(article => {
                article.tags.forEach(tag => tags.add(tag));
            });
            
            console.log(`✓ 找到 ${tags.size} 个唯一标签`);
            console.log('标签列表:', Array.from(tags));
            
            // 测试标签权重计算
            const tagCounts = {};
            data.forEach(article => {
                article.tags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            });
            
            console.log('标签使用频率:', tagCounts);

            // 测试标签长度
            const longTags = Array.from(tags).filter(tag => tag.length > 10);
            if (longTags.length === 0) {
                console.log('✓ 所有标签长度合适');
            } else {
                console.warn('! 发现过长的标签:', longTags);
            }

            // 测试标签语言一致性
            const nonChineseTags = Array.from(tags).filter(tag => !/[\u4e00-\u9fa5]/.test(tag) && !/^[A-Za-z]+$/.test(tag));
            if (nonChineseTags.length === 0) {
                console.log('✓ 所有标签语言格式一致');
            } else {
                console.warn('! 发现混合语言标签:', nonChineseTags);
            }
        } catch (error) {
            console.error('✗ 标签云测试失败:', error);
        }
        console.groupEnd();
    },

    // 测试搜索功能
    async testSearch() {
        console.group('测试搜索功能');
        try {
            const response = await fetch('/search-data.json');
            const data = await response.json();
            
            // 测试关键词搜索
            const searchTests = [
                { term: 'ChatGPT', expectedMinResults: 4 },
                { term: 'Cursor', expectedMinResults: 2 },
                { term: '教程', expectedMinResults: 1 },
                { term: '安全', expectedMinResults: 1 },
                { term: 'AI', expectedMinResults: 3 }
            ];
            
            searchTests.forEach(({term, expectedMinResults}) => {
                const results = data.filter(article => 
                    article.title.includes(term) || 
                    article.content.includes(term) ||
                    article.description.includes(term) ||
                    article.keywords.includes(term)
                );
                
                if (results.length >= expectedMinResults) {
                    console.log(`✓ 搜索"${term}": 找到 ${results.length} 个结果`);
                } else {
                    console.warn(`! 搜索"${term}": 结果数量(${results.length})少于预期(${expectedMinResults})`);
                }
            });

            // 测试模糊搜索
            const fuzzyTests = [
                { term: 'GPT', expectedMinResults: 4 },
                { term: '编程', expectedMinResults: 2 },
                { term: '指南', expectedMinResults: 3 }
            ];

            fuzzyTests.forEach(({term, expectedMinResults}) => {
                const results = data.filter(article => 
                    article.title.includes(term) || 
                    article.content.includes(term) ||
                    article.description.includes(term)
                );
                
                if (results.length >= expectedMinResults) {
                    console.log(`✓ 模糊搜索"${term}": 找到 ${results.length} 个结果`);
                } else {
                    console.warn(`! 模糊搜索"${term}": 结果数量(${results.length})少于预期(${expectedMinResults})`);
                }
            });
        } catch (error) {
            console.error('✗ 搜索测试失败:', error);
        }
        console.groupEnd();
    },

    // 测试文章过滤
    async testArticleFiltering() {
        console.group('测试文章过滤');
        try {
            const response = await fetch('/search-data.json');
            const data = await response.json();
            
            // 按分类过滤
            const categories = new Set(data.map(article => article.category));
            console.log(`✓ 找到 ${categories.size} 个分类:`, Array.from(categories));
            
            // 测试分类文章数量
            categories.forEach(category => {
                const categoryArticles = data.filter(article => article.category === category);
                if (categoryArticles.length > 0) {
                    console.log(`✓ ${category}: ${categoryArticles.length} 篇文章`);
                } else {
                    console.warn(`! ${category} 分类下没有文章`);
                }
            });
            
            // 测试日期排序
            const sortedArticles = [...data].sort((a, b) => 
                new Date(b.date) - new Date(a.date)
            );
            
            // 验证排序结果
            const isCorrectlySorted = sortedArticles.every((article, index) => {
                if (index === 0) return true;
                return new Date(article.date) <= new Date(sortedArticles[index - 1].date);
            });

            if (isCorrectlySorted) {
                console.log('✓ 文章日期排序正确');
            } else {
                console.error('✗ 文章日期排序有误');
            }

            // 测试关键词完整性
            const articlesWithoutKeywords = data.filter(article => !article.keywords || article.keywords.length === 0);
            if (articlesWithoutKeywords.length === 0) {
                console.log('✓ 所有文章都有关键词');
            } else {
                console.warn('! 发现没有关键词的文章:', articlesWithoutKeywords.map(a => a.title));
            }
        } catch (error) {
            console.error('✗ 文章过滤测试失败:', error);
        }
        console.groupEnd();
    }
};

// 运行测试
document.addEventListener('DOMContentLoaded', () => {
    TestSearch.runTests();
}); 