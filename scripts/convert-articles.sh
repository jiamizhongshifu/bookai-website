#!/bin/bash

echo "文章转换工具启动中..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "错误: 未找到Node.js，请先安装Node.js"
    echo "您可以从 https://nodejs.org/zh-cn/download/ 下载安装"
    exit 1
fi

# 检查依赖包是否安装
if [ ! -d "node_modules" ]; then
    echo "正在安装依赖包..."
    npm install
    if [ $? -ne 0 ]; then
        echo "错误: 依赖包安装失败"
        exit 1
    fi
fi

echo "开始转换Markdown文件..."
node scripts/md-to-html.js
if [ $? -ne 0 ]; then
    echo "错误: 转换过程中出现问题"
    exit 1
fi

echo "开始渲染模板..."
node scripts/render-templates.js
if [ $? -ne 0 ]; then
    echo "错误: 渲染模板过程中出现问题"
    exit 1
fi

echo "处理完成!"

# 如果是在终端中直接运行，等待用户按键继续
if [ -t 0 ]; then
    read -p "按任意键继续..." -n1 -s
    echo ""
fi 
fi 