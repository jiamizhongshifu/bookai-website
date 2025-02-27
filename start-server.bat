@echo off
echo 正在启动本地服务器...
echo 服务器将在 http://localhost:8000 运行
echo 请在浏览器中访问 http://localhost:8000 查看网站
echo 按 Ctrl+C 可以停止服务器

python -m http.server 8000

pause 