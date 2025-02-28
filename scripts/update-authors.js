/**
 * 批量更新文章作者脚本
 * 
 * 功能：
 * 1. 遍历所有Markdown文件
 * 2. 更新Front Matter中的author字段
 * 3. 更新文章内容中的"作者："标记
 */

const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');
const chalk = require('chalk');

// 配置
const CONFIG = {
  articlesDir: path.join(__dirname, '..', 'articles'),
  newAuthor: '加密钟师傅'
};

// 统计数据
const STATS = {
  totalFiles: 0,
  updatedFiles: 0,
  errors: []
};

/**
 * 递归查找所有Markdown文件
 * @param {string} dir 目录路径
 * @returns {Promise<string[]>} Markdown文件路径数组
 */
async function findMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() 
      ? await findMarkdownFiles(fullPath) 
      : (entry.name.endsWith('.md') ? fullPath : []);
  }));
  
  return files.flat();
}

/**
 * 更新单个文件的作者信息
 * @param {string} filePath 文件路径
 * @returns {Promise<boolean>} 是否更新成功
 */
async function updateAuthorInFile(filePath) {
  try {
    // 读取文件内容
    const content = await fs.readFile(filePath, 'utf8');
    
    // 解析front matter
    const { data, content: markdownContent } = matter(content);
    let updated = false;
    
    // 更新front matter中的author字段
    if (data.author && data.author !== CONFIG.newAuthor) {
      data.author = CONFIG.newAuthor;
      updated = true;
    }
    
    // 更新文章内容中的作者标记
    const authorRegex = /(作者[:：]\s*)(.+)$/m;
    const updatedMarkdownContent = markdownContent.replace(authorRegex, (match, prefix, oldAuthor) => {
      if (oldAuthor.trim() !== CONFIG.newAuthor) {
        updated = true;
        return `${prefix}${CONFIG.newAuthor}`;
      }
      return match;
    });
    
    if (updated) {
      // 重新组合内容
      const updatedContent = matter.stringify(updatedMarkdownContent, data);
      
      // 写回文件
      await fs.writeFile(filePath, updatedContent, 'utf8');
      console.log(chalk.green(`✓ 已更新: ${filePath}`));
      return true;
    } else {
      console.log(chalk.blue(`- 无需更新: ${filePath}`));
      return false;
    }
  } catch (error) {
    STATS.errors.push(`更新文件 ${filePath} 失败: ${error.message}`);
    console.error(chalk.red(`✗ 更新文件失败: ${filePath}`), error);
    return false;
  }
}

/**
 * 输出报告
 */
function printReport() {
  console.log('\n' + chalk.bold.blue('=== 更新报告 ==='));
  console.log(chalk.blue(`总文件数: ${STATS.totalFiles}`));
  console.log(chalk.blue(`更新文件数: ${STATS.updatedFiles}`));
  
  if (STATS.errors.length > 0) {
    console.log(chalk.red(`错误数: ${STATS.errors.length}`));
    STATS.errors.forEach((error, index) => {
      console.log(chalk.red(`  ${index + 1}. ${error}`));
    });
  } else {
    console.log(chalk.green('错误数: 0'));
  }
  
  console.log(chalk.bold.blue('================\n'));
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log(chalk.blue('开始批量更新文章作者信息...'));
    
    // 查找所有Markdown文件
    console.log(chalk.blue('查找Markdown文件...'));
    const markdownFiles = await findMarkdownFiles(CONFIG.articlesDir);
    STATS.totalFiles = markdownFiles.length;
    
    console.log(chalk.blue(`找到 ${markdownFiles.length} 个Markdown文件`));
    
    if (markdownFiles.length === 0) {
      console.log(chalk.yellow('没有找到Markdown文件，程序退出'));
      return;
    }
    
    // 更新所有文件
    console.log(chalk.blue('更新文件作者信息...'));
    for (const filePath of markdownFiles) {
      const updated = await updateAuthorInFile(filePath);
      if (updated) {
        STATS.updatedFiles++;
      }
    }
    
    // 输出报告
    printReport();
    
  } catch (error) {
    STATS.errors.push(`更新过程出错: ${error.message}`);
    console.error(chalk.red('✗ 更新过程出错:'), error);
    printReport();
  }
}

// 执行主函数
main(); 