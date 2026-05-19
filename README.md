# Linuxdo Mall

一个运行在 Cloudflare Pages + Workers + D1 上的商城系统，扫雷作为商城内的娱乐活动保留。

## 功能

- Linux.do 登录与用户同步
- 商品展示、搜索、分类、详情
- 下单、优惠码、订单、评价、售后
- 卡密、自动交付、手动交付
- 管理后台、审计、风控、备份
- 扫雷娱乐活动与首通奖励

## 本地构建

```bash
npm install
npm run build:pages
```

## 部署

```bash
npx wrangler d1 migrations apply minesweeper-cloud --remote
npx wrangler pages deploy dist --project-name minesweeper-cloud
```

## 回调地址

```text
https://minesweeper-cloud.pages.dev/api/auth/linuxdo/callback
```

## 超级管理员

- Linux.do 用户名：`suimi`
- Linux.do ID：`126431`
