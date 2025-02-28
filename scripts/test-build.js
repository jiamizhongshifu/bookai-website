/**
 * 构建测试脚本
 * 
 * 用于测试build.js的功能，只处理一篇文章
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { exec } = require('child_process');

// 测试配置
const CONFIG = {
  testArticle: path.join(__dirname, '..', 'articles', 'test-markdown-it.md'),
  outputDir: path.join(__dirname, '..', 'test-output'),
  buildScript: path.join(__dirname, 'build.js')
};

/**
 * 清理测试输出目录
 */
async function cleanTestOutput() {
  console.log(chalk.blue('清理测试输出目录...'));
  await fs.emptyDir(CONFIG.outputDir);
  console.log(chalk.green('✓ 已清理测试输出目录'));
}

/**
 * 创建测试文章
 */
async function createTestArticle() {
  console.log(chalk.blue('检查测试文章...'));
  
  // 检查测试文章是否存在
  if (await fs.pathExists(CONFIG.testArticle)) {
    console.log(chalk.green('✓ 测试文章已存在'));
    return;
  }
  
  // 创建测试文章
  console.log(chalk.blue('创建测试文章...'));
  
  const testContent = `---
title: Markdown渲染测试
summary: 这是一篇用于测试Markdown渲染功能的文章
category: tools
tags: [测试, Markdown, 渲染]
date: ${new Date().toISOString().split('T')[0]}
author: AI进化论-花生
---

# Markdown渲染测试

> 这是一篇用于测试Markdown渲染功能的文章

## 目录

[[toc]]

## 1. 标题测试

### 1.1 三级标题

#### 1.1.1 四级标题

## 2. 文本格式

**粗体文本** 和 *斜体文本* 以及 ~~删除线文本~~

## 3. 列表测试

无序列表:

- 项目1
- 项目2
  - 子项目2.1
  - 子项目2.2
- 项目3

有序列表:

1. 第一步
2. 第二步
3. 第三步

## 4. 代码测试

行内代码: \`const x = 1;\`

代码块:

\`\`\`javascript
// 这是一个JavaScript代码块
function hello() {
  console.log("Hello, world!");
  return true;
}
\`\`\`

## 5. 表格测试

| 名称 | 类型 | 描述 |
|------|------|------|
| id | string | 唯一标识符 |
| name | string | 名称 |
| age | number | 年龄 |

## 6. 引用测试

> 这是一段引用文本
> 
> 这是引用的第二行

## 7. 链接和图片测试

[这是一个链接](https://aixueba.club)

![这是一张图片](https://picsum.photos/800/400)

## 8. 水平线测试

---

## 9. 任务列表测试

- [x] 已完成任务
- [ ] 未完成任务
- [x] 另一个已完成任务

## 10. 数学公式测试

行内公式: $E = mc^2$

块级公式:

$$
\\frac{d}{dx}\\left( \\int_{0}^{x} f(u)\\,du\\right)=f(x)
$$

## 结束

这是测试文档的结尾。
`;
  
  await fs.writeFile(CONFIG.testArticle, testContent, 'utf8');
  console.log(chalk.green('✓ 已创建测试文章'));
}

/**
 * 运行构建脚本
 */
function runBuildScript() {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue('运行构建脚本...'));
    
    // 设置环境变量，指定输出目录
    const env = {
      ...process.env,
      OUTPUT_DIR: CONFIG.outputDir
    };
    
    // 执行构建脚本
    const buildProcess = exec(`node ${CONFIG.buildScript}`, { env });
    
    // 输出构建脚本的输出
    buildProcess.stdout.on('data', (data) => {
      process.stdout.write(data);
    });
    
    buildProcess.stderr.on('data', (data) => {
      process.stderr.write(data);
    });
    
    // 处理构建脚本的结束
    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log(chalk.green('✓ 构建脚本执行成功'));
        resolve();
      } else {
        console.error(chalk.red(`✗ 构建脚本执行失败，退出码: ${code}`));
        reject(new Error(`构建脚本执行失败，退出码: ${code}`));
      }
    });
  });
}

/**
 * 打开生成的HTML文件
 */
function openGeneratedHtml() {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue('尝试打开生成的HTML文件...'));
    
    // 查找生成的HTML文件
    const toolsDir = path.join(CONFIG.outputDir, 'tools');
    
    if (!fs.existsSync(toolsDir)) {
      console.log(chalk.yellow('未找到tools目录，可能未生成HTML文件'));
      resolve();
      return;
    }
    
    // 查找HTML文件
    const files = fs.readdirSync(toolsDir);
    const htmlFile = files.find(file => file.endsWith('.html'));
    
    if (!htmlFile) {
      console.log(chalk.yellow('未找到HTML文件'));
      resolve();
      return;
    }
    
    const htmlPath = path.join(toolsDir, htmlFile);
    console.log(chalk.green(`✓ 找到HTML文件: ${htmlPath}`));
    
    // 根据操作系统打开HTML文件
    const command = process.platform === 'win32' 
      ? `start "" "${htmlPath}"` 
      : process.platform === 'darwin' 
        ? `open "${htmlPath}"` 
        : `xdg-open "${htmlPath}"`;
    
    exec(command, (error) => {
      if (error) {
        console.error(chalk.yellow(`无法自动打开HTML文件: ${error.message}`));
        console.log(chalk.blue(`请手动打开文件: ${htmlPath}`));
      } else {
        console.log(chalk.green('✓ 已打开HTML文件'));
      }
      resolve();
    });
  });
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log(chalk.bold.blue('=== 开始测试构建脚本 ==='));
    
    // 清理测试输出目录
    await cleanTestOutput();
    
    // 创建测试文章
    await createTestArticle();
    
    // 运行构建脚本
    await runBuildScript();
    
    // 打开生成的HTML文件
    await openGeneratedHtml();
    
    console.log(chalk.bold.green('=== 测试完成 ==='));
  } catch (error) {
    console.error(chalk.red('测试过程中出错:'), error);
    process.exit(1);
  }
}

// 执行主函数
main(); 