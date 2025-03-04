const express = require('express');
const path = require('path');
const fs = require('fs');
const { checkArticles } = require('./check-articles');

const app = express();
const port = 3000;

// 添加错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        error: '服务器错误',
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// 静态文件服务
app.use(express.static(path.join(__dirname, '..')));

// 获取检查历史
app.get('/api/article-checks', (req, res) => {
    try {
        console.log('正在获取检查历史...');
        const logFile = path.join(__dirname, '../logs/article-check.log');
        console.log('日志文件路径:', logFile);
        
        if (!fs.existsSync(logFile)) {
            console.log('日志文件不存在，返回空数组');
            return res.json([]);
        }

        const content = fs.readFileSync(logFile, 'utf-8');
        console.log('读取到的日志内容长度:', content.length);
        
        const checks = content.split('----------------------------------------')
            .filter(block => block.trim())
            .map(block => {
                const lines = block.trim().split('\n');
                const timestamp = lines[1].replace('检查时间: ', '').trim();
                const issues = [];
                let totalArticles = 0;

                // 解析问题
                if (lines[2].includes('发现问题:')) {
                    for (let i = 3; i < lines.length; i++) {
                        if (lines[i].trim()) {
                            issues.push(lines[i].trim());
                        }
                    }
                }

                // 从文章目录获取总文章数
                const articlesDir = path.join(__dirname, '../articles/wenzhang');
                console.log('文章目录路径:', articlesDir);
                
                if (fs.existsSync(articlesDir)) {
                    const files = fs.readdirSync(articlesDir);
                    totalArticles = files.filter(file => file.endsWith('.html')).length;
                    console.log('找到的文章数量:', totalArticles);
                } else {
                    console.log('文章目录不存在');
                }

                return {
                    timestamp,
                    issues,
                    totalArticles
                };
            })
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        console.log('返回的检查记录数量:', checks.length);
        res.json(checks);
    } catch (error) {
        console.error('获取检查历史失败：', error);
        res.status(500).json({ error: '获取检查历史失败', details: error.message });
    }
});

// 执行文章检查
app.post('/api/check-articles', async (req, res) => {
    try {
        console.log('开始执行文章检查...');
        const issues = await checkArticles();
        console.log('检查完成，发现问题数量:', issues.length);
        res.json({ success: true, issues });
    } catch (error) {
        console.error('执行检查失败：', error);
        res.status(500).json({ 
            error: '执行检查失败', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// 添加一个测试路由
app.get('/api/test', (req, res) => {
    res.json({ message: 'API服务器正常运行' });
});

// 启动服务器
app.listen(port, () => {
    console.log(`文章检查管理服务器运行在 http://localhost:${port}/admin/article-check.html`);
    console.log('当前工作目录:', process.cwd());
    console.log('文章目录:', path.join(__dirname, '../articles/wenzhang'));
    console.log('日志目录:', path.join(__dirname, '../logs'));
}); 