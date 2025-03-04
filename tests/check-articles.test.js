const fs = require('fs');
const path = require('path');
const os = require('os');

// 模拟chalk模块
jest.mock('chalk', () => ({
    blue: jest.fn(text => text),
    red: jest.fn(text => text),
    yellow: jest.fn(text => text),
    green: jest.fn(text => text)
}));

describe('文章检查工具测试', () => {
    let tempDir;
    let originalArticlesDir;
    let originalArticleListFile;
    let originalThumbnailsDir;
    let originalLogFile;

    beforeEach(() => {
        // 创建临时测试目录
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'article-test-'));
        
        // 创建必要的子目录
        const dirs = ['articles/wenzhang', 'images/thumbnails', 'logs', 'js'];
        dirs.forEach(dir => {
            fs.mkdirSync(path.join(tempDir, dir), { recursive: true });
        });

        // 复制测试文件到临时目录
        fs.copyFileSync(
            path.join(__dirname, 'fixtures/test-article.html'),
            path.join(tempDir, 'articles/wenzhang/test-article.html')
        );
        fs.copyFileSync(
            path.join(__dirname, 'fixtures/test-article-list.js'),
            path.join(tempDir, 'js/article-list.js')
        );

        // 创建测试用的缩略图
        fs.writeFileSync(
            path.join(tempDir, 'images/thumbnails/test-article.jpg'),
            'dummy image content'
        );

        // 备份原始配置
        const scriptPath = path.join(__dirname, '../scripts/check-articles.js');
        const script = require(scriptPath);
        originalArticlesDir = script.config.articlesDir;
        originalArticleListFile = script.config.articleListFile;
        originalThumbnailsDir = script.config.thumbnailsDir;
        originalLogFile = script.config.logFile;

        // 修改配置以使用临时目录
        script.config.articlesDir = path.join(tempDir, 'articles/wenzhang');
        script.config.articleListFile = path.join(tempDir, 'js/article-list.js');
        script.config.thumbnailsDir = path.join(tempDir, 'images/thumbnails');
        script.config.logFile = path.join(tempDir, 'logs/article-check.log');
    });

    afterEach(() => {
        // 恢复原始配置
        const script = require('../scripts/check-articles.js');
        script.config.articlesDir = originalArticlesDir;
        script.config.articleListFile = originalArticleListFile;
        script.config.thumbnailsDir = originalThumbnailsDir;
        script.config.logFile = originalLogFile;

        // 清理临时目录
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    test('检查文章完整性 - 正常情况', async () => {
        const script = require('../scripts/check-articles.js');
        const issues = await script.checkArticles();
        expect(issues).toEqual([]);
    });

    test('检查文章完整性 - 缺少缩略图', async () => {
        // 删除缩略图
        fs.unlinkSync(path.join(tempDir, 'images/thumbnails/test-article.jpg'));
        
        const script = require('../scripts/check-articles.js');
        const issues = await script.checkArticles();
        expect(issues).toContain('文章 test-article.html 的缩略图 test-article.jpg 不存在');
    });

    test('提取文章信息', () => {
        const script = require('../scripts/check-articles.js');
        const articlePath = path.join(tempDir, 'articles/wenzhang/test-article.html');
        const info = script.extractArticleInfo(articlePath);
        
        expect(info).toEqual({
            title: '测试文章标题',
            description: '这是一篇测试文章的描述',
            category: 'ChatGPT'
        });
    });

    test('添加新文章', async () => {
        const script = require('../scripts/check-articles.js');
        const newArticlePath = path.join(tempDir, 'articles/wenzhang/new-article.html');
        
        // 创建新文章文件
        fs.copyFileSync(
            path.join(__dirname, 'fixtures/test-article.html'),
            newArticlePath
        );
        
        await script.addNewArticle(newArticlePath);
        
        // 验证文章列表是否更新
        const articleListContent = fs.readFileSync(
            path.join(tempDir, 'js/article-list.js'),
            'utf-8'
        );
        
        expect(articleListContent).toContain('new-article.html');
        expect(articleListContent).toContain('测试文章标题');
    });
}); 