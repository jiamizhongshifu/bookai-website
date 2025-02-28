/**
 * markdown-it配置文件
 * 
 * 功能：
 * - 自动添加锚点标题（h2-h6）
 * - 代码块语法高亮（集成highlight.js）
 * - 图片懒加载（替换<img>为<loading=lazy>）
 * - 自动生成文章目录树（嵌套ul结构）
 */

const MarkdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItTocDoneRight = require('markdown-it-toc-done-right');
const markdownItHighlightjs = require('markdown-it-highlightjs');
const hljs = require('highlight.js');

/**
 * 创建配置好的markdown-it实例
 * @param {Object} options - 配置选项
 * @returns {MarkdownIt} 配置好的markdown-it实例
 */
function createMarkdownIt(options = {}) {
  // 默认配置
  const defaultOptions = {
    html: true,           // 启用HTML标签
    xhtmlOut: true,       // 使用'/'闭合单标签
    breaks: false,        // 将换行符转换为<br>
    linkify: true,        // 自动将URL转换为链接
    typographer: true,    // 启用一些语言中立的替换和引号美化
    langPrefix: 'language-', // 代码块的CSS语言前缀
    highlight: function (str, lang) {
      // 如果指定了语言且highlight.js支持该语言
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (__) {}
      }
      // 使用自动检测
      try {
        return hljs.highlightAuto(str).value;
      } catch (__) {}
      // 使用普通转义
      return '';
    }
  };

  // 合并用户选项
  const mergedOptions = { ...defaultOptions, ...options };
  
  // 创建markdown-it实例
  const md = new MarkdownIt(mergedOptions);
  
  // 配置锚点插件
  md.use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.linkInsideHeader({
      symbol: '#',
      placement: 'before'
    }),
    level: [2, 3, 4, 5, 6], // 只为h2-h6添加锚点
    slugify: s => 
      encodeURIComponent(
        String(s)
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '')
      )
  });
  
  // 配置目录插件
  md.use(markdownItTocDoneRight, {
    containerClass: 'toc-container',
    containerId: 'toc',
    listClass: 'toc-list',
    itemClass: 'toc-item',
    linkClass: 'toc-link',
    level: [2, 3, 4], // 只包含h2-h4在目录中
    listType: 'ul',
    format: function(heading) {
      return heading;
    }
  });
  
  // 配置代码高亮插件
  md.use(markdownItHighlightjs, {
    inline: true,
    auto: true
  });
  
  // 自定义渲染器，添加图片懒加载
  const defaultImageRenderer = md.renderer.rules.image;
  md.renderer.rules.image = function(tokens, idx, options, env, self) {
    const token = tokens[idx];
    
    // 添加loading="lazy"属性
    const srcIndex = token.attrIndex('src');
    if (srcIndex >= 0) {
      const loadingIndex = token.attrIndex('loading');
      if (loadingIndex < 0) {
        token.attrPush(['loading', 'lazy']);
      } else {
        token.attrs[loadingIndex][1] = 'lazy';
      }
      
      // 添加class属性
      const classIndex = token.attrIndex('class');
      if (classIndex < 0) {
        token.attrPush(['class', 'lazy-image']);
      } else {
        token.attrs[classIndex][1] += ' lazy-image';
      }
      
      // 添加decoding="async"属性
      const decodingIndex = token.attrIndex('decoding');
      if (decodingIndex < 0) {
        token.attrPush(['decoding', 'async']);
      }
    }
    
    // 调用原始渲染器
    return defaultImageRenderer(tokens, idx, options, env, self);
  };
  
  return md;
}

/**
 * 生成文章目录树HTML
 * @param {string} content - Markdown内容
 * @returns {string} 目录树HTML
 */
function generateTOC(content) {
  const md = createMarkdownIt();
  // 插入目录占位符
  const contentWithToc = '[[toc]]\n\n' + content;
  // 渲染Markdown
  const html = md.render(contentWithToc);
  // 提取目录部分
  const tocMatch = html.match(/<div id="toc" class="toc-container">([\s\S]*?)<\/div>/);
  return tocMatch ? tocMatch[0] : '';
}

/**
 * 渲染Markdown为HTML
 * @param {string} content - Markdown内容
 * @param {boolean} includeToc - 是否包含目录
 * @returns {string} 渲染后的HTML
 */
function renderMarkdown(content, includeToc = false) {
  const md = createMarkdownIt();
  
  // 如果需要包含目录，添加目录占位符
  if (includeToc) {
    content = '[[toc]]\n\n' + content;
  }
  
  // 渲染Markdown
  return md.render(content);
}

/**
 * 从Markdown内容中提取标题结构
 * @param {string} content - Markdown内容
 * @returns {Array} 标题结构数组
 */
function extractHeadings(content) {
  const headings = [];
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  let match;
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length; // ## = 2, ### = 3, #### = 4
    const text = match[2];
    const id = text.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    
    headings.push({ level, text, id });
  }
  
  return headings;
}

/**
 * 从标题数组生成嵌套的目录结构
 * @param {Array} headings - 标题数组
 * @returns {Array} 嵌套的目录结构
 */
function generateNestedTOC(headings) {
  const result = [];
  const stack = [{ level: 1, children: result }];
  
  headings.forEach(heading => {
    while (stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }
    
    const parent = stack[stack.length - 1].children;
    const newHeading = { ...heading, children: [] };
    parent.push(newHeading);
    stack.push(newHeading);
  });
  
  return result;
}

module.exports = {
  createMarkdownIt,
  renderMarkdown,
  generateTOC,
  extractHeadings,
  generateNestedTOC
}; 