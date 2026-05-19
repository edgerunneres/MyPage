# edgerunneres Portfolio

一个适合 GitHub Pages 部署的静态个人主页，用来集中展示项目、研究、竞赛、活动、奖项、论文、组织经历和履历。

## 修改内容

- 主要内容都在 `data.js`。
- 视觉样式在 `styles.css`。
- 页面结构在 `index.html`。
- 动效、筛选、滚动状态和内容渲染在 `main.js`。

## 本地预览

```powershell
python -m http.server 5173
```

然后打开 `http://localhost:5173`。

## 部署到 GitHub Pages

1. 把这些文件放到 `edgerunneres.github.io` 仓库根目录，或者放到任意仓库后开启 Pages。
2. GitHub 仓库进入 `Settings -> Pages`。
3. Source 选择 `Deploy from a branch`，分支选择 `main`，目录选择 `/root`。
4. 保存后等待 GitHub Pages 构建完成。
