/**
 * 文章链接完整性检查和文章列表更新工具
 * 用于自动检查文章链接的有效性，并帮助更新文章列表
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk'); // 用于控制台彩色输出

// 配置项
const config = {
    // 文章目录
    articlesDir: path.join(__dirname, '../articles/wenzhang'),
    // 文章列表JS文件
    articleListFile: path.join(__dirname, '../js/article-list.js'),
    // 文章分类
    categories: ['ChatGPT', 'Cursor', 'DeepSeek', 'AI工具'],
    // 缩略图目录
    thumbnailsDir: path.join(__dirname, '../images/thumbnails'),
    // 检查结果日志文件
    logFile: path.join(__dirname, '../logs/article-check.log')
};

// 创建日志目录
if (!fs.existsSync(path.join(__dirname, '../logs'))) {
    fs.mkdirSync(path.join(__dirname, '../logs'));
}

/**
 * 检查文章文件的完整性
 */
async function checkArticles() {
    console.log(chalk.blue('开始检查文章完整性...'));
    const issues = [];
    const articleFiles = fs.readdirSync(config.articlesDir);
    
    // 读取现有的文章列表数据
    const articleListContent = fs.readFileSync(config.articleListFile, 'utf-8');
    const articleDataMatch = articleListContent.match(/const\s+articlesData\s*=\s*\[([\s\S]*?)\];/);
    if (!articleDataMatch) {
        issues.push('无法在article-list.js中找到articlesData数组');
        return issues;
    }
    
    const existingArticles = eval(`[${articleDataMatch[1]}]`);
    const existingUrls = new Set(existingArticles.map(a => a.url));
    
    // 检查每个文章文件
    for (const file of articleFiles) {
        if (!file.endsWith('.html')) continue;
        
        // 1. 检查文件是否在文章列表中
        if (!existingUrls.has(file)) {
            issues.push(`文章 ${file} 未在article-list.js中注册`);
        }
        
        // 2. 检查缩略图是否存在
        const thumbnailName = file.replace('.html', '.jpg');
        const thumbnailPath = path.join(config.thumbnailsDir, thumbnailName);
        if (!fs.existsSync(thumbnailPath)) {
            issues.push(`文章 ${file} 的缩略图 ${thumbnailName} 不存在`);
        }
        
        // 3. 检查文章内容的基本结构
        try {
            const content = fs.readFileSync(path.join(config.articlesDir, file), 'utf-8');
            if (!content.includes('<title>')) {
                issues.push(`文章 ${file} 缺少标题标签`);
            }
            if (!content.includes('<meta name="description"')) {
                issues.push(`文章 ${file} 缺少描述meta标签`);
            }
        } catch (err) {
            issues.push(`读取文章 ${file} 时出错: ${err.message}`);
        }
    }
    
    // 检查文章列表中的URL是否都有对应的文件
    for (const article of existingArticles) {
        if (!fs.existsSync(path.join(config.articlesDir, article.url))) {
            issues.push(`article-list.js中的文章 ${article.url} 文件不存在`);
        }
    }
    
    // 记录检查结果
    const timestamp = new Date().toISOString();
    const logContent = `
检查时间: ${timestamp}
${issues.length ? '发现问题:\n' + issues.join('\n') : '未发现问题'}
----------------------------------------
`;
    
    fs.appendFileSync(config.logFile, logContent);
    
    // 控制台输出结果
    if (issues.length) {
        console.log(chalk.red(`发现 ${issues.length} 个问题：`));
        issues.forEach(issue => console.log(chalk.yellow(`- ${issue}`)));
    } else {
        console.log(chalk.green('文章完整性检查通过！'));
    }
    
    return issues;
}

/**
 * 从HTML文件中提取文章信息
 */
function extractArticleInfo(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    const descMatch = content.match(/<meta name="description" content="(.*?)"/);
    const categoryMatch = content.match(/<meta name="category" content="(.*?)"/);
    
    return {
        title: titleMatch ? titleMatch[1] : '',
        description: descMatch ? descMatch[1] : '',
        category: categoryMatch ? categoryMatch[1] : ''
    };
}

/**
 * 添加新文章到文章列表
 */
async function addNewArticle(filePath) {
    console.log(chalk.blue('开始添加新文章...'));
    
    // 提取文件名
    const fileName = path.basename(filePath);
    
    // 检查文件是否已存在于文章列表
    const articleListContent = fs.readFileSync(config.articleListFile, 'utf-8');
    if (articleListContent.includes(fileName)) {
        console.log(chalk.yellow('文章已存在于列表中'));
        return;
    }
    
    // 提取文章信息
    const articleInfo = extractArticleInfo(filePath);
    
    // 生成新文章对象
    const newArticle = {
        id: Date.now(), // 使用时间戳作为临时ID
        title: articleInfo.title,
        path: fileName,
        description: articleInfo.description,
        thumbnail: `../images/thumbnails/${fileName.replace('.html', '.jpg')}`,
        category: articleInfo.category,
        date: new Date().toISOString().split('T')[0],
        views: 0
    };
    
    // 更新文章列表文件
    const updatedContent = articleListContent.replace(
        /(const\s+articlesData\s*=\s*\[)([\s\S]*?)(\];)/,
        (match, start, content, end) => {
            const newArticleStr = JSON.stringify(newArticle, null, 4)
                .replace(/"([^"]+)":/g, '    $1:') // 格式化缩进
                .replace(/^/gm, '    '); // 添加缩进
            return `${start}${content},\n${newArticleStr}${end}`;
        }
    );
    
    fs.writeFileSync(config.articleListFile, updatedContent);
    console.log(chalk.green('新文章已添加到列表中'));
    
    // 检查缩略图
    const thumbnailPath = path.join(config.thumbnailsDir, fileName.replace('.html', '.jpg'));
    if (!fs.existsSync(thumbnailPath)) {
        console.log(chalk.yellow(`警告：缺少缩略图 ${fileName.replace('.html', '.jpg')}`));
    }
}

/**
 * 主函数
 */
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
        case 'check':
            await checkArticles();
            break;
            
        case 'add':
            if (!args[1]) {
                console.log(chalk.red('请指定要添加的文章文件路径'));
                process.exit(1);
            }
            await addNewArticle(args[1]);
            break;
            
        default:
            console.log(`
使用方法：
  node check-articles.js check  # 检查所有文章的完整性
  node check-articles.js add <文章路径>  # 添加新文章到列表
`);
    }
}

// 运行脚本
if (require.main === module) {
    main().catch(err => {
        console.error(chalk.red('发生错误：'), err);
        process.exit(1);
    });
}

// 导出函数和配置供测试使用
module.exports = {
    checkArticles,
    extractArticleInfo,
    addNewArticle,
    config
}; 