# 批量更新文章作者脚本
# 
# 功能：
# 1. 遍历所有Markdown文件
# 2. 更新文章内容中的作者信息为"加密钟师傅"

# 配置
$articlesDir = Join-Path $PSScriptRoot "..\articles"
$newAuthor = "加密钟师傅"

# 统计数据
$totalFiles = 0
$updatedFiles = 0
$errors = @()

Write-Host "开始批量更新文章作者信息..." -ForegroundColor Blue

# 查找所有Markdown文件
Write-Host "查找Markdown文件..." -ForegroundColor Blue
$markdownFiles = Get-ChildItem -Path $articlesDir -Filter "*.md" -Recurse
$totalFiles = $markdownFiles.Count

Write-Host "找到 $totalFiles 个Markdown文件" -ForegroundColor Blue

if ($totalFiles -eq 0) {
    Write-Host "没有找到Markdown文件，程序退出" -ForegroundColor Yellow
    exit
}

# 更新所有文件
Write-Host "更新文件作者信息..." -ForegroundColor Blue
foreach ($file in $markdownFiles) {
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        $updated = $false
        
        # 更新作者信息
        # 匹配模式1: 作者: xxx 或 作者：xxx
        if ($content -match "作者[:：]\s*(.+)") {
            $oldAuthor = $matches[1].Trim()
            if ($oldAuthor -ne $newAuthor) {
                $content = $content -replace "作者[:：]\s*(.+)", "作者: $newAuthor"
                $updated = $true
            }
        }
        
        # 匹配模式2: author: xxx (在Front Matter中)
        if ($content -match "author:\s*(.+)") {
            $oldAuthor = $matches[1].Trim()
            if ($oldAuthor -ne $newAuthor) {
                $content = $content -replace "author:\s*(.+)", "author: $newAuthor"
                $updated = $true
            }
        }
        
        if ($updated) {
            # 写回文件
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Host "✓ 已更新: $($file.FullName)" -ForegroundColor Green
            $updatedFiles++
        } else {
            Write-Host "- 无需更新: $($file.FullName)" -ForegroundColor Blue
        }
    } catch {
        $errorMessage = "更新文件 $($file.FullName) 失败: $_"
        $errors += $errorMessage
        Write-Host "✗ 更新文件失败: $($file.FullName)" -ForegroundColor Red
        Write-Host $_ -ForegroundColor Red
    }
}

# 输出报告
Write-Host "`n=== 更新报告 ===" -ForegroundColor Blue
Write-Host "总文件数: $totalFiles" -ForegroundColor Blue
Write-Host "更新文件数: $updatedFiles" -ForegroundColor Blue

if ($errors.Count -gt 0) {
    Write-Host "错误数: $($errors.Count)" -ForegroundColor Red
    for ($i = 0; $i -lt $errors.Count; $i++) {
        Write-Host "  $($i + 1). $($errors[$i])" -ForegroundColor Red
    }
} else {
    Write-Host "错误数: 0" -ForegroundColor Green
}

Write-Host "================" -ForegroundColor Blue 