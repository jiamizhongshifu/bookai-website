/**
 * Nunjucks模板渲染器
 * 
 * 功能：
 * - 使用Nunjucks模板引擎渲染HTML文件
 * - 支持从Markdown文件生成文章HTML
 * - 自动提取文章目录结构
 * - 生成相关文章推荐
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const nunjucks = require('nunjucks');
const { 
  createMarkdownIt, 
  renderMarkdown, 
  generateTOC, 
  extractHeadings, 
  generateNestedTOC 
} = require('./markdown-config');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

// 配置目录
const TEMPLATES_DIR = path.join(__dirname, '../templates');
const ARTICLES_DIR = path.join(__dirname, '../articles');
const OUTPUT_DIR = path.join(__dirname, '..');

// 配置Nunjucks
const env = nunjucks.configure(TEMPLATES_DIR, {
  autoescape: true,
  trimBlocks: true,
  lstripBlocks: true
});

// 添加自定义过滤器
env.addFilter('urlencode', function(str) {
  return encodeURIComponent(str);
});

/**
 * 从Markdown内容中提取元数据
 * @param {string} content Markdown内容
 * @returns {Object} 提取的元数据
 */
function extractMetadata(content) {
  const metadata = {
    title: '',
    date: new Date().toISOString().split('T')[0],
    author: 'AI进化论-花生',
    category: 'uncategorized',
    tags: [],
    summary: '',
    views: Math.floor(Math.random() * 2000) + 100, // 模拟阅读量
    read_time: Math.floor(Math.random() * 20) + 5 + '分钟' // 模拟阅读时间
  };
  
  // 提取标题 (# 开头的第一行)
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    metadata.title = titleMatch[1];
  }
  
  // 尝试从摘要中提取分类信息
  const categoryKeywords = {
    'chatgpt': ['chatgpt', 'gpt', '提示词', 'prompt'],
    'cursor': ['cursor', '编程', '代码', 'vscode'],
    'deepseek': ['deepseek', '深度搜索'],
    'tools': ['工具', 'tools', '应用']
  };
  
  // 提取摘要 (> 开头的段落)
  const summaryMatch = content.match(/>\s+摘要：(.+?)(?:\r?\n|$)/);
  if (summaryMatch) {
    metadata.summary = summaryMatch[1];
    
    // 根据摘要内容判断分类
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => 
        metadata.summary.toLowerCase().includes(keyword.toLowerCase()) || 
        metadata.title.toLowerCase().includes(keyword.toLowerCase())
      )) {
        metadata.category = category;
        break;
      }
    }
  }
  
  // 提取标签 (从目录部分提取)
  const tocMatch = content.match(/\*\*目录\*\*\s+([\s\S]+?)(?:\r?\n\s*\r?\n|\r?\n##)/);
  if (tocMatch) {
    const tocContent = tocMatch[1];
    const tagMatches = tocContent.match(/\[([^\]]+)\]/g);
    if (tagMatches) {
      metadata.tags = tagMatches
        .map(tag => tag.replace(/[\[\]]/g, ''))
        .filter(tag => tag !== '常见问题解答' && tag !== '总结' && !tag.includes('#'));
    }
  }
  
  return metadata;
}

/**
 * 从文件路径生成slug
 * @param {string} filePath 文件路径
 * @returns {string} 生成的slug
 */
function generateSlug(filePath) {
  const fileName = path.basename(filePath, '.md');
  return fileName.toLowerCase()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/\s+/g, '-')     // 空格替换为连字符
    .replace(/-+/g, '-');     // 多个连字符替换为单个
}

/**
 * 从Markdown内容中提取目录结构
 * @param {string} content Markdown内容
 * @returns {Array} 目录结构数组
 */
function extractTOC(content) {
  // 使用新的提取标题和生成嵌套目录结构的函数
  const headings = extractHeadings(content);
  return generateNestedTOC(headings);
}

/**
 * 将Markdown转换为HTML
 * @param {string} content Markdown内容
 * @returns {string} HTML内容
 */
function markdownToHTML(content) {
  // 使用新的markdown-it配置渲染Markdown
  return renderMarkdown(content, true);
}

/**
 * 查找相关文章
 * @param {Object} article 当前文章
 * @param {Array} allArticles 所有文章
 * @returns {Array} 相关文章数组
 */
function findRelatedArticles(article, allArticles) {
  // 过滤掉当前文章
  const otherArticles = allArticles.filter(a => a.slug !== article.slug);
  
  // 首先查找同分类的文章
  const sameCategoryArticles = otherArticles.filter(a => a.category === article.category);
  
  // 如果同分类文章不足3篇，添加其他分类的文章
  if (sameCategoryArticles.length >= 3) {
    // 按日期排序，取最新的3篇
    return sameCategoryArticles
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  } else {
    // 添加其他分类的文章，优先选择有相同标签的文章
    const remainingCount = 3 - sameCategoryArticles.length;
    const otherCategoryArticles = otherArticles
      .filter(a => a.category !== article.category)
      .sort((a, b) => {
        // 计算标签匹配度
        const aMatchCount = a.tags.filter(tag => article.tags.includes(tag)).length;
        const bMatchCount = b.tags.filter(tag => article.tags.includes(tag)).length;
        
        if (aMatchCount !== bMatchCount) {
          return bMatchCount - aMatchCount; // 标签匹配度高的排前面
        }
        
        // 如果标签匹配度相同，按日期排序
        return new Date(b.date) - new Date(a.date);
      })
      .slice(0, remainingCount);
    
    return [...sameCategoryArticles, ...otherCategoryArticles];
  }
}

/**
 * 查找热门文章
 * @param {Array} allArticles 所有文章
 * @param {number} count 需要的文章数量
 * @returns {Array} 热门文章数组
 */
function findPopularArticles(allArticles, count = 4) {
  // 按阅读量排序
  return allArticles
    .sort((a, b) => b.views - a.views)
    .slice(0, count);
}

/**
 * 收集所有标签
 * @param {Array} allArticles 所有文章
 * @returns {Array} 标签数组
 */
function collectAllTags(allArticles) {
  // 收集所有标签
  const tagMap = new Map();
  
  allArticles.forEach(article => {
    article.tags.forEach(tag => {
      if (tagMap.has(tag)) {
        tagMap.set(tag, tagMap.get(tag) + 1);
      } else {
        tagMap.set(tag, 1);
      }
    });
  });
  
  // 转换为数组并排序
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({
      name,
      count,
      slug: name.toLowerCase().replace(/\s+/g, '-')
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * 处理单个Markdown文件
 * @param {string} filePath Markdown文件路径
 * @returns {Promise<Object>} 处理结果
 */
async function processMarkdownFile(filePath) {
  try {
    // 读取Markdown文件内容
    const content = await readFile(filePath, 'utf8');
    
    // 提取元数据
    const metadata = extractMetadata(content);
    
    // 生成slug
    const slug = generateSlug(filePath);
    
    // 提取目录结构
    const toc = extractTOC(content);
    
    // 转换Markdown为HTML
    const htmlContent = markdownToHTML(content);
    
    // 构建文章对象
    const article = {
      ...metadata,
      slug,
      toc,
      content: htmlContent,
      url: `https://aixueba.club/${metadata.category}/${slug}.html`
    };
    
    return article;
  } catch (error) {
    console.error(`处理文件失败: ${filePath}`, error);
    return null;
  }
}

/**
 * 递归查找所有Markdown文件
 * @param {string} dir 目录路径
 * @returns {Promise<string[]>} Markdown文件路径数组
 */
async function findMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() 
      ? await findMarkdownFiles(fullPath) 
      : (entry.name.endsWith('.md') ? fullPath : []);
  }));
  
  return files.flat();
}

/**
 * 渲染文章详情页
 * @param {Object} article 文章对象
 * @param {Array} allArticles 所有文章
 * @returns {Promise<void>}
 */
async function renderArticleDetail(article, allArticles) {
  try {
    // 查找相关文章
    const relatedArticles = findRelatedArticles(article, allArticles);
    
    // 查找热门文章
    const popularArticles = findPopularArticles(allArticles);
    
    // 收集所有标签
    const allTags = collectAllTags(allArticles);
    
    // 查找上一篇和下一篇文章
    const sameCategoryArticles = allArticles
      .filter(a => a.category === article.category)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const currentIndex = sameCategoryArticles.findIndex(a => a.slug === article.slug);
    const prevArticle = currentIndex < sameCategoryArticles.length - 1 ? sameCategoryArticles[currentIndex + 1] : null;
    const nextArticle = currentIndex > 0 ? sameCategoryArticles[currentIndex - 1] : null;
    
    // 渲染模板
    const html = nunjucks.render('article-detail.html', {
      article,
      related_articles: relatedArticles,
      popular_articles: popularArticles,
      all_tags: allTags,
      prev_article: prevArticle,
      next_article: nextArticle,
      current_year: new Date().getFullYear()
    });
    
    // 确保目标目录存在
    const outputDir = path.join(OUTPUT_DIR, article.category);
    if (!fs.existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true });
    }
    
    // 写入HTML文件
    const outputPath = path.join(outputDir, `${article.slug}.html`);
    await writeFile(outputPath, html, 'utf8');
    
    console.log(`✅ 已生成: ${outputPath}`);
    
    return outputPath;
  } catch (error) {
    console.error(`渲染文章失败: ${article.title}`, error);
    return null;
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🔍 开始查找Markdown文件...');
    const markdownFiles = await findMarkdownFiles(ARTICLES_DIR);
    console.log(`📝 找到 ${markdownFiles.length} 个Markdown文件`);
    
    if (markdownFiles.length === 0) {
      console.log('没有找到Markdown文件，程序退出');
      return;
    }
    
    // 处理所有Markdown文件
    console.log('🚀 开始处理Markdown文件...');
    const articlesPromises = markdownFiles.map(file => processMarkdownFile(file));
    const articlesResults = await Promise.all(articlesPromises);
    
    // 过滤掉处理失败的文件
    const articles = articlesResults.filter(result => result !== null);
    
    // 渲染所有文章详情页
    console.log('📄 开始渲染文章详情页...');
    const renderPromises = articles.map(article => renderArticleDetail(article, articles));
    const renderResults = await Promise.all(renderPromises);
    
    // 过滤掉渲染失败的文件
    const successResults = renderResults.filter(result => result !== null);
    
    // 生成分类统计
    console.log('📊 生成分类统计...');
    const categories = {};
    articles.forEach(article => {
      if (!categories[article.category]) {
        categories[article.category] = [];
      }
      categories[article.category].push(article);
    });
    
    console.log('📋 分类统计:');
    Object.entries(categories).forEach(([category, items]) => {
      console.log(`  - ${category}: ${items.length} 篇文章`);
    });
    
    console.log(`✨ 全部处理完成! 成功生成 ${successResults.length} 个HTML文件`);
    
  } catch (error) {
    console.error('程序执行出错:', error);
  }
}

// 执行主函数
main(); 