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
npx wrangler d1 migrations apply <d1-database-name> --remote
npx wrangler pages deploy dist --project-name <cloudflare-project-name>
```

## 回调地址

```text
https://<your-domain>/api/auth/linuxdo/callback
```

## 必要配置

生产环境请通过 Cloudflare Secrets 或环境变量配置，不要把真实值写入代码或 README。

```bash
npx wrangler pages secret put MALL_SUPER_ADMIN_USERNAME --project-name <cloudflare-project-name>
npx wrangler pages secret put MALL_SUPER_ADMIN_LINUXDO_ID --project-name <cloudflare-project-name>
npx wrangler pages secret put LINUXDO_CLIENT_ID --project-name <cloudflare-project-name>
npx wrangler pages secret put LINUXDO_CLIENT_SECRET --project-name <cloudflare-project-name>
npx wrangler pages secret put LINUXDO_CALLBACK_URL --project-name <cloudflare-project-name>
```

可选配置按启用的功能填写：

- `CREDIT_EPAY_PID` / `CREDIT_EPAY_KEY`
- `RESEND_API_KEY` / `RESEND_FROM`
- `PUSHME_ADMIN_KEY` / `PUSHME_USER_KEY`
