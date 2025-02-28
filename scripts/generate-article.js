const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');
const handlebars = require('handlebars');

// 配置marked选项
marked.setOptions({
    gfm: true,
    breaks: true,
    highlight: function(code, lang) {
        const prism = require('prismjs');
        const loadLanguages = require('prismjs/components/');
        
        if (lang && !prism.languages[lang]) {
            try {
                loadLanguages([lang]);
            } catch (e) {
                console.warn(`Language '${lang}' not found, using plaintext`);
                return code;
            }
        }
        
        return lang ? prism.highlight(code, prism.languages[lang], lang) : code;
    }
});

// 读取文章模板
const templatePath = path.join(__dirname, '../templates/article-template.html');
const template = handlebars.compile(fs.readFileSync(templatePath, 'utf8'));

/**
 * 生成文章HTML
 * @param {string} markdownPath - Markdown文件路径
 * @param {string} outputPath - 输出HTML文件路径
 */
function generateArticle(markdownPath, outputPath) {
    // 读取并解析Markdown文件
    const fileContent = fs.readFileSync(markdownPath, 'utf8');
    const { data: frontMatter, content } = matter(fileContent);
    
    // 将Markdown转换为HTML
    const htmlContent = marked(content);
    
    // 准备模板数据
    const templateData = {
        title: frontMatter.title,
        description: frontMatter.description || '',
        keywords: frontMatter.keywords || '',
        publishDate: frontMatter.date ? new Date(frontMatter.date).toLocaleDateString('zh-CN') : '',
        content: htmlContent,
        tags: frontMatter.tags || [],
        breadcrumbs: generateBreadcrumbs(markdownPath),
        url: getArticleUrl(outputPath)
    };
    
    // 渲染模板
    const html = template(templateData);
    
    // 确保输出目录存在
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 写入HTML文件
    fs.writeFileSync(outputPath, html);
    console.log(`Generated: ${outputPath}`);
}

/**
 * 生成面包屑导航
 * @param {string} filePath - 文件路径
 * @returns {Array} 面包屑数组
 */
function generateBreadcrumbs(filePath) {
    const relativePath = path.relative(process.cwd(), filePath);
    const parts = relativePath.split(path.sep);
    const breadcrumbs = [];
    let currentPath = '';
    
    for (let i = 0; i < parts.length - 1; i++) {
        currentPath = path.join(currentPath, parts[i]);
        breadcrumbs.push({
            title: parts[i],
            url: '/' + currentPath
        });
    }
    
    return breadcrumbs;
}

/**
 * 获取文章URL
 * @param {string} outputPath - 输出文件路径
 * @returns {string} 文章URL
 */
function getArticleUrl(outputPath) {
    return '/' + path.relative(process.cwd(), outputPath).replace(/\\/g, '/');
}

/**
 * 处理目录中的所有Markdown文件
 * @param {string} sourceDir - 源目录
 * @param {string} outputDir - 输出目录
 */
function processDirectory(sourceDir, outputDir) {
    const files = fs.readdirSync(sourceDir);
    
    files.forEach(file => {
        const sourcePath = path.join(sourceDir, file);
        const stat = fs.statSync(sourcePath);
        
        if (stat.isDirectory()) {
            // 递归处理子目录
            processDirectory(sourcePath, path.join(outputDir, file));
        } else if (file.endsWith('.md')) {
            // 处理Markdown文件
            const outputPath = path.join(
                outputDir,
                file.replace('.md', '.html')
            );
            generateArticle(sourcePath, outputPath);
        }
    });
}

// 主函数
function main() {
    const sourceDir = path.join(process.cwd(), 'articles');
    const outputDir = process.cwd();
    
    if (!fs.existsSync(sourceDir)) {
        console.error('Source directory not found:', sourceDir);
        process.exit(1);
    }
    
    console.log('Starting article generation...');
    processDirectory(sourceDir, outputDir);
    console.log('Article generation completed.');
}

// 运行主函数
if (require.main === module) {
    main();
}

module.exports = {
    generateArticle,
    processDirectory
}; 