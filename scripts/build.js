/**
 * 网站构建脚本
 * 
 * 功能：
 * 1. 文件监听模式（使用chokidar）
 * 2. 元数据提取（gray-matter库）
 * 3. 生成时自动：
 *    - 创建目录结构
 *    - 注入阅读进度条组件
 *    - 添加上一篇/下一篇导航
 *    - 生成sitemap.xml
 * 4. 输出构建报告（总文章数/耗时/错误统计）
 */

const fs = require('fs-extra');
const path = require('path');
const chokidar = require('chokidar');
const matter = require('gray-matter');
const chalk = require('chalk');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const nunjucks = require('nunjucks');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItToc = require('markdown-it-toc-done-right');
const slugify = require('slugify');
const pretty = require('pretty');

// 配置
const CONFIG = {
  articlesDir: path.join(__dirname, '..', 'articles'),
  outputDir: process.env.OUTPUT_DIR || path.join(__dirname, '..'),
  templatesDir: path.join(__dirname, '..', 'templates'),
  sitemapPath: process.env.OUTPUT_DIR 
    ? path.join(process.env.OUTPUT_DIR, 'sitemap.xml')
    : path.join(__dirname, '..', 'sitemap.xml'),
  baseUrl: 'https://aixueba.club',
  watchMode: process.argv.includes('--watch'),
  categories: ['chatgpt', 'cursor', 'deepseek', 'tools'],
  defaultAuthor: 'AI进化论-花生',
  articlesPerPage: 10,
  newArticleDays: 7 // 发布7天内的文章标记为"新"
};

// 统计数据
const STATS = {
  startTime: null,
  endTime: null,
  totalArticles: 0,
  processedArticles: 0,
  errors: [],
  warnings: [],
  newArticles: 0,
  updatedArticles: 0
};

// 配置Nunjucks
const env = nunjucks.configure(CONFIG.templatesDir, {
  autoescape: true,
  noCache: process.env.NODE_ENV === 'development'
});

// 配置markdown-it
const md = markdownIt({
  html: true,
  xhtmlOut: true,
  breaks: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    return `<pre><code class="language-${lang}">${str}</code></pre>`;
  }
})
.use(markdownItAnchor, {
  permalink: true,
  permalinkClass: 'header-anchor',
  permalinkSymbol: '#',
  permalinkBefore: true,
  level: [1, 2, 3, 4],
  slugify: s => slugify(s, { lower: true, strict: true })
})
.use(markdownItToc, {
  containerClass: 'table-of-contents',
  containerId: 'toc',
  listType: 'ul',
  listClass: 'toc-list',
  itemClass: 'toc-item',
  linkClass: 'toc-link',
  level: [1, 2, 3, 4],
  slugify: s => slugify(s, { lower: true, strict: true })
});

// 添加图片懒加载支持
const defaultRender = md.renderer.rules.image;
md.renderer.rules.image = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  const srcIndex = token.attrIndex('src');
  const src = token.attrs[srcIndex][1];
  
  // 添加懒加载属性
  token.attrPush(['class', 'lazy-image']);
  token.attrPush(['data-src', src]);
  token.attrs[srcIndex][1] = 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%220%200%20100%20100%22%3E%3C%2Fsvg%3E';
  
  return defaultRender(tokens, idx, options, env, self);
};

/**
 * 确保目录存在
 * @param {string} dirPath 目录路径
 */
function ensureDirectoryExists(dirPath) {
  fs.ensureDirSync(dirPath);
}

/**
 * 从文件路径生成slug
 * @param {string} filePath 文件路径
 * @returns {string} 生成的slug
 */
function generateSlug(filePath) {
  const fileName = path.basename(filePath, '.md');
  return slugify(fileName, { lower: true, strict: true });
}

/**
 * 从Markdown内容中提取元数据
 * @param {string} content Markdown内容
 * @param {string} filePath 文件路径
 * @returns {Object} 提取的元数据
 */
function extractMetadata(content, filePath) {
  // 使用gray-matter提取front matter
  const { data, content: markdownContent } = matter(content);
  
  // 基本元数据
  const metadata = {
    title: '',
    summary: '',
    category: '',
    tags: [],
    date: new Date().toISOString().split('T')[0],
    author: CONFIG.defaultAuthor,
    slug: generateSlug(filePath),
    views: Math.floor(Math.random() * 2000) + 100, // 模拟阅读量
    read_time: Math.floor(Math.random() * 20) + 5 + '分钟' // 模拟阅读时间
  };
  
  // 从front matter中提取数据
  if (Object.keys(data).length > 0) {
    // 如果有front matter，优先使用
    Object.assign(metadata, data);
  } else {
    // 如果没有front matter，尝试从内容中提取
    
    // 尝试从内容中提取标题
    const titleMatch = markdownContent.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      metadata.title = titleMatch[1].trim();
    }
  
    // 尝试从内容中提取摘要
    const summaryMatch = markdownContent.match(/^>+\s*(.+)$/m);
    if (summaryMatch) {
      metadata.summary = summaryMatch[1].trim();
    } else {
      // 如果没有找到摘要，使用内容的前100个字符
      const plainText = markdownContent.replace(/#+\s+.+/g, '').replace(/\[.+\]\(.+\)/g, '').replace(/\n/g, ' ').trim();
      metadata.summary = plainText.substring(0, 100) + '...';
    }
  
    // 尝试从内容中提取分类
    const categoryMatch = markdownContent.match(/分类[:：]\s*(.+)$/m);
    if (categoryMatch) {
      metadata.category = categoryMatch[1].trim();
    } else {
      // 根据内容关键词推断分类
      if (markdownContent.includes('ChatGPT') || markdownContent.includes('GPT-4')) {
        metadata.category = 'chatgpt';
      } else if (markdownContent.includes('Cursor')) {
        metadata.category = 'cursor';
      } else if (markdownContent.includes('Deepseek')) {
        metadata.category = 'deepseek';
      } else {
        metadata.category = 'tools';
      }
    }
  
    // 尝试从内容中提取标签
    const tagsMatch = markdownContent.match(/标签[:：]\s*(.+)$/m);
    if (tagsMatch) {
      metadata.tags = tagsMatch[1].split(',').map(tag => tag.trim());
    } else {
      // 根据内容关键词推断标签
      const keywords = ['ChatGPT', 'GPT-4', 'Cursor', 'Deepseek', 'AI编程', '提示词工程', 'AI写作'];
      metadata.tags = keywords.filter(keyword => markdownContent.includes(keyword));
      if (metadata.tags.length === 0) {
        metadata.tags = ['AI工具'];
      }
    }
  
    // 尝试从内容中提取日期
    const dateMatch = markdownContent.match(/日期[:：]\s*(\d{4}-\d{2}-\d{2})/m);
    if (dateMatch) {
      metadata.date = dateMatch[1];
    }
  
    // 尝试从内容中提取作者
    const authorMatch = markdownContent.match(/作者[:：]\s*(.+)$/m);
    if (authorMatch) {
      metadata.author = authorMatch[1].trim();
    }
  }
  
  // 确保分类是有效的
  if (!CONFIG.categories.includes(metadata.category)) {
    STATS.warnings.push(`文件 ${filePath} 的分类 "${metadata.category}" 无效，已设置为默认分类 "tools"`);
    metadata.category = 'tools';
  }

  // 自动提取文章首段作为摘要（如果没有明确设置摘要）
  if (!metadata.summary || metadata.summary === '') {
    // 移除标题和前言，查找第一个段落
    const firstParagraph = markdownContent
      .replace(/^#.+$/gm, '') // 移除标题
      .replace(/^>.+$/gm, '') // 移除引用（通常是前言）
      .split(/\n\s*\n/)[0] // 获取第一个段落
      .replace(/\[.+\]\(.+\)/g, '') // 移除链接
      .replace(/[*_`]/g, '') // 移除格式标记
      .trim();
    
    if (firstParagraph && firstParagraph.length > 0) {
      // 如果段落太长，截断它
      metadata.summary = firstParagraph.length > 150 
        ? firstParagraph.substring(0, 150) + '...' 
        : firstParagraph;
    }
  }

  // 检查文章是否为"新"文章
  const publishDate = new Date(metadata.date);
  const now = new Date();
  const daysDiff = Math.floor((now - publishDate) / (1000 * 60 * 60 * 24));
  metadata.is_new = daysDiff <= CONFIG.newArticleDays;
  
  return { metadata, content: markdownContent };
}

/**
 * 生成相关文章
 * @param {Object} currentMetadata 当前文章元数据
 * @param {Array} allArticles 所有文章
 * @returns {Array} 相关文章数组
 */
function getRelatedArticles(currentMetadata, allArticles) {
  // 根据标签和分类的相似度排序
  return allArticles
    .filter(article => article.slug !== currentMetadata.slug) // 排除当前文章
    .map(article => {
      // 计算标签匹配度
      const tagMatch = article.tags.filter(tag => currentMetadata.tags.includes(tag)).length;
      // 分类匹配加权
      const categoryMatch = article.category === currentMetadata.category ? 2 : 0;
      // 总匹配度
      const matchScore = tagMatch + categoryMatch;
      
      return { ...article, matchScore };
    })
    .sort((a, b) => b.matchScore - a.matchScore) // 按匹配度排序
    .slice(0, 3); // 取前3篇
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
      slug: slugify(name, { lower: true, strict: true })
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * 注入阅读进度条组件
 * @param {string} html HTML内容
 * @returns {string} 注入进度条后的HTML内容
 */
function injectReadingProgressBar(html) {
  // 检查是否已经有进度条
  if (html.includes('reading-progress-container')) {
    return html;
  }
  
  // 在<body>标签后注入进度条HTML
  const progressBarHtml = `
<body>
    <!-- 阅读进度条 -->
    <div class="reading-progress-container">
        <div class="reading-progress-bar" id="readingProgress"></div>
    </div>
`;
  
  // 替换<body>标签
  return html.replace('<body>', progressBarHtml);
}

/**
 * 处理单个Markdown文件
 * @param {string} filePath Markdown文件路径
 * @param {Array} allArticles 所有文章
 * @returns {Promise<Object>} 处理结果
 */
async function processMarkdownFile(filePath, allArticles) {
  try {
    // 读取Markdown文件内容
    const content = await fs.readFile(filePath, 'utf8');
    
    // 提取元数据
    const { metadata, content: markdownContent } = extractMetadata(content, filePath);
    
    // 转换Markdown为HTML
    const htmlContent = md.render(markdownContent);
    
    // 获取相关文章
    const relatedArticles = getRelatedArticles(metadata, allArticles);
    
    // 获取热门文章
    const popularArticles = findPopularArticles(allArticles);
    
    // 收集所有标签
    const allTags = collectAllTags(allArticles);
    
    // 获取前一篇和后一篇文章
    const sameCategoryArticles = allArticles
      .filter(article => article.category === metadata.category)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const currentIndex = sameCategoryArticles.findIndex(article => article.slug === metadata.slug);
    const prevArticle = currentIndex < sameCategoryArticles.length - 1 ? sameCategoryArticles[currentIndex + 1] : null;
    const nextArticle = currentIndex > 0 ? sameCategoryArticles[currentIndex - 1] : null;
    
    // 渲染模板
    const renderedHtml = nunjucks.render('article-detail.html', {
      title: metadata.title,
      content: htmlContent,
      metadata: metadata,
      relatedArticles: relatedArticles,
      popularArticles: popularArticles,
      allTags: allTags,
      prevArticle: prevArticle,
      nextArticle: nextArticle,
      current_year: new Date().getFullYear()
    });
    
    // 注入阅读进度条组件
    const htmlWithProgressBar = injectReadingProgressBar(renderedHtml);
    
    // 美化HTML
    const prettyHtml = pretty(htmlWithProgressBar, { ocd: true });
    
    // 确保输出目录存在
    const categoryDir = path.join(CONFIG.outputDir, metadata.category);
    ensureDirectoryExists(categoryDir);
    
    // 写入HTML文件
    const outputPath = path.join(categoryDir, `${metadata.slug}.html`);
    await fs.writeFile(outputPath, prettyHtml, 'utf8');
    
    console.log(chalk.green(`✓ 已生成: ${outputPath}`));
    
    return {
      ...metadata,
      filePath,
      outputPath,
      url: `${CONFIG.baseUrl}/${metadata.category}/${metadata.slug}.html`
    };
  } catch (error) {
    STATS.errors.push(`处理文件 ${filePath} 失败: ${error.message}`);
    console.error(chalk.red(`✗ 处理文件失败: ${filePath}`), error);
    return null;
  }
}

/**
 * 递归查找所有Markdown文件
 * @param {string} dir 目录路径
 * @returns {Promise<string[]>} Markdown文件路径数组
 */
async function findMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() 
      ? await findMarkdownFiles(fullPath) 
      : (entry.name.endsWith('.md') ? fullPath : []);
  }));
  
  return files.flat();
}

/**
 * 生成网站地图
 * @param {Array} articles 文章数组
 * @returns {Promise<void>}
 */
async function generateSitemap(articles) {
  try {
    // 创建sitemap流
    const stream = new SitemapStream({ hostname: CONFIG.baseUrl });
    
    // 添加首页
    stream.write({
      url: '/',
      changefreq: 'daily',
      priority: 1.0
    });
    
    // 添加文章列表页面
    stream.write({
      url: '/articles/',
      changefreq: 'daily',
      priority: 0.9
    });
    
    // 添加分类页面
    CONFIG.categories.forEach(category => {
      stream.write({
        url: `/${category}/`,
        changefreq: 'daily',
        priority: 0.8
      });
    });
    
    // 添加文章页面
    articles.forEach(article => {
      if (!article) return;
      
      stream.write({
        url: `/${article.category}/${article.slug}.html`,
        lastmod: new Date(article.date).toISOString(),
        changefreq: 'monthly',
        priority: 0.7
      });
    });
    
    // 结束流
    stream.end();
    
    // 将流转换为字符串
    const data = await streamToPromise(stream);
    
    // 写入文件
    await fs.writeFile(CONFIG.sitemapPath, data.toString(), 'utf8');
    
    console.log(chalk.green(`✓ 已生成网站地图: ${CONFIG.sitemapPath}`));
  } catch (error) {
    STATS.errors.push(`生成网站地图失败: ${error.message}`);
    console.error(chalk.red('✗ 生成网站地图失败:'), error);
  }
}

/**
 * 输出构建报告
 */
function printBuildReport() {
  STATS.endTime = Date.now();
  const duration = (STATS.endTime - STATS.startTime) / 1000;
  
  console.log('\n' + chalk.bold.blue('=== 构建报告 ==='));
  console.log(chalk.blue(`总文章数: ${STATS.totalArticles}`));
  console.log(chalk.blue(`处理文章数: ${STATS.processedArticles}`));
  console.log(chalk.blue(`新增文章: ${STATS.newArticles}`));
  console.log(chalk.blue(`更新文章: ${STATS.updatedArticles}`));
  console.log(chalk.blue(`构建耗时: ${duration.toFixed(2)}秒`));
  
  if (STATS.errors.length > 0) {
    console.log(chalk.red(`错误数: ${STATS.errors.length}`));
    STATS.errors.forEach((error, index) => {
      console.log(chalk.red(`  ${index + 1}. ${error}`));
    });
  } else {
    console.log(chalk.green('错误数: 0'));
  }
  
  if (STATS.warnings.length > 0) {
    console.log(chalk.yellow(`警告数: ${STATS.warnings.length}`));
    STATS.warnings.forEach((warning, index) => {
      console.log(chalk.yellow(`  ${index + 1}. ${warning}`));
    });
  } else {
    console.log(chalk.green('警告数: 0'));
  }
  
  console.log(chalk.bold.blue('================\n'));
}

/**
 * 监听文件变化
 * @param {Array} allArticles 所有文章
 */
function watchFiles(allArticles) {
  console.log(chalk.blue('开始监听文件变化...'));
  
  // 创建监听器
  const watcher = chokidar.watch(`${CONFIG.articlesDir}/**/*.md`, {
    persistent: true,
    ignoreInitial: true
  });
  
  // 文件添加或修改
  watcher.on('add', async (filePath) => {
    console.log(chalk.blue(`文件添加: ${filePath}`));
    STATS.newArticles++;
    
    const article = await processMarkdownFile(filePath, allArticles);
    if (article) {
      allArticles.push(article);
      STATS.processedArticles++;
      
      // 重新生成文章列表页面
      await generateArticleListPages(allArticles);
      
      // 更新网站地图
      await generateSitemap(allArticles);
    }
  });
  
  watcher.on('change', async (filePath) => {
    console.log(chalk.blue(`文件修改: ${filePath}`));
    STATS.updatedArticles++;
    
    // 查找文章索引
    const slug = generateSlug(filePath);
    const index = allArticles.findIndex(article => article && article.slug === slug);
    
    if (index !== -1) {
      // 重新处理文件
      const article = await processMarkdownFile(filePath, allArticles);
      if (article) {
        allArticles[index] = article;
        STATS.processedArticles++;
        
        // 重新生成文章列表页面
        await generateArticleListPages(allArticles);
        
        // 更新网站地图
        await generateSitemap(allArticles);
      }
    } else {
      // 新文件
      STATS.newArticles++;
      const article = await processMarkdownFile(filePath, allArticles);
      if (article) {
        allArticles.push(article);
        STATS.processedArticles++;
        
        // 重新生成文章列表页面
        await generateArticleListPages(allArticles);
        
        // 更新网站地图
        await generateSitemap(allArticles);
      }
    }
  });
  
  watcher.on('unlink', async (filePath) => {
    console.log(chalk.blue(`文件删除: ${filePath}`));
    
    // 查找文章索引
    const slug = generateSlug(filePath);
    const index = allArticles.findIndex(article => article && article.slug === slug);
    
    if (index !== -1) {
      // 删除HTML文件
      const article = allArticles[index];
      const outputPath = path.join(CONFIG.outputDir, article.category, `${article.slug}.html`);
      
      try {
        await fs.remove(outputPath);
        console.log(chalk.green(`✓ 已删除: ${outputPath}`));
        
        // 从数组中移除
        allArticles.splice(index, 1);
        
        // 重新生成文章列表页面
        await generateArticleListPages(allArticles);
        
        // 更新网站地图
        await generateSitemap(allArticles);
      } catch (error) {
        STATS.errors.push(`删除文件 ${outputPath} 失败: ${error.message}`);
        console.error(chalk.red(`✗ 删除文件失败: ${outputPath}`), error);
      }
    }
  });
  
  // 错误处理
  watcher.on('error', (error) => {
    STATS.errors.push(`监听文件时出错: ${error.message}`);
    console.error(chalk.red('✗ 监听文件时出错:'), error);
  });
  
  // 优雅退出
  process.on('SIGINT', () => {
    console.log(chalk.blue('\n停止监听文件变化...'));
    watcher.close();
    printBuildReport();
    process.exit(0);
  });
}

/**
 * 生成分类文章列表页面
 * @param {Array} allArticles 所有文章
 * @returns {Promise<void>}
 */
async function generateArticleListPages(allArticles) {
  try {
    console.log(chalk.blue('生成文章列表页面...'));
    
    // 确保输出目录存在
    ensureDirectoryExists(path.join(CONFIG.outputDir, 'articles'));
    
    // 获取热门文章
    const popularArticles = findPopularArticles(allArticles);
    
    // 收集所有标签
    const allTags = collectAllTags(allArticles);
    
    // 按日期排序（最新的在前）
    allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 生成所有文章列表页面（分页）
    await generatePaginatedArticleList(allArticles, null, popularArticles, allTags);
    
    // 为每个分类生成文章列表页面（分页）
    for (const category of CONFIG.categories) {
      const categoryArticles = allArticles.filter(article => article.category === category);
      if (categoryArticles.length > 0) {
        await generatePaginatedArticleList(categoryArticles, category, popularArticles, allTags);
      }
    }
    
    console.log(chalk.green('✓ 已生成文章列表页面'));
  } catch (error) {
    STATS.errors.push(`生成文章列表页面失败: ${error.message}`);
    console.error(chalk.red('✗ 生成文章列表页面失败:'), error);
  }
}

/**
 * 生成分页的文章列表页面
 * @param {Array} articles 文章数组
 * @param {string|null} category 分类名称，如果为null则表示所有文章
 * @param {Array} popularArticles 热门文章
 * @param {Array} allTags 所有标签
 * @returns {Promise<void>}
 */
async function generatePaginatedArticleList(articles, category, popularArticles, allTags) {
  // 计算总页数
  const totalPages = Math.ceil(articles.length / CONFIG.articlesPerPage);
  
  // 确定输出目录
  const outputDir = category 
    ? path.join(CONFIG.outputDir, category) 
    : path.join(CONFIG.outputDir, 'articles');
  
  // 确保输出目录存在
  ensureDirectoryExists(outputDir);
  
  // 生成每一页
  for (let page = 1; page <= totalPages; page++) {
    // 计算当前页的文章
    const startIndex = (page - 1) * CONFIG.articlesPerPage;
    const endIndex = Math.min(startIndex + CONFIG.articlesPerPage, articles.length);
    const pageArticles = articles.slice(startIndex, endIndex);
    
    // 构建分页URL基础
    const paginationBaseUrl = category 
      ? `/${category}/index.html?` 
      : '/articles/index.html?';
    
    // 渲染模板
    const renderedHtml = nunjucks.render('article-list.html', {
      articles: pageArticles,
      category_name: category,
      categories: CONFIG.categories,
      current_page: page,
      total_pages: totalPages,
      pagination_base_url: paginationBaseUrl,
      popularArticles: popularArticles,
      allTags: allTags,
      current_year: new Date().getFullYear()
    });
    
    // 美化HTML
    const prettyHtml = pretty(renderedHtml, { ocd: true });
    
    // 确定输出文件名
    const outputFileName = page === 1 ? 'index.html' : `page-${page}.html`;
    const outputPath = path.join(outputDir, outputFileName);
    
    // 写入HTML文件
    await fs.writeFile(outputPath, prettyHtml, 'utf8');
    
    console.log(chalk.green(`✓ 已生成: ${outputPath}`));
  }
}

/**
 * 生成首页
 * @param {Array} allArticles 所有文章
 * @returns {Promise<void>}
 */
async function generateHomePage(allArticles) {
  try {
    console.log(chalk.blue('生成首页...'));
    
    // 按分类分组文章
    const articlesByCategory = {};
    CONFIG.categories.forEach(category => {
      articlesByCategory[category] = allArticles
        .filter(article => article.category === category)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6); // 每个分类最多显示6篇文章
    });
    
    // 获取热门文章
    const popularArticles = findPopularArticles(allArticles, 6);
    
    // 获取最新文章
    const latestArticles = [...allArticles]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8);
    
    // 收集所有标签
    const allTags = collectAllTags(allArticles);
    
    // 渲染模板
    const renderedHtml = nunjucks.render('home.html', {
      articlesByCategory,
      popularArticles,
      latestArticles,
      allTags,
      categories: CONFIG.categories,
      current_year: new Date().getFullYear()
    });
    
    // 美化HTML
    const prettyHtml = pretty(renderedHtml, { ocd: true });
    
    // 写入HTML文件
    const outputPath = path.join(CONFIG.outputDir, 'index.html');
    await fs.writeFile(outputPath, prettyHtml, 'utf8');
    
    console.log(chalk.green(`✓ 已生成首页: ${outputPath}`));
  } catch (error) {
    STATS.errors.push(`生成首页失败: ${error.message}`);
    console.error(chalk.red('✗ 生成首页失败:'), error);
  }
}

/**
 * 主函数
 */
async function main() {
  STATS.startTime = Date.now();
  
  try {
    console.log(chalk.blue('开始构建网站...'));
    
    // 确保输出目录存在
    CONFIG.categories.forEach(category => {
      ensureDirectoryExists(path.join(CONFIG.outputDir, category));
    });
    
    // 查找所有Markdown文件
    console.log(chalk.blue('查找Markdown文件...'));
    const markdownFiles = await findMarkdownFiles(CONFIG.articlesDir);
    STATS.totalArticles = markdownFiles.length;
    
    console.log(chalk.blue(`找到 ${markdownFiles.length} 个Markdown文件`));
    
    if (markdownFiles.length === 0) {
      console.log(chalk.yellow('没有找到Markdown文件，程序退出'));
      return;
    }
    
    // 首先收集所有文章的元数据
    console.log(chalk.blue('提取文章元数据...'));
    const allArticlesPromises = markdownFiles.map(async (filePath) => {
      try {
        const content = await fs.readFile(filePath, 'utf8');
        const { metadata } = extractMetadata(content, filePath);
        
        return {
          ...metadata,
          filePath,
          url: `${CONFIG.baseUrl}/${metadata.category}/${metadata.slug}.html`
        };
      } catch (error) {
        STATS.errors.push(`读取文件 ${filePath} 失败: ${error.message}`);
        console.error(chalk.red(`✗ 读取文件失败: ${filePath}`), error);
        return null;
      }
    });
    
    const allArticlesResults = await Promise.all(allArticlesPromises);
    const allArticles = allArticlesResults.filter(result => result !== null);
    
    // 按日期排序（最新的在前）
    allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 处理所有Markdown文件
    console.log(chalk.blue('处理Markdown文件...'));
    const processPromises = markdownFiles.map(filePath => processMarkdownFile(filePath, allArticles));
    const processResults = await Promise.all(processPromises);
    
    // 过滤掉处理失败的文件
    const successResults = processResults.filter(result => result !== null);
    STATS.processedArticles = successResults.length;
    
    // 生成首页
    await generateHomePage(allArticles);
    
    // 生成文章列表页面
    await generateArticleListPages(allArticles);
    
    // 生成网站地图
    console.log(chalk.blue('生成网站地图...'));
    await generateSitemap(successResults);
    
    // 输出构建报告
    printBuildReport();
    
    // 如果是监听模式，开始监听文件变化
    if (CONFIG.watchMode) {
      watchFiles(allArticles);
    }
    
  } catch (error) {
    STATS.errors.push(`构建过程出错: ${error.message}`);
    console.error(chalk.red('✗ 构建过程出错:'), error);
    printBuildReport();
  }
}

// 执行主函数
main(); 