# Linuxdo Mall Cloudflare 版

当前项目是一个部署在 Cloudflare Pages + Workers + D1 上的商城系统，保留 Linux.do OAuth 登录，并把扫雷作为商城内的娱乐活动和优惠券来源。

## 线上地址

- 商城首页：`https://minesweeper-cloud.pages.dev/`
- 扫雷活动：`https://minesweeper-cloud.pages.dev/games/minesweeper/`
- Linux.do 回调地址：`https://minesweeper-cloud.pages.dev/api/auth/linuxdo/callback`

## 已移植模块

- Linux.do OAuth 登录，共用 `ms_session` 登录态。
- 商品展示、搜索、分类、商品详情。
- 下单、优惠码、抽奖折扣、我的订单、订单归档、取消、删除、评价。
- 卡密库、自动交付、人工交付。
- 管理后台：概览、商品、订单、卡密、优惠码、评价、广告、用户、设置、审计日志。
- Cloudflare D1 持久化数据。
- 原项目 `static/` 静态资源路径兼容。
- 扫雷作为商城内的娱乐活动入口，使用同一套登录态和 D1 数据。

## 不能原样运行的原 Flask 功能

Cloudflare Pages 不能直接运行 Python Flask、Celery、Redis、传统邮件客户端直连、附件上传和本地文件备份。因此这些功能已经转为 Worker/D1 版本，或保留为后续扩展点：

- Celery 异步任务：改为同步 Worker API 操作。
- 本地 JSON 文件：改为 D1 表。
- Redis 缓存：当前未使用。
- 邮件通知：当前使用 Resend HTTPS API，通过 Cloudflare Pages Secrets 配置 `RESEND_API_KEY` 和 `RESEND_FROM`。
- 积分站支付：已接入支付跳转、支付回调、继续支付、订单过期和退款状态流。
- 备份下载/恢复：Cloudflare 版建议用 D1 导出或 Wrangler 备份。

## 本地构建

```bash
npm install
npm run build:pages
```

构建产物会输出到 `dist/`，包括：

- 商城 SPA：`index.html`、`mall.css`、`mall.js`
- Worker：`dist/_worker.js`
- 原商城静态资源：`dist/static/`
- 扫雷子站：`dist/games/minesweeper/`

## Cloudflare 部署

```bash
npx wrangler d1 migrations apply minesweeper-cloud --remote
npx wrangler pages deploy dist --project-name minesweeper-cloud
```

如果修改了 Linux.do 应用配置，回调地址必须与 Cloudflare Secret `LINUXDO_CALLBACK_URL` 一致：

```text
https://minesweeper-cloud.pages.dev/api/auth/linuxdo/callback
```

## 超级管理员

当前超级管理员在 `src/worker.js` 中硬编码：

- Linux.do 用户名：`suimi`
- Linux.do ID：`126431`

该用户登录后可进入 `/admin` 后台。
