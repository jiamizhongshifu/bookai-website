// 导航菜单数据
const navigationData = {
    mainMenu: [
        {
            title: "ChatGPT教程",
            link: "/chatgpt/",
            subMenu: [
                { title: "注册指南", link: "/chatgpt/chatgpt-registration-guide.html" },
                { title: "Plus会员评测", link: "/chatgpt/chatgpt-plus-review.html" },
                { title: "编程教程", link: "/chatgpt/chatgpt-coding-tutorial.html" },
                { title: "写作指南", link: "/chatgpt/chatgpt-writing-guide.html" },
                { title: "电商应用", link: "/chatgpt/chatgpt-ecommerce-guide.html" },
                { title: "教育应用", link: "/chatgpt/chatgpt-education-guide.html" }
            ]
        },
        {
            title: "DeepSeek教程",
            link: "/deepseek/",
            subMenu: [
                { title: "API开发", link: "/deepseek/deepseek-api-development.html" },
                { title: "企业安全", link: "/deepseek/deepseek-enterprise-security.html" },
                { title: "教育应用", link: "/deepseek/deepseek-education-guide.html" }
            ]
        },
        {
            title: "Cursor教程",
            link: "/cursor/",
            subMenu: [
                { title: "插件开发", link: "/cursor/cursor-plugin-development.html" },
                { title: "企业安全", link: "/cursor/cursor-enterprise-security.html" }
            ]
        }
    ]
};

// 创建导航菜单
function createNavigation() {
    const nav = document.querySelector('.navbar-nav');
    if (!nav) return;

    // 添加教程目录链接
    const tutorialLink = document.createElement('li');
    tutorialLink.className = 'nav-item';
    tutorialLink.innerHTML = '<a class="nav-link" href="/articles/README.html">教程目录</a>';
    nav.appendChild(tutorialLink);

    // 添加主菜单
    navigationData.mainMenu.forEach(menu => {
        const menuItem = document.createElement('li');
        menuItem.className = 'nav-item dropdown';
        
        const menuHtml = `
            <a class="nav-link dropdown-toggle" href="${menu.link}" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                ${menu.title}
            </a>
            <ul class="dropdown-menu">
                ${menu.subMenu.map(sub => `
                    <li><a class="dropdown-item" href="${sub.link}">${sub.title}</a></li>
                `).join('')}
            </ul>
        `;
        
        menuItem.innerHTML = menuHtml;
        nav.appendChild(menuItem);
    });

    // 添加关于我们和联系我们链接
    const aboutLink = document.createElement('li');
    aboutLink.className = 'nav-item';
    aboutLink.innerHTML = '<a class="nav-link" href="/about.html">关于我们</a>';
    nav.appendChild(aboutLink);

    const contactLink = document.createElement('li');
    contactLink.className = 'nav-item';
    contactLink.innerHTML = '<a class="nav-link" href="/contact.html">联系我们</a>';
    nav.appendChild(contactLink);
}

// 在页面加载完成后初始化导航
document.addEventListener('DOMContentLoaded', createNavigation); 