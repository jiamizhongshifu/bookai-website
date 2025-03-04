# 文章修复脚本
$articles = @(
    "chatgpt-ecommerce-guide",
    "chatgpt-education-guide",
    "chatgpt-money-making-guide",
    "chatgpt-plus-review",
    "chatgpt-python-tutorial",
    "chatgpt-registration-guide",
    "chatgpt-store-guide",
    "chatgpt-writing-guide",
    "cursor-local-model-guide",
    "cursor-team-guide",
    "cursor-ultimate-guide",
    "deepseek-guide"
)

foreach ($article in $articles) {
    $originalFile = "articles/$article.html"
    $backupFile = "articles/$article.bak.html"
    
    # 创建备份
    if (Test-Path $originalFile) {
        Copy-Item $originalFile $backupFile
        Write-Host "Created backup for $article"
        
        # 复制模板
        Copy-Item "articles/article-template.html" $originalFile
        Write-Host "Applied template to $article"
    } else {
        Write-Host "File $article.html not found"
    }
}

Write-Host "Done! Please check the backup files and new template-based files." 