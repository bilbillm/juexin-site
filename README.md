# 觉心精神分析协会落地页

静态网站，入口为 `dist/index.html`，无需安装依赖。可直接打开入口文件，或用任意静态 HTTP 服务预览 `dist`。

## 内容维护

- 文案、教师与团队、活动、QQ群：`dist/index.html`。
- 配色与响应式布局：`dist/style.css`。
- 问题切换、视差、导航与复制：`dist/app.js`。
- QQ 群号：1046657889。修改时同步更新 HTML 与 JavaScript。
- `dist/assets/qq-group.jpg` 为用户提供的原始图片，未经重绘。
- `dist/assets/hero.webp` 为内置 image_gen 生成的首页空间背景。页面使用 CSS 透视与鼠标视差，不是实时 WebGL 场景。
- `dist/v2.css` 与 `dist/assets/activity.jpg`、`people.jpg`、`impact.jpg` 属于当前视觉增强预览：图像档案、横向拖动、滚动进度线、光影和悬停动效。

## 回滚

当前线上版本没有被这次预览覆盖。原始网站已保存为 [觉心网站-v1-原始回滚备份.zip](../觉心网站-v1-原始回滚备份.zip)。

## 内容依据

《觉心精神分析协会_成立宣讲_9.pptx》及用户补充：社团已正式成立，面向温州医科大学及温州医科大学仁济学院全体学生，教师、团队与活动信息可公开。活动频率保留为首学期规划，未虚构具体时间、地点或报名结果。

旧学习网站 https://juexin.mikansei.cn 来自宣讲材料，检查时未能通过网页读取工具确认其可访问性。该入口跳转到原站，不在本落地页内提供资料搜索或账户功能。

## 原创图片提示词

使用官方内置 image_gen，单次生成，无 CLI/API 回退。原始结果已转换为 WebP 并保存在本项目。

Use case: stylized-concept. Asset type: website hero background art for a Chinese university psychoanalysis society, no UI. Cinematic surreal architectural interior representing inner reflection: dark charcoal museum-like room, a large circular bronze and amber doorway and stone steps descending into shallow reflective black water. Photorealistic high-end architectural 3D render, tactile stone and warm copper, sophisticated quiet editorial mood. Wide landscape 16:9 composition. Main architecture on the right 60 percent, left 40 percent very dark uninterrupted negative space for website text. Low eye-level camera across water, deep spatial perspective. Subtle warm amber light through circular doorway, restrained stone highlights and gentle water reflection. No people, text, letters, logo, watermark or UI screenshot.

## 本地检查

JavaScript 语法检查通过。浏览器验证了问题切换、活动展开、群号复制、手机导航，手机布局无横向溢出，图片正常加载。二维码为原图保留，未实际申请入群。
