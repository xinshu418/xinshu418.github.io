# 舒欣的个人学术主页

这是一个由 `config.yml` 驱动的静态个人主页，可直接部署到 GitHub Pages。

## 修改网站内容

日常更新只需要编辑 `config.yml`：

- `site`：网站标题、描述和正式网址
- `nav`：导航菜单
- `hero`：姓名、研究方向、头像和顶部按钮
- `about`：个人简介、技术栈和教育背景
- `research`：研究方向卡片
- `publications`：论文列表
- `projects`：项目列表
- `contact`：邮箱、地址和社交主页
- `appearance`：渐变色和强调色
- `show`：控制各板块是否显示

链接留空或填写 `#` 时，对应按钮会自动隐藏。修改完成后提交 `config.yml`，GitHub Pages 会直接使用新内容，无需构建。

## 本地预览

页面通过浏览器读取 `config.yml`。由于浏览器的本地文件安全策略，不能直接双击 `index.html` 预览。

Windows 用户可以直接双击 `preview.bat`，它会启动本地服务器并打开页面。

也可以在项目目录手动运行：

```powershell
python -m http.server 8000
```

然后访问 <http://localhost:8000>。

## 文件结构

```text
index.html   页面结构与样式
app.js       配置加载和页面渲染逻辑
config.yml  网站内容与外观配置
```
