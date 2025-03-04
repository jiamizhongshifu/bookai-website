const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const removeMd = require('remove-markdown');

// 要扫描的目录
const directories = [
    'chatgpt',
    'deepseek',
    'cursor',
    'articles'
];

// 要扫描的文件扩展名
const fileExtensions = ['.html', '.md'];

// 存储所有文章数据
const articles = [];

// 递归扫描目录
function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // 如果是目录，递归扫描
            scanDirectory(filePath);
        } else if (fileExtensions.includes(path.extname(file))) {
            // 如果是目标文件类型，处理文件
            processFile(filePath);
        }
    });
}

// 处理单个文件
function processFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    let fileData = {};
    
    // 根据文件类型处理内容
    if (path.extname(filePath) === '.md') {
        // 处理 Markdown 文件
        const { data, content: mdContent } = matter(content);
        fileData = {
            title: data.title || getFilenameAsTitle(filePath),
            description: data.description || '',
            content: removeMd(mdContent).trim(),
            ...data
        };
    } else {
        // 处理 HTML 文件
        const titleMatch = content.match(/<title>(.*?)<\/title>/);
        const descriptionMatch = content.match(/<meta name="description" content="(.*?)">/);
        const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/);
        
        fileData = {
            title: titleMatch ? titleMatch[1] : getFilenameAsTitle(filePath),
            description: descriptionMatch ? descriptionMatch[1] : '',
            content: bodyMatch ? cleanHtml(bodyMatch[1]) : ''
        };
    }
    
    // 添加文件路径信息
    fileData.url = '/' + path.relative(process.cwd(), filePath).replace(/\\/g, '/');
    fileData.lastModified = fs.statSync(filePath).mtime;
    
    articles.push(fileData);
}

// 清理 HTML 内容
function cleanHtml(html) {
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // 移除 script 标签
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')   // 移除 style 标签
        .replace(/<[^>]+>/g, ' ')                                           // 移除其他 HTML 标签
        .replace(/\s+/g, ' ')                                               // 合并空白字符
        .trim();                                                            // 移除首尾空白
}

// 从文件名生成标题
function getFilenameAsTitle(filePath) {
    return path.basename(filePath, path.extname(filePath))
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

// 主函数
function main() {
    // 扫描所有目录
    directories.forEach(dir => {
        if (fs.existsSync(dir)) {
            scanDirectory(dir);
        }
    });
    
    // 按最后修改时间排序
    articles.sort((a, b) => b.lastModified - a.lastModified);
    
    // 写入搜索数据文件
    const searchData = articles.map(article => ({
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        lastModified: article.lastModified.toISOString()
    }));
    
    fs.writeFileSync('search-data.json', JSON.stringify(searchData, null, 2));
    console.log(`生成了 ${articles.length} 篇文章的搜索数据`);
}

// 运行主函数
main(); 