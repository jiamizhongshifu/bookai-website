const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItToc = require('markdown-it-toc-done-right');
const slugify = require('slugify');

// 测试文件路径
const testFilePath = path.join(__dirname, '..', 'articles', 'test-markdown-it.md');
const outputFilePath = path.join(__dirname, '..', 'test-markdown-it.html');

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

// 读取测试文件
console.log(`读取测试文件: ${testFilePath}`);
if (!fs.existsSync(testFilePath)) {
  console.error('测试文件不存在，请先创建测试文件');
  process.exit(1);
}

const content = fs.readFileSync(testFilePath, 'utf8');
console.log(`文件内容长度: ${content.length} 字符`);

// 转换Markdown为HTML
console.log('转换Markdown为HTML...');
const htmlContent = md.render(content);

// 创建完整的HTML文档
const fullHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown-it 测试</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/styles/atom-one-dark.min.css">
  <link rel="stylesheet" href="/css/markdown-it.css">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      background-color: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 10px;
      margin-top: 0;
    }
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #1a1a1a;
        color: #f0f0f0;
      }
      .container {
        background-color: #2a2a2a;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      }
      a {
        color: #58a6ff;
      }
      h1 {
        border-bottom-color: #333;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    ${htmlContent}
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/highlight.min.js"></script>
  <script>
    // 初始化代码高亮
    document.addEventListener('DOMContentLoaded', (event) => {
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
        
        // 添加语言标签
        const language = block.getAttribute('class')?.match(/language-(\w+)/)?.[1];
        if (language) {
          block.parentElement.setAttribute('data-language', language);
        }
      });
      
      // 图片懒加载
      document.querySelectorAll('img.lazy-image').forEach(img => {
        if (img.dataset.src) {
          const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.disconnect();
              }
            });
          });
          observer.observe(img);
        }
      });
    });
  </script>
</body>
</html>
`;

// 写入HTML文件
console.log(`写入HTML文件: ${outputFilePath}`);
fs.writeFileSync(outputFilePath, fullHtml, 'utf8');

console.log('转换完成！');
console.log(`请在浏览器中打开 ${outputFilePath} 查看结果`); 