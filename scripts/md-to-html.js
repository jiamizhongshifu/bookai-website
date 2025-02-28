/**
 * Markdown转HTML工具
 * 
 * 功能：
 * - 遍历/articles目录查找.md文件
 * - 提取文章元数据（标题、摘要、分类、标签等）
 * - 将Markdown转换为HTML
 * - 使用Nunjucks模板渲染HTML文件
 * - 按照/{category}/{slug}.html的结构输出文件
 */

const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItToc = require('markdown-it-toc-done-right');
const slugify = require('slugify');

// 配置Nunjucks
const templatesDir = path.join(__dirname, '..', 'templates');
const env = nunjucks.configure(templatesDir, {
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

// 文章目录
const articlesDir = path.join(__dirname, '..', 'articles');
// 输出目录
const outputDir = path.join(__dirname, '..');

// 确保输出目录存在
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 从Markdown文件中提取元数据
function extractMetadata(content) {
  const metadata = {
    title: '',
    date: new Date().toISOString().split('T')[0],
    author: '加密钟师傅',
    category: 'tools',
    tags: ['AI工具'],
    summary: ''
  };

  // 尝试从内容中提取标题
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    metadata.title = titleMatch[1].trim();
  }

  // 尝试从内容中提取摘要
  const summaryMatch = content.match(/^>+\s*(.+)$/m);
  if (summaryMatch) {
    metadata.summary = summaryMatch[1].trim();
  } else {
    // 如果没有找到摘要，使用内容的前100个字符
    const plainText = content.replace(/#+\s+.+/g, '').replace(/\[.+\]\(.+\)/g, '').replace(/\n/g, ' ').trim();
    metadata.summary = plainText.substring(0, 100) + '...';
  }

  // 尝试从内容中提取分类
  const categoryMatch = content.match(/分类[:：]\s*(.+)$/m);
  if (categoryMatch) {
    metadata.category = categoryMatch[1].trim();
  } else {
    // 根据内容关键词推断分类
    if (content.includes('ChatGPT') || content.includes('GPT-4')) {
      metadata.category = 'chatgpt';
    } else if (content.includes('Cursor')) {
      metadata.category = 'cursor';
    } else if (content.includes('Deepseek')) {
      metadata.category = 'deepseek';
    } else {
      metadata.category = 'tools';
    }
  }

  // 尝试从内容中提取标签
  const tagsMatch = content.match(/标签[:：]\s*(.+)$/m);
  if (tagsMatch) {
    metadata.tags = tagsMatch[1].split(',').map(tag => tag.trim());
  } else {
    // 根据内容关键词推断标签
    const keywords = ['ChatGPT', 'GPT-4', 'Cursor', 'Deepseek', 'AI编程', '提示词工程', 'AI写作'];
    metadata.tags = keywords.filter(keyword => content.includes(keyword));
    if (metadata.tags.length === 0) {
      metadata.tags = ['AI工具'];
    }
  }

  // 尝试从内容中提取日期
  const dateMatch = content.match(/日期[:：]\s*(\d{4}-\d{2}-\d{2})/m);
  if (dateMatch) {
    metadata.date = dateMatch[1];
  }

  // 尝试从内容中提取作者
  const authorMatch = content.match(/作者[:：]\s*(.+)$/m);
  if (authorMatch) {
    metadata.author = authorMatch[1].trim();
  }

  return metadata;
}

// 生成相关文章
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

// 处理单个Markdown文件
function processMarkdownFile(filePath, allArticles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const metadata = extractMetadata(content);
  
  // 生成slug
  const fileName = path.basename(filePath, '.md');
  metadata.slug = slugify(fileName, { lower: true, strict: true });
  
  // 转换Markdown为HTML
  const htmlContent = md.render(content);
  
  // 获取相关文章
  const relatedArticles = getRelatedArticles(metadata, allArticles);
  
  // 获取前一篇和后一篇文章
  const currentIndex = allArticles.findIndex(article => article.slug === metadata.slug);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;
  
  // 渲染模板
  const renderedHtml = nunjucks.render('article-detail.html', {
    title: metadata.title,
    content: htmlContent,
    metadata: metadata,
    relatedArticles: relatedArticles,
    prevArticle: prevArticle,
    nextArticle: nextArticle
  });
  
  // 确保输出目录存在
  const categoryDir = path.join(outputDir, metadata.category);
  ensureDirectoryExists(categoryDir);
  
  // 写入HTML文件
  const outputPath = path.join(categoryDir, `${metadata.slug}.html`);
  fs.writeFileSync(outputPath, renderedHtml);
  
  console.log(`已生成: ${outputPath}`);
  
  return metadata;
}

// 主函数
function main() {
  console.log('开始转换Markdown文件为HTML...');
  
  // 获取所有Markdown文件
  const markdownFiles = [];
  
  function findMarkdownFiles(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findMarkdownFiles(filePath);
      } else if (file.endsWith('.md')) {
        markdownFiles.push(filePath);
      }
    }
  }
  
  findMarkdownFiles(articlesDir);
  
  console.log(`找到 ${markdownFiles.length} 个Markdown文件`);
  
  // 首先收集所有文章的元数据
  const allArticles = [];
  
  for (const filePath of markdownFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const metadata = extractMetadata(content);
    
    // 生成slug
    const fileName = path.basename(filePath, '.md');
    metadata.slug = slugify(fileName, { lower: true, strict: true });
    metadata.filePath = filePath;
    
    allArticles.push(metadata);
  }
  
  // 按日期排序（最新的在前）
  allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // 处理每个Markdown文件
  for (const article of allArticles) {
    processMarkdownFile(article.filePath, allArticles);
  }
  
  console.log('转换完成！');
  console.log(`共处理了 ${markdownFiles.length} 个文件`);
}

// 执行主函数
main(); 