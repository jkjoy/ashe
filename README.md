# Ashe for Jekyll

这个项目把 `/Users/sun/Downloads/ashe` 的 WordPress 版 `Ashe` 样式迁移到了 Jekyll，目标是尽量保留原有页面结构、样式层和交互表现，不主动改视觉风格。

## 主要配置文件

- `_data/ashe.yml`
  主题主设置文件，包含皮肤、颜色、导航、轮播、特色链接、页脚、响应式开关等可实现选项。
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
- Featured Slider / Featured Links
- 首页博客列表与分页
- 单篇文章布局、作者简介、相关文章、上一篇/下一篇导航
- 抽屉侧栏、左右侧栏、页脚小组件
- 原主题静态资源：`style.css`、`responsive.css`、`fontawesome`、`fontello`、`slick`、`perfect-scrollbar`、原始 JS
- `default / dark / box` 三种主题皮肤

## 没有做成设置项的部分

以下功能依赖 WordPress 后端、插件系统或动态数据库能力，因此没有保留为可配置项：

- WordPress 原生评论系统
- WooCommerce 相关功能
- WordPress Widget 后台拖拽管理
- Customizer repeater 的后台编辑界面
- Elementor / Beaver Builder / Gutenberg 后台联动能力
- 无限滚动、后台预览专用逻辑

这些能力如果后续需要，可以在 Jekyll 上另行接入第三方服务或客户端脚本，但当前迁移不为它们预留空设置。

## 本地运行

```bash
bundle install
bundle exec jekyll serve
```

