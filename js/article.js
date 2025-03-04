/**
 * 文章页面交互功能
 * 包含目录导航、阅读进度条、返回顶部等功能
 */

// 文章功能模块
const Article = {
    // 初始化
    init() {
        this.generateTableOfContents();
        this.setupCodeHighlighting();
        this.setupImageLightbox();
        this.setupScrollSpy();
        this.setupShareButtons();
        this.loadComments();
    },

    // 生成文章目录
    generateTableOfContents() {
        const article = document.querySelector('.article-content');
        const toc = document.getElementById('article-toc');
        if (!article || !toc) return;

        const headings = article.querySelectorAll('h2, h3');
        if (headings.length === 0) {
            toc.parentElement.style.display = 'none';
            return;
        }

        const tocList = document.createElement('ul');
        headings.forEach((heading, index) => {
            // 为每个标题添加ID
            heading.id = `heading-${index}`;
            
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${heading.id}`;
            a.textContent = heading.textContent;
            a.classList.add(`toc-${heading.tagName.toLowerCase()}`);
            
            li.appendChild(a);
            tocList.appendChild(li);
        });

        toc.appendChild(tocList);
    },

    // 代码高亮设置
    setupCodeHighlighting() {
        // Prism.js 会自动处理代码高亮
        // 这里可以添加额外的配置
        document.querySelectorAll('pre code').forEach((block) => {
            if (!block.classList.contains('language-')) {
                block.classList.add('language-plaintext');
            }
        });
    },

    // 图片点击放大
    setupImageLightbox() {
        const images = document.querySelectorAll('.article-content img');
        images.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                const modal = document.createElement('div');
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
                modal.style.display = 'flex';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
                modal.style.zIndex = '1000';

                const modalImg = document.createElement('img');
                modalImg.src = img.src;
                modalImg.style.maxHeight = '90%';
                modalImg.style.maxWidth = '90%';
                modalImg.style.objectFit = 'contain';

                modal.appendChild(modalImg);
                document.body.appendChild(modal);

                modal.addEventListener('click', () => {
                    modal.remove();
                });
            });
        });
    },

    // 滚动监听
    setupScrollSpy() {
        const tocLinks = document.querySelectorAll('#article-toc a');
        if (tocLinks.length === 0) return;

        const observerOptions = {
            rootMargin: '-100px 0px -70% 0px',
            threshold: 1.0
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                const link = document.querySelector(`#article-toc a[href="#${id}"]`);
                
                if (entry.isIntersecting) {
                    tocLinks.forEach(l => l.classList.remove('active'));
                    link?.classList.add('active');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.article-content h2, .article-content h3').forEach((heading) => {
            observer.observe(heading);
        });
    },

    // 设置分享按钮
    setupShareButtons() {
        const shareButtons = document.querySelectorAll('.share-buttons a');
        shareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const url = button.href;
                window.open(url, 'share-dialog', 'width=626,height=436');
            });
        });
    },

    // 加载评论系统
    loadComments() {
        // 这里可以集成第三方评论系统，如 Disqus、Gitalk 等
        const commentsContainer = document.getElementById('comments');
        if (!commentsContainer) return;

        // 示例：添加一个简单的评论提示
        commentsContainer.innerHTML = `
            <div class="alert alert-info">
                评论系统正在开发中...
            </div>
        `;
    }
};

// 当页面加载完成时初始化文章功能
document.addEventListener('DOMContentLoaded', () => {
    Article.init();
});

/**
 * 初始化阅读进度条
 */
function initReadingProgress() {
    const progressBar = document.querySelector('.reading-progress-bar');
    
    if (progressBar) {
        window.addEventListener('scroll', function() {
            // 计算阅读进度百分比
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrollPosition = window.scrollY;
            const progress = (scrollPosition / documentHeight) * 100;
            
            // 更新进度条宽度
            progressBar.style.width = `${progress}%`;
        });
    }
}

/**
 * 初始化返回顶部按钮
 */
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        // 监听滚动事件，控制按钮显示/隐藏
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // 点击返回顶部
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * 初始化目录折叠功能
 */
function initTocToggle() {
    const tocToggle = document.querySelector('.toc-toggle');
    const tocContent = document.querySelector('.article-toc .toc-content');
    
    if (tocToggle && tocContent) {
        tocToggle.addEventListener('click', function() {
            tocContent.classList.toggle('collapsed');
            tocToggle.classList.toggle('collapsed');
            
            // 更新图标
            const icon = tocToggle.querySelector('i');
            if (tocContent.classList.contains('collapsed')) {
                icon.className = 'fas fa-chevron-down';
            } else {
                icon.className = 'fas fa-chevron-up';
            }
        });
    }
}

/**
 * 添加自定义样式
 * 为特定元素添加额外的CSS样式
 */
function addCustomStyles() {
    // 创建样式元素
    const style = document.createElement('style');
    style.textContent = `
        /* 灯箱样式 */
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        
        .lightbox-content img {
            max-width: 100%;
            max-height: 90vh;
            display: block;
            margin: 0 auto;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }
        
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
        }
        
        /* 信息提示框样式 */
        .info-box, .tip-box, .warning-box {
            margin: 20px 0;
            padding: 15px;
            border-radius: 5px;
            display: flex;
            align-items: flex-start;
        }
        
        .info-box {
            background-color: #e3f2fd;
            border-left: 4px solid #2196f3;
        }
        
        .tip-box {
            background-color: #e8f5e9;
            border-left: 4px solid #4caf50;
        }
        
        .warning-box {
            background-color: #fff3e0;
            border-left: 4px solid #ff9800;
        }
        
        .info-icon, .tip-icon, .warning-icon {
            margin-right: 15px;
            font-size: 20px;
        }
        
        .info-icon i {
            color: #2196f3;
        }
        
        .tip-icon i {
            color: #4caf50;
        }
        
        .warning-icon i {
            color: #ff9800;
        }
        
        .info-content, .tip-content, .warning-content {
            flex: 1;
        }
        
        /* 示例框样式 */
        .example-box {
            margin: 20px 0;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
            overflow: hidden;
        }
        
        .example-header {
            background-color: #f5f5f5;
            padding: 10px 15px;
            font-weight: bold;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .example-content {
            padding: 15px;
        }
        
        /* 代码块样式 */
        pre {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            margin: 20px 0;
        }
        
        code {
            font-family: 'Courier New', Courier, monospace;
        }
        
        /* 表格样式 */
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
        }
        
        th, td {
            border: 1px solid #e0e0e0;
            padding: 10px;
            text-align: left;
        }
        
        th {
            background-color: #f5f5f5;
            font-weight: bold;
        }
        
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
    `;
    
    // 添加到文档头部
    document.head.appendChild(style);
}

// 添加自定义样式
addCustomStyles(); 