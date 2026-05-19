# edgerunneres Portfolio

在线地址：[https://edgerunneres.github.io/MyPage/](https://edgerunneres.github.io/MyPage/)

这是一个适合 GitHub Pages 部署的静态个人主页，用来集中展示项目、研究、竞赛、活动、奖项、论文、组织经历和履历。

## 文件结构

- `index.html`：页面结构和主要语义区块。
- `data.js`：个人介绍、项目、研究、论文、奖项、履历等可替换内容。
- `styles.css`：视觉系统、响应式布局、加载动画、点击涟漪和交互动效。
- `main.js`：内容渲染、滚动状态、筛选、卡片展开、鼠标光晕和 canvas 背景。

## 互动效果怎么做

- 初始加载动画：`index.html` 中的 `#preloader` 作为覆盖层，`styles.css` 控制进场和退场，`main.js` 的 `initPreloader()` 在短暂展示后移除它。
- 背景动态线条：`#ambient-canvas` 使用 Canvas 逐帧绘制，鼠标位置会影响线条的偏移和亮度。
- 鼠标光晕：`#cursor-orb` 读取 pointer 坐标，用 CSS 变量更新位置，形成柔和的跟随光效。
- 点击反馈：`initClickEffects()` 在点击位置生成 `.click-ripple`，动画结束后自动删除节点。
- 卡片 3D 悬停：`.tilt-card` 根据鼠标在卡片内的位置设置 `--tilt-x` 和 `--tilt-y`，CSS 使用 `transform` 渲染轻微透视。
- 项目展开：项目卡片的“展开细节”按钮会切换 `.is-expanded`，把 `data.js` 中的 `details` 列表展开。
- 浮动控制：右侧浮动按钮可以随机高亮页面章节，也可以切换沉浸模式。

## 本地预览

```powershell
python -m http.server 5173
```

然后打开 `http://localhost:5173`。

## 部署

当前仓库已经开启 GitHub Pages，发布源是 `main` 分支根目录。推送到 `main` 后，GitHub Pages 会更新在线页面。
