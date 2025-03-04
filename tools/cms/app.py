from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
import json
from article_generator import ArticleGenerator

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cms.db'
app.config['UPLOAD_FOLDER'] = 'static/uploads'

db = SQLAlchemy(app)

# 文章模型
class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    keywords = db.Column(db.String(200))
    author = db.Column(db.String(100))
    category = db.Column(db.String(50))
    content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    status = db.Column(db.String(20), default='draft')  # draft, published

# 路由
@app.route('/')
def index():
    articles = Article.query.filter_by(status='published').order_by(Article.created_at.desc()).all()
    return render_template('admin/index.html', articles=articles)

@app.route('/admin')
def admin():
    articles = Article.query.order_by(Article.created_at.desc()).all()
    return render_template('admin/dashboard.html', articles=articles)

@app.route('/admin/article/new', methods=['GET', 'POST'])
def new_article():
    if request.method == 'POST':
        article = Article(
            title=request.form['title'],
            description=request.form['description'],
            keywords=request.form['keywords'],
            author=request.form['author'],
            category=request.form['category'],
            content=request.form['content'],
            status=request.form['status']
        )
        db.session.add(article)
        db.session.commit()
        
        # 如果状态是published，生成HTML文件
        if article.status == 'published':
            generate_article_html(article)
            
        flash('文章创建成功！')
        return redirect(url_for('admin'))
        
    return render_template('admin/article_form.html')

@app.route('/admin/article/<int:id>/edit', methods=['GET', 'POST'])
def edit_article(id):
    article = Article.query.get_or_404(id)
    
    if request.method == 'POST':
        article.title = request.form['title']
        article.description = request.form['description']
        article.keywords = request.form['keywords']
        article.author = request.form['author']
        article.category = request.form['category']
        article.content = request.form['content']
        article.status = request.form['status']
        
        db.session.commit()
        
        # 如果状态是published，重新生成HTML文件
        if article.status == 'published':
            generate_article_html(article)
            
        flash('文章更新成功！')
        return redirect(url_for('admin'))
        
    return render_template('admin/article_form.html', article=article)

@app.route('/admin/article/<int:id>/delete', methods=['POST'])
def delete_article(id):
    article = Article.query.get_or_404(id)
    db.session.delete(article)
    db.session.commit()
    
    # 删除已生成的HTML文件
    html_path = f'articles/{article.id}.html'
    if os.path.exists(html_path):
        os.remove(html_path)
        
    flash('文章删除成功！')
    return redirect(url_for('admin'))

def generate_article_html(article):
    # 准备文章数据
    article_data = {
        'title': article.title,
        'description': article.description,
        'keywords': article.keywords.split(','),
        'author': article.author,
        'date': article.created_at.strftime('%Y-%m-%d'),
        'category': article.category,
        'content': article.content
    }
    
    # 使用ArticleGenerator生成HTML
    generator = ArticleGenerator('templates/article-template.html')
    output_path = f'articles/{article.id}.html'
    
    # 将文章数据保存为临时JSON文件
    temp_json = f'temp_{article.id}.json'
    with open(temp_json, 'w', encoding='utf-8') as f:
        json.dump(article_data, f, ensure_ascii=False)
    
    # 生成HTML文件
    generator.generate_from_json(temp_json, output_path)
    
    # 删除临时JSON文件
    os.remove(temp_json)

if __name__ == '__main__':
    # 确保数据库和上传目录存在
    if not os.path.exists('cms.db'):
        with app.app_context():
            db.create_all()
    
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
        
    app.run(debug=True) 