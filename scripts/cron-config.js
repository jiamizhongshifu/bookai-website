/**
 * 定时任务配置文件
 * 用于设置自动运行文章检查脚本的时间
 */

const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');
const chalk = require('chalk');

// 配置定时任务
const tasks = {
    // 每天凌晨2点运行文章完整性检查
    articleCheck: {
        schedule: '0 2 * * *',
        command: 'node check-articles.js check',
        description: '检查文章完整性'
    }
};

// 运行定时任务
Object.entries(tasks).forEach(([name, task]) => {
    console.log(chalk.blue(`正在设置定时任务: ${name}`));
    console.log(chalk.gray(`时间表达式: ${task.schedule}`));
    console.log(chalk.gray(`任务描述: ${task.description}`));
    
    cron.schedule(task.schedule, () => {
        console.log(chalk.yellow(`开始执行任务: ${name}`));
        exec(task.command, {
            cwd: __dirname
        }, (error, stdout, stderr) => {
            if (error) {
                console.error(chalk.red(`任务执行出错: ${error.message}`));
                return;
            }
            if (stderr) {
                console.error(chalk.yellow(`任务警告信息: ${stderr}`));
            }
            console.log(chalk.green(`任务执行成功:`));
            console.log(stdout);
        });
    });
}); 