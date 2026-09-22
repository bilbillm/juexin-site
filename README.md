# 觉心精神分析协会落地页

静态站点，入口 `dist/index.html`，无构建步骤、无依赖。可直接打开入口文件，或用任意静态 HTTP 服务预览 `dist`：

```powershell
python -m http.server 8080 --directory dist
```

## 文件职责

| 路径 | 负责 |
|---|---|
| `dist/index.html` | 页面结构、全部可见文案、无障碍标签 |
| `dist/v3.css` | 视觉：墨黑 × 烛光琥珀 × 旧纸米白，衬线、颗粒、竖排、响应式 |
| `dist/app.js` | 交互：移动端导航、动效开关、入门问答切换、复制群号、滚动进度、意象图拖动、入场动效 |
| `dist/assets/` | favicon、QQ 群二维码原图、四张意象图 |
| `文案基线.md` | 语气规则、事实出处、待确认项 |

## 改文案时容易漏的地方

- **群号出现在四处**：`.copy-row` 文本、二维码 `alt`、`app.js` 的复制调用与成功/失败提示。改一处要同步其余三处。
- **入门问答的主体在 JS 里**：三组「标题／正文／脚注」写在 `app.js` 的 `questions` 数组；`index.html` 的首屏对应第一组，两处必须一致。
- **导航与分节标题成对**：导航的 `定位 / 意象 / 活动 / 同行` 要和 `index.html` 里 `.section-label` 的中文半段一致。
- **断行是设计的一部分**：`<br>` 出现在 hero 标题与段落、各 `h2`、`.join-copy`；改字后要确认断行仍然成立。
- **长度上限（实测，超出会挤行或撑破卡片）**：`.hero-copy` 每行 ≤ 约 30 字；`.archive-card figcaption strong` ≤ 约 18 字；`.question-tabs button` ≤ 约 9 字；`#question-title` 每行 ≤ 约 9 字（390px 视口下）；`.library-index a span` ≤ 约 14 字；`footer small` ≤ 约 22 字。

## 文案与事实的边界

具体数字与人物信息全部来自《觉心精神分析协会_成立宣讲_9.pptx》（逐页图片见 `_source/slide1-9.png`），逐条对应关系见 `文案基线.md`。页面不写具体日期、地点与报名方式。

- 指导教师张燎、发起人沈洲杰、21 人参与前期筹备、5 节主持讨论、14 学时实训：宣讲第 4、7 页。
- 183 条词典条目、线上学习空间 juexin.mikansei.cn：宣讲第 5 页。
- 活动频率（研讨班每月一次、读书会每月一次、专题讲座每学期 1–2 次）：宣讲第 6 页，页面明确标注为首学期规划。
- `dist/assets/v3/` 四张图是意象图，不是活动照片；页面已按「意象」标注，未把意象当成现场记录。
- `dist/assets/qq-group.jpg` 为用户提供的原始群聊截图，保留在项目中作留档。
- `dist/assets/qr-source.png` 为从用户截图中裁切出的原始二维码，作为下载与备用扫码版本。
- `dist/assets/qr-style.png` 为 image_gen 生成的风格对齐二维码视觉版，网页展示使用它，保持与 v3 暗色铜金视觉一致。

线上学习空间 https://juexin.mikansei.cn 已确认可访问（2026-09 用户核实），页面直接指向该站，不保留兜底提示。

入群二维码有两份：网页展示 `qr-style.png`，下载链接给 `qr-source.png`。两份都能解出同一个地址 `https://qm.qq.com/q/ef1AV5l65G`（2026-09-22 用 zbar 验证）。注意它们是**反色二维码**（浅色点阵置于深色底、无静默区），标准解码器需要先反色；换图或重新生成后必须重跑一次解码验证，见「本地检查」。

## 回滚

版本历史只在 git 里。2026-09-22 按「只保留最新版本」清理掉了全部本地备份目录与 zip，此前各版本已逐文件核对过，全部可从提交取回。

| 版本 | 提交 |
|---|---|
| v1 初版 | `68e345b` |
| v2 视觉增强预览 | `5845e76` |
| v3「书斋」视觉改版 | `2a559f8` |
| 全站文案重构 | `06aeb32` |
| 页脚品牌裁切修复 | `84c7073` |
| 二维码改用风格版 | `44bd7e7` |
| 线上学习空间确认可访问 | `bb8548f` |

当前版本即仓库最新提交。取回旧版本：

```bash
git show 2a559f8:dist/index.html > 旧版-index.html          # 单文件
git archive 2a559f8 dist | tar -x -C ../某目录              # 整个 dist
```

私有仓库：https://github.com/bilbillm/juexin-site。`.gitignore` 仍挡着 `dist-backup-*`、`verify-shots*`，以后若再生成本地副本也不会进提交。

## 部署

`_source/publish_static.py` 把 `dist`、`.openai/hosting.json`、`.gitignore`、`README.md` 推送到托管仓库（凭据从 stdin 读入，不落盘）。`文案基线.md`、本机校验脚本与校验截图都不参与部署。

## 本地检查

校验脚本在 `_source/`：`verify_site.cjs`（交互、溢出、分区截图）、`check_assets.cjs`（图片与样式表）、`check_footer.cjs`（页脚与各宽度文本行数）、`check_layout.cjs`（新旧版本布局对比）、`extract_pptx_text.py`（宣讲文案抽取）。脚本用本机已安装的 Playwright，需先起一个静态服务：

```powershell
python -m http.server 8130 --directory juexin-site/dist
node _source/verify_site.cjs http://127.0.0.1:8130/index.html _source/verify-shots-final
```

最近一次结果（文案重构 + 页脚修复后）：

| 检查 | 结果 |
|---|---|
| 交互与溢出 | 无 JS 报错；1440px 与 390px 下 `scrollWidth == clientWidth`；问答切换、复制群号、折叠面板、移动端菜单均正常 |
| 图片与样式 | 5 张图片全部加载（`naturalWidth > 0`）；`v3.css` 173 条规则生效 |
| 页脚与行数 | 1440 / 1000 / 861 / 640 / 390px 下品牌区单行不裁切，各文本块无溢出 |

注：Google Fonts 在本机网络下请求被重置（`ERR_CONNECTION_RESET`），页面按 `v3.css` 中的衬线回退字体渲染，与改版前一致。
