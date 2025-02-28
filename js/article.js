/**
 * 文章页面交互功能
 * 包含目录导航、阅读进度条、返回顶部等功能
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化各项功能
    initTableOfContents();
    initReadingProgress();
    initBackToTop();
    initTocToggle();
    initCodeHighlight();
    initImageLightbox();
    initShareButtons();
    initCommentForm();
});

/**
 * 初始化文章目录
 * 复制主目录到侧边栏固定目录
 * 添加目录项点击事件和滚动监听
 */
function initTableOfContents() {
    // 复制主目录到侧边栏
    const mainToc = document.querySelector('.article-toc .toc-content');
    const sidebarToc = document.querySelector('.sidebar-toc .toc-content');
    
    if (mainToc && sidebarToc) {
        sidebarToc.innerHTML = mainToc.innerHTML;
    }
    
    // 为所有目录链接添加平滑滚动效果
    const tocLinks = document.querySelectorAll('.article-toc a, .sidebar-toc a');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // 计算目标位置，考虑固定头部的高度
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                // 平滑滚动到目标位置
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 更新URL，但不触发页面跳转
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // 监听滚动事件，高亮当前阅读的章节
    window.addEventListener('scroll', highlightCurrentSection);
}

/**
 * 高亮当前阅读的章节
 */
function highlightCurrentSection() {
    const sections = document.querySelectorAll('.article-section');
    const tocLinks = document.querySelectorAll('.article-toc a, .sidebar-toc a');
    
    // 获取当前滚动位置
    const scrollPosition = window.scrollY;
    const headerHeight = document.querySelector('header').offsetHeight;
    
    // 找到当前可见的章节
    let currentSection = null;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 50;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSection = section.id;
        }
    });
    
    // 移除所有目录项的高亮
    tocLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // 高亮当前章节的目录项
    if (currentSection) {
        const activeLinks = document.querySelectorAll(`.article-toc a[href="#${currentSection}"], .sidebar-toc a[href="#${currentSection}"]`);
        activeLinks.forEach(link => {
            link.classList.add('active');
        });
    }
}

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
 * 初始化代码高亮
 * 注意：需要引入代码高亮库，如Prism.js或Highlight.js
 */
function initCodeHighlight() {
    // 检查是否已加载代码高亮库
    if (window.Prism) {
        Prism.highlightAll();
    } else if (window.hljs) {
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
    } else {
        // 如果没有加载代码高亮库，可以动态加载
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js';
        script.onload = function() {
            // 加载核心库后加载语言支持
            const languageScript = document.createElement('script');
            languageScript.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-javascript.min.js';
            languageScript.onload = function() {
                Prism.highlightAll();
            };
            document.head.appendChild(languageScript);
            
            // 加载样式
            const style = document.createElement('link');
            style.rel = 'stylesheet';
            style.href = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css';
            document.head.appendChild(style);
        };
        document.head.appendChild(script);
    }
}

/**
 * 初始化图片灯箱效果
 */
function initImageLightbox() {
    const articleImages = document.querySelectorAll('.article-content img');
    
    articleImages.forEach(img => {
        // 为图片添加点击事件
        img.addEventListener('click', function() {
            // 创建灯箱元素
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            
            // 创建灯箱内容
            const lightboxContent = document.createElement('div');
            lightboxContent.className = 'lightbox-content';
            
            // 创建关闭按钮
            const closeButton = document.createElement('button');
            closeButton.className = 'lightbox-close';
            closeButton.innerHTML = '<i class="fas fa-times"></i>';
            
            // 创建图片元素
            const lightboxImg = document.createElement('img');
            lightboxImg.src = this.src;
            lightboxImg.alt = this.alt;
            
            // 组装灯箱
            lightboxContent.appendChild(closeButton);
            lightboxContent.appendChild(lightboxImg);
            lightbox.appendChild(lightboxContent);
            document.body.appendChild(lightbox);
            
            // 防止页面滚动
            document.body.style.overflow = 'hidden';
            
            // 关闭灯箱的事件
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox || e.target === closeButton || e.target === closeButton.querySelector('i')) {
                    document.body.removeChild(lightbox);
                    document.body.style.overflow = '';
                }
            });
        });
        
        // 添加可点击的视觉提示
        img.style.cursor = 'pointer';
    });
}

/**
 * 初始化分享按钮
 */
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.article-share a');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            let shareUrl = '';
            
            // 根据不同的分享平台设置分享URL
            if (this.classList.contains('share-twitter')) {
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            } else if (this.classList.contains('share-facebook')) {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            } else if (this.classList.contains('share-linkedin')) {
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            } else if (this.classList.contains('share-weibo')) {
                shareUrl = `http://service.weibo.com/share/share.php?url=${url}&title=${title}`;
            } else if (this.classList.contains('share-wechat')) {
                // 微信分享需要生成二维码
                // 这里可以使用第三方库如qrcode.js
                alert('请截图后在微信中扫描分享');
                return;
            }
            
            // 打开分享窗口
            window.open(shareUrl, '_blank', 'width=600,height=400');
        });
    });
}

/**
 * 初始化评论表单
 */
function initCommentForm() {
    const commentForm = document.querySelector('.comment-form');
    
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const name = document.getElementById('comment-name').value;
            const email = document.getElementById('comment-email').value;
            const content = document.getElementById('comment-content').value;
            
            // 这里可以添加评论提交逻辑
            // 例如使用fetch API发送到后端
            
            // 模拟评论提交成功
            alert('评论提交成功，等待审核后显示');
            
            // 清空表单
            commentForm.reset();
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