/**
 * AiXueba Bootstrap版本主要JavaScript文件
 * 处理暗色模式切换和其他交互功能
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化各项功能
    initDarkModeToggle();
    initScrollAnimation();
    initNavbarScroll();
});

/**
 * 初始化暗色模式切换
 */
function initDarkModeToggle() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const htmlElement = document.documentElement;
    const darkModeIcon = darkModeToggle.querySelector('i');
    
    // 检查本地存储中的暗色模式设置
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // 根据设置应用暗色模式
    if (isDarkMode) {
        htmlElement.setAttribute('data-bs-theme', 'dark');
        darkModeIcon.classList.remove('fa-moon');
        darkModeIcon.classList.add('fa-sun');
    }
    
    // 切换暗色模式
    darkModeToggle.addEventListener('click', function() {
        const currentTheme = htmlElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // 更新主题
        htmlElement.setAttribute('data-bs-theme', newTheme);
        
        // 更新图标
        if (newTheme === 'dark') {
            darkModeIcon.classList.remove('fa-moon');
            darkModeIcon.classList.add('fa-sun');
        } else {
            darkModeIcon.classList.remove('fa-sun');
            darkModeIcon.classList.add('fa-moon');
        }
        
        // 保存设置到本地存储
        localStorage.setItem('darkMode', newTheme === 'dark');
    });
}

/**
 * 初始化滚动动画
 * 当元素进入视口时添加动画效果
 */
function initScrollAnimation() {
    // 获取所有教程卡片
    const cards = document.querySelectorAll('.tutorial-card');
    
    // 创建Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                // 一旦动画完成，停止观察
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // 使用视口作为根
        threshold: 0.1, // 当10%的元素可见时触发
        rootMargin: '0px' // 无边距
    });
    
    // 观察每个卡片
    cards.forEach(card => {
        observer.observe(card);
    });
}

/**
 * 初始化导航栏滚动效果
 * 当页面滚动时改变导航栏样式
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
}

/**
 * 平滑滚动到锚点
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // 计算目标位置，考虑固定头部的高度
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            // 平滑滚动到目标位置
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
}); 