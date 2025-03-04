import json
import markdown
import yaml
from datetime import datetime
import os

class ArticleGenerator:
    def __init__(self, template_path):
        with open(template_path, 'r', encoding='utf-8') as f:
            self.template = f.read()
    
    def generate_from_json(self, json_path, output_path):
        # 读取JSON文章数据
        with open(json_path, 'r', encoding='utf-8') as f:
            article_data = json.load(f)
        
        # 生成HTML内容
        html_content = self._generate_article_html(article_data)
        
        # 将内容插入模板
        final_html = self._replace_template_variables(article_data, html_content)
        
        # 保存生成的HTML文件
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(final_html)
    
    def generate_from_markdown(self, md_path, output_path):
        # 读取Markdown文件
        with open(md_path, 'r', encoding='utf-8') as f:
            md_content = f.read()
        
        # 解析Markdown frontmatter
        metadata, content = self._parse_frontmatter(md_content)
        
        # 转换Markdown为HTML
        html_content = markdown.markdown(
            content,
            extensions=['extra', 'codehilite', 'meta', 'toc']
        )
        
        # 组合文章数据
        article_data = {
            **metadata,
            'content': html_content
        }
        
        # 生成最终HTML
        final_html = self._replace_template_variables(article_data, html_content)
        
        # 保存生成的HTML文件
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(final_html)
    
    def _parse_frontmatter(self, md_content):
        # 解析Markdown文件的frontmatter
        if md_content.startswith('---'):
            # 分割frontmatter和正文
            _, fm, content = md_content.split('---', 2)
            # 解析YAML格式的frontmatter
            metadata = yaml.safe_load(fm)
            return metadata, content.strip()
        return {}, md_content
    
    def _generate_article_html(self, article_data):
        # 生成文章主体HTML
        html = []
        
        # 生成文章简介
        if 'intro' in article_data:
            html.append(f'<div class="article-intro"><p>{article_data["intro"]}</p></div>')
        
        # 生成文章主体内容
        html.append('<div class="article-content">')
        
        # 处理文章章节
        if 'sections' in article_data:
            for i, section in enumerate(article_data['sections'], 1):
                html.append(self._generate_section_html(section, i))
        
        html.append('</div>')
        
        return '\n'.join(html)
    
    def _generate_section_html(self, section, index):
        # 生成章节HTML
        html = []
        
        # 章节标题
        html.append(f'<section id="section{index}" class="article-section">')
        html.append(f'<h2>{section["title"]}</h2>')
        
        # 章节内容
        if 'content' in section:
            html.append(f'<p>{section["content"]}</p>')
        
        # 处理子章节
        if 'subsections' in section:
            for i, subsection in enumerate(section['subsections'], 1):
                html.append(f'<h3 id="section{index}-{i}">{subsection["title"]}</h3>')
                html.append(f'<p>{subsection["content"]}</p>')
        
        html.append('</section>')
        
        return '\n'.join(html)
    
    def _replace_template_variables(self, article_data, content_html):
        # 替换模板中的变量
        html = self.template
        
        # 替换基本信息
        replacements = {
            '{{title}}': article_data.get('title', ''),
            '{{description}}': article_data.get('description', ''),
            '{{keywords}}': ', '.join(article_data.get('keywords', [])),
            '{{author}}': article_data.get('author', ''),
            '{{date}}': article_data.get('date', datetime.now().strftime('%Y-%m-%d')),
            '{{category}}': article_data.get('category', ''),
            '{{readTime}}': article_data.get('readTime', ''),
            '<!-- ARTICLE_CONTENT -->': content_html
        }
        
        for key, value in replacements.items():
            html = html.replace(key, str(value))
        
        return html

# 使用示例
if __name__ == '__main__':
    generator = ArticleGenerator('templates/article-template.html')
    
    # 从JSON生成文章
    generator.generate_from_json(
        'articles/my-article.json',
        'output/my-article.html'
    )
    
    # 从Markdown生成文章
    generator.generate_from_markdown(
        'articles/my-article.md',
        'output/my-article.html'
    ) 