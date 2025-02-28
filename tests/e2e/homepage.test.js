/**
 * 主页端到端测试
 * 使用Playwright测试框架
 */

// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('主页功能测试', () => {
  test('应该正确加载主页', async ({ page }) => {
    // 访问主页
    await page.goto('/');
    
    // 检查标题
    const title = await page.title();
    expect(title).toContain('AiXueba');
    
    // 检查导航菜单
    const navItems = await page.locator('.main-nav li').count();
    expect(navItems).toBeGreaterThan(0);
    
    // 检查轮播图
    const carousel = await page.locator('.carousel-container');
    expect(await carousel.isVisible()).toBeTruthy();
    
    // 检查教程区域
    const tutorials = await page.locator('#tutorials');
    expect(await tutorials.isVisible()).toBeTruthy();
    
    // 检查资源区域
    const resources = await page.locator('#resources');
    expect(await resources.isVisible()).toBeTruthy();
  });
  
  test('搜索功能应该正常工作', async ({ page }) => {
    // 访问主页
    await page.goto('/');
    
    // 输入搜索关键词
    await page.fill('.search-input', 'ChatGPT');
    await page.click('.search-button');
    
    // 等待搜索结果
    await page.waitForSelector('.search-results');
    
    // 检查搜索结果
    const searchResults = await page.locator('.search-results');
    expect(await searchResults.isVisible()).toBeTruthy();
  });
  
  test('深色模式切换应该正常工作', async ({ page }) => {
    // 访问主页
    await page.goto('/');
    
    // 获取初始模式
    const initialHasDarkMode = await page.evaluate(() => {
      return document.body.classList.contains('dark-mode');
    });
    
    // 点击深色模式切换按钮
    await page.click('.dark-mode-toggle');
    
    // 检查模式是否已切换
    const newHasDarkMode = await page.evaluate(() => {
      return document.body.classList.contains('dark-mode');
    });
    
    expect(newHasDarkMode).not.toEqual(initialHasDarkMode);
  });
  
  test('导航链接应该正确工作', async ({ page }) => {
    // 访问主页
    await page.goto('/');
    
    // 点击ChatGPT教程链接
    await page.click('a[href="#chatgpt"]');
    
    // 检查URL是否包含锚点
    expect(page.url()).toContain('#chatgpt');
    
    // 检查页面是否滚动到相应位置
    const isInViewport = await page.evaluate(() => {
      const element = document.querySelector('#chatgpt');
      if (!element) return false;
      
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
      );
    });
    
    expect(isInViewport).toBeTruthy();
  });
}); 