// SEO 配置
const seoConfig = {
    siteName: '加密钟师傅',
    defaultTitle: 'AI编程教程 - 加密钟师傅',
    defaultDescription: '最专业的 AI 编程学习平台，提供 ChatGPT、DeepSeek、Cursor 等 AI 工具的使用教程',
    defaultKeywords: 'AI编程,ChatGPT教程,DeepSeek教程,Cursor教程,AI学习',
    baseUrl: 'https://www.jiaocheng.com', // 需要替换为实际域名
    socialImage: '/images/social-share.jpg',
    twitterHandle: '@jiaochengmaster',
    googleSiteVerification: '', // 需要添加 Google 验证码
    baiduSiteVerification: ''  // 需要添加百度验证码
};

// 更新页面 Meta 标签
function updateMetaTags(data = {}) {
    // 设置标题
    document.title = data.title ? 
        `${data.title} - ${seoConfig.siteName}` : 
        seoConfig.defaultTitle;

    // 更新或创建 meta 标签
    const metaTags = {
        'description': data.description || seoConfig.defaultDescription,
        'keywords': data.keywords || seoConfig.defaultKeywords,
        'og:title': data.title || seoConfig.defaultTitle,
        'og:description': data.description || seoConfig.defaultDescription,
        'og:image': data.image || seoConfig.socialImage,
        'og:url': window.location.href,
        'og:type': 'article',
        'og:site_name': seoConfig.siteName,
        'twitter:card': 'summary_large_image',
        'twitter:site': seoConfig.twitterHandle,
        'twitter:title': data.title || seoConfig.defaultTitle,
        'twitter:description': data.description || seoConfig.defaultDescription,
        'twitter:image': data.image || seoConfig.socialImage
    };

    // 更新现有的或创建新的 meta 标签
    Object.entries(metaTags).forEach(([name, content]) => {
        let meta = document.querySelector(`meta[name="${name}"]`) || 
                  document.querySelector(`meta[property="${name}"]`);
                  
        if (!meta) {
            meta = document.createElement('meta');
            if (name.startsWith('og:')) {
                meta.setAttribute('property', name);
            } else {
                meta.setAttribute('name', name);
            }
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    });

    // 添加规范链接
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);
}

// 生成结构化数据
function generateStructuredData(data = {}) {
    const articleData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': data.title || seoConfig.defaultTitle,
        'description': data.description || seoConfig.defaultDescription,
        'image': data.image || seoConfig.socialImage,
        'author': {
            '@type': 'Person',
            'name': '加密钟师傅'
        },
        'publisher': {
            '@type': 'Organization',
            'name': seoConfig.siteName,
            'logo': {
                '@type': 'ImageObject',
                'url': `${seoConfig.baseUrl}/images/logo.png`
            }
        },
        'datePublished': data.publishDate || new Date().toISOString(),
        'dateModified': data.modifyDate || new Date().toISOString(),
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': window.location.href
        }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(articleData);
    document.head.appendChild(script);
}

// 生成面包屑导航数据
function generateBreadcrumbData(breadcrumbs) {
    const breadcrumbData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbs.map((item, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'name': item.title,
            'item': `${seoConfig.baseUrl}${item.url}`
        }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(breadcrumbData);
    document.head.appendChild(script);
}

// 导出函数
window.seo = {
    config: seoConfig,
    updateMetaTags,
    generateStructuredData,
    generateBreadcrumbData
}; 