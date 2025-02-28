@echo off
echo 文章转换工具启动中...

REM 检查Node.js是否安装
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 错误: 未找到Node.js，请先安装Node.js
    echo 您可以从 https://nodejs.org/zh-cn/download/ 下载安装
    pause
    exit /b 1
)

REM 检查依赖包是否安装
if not exist node_modules (
    echo 正在安装依赖包...
    npm install
    if %ERRORLEVEL% neq 0 (
        echo 错误: 依赖包安装失败
        pause
        exit /b 1
    )
)

echo 开始转换Markdown文件...
node scripts/md-to-html.js
if %ERRORLEVEL% neq 0 (
    echo 错误: 转换过程中出现问题
    pause
    exit /b 1
)

echo 开始渲染模板...
node scripts/render-templates.js
if %ERRORLEVEL% neq 0 (
    echo 错误: 渲染模板过程中出现问题
    pause
    exit /b 1
)

echo 处理完成!
pause 