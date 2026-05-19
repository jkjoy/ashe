# Ashe Jekyll 中文版

这个项目把 `/Users/sun/Downloads/ashe` 的 WordPress 版 `Ashe` 样式迁移到了 Jekyll，目标是尽量保留原有页面结构、样式层和交互表现，不主动改视觉风格。

## 主要配置文件

- `_data/ashe.yml`
  主题主设置文件，包含皮肤、颜色、导航、轮播、评论系统、特色链接、页脚、响应式开关等可实现选项。
- `_data/navigation.yml`
  顶部菜单、主菜单、页脚菜单。
- `_data/widgets.yml`
  左侧栏、右侧栏、抽屉侧栏、页脚小组件。
- `_data/authors.yml`
  作者信息。
- `_config.yml`
  Jekyll 本身的站点配置和分页设置。

## 已迁移的内容

- 页头、顶部栏、主导航、移动菜单
- 精选轮播与精选链接
- 首页博客列表与分页
- 单篇文章布局、作者简介、相关文章、上一篇/下一篇导航
- Twikoo / Gitalk / Artalk 评论系统开关
- 抽屉侧栏、左右侧栏、页脚小组件
- 原主题静态资源：`style.css`、`responsive.css`、`fontawesome`、`fontello`、`slick`、`perfect-scrollbar`、原始 JavaScript
- `default / dark / box` 三种主题皮肤

## 没有做成设置项的部分

以下功能依赖 WordPress 后端、插件系统或动态数据库能力，因此没有保留为可配置项：

- WordPress 原生评论系统
- 电商插件和动态商店相关功能
- WordPress 小组件后台拖拽管理
- Customizer 重复项的后台编辑界面
- Elementor、Beaver Builder、Gutenberg 的后台联动能力
- 无限滚动、后台预览专用逻辑

这些能力如果后续需要，可以在 Jekyll 上另行接入第三方服务或客户端脚本，但当前迁移不为它们预留空设置。

## 评论系统

在 `_data/ashe.yml` 的 `comments` 中开启评论：

- `enabled: true` 开启全局评论。
- `provider` 可选 `twikoo`、`gitalk`、`artalk` 或 `external`。
- 按所选服务填写对应配置块，例如 Twikoo 的 `env_id`、Gitalk 的 OAuth 与仓库信息、Artalk 的 `server` 和 `site`。
- 单篇文章可用 `comments: false` 关闭评论，用 `comments: true` 在全局关闭时单独启用，用 `comments_provider` 或 `comment_key` 覆盖默认评论系统和文章唯一键。

## 社交链接

在 `_data/ashe.yml` 的 `social_media.items` 里填写链接即可显示图标。已补充微信、微博、Mastodon、QQ、Telegram 等常见平台，`title` 用作提示文本，`rel` 可用于像 Mastodon 这样的 `me` 关系声明。

顶部栏不会默认显示社交图标；如确实需要，可把 `_data/ashe.yml` 中的 `top_bar.show_socials` 改为 `true`。

## 相册

- 相册首页：`/album/`。
- 每个相册是 `_albums` 目录下的一个 Markdown 文件，默认访问路径为 `/album/文件名/`。
- 可以直接在正文里写 Markdown 图片：`![说明](图片地址)`，相册详情页会自动解析为灯箱图集。
- 也可以在 front matter 中填写 `images` 列表；未单独设置 `cover` 时，相册首页会自动使用第一张图作为封面。
- 每张图可写成字符串，也可写成对象：`src` 原图，`thumb` 缩略图，`title` 灯箱标题，`alt` 替代文本，`avif` / `webp` 可选。
- 相册详情页会加载 `_data/ashe.yml` 中 `albums.lightbox_css` 和 `albums.lightbox_js` 配置的 Lightbox2 资源。

示例：

```yaml
---
title: 2021.09.20
date: 2021-09-20
description: 这个相册主题的说明。
---

这里可以写相册说明。

![第一张照片](https://example.com/photo-1.jpg)
![第二张照片](/assets/images/image_1.jpg)
```

如果需要单独配置缩略图或 avif/webp，可使用 `images`：

```yaml
---
title: 2021.09.20
date: 2021-09-20
images:
  - src: https://example.com/photo-1.jpg
    thumb: https://example.com/photo-1.jpg?imageMogr2/thumbnail/x400
    avif: https://example.com/photo-1.jpg?imageMogr2/thumbnail/x400/format/avif
    webp: https://example.com/photo-1.jpg?imageMogr2/thumbnail/x400/format/webp
    title: 第一张照片
  - src: /assets/images/image_1.jpg
    title: 本地图片
---
```

## 正文图片

- 文章页和普通页面正文中，连续出现 2 张及以上纯图片时，会自动转成相册式网格并支持 Lightbox 预览。
- 配置位置：`_data/ashe.yml` 的 `content_images.auto_gallery`。
- 关闭自动相册：把 `content_images.auto_gallery.enabled` 改成 `false`。
- 调整触发数量：修改 `content_images.auto_gallery.min_images`，默认是 `2`。
- 不想让某一组图片自动转换时，可给外层元素加 `class="no-auto-gallery"` 或 `data-no-gallery`。

## 常用开关

- 订阅地址：`/feed.xml`，页面 `<head>` 已输出 RSS 发现链接，社交图标里也已加入 RSS。
- 网站地图：`/sitemap.xml`，`robots.txt` 会自动声明该地址。
- 发布前请把 `_config.yml` 的 `url` 改成真实域名，RSS 和网站地图都会用它生成绝对地址。
- 首页/列表作者：`blog_page.show_author`。
- 首页/列表相关文章：`blog_page.show_related_posts`，排序由 `blog_page.related_orderby` 控制。
- 文章页上一篇/下一篇导航：`single_page.show_navigation`。
- 文章页上一篇/下一篇导航样式：`single_page.navigation_style`，可选 `original`（原样侧边预览）、`compact`（缩小侧边预览）、`text`（底部文字导航）。
- 文章页相关文章：`single_page.show_related_posts`，排序由 `single_page.related_orderby` 控制。

## 本地运行

```bash
bundle install
bundle exec jekyll serve
```

