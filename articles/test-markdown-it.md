# Markdown-it测试文档

> 摘要：这是一个用于测试markdown-it配置的文档，包含了代码高亮、图片懒加载、自动锚点和目录生成等功能。

**目录**
- [Markdown-it](#markdown-it)
- [代码高亮](#代码高亮)
- [图片懒加载](#图片懒加载)
- [自动锚点](#自动锚点)
- [嵌套目录](#嵌套目录)

## Markdown-it简介

Markdown-it是一个功能强大的Markdown解析器，它可以将Markdown文本转换为HTML。它具有以下特点：

1. 100% CommonMark兼容
2. 可扩展的语法
3. 高速解析
4. 安全性高
5. 社区活跃

## 代码高亮

Markdown-it可以通过插件实现代码高亮功能。以下是一些代码示例：

### JavaScript代码

```javascript
function hello() {
  console.log("Hello, world!");
  return {
    name: "Markdown-it",
    version: "13.0.1"
  };
}

// ES6箭头函数
const add = (a, b) => a + b;

// 类定义
class Person {
  constructor(name) {
    this.name = name;
  }
  
  sayHello() {
    console.log(`Hello, my name is ${this.name}`);
  }
}
```

### Python代码

```python
def fibonacci(n):
    """返回斐波那契数列的第n个数"""
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibonacci(n-1) + fibonacci(n-2)

# 类定义
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        pass

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"
```

### CSS代码

```css
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## 图片懒加载

以下图片将使用懒加载功能，只有当用户滚动到图片位置时才会加载：

![Markdown Logo](https://markdown-it.github.io/markdown-it/logo.png)

![示例图片](https://via.placeholder.com/800x400?text=Example+Image)

## 自动锚点

本文档中的所有标题都会自动添加锚点，可以通过点击标题前的#符号跳转到对应位置。

## 嵌套目录

### 三级标题1

这是三级标题1的内容。

#### 四级标题1.1

这是四级标题1.1的内容。

#### 四级标题1.2

这是四级标题1.2的内容。

### 三级标题2

这是三级标题2的内容。

#### 四级标题2.1

这是四级标题2.1的内容。

##### 五级标题2.1.1

这是五级标题2.1.1的内容。

## 表格支持

| 功能 | 描述 | 是否支持 |
|------|------|----------|
| 代码高亮 | 使用highlight.js实现代码高亮 | ✅ |
| 图片懒加载 | 添加loading="lazy"属性 | ✅ |
| 自动锚点 | 为标题添加锚点链接 | ✅ |
| 目录生成 | 自动生成嵌套目录结构 | ✅ |

## 引用和注释

> 这是一段引用文本。
> 
> 引用可以包含多个段落。

> 这是一段带有引用来源的引用。
> — Albert Einstein

## 总结

通过本文档，我们展示了markdown-it的各种功能，包括：

- 代码高亮
- 图片懒加载
- 自动锚点
- 嵌套目录生成
- 表格支持
- 引用和注释

这些功能使得我们的Markdown文档更加丰富和易于阅读。 