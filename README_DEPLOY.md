# 路过山海部署说明

这是一个纯静态手机端 Web App 原型，可以直接部署到 Cloudflare Pages、Vercel、Netlify 或 GitHub Pages。

## 推荐方式：Cloudflare Pages

1. 打开 Cloudflare Pages。
2. 选择上传静态资源或连接 Git 仓库。
3. 将本文件夹 `luguo-shanhai` 内的所有文件作为站点根目录上传。
4. 构建命令留空。
5. 输出目录填写 `/` 或留空。
6. 部署完成后会得到类似 `https://luguo-shanhai.pages.dev` 的公开链接。

## Netlify 拖拽部署

1. 打开 Netlify。
2. 进入 Sites。
3. 将 `luguo-shanhai-deploy.zip` 上传或把本文件夹拖进去。
4. 等待部署完成，获取公开链接。

## 目录内容

- `index.html`：页面结构
- `styles.css`：移动端视觉样式
- `app.js`：底部导航、打卡、换文案等交互
- `assets/hero-mountain-sea.png`：首屏山海图
- `assets/icon.svg`：站点图标
- `manifest.webmanifest`：PWA 配置
- `preview.png`：分享预览图

## 之后绑定域名

先使用免费链接即可。未来买域名后，在部署平台添加自定义域名，再按提示修改 DNS 解析。
