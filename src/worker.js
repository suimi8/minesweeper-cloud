const SESSION_COOKIE = "ms_session";
const OAUTH_STATE_COOKIE = "ms_oauth_state";
const OAUTH_RETURN_COOKIE = "ms_oauth_return";
const CSRF_HEADER = "X-CSRF-Token";
const SESSION_DAYS = 30;
const PASSWORD_ITERATIONS = 100000;
const MAX_SYNC_BYTES = 240000;
const MAX_PROXY_IMAGE_BYTES = 1536 * 1024;
const ADMIN_MAX_LIST_LIMIT = 5000;
const D1_ID_CHUNK_SIZE = 80;
const LINUXDO_PROVIDER = "linuxdo";
const LINUXDO_CONNECT_BASE = "https://connect.linux.do";
const SUPER_ADMIN_USERNAME = "suimi";
const SUPER_ADMIN_LINUXDO_ID = "126431";
const DEFAULT_BASE_PATH = "/";
const PUSHME_GROUP = "Linuxdo-Mall";
const MALL_PENDING_ORDER_TTL_MS = 5 * 60 * 1000;
const MINESWEEPER_COUPON_CAMPAIGN_KEY = "minesweeper-20260518";
const MINESWEEPER_COUPON_CAMPAIGN_START_MS = Date.UTC(2026, 4, 17, 16, 0, 0);
const MINESWEEPER_COUPON_CAMPAIGN_END_MS = Date.UTC(2026, 4, 24, 16, 0, 0);
const MINESWEEPER_COUPON_VALID_DAYS = 30;
const MINESWEEPER_LEVEL_LABELS = {
  beginner: "初级",
  intermediate: "中级",
  expert: "高级"
};
const MINESWEEPER_LEVEL_PERCENT_COUPONS = {
  beginner: 5,
  intermediate: 7,
  expert: 10
};
const MINESWEEPER_LEVEL_FIRST_FIXED_COUPONS = {
  beginner: 10,
  intermediate: 20,
  expert: 30
};
const MINESWEEPER_CAMPAIGN_LEGACY_SOURCE_SQL = "(source_key = 'first-clear-percent' OR source_key LIKE 'top-%-fixed')";
const MINESWEEPER_CAMPAIGN_GENERATED_SOURCE_SQL = "(source_key = 'first-clear-percent' OR source_key LIKE 'top-%-fixed' OR source_key LIKE 'first-clear-%-percent' OR source_key LIKE 'first-%-fixed')";
const SQL_BACKUP_TABLES = [
  "users",
  "oauth_accounts",
  "sessions",
  "game_sync",
  "leaderboard_scores",
  "mall_products",
  "mall_orders",
  "mall_cards",
  "mall_coupons",
  "mall_user_coupons",
  "mall_ratings",
  "mall_ads",
  "mall_feedback",
  "mall_feedback_logs",
  "mall_ldc_ledger",
  "mall_settings",
  "mall_blacklist",
  "mall_email_templates",
  "mall_login_attempts",
  "mall_lottery_draws",
  "mall_conversations",
  "mall_messages",
  "mall_refunds",
  "mall_admin_audit_logs",
  "mall_rate_limits"
];
const SQL_BACKUP_DEFAULT_EXCLUDED_TABLES = new Set(["sessions"]);
const SQL_BACKUP_SCOPE_GROUPS = {
  users: ["users", "oauth_accounts"],
  games: ["game_sync", "leaderboard_scores"],
  mall: [
    "mall_settings",
    "mall_products",
    "mall_orders",
    "mall_cards",
    "mall_coupons",
    "mall_user_coupons",
    "mall_ratings",
    "mall_ads",
    "mall_feedback",
    "mall_feedback_logs",
    "mall_ldc_ledger",
    "mall_email_templates",
    "mall_refunds"
  ],
  security: ["mall_blacklist", "mall_login_attempts", "mall_admin_audit_logs", "mall_rate_limits"],
  chat: ["mall_conversations", "mall_messages"],
  lottery: ["mall_lottery_draws"]
};
const BACKUP_SCOPE_KEYS = ["all", ...Object.keys(SQL_BACKUP_SCOPE_GROUPS)];
const BACKUP_FREQUENCIES = ["manual", "hourly", "daily", "weekly", "monthly"];
const LOTTERY_SCOPES = ["product_daily", "global_daily", "product_cooldown", "global_cooldown"];
const PRODUCT_DELIVERY_MODES = ["auto", "manual", "fixed_link"];
const KNOWN_NETDISK_PROVIDERS = [
  { key: "baidu", label: "百度网盘", hostMatch: (host) => host === "pan.baidu.com" || host.endsWith(".baidu.com") },
  { key: "alipan", label: "阿里云盘", hostMatch: (host) => host === "www.alipan.com" || host.endsWith(".alipan.com") || host === "www.aliyundrive.com" || host.endsWith(".aliyundrive.com") },
  { key: "quark", label: "夸克网盘", hostMatch: (host) => host === "pan.quark.cn" || host.endsWith(".quark.cn") },
  { key: "tianyi", label: "天翼云盘", hostMatch: (host) => host === "cloud.189.cn" || host.endsWith(".189.cn") },
  { key: "115", label: "115网盘", hostMatch: (host) => host === "115.com" || host.endsWith(".115.com") },
  { key: "xunlei", label: "迅雷网盘", hostMatch: (host) => host === "pan.xunlei.com" || host.endsWith(".xunlei.com") },
  { key: "uc", label: "UC网盘", hostMatch: (host) => host === "drive.uc.cn" || host.endsWith(".uc.cn") },
  { key: "caiyun", label: "彩云网盘", hostMatch: (host) => host === "caiyun.139.com" || host.endsWith(".caiyun.139.com") }
];
const EMAIL_TEMPLATE_EVENT_TYPES = ["order_created", "order_delivered"];
const ORDER_EMAIL_EVENT_TYPE_MAP = {
  created: "order_created",
  delivered: "order_delivered"
};
const DEFAULT_BACKUP_SCOPE = ["all"];
const DEFAULT_RATE_LIMITS = {
  orderCreate: { enabled: true, limit: 20, windowSeconds: 10 * 60 },
  feedbackCreate: { enabled: true, limit: 8, windowSeconds: 60 * 60 },
  bingImageResolve: { enabled: true, limit: 20, windowSeconds: 60 * 60 },
  adminImageProxy: { enabled: true, limit: 60, windowSeconds: 10 * 60 }
};
const DEFAULT_MALL_LIMITS = {
  userTestEmailCooldownHours: 24,
  orderChatDays: 7,
  generalChatFirstMessages: 1,
  generalChatMaxChars: 100,
  generalChatMaxImages: 1,
  chatMaxChars: 2000,
  chatMaxImages: 3,
  feedbackTitleMinChars: 4,
  feedbackContentMinChars: 10,
  feedbackTitleMaxChars: 120,
  feedbackContentMaxChars: 3000,
  feedbackMaxImages: 3,
  feedbackRewardMin: 20,
  feedbackRewardMax: 100,
  feedbackRewardDefault: 50,
  failedLoginWindowMinutes: 30,
  failedLoginMaxAttempts: 3,
  rateLimits: DEFAULT_RATE_LIMITS
};
const SQL_BACKUP_MARKER = "-- Linuxdo-Mall D1 SQL Backup";
const MAX_SQL_IMPORT_BYTES = 8 * 1024 * 1024;
const CARD_KEY_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let mallRuntimeReady = false;
let authRuntimeReady = false;
let chatRuntimeReady = false;
let mallSchemaRepairPromise = null;
let authSchemaRepairPromise = null;
let chatSchemaRepairPromise = null;
const DEFAULT_MARKDOWN_GUIDES = [
  { title: "标题", keyword: "标题 heading h1 h2 h3", code: "### 小标题", note: "用 1-6 个 # 表示标题层级。" },
  { title: "HTML 快捷", keyword: "html h1 br strong em p li", code: "<h1>标题", note: "常见无属性标签会自动转 Markdown；脚本和带属性标签会拒绝。" },
  { title: "图片", keyword: "图片 image markdown url bing", code: "![图片](https://example.com/image.png)", note: "支持图片直链；Bing 图片详情页会在发送后自动解析。" },
  { title: "链接", keyword: "链接 link url", code: "[链接文字](https://example.com)", note: "打开外部网页，必须是 http/https 地址。" },
  { title: "加粗", keyword: "加粗 bold strong", code: "**重要内容**", note: "突出关键信息。" },
  { title: "斜体", keyword: "斜体 italic em", code: "*补充说明*", note: "用于弱强调。" },
  { title: "删除线", keyword: "删除线 strikethrough delete", code: "~~已失效~~", note: "标记作废内容。" },
  { title: "行内代码", keyword: "代码 code inline", code: "`订单号`", note: "用于账号、订单号、短字段。" },
  { title: "代码块", keyword: "代码块 fenced code block", code: "```text\n账号：demo\n密码：123456\n```", note: "按纯文本展示多行内容。" },
  { title: "引用", keyword: "引用 quote blockquote", code: "> 这是一条引用", note: "用于突出说明。" },
  { title: "无序列表", keyword: "列表 list bullet ul", code: "- 第一项\n- 第二项", note: "逐条列出信息。" },
  { title: "有序列表", keyword: "有序列表 numbered ol", code: "1. 第一步\n2. 第二步", note: "展示步骤。" },
  { title: "任务列表", keyword: "任务列表 task checkbox", code: "- [ ] 待处理\n- [x] 已完成", note: "展示处理状态。" },
  { title: "表格", keyword: "表格 table", code: "| 字段 | 内容 |\n| --- | --- |\n| 账号 | demo |", note: "展示结构化信息。" },
  { title: "分割线", keyword: "分割线 hr rule", code: "---", note: "分隔上下内容。" },
  { title: "换行", keyword: "换行 newline enter", code: "第一行\n第二行", note: "Shift + Enter 换行，Enter 发送。" },
  { title: "转义字符", keyword: "转义 escape backslash", code: "\\*不会变斜体\\*", note: "在特殊符号前加反斜杠可按原文显示。" },
  { title: "嵌套引用", keyword: "嵌套引用 nested blockquote", code: "> 一级引用\n>> 二级引用", note: "用多个 > 表示引用层级。" },
  { title: "脚注替代", keyword: "脚注 footnote note", code: "说明见备注 [1]\n\n[1]: 这里写补充说明", note: "聊天预览按普通文本展示，适合保留资料来源。" },
  { title: "定义列表替代", keyword: "定义列表 definition", code: "**术语**\n: 这里写解释", note: "安全渲染会按段落显示，可用于术语说明。" },
  { title: "高亮替代", keyword: "高亮 mark highlight", code: "**重点：** 这里是高亮内容", note: "出于安全限制不开放任意 HTML 样式，用加粗替代。" },
  { title: "角标替代", keyword: "上标 下标 sup sub", code: "H2O / x^2", note: "聊天不执行 HTML 标签，建议用纯文本表达。" },
  { title: "自动链接", keyword: "自动链接 autolink", code: "<https://example.com>", note: "尖括号包裹链接会作为安全链接展示。" },
  { title: "图片说明", keyword: "图片标题 alt title", code: "![图片说明](https://example.com/a.png)", note: "图片仅允许安全 http/https 图片直链。" },
  { title: "表格对齐", keyword: "表格对齐 align table", code: "| 左 | 中 | 右 |\n| :-- | :-: | --: |\n| A | B | C |", note: "对齐符号会保留表格结构，视觉对齐由页面样式处理。" },
  { title: "待办清单", keyword: "待办 todo checklist", code: "- [ ] 待确认\n- [x] 已完成", note: "适合订单交付步骤。" },
  { title: "安全限制", keyword: "安全 script html css js", code: "<script>不会被允许</script>", note: "脚本、样式、带属性 HTML 不会作为 HTML 执行。" }
];
const MALL_DEFAULT_SETTINGS = {
  siteInfo: {
    title: "Linuxdo Mall",
    subtitle: "官方权益流转中心",
    footer: "© 2026 Linuxdo Mall. All Rights Reserved.",
    contact: "TG: @rights_center",
    contacts: [
      { type: "telegram", label: "TG 私聊", value: "@rights_center", url: "" }
    ],
    currencyMode: "text",
    currencySymbol: "L",
    currencyImageUrl: "",
    logoMode: "text",
    logoText: "L",
    logoImageUrl: "",
    maintenanceImageUrl: "",
    maintenanceReason: "",
    siteActive: true
  },
  announcement: {
    active: true,
    top: "欢迎来到 Linuxdo Mall，商品、订单、卡密、评价和扫雷数据均保存在 Cloudflare D1。",
    type: "info",
    style: "soft",
    title: "商城公告",
    linkText: "",
    linkUrl: "",
    dismissible: true
  },
  pushme: {
    enabled: false,
    pushKey: "",
    serverUrl: "https://push.i-i.me",
    title: "[#商城] 新订单通知",
    type: "html"
  },
  luckyDraw: {
    enabled: true,
    scope: "product_daily",
    prizes: [
      { label: "谢谢参与", value: 1, weight: 5, color: "#475569" },
      { label: "9.5折", value: 0.95, weight: 35, color: "#6366f1" },
      { label: "9.0折", value: 0.9, weight: 30, color: "#4f46e5" },
      { label: "8.5折", value: 0.85, weight: 15, color: "#8b5cf6" },
      { label: "8.0折", value: 0.8, weight: 8, color: "#a855f7" },
      { label: "7.0折", value: 0.7, weight: 2, color: "#ec4899" },
      { label: "免单", value: 0, weight: 0.5, color: "#fbbf24" }
    ]
  },
  minesweeperCampaign: {
    enabled: true,
    key: MINESWEEPER_COUPON_CAMPAIGN_KEY,
    startAt: "2026-05-17 16:00:00",
    endsAt: "2026-05-24 16:00:00",
    validDays: MINESWEEPER_COUPON_VALID_DAYS,
    levelPercentCoupons: {
      beginner: 5,
      intermediate: 7,
      expert: 10
    },
    levelFirstFixedCoupons: {
      beginner: 10,
      intermediate: 20,
      expert: 30
    }
  },
  markdownGuides: DEFAULT_MARKDOWN_GUIDES,
  backup: {
    enabled: true,
    frequency: "daily",
    hour: 4,
    retentionDays: 7,
    keepDays: 7,
    includeLogs: true,
    scope: DEFAULT_BACKUP_SCOPE
  },
  limits: DEFAULT_MALL_LIMITS,
  adminUsers: {
    suimi: {
      role: "super_admin",
      name: "suimi",
      linuxdoId: SUPER_ADMIN_LINUXDO_ID
    }
  },
  theme: "system"
};

export default {
  async scheduled(event, env, ctx) {
    const task = runScheduledMallBackup(env);
    if (ctx?.waitUntil) {
      ctx.waitUntil(task);
      return;
    }
    await task;
  },

  async fetch(request, env, ctx) {
    const routed = routeRequest(request, env);

    if (routed.type === "redirect") {
      return Response.redirect(routed.request.url, 302);
    }
    if (routed.type === "not_found") {
      return env.ASSETS ? env.ASSETS.fetch(request) : fetch(request);
    }

    if (routed.type === "api") {
      return handleApi(routed.request, env, routed.basePath, ctx);
    }

    if (routed.type === "admin") {
      if (routed.basePath === "/games/minesweeper/") {
        const url = new URL(request.url);
        url.pathname = "/admin";
        url.search = "?tab=minesweeper";
        url.hash = "";
        return Response.redirect(url.toString(), 302);
      }
      return serveIndex(routed.request, env);
    }

    if (routed.type === "minesweeper") {
      if (await isMaintenanceLockedForRequest(routed.request, env)) {
        return shouldServeMaintenanceShell(routed.request)
          ? serveIndex(routed.request, env)
          : json({ error: "mall_maintenance", message: "网站维护中，请稍后再试" }, 503);
      }
      return serveMinesweeper(routed.request, env);
    }

    return serveAsset(routed.request, env);
  }
};

function routeRequest(request, env) {
  const url = new URL(request.url);
  const basePath = getBasePath(env, url.pathname);
  const baseNoSlash = basePath.replace(/\/$/, "");

  if (basePath !== "/" && url.pathname === baseNoSlash) {
    url.pathname = basePath;
    return { type: "redirect", request: new Request(url.toString(), request), basePath };
  }

  if (basePath !== "/" && !url.pathname.startsWith(basePath)) {
    return { type: "not_found", request, basePath };
  }

  const appPath = basePath === "/" ? url.pathname : `/${url.pathname.slice(basePath.length)}`;
  const routedUrl = new URL(request.url);
  routedUrl.pathname = appPath;
  const routedRequest = withBasePath(request, routedUrl, basePath);

  if (appPath.startsWith("/api/") || appPath === "/login") {
    return { type: "api", request: routedRequest, basePath };
  }
  if (appPath === "/admin") {
    return { type: "admin", request: routedRequest, basePath };
  }
  if (basePath === "/games/minesweeper/") {
    return { type: "minesweeper", request: routedRequest, basePath };
  }
  return { type: "asset", request: routedRequest, basePath };
}

function withBasePath(request, url, basePath) {
  const routedRequest = new Request(url.toString(), request);
  routedRequest.headers.set("x-minesweeper-base-path", basePath);
  return routedRequest;
}

function getBasePath(env, pathname = "") {
  const raw = String(env.MINESWEEPER_BASE_PATH || DEFAULT_BASE_PATH).trim();
  if (raw && raw !== "/") {
    const withLeading = raw.startsWith("/") ? raw : `/${raw}`;
    return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
  }
  const path = String(pathname || "");
  if (path === "/games/minesweeper" || path.startsWith("/games/minesweeper/")) {
    return "/games/minesweeper/";
  }
  return "/";
}

function serveAsset(request, env) {
  if (!env.ASSETS) {
    return fetch(request);
  }

  const url = new URL(request.url);
  if (url.pathname === "/") {
    return env.ASSETS.fetch(request);
  }

  return env.ASSETS.fetch(request).then((response) => {
    if (response.status !== 404) {
      return response;
    }

    if (url.pathname.includes(".")) {
      return response;
    }

    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/";
    indexUrl.search = "";
    indexUrl.hash = "";
    return env.ASSETS.fetch(new Request(indexUrl.toString(), request));
  });
}

async function handleApi(request, env, basePath = DEFAULT_BASE_PATH, ctx = null) {
  const url = new URL(request.url);

  try {
    await enforceCsrfForRequest(request, url);
    if (!shouldSkipPreAuthBlacklist(url.pathname)) {
      await assertNotBlacklisted(request, env);
    }
    if ((basePath === "/games/minesweeper/" || url.pathname === "/api/sync" || url.pathname === "/api/leaderboard") && !url.pathname.startsWith("/api/auth/")) {
      await assertSiteOpenForRequest(request, env);
    }
  if (request.method === "POST" && url.pathname === "/api/auth/register") {
      await assertAuthAllowedDuringMaintenance(request, env, basePath, null);
      return await register(request, env);
    }
  if (request.method === "POST" && url.pathname === "/api/auth/login") {
      await assertAuthAllowedDuringMaintenance(request, env, basePath, null);
      return await login(request, env);
    }
    if (request.method === "POST" && url.pathname === "/api/auth/logout") {
      return await logout(request, env);
    }
    if (request.method === "GET" && url.pathname === "/api/auth/linuxdo/start") {
      await assertAuthAllowedDuringMaintenance(request, env, basePath, null);
      return startLinuxDoLogin(request, env, basePath);
    }
    if (request.method === "GET" && (url.pathname === "/api/auth/linuxdo/callback" || url.pathname === "/login")) {
      return await handleLinuxDoCallback(request, env, basePath);
    }
    if (request.method === "GET" && url.pathname === "/api/auth/me") {
      const user = await requireUser(request, env);
      await assertAuthAllowedDuringMaintenance(request, env, basePath, user);
      const sessionToken = getCookie(request, SESSION_COOKIE);
      return json({ user, csrfToken: await buildCsrfTokenFromSession(sessionToken) }, 200, {
        "Set-Cookie": await makeCsrfCookie(request, sessionToken)
      });
    }
    if (url.pathname === "/api/pay/credit/return") {
      return handleCreditReturn(request);
    }
    if (url.pathname === "/api/pay/credit/notify") {
      return await handleCreditNotify(request, env, ctx);
    }
    if (request.method === "GET" && url.pathname === "/api/mall/bootstrap") {
      return await getMallBootstrap(request, env);
    }
    if (url.pathname.startsWith("/api/mall/") && !url.pathname.startsWith("/api/mall/admin")) {
      await assertMallOpenForRequest(request, env);
    }
    if (request.method === "GET" && url.pathname === "/api/mall/ads") {
      return await getMallAds(env);
    }
    if (request.method === "GET" && url.pathname === "/api/mall/hot-products") {
      return await getMallHotProducts(env);
    }
    if (request.method === "GET" && url.pathname === "/api/mall/recent-transactions") {
      return await getMallRecentTransactions(env);
    }
    if (url.pathname.startsWith("/api/admin/")) {
      return json({
        error: "minesweeper_admin_moved",
        message: "扫雷后台管理已移动到商城后台，请使用 /admin?tab=minesweeper"
      }, 410);
    }
    if (request.method === "GET" && url.pathname === "/api/mall/products") {
      return await getMallProducts(env);
    }
    if (request.method === "GET" && url.pathname.startsWith("/api/mall/products/")) {
      const user = await requireUser(request, env);
      return await getMallProductRoute(request, env, user);
    }
    if (request.method === "GET" && url.pathname === "/api/mall/orders") {
      const user = await requireUser(request, env);
      return await getMallOrders(env, user);
    }
    if (request.method === "POST" && url.pathname === "/api/mall/orders") {
      const user = await requireUser(request, env);
      return await createMallOrder(request, env, user, ctx);
    }
    if (url.pathname.startsWith("/api/mall/orders/")) {
      const user = await requireUser(request, env);
      return await handleMallOrderRoute(request, env, user);
    }
    if (request.method === "GET" && url.pathname === "/api/mall/coupons/validate") {
      return await validateMallCoupon(request, env);
    }
    if (request.method === "GET" && url.pathname === "/api/mall/coupons/available") {
      const user = await requireUser(request, env);
      return await getMallAvailableCoupons(request, env, user);
    }
    if (request.method === "GET" && url.pathname === "/api/mall/lottery/draw") {
      const user = await requireUser(request, env);
      return await getMallLotteryStatus(request, env, user);
    }
    if (request.method === "POST" && url.pathname === "/api/mall/lottery/draw") {
      const user = await requireUser(request, env);
      return await drawMallLottery(request, env, user);
    }
    if (request.method === "GET" && url.pathname === "/api/mall/feedback") {
      const user = await requireUser(request, env);
      await ensureMallRuntime(env);
      return json({
        feedback: await loadMallFeedback(env, { userId: user.id, limit: 80, includeDeleted: true }),
        ldcBalance: await getMallUserLdcBalance(env, user.id)
      });
    }
    if (request.method === "POST" && url.pathname === "/api/mall/feedback") {
      const user = await requireUser(request, env);
      await ensureMallRuntime(env);
      return await createMallFeedback(request, env, user);
    }
    if (url.pathname.startsWith("/api/mall/feedback/")) {
      const user = await requireUser(request, env);
      await ensureMallRuntime(env);
      return await handleMallFeedbackItemRoute(request, env, user);
    }
    if (url.pathname === "/api/mall/chat" || url.pathname.startsWith("/api/mall/chat/")) {
      const user = await requireUser(request, env);
      return await handleMallChatRoute(request, env, user, ctx);
    }
    if (url.pathname === "/api/mall/profile") {
      const user = await requireUser(request, env);
      return await handleMallProfile(request, env, user);
    }
    if (url.pathname === "/api/mall/profile/test-email") {
      const user = await requireUser(request, env);
      return await handleMallProfileTestEmail(request, env, user);
    }
    if (request.method === "GET" && url.pathname === "/api/mall/admin/overview") {
      const admin = await requireAdmin(request, env);
      return await getMallAdminOverview(request, env, admin);
    }
    if (url.pathname.startsWith("/api/mall/admin/")) {
      const admin = await requireAdmin(request, env);
      return await handleMallAdminRoute(request, env, admin, ctx);
    }
    if (request.method === "GET" && url.pathname === "/api/mall/admin-export") {
      const admin = await requireAdmin(request, env);
      return await exportMallAdminData(request, env, admin);
    }
    if (request.method === "GET" && url.pathname === "/api/sync") {
      const user = await requireUser(request, env);
      return await getSync(env, user.id);
    }
    if (request.method === "PUT" && url.pathname === "/api/sync") {
      const user = await requireUser(request, env);
      return await putSync(request, env, user.id);
    }
    if (request.method === "GET" && url.pathname === "/api/leaderboard") {
      return await getLeaderboard(request, env);
    }
    if (request.method === "GET" && url.pathname === "/api/minesweeper/campaign") {
      const user = await getOptionalUser(request, env);
      return await getMinesweeperCouponCampaign(env, user);
    }
    if (request.method === "POST" && url.pathname === "/api/leaderboard") {
      const user = await requireUser(request, env);
      return await submitLeaderboardScore(request, env, user, basePath);
    }

    return json({ error: "not_found" }, 404);
  } catch (error) {
    if (error instanceof ApiError) {
      return json({ error: error.code, message: error.message }, error.status);
    }
    console.error("handleApi unexpected error", {
      path: url.pathname,
      method: request.method,
      message: error?.message || String(error),
      stack: error?.stack || ""
    });
    return json({ error: "server_error", message: "服务器暂时不可用" }, 500);
  }
}

function shouldSkipPreAuthBlacklist(pathname) {
  return pathname === "/login" ||
    pathname === "/api/auth/login" ||
    pathname === "/api/auth/linuxdo/start" ||
    pathname === "/api/auth/linuxdo/callback" ||
    pathname === "/api/auth/me" ||
    pathname === "/api/mall/bootstrap" ||
    pathname.startsWith("/api/mall/admin/") ||
    pathname.startsWith("/api/admin/") ||
    pathname === "/api/pay/credit/notify";
}

async function enforceCsrfForRequest(request, url = new URL(request.url)) {
  if (!isUnsafeHttpMethod(request.method)) {
    return;
  }
  if (isCsrfExemptPath(url.pathname)) {
    return;
  }
  const origin = request.headers.get("Origin") || "";
  if (origin && origin !== url.origin) {
    throw new ApiError(403, "csrf_forbidden", "请求来源校验失败");
  }
  const secFetchSite = String(request.headers.get("Sec-Fetch-Site") || "").toLowerCase();
  if (secFetchSite && !["same-origin", "same-site", "none"].includes(secFetchSite)) {
    throw new ApiError(403, "csrf_forbidden", "跨站请求已被拦截");
  }
  const csrfToken = request.headers.get(CSRF_HEADER) || "";
  const expectedToken = await buildCsrfToken(request);
  if (!expectedToken || !timingSafeEqual(csrfToken, expectedToken)) {
    throw new ApiError(403, "csrf_forbidden", "安全令牌无效，请刷新页面后重试");
  }
}

function isUnsafeHttpMethod(method) {
  return !["GET", "HEAD", "OPTIONS"].includes(String(method || "GET").toUpperCase());
}

function isCsrfExemptPath(pathname) {
  return pathname === "/api/pay/credit/notify" ||
    pathname === "/api/auth/login" ||
    pathname === "/api/auth/register";
}

function startLinuxDoLogin(request, env, basePath = DEFAULT_BASE_PATH) {
  assertLinuxDoConfig(env);

  const state = randomHex(16);
  const returnTo = normalizeReturnTo(new URL(request.url).searchParams.get("return_to"), basePath);
  const redirectUri = getLinuxDoRedirectUri(request, env);
  const base = getLinuxDoBase(env);
  const authorizeUrl = new URL("/oauth2/authorize", base);
  authorizeUrl.searchParams.set("client_id", env.LINUXDO_CLIENT_ID);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("state", state);

  const headers = new Headers({
    Location: authorizeUrl.toString(),
    "Cache-Control": "no-store"
  });
  headers.append("Set-Cookie", makeOAuthStateCookie(request, state));
  headers.append("Set-Cookie", makeOAuthReturnCookie(request, returnTo));

  return new Response(null, { status: 302, headers });
}

function serveIndex(request, env) {
  if (!env.ASSETS) {
    return fetch(request);
  }

  const url = new URL(request.url);
  url.pathname = "/";
  url.search = "";
  return env.ASSETS.fetch(new Request(url.toString(), request));
}

function serveMinesweeper(request, env) {
  if (!env.ASSETS) {
    return fetch(request);
  }

  const url = new URL(request.url);
  const lastSegment = url.pathname.split("/").pop() || "";
  if (url.pathname === "/" || url.pathname === "" || !lastSegment.includes(".")) {
    url.pathname = "/games/minesweeper/minesweeper";
  } else {
    url.pathname = `/games/minesweeper${url.pathname}`;
  }
  return env.ASSETS.fetch(new Request(url.toString(), request));
}

async function handleLinuxDoCallback(request, env, basePath = DEFAULT_BASE_PATH) {
  assertLinuxDoConfig(env);

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expectedState = getCookie(request, OAUTH_STATE_COOKIE);

  if (!code || !state || !expectedState || !timingSafeEqual(state, expectedState)) {
    return redirectAuthResult(request, "error", basePath, [
      clearOAuthStateCookie(request),
      clearOAuthReturnCookie(request)
    ]);
  }

  const token = await fetchLinuxDoToken(request, env, code);
  const profile = await fetchLinuxDoProfile(env, token.access_token);
  if (!isSuperAdminLinuxDoProfile(profile)) {
    await assertNotBlacklisted(request, env);
  }
  if (await isMallMaintenance(env) && !isSuperAdminLinuxDoProfile(profile)) {
    await recordMallLoginAttempt(request, env, profile.username || String(profile.id || ""), false, "网站维护中，普通用户禁止登录");
    return redirectAuthResult(request, "maintenance", basePath, [
      clearOAuthStateCookie(request),
      clearOAuthReturnCookie(request)
    ]);
  }
  const user = await findOrCreateLinuxDoUser(env, profile);
  const sessionToken = await createSession(env, user.id);
  await recordMallLoginAttempt(request, env, profile.username || user.username, true, `Linux.do:${profile.id}`);
  await touchUserAccess(env, user.id, request);

  return redirectAuthResult(request, "success", basePath, [
    makeSessionCookie(request, sessionToken),
    await makeCsrfCookie(request, sessionToken),
    clearOAuthStateCookie(request),
    clearOAuthReturnCookie(request)
  ]);
}

async function register(request, env) {
  await ensureAuthRuntime(env);
  await assertNotBlacklisted(request, env);
  const { username, password } = await readCredentials(request);
  const existing = await env.DB.prepare("SELECT id FROM users WHERE username_lower = ?")
    .bind(username.toLowerCase())
    .first();

  if (existing) {
    throw new ApiError(409, "username_taken", "用户名已存在");
  }

  const userId = crypto.randomUUID();
  const salt = randomHex(16);
  const passwordHash = await hashPassword(password, salt);

  await env.DB.prepare(
    `INSERT INTO users (
      id, username, username_lower, password_hash, password_salt,
      register_ip, last_ip, last_user_agent, last_seen_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
  )
    .bind(
      userId,
      username,
      username.toLowerCase(),
      passwordHash,
      salt,
      getClientIp(request),
      getClientIp(request),
      normalizeText(request.headers.get("User-Agent") || "", 500)
    )
    .run();

  return issueSession(request, env, { id: userId, username }, 201);
}

async function login(request, env) {
  await ensureAuthRuntime(env);
  let credentials;
  try {
    credentials = await readCredentials(request);
  } catch (error) {
    await recordMallLoginAttempt(request, env, "", false, error.message || "参数错误");
    throw error;
  }
  const { username, password } = credentials;
  if (!isSuperAdminLoginName(username)) {
    await assertNotBlacklisted(request, env);
  }
  const user = await env.DB.prepare(
    "SELECT id, username, password_hash, password_salt FROM users WHERE username_lower = ?"
  )
    .bind(username.toLowerCase())
    .first();

  if (!user) {
    await recordMallLoginAttempt(request, env, username, false, "用户名不存在");
    await maybeBlacklistFailedLoginIp(request, env, username);
    throw new ApiError(401, "invalid_credentials", "用户名或密码错误");
  }

  const passwordHash = await hashPassword(password, user.password_salt);
  if (!timingSafeEqual(passwordHash, user.password_hash)) {
    await recordMallLoginAttempt(request, env, username, false, "密码错误");
    await maybeBlacklistFailedLoginIp(request, env, username);
    throw new ApiError(401, "invalid_credentials", "用户名或密码错误");
  }

  await recordMallLoginAttempt(request, env, username, true, "本地账号登录成功");
  await touchUserAccess(env, user.id, request);
  return issueSession(request, env, { id: user.id, username: user.username });
}

async function logout(request, env) {
  const token = getCookie(request, SESSION_COOKIE);
  if (token) {
    const tokenHash = await sha256Hex(token);
    await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(tokenHash).run();
  }

  return json(
    { ok: true },
    200,
    {
      "Set-Cookie": [
        clearSessionCookie(request),
        clearCsrfCookie(request)
      ]
    }
  );
}

async function handleCreditReturn(request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("out_trade_no") || url.searchParams.get("orderId") || "";
  const redirectUrl = new URL("/orders", url.origin);
  if (orderId) {
    redirectUrl.searchParams.set("credit_return", orderId);
  }
  return Response.redirect(redirectUrl.toString(), 302);
}

async function handleCreditNotify(request, env, ctx = null) {
  const params = await readCreditParams(request);

  try {
    await applyCreditPaymentNotify(env, params, ctx);
  } catch (error) {
    return new Response(error.message || "fail", {
      status: 400,
      headers: {
        "Content-Type": "text/plain; charset=utf-8"
      }
    });
  }

  return new Response("success", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}

async function readCreditParams(request) {
  const url = new URL(request.url);
  const params = request.method === "GET"
    ? new URLSearchParams(url.search)
    : new URLSearchParams(await request.text());
  return Object.fromEntries(params.entries());
}

async function applyCreditPaymentNotify(env, params, ctx = null) {
  const secret = String(env.CREDIT_EPAY_KEY || "").trim();
  const pid = String(env.CREDIT_EPAY_PID || "").trim();
  if (!pid || !secret) {
    throw new Error("credit_not_configured");
  }
  if (String(params.pid || "") !== pid) {
    throw new Error("invalid_pid");
  }
  const sign = String(params.sign || "").toLowerCase();
  const expected = signCreditPayload(params, secret).toLowerCase();
  if (!sign || !timingSafeEqual(sign, expected)) {
    throw new Error("invalid_sign");
  }
  const orderId = normalizeText(params.out_trade_no, 80);
  const tradeNo = normalizeText(params.trade_no || params.tradeNo || "", 120);
  const paidAmount = Number(params.money || 0);
  const status = String(params.trade_status || params.status || "").toUpperCase();
  if (!isUuidLike(orderId)) {
    throw new Error("invalid_order");
  }
  if (!["TRADE_SUCCESS", "SUCCESS", "PAID"].includes(status)) {
    throw new Error("trade_not_success");
  }
  const order = await loadMallOrder(env, orderId);
  if (!order) {
    throw new Error("order_not_found");
  }
  const currentOrder = await expireMallOrderIfNeeded(env, order);
  if (currentOrder.status === "expired") {
    throw new Error("order_expired");
  }
  if (currentOrder.status === "completed") {
    return;
  }
  if (!["pending", "processing"].includes(currentOrder.status)) {
    throw new Error("order_state_locked");
  }
  if (!Number.isFinite(paidAmount) || Math.abs(paidAmount - Number(currentOrder.finalAmount || 0)) > 0.01) {
    throw new Error("amount_mismatch");
  }
  const product = await loadMallProduct(env, currentOrder.productId, { includeInactive: true });
  await env.DB.prepare(
    "UPDATE mall_orders SET trade_no = ?, status = CASE WHEN status = 'pending' THEN 'processing' ELSE status END, note = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(tradeNo || `CREDIT-${Date.now()}`, "积分站支付成功", currentOrder.id).run();
  const paidOrder = await loadMallOrder(env, currentOrder.id);
  if (!["pending", "processing"].includes(paidOrder.status)) {
    throw new Error("order_state_changed");
  }
  await markMallOrderUserCouponsUsed(env, paidOrder);
  if (isAutoDeliverableProduct(product)) {
    await completeMallOrder(env, paidOrder, { id: "", username: "credit" }, {
      ctx,
      note: `积分站支付成功，交易号 ${tradeNo || "-"}`
    });
  }
}

async function getSync(env, userId) {
  const row = await env.DB.prepare(
    "SELECT state_json, best_json, client_updated_at, server_updated_at FROM game_sync WHERE user_id = ?"
  )
    .bind(userId)
    .first();

  if (!row) {
    return json({ state: null, best: {}, clientUpdatedAt: 0, serverUpdatedAt: null });
  }

  return json({
    state: parseJson(row.state_json, null),
    best: parseJson(row.best_json, {}),
    clientUpdatedAt: row.client_updated_at || 0,
    serverUpdatedAt: row.server_updated_at
  });
}

async function putSync(request, env, userId) {
  const body = await readJson(request);
  const stateJson = body.state == null ? null : JSON.stringify(body.state);
  const bestJson = body.best == null ? "{}" : JSON.stringify(body.best);
  const clientUpdatedAt = Number.isFinite(body.clientUpdatedAt) ? Math.trunc(body.clientUpdatedAt) : Date.now();

  if ((stateJson?.length || 0) + bestJson.length > MAX_SYNC_BYTES) {
    throw new ApiError(413, "sync_too_large", "同步数据过大");
  }

  await env.DB.prepare(
    `INSERT INTO game_sync (user_id, state_json, best_json, client_updated_at, server_updated_at)
     VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(user_id) DO UPDATE SET
       state_json = excluded.state_json,
       best_json = excluded.best_json,
       client_updated_at = excluded.client_updated_at,
       server_updated_at = CURRENT_TIMESTAMP`
  )
    .bind(userId, stateJson, bestJson, clientUpdatedAt)
    .run();

  return json({ ok: true, clientUpdatedAt });
}

async function getLeaderboard(request, env) {
  const url = new URL(request.url);
  const level = normalizeLevel(url.searchParams.get("level"));
  let currentUser = await getOptionalUser(request, env);
  if (currentUser && !currentUser.isAdmin) {
    try {
      await assertNotBlacklisted(request, env, currentUser);
    } catch (error) {
      if (error instanceof ApiError) {
        currentUser = null;
      } else {
        throw error;
      }
    }
  }
  const rows = await env.DB.prepare(
    `SELECT level, user_id, username, display_name, seconds, won_at
     FROM leaderboard_scores
     WHERE level = ?
     ORDER BY seconds ASC, won_at ASC
     LIMIT 10`
  )
    .bind(level)
    .all();

  const leaders = (rows.results || []).map((row, index) => ({
    rank: index + 1,
    level: row.level,
    userId: row.user_id,
    username: row.display_name || row.username,
    seconds: row.seconds,
    wonAt: row.won_at
  }));

  const myRank = currentUser ? await getLeaderboardRank(env, level, currentUser.id) : null;
  return json({ level, leaders, myRank });
}

async function submitLeaderboardScore(request, env, user, basePath = DEFAULT_BASE_PATH) {
  const body = await readJson(request);
  const level = normalizeLevel(body.level);
  const seconds = normalizeScoreSeconds(body.seconds);
  const displayName = user.linuxdo?.username || user.username;

  await env.DB.prepare(
    `INSERT INTO leaderboard_scores (level, user_id, username, display_name, seconds, won_at, updated_at)
     VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     ON CONFLICT(level, user_id) DO UPDATE SET
       username = excluded.username,
       display_name = excluded.display_name,
       seconds = CASE
         WHEN excluded.seconds < leaderboard_scores.seconds THEN excluded.seconds
         ELSE leaderboard_scores.seconds
       END,
       won_at = CASE
         WHEN excluded.seconds < leaderboard_scores.seconds THEN CURRENT_TIMESTAMP
         ELSE leaderboard_scores.won_at
       END,
       updated_at = CURRENT_TIMESTAMP`
  )
    .bind(level, user.id, user.username, displayName, seconds)
    .run();

  const leaderboardResponse = await getLeaderboard(
    new Request(`${new URL(request.url).origin}${basePath}api/leaderboard?level=${encodeURIComponent(level)}`, {
      headers: request.headers
    }),
    env
  );
  const leaderboardPayload = await leaderboardResponse.json();
  const campaignResponse = await getMinesweeperCouponCampaign(env, user);
  const campaignPayload = await campaignResponse.json();
  return json({
    ...leaderboardPayload,
    campaign: campaignPayload.campaign,
    campaignRank: campaignPayload.rank,
    campaignRanks: campaignPayload.ranks || [],
    userCoupons: campaignPayload.userCoupons
  });
}

async function issueSession(request, env, user, status = 200) {
  const token = await createSession(env, user.id);
  const csrfToken = await buildCsrfTokenFromSession(token);

  return json(
    { user, csrfToken },
    status,
    {
      "Set-Cookie": [
        makeSessionCookie(request, token),
        await makeCsrfCookie(request, token)
      ]
    }
  );
}

async function createSession(env, userId) {
  const token = randomHex(32);
  const tokenHash = await sha256Hex(token);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();

  await env.DB.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)")
    .bind(tokenHash, userId, expiresAt)
    .run();

  return token;
}

async function buildCsrfToken(request) {
  const token = getCookie(request, SESSION_COOKIE);
  return token ? await buildCsrfTokenFromSession(token) : "";
}

async function buildCsrfTokenFromSession(token) {
  const digest = await sha256Hex(`csrf:${token}`);
  return digest.slice(0, 48);
}

async function requireUser(request, env) {
  const user = await getOptionalUser(request, env);
  if (!user) {
    throw new ApiError(401, "unauthorized", "请先登录");
  }
  await assertNotBlacklisted(request, env, user);

  return user;
}

async function requireAdmin(request, env) {
  const user = await requireUser(request, env);
  if (!isSuperAdminUser(user)) {
    throw new ApiError(403, "admin_forbidden", "需要超级管理员权限");
  }

  return user;
}

async function getOptionalUser(request, env) {
  await ensureAuthRuntime(env);
  const token = getCookie(request, SESSION_COOKIE);
  if (!token) {
    return null;
  }

  const tokenHash = await sha256Hex(token);
  const row = await env.DB.prepare(
    `SELECT
       users.id,
       users.username,
       users.created_at,
       users.register_ip,
       users.last_ip,
       users.last_user_agent,
       users.last_seen_at,
       users.notification_email,
       users.notify_email_enabled,
       users.last_test_email_at,
       sessions.created_at AS session_created_at,
       sessions.expires_at,
       oauth_accounts.provider AS oauth_provider,
       oauth_accounts.subject AS oauth_subject,
       oauth_accounts.username AS oauth_username,
       oauth_accounts.trust_level AS oauth_trust_level
     FROM sessions
     JOIN users ON users.id = sessions.user_id
     LEFT JOIN oauth_accounts ON oauth_accounts.user_id = users.id
     WHERE sessions.token_hash = ?`
  )
    .bind(tokenHash)
    .first();

  if (!row || Date.parse(row.expires_at) <= Date.now()) {
    if (row) {
      await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(tokenHash).run();
    }
    return null;
  }

  const user = {
    id: row.id,
    username: row.username,
    provider: row.oauth_provider || "password",
    linuxdo: row.oauth_provider === LINUXDO_PROVIDER ? {
      id: row.oauth_subject,
      username: row.oauth_username || row.username,
      trustLevel: Number(row.oauth_trust_level || 0)
    } : null,
    createdAt: row.created_at,
    registerIp: row.register_ip || "",
    lastIp: row.last_ip || "",
    lastUserAgent: row.last_user_agent || "",
    lastSeenAt: row.last_seen_at || null,
    email: row.notification_email || "",
    notifyEmailEnabled: Boolean(row.notify_email_enabled),
    lastTestEmailAt: row.last_test_email_at || null,
    sessionCreatedAt: row.session_created_at,
    expiresAt: row.expires_at
  };
  user.isAdmin = isSuperAdminUser(user);
  await touchUserAccess(env, user.id, request);
  return user;
}

async function loadUserById(env, userId) {
  if (!userId) return null;
  await ensureAuthRuntime(env);
  const row = await env.DB.prepare(
    `SELECT
       users.id,
       users.username,
       users.created_at,
       users.register_ip,
       users.last_ip,
       users.last_user_agent,
       users.last_seen_at,
       users.notification_email,
       users.notify_email_enabled,
       users.last_test_email_at,
       oauth_accounts.provider AS oauth_provider,
       oauth_accounts.subject AS oauth_subject,
       oauth_accounts.username AS oauth_username,
       oauth_accounts.trust_level AS oauth_trust_level
     FROM users
     LEFT JOIN oauth_accounts ON oauth_accounts.user_id = users.id
     WHERE users.id = ?`
  ).bind(userId).first();
  if (!row) return null;
  const user = {
    id: row.id,
    username: row.username,
    provider: row.oauth_provider || "password",
    linuxdo: row.oauth_provider === LINUXDO_PROVIDER ? {
      id: row.oauth_subject,
      username: row.oauth_username || row.username,
      trustLevel: Number(row.oauth_trust_level || 0)
    } : null,
    createdAt: row.created_at,
    registerIp: row.register_ip || "",
    lastIp: row.last_ip || "",
    lastUserAgent: row.last_user_agent || "",
    lastSeenAt: row.last_seen_at || null,
    email: row.notification_email || "",
    notifyEmailEnabled: Boolean(row.notify_email_enabled),
    lastTestEmailAt: row.last_test_email_at || null
  };
  user.isAdmin = isSuperAdminUser(user);
  return user;
}

function isSuperAdminUser(user) {
  const linuxdoId = String(user?.linuxdo?.id || "");
  const linuxdoUsername = String(user?.linuxdo?.username || "").trim().toLowerCase();
  return user?.provider === LINUXDO_PROVIDER &&
    linuxdoId === SUPER_ADMIN_LINUXDO_ID &&
    linuxdoUsername === SUPER_ADMIN_USERNAME;
}

function isSuperAdminLinuxDoProfile(profile) {
  const linuxdoId = String(profile?.id || "");
  const linuxdoUsername = String(profile?.username || "").trim().toLowerCase();
  return linuxdoId === SUPER_ADMIN_LINUXDO_ID && linuxdoUsername === SUPER_ADMIN_USERNAME;
}

async function getAdminOverview(env, admin) {
  await syncMinesweeperCampaignAwards(env, { limit: 500 });
  const counts = await env.DB.batch([
    env.DB.prepare("SELECT COUNT(*) AS count FROM users"),
    env.DB.prepare("SELECT COUNT(*) AS count FROM oauth_accounts"),
    env.DB.prepare("SELECT COUNT(*) AS count FROM sessions"),
    env.DB.prepare("SELECT COUNT(*) AS count FROM game_sync"),
    env.DB.prepare("SELECT COUNT(*) AS count FROM leaderboard_scores")
  ]);
  const leaderboardLevels = await env.DB.prepare(
    `SELECT level, COUNT(*) AS entries, MIN(seconds) AS best_seconds
     FROM leaderboard_scores
     GROUP BY level
     ORDER BY level ASC`
  ).all();
  const users = await env.DB.prepare(
    `SELECT
       users.id,
       users.username,
       users.created_at,
       oauth_accounts.provider,
       oauth_accounts.subject AS linuxdo_id,
       oauth_accounts.username AS linuxdo_username,
       game_sync.server_updated_at AS last_sync_at,
       COUNT(leaderboard_scores.user_id) AS score_count
     FROM users
     LEFT JOIN oauth_accounts ON oauth_accounts.user_id = users.id
     LEFT JOIN game_sync ON game_sync.user_id = users.id
     LEFT JOIN leaderboard_scores ON leaderboard_scores.user_id = users.id
     GROUP BY users.id
     ORDER BY users.created_at DESC
     LIMIT 30`
  ).all();
  const topScores = await env.DB.prepare(
    `WITH ranked AS (
       SELECT
         level,
         user_id,
         username,
         display_name,
         seconds,
         won_at,
         ROW_NUMBER() OVER (PARTITION BY level ORDER BY seconds ASC, won_at ASC) AS rank
       FROM leaderboard_scores
     )
     SELECT level, user_id, username, display_name, seconds, won_at, rank
     FROM ranked
     WHERE rank <= 100
     ORDER BY level ASC, rank ASC`
  ).all();
  const campaignSummary = await getMinesweeperCampaignAdminSummary(env);

  return json({
    admin: {
      id: admin.id,
      username: admin.linuxdo?.username || admin.username,
      linuxdoId: admin.linuxdo?.id || null
    },
    stats: {
      users: countFromResult(counts[0]),
      linuxdoAccounts: countFromResult(counts[1]),
      sessions: countFromResult(counts[2]),
      syncs: countFromResult(counts[3]),
      scores: countFromResult(counts[4])
    },
    leaderboardLevels: (leaderboardLevels.results || []).map((row) => ({
      level: row.level,
      entries: row.entries,
      bestSeconds: row.best_seconds
    })),
    users: (users.results || []).map((row) => ({
      id: row.id,
      username: row.linuxdo_username || row.username,
      accountUsername: row.username,
      provider: row.provider || "password",
      linuxdoId: row.linuxdo_id || null,
      linuxdoUsername: row.linuxdo_username || null,
      createdAt: row.created_at,
      lastSyncAt: row.last_sync_at || null,
      scoreCount: row.score_count || 0
    })),
    topScores: (topScores.results || []).map((row) => ({
      rank: row.rank,
      level: row.level,
      userId: row.user_id,
      username: row.display_name || row.username,
      seconds: row.seconds,
      wonAt: row.won_at
    })),
    couponCampaign: campaignSummary
  });
}

async function clearAdminLeaderboard(request, env) {
  const url = new URL(request.url);
  const levelParam = url.searchParams.get("level") || "all";

  if (levelParam === "all") {
    await env.DB.prepare("DELETE FROM leaderboard_scores").run();
    return json({ ok: true, level: "all" });
  }

  const level = normalizeLevel(levelParam);
  await env.DB.prepare("DELETE FROM leaderboard_scores WHERE level = ?").bind(level).run();
  return json({ ok: true, level });
}

async function deleteAdminScores(request, env) {
  const body = await readJson(request);
  const scores = normalizeScoreTargets(body.scores);

  if (scores.length === 0) {
    throw new ApiError(400, "empty_selection", "请选择要删除的成绩");
  }

  await runD1InChunks(env, scores, (score) => (
    env.DB.prepare("DELETE FROM leaderboard_scores WHERE level = ? AND user_id = ?")
      .bind(score.level, score.userId)
  ));

  return json({ ok: true, deleted: scores.length });
}

async function deleteAdminUserSync(request, env, admin) {
  const body = await readJson(request);
  const userIds = normalizeUserIds(body.userIds).filter((userId) => userId !== admin.id);

  if (userIds.length === 0) {
    throw new ApiError(400, "empty_selection", "请选择要删除的云端数据");
  }

  await deleteD1RowsByIds(env, "game_sync", "user_id", userIds, { uuid: true });
  await deleteD1RowsByIds(env, "leaderboard_scores", "user_id", userIds, { uuid: true });

  return json({ ok: true, deleted: userIds.length });
}

async function deleteAdminUsers(request, env, admin) {
  const body = await readJson(request);
  const userIds = normalizeUserIds(body.userIds).filter((userId) => userId !== admin.id);

  if (userIds.length === 0) {
    throw new ApiError(400, "empty_selection", "请选择要删除的用户，不能删除当前超级管理员");
  }

  await deleteMallUsersByIds(env, userIds);

  return json({ ok: true, deleted: userIds.length });
}

function countFromResult(result) {
  return Number(result?.results?.[0]?.count || 0);
}

function countMapFromRows(result, keyName = "status") {
  const output = {};
  for (const row of result?.results || []) {
    output[row[keyName] || "unknown"] = Number(row.count || 0);
  }
  return output;
}

function productRevenueFromRows(result) {
  return (result?.results || []).map((row) => ({
    productId: row.product_id || "",
    productName: row.product_name || row.product_id || "未知商品",
    orderCount: Number(row.order_count || 0),
    quantity: Number(row.quantity || 0),
    amount: Number(row.amount || 0)
  }));
}

async function getMallBootstrap(request, env) {
  await ensureMallRuntime(env);
  let rawUser = await getOptionalUser(request, env);
  if (rawUser && !rawUser.isAdmin) {
    try {
      await assertNotBlacklisted(request, env, rawUser);
    } catch (error) {
      if (error instanceof ApiError) {
        rawUser = null;
      } else {
        throw error;
      }
    }
  }
  const settings = await getMallSettings(env);
  const maintenance = settings.siteInfo?.siteActive === false;
  const user = maintenance && !rawUser?.isAdmin ? null : rawUser;
  const allowMallData = Boolean(user && !maintenance);
  if (allowMallData) {
    await expirePendingMallOrders(env, { userId: user.id });
  }
  const [products, ads, hotProducts, recentTransactions, orderCount] = allowMallData
    ? await Promise.all([
      loadMallProducts(env),
      loadMallAds(env),
      loadMallHotProducts(env),
      loadMallRecentTransactions(env),
      getMallOrderCount(env)
    ])
    : [[], [], [], [], 0];
  const orders = allowMallData ? await loadMallOrders(env, user, { limit: 20 }) : [];
  const feedback = allowMallData ? await loadMallFeedback(env, { userId: user.id, limit: 20 }) : [];
  const [ldcBalance, userMallSpent] = allowMallData
    ? await Promise.all([
      getMallUserLdcBalance(env, user.id),
      getMallUserTotalSpent(env, user.id)
    ])
    : [0, 0];
  const minesweeperActivity = allowMallData
    ? await (await getMinesweeperCouponCampaign(env, user)).json()
    : { campaign: buildMinesweeperCampaignWindow(settings.minesweeperCampaign), rank: null, ranks: [], userCoupons: [] };

  const sessionToken = getCookie(request, SESSION_COOKIE);
  const headers = user && sessionToken ? { "Set-Cookie": await makeCsrfCookie(request, sessionToken) } : {};
  return json({
    user,
    settings: sanitizeMallSettingsForClient(settings),
    products,
    ads,
    hotProducts,
    recentTransactions,
    stats: {
      orders: orderCount
    },
    orders,
    feedback,
    ldcBalance,
    userMallSpent,
    minesweeperActivity
  }, 200, headers);
}

function sanitizeMallSettingsForClient(settings) {
  const siteInfo = settings.siteInfo || {};
  const announcement = settings.announcement || {};
  const luckyDraw = settings.luckyDraw || {};
  return {
    siteInfo: {
      title: siteInfo.title || "Linuxdo Mall",
      subtitle: siteInfo.subtitle || "",
      footer: siteInfo.footer || "",
      contact: siteInfo.contact || "",
      contacts: normalizeContactLinks(siteInfo.contacts || []),
      currencyMode: siteInfo.currencyMode === "image" ? "image" : "text",
      currencySymbol: siteInfo.currencySymbol || "L",
      currencyImageUrl: normalizeCurrencyImageUrl(siteInfo.currencyImageUrl || ""),
      logoMode: siteInfo.logoMode === "image" ? "image" : "text",
      logoText: siteInfo.logoText || "L",
      logoImageUrl: normalizeSiteImageUrl(siteInfo.logoImageUrl || ""),
      maintenanceImageUrl: normalizeSiteImageUrl(siteInfo.maintenanceImageUrl || ""),
      maintenanceReason: siteInfo.maintenanceReason || "",
      siteActive: siteInfo.siteActive !== false
    },
    announcement: {
      active: announcement.active !== false,
      top: announcement.top || "",
      title: announcement.title || "商城公告",
      type: normalizeChoice(announcement.type, ["info", "success", "warning", "danger"], "info"),
      style: normalizeChoice(announcement.style, ["soft", "solid", "outline"], "soft"),
      linkText: normalizeText(announcement.linkText || "", 40),
      linkUrl: normalizePublicLinkUrl(announcement.linkUrl || ""),
      dismissible: announcement.dismissible !== false
    },
    luckyDraw: {
      enabled: luckyDraw.enabled !== false,
      prizes: normalizePrizeList(luckyDraw.prizes || [])
    },
    minesweeperCampaign: normalizeMinesweeperCampaignSettings(settings.minesweeperCampaign || MALL_DEFAULT_SETTINGS.minesweeperCampaign),
    limits: pickPublicMallLimits(settings.limits || DEFAULT_MALL_LIMITS),
    markdownGuides: normalizeMarkdownGuides(settings.markdownGuides || DEFAULT_MARKDOWN_GUIDES),
    theme: settings.theme || "system"
  };
}

function pickPublicMallLimits(limits = DEFAULT_MALL_LIMITS) {
  const normalized = normalizeMallLimits(limits);
  return {
    userTestEmailCooldownHours: normalized.userTestEmailCooldownHours,
    orderChatDays: normalized.orderChatDays,
    generalChatFirstMessages: normalized.generalChatFirstMessages,
    generalChatMaxChars: normalized.generalChatMaxChars,
    generalChatMaxImages: normalized.generalChatMaxImages,
    chatMaxChars: normalized.chatMaxChars,
    chatMaxImages: normalized.chatMaxImages,
    feedbackTitleMinChars: normalized.feedbackTitleMinChars,
    feedbackContentMinChars: normalized.feedbackContentMinChars,
    feedbackTitleMaxChars: normalized.feedbackTitleMaxChars,
    feedbackContentMaxChars: normalized.feedbackContentMaxChars,
    feedbackMaxImages: normalized.feedbackMaxImages,
    feedbackRewardMin: normalized.feedbackRewardMin,
    feedbackRewardMax: normalized.feedbackRewardMax,
    feedbackRewardDefault: normalized.feedbackRewardDefault
  };
}

async function assertMallOpenForRequest(request, env) {
  await assertFrontSiteOpen(env);
  return await requireUser(request, env);
}

async function assertSiteOpenForRequest(request, env) {
  await assertFrontSiteOpen(env);
  return await getOptionalUser(request, env);
}

async function isMaintenanceLockedForRequest(request, env) {
  try {
    return await isMallMaintenance(env);
  } catch {
    return false;
  }
}

function shouldServeMaintenanceShell(request) {
  const url = new URL(request.url);
  const lastSegment = url.pathname.split("/").pop() || "";
  const accept = request.headers.get("Accept") || "";
  return !lastSegment.includes(".") || accept.includes("text/html");
}

async function assertMallOpen(env, user = null) {
  const settings = await getMallSettings(env);
  if (settings.siteInfo?.siteActive === false && !user?.isAdmin) {
    throw new ApiError(503, "mall_maintenance", "商城维护中，请稍后再试");
  }
}

async function assertFrontSiteOpen(env) {
  if (await isMallMaintenance(env)) {
    throw new ApiError(503, "mall_maintenance", "网站维护中，请稍后再试");
  }
}

async function isMallMaintenance(env) {
  const settings = await getMallSettings(env);
  return settings.siteInfo?.siteActive === false;
}

async function assertAuthAllowedDuringMaintenance(request, env, basePath, user = null) {
  if (!(await isMallMaintenance(env))) {
    return;
  }
  if (user?.isAdmin || isMaintenanceAdminLoginRequest(request, basePath)) {
    return;
  }
  throw new ApiError(503, "mall_maintenance", "网站维护中，暂时无法登录或使用前台功能");
}

function isMaintenanceAdminLoginRequest(request, basePath = DEFAULT_BASE_PATH) {
  const url = new URL(request.url);
  const returnTo = normalizeReturnTo(url.searchParams.get("return_to") || getCookie(request, OAUTH_RETURN_COOKIE), basePath);
  const target = new URL(returnTo, url.origin);
  const base = basePath || "/";
  const appPath = base === "/" ? target.pathname : `/${target.pathname.slice(base.length)}`;
  return appPath === "/admin";
}

async function getMallProducts(env) {
  await ensureMallRuntime(env);
  return json({ products: await loadMallProducts(env) });
}

async function getMallProductRoute(request, env, user) {
  await ensureMallRuntime(env);
  const productId = decodeURIComponent(new URL(request.url).pathname.slice("/api/mall/products/".length));
  const product = await loadMallProduct(env, productId);
  if (!product) {
    throw new ApiError(404, "product_not_found", "商品不存在");
  }
  const [ratings, boughtCount] = await Promise.all([
    loadMallRatings(env, product.id, 30),
    user ? getUserProductBoughtCount(env, user.id, product.id) : Promise.resolve(0)
  ]);
  return json({ product, ratings, boughtCount });
}

async function getMallAds(env) {
  await ensureMallRuntime(env);
  return json({ ads: await loadMallAds(env) });
}

async function getMallHotProducts(env) {
  await ensureMallRuntime(env);
  return json({ products: await loadMallHotProducts(env) });
}

async function getMallRecentTransactions(env) {
  await ensureMallRuntime(env);
  return json({ transactions: await loadMallRecentTransactions(env) });
}

async function getMallOrders(env, user) {
  await ensureMallRuntime(env);
  const urlSafeUser = user || { id: "" };
  await expirePendingMallOrders(env, { userId: urlSafeUser.id });
  return json({ orders: await loadMallOrders(env, urlSafeUser, { limit: 80 }) });
}

async function handleMallProfile(request, env, user) {
  await ensureAuthRuntime(env);
  if (request.method === "GET") {
    return json({ user: await loadUserById(env, user.id) || user });
  }
  if (request.method === "PUT" || request.method === "PATCH") {
    const body = await readJson(request);
    const email = normalizeEmailAddress(body.email);
    if (body.email && !email) {
      throw new ApiError(400, "invalid_email", "邮箱格式不正确");
    }
    const enabled = Boolean(body.notifyEmailEnabled) && Boolean(email);
    await env.DB.prepare(
      "UPDATE users SET notification_email = ?, notify_email_enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(email, enabled ? 1 : 0, user.id).run();
    return json({ user: await loadUserById(env, user.id) || user });
  }
  return json({ error: "not_found" }, 404);
}

async function handleMallProfileTestEmail(request, env, user) {
  if (request.method !== "POST") {
    return json({ error: "not_found" }, 404);
  }
  const body = await readJson(request);
  const recipientEmail = normalizeEmailAddress(body.email || user.email || "");
  if (!recipientEmail) {
    throw new ApiError(400, "invalid_email", "请先填写正确的测试邮箱");
  }
  const loadedUser = await loadUserById(env, user.id);
  const nowIso = new Date().toISOString();
  const settings = await getMallSettings(env);
  const cooldownHours = settings.limits?.userTestEmailCooldownHours ?? DEFAULT_MALL_LIMITS.userTestEmailCooldownHours;
  if (cooldownHours > 0 && loadedUser?.lastTestEmailAt) {
    const lastTestMs = Date.parse(loadedUser.lastTestEmailAt);
    if (Number.isFinite(lastTestMs) && Date.now() - lastTestMs < cooldownHours * 60 * 60 * 1000) {
      throw new ApiError(429, "email_test_limited", cooldownHours >= 24 ? "今天已经成功发送过测试邮件，请明天再试" : `测试邮件发送过于频繁，请 ${cooldownHours} 小时后再试`);
    }
  }
  await sendMallTestEmail(env, {
    to: recipientEmail,
    username: loadedUser?.linuxdo?.username || loadedUser?.username || user.username || "用户",
    scope: "user"
  });
  await env.DB.prepare(
    "UPDATE users SET last_test_email_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(nowIso, user.id).run();
  return json({ ok: true, email: recipientEmail, lastTestEmailAt: nowIso });
}

async function createMallOrder(request, env, user, ctx = null) {
  await ensureMallRuntime(env);
  const settings = await getMallSettings(env);
  await assertMallRateLimit(request, env, user, "order_create", {
    ...(settings.limits?.rateLimits?.orderCreate || DEFAULT_RATE_LIMITS.orderCreate),
    message: "下单过于频繁，请稍后再试"
  });
  const body = await readJson(request);
  const productId = normalizeMallId(body.productId);
  const quantity = Math.max(1, Math.min(9, Number.parseInt(body.quantity || 1, 10) || 1));
  const couponCode = normalizeCouponCode(body.couponCode);
  const userInfo = normalizeUserInfo(body.userInfo);

  if (!productId) {
    throw new ApiError(400, "invalid_product", "商品无效");
  }

  const product = await loadMallProduct(env, productId, { includeInactive: true });
  if (!product || product.status !== "active") {
    throw new ApiError(404, "product_not_found", "商品不存在或已下架");
  }

  if (product.minTrustLevel > 0) {
    const userTrustLevel = Number(user.linuxdo?.trustLevel || 0);
    if (userTrustLevel < product.minTrustLevel) {
      throw new ApiError(
        403,
        "trust_level_required",
        `该商品要求 Linux.do 信任等级 ${product.minTrustLevel}，当前等级 ${userTrustLevel}`
      );
    }
  }

  assertMallUserInfo(product, userInfo);

  const availableStock = await getMallProductStock(env, product);
  if (availableStock < quantity) {
    throw new ApiError(409, "stock_not_enough", "库存不足");
  }

  if (product.limitPerUser > 0) {
    const boughtCount = await getUserProductBoughtCount(env, user.id, product.id);
    if (boughtCount + quantity > product.limitPerUser) {
      throw new ApiError(409, "limit_reached", `该商品每人限购 ${product.limitPerUser} 件`);
    }
  }

  const amount = product.price * quantity;
  const coupon = couponCode ? await getValidMallCoupon(env, couponCode, product.id, amount) : null;
  if (couponCode && !coupon) {
    throw new ApiError(404, "coupon_not_found", "优惠码不可用");
  }
  const lottery = await getMallLotteryDrawForOrder(env, user, product);
  const discountPlan = await buildMallOrderDiscountPlan(env, user, product, amount, coupon, lottery);
  const discountAmount = discountPlan.discountAmount;
  const finalAmount = discountPlan.finalAmount;
  const orderId = crypto.randomUUID();
  const displayName = user.linuxdo?.username || user.username;
  const deliveryMode = product.deliveryMode || "manual";
  if (product.paymentMode === "test" && !isTestPaymentEnabled(env)) {
    throw new ApiError(403, "test_payment_disabled", "测试支付仅允许在测试环境使用");
  }
  const autoDeliverable = isAutoDeliverableProduct(product);
  const orderNote = product.paymentMode === "credit"
    ? (autoDeliverable ? "等待积分站支付，支付后将自动交付" : "等待积分站支付，支付后进入待处理")
    : autoDeliverable ? "等待系统自动交付" : "人工服务订单，等待管理员处理";

  const statements = [
    env.DB.prepare(
      `INSERT INTO mall_orders (
        id, user_id, product_id, product_name, quantity, amount, final_amount,
        coupon_code, discount_amount, discounts_json, status, note, user_info_json, buyer_username, payment_mode
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)`
    ).bind(
      orderId,
      user.id,
      product.id,
      product.name,
      quantity,
      amount,
      finalAmount,
      coupon?.code || "",
      discountAmount,
      JSON.stringify(discountPlan.discounts),
      orderNote,
      JSON.stringify(userInfo),
      displayName,
      product.paymentMode
    )
  ];

  if (deliveryMode === "auto") {
    const cards = await reserveMallCards(env, product.id, orderId, quantity);
    if (cards.length < quantity) {
      throw new ApiError(409, "stock_not_enough", "可用卡密库存不足");
    }
    statements.push(...cards.map((card) => (
      env.DB.prepare("UPDATE mall_cards SET status = 'reserved', order_id = ? WHERE id = ? AND status IN ('unused', 'scheduled') AND order_id = '' AND (available_at IS NULL OR available_at <= CURRENT_TIMESTAMP)")
        .bind(orderId, card.id)
    )));
  } else if (deliveryMode === "manual") {
    statements.push(
      env.DB.prepare(
        `UPDATE mall_products
         SET manual_stock = manual_stock - ?,
             stock = CASE WHEN stock >= ? THEN stock - ? ELSE stock END,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ? AND manual_stock >= ?`
      ).bind(quantity, quantity, quantity, product.id, quantity)
    );
  }

  if (coupon) {
    statements.push(
      env.DB.prepare("UPDATE mall_coupons SET used_count = used_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND (limit_count <= 0 OR used_count < limit_count)")
        .bind(coupon.id)
    );
  }
  statements.push(...await reserveMallUserCouponsForOrder(env, orderId, discountPlan.userCoupons));

  const results = await env.DB.batch(statements);
  await assertMallOrderReservationResults(env, results, { orderId, product, deliveryMode, quantity, coupon, userCoupons: discountPlan.userCoupons });
  let order = await loadMallOrder(env, orderId);
  if (product.paymentMode === "test") {
    order = await completeTestPaymentOrder(env, order, user, product, ctx);
    return json({ order }, 201);
  }
  if (product.paymentMode === "credit" && finalAmount > 0) {
    return json({
      order,
      payment: buildCreditPaymentRequest(request, env, order, product)
    }, 201);
  }
  if (product.paymentMode === "credit" && finalAmount <= 0) {
    if (isAutoDeliverableProduct(product)) {
      order = await completeMallOrder(env, order, user, {
        ctx,
        note: "免单订单已自动完成"
      });
    } else {
      await env.DB.prepare(
        "UPDATE mall_orders SET status = 'processing', note = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
      ).bind("免单订单无需支付，等待管理员处理", order.id).run();
      await markMallOrderUserCouponsUsed(env, order);
      order = await loadMallOrder(env, order.id);
    }
  }
  return json({ order }, 201);
}

async function drawMallLottery(request, env, user) {
  await ensureMallRuntime(env);
  const body = await readJson(request);
  const productId = normalizeMallId(body.productId);
  if (!productId) {
    throw new ApiError(400, "invalid_product", "商品无效");
  }
  const product = await loadMallProduct(env, productId, { includeInactive: true });
  if (!product || product.status !== "active") {
    throw new ApiError(404, "product_not_found", "商品不存在或已下架");
  }
  return json({ lottery: await consumeMallLotteryDraw(env, user, product) });
}

async function getMallLotteryStatus(request, env, user) {
  await ensureMallRuntime(env);
  const productId = normalizeMallId(new URL(request.url).searchParams.get("productId"));
  if (!productId) {
    throw new ApiError(400, "invalid_product", "商品无效");
  }
  const product = await loadMallProduct(env, productId, { includeInactive: true });
  if (!product || product.status !== "active") {
    throw new ApiError(404, "product_not_found", "商品不存在或已下架");
  }
  const settings = await getMallSettings(env);
  const lucky = settings.luckyDraw || {};
  const lotteryScope = resolveLotteryScope(lucky, product);
  const existing = lucky.enabled === false ? null : await loadMallLotteryDraw(env, user, product, lucky, lotteryScope);
  return json({
    enabled: lucky.enabled !== false,
    drawDate: lotteryScope.drawDate,
    scope: lotteryScope.scope,
    cooldownMinutes: lotteryScope.cooldownMinutes,
    nextAvailableAt: existing ? calculateLotteryNextAvailableAt(existing, lotteryScope) : "",
    prizes: normalizePrizeList(lucky.prizes || []),
    lottery: existing ? {
      label: existing.prize_label || "今日已抽奖",
      value: normalizeLotteryValue(existing.prize_value),
      reused: true,
      drawDate: lotteryScope.drawDate,
      nextAvailableAt: calculateLotteryNextAvailableAt(existing, lotteryScope)
    } : null
  });
}

async function createMallFeedback(request, env, user) {
  const settings = await getMallSettings(env);
  await assertMallRateLimit(request, env, user, "feedback_create", {
    ...(settings.limits?.rateLimits?.feedbackCreate || DEFAULT_RATE_LIMITS.feedbackCreate),
    message: "反馈提交过于频繁，请稍后再试"
  });
  const body = await readJson(request);
  const { type, title, content } = await normalizeFeedbackPayload(body, { request, env, user, limits: settings.limits });
  const submit = body.action === "submit" || body.status === "pending";
  const status = submit ? "pending" : "draft";
  const id = crypto.randomUUID();
  const username = user.linuxdo?.username || user.username || "";
  await env.DB.prepare(
    `INSERT INTO mall_feedback (id, user_id, username, type, title, content, status, submitted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, user.id, username, type, title, content, status, submit ? new Date().toISOString() : null).run();
  await recordMallFeedbackLog(env, {
    feedbackId: id,
    actorId: user.id,
    actorName: username,
    actorRole: "user",
    action: submit ? "submit" : "create",
    note: submit ? "用户提交审核" : "用户保存草稿",
    before: null,
    after: { type, title, content, status }
  });
  return json({
    feedback: await loadMallFeedbackItem(env, id),
    feedbackList: await loadMallFeedback(env, { userId: user.id, limit: 80, includeDeleted: true }),
    ldcBalance: await getMallUserLdcBalance(env, user.id)
  }, 201);
}

async function handleMallFeedbackItemRoute(request, env, user) {
  const url = new URL(request.url);
  const feedbackId = decodeURIComponent(url.pathname.slice("/api/mall/feedback/".length).split("/")[0] || "");
  if (!isUuidLike(feedbackId)) {
    throw new ApiError(400, "invalid_feedback", "反馈记录无效");
  }
  const feedback = await loadMallFeedbackItem(env, feedbackId);
  if (!feedback || feedback.userId !== user.id || feedback.status === "deleted") {
    throw new ApiError(404, "feedback_not_found", "反馈不存在");
  }
  if (request.method === "PUT" || request.method === "PATCH") {
    if (feedback.status !== "draft") {
      throw new ApiError(409, "feedback_locked", "该反馈已提交或已审核，不能继续修改");
    }
    const body = await readJson(request);
    const settings = await getMallSettings(env);
    const next = await normalizeFeedbackPayload(body, { request, env, user, limits: settings.limits });
    const submit = body.action === "submit" || body.status === "pending";
    const nextStatus = submit ? "pending" : "draft";
    await env.DB.prepare(
      `UPDATE mall_feedback
       SET type = ?, title = ?, content = ?, status = ?, submitted_at = CASE WHEN ? THEN COALESCE(submitted_at, CURRENT_TIMESTAMP) ELSE submitted_at END, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ? AND status = 'draft'`
    ).bind(next.type, next.title, next.content, nextStatus, submit ? 1 : 0, feedbackId, user.id).run();
    await recordMallFeedbackLog(env, {
      feedbackId,
      actorId: user.id,
      actorName: user.linuxdo?.username || user.username || "",
      actorRole: "user",
      action: submit ? "submit" : "update",
      note: submit ? "用户提交审核" : "用户修改草稿",
      before: pickFeedbackLogSnapshot(feedback),
      after: { ...next, status: nextStatus }
    });
    return json({
      feedback: await loadMallFeedbackItem(env, feedbackId),
      feedbackList: await loadMallFeedback(env, { userId: user.id, limit: 80, includeDeleted: true }),
      ldcBalance: await getMallUserLdcBalance(env, user.id)
    });
  }
  if (request.method === "DELETE") {
    if (feedback.status !== "draft") {
      throw new ApiError(409, "feedback_locked", "该反馈已提交或已审核，不能删除");
    }
    await env.DB.prepare(
      `UPDATE mall_feedback
       SET status = 'deleted', updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ? AND status = 'draft'`
    ).bind(feedbackId, user.id).run();
    await recordMallFeedbackLog(env, {
      feedbackId,
      actorId: user.id,
      actorName: user.linuxdo?.username || user.username || "",
      actorRole: "user",
      action: "delete",
      note: "用户删除反馈",
      before: pickFeedbackLogSnapshot(feedback),
      after: { status: "deleted" }
    });
    return json({
      ok: true,
      feedback: await loadMallFeedbackItem(env, feedbackId),
      feedbackList: await loadMallFeedback(env, { userId: user.id, limit: 80, includeDeleted: true }),
      ldcBalance: await getMallUserLdcBalance(env, user.id)
    });
  }
  return json({ error: "not_found" }, 404);
}

async function normalizeFeedbackPayload(body, context = {}) {
  const limits = normalizeMallLimits(context.limits || DEFAULT_MALL_LIMITS);
  const type = normalizeChoice(body.type, ["bug", "question"], "bug");
  const title = normalizeText(body.title, limits.feedbackTitleMaxChars);
  const imageUrl = normalizeText(body.imageUrl, 600);
  let content = normalizeText(body.content, limits.feedbackContentMaxChars);
  content = normalizeSafeHtmlMarkdownInput(content);
  if (imageUrl) {
    const resolvedImageUrl = await resolveChatImageUrlWithContext(context, imageUrl);
    content = `${content}${content ? "\n\n" : ""}![图片](${resolvedImageUrl})`;
  }
  if (!title) {
    throw new ApiError(400, "feedback_title_required", "请填写反馈标题");
  }
  if (title.length < limits.feedbackTitleMinChars) {
    throw new ApiError(400, "feedback_title_too_short", `反馈标题至少 ${limits.feedbackTitleMinChars} 个字符`);
  }
  if (!content || content.length < limits.feedbackContentMinChars) {
    throw new ApiError(400, "feedback_content_required", `请补充更完整的问题描述，至少 ${limits.feedbackContentMinChars} 个字符`);
  }
  if (/<\/?[a-z][\s\S]*>/i.test(content) || /\b(?:javascript|vbscript|data):/i.test(content) || /\bon[a-z]+\s*=/i.test(content)) {
    throw new ApiError(400, "unsafe_feedback", "反馈内容不能包含 HTML、脚本或高风险链接");
  }
  const imageMatches = [...content.matchAll(/!\[([^\]]{0,80})]\(([^)]+)\)/g)];
  if (imageMatches.length > limits.feedbackMaxImages) {
    throw new ApiError(400, "too_many_images", `反馈最多允许添加 ${limits.feedbackMaxImages} 张图片`);
  }
  for (const match of imageMatches) {
    const alt = String(match[1] || "");
    const url = String(match[2] || "").trim();
    const resolvedUrl = await resolveChatImageUrlWithContext(context, url);
    if (resolvedUrl !== url) {
      content = content.replace(match[0], `![${alt}](${resolvedUrl})`);
    }
  }
  const links = content.matchAll(/\[[^\]]+]\(([^)]+)\)/g);
  for (const match of links) {
    const url = String(match[1] || "").trim();
    if (!/^https?:\/\//i.test(url) || /[\s<>]/.test(url)) {
      throw new ApiError(400, "unsafe_feedback", "Markdown 链接只允许 http/https 地址");
    }
  }
  return { type, title, content };
}

async function consumeMallLotteryDraw(env, user, product) {
  const settings = await getMallSettings(env);
  const lucky = settings.luckyDraw || {};
  if (lucky.enabled === false) {
    return { label: "抽奖已关闭", value: 1, reused: true };
  }
  const lotteryScope = resolveLotteryScope(lucky, product);
  const existing = await loadMallLotteryDraw(env, user, product, lucky, lotteryScope);
  if (existing) {
    return {
      label: existing.prize_label || "今日已抽奖",
      value: normalizeLotteryValue(existing.prize_value),
      reused: true,
      drawDate: lotteryScope.drawDate,
      nextAvailableAt: calculateLotteryNextAvailableAt(existing, lotteryScope)
    };
  }
  const prize = pickMallLotteryPrize(lucky.prizes || []);
  await env.DB.prepare(
    `INSERT INTO mall_lottery_draws (id, user_id, product_id, draw_date, scope_key, prize_label, prize_value)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    crypto.randomUUID(),
    user.id,
    product.id,
    lotteryScope.drawDate,
    lotteryScope.scopeKey,
    prize.label,
    prize.value
  ).run();
  return { ...prize, reused: false, drawDate: lotteryScope.drawDate, nextAvailableAt: calculateLotteryNextAvailableAt({ created_at: new Date().toISOString() }, lotteryScope) };
}

async function getMallLotteryDrawForOrder(env, user, product) {
  const settings = await getMallSettings(env);
  const lucky = settings.luckyDraw || {};
  if (lucky.enabled === false) {
    return { label: "抽奖已关闭", value: 1, reused: true };
  }
  const lotteryScope = resolveLotteryScope(lucky, product);
  const existing = await loadMallLotteryDraw(env, user, product, lucky, lotteryScope);
  if (!existing) {
    throw new ApiError(409, "lottery_required", lotteryScope.scope.includes("global") ? "请先在购买窗口手动抽取今日全站折扣" : "请先在购买窗口手动抽取本商品折扣");
  }
  return {
    label: existing.prize_label || "今日已抽奖",
    value: normalizeLotteryValue(existing.prize_value),
    reused: true,
    drawDate: lotteryScope.drawDate,
    nextAvailableAt: calculateLotteryNextAvailableAt(existing, lotteryScope)
  };
}

function resolveLotteryScope(lucky = {}, product = {}) {
  const scope = normalizeChoice(lucky.scope, LOTTERY_SCOPES, "product_daily");
  const cooldownMinutes = Math.max(0, Math.min(43200, Number.parseInt(lucky.cooldownMinutes || 0, 10) || 0));
  const drawDate = scope.endsWith("_daily") ? getBeijingDateKey() : new Date().toISOString();
  const productId = normalizeMallId(product.id) || "product";
  return {
    scope,
    cooldownMinutes,
    drawDate,
    scopeKey: scope.includes("global") ? `global:${scope}` : `product:${productId}:${scope}`
  };
}

async function loadMallLotteryDraw(env, user, product, lucky = {}, lotteryScope = resolveLotteryScope(lucky, product)) {
  if (lotteryScope.scope.endsWith("_daily")) {
    const scoped = await env.DB.prepare(
      `SELECT prize_label, prize_value, created_at
       FROM mall_lottery_draws
       WHERE user_id = ? AND scope_key = ? AND draw_date = ?
       ORDER BY created_at DESC
       LIMIT 1`
    ).bind(user.id, lotteryScope.scopeKey, lotteryScope.drawDate).first();
    if (scoped) return scoped;
    if (lotteryScope.scope === "product_daily") {
      return await env.DB.prepare(
        `SELECT prize_label, prize_value, created_at
         FROM mall_lottery_draws
         WHERE user_id = ? AND product_id = ? AND draw_date = ?
         ORDER BY created_at DESC
         LIMIT 1`
      ).bind(user.id, product.id, lotteryScope.drawDate).first();
    }
    return await env.DB.prepare(
      `SELECT prize_label, prize_value, created_at
       FROM mall_lottery_draws
       WHERE user_id = ? AND draw_date = ?
       ORDER BY created_at DESC
       LIMIT 1`
    ).bind(user.id, lotteryScope.drawDate).first();
  }
  const cutoff = new Date(Date.now() - lotteryScope.cooldownMinutes * 60 * 1000).toISOString();
  const scoped = await env.DB.prepare(
    `SELECT prize_label, prize_value, created_at
     FROM mall_lottery_draws
     WHERE user_id = ? AND scope_key = ? AND datetime(created_at) >= datetime(?)
     ORDER BY created_at DESC
     LIMIT 1`
  ).bind(user.id, lotteryScope.scopeKey, cutoff).first();
  if (scoped) return scoped;
  if (lotteryScope.scope === "global_cooldown") {
    return await env.DB.prepare(
      `SELECT prize_label, prize_value, created_at
       FROM mall_lottery_draws
       WHERE user_id = ? AND datetime(created_at) >= datetime(?)
       ORDER BY created_at DESC
       LIMIT 1`
    ).bind(user.id, cutoff).first();
  }
  return null;
}

function calculateLotteryNextAvailableAt(row, lotteryScope) {
  if (!row || lotteryScope.scope.endsWith("_daily") || lotteryScope.cooldownMinutes <= 0) {
    return "";
  }
  const createdAt = Date.parse(row.created_at || row.createdAt || "");
  if (!Number.isFinite(createdAt)) {
    return "";
  }
  return new Date(createdAt + lotteryScope.cooldownMinutes * 60 * 1000).toISOString();
}

function pickMallLotteryPrize(prizes) {
  const list = normalizePrizeList(prizes).filter((item) => item.weight > 0);
  if (!list.length) {
    return { label: "谢谢参与", value: 1, probability: 0 };
  }
  const total = list.reduce((sum, item) => sum + Number(item.weight || 0), 0);
  let roll = Math.random() * total;
  for (const item of list) {
    roll -= Number(item.weight || 0);
    if (roll <= 0) {
      return { label: item.label, value: item.value, probability: calculatePrizeProbability(item.weight, total) };
    }
  }
  const last = list[list.length - 1];
  return { label: last.label, value: last.value, probability: calculatePrizeProbability(last.weight, total) };
}

function calculatePrizeProbability(weight, total) {
  const percent = total > 0 ? (Number(weight || 0) / total) * 100 : 0;
  return Math.round(percent * 10000) / 10000;
}

function getBeijingDateKey(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

async function completeTestPaymentOrder(env, order, user, product = null, ctx = null) {
  if (!order) {
    throw new ApiError(404, "order_not_found", "订单不存在");
  }
  order = await expireMallOrderIfNeeded(env, order);
  if (order.status === "expired") {
    throw new ApiError(410, "order_expired", "订单已超过 5 分钟有效期，不能继续支付");
  }
  if (order.status === "completed") {
    return order;
  }
  const tradeNo = `TEST-${Date.now()}-${order.id.slice(0, 8)}`;
  await env.DB.prepare(
    `UPDATE mall_orders
     SET trade_no = ?, status = CASE WHEN status = 'pending' THEN 'processing' ELSE status END,
         note = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  ).bind(
    tradeNo,
    "测试支付已模拟成功，等待系统交付或管理员处理",
    order.id
  ).run();

  const nextOrder = await loadMallOrder(env, order.id);
  if (isAutoDeliverableProduct(product)) {
    return await completeMallOrder(env, nextOrder, user, {
      ctx,
      note: `测试支付自动完成，交易号 ${tradeNo}`
    });
  }

  await markMallOrderUserCouponsUsed(env, nextOrder);
  return nextOrder;
}

function buildCreditPaymentRequest(request, env, order, product) {
  const pid = String(env.CREDIT_EPAY_PID || "").trim();
  const secret = String(env.CREDIT_EPAY_KEY || "").trim();
  if (!pid || !secret) {
    throw new ApiError(500, "credit_not_configured", "官方积分站尚未配置");
  }
  const url = new URL(request.url);
  const notifyUrl = `${url.origin}/api/pay/credit/notify`;
  const returnUrl = `${url.origin}/api/pay/credit/return`;
  const payload = {
    pid,
    type: "epay",
    out_trade_no: order.id,
    name: normalizeText(product.name, 64),
    money: formatCreditAmount(order.finalAmount),
    notify_url: notifyUrl,
    return_url: returnUrl,
    sign_type: "MD5"
  };
  payload.sign = signCreditPayload(payload, secret);
  return {
    submitUrl: "https://credit.linux.do/epay/pay/submit.php",
    method: "POST",
    fields: payload
  };
}

async function buildMallOrderContinuePayment(request, env, order) {
  if (!order) {
    throw new ApiError(404, "order_not_found", "订单不存在");
  }
  if (order.status !== "pending") {
    throw new ApiError(400, "order_not_payable", "该订单当前状态不能继续支付");
  }
  if (isMallOrderExpired(order)) {
    const expired = await expireMallOrderIfNeeded(env, order);
    throw new ApiError(410, "order_expired", expired?.note || "订单已超过 5 分钟有效期，不能继续支付");
  }
  if (Number(order.finalAmount || 0) <= 0) {
    throw new ApiError(400, "free_order_not_payable", "免单订单无需继续支付");
  }
  const product = await loadMallProduct(env, order.productId, { includeInactive: true });
  if ((order.paymentMode || product?.paymentMode || "credit") !== "credit") {
    throw new ApiError(400, "payment_mode_not_supported", "该订单不支持继续支付");
  }
  return buildCreditPaymentRequest(request, env, order, product || {
    id: order.productId,
    name: order.productName,
    paymentMode: order.paymentMode || "credit"
  });
}

async function refundCreditPayment(env, order) {
  const pid = String(env.CREDIT_EPAY_PID || "").trim();
  const secret = String(env.CREDIT_EPAY_KEY || "").trim();
  if (!pid || !secret) {
    throw new ApiError(500, "credit_not_configured", "官方积分站尚未配置");
  }
  if (!order.tradeNo) {
    throw new ApiError(400, "missing_trade_no", "该订单缺少积分站交易号，无法原路退款");
  }
  if (Number(order.finalAmount || 0) <= 0) {
    return { skipped: true, message: "免单订单无需调用积分站退款" };
  }

  const payload = {
    act: "refund",
    pid,
    key: secret,
    trade_no: order.tradeNo,
    out_trade_no: order.id,
    money: formatCreditAmount(order.finalAmount)
  };
  const response = await fetch("https://credit.linux.do/epay/api.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: new URLSearchParams(payload)
  });
  const text = await response.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {
    data = { msg: text };
  }
  if (!response.ok || Number(data.code) !== 1) {
    const message = normalizeText(data.msg || data.message || text || "积分站退款失败", 300);
    throw new ApiError(502, "credit_refund_failed", message || "积分站退款失败");
  }
  return data;
}

function queuePushMeNotification(env, ctx, payload) {
  const task = sendPushMeNotification(env, payload).catch(() => {});
  if (ctx?.waitUntil) {
    ctx.waitUntil(task);
  }
}

function queueMallPurchasePushMe(env, ctx, order, product = null, payload = {}) {
  if (!order || order.status !== "completed") {
    return;
  }
  const task = (async () => {
    const settings = await getMallSettings(env).catch(() => MALL_DEFAULT_SETTINGS);
    const buyerName = normalizeText(order.username || payload.buyerName || "用户", 80);
    const deliveryContent = normalizeText(payload.deliveryContent || order.deliveryContent || "", 4000);
    await sendPushMeNotification(env, {
      event: "order",
      type: "html",
      title: `${buyerName}购买成功：${product?.name || order.productName || "商品"}`,
      buyerName,
      productName: product?.name || order.productName || "商品",
      productId: order.productId,
      quantity: order.quantity,
      amount: order.amount,
      finalAmount: order.finalAmount,
      amountLabel: formatMallMoneyText(order.finalAmount, settings),
      couponCode: order.couponCode || "",
      discountAmount: order.discountAmount || 0,
      discountLabel: formatMallMoneyText(order.discountAmount || 0, settings),
      orderId: order.id,
      status: order.status,
      note: payload.note || order.note || "购买成功",
      paymentMode: order.paymentMode || product?.paymentMode || "credit",
      deliveryMode: product?.deliveryMode || order.deliveryMode || "manual",
      deliveryContent,
      userInfo: order.userInfo || {},
      tradeNo: order.tradeNo || "",
      createdAt: order.completedAt || order.updatedAt || order.createdAt,
      completedAt: order.completedAt,
      pushResult: payload.pushResult || "购买成功，PushMe 已提交发送队列",
      to: "admin"
    });
  })().catch(() => {});
  if (ctx?.waitUntil) {
    ctx.waitUntil(task);
  }
}

function queueMallOrderEmail(env, ctx, userId, eventType, order, product, payload = {}) {
  const task = sendMallOrderEmail(env, userId, eventType, order, product, payload).catch(() => null);
  if (ctx?.waitUntil) {
    ctx.waitUntil(task);
  }
}

async function sendMallOrderEmail(env, userId, eventType, order, product, payload = {}) {
  const recipient = await loadUserEmailPreference(env, userId);
  if (!recipient?.enabled || !recipient.email) {
    return null;
  }
  const message = await buildMallOrderEmailMessage(env, recipient, eventType, order, product, payload);
  return await deliverMallEmail(env, message);
}

async function sendMallTestEmail(env, options = {}) {
  const recipientEmail = normalizeEmailAddress(options.to);
  if (!recipientEmail) {
    throw new ApiError(400, "invalid_email", "测试邮箱格式不正确");
  }
  const settings = await getMallSettings(env).catch(() => MALL_DEFAULT_SETTINGS);
  const siteName = settings.siteInfo?.title || "Linuxdo Mall";
  const now = formatBeijingDateTime(new Date().toISOString());
  const senderName = normalizeText(options.username || "管理员", 80);
  const subject = `${siteName} 测试邮件`;
  const text = [
    `您好 ${senderName}，这是一封来自 ${siteName} 的测试邮件。`,
    "",
    `发送场景：${options.scope === "admin" ? "后台邮箱配置测试" : "用户邮箱通知测试"}`,
    `收件邮箱：${recipientEmail}`,
    `发送时间：${now}`,
    "",
    "如果你收到这封邮件，说明当前邮箱发件功能已经可以正常调用。"
  ].join("\n");
  try {
    const result = await deliverMallEmail(env, {
      to: recipientEmail,
      subject,
      text,
      html: renderEmailHtml(subject, text, siteName)
    });
    if (result == null) {
      throw new ApiError(400, "email_not_configured", "邮箱发送服务尚未配置，请先在 Cloudflare Pages Secret 中配置 RESEND_API_KEY 和 RESEND_FROM");
    }
  } catch (error) {
    throw new ApiError(502, "email_send_failed", `测试邮件发送失败：${normalizeText(error?.message || "未知错误", 160)}`);
  }
  return { ok: true, email: recipientEmail };
}

async function loadUserEmailPreference(env, userId) {
  if (!userId) return null;
  await ensureAuthRuntime(env);
  const row = await env.DB.prepare(
    "SELECT username, notification_email, notify_email_enabled FROM users WHERE id = ?"
  ).bind(userId).first();
  if (!row) return null;
  const email = normalizeEmailAddress(row.notification_email);
  return {
    username: row.username || "",
    email,
    enabled: Boolean(row.notify_email_enabled) && Boolean(email)
  };
}

async function buildMallOrderEmailMessage(env, recipient, eventType, order, product, payload = {}) {
  const settings = await getMallSettings(env).catch(() => MALL_DEFAULT_SETTINGS);
  const templateEventType = ORDER_EMAIL_EVENT_TYPE_MAP[eventType] || "order_delivered";
  const template = await loadDefaultEmailTemplate(env, templateEventType).catch(() => null);
  const siteName = settings.siteInfo?.title || "Linuxdo Mall";
  const deliveryContent = normalizeText(payload.deliveryContent || order?.deliveryContent || "", 4000);
  const variables = {
    username: recipient.username || order?.username || "",
    order_id: order?.id || "",
    product_name: product?.name || order?.productName || "",
    delivery_note: deliveryContent || "暂无交付内容",
    site_name: siteName,
    order_time: formatBeijingDateTime(order?.createdAt),
    delivery_time: formatBeijingDateTime(order?.completedAt || new Date().toISOString()),
    order_status: getOrderStatusLabel(order?.status),
    payment_mode: getPaymentModeLabel(order?.paymentMode || product?.paymentMode),
    delivery_mode: getDeliveryModeLabel(product?.deliveryMode),
    amount: formatMallMoneyText(order?.finalAmount || 0, settings),
    note: normalizeText(payload.note || order?.note || "", 1000)
  };
  const fallbackSubject = eventType === "created"
    ? `订单已创建 - ${variables.product_name}`
    : `订单已完成交付 - ${variables.product_name}`;
  const fallbackContent = eventType === "created"
    ? [
        "您好 {username}，您的订单已创建。",
        "",
        "商品：{product_name}",
        "订单号：{order_id}",
        "实付：{amount}",
        "状态：{order_status}",
        "",
        "感谢使用 {site_name}。"
      ].join("\n")
    : [
        "您好 {username}，订单 {order_id} 已完成交付。",
        "",
        "商品：{product_name}",
        "交付内容：",
        "{delivery_note}",
        "",
        "感谢使用 {site_name}。"
      ].join("\n");
  const subject = applyEmailTemplateVariables(template?.subject || fallbackSubject, variables);
  const text = applyEmailTemplateVariables(template?.content || fallbackContent, variables);
  return {
    to: recipient.email,
    subject,
    text,
    html: renderEmailHtml(subject, text, siteName)
  };
}

async function loadDefaultEmailTemplate(env, eventType = "order_delivered") {
  const normalizedEventType = normalizeChoice(eventType, EMAIL_TEMPLATE_EVENT_TYPES, "order_delivered");
  let row = await env.DB.prepare(
    `SELECT id, event_type, name, subject, content, params_json, is_default, created_at, updated_at
     FROM mall_email_templates
     WHERE event_type = ?
     ORDER BY is_default DESC, updated_at DESC
     LIMIT 1`
  ).bind(normalizedEventType).first();
  if (!row) {
    row = await env.DB.prepare(
      `SELECT id, event_type, name, subject, content, params_json, is_default, created_at, updated_at
       FROM mall_email_templates
       ORDER BY is_default DESC, updated_at DESC
       LIMIT 1`
    ).first();
  }
  return row ? formatEmailTemplate(row) : null;
}

function applyEmailTemplateVariables(template, variables) {
  return normalizeText(template, 12000).replace(/\{([a-z][a-z0-9_]{1,39})\}/gi, (_match, key) => {
    const value = variables[String(key).toLowerCase()];
    return value == null ? "" : String(value);
  });
}

function renderEmailHtml(subject, text, siteName) {
  const body = escapePushHtml(text)
    .replace(/\r?\n/g, "<br>");
  return [
    "<!doctype html><html><body>",
    `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;max-width:680px;margin:0 auto;padding:24px;color:#111827;background:#ffffff;">`,
    `<div style="font-size:13px;font-weight:800;color:#2563eb;">${escapePushHtml(siteName)}</div>`,
    `<h1 style="font-size:22px;line-height:1.3;margin:10px 0 18px;">${escapePushHtml(subject)}</h1>`,
    `<div style="font-size:15px;line-height:1.7;padding:16px;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb;">${body}</div>`,
    `<p style="font-size:12px;color:#6b7280;margin-top:18px;">此邮件由 ${escapePushHtml(siteName)} 自动发送。</p>`,
    "</div></body></html>"
  ].join("");
}

async function deliverMallEmail(env, message) {
  if (!normalizeEmailAddress(message.to)) {
    return null;
  }
  const resendApiKey = normalizeText(env.RESEND_API_KEY || "", 300);
  const resendFrom = normalizeEmailFrom(env.RESEND_FROM || env.CF_EMAIL_FROM || message.from || "Linuxdo Mall <noreply@resend.dev>");
  if (resendApiKey && resendFrom) {
    return await deliverMallEmailWithResend(env, message, resendApiKey, resendFrom);
  }
  const emailBinding = env.EMAIL || env.SEND_EMAIL || env.MALL_EMAIL;
  if (emailBinding && typeof emailBinding.send === "function") {
    return await emailBinding.send({
      to: message.to,
      from: env.CF_EMAIL_FROM || message.from || "Linuxdo Mall <noreply@example.com>",
      subject: message.subject,
      text: message.text || "",
      html: message.html || renderEmailHtml(message.subject, message.text || "", "Linuxdo Mall")
    });
  }
  const accountId = normalizeText(env.CF_EMAIL_ACCOUNT_ID || "", 120);
  const apiToken = normalizeText(env.CF_EMAIL_API_TOKEN || "", 300);
  const from = normalizeEmailAddress(env.CF_EMAIL_FROM || "");
  if (!accountId || !apiToken || !from) {
    return null;
  }
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/email/sending/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: env.CF_EMAIL_FROM_NAME ? { address: from, name: env.CF_EMAIL_FROM_NAME } : from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html
    })
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    const cloudflareError = detail?.errors?.[0];
    const code = cloudflareError?.code ? `${cloudflareError.code}` : `${response.status}`;
    const message = cloudflareError?.message || response.statusText || "Cloudflare Email Service rejected the request";
    throw new Error(`email_${response.status}_${code}: ${message}`);
  }
  return await response.json().catch(() => ({ ok: true }));
}

async function deliverMallEmailWithResend(env, message, apiKey, from) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [message.to],
      subject: message.subject,
      text: message.text || "",
      html: message.html || renderEmailHtml(message.subject, message.text || "", "Linuxdo Mall")
    })
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    const code = detail?.name || detail?.error?.name || `${response.status}`;
    const messageText = detail?.message || detail?.error?.message || response.statusText || "Resend rejected the request";
    throw new Error(`resend_${response.status}_${code}: ${messageText}`);
  }
  return await response.json().catch(() => ({ ok: true }));
}

function createMimeEmail(message) {
  const from = envSafeHeader(message.from || "Linuxdo Mall <noreply@example.com>");
  const raw = [
    `From: ${from}`,
    `To: ${envSafeHeader(message.to)}`,
    `Subject: ${mimeHeader(message.subject)}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    message.html || `<pre>${escapePushHtml(message.text || "")}</pre>`
  ].join("\r\n");
  if (typeof EmailMessage === "function") {
    return new EmailMessage(from, message.to, raw);
  }
  const boundary = `mail_${randomHex(12)}`;
  return new Response([
    `From: ${from}`,
    `To: ${envSafeHeader(message.to)}`,
    `Subject: ${mimeHeader(message.subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    message.text,
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    message.html,
    `--${boundary}--`
  ].join("\r\n"), {
    headers: { "Content-Type": `multipart/alternative; boundary="${boundary}"` }
  });
}

function envSafeHeader(value) {
  return String(value || "").replace(/[\r\n]+/g, " ").slice(0, 300);
}

function mimeHeader(value) {
  const text = envSafeHeader(value || "Linuxdo Mall 通知");
  return `=?UTF-8?B?${base64(text)}?=`;
}

async function sendPushMeNotification(env, payload) {
  const settings = await getMallSettings(env).catch(() => MALL_DEFAULT_SETTINGS);
  const config = normalizePushMeConfig(env, settings, payload);
  if (!config.enabled || !config.pushKey) {
    return null;
  }
  const messageType = getPushMeMessageType(payload, config);
  const messageTitle = buildPushMeTitle(payload, config);
  const messageContent = buildPushMeContent(payload, messageType);
  const body = new URLSearchParams({
    push_key: config.pushKey,
    title: buildPushMeGroupedTitle(messageTitle),
    content: normalizeText(messageContent, messageType === "html" ? 12000 : 4000),
    type: messageType
  });
  const response = await fetch(config.serverUrl.replace(/\/+$/, ""), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`pushme_${response.status}`);
  }
  if (text && text.trim() !== "success") {
    throw new Error(normalizeText(text, 120) || "pushme_failed");
  }
  return text;
}

function getPushMeMessageType(payload = {}, config = {}) {
  if (payload.event === "order" || payload.event === "chat" || payload.type === "html") {
    return "html";
  }
  return normalizeChoice(payload.type || config.type, ["html", "markdown", "text"], "html");
}

function buildPushMeTitle(payload = {}, config = {}) {
  if (payload.event === "order") {
    const buyerName = normalizeText(payload.buyerName || payload.username || "用户", 40);
    const productName = normalizeText(payload.productName || "商品", 60);
    return `${buyerName}购买成功：${productName}`;
  }
  if (payload.event === "chat") {
    const senderName = normalizeText(payload.senderName || payload.username || "用户", 60);
    const messageKind = payload.orderId ? "订单" : "私聊";
    return `${senderName}发来${messageKind}消息`;
  }
  return normalizeText(payload.title || config.title || "Linuxdo Mall 通知", 120);
}

function buildPushMeGroupedTitle(title) {
  const groupToken = `[#${PUSHME_GROUP}]`;
  const text = normalizeText(title || "Linuxdo Mall 通知", Math.max(20, 120 - groupToken.length));
  return `${text}${groupToken}`;
}

function buildPushMeContent(payload = {}, messageType = "html") {
  if (messageType === "html" && payload.event === "order") {
    return buildPushMeOrderHtml(payload);
  }
  if (messageType === "html" && payload.event === "chat") {
    return buildPushMeChatHtml(payload);
  }
  return normalizeText(payload.content || "", messageType === "html" ? 12000 : 4000);
}

function buildPushMeOrderHtml(payload = {}) {
  const buyerName = normalizeText(payload.buyerName || "用户", 80);
  const productName = normalizeText(payload.productName || "商品", 120);
  const amountLabel = normalizeText(payload.amountLabel || formatMallMoneyText(payload.finalAmount), 80);
  const discountLabel = normalizeText(payload.discountLabel || formatMallMoneyText(payload.discountAmount), 80);
  const statusLabel = getOrderStatusLabel(payload.status);
  const paymentLabel = getPaymentModeLabel(payload.paymentMode);
  const deliveryLabel = getDeliveryModeLabel(payload.deliveryMode);
  const deliveryContent = normalizeText(payload.deliveryContent || "", 4000);
  const pushResult = normalizeText(payload.pushResult || "购买成功，PushMe 已提交发送队列", 200);
  const meta = [
    ["买家", buyerName],
    ["事件", "购买成功"],
    ["商品", productName],
    ["实付", amountLabel],
    ["订单号", payload.orderId || ""],
    ["推送结果", pushResult],
    ["支付", paymentLabel],
    ["交付", deliveryLabel],
    ["状态", statusLabel],
    ["时间", formatPushMeTime(payload.completedAt || payload.createdAt)]
  ];
  const bodyMarkdown = [
    "### 购买信息",
    `- 买家：${buyerName}`,
    `- 商品：${productName}`,
    `- 数量：${Number(payload.quantity || 1)}`,
    `- 实付：${amountLabel}`,
    `- 订单：${payload.orderId || "-"}`,
    payload.tradeNo ? `- 交易号：${payload.tradeNo}` : "",
    payload.note ? `- 备注：${normalizeText(payload.note, 500)}` : "",
    payload.couponCode ? `- 优惠券：${payload.couponCode}` : "",
    Number(payload.discountAmount || 0) > 0 ? `- 优惠：${discountLabel}` : "",
    "",
    deliveryContent
      ? ["### 已发送卡券 / 交付信息", "```text", deliveryContent, "```"].join("\n")
      : "### 已发送卡券 / 交付信息\n暂无交付内容，人工发货订单请在后台完成交付。",
    payload.userInfo && Object.keys(payload.userInfo).length
      ? [
          "",
          "### 用户信息",
          ...Object.entries(payload.userInfo)
            .slice(0, 8)
            .map(([key, value]) => `- ${normalizeText(key, 80)}：${normalizeText(value, 500)}`)
        ].join("\n")
      : ""
  ].filter(Boolean).join("\n\n");
  return buildPushMeShell({
    kind: "order",
    badge: "购买成功",
    title: `${buyerName} 购买成功`,
    summary: productName,
    meta,
    bodyTitle: "购买详情",
    bodyMarkdown,
    footerHint: `${amountLabel} · ${statusLabel} · ${paymentLabel} · ${deliveryLabel}`
  });
}

function buildPushMeChatHtml(payload = {}) {
  const senderName = normalizeText(payload.senderName || "用户", 80);
  const subject = normalizeText(payload.subject || "商城私聊", 140);
  const roleLabel = payload.senderRole === "admin" ? "管理员回复" : "买家消息";
  const messageKind = payload.orderId ? "订单" : "私聊";
  const orderMeta = payload.orderId
    ? [
        ["订单号", payload.orderId],
        ["下单时间", formatPushMeTime(payload.orderCreatedAt || payload.createdAt)]
      ]
    : [];
  const bodyMarkdown = payload.messageText || payload.content || "空消息";
  return buildPushMeShell({
    kind: "chat",
    badge: "私聊",
    title: `${senderName}发来${messageKind}消息`,
    summary: subject,
    showHeader: false,
    showSummary: false,
    showMeta: Boolean(payload.orderId),
    meta: orderMeta,
    bodyTitle: "消息正文",
    bodyMarkdown,
    footerHint: `${roleLabel}${subject ? ` · ${subject}` : ""}`
  });
}

function buildPushMeShell(options = {}) {
  const showHeader = options.showHeader !== false;
  const summary = normalizeText(options.summary || "", 300);
  const showSummary = options.showSummary !== false && Boolean(summary);
  const metaHtml = options.showMeta === false ? "" : renderPushMeMetaGrid(options.meta || []);
  const footerHint = normalizeText(options.footerHint || "", 120);
  return `
<section class="lm-push lm-${escapePushHtml(options.kind || "notice")}">
  <style>
    .lm-push{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;box-sizing:border-box;max-width:640px;margin:0 auto;padding:14px;border:1px solid #d8dee8;border-radius:16px;background:linear-gradient(180deg,#fff,#f7fafc);color:#0f172a;box-shadow:0 16px 40px rgba(15,23,42,.10)}
    .lm-push *{box-sizing:border-box}
    .lm-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}
    .lm-brand{font-weight:800;letter-spacing:.02em;font-size:14px}
    .lm-badge{display:inline-flex;align-items:center;padding:4px 10px;border-radius:999px;background:#0f172a;color:#fff;font-size:11px;font-weight:800}
    .lm-title{margin:0;font-size:19px;line-height:1.25}
    .lm-summary{margin:4px 0 0;color:#64748b;font-size:13px}
    .lm-card{margin-top:10px;padding:11px;border:1px solid #e5e7eb;border-radius:14px;background:#fff}
    .lm-meta-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
    .lm-meta-item{min-width:0;padding:8px 9px;border:1px solid #edf2f7;border-radius:10px;background:#f8fafc}
    .lm-meta-item span{display:block;color:#64748b;font-size:11px}
    .lm-meta-item strong{display:block;margin-top:4px;color:#0f172a;font-size:13px;word-break:break-word;line-height:1.35}
    .lm-body-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}
    .lm-body-head strong{font-size:13px}
    .lm-body-hint{color:#64748b;font-size:11px}
    .lm-md{font-size:13px;line-height:1.6;color:#0f172a;overflow-wrap:anywhere}
    .lm-md > :first-child{margin-top:0}
    .lm-md > :last-child{margin-bottom:0}
    .lm-md p{margin:0 0 8px}
    .lm-md h1,.lm-md h2,.lm-md h3,.lm-md h4,.lm-md h5,.lm-md h6{margin:10px 0 6px;line-height:1.3}
    .lm-md h1{font-size:18px}.lm-md h2{font-size:16px}.lm-md h3{font-size:15px}.lm-md h4{font-size:14px}.lm-md h5,.lm-md h6{font-size:13px}
    .lm-md strong{font-weight:800}
    .lm-md em{font-style:italic}
    .lm-md del{text-decoration:line-through;color:#64748b}
    .lm-md code{padding:1px 4px;border-radius:6px;background:#eef2ff;color:#312e81;font-size:12px}
    .lm-md pre{margin:0 0 8px;padding:10px;border-radius:12px;background:#0f172a;color:#e2e8f0;overflow:auto;font:12px/1.55 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
    .lm-md pre code{padding:0;background:transparent;color:inherit;font-size:inherit}
    .lm-md blockquote{margin:0 0 8px;padding:8px 10px;border-left:3px solid #93c5fd;background:#eff6ff;color:#1d4ed8;border-radius:10px}
    .lm-md ul,.lm-md ol{margin:0 0 8px 18px;padding:0}
    .lm-md li{margin:2px 0}
    .lm-md table{width:100%;border-collapse:collapse;margin:0 0 8px;font-size:12px}
    .lm-md th,.lm-md td{border:1px solid #e5e7eb;padding:6px 8px;text-align:left;vertical-align:top}
    .lm-md th{background:#f8fafc;font-weight:800}
    .lm-md hr{border:0;border-top:1px solid #e5e7eb;margin:10px 0}
    .lm-md img{display:block;max-width:100%;border-radius:10px;border:1px solid #e5e7eb;margin:6px 0}
    .lm-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px;color:#64748b;font-size:11px}
    .lm-toggle{border:0;border-radius:999px;background:#eff6ff;color:#1d4ed8;padding:6px 10px;font-size:11px;font-weight:800;cursor:pointer}
    .lm-collapsed .lm-body{display:none}
    @media (max-width:560px){
      .lm-push{padding:12px;border-radius:14px}
      .lm-meta-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
      .lm-title{font-size:18px}
      .lm-footer{flex-direction:column;align-items:flex-start}
    }
  </style>
  ${showHeader ? `<div class="lm-head">
    <span class="lm-brand">Linuxdo-Mall</span>
    <span class="lm-badge">${escapePushHtml(options.badge || "通知")}</span>
  </div>
  <h2 class="lm-title">${escapePushHtml(options.title || "商城通知")}</h2>` : ""}
  ${showSummary ? `<p class="lm-summary">${escapePushHtml(summary)}</p>` : ""}
  ${metaHtml ? `<div class="lm-card lm-meta">
    <div class="lm-meta-grid">
      ${metaHtml}
    </div>
  </div>` : ""}
  <div class="lm-card lm-body">
    <div class="lm-body-head">
      <strong>${escapePushHtml(options.bodyTitle || "正文")}</strong>
      ${footerHint ? `<span class="lm-body-hint">${escapePushHtml(footerHint)}</span>` : ""}
    </div>
    <div class="lm-md">${renderPushMeMarkdownHtml(options.bodyMarkdown || "")}</div>
  </div>
  <div class="lm-footer">
    <span>PushMe · Linuxdo-Mall</span>
  </div>
</section>`.trim();
}

function renderPushMeMetaGrid(items) {
  return items
    .filter(([label]) => normalizeText(label, 80))
    .slice(0, 6)
    .map(([label, value]) => pushMeMetaItem(label, value))
    .join("");
}

function pushMeMetaItem(label, value) {
  const text = normalizeText(value || "无", 800);
  return `<div class="lm-meta-item"><span>${escapePushHtml(label)}</span><strong>${escapePushHtml(text)}</strong></div>`;
}

function renderPushMeMarkdownHtml(value) {
  const source = normalizeText(value || "", 12000);
  if (!source) {
    return `<p class="lm-md-empty">暂无正文</p>`;
  }

  const codeBlocks = [];
  const fenced = source.replace(/(?:```|~~~)(?:([a-z0-9_-]+)\n)?([\s\S]*?)(?:```|~~~)/gi, (_match, language, code) => {
    const token = `__PUSHME_CODE_${codeBlocks.length}__`;
    const lang = normalizeText(language || "", 30);
    codeBlocks.push(`<pre><code${lang ? ` data-lang="${escapePushHtml(lang)}"` : ""}>${escapePushHtml(code.replace(/^\n/, "").replace(/\n$/, ""))}</code></pre>`);
    return token;
  });

  const lines = fenced.split(/\r?\n/);
  const blocks = [];
  let paragraph = [];
  let quote = [];
  let listType = "";
  let listItems = [];
  let tableHeader = null;
  let tableRows = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push(`<p>${paragraph.map((line) => renderPushMeInline(line)).join("<br>")}</p>`);
    paragraph = [];
  };

  const flushQuote = () => {
    if (!quote.length) return;
    blocks.push(`<blockquote>${quote.map((line) => renderPushMeInline(line)).join("<br>")}</blockquote>`);
    quote = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    const tag = listType === "ol" ? "ol" : "ul";
    const listClass = listType === "task" ? " class=\"task-list\"" : "";
    blocks.push(`<${tag}${listClass}>${listItems.map((item) => `<li>${item}</li>`).join("")}</${tag}>`);
    listItems = [];
    listType = "";
  };

  const flushTable = () => {
    if (!tableHeader) return;
    const header = `<tr>${tableHeader.map((cell) => `<th>${renderPushMeInline(cell)}</th>`).join("")}</tr>`;
    const body = tableRows.map((row) => `<tr>${row.map((cell) => `<td>${renderPushMeInline(cell)}</td>`).join("")}</tr>`).join("");
    blocks.push(`<table>${header}${body}</table>`);
    tableHeader = null;
    tableRows = [];
  };

  const flushAll = () => {
    flushParagraph();
    flushQuote();
    flushList();
    flushTable();
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      flushAll();
      continue;
    }

    const codeTokenMatch = trimmed.match(/^__PUSHME_CODE_(\d+)__$/);
    if (codeTokenMatch) {
      flushAll();
      blocks.push(codeBlocks[Number(codeTokenMatch[1])] || "");
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushAll();
      const level = headingMatch[1].length;
      blocks.push(`<h${level}>${renderPushMeInline(headingMatch[2])}</h${level}>`);
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      flushAll();
      blocks.push("<hr>");
      continue;
    }

    const quoteMatch = trimmed.match(/^>\s?(.*)$/);
    if (quoteMatch) {
      flushParagraph();
      flushList();
      flushTable();
      quote.push(quoteMatch[1]);
      continue;
    }
    flushQuote();

    const taskMatch = trimmed.match(/^[-*+]\s+\[( |x|X)\]\s+(.+)$/);
    const orderedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    const unorderedMatch = trimmed.match(/^[-*+]\s+(.+)$/);
    if (taskMatch || orderedMatch || unorderedMatch) {
      flushParagraph();
      flushQuote();
      flushTable();
      const nextType = taskMatch ? "task" : orderedMatch ? "ol" : "ul";
      if (listType && listType !== nextType) {
        flushList();
      }
      listType = nextType;
      const content = taskMatch ? taskMatch[2] : orderedMatch ? orderedMatch[1] : unorderedMatch[1];
      const itemHtml = taskMatch
        ? `<label class="task-item"><input type="checkbox" ${taskMatch[1].toLowerCase() === "x" ? "checked" : ""} disabled> ${renderPushMeInline(content)}</label>`
        : renderPushMeInline(content);
      listItems.push(itemHtml);
      continue;
    }
    flushList();

    const tableCandidate = trimmed.includes("|");
    const nextLine = lines[index + 1] ? lines[index + 1].trim() : "";
    const separatorLine = /^\|?[:\-\s|]+\|?$/.test(nextLine) && nextLine.includes("-");
    if (!tableHeader && tableCandidate && separatorLine) {
      flushAll();
      tableHeader = splitPushMeTableRow(trimmed);
      index += 1;
      continue;
    }
    if (tableHeader && tableCandidate) {
      tableRows.push(splitPushMeTableRow(trimmed));
      continue;
    }
    flushTable();

    paragraph.push(trimmed);
  }

  flushAll();
  return blocks.join("")
    .replace(/__PUSHME_CODE_(\d+)__/g, (_match, index) => codeBlocks[Number(index)] || "");
}

function renderPushMeInline(value) {
  let text = String(value ?? "");
  const tokens = [];
  const stash = (html) => {
    const token = `@@PUSHME_INLINE_${tokens.length}@@`;
    tokens.push(html);
    return token;
  };
  text = text.replace(/`([^`\n]+)`/g, (_match, code) => (
    stash(`<code>${escapePushHtml(code)}</code>`)
  ));
  text = text.replace(/!\[([^\]]{0,80})]\((https?:\/\/(?:[^)\s<]+\.)?bing\.com\/images\/search\?[^)\s<]+)\)/gi, (_match, alt) => (
    stash(`<span class="lm-link">${escapePushHtml(alt || "Bing 图片")}：发送后自动解析真实图片</span>`)
  ));
  text = text.replace(/!\[([^\]]{0,80})]\((https?:\/\/(?:th\.bing\.com|[^)\s<]+\.mm\.bing\.net)\/[^)\s<]+)\)/gi, (_match, alt, src) => {
    const safeSrc = normalizePushRenderedUrl(src, { image: true });
    return safeSrc ? stash(`<img src="${escapePushHtml(safeSrc)}" alt="${escapePushHtml(alt || "图片")}">`) : escapePushHtml(_match);
  });
  text = text.replace(/!\[([^\]]{0,80})]\((https?:\/\/[^)\s<]+?\.(?:png|jpe?g|gif|webp|avif)(?:[?#][^)\s<]*)?)\)/gi, (_match, alt, src) => {
    const safeSrc = normalizePushRenderedUrl(src, { image: true });
    return safeSrc ? stash(`<img src="${escapePushHtml(safeSrc)}" alt="${escapePushHtml(alt || "图片")}">`) : escapePushHtml(_match);
  });
  text = text.replace(/\[([^\]]+)]\((https?:\/\/[^)\s<]+)\)/gi, (_match, label, href) => {
    const safeHref = normalizePushRenderedUrl(href);
    return safeHref ? stash(`<a href="${escapePushHtml(safeHref)}" target="_blank" rel="noopener noreferrer">${escapePushHtml(label)}</a>`) : escapePushHtml(_match);
  });
  text = escapePushHtml(text);
  text = text
    .replace(/~~([^~\n]+)~~/g, "<del>$1</del>")
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
  text = text.replace(/@@PUSHME_INLINE_(\d+)@@/g, (_match, index) => tokens[Number(index)] || "");
  return text;
}

function normalizePushRenderedUrl(value, options = {}) {
  try {
    const parsed = parsePublicHttpUrl(value);
    if (parsed.protocol !== "https:") {
      return "";
    }
    if (options.image && !isDirectChatImageUrl(parsed)) {
      return "";
    }
    return parsed.toString();
  } catch {
    return "";
  }
}

function splitPushMeTableRow(row) {
  return row
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function buildPushMeUserInfoHtml(userInfo) {
  if (!userInfo || typeof userInfo !== "object" || Array.isArray(userInfo)) {
    return "";
  }
  const rows = Object.entries(userInfo)
    .filter(([, value]) => normalizeText(value, 500))
    .slice(0, 8)
    .map(([key, value]) => `- ${normalizeText(key, 80)}：${normalizeText(value, 500)}`);
  return rows.length ? `### 用户信息\n${rows.join("\n")}` : "";
}

function formatPushMeTime(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return new Date(date.getTime() + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").slice(0, 19);
}

function getOrderStatusLabel(status) {
  return {
    pending: "待支付",
    processing: "处理中",
    completed: "已完成",
    canceled: "已取消",
    expired: "已失效",
    refunded: "已退款"
  }[status] || normalizeText(status || "待处理", 40);
}

function getPaymentModeLabel(mode) {
  return {
    credit: "积分站支付",
    test: "测试支付"
  }[mode] || normalizeText(mode || "未设置", 40);
}

function getDeliveryModeLabel(mode) {
  return {
    auto: "自动发货",
    fixed_link: "固定链接发货",
    manual: "人工处理"
  }[mode] || normalizeText(mode || "人工处理", 40);
}

function escapePushHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizePushMeConfig(env, settings = {}, payload = {}) {
  const pushme = settings.pushme || {};
  const isAdminTarget = payload.to !== "user";
  const adminKey = normalizeText(pushme.pushKey || env.PUSHME_ADMIN_KEY || env.PUSHME_KEY || "", 300);
  const userKey = normalizeText(env.PUSHME_USER_KEY || "", 300);
  return {
    enabled: Boolean(env.PUSHME_ENABLED === "true" || env.PUSHME_ENABLED === "1" || pushme.enabled || adminKey || userKey),
    pushKey: isAdminTarget ? adminKey : userKey,
    serverUrl: normalizePushMeServerUrl(env.PUSHME_SERVER_URL || pushme.serverUrl || "https://push.i-i.me"),
    title: normalizeText(pushme.title || "Linuxdo Mall 通知", 120),
    type: normalizeChoice(env.PUSHME_TYPE || pushme.type, ["html", "markdown", "text"], "html")
  };
}

function normalizePushMeServerUrl(value) {
  try {
    const parsed = parsePublicHttpUrl(value || "https://push.i-i.me");
    if (parsed.protocol !== "https:") {
      return "https://push.i-i.me";
    }
    parsed.hash = "";
    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return "https://push.i-i.me";
  }
}

function isCreditPaidOrder(order, product = null) {
  if (order.paymentMode) {
    return order.paymentMode === "credit";
  }
  if (String(order.tradeNo || "").startsWith("TEST-")) {
    return false;
  }
  if (Number(order.finalAmount || 0) <= 0) {
    return false;
  }
  return (product?.paymentMode || "credit") === "credit";
}

function assertAdminProductPaymentModeAllowed(env, product) {
  if (product?.paymentMode === "test" && !isTestPaymentEnabled(env)) {
    throw new ApiError(403, "test_payment_disabled", "生产环境禁止发布测试支付商品，请先配置 ENABLE_TEST_PAYMENT=true");
  }
}

async function assertMallOrderReservationResults(env, results, { orderId, product, deliveryMode, quantity, coupon, userCoupons = [] }) {
  const offset = 1;
  let ok = true;
  let error = null;
  if (deliveryMode === "auto") {
    for (let index = 0; index < quantity; index += 1) {
      if (!d1ChangedExactly(results?.[offset + index], 1)) {
        ok = false;
        error = new ApiError(409, "stock_not_enough", "卡密库存已被其他订单占用，请重试");
        break;
      }
    }
  } else if (deliveryMode === "manual" && !d1ChangedExactly(results?.[offset], 1)) {
    ok = false;
    error = new ApiError(409, "stock_not_enough", "库存不足");
  }
  if (ok && coupon) {
    const couponIndex = deliveryMode === "auto" ? offset + quantity : deliveryMode === "manual" ? offset + 1 : offset;
    if (!d1ChangedExactly(results?.[couponIndex], 1)) {
      ok = false;
      error = new ApiError(409, "coupon_limit_reached", "优惠码已被使用完，请重新下单");
    }
  }
  if (ok && userCoupons.length) {
    const userCouponStartIndex = deliveryMode === "auto"
      ? offset + quantity + (coupon ? 1 : 0)
      : deliveryMode === "manual"
        ? offset + 1 + (coupon ? 1 : 0)
        : offset + (coupon ? 1 : 0);
    for (let index = 0; index < userCoupons.length; index += 1) {
      if (!d1ChangedExactly(results?.[userCouponStartIndex + index], 1)) {
        ok = false;
        error = new ApiError(409, "coupon_limit_reached", "自动优惠券已被占用或过期，请重新下单");
        break;
      }
    }
  }
  if (ok) {
    return;
  }
  await rollbackFailedMallOrderReservation(env, orderId, product, quantity, coupon, userCoupons, results).catch(() => null);
  throw error || new ApiError(409, "order_reservation_failed", "库存锁定失败，请重试");
}

async function rollbackFailedMallOrderReservation(env, orderId, product, quantity, coupon = null, userCoupons = [], results = []) {
  const statements = [
    env.DB.prepare("UPDATE mall_cards SET status = CASE WHEN available_at IS NOT NULL AND available_at > CURRENT_TIMESTAMP THEN 'scheduled' ELSE 'unused' END, order_id = '' WHERE order_id = ? AND status = 'reserved'")
      .bind(orderId),
    env.DB.prepare("DELETE FROM mall_orders WHERE id = ?")
      .bind(orderId)
  ];
  if (product?.deliveryMode === "manual" && d1ChangeCount(results?.[1]) === 1) {
    statements.unshift(
      env.DB.prepare("UPDATE mall_products SET manual_stock = manual_stock + ?, stock = stock + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
        .bind(quantity, quantity, product.id)
    );
  }
  const couponIndex = product?.deliveryMode === "auto" ? 1 + quantity : product?.deliveryMode === "manual" ? 2 : 1;
  if (coupon?.id && d1ChangeCount(results?.[couponIndex]) === 1) {
    statements.unshift(
      env.DB.prepare("UPDATE mall_coupons SET used_count = CASE WHEN used_count > 0 THEN used_count - 1 ELSE 0 END WHERE id = ?")
        .bind(coupon.id)
    );
  }
  const userCouponIds = userCoupons.map((item) => item.id).filter(isSafeRecordId);
  if (userCouponIds.length) {
    statements.unshift(...userCouponIds.map((id) => (
      env.DB.prepare(
        `UPDATE mall_user_coupons
         SET status = CASE WHEN expires_at IS NOT NULL AND datetime(expires_at) <= datetime('now') THEN 'expired' ELSE 'active' END,
             reserved_order_id = '', updated_at = CURRENT_TIMESTAMP
         WHERE id = ? AND reserved_order_id = ? AND status = 'reserved'`
      ).bind(id, orderId)
    )));
  }
  await env.DB.batch(statements);
}

function assertMallOrderCompletionResults(results, expectedStatements) {
  for (let index = 0; index < expectedStatements; index += 1) {
    if (!d1ChangedExactly(results?.[index], 1)) {
      throw new ApiError(409, "order_completion_conflict", "订单状态已变化，请刷新后重试");
    }
  }
}

function formatCreditAmount(value) {
  return Number(value || 0).toFixed(2);
}

function getMallCurrencySymbol(settings = MALL_DEFAULT_SETTINGS) {
  return normalizeText(settings?.siteInfo?.currencySymbol || "L", 24) || "L";
}

function formatMallMoneyText(value, settings = MALL_DEFAULT_SETTINGS) {
  return `${Number(value || 0).toLocaleString("zh-CN")} ${getMallCurrencySymbol(settings)}`;
}

function getMallCurrencyInfo(settings = MALL_DEFAULT_SETTINGS) {
  const siteInfo = settings?.siteInfo || {};
  return {
    mode: siteInfo.currencyMode === "image" ? "image" : "text",
    symbol: getMallCurrencySymbol(settings),
    imageUrl: normalizeCurrencyImageUrl(siteInfo.currencyImageUrl || "")
  };
}

function isTestPaymentEnabled(env) {
  return normalizeBoolean(env.ENABLE_TEST_PAYMENT || env.MALL_ENABLE_TEST_PAYMENT, false);
}

function signCreditPayload(payload, secret) {
  const entries = Object.entries(payload)
    .filter(([key, value]) => key !== "sign" && key !== "sign_type" && value !== undefined && value !== null && String(value) !== "")
    .sort(([left], [right]) => left.localeCompare(right, "en", { sensitivity: "variant" }));
  const base = entries.map(([key, value]) => `${key}=${value}`).join("&");
  return md5Hex(`${base}${secret}`);
}

function assertMallUserInfo(product, userInfo) {
  if (!product?.requiresUserInfo) {
    return;
  }
  const fields = product.userInfoFields?.length
    ? product.userInfoFields
    : [{ name: "contact", label: "接收账号 / 备注", required: true }];
  for (const field of fields) {
    if (field.required && !normalizeText(userInfo[field.name], 500)) {
      throw new ApiError(400, "missing_user_info", `请填写${field.label || field.name}`);
    }
  }
}

async function handleMallOrderRoute(request, env, user) {
  const path = new URL(request.url).pathname;
  const parts = path.slice("/api/mall/orders/".length).split("/").filter(Boolean);
  const orderId = parts[0] || "";
  const action = parts[1] || "";

  if (!isUuidLike(orderId)) {
    throw new ApiError(400, "invalid_order", "订单无效");
  }

  if (request.method === "GET" && !action) {
    const order = await expireMallOrderIfNeeded(env, await loadMallOrder(env, orderId));
    assertMallOrderOwner(order, user);
    return json({ order });
  }

  if (request.method === "PATCH" && !action) {
    const body = await readJson(request);
    const order = await expireMallOrderIfNeeded(env, await loadMallOrder(env, orderId));
    assertMallOrderOwner(order, user);
    if (body.action === "cancel") {
      return await cancelMallOrder(env, order, user);
    }
    if (body.action === "archive" || body.action === "unarchive") {
      const archived = body.action === "archive" ? 1 : 0;
      await env.DB.prepare("UPDATE mall_orders SET archived = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
        .bind(archived, order.id)
        .run();
      return json({ order: await loadMallOrder(env, order.id) });
    }
    if (body.action === "submit_info") {
      const userInfo = normalizeUserInfo(body.userInfo);
      await env.DB.prepare("UPDATE mall_orders SET user_info_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
        .bind(JSON.stringify(userInfo), order.id)
        .run();
      return json({ order: await loadMallOrder(env, order.id) });
    }
    throw new ApiError(400, "invalid_action", "不支持的订单操作");
  }

  if (request.method === "DELETE" && !action) {
    const order = await expireMallOrderIfNeeded(env, await loadMallOrder(env, orderId));
    assertMallOrderOwner(order, user);
    if (order.status === "completed" || order.status === "refunded") {
      throw new ApiError(400, "order_delete_locked", "已完成或已退款订单不能删除");
    }
    if (order.status === "processing") {
      await env.DB.prepare("UPDATE mall_orders SET archived = 1, note = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?")
        .bind(normalizeText(order.note || "用户已隐藏处理中订单", 1000), order.id, user.id)
        .run();
      return json({ ok: true, archived: true });
    }
    const prepared = await prepareMallOrderForDeletion(env, order);
    if (!prepared) {
      throw new ApiError(409, "order_state_changed", "订单状态已变化，请刷新后重试");
    }
    await env.DB.prepare("DELETE FROM mall_orders WHERE id = ? AND status IN ('canceled', 'expired')").bind(order.id).run();
    return json({ ok: true });
  }

  if (request.method === "POST" && action === "pay") {
    const order = await expireMallOrderIfNeeded(env, await loadMallOrder(env, orderId));
    assertMallOrderOwner(order, user);
    const payment = await buildMallOrderContinuePayment(request, env, order);
    return json({ order, payment });
  }

  if (request.method === "POST" && action === "dispute") {
    const order = await loadMallOrder(env, orderId);
    assertMallOrderOwner(order, user);
    if (order.status !== "completed") {
      throw new ApiError(400, "dispute_not_allowed", "只有已完成订单可以发起争议退款");
    }
    const body = await readJson(request).catch(() => ({}));
    const settings = await getMallSettings(env).catch(() => MALL_DEFAULT_SETTINGS);
    const reason = normalizeText(body.reason || "申请争议退款", 800);
    const conversation = await getOrCreateMallConversation(env, user, {
      orderId: order.id,
      subject: `争议退款：${order.productName}`
    });
    const message = await createMallChatMessage(env, conversation, user, {
      content: [
        "### 争议退款申请",
        `订单：${order.id}`,
        `商品：${order.productName}`,
        `金额：${formatMallMoneyText(order.finalAmount, settings)}`,
        "",
        reason
      ].join("\n")
    }, "user", { request });
    return json({
      order,
      conversation: await loadMallChatConversation(env, conversation.id),
      message
    }, 201);
  }

  if (request.method === "POST" && action === "rating") {
    const order = await loadMallOrder(env, orderId);
    assertMallOrderOwner(order, user);
    if (order.status !== "completed" || order.rated) {
      throw new ApiError(400, "rating_not_allowed", "该订单暂不能评价");
    }
    const body = await readJson(request);
    const rating = Math.max(1, Math.min(5, Number.parseInt(body.rating || 5, 10) || 5));
    const comment = normalizeText(body.comment, 300);
    const ratingId = crypto.randomUUID();
    const username = user.linuxdo?.username || user.username;
    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO mall_ratings (id, order_id, product_id, user_id, username, rating, comment)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(ratingId, order.id, order.productId, user.id, username, rating, comment),
      env.DB.prepare("UPDATE mall_orders SET rated = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
        .bind(order.id)
    ]);
    return json({ rating: (await loadMallRatings(env, order.productId, 1))[0] });
  }

  return json({ error: "not_found" }, 404);
}

async function validateMallCoupon(request, env) {
  await ensureMallRuntime(env);
  const url = new URL(request.url);
  const code = normalizeCouponCode(url.searchParams.get("code"));
  const productId = normalizeMallId(url.searchParams.get("productId"));
  const amount = Math.max(0, Number.parseInt(url.searchParams.get("amount") || "0", 10) || 0);
  if (!code || !productId) {
    throw new ApiError(400, "invalid_coupon", "请输入有效优惠码");
  }

  const coupon = await getValidMallCoupon(env, code, productId, amount);
  if (!coupon) {
    throw new ApiError(404, "coupon_not_found", "优惠码不可用");
  }
  return json({ coupon });
}

async function handleMallChatRoute(request, env, user, ctx = null) {
  await ensureChatRuntime(env);
  const url = new URL(request.url);
  const path = url.pathname;
  const isAdmin = isSuperAdminUser(user);

  if (path === "/api/mall/chat" && request.method === "GET") {
    if (isAdmin && url.searchParams.get("scope") === "admin") {
      return json({ conversations: await loadMallChatConversations(env, { admin: true }) });
    }
    return json({ conversations: await loadMallChatConversations(env, { userId: user.id }) });
  }

  if (path === "/api/mall/chat" && request.method === "POST") {
    const body = await readJson(request);
    const conversation = await getOrCreateMallConversation(env, user, body);
    return json({ conversation }, 201);
  }

  const parts = path.slice("/api/mall/chat/".length).split("/").filter(Boolean);
  const conversationId = parts[0] || "";
  const action = parts[1] || "";
  if (!isUuidLike(conversationId)) {
    throw new ApiError(400, "invalid_conversation", "会话无效");
  }

  const conversation = await loadMallChatConversation(env, conversationId);
  assertMallChatAccess(conversation, user);

  if (request.method === "GET" && action === "messages") {
    const afterId = Math.max(0, Number.parseInt(url.searchParams.get("afterId") || "0", 10) || 0);
    const messages = await loadMallChatMessages(env, conversation.id, afterId);
    await markMallChatRead(env, conversation.id, isAdmin ? "admin" : "user");
    return json({ conversation: await loadMallChatConversation(env, conversation.id), messages });
  }

  if (request.method === "POST" && action === "messages") {
    const body = await readJson(request);
    const message = await createMallChatMessage(env, conversation, user, body, isAdmin ? "admin" : "user", { request });
    await markMallChatRead(env, conversation.id, isAdmin ? "admin" : "user");
    const nextConversation = await loadMallChatConversation(env, conversation.id);
    const chatOrder = nextConversation.orderId ? await loadMallOrder(env, nextConversation.orderId) : null;
    queuePushMeNotification(env, ctx, {
      event: "chat",
      type: "html",
      title: `${message?.senderName || (isAdmin ? "管理员" : "买家")}（私聊）`,
      senderName: message?.senderName || (isAdmin ? "管理员" : "买家"),
      senderRole: message?.senderRole || (isAdmin ? "admin" : "user"),
      conversationId: nextConversation.id,
      subject: nextConversation.subject,
      orderId: nextConversation.orderId,
      orderCreatedAt: chatOrder?.createdAt || "",
      messageText: message?.content || "",
      createdAt: message?.createdAt || nextConversation.updatedAt,
      content: [
        `### ${isAdmin ? "管理员回复私聊" : "新的买家私聊"}`,
        `- 会话：${nextConversation.subject}`,
        `- 发送人：${message?.senderName || (isAdmin ? "管理员" : "买家")}`,
        `- 内容：${message?.content || ""}`
      ].join("\n"),
      to: isAdmin ? "user" : "admin",
      conversation: nextConversation
    });
    return json({ message, conversation: nextConversation }, 201);
  }

  if (request.method === "PATCH" && !action) {
    const body = await readJson(request);
    if (body.action === "close" || body.action === "reopen") {
      if (!isAdmin) {
        throw new ApiError(403, "admin_forbidden", "需要管理员权限");
      }
      const nextStatus = body.action === "reopen" ? "open" : "closed";
      await env.DB.prepare(
        "UPDATE mall_conversations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
      ).bind(nextStatus, conversation.id).run();
      const updated = await loadMallChatConversation(env, conversation.id);
      await recordMallAdminAudit(request, env, user, {
        action: body.action === "reopen" ? "chat_reopen" : "chat_close",
        targetType: "conversation",
        targetId: conversation.id,
        summary: `${body.action === "reopen" ? "重新开启" : "关闭"}私聊会话：${conversation.subject}`,
        before: conversation,
        after: updated
      });
      return json({ conversation: updated });
    }
    if (body.action === "read") {
      await markMallChatRead(env, conversation.id, isAdmin ? "admin" : "user");
      return json({ conversation: await loadMallChatConversation(env, conversation.id) });
    }
    throw new ApiError(400, "invalid_action", "不支持的会话操作");
  }

  if (request.method === "DELETE" && !action) {
    if (!isAdmin) {
      throw new ApiError(403, "admin_forbidden", "需要管理员权限");
    }
    await env.DB.batch([
      env.DB.prepare("DELETE FROM mall_messages WHERE conversation_id = ?").bind(conversation.id),
      env.DB.prepare("DELETE FROM mall_conversations WHERE id = ?").bind(conversation.id)
    ]);
    await recordMallAdminAudit(request, env, user, {
      action: "chat_delete",
      targetType: "conversation",
      targetId: conversation.id,
      summary: `删除私聊会话：${conversation.subject}`,
      before: conversation,
      after: { deleted: true }
    });
    return json({ ok: true, deletedId: conversation.id });
  }

  return json({ error: "not_found" }, 404);
}

async function getMallAdminOverview(request, env, admin) {
  const warnings = [];
  const listLimit = getAdminListLimitFromRequest(request);
  await safeAdminOverviewValue("schema", () => ensureMallSeed(env), null, warnings);
  await safeAdminOverviewValue("expireOrders", () => expirePendingMallOrders(env), null, warnings);
  const emptyCount = { results: [{ count: 0 }] };
  const counts = await safeAdminOverviewValue("counts", () => env.DB.batch([
    env.DB.prepare("SELECT COUNT(*) AS count FROM users"),
    env.DB.prepare("SELECT COUNT(*) AS count FROM mall_products WHERE status != 'deleted'"),
    env.DB.prepare("SELECT COUNT(*) AS count FROM mall_orders"),
    env.DB.prepare("SELECT COALESCE(SUM(final_amount), 0) AS count FROM mall_orders WHERE status = 'completed'"),
    env.DB.prepare("SELECT COUNT(*) AS count FROM mall_cards WHERE status = 'unused'"),
    env.DB.prepare("SELECT COUNT(*) AS count FROM mall_coupons WHERE status = 'active'"),
    env.DB.prepare("SELECT COUNT(*) AS count FROM mall_ratings")
  ]), Array.from({ length: 7 }, () => emptyCount), warnings);
  const orders = await safeAdminOverviewValue("orders", () => loadMallAdminOrders(env, listLimit), [], warnings);
  const products = await safeAdminOverviewValue("products", () => loadMallProducts(env, { includeDeleted: true }), [], warnings);
  const users = await safeAdminOverviewValue("users", () => loadMallUsers(env, listLimit), [], warnings);
  const cards = await safeAdminOverviewValue("cards", () => loadMallCards(env, listLimit), [], warnings);
  const coupons = await safeAdminOverviewValue("coupons", () => loadMallCoupons(env, listLimit), [], warnings);
  const ratings = await safeAdminOverviewValue("ratings", () => loadMallAdminRatings(env, listLimit), [], warnings);
  const ads = await safeAdminOverviewValue("ads", () => loadMallAds(env, { includeInactive: true }), [], warnings);
  const settings = await safeAdminOverviewValue("settings", () => getMallSettings(env), MALL_DEFAULT_SETTINGS, warnings);
  const blacklist = await safeAdminOverviewValue("blacklist", () => loadMallBlacklist(env, listLimit), [], warnings);
  const emailTemplates = await safeAdminOverviewValue("emailTemplates", () => loadMallEmailTemplates(env, listLimit), [], warnings);
  const loginAttempts = await safeAdminOverviewValue("loginAttempts", () => loadMallLoginAttempts(env, listLimit), [], warnings);
  await safeAdminOverviewValue("autoBackup", () => maybeRunDueMallBackup(env, settings), null, warnings);
  const backupRecords = await safeAdminOverviewValue("backupRecords", () => loadMallBackupRecords(env, listLimit), [], warnings);
  const chatConversations = await safeAdminOverviewValue("chatConversations", () => loadMallChatConversations(env, { admin: true, limit: listLimit }), [], warnings);
  const feedback = await safeAdminOverviewValue("feedback", () => loadMallFeedback(env, { admin: true, includeDeleted: true, limit: listLimit }), [], warnings);
  const feedbackLogs = await safeAdminOverviewValue("feedbackLogs", () => loadMallFeedbackLogs(env, { limit: listLimit }), [], warnings);
  const ldcLedger = await safeAdminOverviewValue("ldcLedger", () => loadMallLdcLedger(env, listLimit), [], warnings);
  const refunds = await safeAdminOverviewValue("refunds", () => loadMallRefunds(env, listLimit), [], warnings);
  const auditLogs = await safeAdminOverviewValue("auditLogs", () => loadMallAdminAuditLogs(env, listLimit), [], warnings);
  const orderStatusRows = await safeAdminOverviewValue("orderStatusRows", () => env.DB.prepare("SELECT status, COUNT(*) AS count FROM mall_orders GROUP BY status").all(), { results: [] }, warnings);
  const productStatusRows = await safeAdminOverviewValue("productStatusRows", () => env.DB.prepare(
    `SELECT
       CASE
         WHEN status = 'deleted' THEN 'deleted'
         WHEN status = 'inactive' THEN 'inactive'
         WHEN COALESCE(stock, 0) <= 0 THEN 'soldout'
         ELSE 'active'
       END AS status,
       COUNT(*) AS count
     FROM mall_products
     GROUP BY 1`
  ).all(), { results: [] }, warnings);
  const cardStatusRows = await safeAdminOverviewValue("cardStatusRows", () => env.DB.prepare("SELECT status, COUNT(*) AS count FROM mall_cards GROUP BY status").all(), { results: [] }, warnings);
  const productRevenueRows = await safeAdminOverviewValue("productRevenueRows", () => env.DB.prepare(
    `SELECT product_id, product_name,
            COUNT(*) AS order_count,
            COALESCE(SUM(quantity), 0) AS quantity,
            COALESCE(SUM(final_amount), 0) AS amount
     FROM mall_orders
     WHERE status = 'completed'
     GROUP BY product_id, product_name
     ORDER BY amount DESC, order_count DESC
     LIMIT 12`
  ).all(), { results: [] }, warnings);
  const chatStats = await safeAdminOverviewValue("chatStats", () => env.DB.prepare(
    `SELECT
       COUNT(*) AS conversations,
       COALESCE(SUM(CASE WHEN status != 'closed' THEN 1 ELSE 0 END), 0) AS open_chats,
       COALESCE(SUM(CASE WHEN unread_admin > 0 THEN 1 ELSE 0 END), 0) AS unread_chats
     FROM mall_conversations`
  ).first(), {}, warnings);
  const feedbackStatusRows = await safeAdminOverviewValue("feedbackStatusRows", () => env.DB.prepare("SELECT status, COUNT(*) AS count FROM mall_feedback GROUP BY status").all(), { results: [] }, warnings);
  const ldcStats = await safeAdminOverviewValue("ldcStats", () => env.DB.prepare("SELECT COALESCE(SUM(amount), 0) AS total FROM mall_ldc_ledger").first(), {}, warnings);

  return json({
    admin: {
      id: admin.id,
      username: admin.linuxdo?.username || admin.username,
      linuxdoId: admin.linuxdo?.id || null
    },
    stats: {
      users: countFromResult(counts[0]),
      products: countFromResult(counts[1]),
      orders: countFromResult(counts[2]),
      revenue: countFromResult(counts[3]),
      cards: countFromResult(counts[4]),
      coupons: countFromResult(counts[5]),
      ratings: countFromResult(counts[6]),
      orderStatusCounts: countMapFromRows(orderStatusRows),
      productStatusCounts: countMapFromRows(productStatusRows),
      cardStatusCounts: countMapFromRows(cardStatusRows),
      conversations: Number(chatStats?.conversations || 0),
      openChats: Number(chatStats?.open_chats || 0),
      unreadChats: Number(chatStats?.unread_chats || 0),
      feedbackStatusCounts: countMapFromRows(feedbackStatusRows),
      ldcIssued: Number(ldcStats?.total || 0),
      productRevenue: productRevenueFromRows(productRevenueRows)
    },
    products,
    recentOrders: orders,
    users,
    cards,
    coupons,
    ratings,
    ads,
    blacklist,
    emailTemplates,
    loginAttempts,
    backupRecords,
    chatConversations,
    feedback,
    feedbackLogs,
    ldcLedger,
    refunds,
    auditLogs,
    dataLimits: {
      listLimit,
      maxListLimit: ADMIN_MAX_LIST_LIMIT
    },
    warnings,
    settings: sanitizeAdminSettings(settings, env)
  });
}

async function safeAdminOverviewValue(label, loader, fallback, warnings) {
  try {
    return await loader();
  } catch (error) {
    const message = error instanceof ApiError
      ? error.message
      : normalizeText(error?.message || "后台模块读取失败", 180);
    warnings.push({ label, message });
    return fallback;
  }
}

function getAdminListLimitFromRequest(request, fallback = ADMIN_MAX_LIST_LIMIT) {
  const url = new URL(request.url);
  return normalizeAdminListLimit(url.searchParams.get("limit") || url.searchParams.get("pageSize"), fallback);
}

function normalizeAdminListLimit(value, fallback = ADMIN_MAX_LIST_LIMIT) {
  const raw = String(value ?? "").trim().toLowerCase();
  if (raw === "all" || raw === "全部") {
    return ADMIN_MAX_LIST_LIMIT;
  }
  return clampInteger(raw || fallback, fallback, 1, ADMIN_MAX_LIST_LIMIT);
}

async function handleMallAdminRoute(request, env, admin, ctx = null) {
  const url = new URL(request.url);
  const rest = url.pathname.slice("/api/mall/admin/".length);
  const [resource, id, subAction] = rest.split("/").filter(Boolean);
  await ensureMallSeed(env);

  if (resource === "overview" && request.method === "GET") {
    return await getMallAdminOverview(request, env, admin);
  }
  if (resource === "products") {
    return await handleMallAdminProducts(request, env, admin, id);
  }
  if (resource === "orders") {
    return await handleMallAdminOrders(request, env, admin, id, subAction, ctx);
  }
  if (resource === "cards") {
    return await handleMallAdminCards(request, env, admin, id);
  }
  if (resource === "coupons" && id === "batch") {
    return await handleMallAdminCouponBatch(request, env, admin);
  }
  if (resource === "coupons") {
    return await handleMallAdminCoupons(request, env, admin, id);
  }
  if (resource === "ratings") {
    return await handleMallAdminRatings(request, env, admin, id);
  }
  if (resource === "ads") {
    return await handleMallAdminAds(request, env, admin, id);
  }
  if (resource === "feedback") {
    return await handleMallAdminFeedback(request, env, admin, id, subAction);
  }
  if (resource === "settings") {
    return await handleMallAdminSettings(request, env, admin);
  }
  if (resource === "email-test") {
    return await handleMallAdminEmailTest(request, env, admin);
  }
  if (resource === "image-proxy") {
    return await handleMallAdminImageProxy(request, env, admin);
  }
  if (resource === "users") {
    return await handleMallAdminUsers(request, env, admin);
  }
  if (resource === "blacklist") {
    return await handleMallAdminBlacklist(request, env, admin, id);
  }
  if (resource === "email-templates") {
    return await handleMallAdminEmailTemplates(request, env, admin, id);
  }
  if (resource === "login-attempts") {
    return await handleMallAdminLoginAttempts(request, env, admin);
  }
  if (resource === "backup") {
    return await handleMallAdminBackup(request, env, admin, id, subAction);
  }
  if (resource === "minesweeper") {
    return await handleMallAdminMinesweeper(request, env, admin, id);
  }

  return json({ error: "not_found" }, 404);
}

function sanitizeAdminSettings(settings, env) {
  const result = JSON.parse(JSON.stringify(settings || {}));
  result.pushme = result.pushme || {};
  result.pushme.secretConfigured = Boolean(env.PUSHME_ADMIN_KEY || env.PUSHME_KEY || env.PUSHME_USER_KEY);
  if (!result.pushme.pushKey && result.pushme.secretConfigured) {
    result.pushme.secretHint = "已在 Cloudflare Secret 配置";
  }
  const resendConfigured = Boolean(normalizeText(env.RESEND_API_KEY || "", 300));
  result.emailService = {
    provider: resendConfigured ? "resend" : "unconfigured",
    resendConfigured,
    resendFromConfigured: Boolean(normalizeEmailFrom(env.RESEND_FROM || env.CF_EMAIL_FROM || "")),
    resendFrom: normalizeEmailFrom(env.RESEND_FROM || env.CF_EMAIL_FROM || "")
  };
  result.limits = normalizeMallLimits(result.limits || {});
  return result;
}

async function handleMallAdminProducts(request, env, admin, productId) {
  if (request.method === "GET") {
    return json({ products: await loadMallProducts(env, { includeDeleted: true }) });
  }

  if (request.method === "PATCH" && !productId) {
    const body = await readJson(request);
    const ids = normalizeIds(body.ids || body.productIds).filter(isSafeRecordId);
    const status = normalizeChoice(body.status, ["active", "inactive", "deleted"], "");
    if (!ids.length || !status) {
      throw new ApiError(400, "invalid_product_batch", "请选择商品并指定状态");
    }
    const beforeProducts = (await loadMallProducts(env, { includeDeleted: true }))
      .filter((item) => ids.includes(item.id));
    const updatedCount = await updateD1RowsByIds(env, "mall_products", "id", ids, "status = ?, updated_at = CURRENT_TIMESTAMP", [status]);
    await recordMallAdminAudit(request, env, admin, {
      action: "products_batch_status",
      targetType: "product",
      targetId: ids.join(",").slice(0, 160),
      summary: `批量修改 ${ids.length} 个商品状态为 ${status}`,
      before: summarizeAuditItems(beforeProducts, (item) => ({ id: item.id, name: item.name, status: item.status })),
      after: summarizeBatchMutation(ids, { status, updated: updatedCount })
    });
    return json({ ok: true, updated: updatedCount });
  }

  if (request.method === "POST" && !productId) {
    const body = await readJson(request);
    if (!body.id) {
      body.id = await getNextMallProductId(env);
    }
    const product = normalizeProductPayload(body);
    assertAdminProductPaymentModeAllowed(env, product);
    await env.DB.prepare(
      `INSERT INTO mall_products (
        id, name, description, category, price, original_price, stock, manual_stock,
      status, image_url, images_json, features_json, official_token, usage_guide, requires_user_info,
      after_sale_enabled, after_sale_guide, user_info_fields_json, stock_threshold, limit_per_user, min_trust_level,
      payment_mode, delivery_mode, fixed_delivery_url, fixed_delivery_label, fixed_delivery_links_json, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      product.id,
      product.name,
      product.description,
      product.category,
      product.price,
      product.originalPrice,
      product.stock,
      product.manualStock,
      product.status,
      product.imageUrl,
      JSON.stringify(product.images),
      JSON.stringify(product.features),
      product.officialToken,
      product.usageGuide,
      product.requiresUserInfo ? 1 : 0,
      product.afterSaleEnabled ? 1 : 0,
      product.afterSaleGuide,
      JSON.stringify(product.userInfoFields),
      product.stockThreshold,
      product.limitPerUser,
      product.minTrustLevel,
      product.paymentMode,
      product.deliveryMode,
      product.fixedDeliveryUrl,
      product.fixedDeliveryLabel,
      JSON.stringify(product.fixedDeliveryItems || []),
      product.sortOrder
    ).run();
    const created = await loadMallProduct(env, product.id, { includeInactive: true });
    await recordMallAdminAudit(request, env, admin, {
      action: "product_create",
      targetType: "product",
      targetId: product.id,
      summary: `创建商品：${product.name}`,
      after: created
    });
    return json({ product: created }, 201);
  }

  if ((request.method === "PUT" || request.method === "PATCH") && productId) {
    const existing = await loadMallProduct(env, productId, { includeInactive: true });
    if (!existing) {
      throw new ApiError(404, "product_not_found", "商品不存在");
    }
    const product = normalizeProductPayload(await readJson(request), existing);
    assertAdminProductPaymentModeAllowed(env, product);
    await env.DB.prepare(
      `UPDATE mall_products SET
        name = ?, description = ?, category = ?, price = ?, original_price = ?,
        stock = ?, manual_stock = ?, status = ?, image_url = ?, images_json = ?,
        features_json = ?, official_token = ?, usage_guide = ?, requires_user_info = ?,
        after_sale_enabled = ?, after_sale_guide = ?, user_info_fields_json = ?, stock_threshold = ?, limit_per_user = ?,
        min_trust_level = ?, payment_mode = ?, delivery_mode = ?, fixed_delivery_url = ?, fixed_delivery_label = ?, fixed_delivery_links_json = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(
      product.name,
      product.description,
      product.category,
      product.price,
      product.originalPrice,
      product.stock,
      product.manualStock,
      product.status,
      product.imageUrl,
      JSON.stringify(product.images),
      JSON.stringify(product.features),
      product.officialToken,
      product.usageGuide,
      product.requiresUserInfo ? 1 : 0,
      product.afterSaleEnabled ? 1 : 0,
      product.afterSaleGuide,
      JSON.stringify(product.userInfoFields),
      product.stockThreshold,
      product.limitPerUser,
      product.minTrustLevel,
      product.paymentMode,
      product.deliveryMode,
      product.fixedDeliveryUrl,
      product.fixedDeliveryLabel,
      JSON.stringify(product.fixedDeliveryItems || []),
      product.sortOrder,
      existing.id
    ).run();
    const updated = await loadMallProduct(env, existing.id, { includeInactive: true });
    await recordMallAdminAudit(request, env, admin, {
      action: "product_update",
      targetType: "product",
      targetId: existing.id,
      summary: `修改商品：${updated?.name || existing.name}`,
      before: existing,
      after: updated
    });
    return json({ product: updated });
  }

  if (request.method === "DELETE" && productId) {
    const body = await readJson(request).catch(() => ({}));
    const existing = await loadMallProduct(env, productId, { includeInactive: true });
    if (!existing) {
      throw new ApiError(404, "product_not_found", "商品不存在");
    }
    const mode = body.mode === "hard" || body.hard === true || existing?.status === "deleted" ? "hard" : "soft";
    if (mode === "hard") {
      await env.DB.batch([
        env.DB.prepare("DELETE FROM mall_cards WHERE product_id = ?").bind(productId),
        env.DB.prepare("DELETE FROM mall_coupons WHERE product_id = ?").bind(productId),
        env.DB.prepare("DELETE FROM mall_ratings WHERE product_id = ?").bind(productId),
        env.DB.prepare("DELETE FROM mall_lottery_draws WHERE product_id = ?").bind(productId),
        env.DB.prepare("DELETE FROM mall_products WHERE id = ?").bind(productId)
      ]);
      await recordMallAdminAudit(request, env, admin, {
        action: "product_delete_hard",
        targetType: "product",
        targetId: productId,
        summary: `彻底删除商品：${existing.name}`,
        before: existing,
        after: { deleted: true, mode }
      });
      return json({ ok: true, mode });
    }
    await env.DB.prepare("UPDATE mall_products SET status = 'deleted', updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind(productId)
      .run();
    await recordMallAdminAudit(request, env, admin, {
      action: "product_delete_soft",
      targetType: "product",
      targetId: productId,
      summary: `临时删除商品：${existing.name}`,
      before: existing,
      after: { status: "deleted", mode }
    });
    return json({ ok: true, mode });
  }

  if (request.method === "DELETE" && !productId) {
    const body = await readJson(request);
    const ids = normalizeIds(body.ids || body.productIds).filter(isSafeRecordId);
    if (!ids.length) {
      throw new ApiError(400, "empty_selection", "请选择要删除的商品");
    }
    const mode = body.mode === "hard" || body.hard === true ? "hard" : "soft";
    const beforeProducts = (await loadMallProducts(env, { includeDeleted: true }))
      .filter((item) => ids.includes(item.id));
    const deletedRows = await selectD1RowsByIds(env, "mall_products", "id, status", "id", ids, {
      whereSql: "status = 'deleted'"
    });
    const alreadyDeleted = new Set(deletedRows.map((row) => row.id));
    const hardIds = mode === "hard" ? ids : ids.filter((idValue) => alreadyDeleted.has(idValue));
    const softIds = mode === "hard" ? [] : ids.filter((idValue) => !alreadyDeleted.has(idValue));
    if (hardIds.length) {
      await deleteD1RowsByIds(env, "mall_cards", "product_id", hardIds);
      await deleteD1RowsByIds(env, "mall_coupons", "product_id", hardIds);
      await deleteD1RowsByIds(env, "mall_ratings", "product_id", hardIds);
      await deleteD1RowsByIds(env, "mall_lottery_draws", "product_id", hardIds);
      await deleteD1RowsByIds(env, "mall_products", "id", hardIds);
    }
    if (softIds.length) {
      await updateD1RowsByIds(env, "mall_products", "id", softIds, "status = 'deleted', updated_at = CURRENT_TIMESTAMP");
    }
    await recordMallAdminAudit(request, env, admin, {
      action: mode === "hard" ? "products_delete_hard" : "products_delete",
      targetType: "product",
      targetId: ids.join(",").slice(0, 160),
      summary: `批量删除 ${ids.length} 个商品，彻底删除 ${hardIds.length} 个，临时删除 ${softIds.length} 个`,
      before: summarizeAuditItems(beforeProducts, (item) => ({ id: item.id, name: item.name, status: item.status })),
      after: summarizeBatchMutation(ids, { hardDeleted: hardIds.length, softDeleted: softIds.length, mode })
    });
    return json({ ok: true, deleted: ids.length, hardDeleted: hardIds.length, softDeleted: softIds.length, mode });
  }

  return json({ error: "not_found" }, 404);
}

async function handleMallAdminOrders(request, env, admin, orderId, subAction, ctx = null) {
  if (request.method === "GET") {
    return json({ orders: await loadMallAdminOrders(env, getAdminListLimitFromRequest(request)) });
  }

  if (request.method === "PATCH" && orderId) {
    const body = await readJson(request);
    const order = await loadMallOrder(env, orderId);
    if (!order) {
      throw new ApiError(404, "order_not_found", "订单不存在");
    }
    if (body.status === "completed" || body.action === "deliver") {
      const delivered = await completeMallOrder(env, order, admin, { ...body, ctx });
      await recordMallAdminAudit(request, env, admin, {
        action: "order_deliver",
        targetType: "order",
        targetId: order.id,
        summary: `完成订单：${order.productName}`,
        before: order,
        after: delivered
      });
      return json({ order: delivered });
    }
    if (body.status === "canceled" || body.action === "cancel") {
      const response = await cancelMallOrder(env, order, admin, { byAdmin: true });
      await recordMallAdminAudit(request, env, admin, {
        action: "order_cancel",
        targetType: "order",
        targetId: order.id,
        summary: `取消订单：${order.productName}`,
        before: order,
        after: await loadMallOrder(env, order.id)
      });
      return response;
    }
    if (body.status === "refunded" || body.action === "refund") {
      const response = await refundMallOrder(env, order, admin, body);
      await recordMallAdminAudit(request, env, admin, {
        action: "order_refund",
        targetType: "order",
        targetId: order.id,
        summary: `退款订单：${order.productName}`,
        before: order,
        after: await loadMallOrder(env, order.id)
      });
      return response;
    }
    const status = normalizeOrderStatus(body.status || order.status);
    const note = normalizeText(body.note ?? order.note, 1000);
    if (status !== order.status) {
      const product = await loadMallProduct(env, order.productId, { includeInactive: true });
      assertAdminManualOrderStatusAllowed(order, status, product);
    }
    await env.DB.prepare("UPDATE mall_orders SET status = ?, note = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind(status, note, order.id)
      .run();
    const updated = await loadMallOrder(env, order.id);
    await recordMallAdminAudit(request, env, admin, {
      action: "order_update",
      targetType: "order",
      targetId: order.id,
      summary: `修改订单状态为 ${status}`,
      before: order,
      after: updated
    });
    return json({ order: updated });
  }

  if (request.method === "DELETE") {
    const body = orderId ? { orderIds: [orderId] } : await readJson(request);
    const orderIds = normalizeIds(body.orderIds || body.ids).filter(isUuidLike);
    if (!orderIds.length) {
      throw new ApiError(400, "empty_selection", "请选择要删除的订单");
    }
    const orders = await loadMallOrdersByIds(env, orderIds);
    const protectedOrders = orders.filter((item) => ["processing", "completed", "refunded"].includes(item.status));
    if (protectedOrders.length) {
      throw new ApiError(400, "order_delete_locked", "处理中、已完成、已退款订单不能直接删除，请保留记录");
    }
    for (const order of orders.filter((item) => ["pending", "processing"].includes(item.status))) {
      await cancelMallOrderSideEffects(env, order);
    }
    const deletedCount = await deleteD1RowsByIds(env, "mall_orders", "id", orderIds, { uuid: true });
    await recordMallAdminAudit(request, env, admin, {
      action: "orders_delete",
      targetType: "order",
      targetId: orderIds.join(",").slice(0, 160),
      summary: `删除 ${orderIds.length} 个订单`,
      before: summarizeAuditItems(orders, (item) => ({ id: item.id, productName: item.productName, status: item.status, amount: item.finalAmount })),
      after: summarizeBatchMutation(orderIds, { deleted: deletedCount })
    });
    return json({ ok: true, deleted: deletedCount });
  }

  if (request.method === "POST" && subAction === "deliver") {
    const order = await loadMallOrder(env, orderId);
    const delivered = await completeMallOrder(env, order, admin, { ...(await readJson(request)), ctx });
    await recordMallAdminAudit(request, env, admin, {
      action: "order_deliver",
      targetType: "order",
      targetId: order?.id || orderId,
      summary: `完成订单：${order?.productName || orderId}`,
      before: order,
      after: delivered
    });
    return json({ order: delivered });
  }

  return json({ error: "not_found" }, 404);
}

function assertAdminManualOrderStatusAllowed(order, nextStatus, product = null) {
  if (nextStatus === order.status) {
    return;
  }
  if (["completed", "refunded", "canceled"].includes(order.status)) {
    throw new ApiError(409, "order_state_locked", "已完成、已退款或已取消订单不能通过通用状态修改恢复");
  }
  if (["completed", "refunded", "canceled"].includes(nextStatus)) {
    throw new ApiError(400, "order_action_required", "完成、退款或取消订单必须使用对应操作，不能直接修改状态");
  }
  if (isCreditPaidOrder(order, product) && Number(order.finalAmount || 0) > 0) {
    throw new ApiError(400, "credit_order_status_locked", "积分站付费订单状态不能手动切换，请等待支付回调或使用交付/退款/取消操作");
  }
}

async function handleMallAdminCards(request, env, admin, cardId) {
  if (request.method === "GET") {
    return json({ cards: await loadMallCards(env, getAdminListLimitFromRequest(request)) });
  }

  if (request.method === "POST" && !cardId) {
    const body = await readJson(request);
    const productId = normalizeMallId(body.productId);
    const generatedMode = normalizeChoice(body.mode, ["manual", "generate"], "manual") === "generate";
    const existingCardRows = productId
      ? await env.DB.prepare("SELECT content FROM mall_cards WHERE product_id = ?").bind(productId).all()
      : { results: [] };
    const cards = buildMallCardContents(body, (existingCardRows.results || []).map((row) => row.content));
    if (!productId || !cards.length) {
      throw new ApiError(400, "invalid_card", "请选择商品并填写卡密");
    }
    const product = await loadMallProduct(env, productId, { includeInactive: true });
    if (!product) {
      throw new ApiError(404, "product_not_found", "商品不存在");
    }
    if (!canReplenishMallProduct(product)) {
      throw new ApiError(400, "product_not_replenishable", "只有在售的自动交付商品可以补货");
    }
    const availableAt = normalizeNullableDate(body.availableAt);
    const status = availableAt && Date.parse(availableAt) > Date.now() ? "scheduled" : "unused";
    await runD1InChunks(env, cards, (content) => (
      env.DB.prepare("INSERT INTO mall_cards (id, product_id, content, status, available_at) VALUES (?, ?, ?, ?, ?)")
        .bind(crypto.randomUUID(), productId, content, status, availableAt)
    ));
    await recordMallAdminAudit(request, env, admin, {
      action: "cards_create",
      targetType: "card",
      targetId: productId,
      summary: `为商品 ${product.name} 新增 ${cards.length} 个卡密`,
      after: { productId, count: cards.length, status, mode: generatedMode ? "generate" : "manual" }
    });
    return json({ ok: true, created: cards.length, mode: generatedMode ? "generate" : "manual" }, 201);
  }

  if ((request.method === "PUT" || request.method === "PATCH") && cardId) {
    const body = await readJson(request);
    const productId = normalizeMallId(body.productId);
    const content = normalizeText(body.content, 2000);
    const status = normalizeChoice(body.status, ["unused", "scheduled", "reserved", "used", "inactive"], "unused");
    const availableAt = normalizeNullableDate(body.availableAt);
    if (!productId || !content) {
      throw new ApiError(400, "invalid_card", "请选择商品并填写卡密");
    }
    const previous = await loadMallCard(env, cardId);
    if (!previous) {
      throw new ApiError(404, "card_not_found", "卡密不存在");
    }
    const product = await loadMallProduct(env, productId, { includeInactive: true });
    if (!product) {
      throw new ApiError(404, "product_not_found", "商品不存在");
    }
    const duplicate = await env.DB.prepare(
      "SELECT id FROM mall_cards WHERE product_id = ? AND content = ? AND id != ? LIMIT 1"
    ).bind(productId, content, cardId).first();
    if (duplicate) {
      throw new ApiError(409, "card_duplicate", "同一商品下已存在相同卡密");
    }
    await env.DB.prepare(
      `UPDATE mall_cards
       SET product_id = ?, content = ?, status = ?, available_at = ?
       WHERE id = ?`
    ).bind(productId, content, status, availableAt, cardId).run();
    const updated = await loadMallCard(env, cardId);
    await recordMallAdminAudit(request, env, admin, {
      action: "card_update",
      targetType: "card",
      targetId: cardId,
      summary: `修改卡密：${cardId}`,
      before: previous ? { ...previous, content: "***" } : null,
      after: updated ? { ...updated, content: "***" } : null
    });
    return json({ card: updated });
  }

  if (request.method === "DELETE") {
    const body = cardId ? { ids: [cardId] } : await readJson(request);
    const ids = normalizeIds(body.ids || body.cardIds).filter(isSafeRecordId);
    if (!ids.length) {
      throw new ApiError(400, "empty_selection", "请选择要删除的卡密");
    }
    const beforeCards = await loadMallCardsByIds(env, ids);
    const deletedCount = await deleteD1RowsByIds(env, "mall_cards", "id", ids);
    await recordMallAdminAudit(request, env, admin, {
      action: "cards_delete",
      targetType: "card",
      targetId: ids.join(",").slice(0, 160),
      summary: `删除 ${ids.length} 个卡密`,
      before: summarizeAuditItems(beforeCards, (item) => ({ id: item.id, productId: item.productId, productName: item.productName, status: item.status })),
      after: summarizeBatchMutation(ids, { deleted: deletedCount })
    });
    return json({ ok: true, deleted: deletedCount });
  }

  return json({ error: "not_found" }, 404);
}

function buildMallCardContents(body, existingContents = []) {
  const mode = normalizeChoice(body.mode, ["manual", "generate"], "manual");
  const existing = new Set(existingContents.map((item) => normalizeText(item, 2000)).filter(Boolean));
  if (mode !== "generate") {
    const cards = [];
    const seen = new Set(existing);
    for (const raw of (Array.isArray(body.contents) ? body.contents : String(body.content || "").split(/\r?\n/))) {
      const item = normalizeText(raw, 2000);
      if (!item || seen.has(item)) {
        continue;
      }
      seen.add(item);
      cards.push(item);
      if (cards.length >= 500) {
        break;
      }
    }
    return cards;
  }
  const prefix = normalizeCardPrefix(body.prefix);
  const count = Math.max(1, Math.min(500, Number.parseInt(body.count || 10, 10) || 10));
  const length = Math.max(6, Math.min(64, Number.parseInt(body.length || 18, 10) || 18));
  if (prefix.length >= length) {
    throw new ApiError(400, "invalid_card_length", "卡密总长度必须大于卡头长度，最后一位会作为校验码");
  }
  if (length - prefix.length < 2) {
    throw new ApiError(400, "invalid_card_length", "随机部分至少需要 1 位，最后一位为校验码");
  }
  const cards = new Set();
  let attempts = 0;
  const maxAttempts = count * 20;
  while (cards.size < count && attempts < maxAttempts) {
    attempts += 1;
    const card = generateMallCardKey(prefix, length);
    if (!existing.has(card)) {
      cards.add(card);
    }
  }
  if (cards.size < count) {
    throw new ApiError(500, "card_generation_failed", "随机卡密生成失败，请缩短卡头或减少数量后重试");
  }
  return [...cards];
}

function normalizeCardPrefix(value) {
  return normalizeText(value, 32).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 32);
}

function generateMallCardKey(prefix, length) {
  const payloadLength = length - 1;
  let payload = prefix;
  const randomLength = payloadLength - prefix.length;
  const bytes = new Uint8Array(randomLength);
  crypto.getRandomValues(bytes);
  for (const byte of bytes) {
    payload += CARD_KEY_ALPHABET[byte % CARD_KEY_ALPHABET.length];
  }
  return `${payload}${calculateMallCardCheckDigit(payload)}`;
}

function calculateMallCardCheckDigit(payload) {
  const normalized = normalizeCardPrefix(payload);
  let sum = 0;
  let doubleNext = true;
  for (let index = normalized.length - 1; index >= 0; index -= 1) {
    let value = CARD_KEY_ALPHABET.indexOf(normalized[index]);
    if (value < 0) value = 0;
    if (doubleNext) {
      value *= 2;
      value = Math.floor(value / CARD_KEY_ALPHABET.length) + (value % CARD_KEY_ALPHABET.length);
    }
    sum += value;
    doubleNext = !doubleNext;
  }
  return CARD_KEY_ALPHABET[(CARD_KEY_ALPHABET.length - (sum % CARD_KEY_ALPHABET.length)) % CARD_KEY_ALPHABET.length];
}

async function handleMallAdminCoupons(request, env, admin, couponId) {
  if (request.method === "GET") {
    return json({ coupons: await loadMallCoupons(env, getAdminListLimitFromRequest(request)) });
  }

  if (request.method === "POST" || request.method === "PUT" || request.method === "PATCH") {
    const body = await readJson(request);
    const coupon = normalizeCouponPayload(body, couponId || crypto.randomUUID());
    const existing = couponId ? await env.DB.prepare("SELECT id FROM mall_coupons WHERE id = ?").bind(couponId).first() : null;
    const previous = existing ? await loadMallCoupon(env, coupon.id) : null;
    const duplicatedCode = await env.DB.prepare(
      "SELECT id FROM mall_coupons WHERE UPPER(code) = UPPER(?) AND id != ? LIMIT 1"
    ).bind(coupon.code, coupon.id).first();
    if (duplicatedCode) {
      throw new ApiError(409, "coupon_duplicate", "优惠码已存在，请换一个 code");
    }
    if (existing) {
      await env.DB.prepare(
        `UPDATE mall_coupons SET code = ?, product_id = ?, type = ?, value = ?, limit_count = ?,
          starts_at = ?, expires_at = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      ).bind(
        coupon.code,
        coupon.productId,
        coupon.type,
        coupon.value,
        coupon.limitCount,
        coupon.startsAt,
        coupon.expiresAt,
        coupon.status,
        coupon.id
      ).run();
    } else {
      await env.DB.prepare(
        `INSERT INTO mall_coupons (id, code, product_id, type, value, limit_count, starts_at, expires_at, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        coupon.id,
        coupon.code,
        coupon.productId,
        coupon.type,
        coupon.value,
        coupon.limitCount,
        coupon.startsAt,
        coupon.expiresAt,
        coupon.status
      ).run();
    }
    await recordMallAdminAudit(request, env, admin, {
      action: existing ? "coupon_update" : "coupon_create",
      targetType: "coupon",
      targetId: coupon.id,
      summary: `${existing ? "修改" : "创建"}优惠码：${coupon.code}`,
      before: previous,
      after: coupon
    });
    return json({ coupon }, existing ? 200 : 201);
  }

  if (request.method === "DELETE") {
    const body = couponId ? { ids: [couponId] } : await readJson(request);
    const ids = normalizeIds(body.ids || body.couponIds).filter(isSafeRecordId);
    if (!ids.length) {
      throw new ApiError(400, "empty_selection", "请选择要删除的优惠码");
    }
    const beforeCoupons = await loadMallCouponsByIds(env, ids);
    const deletedCount = await deleteD1RowsByIds(env, "mall_coupons", "id", ids);
    await recordMallAdminAudit(request, env, admin, {
      action: "coupons_delete",
      targetType: "coupon",
      targetId: ids.join(",").slice(0, 160),
      summary: `删除 ${ids.length} 个优惠码`,
      before: summarizeAuditItems(beforeCoupons, (item) => ({ id: item.id, code: item.code, productId: item.productId, status: item.status })),
      after: summarizeBatchMutation(ids, { deleted: deletedCount })
    });
    return json({ ok: true, deleted: deletedCount });
  }

  return json({ error: "not_found" }, 404);
}

async function handleMallAdminCouponBatch(request, env, admin) {
  if (request.method !== "POST") {
    return json({ error: "not_found" }, 404);
  }

  const body = await readJson(request);
  const count = Math.max(1, Math.min(200, Number.parseInt(body.count || 10, 10) || 10));
  const prefix = (normalizeText(body.prefix, 16).toUpperCase().replace(/[^A-Z0-9]/g, "") || "CODE").slice(0, 16);
  const productId = normalizeMallId(body.productId) || "";
  const type = normalizeChoice(body.type, ["fixed", "percent"], "fixed");
  const value = Math.max(0, Number.parseInt(body.value || 0, 10) || 0);
  const limitCount = Math.max(0, Number.parseInt(body.limitCount || 1, 10) || 1);
  const startsAt = normalizeNullableDate(body.startsAt);
  const expiresAt = normalizeNullableDate(body.expiresAt);
  const status = normalizeChoice(body.status, ["active", "inactive"], "active");
  if (!value) {
    throw new ApiError(400, "invalid_coupon", "请填写优惠码面值");
  }

  const existingRows = await env.DB.prepare("SELECT code FROM mall_coupons").all();
  const usedCodes = new Set((existingRows.results || []).map((row) => String(row.code || "").toUpperCase()));
  const coupons = [];
  let attempts = 0;
  while (coupons.length < count && attempts < count * 20) {
    attempts += 1;
    const code = `${prefix}${randomHex(4).toUpperCase()}`.slice(0, 32);
    if (usedCodes.has(code)) {
      continue;
    }
    usedCodes.add(code);
    coupons.push({
      id: crypto.randomUUID(),
      code,
      productId,
      type,
      value,
      limitCount,
      startsAt,
      expiresAt,
      status
    });
  }

  if (!coupons.length) {
    throw new ApiError(409, "coupon_generation_failed", "优惠码生成失败，请换一个前缀后重试");
  }

  await runD1InChunks(env, coupons, (coupon) => (
    env.DB.prepare(
      `INSERT INTO mall_coupons (id, code, product_id, type, value, limit_count, starts_at, expires_at, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      coupon.id,
      coupon.code,
      coupon.productId,
      coupon.type,
      coupon.value,
      coupon.limitCount,
      coupon.startsAt,
      coupon.expiresAt,
      coupon.status
    )
  ));
  await recordMallAdminAudit(request, env, admin, {
    action: "coupons_batch_create",
    targetType: "coupon",
    targetId: productId || "global",
    summary: `批量生成 ${coupons.length} 个优惠码`,
    after: { count: coupons.length, prefix, productId, type, value, limitCount, startsAt, expiresAt, status }
  });
  return json({ ok: true, created: coupons.length, coupons }, 201);
}

async function handleMallAdminRatings(request, env, admin, ratingId) {
  if (request.method === "GET") {
    return json({ ratings: await loadMallAdminRatings(env, getAdminListLimitFromRequest(request)) });
  }

  if (request.method === "DELETE") {
    const body = ratingId ? { ids: [ratingId] } : await readJson(request);
    const ids = normalizeIds(body.ids || body.ratingIds).filter(isSafeRecordId);
    if (!ids.length) {
      throw new ApiError(400, "empty_selection", "请选择要删除的评价");
    }
    const beforeRatings = await loadMallRatingsByIds(env, ids);
    const deletedCount = await deleteD1RowsByIds(env, "mall_ratings", "id", ids);
    await recordMallAdminAudit(request, env, admin, {
      action: "ratings_delete",
      targetType: "rating",
      targetId: ids.join(",").slice(0, 160),
      summary: `删除 ${ids.length} 条评价`,
      before: summarizeAuditItems(beforeRatings, (item) => ({ id: item.id, productId: item.productId, productName: item.productName, userId: item.userId, rating: item.rating })),
      after: summarizeBatchMutation(ids, { deleted: deletedCount })
    });
    return json({ ok: true, deleted: deletedCount });
  }

  return json({ error: "not_found" }, 404);
}

async function handleMallAdminAds(request, env, admin, adId) {
  if (request.method === "GET") {
    return json({ ads: await loadMallAds(env, { includeInactive: true }) });
  }

  if (request.method === "POST" || request.method === "PUT" || request.method === "PATCH") {
    const body = await readJson(request);
    const ad = normalizeAdPayload(body, adId || crypto.randomUUID());
    const existing = adId ? await env.DB.prepare("SELECT id FROM mall_ads WHERE id = ?").bind(adId).first() : null;
    const previous = existing ? (await loadMallAds(env, { includeInactive: true })).find((item) => item.id === ad.id) || null : null;
    if (existing) {
      await env.DB.prepare(
        `UPDATE mall_ads SET title = ?, description = ?, image_url = ?, link_url = ?, position = ?,
          status = ?, sort_order = ?, style_json = ?, starts_at = ?, ends_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      ).bind(ad.title, ad.description, ad.imageUrl, ad.linkUrl, ad.position, ad.status, ad.sortOrder, JSON.stringify(ad.style), ad.startsAt, ad.endsAt, ad.id).run();
    } else {
      await env.DB.prepare(
        `INSERT INTO mall_ads (id, title, description, image_url, link_url, position, status, sort_order, style_json, starts_at, ends_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(ad.id, ad.title, ad.description, ad.imageUrl, ad.linkUrl, ad.position, ad.status, ad.sortOrder, JSON.stringify(ad.style), ad.startsAt, ad.endsAt).run();
    }
    await recordMallAdminAudit(request, env, admin, {
      action: existing ? "ad_update" : "ad_create",
      targetType: "ad",
      targetId: ad.id,
      summary: `${existing ? "修改" : "创建"}广告：${ad.title}`,
      before: previous,
      after: ad
    });
    return json({ ad }, existing ? 200 : 201);
  }

  if (request.method === "DELETE") {
    const body = adId ? { ids: [adId] } : await readJson(request);
    const ids = normalizeIds(body.ids || body.adIds).filter(isSafeRecordId);
    if (!ids.length) {
      throw new ApiError(400, "empty_selection", "请选择要删除的广告");
    }
    const beforeAds = (await loadMallAds(env, { includeInactive: true })).filter((item) => ids.includes(item.id));
    const deletedCount = await deleteD1RowsByIds(env, "mall_ads", "id", ids);
    await recordMallAdminAudit(request, env, admin, {
      action: "ads_delete",
      targetType: "ad",
      targetId: ids.join(",").slice(0, 160),
      summary: `删除 ${ids.length} 个广告`,
      before: summarizeAuditItems(beforeAds, (item) => ({ id: item.id, title: item.title, position: item.position, status: item.status })),
      after: summarizeBatchMutation(ids, { deleted: deletedCount })
    });
    return json({ ok: true, deleted: deletedCount });
  }

  return json({ error: "not_found" }, 404);
}

async function handleMallAdminFeedback(request, env, admin, feedbackId, subAction) {
  if (request.method === "GET") {
    const limit = getAdminListLimitFromRequest(request);
    return json({
      feedback: await loadMallFeedback(env, { admin: true, includeDeleted: true, limit }),
      feedbackLogs: await loadMallFeedbackLogs(env, { limit }),
      ldcLedger: await loadMallLdcLedger(env, limit)
    });
  }
  if (!feedbackId || !isUuidLike(feedbackId)) {
    throw new ApiError(400, "invalid_feedback", "反馈记录无效");
  }
  if (request.method === "PATCH") {
    const body = await readJson(request);
    const action = normalizeText(body.action || subAction, 20);
    if (!["approve", "reject"].includes(action)) {
      throw new ApiError(400, "invalid_feedback_action", "审核结果只能是通过或不通过");
    }
    if (action === "approve") {
      return await approveMallFeedback(request, env, admin, feedbackId, body);
    }
    const previous = await loadMallFeedbackItem(env, feedbackId);
    if (!previous) {
      throw new ApiError(404, "feedback_not_found", "反馈不存在");
    }
    if (previous.status === "deleted") {
      throw new ApiError(409, "feedback_deleted", "该反馈已删除，不能继续审核");
    }
    if (previous.status !== "pending") {
      throw new ApiError(409, "feedback_locked", "只有待审核反馈可以审核");
    }
    const nextStatus = "rejected";
    const adminNote = normalizeText(body.adminNote, 1000);
    await env.DB.batch([
      env.DB.prepare(
        `UPDATE mall_feedback
         SET status = ?, reward_amount = 0, admin_note = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      ).bind(nextStatus, adminNote, admin.id, feedbackId),
      env.DB.prepare("DELETE FROM mall_ldc_ledger WHERE source_type = 'feedback' AND source_id = ?").bind(feedbackId)
    ]);
    await recordMallFeedbackLog(env, {
      feedbackId,
      actorId: admin.id,
      actorName: admin.linuxdo?.username || admin.username || "",
      actorRole: "admin",
      action,
      note: adminNote || "管理员审核不通过",
      before: pickFeedbackLogSnapshot(previous),
      after: { status: nextStatus, rewardAmount: 0, adminNote }
    });
    await recordMallAdminAudit(request, env, admin, {
      action: "feedback_reject",
      targetType: "feedback",
      targetId: feedbackId,
      summary: `拒绝反馈：${previous.title}`,
      before: pickFeedbackLogSnapshot(previous),
      after: { status: nextStatus, rewardAmount: 0, adminNote }
    });
    return json({
      feedback: await loadMallFeedbackItem(env, feedbackId),
      feedbackLogs: await loadMallFeedbackLogs(env, { limit: 300 }),
      ldcLedger: await loadMallLdcLedger(env, 300)
    });
  }
  if (request.method === "PUT") {
    const previous = await loadMallFeedbackItem(env, feedbackId);
    if (!previous) {
      throw new ApiError(404, "feedback_not_found", "反馈不存在");
    }
    if (previous.status !== "draft") {
      throw new ApiError(409, "feedback_locked", "只有用户草稿可以修改");
    }
    const body = await readJson(request);
    const settings = await getMallSettings(env);
    const next = await normalizeFeedbackPayload(body, { request, env, user: admin, limits: settings.limits });
    await env.DB.prepare(
      `UPDATE mall_feedback
       SET type = ?, title = ?, content = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND status = 'draft'`
    ).bind(next.type, next.title, next.content, feedbackId).run();
    await recordMallFeedbackLog(env, {
      feedbackId,
      actorId: admin.id,
      actorName: admin.linuxdo?.username || admin.username || "",
      actorRole: "admin",
      action: "admin_update",
      note: "管理员修改反馈内容",
      before: pickFeedbackLogSnapshot(previous),
      after: next
    });
    await recordMallAdminAudit(request, env, admin, {
      action: "feedback_update",
      targetType: "feedback",
      targetId: feedbackId,
      summary: `管理员修改反馈：${previous.title}`,
      before: pickFeedbackLogSnapshot(previous),
      after: next
    });
    return json({
      feedback: await loadMallFeedbackItem(env, feedbackId),
      feedbackLogs: await loadMallFeedbackLogs(env, { limit: 300 }),
      ldcLedger: await loadMallLdcLedger(env, 300)
    });
  }
  if (request.method === "DELETE") {
    const previous = await loadMallFeedbackItem(env, feedbackId);
    if (!previous) {
      throw new ApiError(404, "feedback_not_found", "反馈不存在");
    }
    await env.DB.batch([
      env.DB.prepare("DELETE FROM mall_ldc_ledger WHERE source_type = 'feedback' AND source_id = ?").bind(feedbackId),
      env.DB.prepare("DELETE FROM mall_feedback_logs WHERE feedback_id = ?").bind(feedbackId),
      env.DB.prepare("DELETE FROM mall_feedback WHERE id = ?").bind(feedbackId)
    ]);
    await recordMallAdminAudit(request, env, admin, {
      action: "feedback_delete",
      targetType: "feedback",
      targetId: feedbackId,
      summary: `删除反馈：${previous.title}`,
      before: pickFeedbackLogSnapshot(previous),
      after: { deleted: true }
    });
    return json({
      ok: true,
      deletedId: feedbackId,
      feedbackLogs: await loadMallFeedbackLogs(env, { limit: 300 }),
      ldcLedger: await loadMallLdcLedger(env, 300)
    });
  }
  return json({ error: "not_found" }, 404);
}

async function approveMallFeedback(request, env, admin, feedbackId, body = {}) {
  const feedback = await loadMallFeedbackItem(env, feedbackId);
  if (!feedback) {
    throw new ApiError(404, "feedback_not_found", "反馈不存在");
  }
  if (feedback.status === "deleted") {
    throw new ApiError(409, "feedback_deleted", "该反馈已删除，不能继续审核");
  }
  const existingLedger = await loadMallFeedbackLedger(env, feedbackId);
  const canResendLegacyCredit = feedback.status === "approved" && existingLedger && existingLedger.externalStatus !== "distributed";
  if (feedback.status !== "pending" && !canResendLegacyCredit) {
    throw new ApiError(409, "feedback_locked", existingLedger?.externalStatus === "distributed" ? "该反馈已发放过奖励" : "只有待审核反馈可以审核");
  }
  const settings = await getMallSettings(env);
  const rewardAmount = normalizeLdcReward(body.rewardAmount, settings.limits);
  const rewardLabel = formatMallMoneyText(rewardAmount, settings);
  const adminNote = normalizeText(body.adminNote, 1000);
  const ledgerId = `feedback-${feedbackId}`;
  const now = new Date().toISOString();
  await upsertFeedbackLdcLedger(env, {
    ledgerId,
    feedback,
    rewardAmount,
    admin,
    createdAt: now,
    tradeNo: existingLedger?.externalTradeNo || "",
    status: "pending",
    error: ""
  });
  let distribution;
  try {
    distribution = await distributeFeedbackLdc(env, feedback, rewardAmount, ledgerId);
  } catch (error) {
    await upsertFeedbackLdcLedger(env, {
      ledgerId,
      feedback,
      rewardAmount,
      admin,
      createdAt: now,
      tradeNo: existingLedger?.externalTradeNo || "",
      status: "failed",
      error: error?.message || "官方积分站发放失败"
    }).catch(() => null);
    throw error;
  }
  await env.DB.batch([
    env.DB.prepare(
      `UPDATE mall_feedback
       SET status = 'approved', reward_amount = ?, admin_note = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(rewardAmount, adminNote, admin.id, feedbackId),
    feedbackLdcLedgerStatement(env, {
      ledgerId,
      feedback,
      rewardAmount,
      admin,
      createdAt: now,
      tradeNo: distribution.tradeNo,
      status: distribution.status,
      error: distribution.error
    })
  ]);
  await recordMallFeedbackLog(env, {
    feedbackId,
    actorId: admin.id,
    actorName: admin.linuxdo?.username || admin.username || "",
    actorRole: "admin",
    action: "approve",
    note: adminNote || `管理员通过反馈并发放 ${rewardLabel}`,
    before: pickFeedbackLogSnapshot(feedback),
    after: { status: "approved", rewardAmount, adminNote }
  });
  await recordMallAdminAudit(request, env, admin, {
    action: "feedback_approve",
    targetType: "feedback",
    targetId: feedbackId,
    summary: `通过反馈并发放 ${rewardLabel}：${feedback.title}`,
    before: pickFeedbackLogSnapshot(feedback),
    after: { status: "approved", rewardAmount, adminNote, distribution }
  });
  return json({
    feedback: await loadMallFeedbackItem(env, feedbackId),
    feedbackLogs: await loadMallFeedbackLogs(env, { limit: 300 }),
    ldcLedger: await loadMallLdcLedger(env, 300)
  });
}

async function upsertFeedbackLdcLedger(env, payload) {
  await feedbackLdcLedgerStatement(env, payload).run();
}

function feedbackLdcLedgerStatement(env, {
  ledgerId,
  feedback,
  rewardAmount,
  admin,
  createdAt,
  tradeNo,
  status,
  error
}) {
  return env.DB.prepare(
    `INSERT INTO mall_ldc_ledger (id, user_id, username, amount, reason, source_type, source_id, created_by, created_at, external_trade_no, external_status, external_error)
     VALUES (?, ?, ?, ?, ?, 'feedback', ?, ?, ?, ?, ?, ?)
     ON CONFLICT(source_type, source_id) DO UPDATE SET
       amount = excluded.amount,
       reason = excluded.reason,
       created_by = excluded.created_by,
       created_at = excluded.created_at,
       external_trade_no = excluded.external_trade_no,
       external_status = excluded.external_status,
       external_error = excluded.external_error`
  ).bind(
    ledgerId,
    feedback.userId,
    feedback.username,
    rewardAmount,
    `Bug反馈审核奖励：${feedback.title}`,
    feedback.id,
    admin.id,
    createdAt,
    normalizeText(tradeNo || "", 120),
    normalizeText(status || "", 40),
    normalizeText(error || "", 300)
  );
}

async function distributeFeedbackLdc(env, feedback, amount, requestId) {
  const pid = String(env.CREDIT_CLIENT_ID || env.CREDIT_EPAY_PID || "").trim();
  const secret = String(env.CREDIT_CLIENT_SECRET || env.CREDIT_EPAY_KEY || "").trim();
  if (!pid || !secret) {
    throw new ApiError(500, "credit_not_configured", "官方积分站尚未配置，无法向用户发放奖励");
  }
  const recipient = await loadMallCreditRecipient(env, feedback.userId);
  if (!recipient?.linuxdoId || !recipient?.linuxdoUsername) {
    throw new ApiError(400, "missing_linuxdo_account", "反馈用户缺少 Linux.do ID 或用户名，无法发放奖励");
  }
  if (!/^\d+$/.test(recipient.linuxdoId)) {
    throw new ApiError(400, "invalid_linuxdo_id", "反馈用户 Linux.do ID 无效，无法发放奖励");
  }
  const payload = {
    user_id: Number(recipient.linuxdoId),
    username: recipient.linuxdoUsername,
    amount,
    out_trade_no: requestId,
    remark: normalizeText(`Bug反馈奖励：${feedback.title}`, 120)
  };
  const response = await fetch("https://credit.linux.do/lpay/distribute", {
    method: "POST",
    headers: {
      Authorization: `Basic ${base64(`${pid}:${secret}`)}`,
      "Content-Type": "application/json;charset=UTF-8",
      Accept: "application/json"
    },
    body: JSON.stringify(payload)
  });
  const text = await response.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text };
  }
  const ok = response.ok && Number(data.code) === 1;
  if (!ok) {
    const message = normalizeText(data.error_msg || data.msg || data.message || data.error || text || "官方积分站发放失败", 300);
    throw new ApiError(502, "credit_distribute_failed", message || "官方积分站发放失败");
  }
  return {
    tradeNo: normalizeText(data.data?.trade_no || data.trade_no || data.tradeNo || "", 120),
    status: "distributed",
    error: ""
  };
}

async function loadMallCreditRecipient(env, userId) {
  const row = await env.DB.prepare(
    `SELECT users.username AS account_username,
            oauth_accounts.subject AS linuxdo_id,
            oauth_accounts.username AS linuxdo_username
     FROM users
     LEFT JOIN oauth_accounts ON oauth_accounts.user_id = users.id AND oauth_accounts.provider = ?
     WHERE users.id = ?`
  ).bind(LINUXDO_PROVIDER, userId).first();
  if (!row) return null;
  return {
    userId,
    accountUsername: row.account_username || "",
    linuxdoId: row.linuxdo_id || "",
    linuxdoUsername: row.linuxdo_username || row.account_username || ""
  };
}

async function handleMallAdminSettings(request, env, admin) {
  if (request.method === "GET") {
    return json({ settings: await getMallSettings(env) });
  }
  if (request.method === "PUT" || request.method === "PATCH") {
    const previous = await getMallSettings(env);
    const settings = mergeMallSettings(previous, await readJson(request));
    await env.DB.prepare(
    `INSERT INTO mall_settings (key, value_json, updated_at) VALUES ('settings', ?, CURRENT_TIMESTAMP)
       ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = CURRENT_TIMESTAMP`
    ).bind(JSON.stringify(settings)).run();
    await recordMallAdminAudit(request, env, admin, {
      action: "settings_update",
      targetType: "settings",
      targetId: "settings",
      summary: "修改系统设置",
      before: previous,
      after: settings
    });
    return json({ settings });
  }
  return json({ error: "not_found" }, 404);
}

async function handleMallAdminEmailTest(request, env, admin) {
  if (request.method !== "POST") {
    return json({ error: "not_found" }, 404);
  }
  const body = await readJson(request);
  const recipientEmail = normalizeEmailAddress(body.email);
  if (!recipientEmail) {
    throw new ApiError(400, "invalid_email", "请输入正确的测试收件邮箱");
  }
  await sendMallTestEmail(env, {
    to: recipientEmail,
    username: admin.linuxdo?.username || admin.username || "管理员",
    scope: "admin"
  });
  return json({ ok: true, email: recipientEmail });
}

async function handleMallAdminImageProxy(request, env, admin) {
  if (request.method !== "GET") {
    return json({ error: "not_found" }, 404);
  }
  const settings = await getMallSettings(env);
  await assertMallRateLimit(request, env, admin, "admin_image_proxy", {
    ...(settings.limits?.rateLimits?.adminImageProxy || DEFAULT_RATE_LIMITS.adminImageProxy),
    message: "在线图片处理过于频繁，请稍后再试"
  });
  const url = new URL(request.url);
  const targetUrl = normalizeProxyImageUrl(url.searchParams.get("url"));
  if (!targetUrl) {
    throw new ApiError(400, "invalid_image_url", "图片链接无效");
  }
  const response = await fetch(targetUrl, {
    headers: {
      Accept: "image/png,image/jpeg,image/webp,image/gif,image/avif;q=0.8,*/*;q=0.1",
      "User-Agent": "Linuxdo-Mall Image Proxy"
    },
    cf: { cacheTtl: 60, cacheEverything: false }
  });
  if (!response.ok) {
    throw new ApiError(400, "image_fetch_failed", "图片读取失败");
  }
  const contentType = normalizeImageContentType(response.headers.get("content-type") || "");
  if (!contentType) {
    throw new ApiError(400, "invalid_image_type", "只支持 PNG、JPG、GIF、WebP 或 AVIF 图片");
  }
  const contentLength = Number(response.headers.get("content-length") || 0);
  if (contentLength > MAX_PROXY_IMAGE_BYTES) {
    throw new ApiError(413, "image_too_large", "在线图片不能超过 1.5MB");
  }
  const bytes = await response.arrayBuffer();
  if (bytes.byteLength > MAX_PROXY_IMAGE_BYTES) {
    throw new ApiError(413, "image_too_large", "在线图片不能超过 1.5MB");
  }
  return new Response(bytes, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=60",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

async function handleMallAdminBlacklist(request, env, admin, blacklistId) {
  if (request.method === "GET") {
    return json({ items: await loadMallBlacklist(env, getAdminListLimitFromRequest(request)) });
  }

  if (request.method === "POST") {
    const body = await readJson(request);
    const item = {
      id: blacklistId || crypto.randomUUID(),
      kind: normalizeChoice(body.kind, ["ip", "user"], "ip"),
      value: normalizeText(body.value, 120),
      reason: normalizeText(body.reason, 300),
      source: normalizeText(body.source || "manual", 80)
    };
    if (!item.value) {
      throw new ApiError(400, "invalid_blacklist", "请输入黑名单内容");
    }
    const previous = await env.DB.prepare("SELECT id, kind, value, reason, source, created_at FROM mall_blacklist WHERE kind = ? AND value = ?")
      .bind(item.kind, item.value)
      .first();
    await env.DB.prepare(
    `INSERT INTO mall_blacklist (id, kind, value, reason, source) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(kind, value) DO UPDATE SET reason = excluded.reason, source = excluded.source`
    ).bind(item.id, item.kind, item.value, item.reason, item.source).run();
    await recordMallAdminAudit(request, env, admin, {
      action: previous ? "blacklist_update" : "blacklist_create",
      targetType: "blacklist",
      targetId: item.value,
      summary: `${previous ? "修改" : "新增"}黑名单：${item.kind}:${item.value}`,
      before: previous ? formatBlacklistItem(previous) : null,
      after: item
    });
    return json({ item }, 201);
  }

  if (request.method === "DELETE") {
    const body = blacklistId ? { ids: [blacklistId] } : await readJson(request);
    const ids = normalizeIds(body.ids || body.blacklistIds).filter(isSafeRecordId);
    if (!ids.length) {
      throw new ApiError(400, "empty_selection", "请选择要删除的黑名单项");
    }
    const beforeItems = (await loadMallBlacklist(env, 1000)).filter((item) => ids.includes(item.id));
    const deletedCount = await deleteD1RowsByIds(env, "mall_blacklist", "id", ids);
    await recordMallAdminAudit(request, env, admin, {
      action: "blacklist_delete",
      targetType: "blacklist",
      targetId: ids.join(",").slice(0, 160),
      summary: `删除 ${ids.length} 条黑名单`,
      before: summarizeAuditItems(beforeItems, (item) => ({ id: item.id, kind: item.kind, value: item.value })),
      after: summarizeBatchMutation(ids, { deleted: deletedCount })
    });
    return json({ ok: true, deleted: deletedCount });
  }

  return json({ error: "not_found" }, 404);
}

async function handleMallAdminEmailTemplates(request, env, admin, templateId) {
  if (request.method === "GET") {
    return json({ templates: await loadMallEmailTemplates(env, getAdminListLimitFromRequest(request)) });
  }

  if (request.method === "POST" || request.method === "PUT" || request.method === "PATCH") {
    const template = normalizeEmailTemplatePayload(await readJson(request), templateId);
    const existing = await env.DB.prepare("SELECT id FROM mall_email_templates WHERE id = ?").bind(template.id).first();
    const previous = existing ? (await loadMallEmailTemplates(env, 1000)).find((item) => item.id === template.id) || null : null;
    if (template.isDefault) {
      await env.DB.prepare("UPDATE mall_email_templates SET is_default = 0 WHERE event_type = ?").bind(template.eventType).run();
    }
    if (existing) {
      await env.DB.prepare(
        `UPDATE mall_email_templates
         SET event_type = ?, name = ?, subject = ?, content = ?, params_json = ?, is_default = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      ).bind(template.eventType, template.name, template.subject, template.content, JSON.stringify(template.params), template.isDefault ? 1 : 0, template.id).run();
    } else {
      await env.DB.prepare(
        `INSERT INTO mall_email_templates (id, event_type, name, subject, content, params_json, is_default)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(template.id, template.eventType, template.name, template.subject, template.content, JSON.stringify(template.params), template.isDefault ? 1 : 0).run();
    }
    await recordMallAdminAudit(request, env, admin, {
      action: existing ? "email_template_update" : "email_template_create",
      targetType: "email_template",
      targetId: template.id,
      summary: `${existing ? "修改" : "创建"}邮件模板：${template.name}`,
      before: previous,
      after: template
    });
    return json({ template }, existing ? 200 : 201);
  }

  if (request.method === "DELETE") {
    const body = templateId ? { ids: [templateId] } : await readJson(request);
    const ids = normalizeIds(body.ids || body.templateIds).filter(isSafeRecordId).filter((idValue) => idValue !== "default");
    if (!ids.length) {
      throw new ApiError(400, "empty_selection", "请选择可删除的邮件模板");
    }
    const beforeTemplates = (await loadMallEmailTemplates(env, 1000)).filter((item) => ids.includes(item.id));
    const deletedCount = await deleteD1RowsByIds(env, "mall_email_templates", "id", ids);
    await recordMallAdminAudit(request, env, admin, {
      action: "email_templates_delete",
      targetType: "email_template",
      targetId: ids.join(",").slice(0, 160),
      summary: `删除 ${ids.length} 个邮件模板`,
      before: summarizeAuditItems(beforeTemplates, (item) => ({ id: item.id, eventType: item.eventType, name: item.name })),
      after: summarizeBatchMutation(ids, { deleted: deletedCount })
    });
    return json({ ok: true, deleted: deletedCount });
  }

  return json({ error: "not_found" }, 404);
}

async function handleMallAdminLoginAttempts(request, env, admin) {
  if (request.method === "GET") {
    return json({ attempts: await loadMallLoginAttempts(env, getAdminListLimitFromRequest(request)) });
  }
  if (request.method === "DELETE") {
    const beforeCount = (await env.DB.prepare("SELECT COUNT(*) AS count FROM mall_login_attempts").first())?.count || 0;
    await env.DB.prepare("DELETE FROM mall_login_attempts").run();
    await recordMallAdminAudit(request, env, admin, {
      action: "login_attempts_clear",
      targetType: "login_attempt",
      targetId: "all",
      summary: `清空 ${beforeCount} 条登录失败/成功记录`,
      before: { count: Number(beforeCount || 0) },
      after: { cleared: true }
    });
    return json({ ok: true });
  }
  return json({ error: "not_found" }, 404);
}

async function handleMallAdminBackup(request, env, admin, backupId, subAction = "") {
  if (request.method === "GET" && !backupId) {
    return json({ records: await loadMallBackupRecords(env, 80) });
  }
  if (request.method === "GET" && backupId === "export") {
    return await exportMallAdminData(request, env, admin);
  }
  if (request.method === "POST" && backupId === "run") {
    const body = await readJson(request);
    const response = await exportMallAdminSqlData(env, admin, {
      recordOnly: true,
      requireStoredContent: true,
      scope: body.scope || body.scopes || undefined,
      backupType: "manual",
      retentionDays: body.retentionDays || body.keepDays
    });
    await recordMallAdminAudit(request, env, admin, {
      action: "backup_run",
      targetType: "backup",
      targetId: "manual",
      summary: "手动创建数据库备份",
      after: { scope: body.scope || body.scopes || "all" }
    });
    return response;
  }
  if (request.method === "GET" && backupId && subAction === "download") {
    return await downloadMallBackupRecord(env, backupId);
  }
  if (request.method === "POST" && backupId && subAction === "restore") {
    const response = await restoreMallBackupRecord(env, admin, backupId);
    await recordMallAdminAudit(request, env, admin, {
      action: "backup_restore",
      targetType: "backup",
      targetId: backupId,
      summary: `恢复备份：${backupId}`
    });
    return response;
  }
  if (request.method === "POST") {
    const url = new URL(request.url);
    if (backupId === "import" || url.searchParams.get("action") === "import") {
      const response = await importMallAdminData(request, env, admin);
      await recordMallAdminAudit(request, env, admin, {
        action: "backup_import",
        targetType: "backup",
        targetId: "upload",
        summary: "导入数据库备份"
      });
      return response;
    }
    return await exportMallAdminData(request, env, admin, { recordOnly: false });
  }
  if (request.method === "DELETE" && backupId) {
    const previous = await loadMallBackupRecord(env, backupId);
    await env.DB.prepare("DELETE FROM mall_backup_records WHERE id = ?").bind(backupId).run();
    await recordMallAdminAudit(request, env, admin, {
      action: "backup_delete",
      targetType: "backup",
      targetId: backupId,
      summary: `删除备份：${previous?.name || backupId}`,
      before: previous ? { id: previous.id, name: previous.name, sizeBytes: previous.sizeBytes, format: previous.format } : null,
      after: { deleted: true }
    });
    return json({ ok: true });
  }
  return json({ error: "not_found" }, 404);
}

async function handleMallAdminMinesweeper(request, env, admin, action = "") {
  if ((request.method === "GET" && !action) || (request.method === "GET" && action === "overview")) {
    return await getAdminOverview(env, admin);
  }
  if (request.method === "DELETE" && action === "leaderboard") {
    const response = await clearAdminLeaderboard(request, env, admin);
    await recordMallAdminAudit(request, env, admin, {
      action: "minesweeper_leaderboard_clear",
      targetType: "minesweeper",
      targetId: "leaderboard",
      summary: "清空扫雷排行榜"
    });
    return response;
  }
  if (request.method === "DELETE" && action === "scores") {
    const response = await deleteAdminScores(request, env);
    await recordMallAdminAudit(request, env, admin, {
      action: "minesweeper_scores_delete",
      targetType: "minesweeper",
      targetId: "scores",
      summary: "删除扫雷成绩"
    });
    return response;
  }
  if (request.method === "DELETE" && action === "user-sync") {
    const response = await deleteAdminUserSync(request, env, admin);
    await recordMallAdminAudit(request, env, admin, {
      action: "minesweeper_user_sync_delete",
      targetType: "minesweeper",
      targetId: "user-sync",
      summary: "删除扫雷用户云端存档"
    });
    return response;
  }
  if (request.method === "DELETE" && action === "users") {
    const response = await deleteAdminUsers(request, env, admin);
    await recordMallAdminAudit(request, env, admin, {
      action: "minesweeper_users_delete",
      targetType: "minesweeper",
      targetId: "users",
      summary: "删除扫雷用户数据"
    });
    return response;
  }
  return json({ error: "not_found" }, 404);
}

async function handleMallAdminUsers(request, env, admin) {
  if (request.method === "GET") {
    return json({ users: await loadMallUsers(env, getAdminListLimitFromRequest(request)) });
  }
  if (request.method === "DELETE") {
    const body = await readJson(request);
    const ids = normalizeUserIds(body.ids || body.userIds).filter((userId) => userId !== admin.id);
    if (!ids.length) {
      throw new ApiError(400, "empty_selection", "请选择可删除的用户，不能删除当前管理员账号");
    }
    const beforeUsers = await loadMallUsersByIds(env, ids);
    const deletedCount = await deleteMallUsersByIds(env, ids);
    await recordMallAdminAudit(request, env, admin, {
      action: "users_delete",
      targetType: "user",
      targetId: ids.join(",").slice(0, 160),
      summary: `删除 ${ids.length} 个用户及其关联商城数据`,
      before: summarizeAuditItems(beforeUsers, (item) => ({ id: item.id, username: item.username, linuxdoId: item.linuxdoId, orderCount: item.orderCount })),
      after: summarizeBatchMutation(ids, { deleted: deletedCount })
    });
    return json({ ok: true, deleted: deletedCount });
  }
  return json({ error: "not_found" }, 404);
}

async function ensureMallSeed(env) {
  if (mallSchemaRepairPromise) {
    return mallSchemaRepairPromise;
  }
  mallSchemaRepairPromise = ensureMallSeedFull(env).finally(() => {
    mallSchemaRepairPromise = null;
  });
  return mallSchemaRepairPromise;
}

async function ensureMallRuntime(env) {
  if (mallRuntimeReady) {
    return;
  }
  try {
    const row = await env.DB.prepare("SELECT key FROM mall_settings WHERE key = 'settings' LIMIT 1").first();
    if (!row) {
      await env.DB.prepare("INSERT INTO mall_settings (key, value_json) VALUES ('settings', ?)")
        .bind(JSON.stringify(MALL_DEFAULT_SETTINGS))
        .run();
    }
    await ensureMinesweeperCouponSchema(env);
    mallRuntimeReady = true;
  } catch (error) {
    await ensureMallSeed(env);
    await ensureMinesweeperCouponSchema(env);
    mallRuntimeReady = true;
  }
}

async function ensureMinesweeperCouponSchema(env) {
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_user_coupons (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE,
      campaign_key TEXT NOT NULL DEFAULT '',
      source_key TEXT NOT NULL DEFAULT '',
      label TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL DEFAULT 'fixed',
      value INTEGER NOT NULL DEFAULT 0,
      product_id TEXT NOT NULL DEFAULT '',
      stackable INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'active',
      reserved_order_id TEXT NOT NULL DEFAULT '',
      used_order_id TEXT NOT NULL DEFAULT '',
      rank INTEGER NOT NULL DEFAULT 0,
      meta_json TEXT NOT NULL DEFAULT '{}',
      starts_at TEXT,
      expires_at TEXT,
      used_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, campaign_key, source_key)
    )`
  ).run();
  await ensureMallColumn(env, "mall_orders", "discounts_json", "TEXT NOT NULL DEFAULT '[]'");
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_mall_user_coupons_user_status ON mall_user_coupons(user_id, status, expires_at)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_mall_user_coupons_campaign_rank ON mall_user_coupons(campaign_key, source_key, rank, created_at)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_mall_user_coupons_order ON mall_user_coupons(reserved_order_id, used_order_id)").run();
}

async function ensureAuthRuntime(env) {
  if (authRuntimeReady) {
    return;
  }
  try {
    await env.DB.prepare("SELECT id FROM users LIMIT 1").first();
    await env.DB.prepare("SELECT token_hash FROM sessions LIMIT 1").first();
    await env.DB.prepare("SELECT provider FROM oauth_accounts LIMIT 1").first();
    authRuntimeReady = true;
  } catch (error) {
    await ensureAuthSchema(env);
    authRuntimeReady = true;
  }
}

async function ensureChatRuntime(env) {
  if (chatRuntimeReady) {
    return;
  }
  try {
    await env.DB.prepare("SELECT id FROM mall_conversations LIMIT 1").first();
    await env.DB.prepare("SELECT id FROM mall_messages LIMIT 1").first();
    chatRuntimeReady = true;
  } catch (error) {
    await ensureMallChatSchema(env);
    chatRuntimeReady = true;
  }
}

async function ensureMallSeedFull(env) {
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'service',
      price INTEGER NOT NULL DEFAULT 0,
      original_price INTEGER NOT NULL DEFAULT 0,
      stock INTEGER NOT NULL DEFAULT 0,
      manual_stock INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      image_url TEXT NOT NULL DEFAULT '',
      images_json TEXT NOT NULL DEFAULT '[]',
      features_json TEXT NOT NULL DEFAULT '[]',
      official_token TEXT NOT NULL DEFAULT '',
      usage_guide TEXT NOT NULL DEFAULT '',
      requires_user_info INTEGER NOT NULL DEFAULT 0,
      after_sale_enabled INTEGER NOT NULL DEFAULT 0,
      after_sale_guide TEXT NOT NULL DEFAULT '',
      user_info_fields_json TEXT NOT NULL DEFAULT '[]',
      stock_threshold INTEGER NOT NULL DEFAULT 5,
      limit_per_user INTEGER NOT NULL DEFAULT 0,
      min_trust_level INTEGER NOT NULL DEFAULT 0,
      payment_mode TEXT NOT NULL DEFAULT 'credit',
      delivery_mode TEXT NOT NULL DEFAULT 'manual',
      fixed_delivery_url TEXT NOT NULL DEFAULT '',
      fixed_delivery_label TEXT NOT NULL DEFAULT '网盘链接',
      fixed_delivery_links_json TEXT NOT NULL DEFAULT '[]',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      username_lower TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      register_ip TEXT NOT NULL DEFAULT '',
      last_ip TEXT NOT NULL DEFAULT '',
      last_user_agent TEXT NOT NULL DEFAULT '',
      last_seen_at TEXT,
      notification_email TEXT NOT NULL DEFAULT '',
      notify_email_enabled INTEGER NOT NULL DEFAULT 0,
      last_test_email_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      expires_at TEXT NOT NULL
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS oauth_accounts (
      provider TEXT NOT NULL,
      subject TEXT NOT NULL,
      user_id TEXT NOT NULL,
      username TEXT,
      trust_level INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (provider, subject)
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS game_sync (
      user_id TEXT PRIMARY KEY,
      state_json TEXT,
      best_json TEXT,
      client_updated_at INTEGER NOT NULL DEFAULT 0,
      server_updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS leaderboard_scores (
      level TEXT NOT NULL,
      user_id TEXT NOT NULL,
      username TEXT NOT NULL,
      display_name TEXT,
      seconds INTEGER NOT NULL,
      won_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (level, user_id)
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      amount INTEGER NOT NULL DEFAULT 0,
      final_amount INTEGER NOT NULL DEFAULT 0,
      coupon_code TEXT NOT NULL DEFAULT '',
      discount_amount INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pending',
      note TEXT NOT NULL DEFAULT '',
      delivery_content TEXT NOT NULL DEFAULT '',
      delivered INTEGER NOT NULL DEFAULT 0,
      archived INTEGER NOT NULL DEFAULT 0,
      rated INTEGER NOT NULL DEFAULT 0,
      user_info_json TEXT NOT NULL DEFAULT '{}',
      trade_no TEXT NOT NULL DEFAULT '',
      payment_mode TEXT NOT NULL DEFAULT '',
      discounts_json TEXT NOT NULL DEFAULT '[]',
      completed_at TEXT,
      buyer_username TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_cards (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'unused',
      used_by TEXT NOT NULL DEFAULT '',
      order_id TEXT NOT NULL DEFAULT '',
      available_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      used_at TEXT
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_coupons (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      product_id TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL DEFAULT 'fixed',
      value INTEGER NOT NULL DEFAULT 0,
      limit_count INTEGER NOT NULL DEFAULT 0,
      used_count INTEGER NOT NULL DEFAULT 0,
      starts_at TEXT,
      expires_at TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_user_coupons (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE,
      campaign_key TEXT NOT NULL DEFAULT '',
      source_key TEXT NOT NULL DEFAULT '',
      label TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL DEFAULT 'fixed',
      value INTEGER NOT NULL DEFAULT 0,
      product_id TEXT NOT NULL DEFAULT '',
      stackable INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'active',
      reserved_order_id TEXT NOT NULL DEFAULT '',
      used_order_id TEXT NOT NULL DEFAULT '',
      rank INTEGER NOT NULL DEFAULT 0,
      meta_json TEXT NOT NULL DEFAULT '{}',
      starts_at TEXT,
      expires_at TEXT,
      used_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, campaign_key, source_key)
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_ratings (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      username TEXT NOT NULL,
      rating INTEGER NOT NULL DEFAULT 5,
      comment TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_ads (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      image_url TEXT NOT NULL DEFAULT '',
      link_url TEXT NOT NULL DEFAULT '',
      position TEXT NOT NULL DEFAULT 'sidebar',
      status TEXT NOT NULL DEFAULT 'active',
      sort_order INTEGER NOT NULL DEFAULT 0,
      style_json TEXT NOT NULL DEFAULT '{}',
      starts_at TEXT,
      ends_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_feedback (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      username TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL DEFAULT 'bug',
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      reward_amount INTEGER NOT NULL DEFAULT 0,
      admin_note TEXT NOT NULL DEFAULT '',
      reviewed_by TEXT NOT NULL DEFAULT '',
      reviewed_at TEXT,
      submitted_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_feedback_logs (
      id TEXT PRIMARY KEY,
      feedback_id TEXT NOT NULL,
      actor_id TEXT NOT NULL DEFAULT '',
      actor_name TEXT NOT NULL DEFAULT '',
      actor_role TEXT NOT NULL DEFAULT 'user',
      action TEXT NOT NULL DEFAULT '',
      note TEXT NOT NULL DEFAULT '',
      before_json TEXT NOT NULL DEFAULT '{}',
      after_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_ldc_ledger (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      username TEXT NOT NULL DEFAULT '',
      amount INTEGER NOT NULL DEFAULT 0,
      reason TEXT NOT NULL DEFAULT '',
      source_type TEXT NOT NULL DEFAULT '',
      source_id TEXT NOT NULL DEFAULT '',
      created_by TEXT NOT NULL DEFAULT '',
      external_trade_no TEXT NOT NULL DEFAULT '',
      external_status TEXT NOT NULL DEFAULT '',
      external_error TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(source_type, source_id)
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_refunds (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      user_id TEXT NOT NULL DEFAULT '',
      amount INTEGER NOT NULL DEFAULT 0,
      method TEXT NOT NULL DEFAULT 'credit',
      status TEXT NOT NULL DEFAULT 'pending',
      trade_no TEXT NOT NULL DEFAULT '',
      external_response_json TEXT NOT NULL DEFAULT '{}',
      error TEXT NOT NULL DEFAULT '',
      created_by TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(order_id, method)
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_admin_audit_logs (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL DEFAULT '',
      admin_name TEXT NOT NULL DEFAULT '',
      action TEXT NOT NULL DEFAULT '',
      target_type TEXT NOT NULL DEFAULT '',
      target_id TEXT NOT NULL DEFAULT '',
      summary TEXT NOT NULL DEFAULT '',
      before_json TEXT NOT NULL DEFAULT '{}',
      after_json TEXT NOT NULL DEFAULT '{}',
      ip TEXT NOT NULL DEFAULT '',
      user_agent TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_settings (
      key TEXT PRIMARY KEY,
      value_json TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_blacklist (
      id TEXT PRIMARY KEY,
      kind TEXT NOT NULL DEFAULT 'ip',
      value TEXT NOT NULL,
      reason TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL DEFAULT 'manual',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(kind, value)
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_email_templates (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL DEFAULT 'order_delivered',
      name TEXT NOT NULL,
      subject TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      params_json TEXT NOT NULL DEFAULT '[]',
      is_default INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_login_attempts (
      id TEXT PRIMARY KEY,
      ip TEXT NOT NULL DEFAULT '',
      username TEXT NOT NULL DEFAULT '',
      success INTEGER NOT NULL DEFAULT 0,
      reason TEXT NOT NULL DEFAULT '',
      user_agent TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_rate_limits (
      id TEXT PRIMARY KEY,
      scope TEXT NOT NULL,
      subject TEXT NOT NULL,
      ip TEXT NOT NULL DEFAULT '',
      user_id TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_backup_records (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      size_bytes INTEGER NOT NULL DEFAULT 0,
      format TEXT NOT NULL DEFAULT 'sql',
      content_text TEXT NOT NULL DEFAULT '',
      created_by TEXT NOT NULL DEFAULT '',
      backup_type TEXT NOT NULL DEFAULT 'manual',
      scope_json TEXT NOT NULL DEFAULT '["all"]',
      table_count INTEGER NOT NULL DEFAULT 0,
      expires_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_lottery_draws (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      draw_date TEXT NOT NULL,
      scope_key TEXT NOT NULL DEFAULT '',
      prize_label TEXT NOT NULL DEFAULT '',
      prize_value REAL NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, product_id, draw_date)
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL DEFAULT '',
      admin_user_id TEXT NOT NULL DEFAULT '',
      subject TEXT NOT NULL DEFAULT '',
      product_id TEXT NOT NULL DEFAULT '',
      order_id TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'open',
      last_message TEXT NOT NULL DEFAULT '',
      last_sender TEXT NOT NULL DEFAULT '',
      unread_user INTEGER NOT NULL DEFAULT 0,
      unread_admin INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      sender_name TEXT NOT NULL DEFAULT '',
      sender_role TEXT NOT NULL DEFAULT 'user',
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();

  await ensureMallColumn(env, "mall_products", "official_token", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "mall_products", "payment_mode", "TEXT NOT NULL DEFAULT 'credit'");
  await ensureMallColumn(env, "mall_products", "fixed_delivery_url", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "mall_products", "fixed_delivery_label", "TEXT NOT NULL DEFAULT '网盘链接'");
  await ensureMallColumn(env, "mall_products", "fixed_delivery_links_json", "TEXT NOT NULL DEFAULT '[]'");
  await ensureMallColumn(env, "mall_products", "after_sale_enabled", "INTEGER NOT NULL DEFAULT 0");
  await ensureMallColumn(env, "mall_products", "after_sale_guide", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "mall_orders", "payment_mode", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "mall_orders", "discounts_json", "TEXT NOT NULL DEFAULT '[]'");
  await ensureMallColumn(env, "users", "register_ip", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "users", "last_ip", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "users", "last_user_agent", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "users", "last_seen_at", "TEXT");
  await ensureMallColumn(env, "users", "notification_email", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "users", "notify_email_enabled", "INTEGER NOT NULL DEFAULT 0");
  await ensureMallColumn(env, "users", "last_test_email_at", "TEXT");
  await ensureMallColumn(env, "mall_ads", "style_json", "TEXT NOT NULL DEFAULT '{}'");
  await ensureMallColumn(env, "mall_ads", "starts_at", "TEXT");
  await ensureMallColumn(env, "mall_ads", "ends_at", "TEXT");
  await ensureMallColumn(env, "mall_blacklist", "source", "TEXT NOT NULL DEFAULT 'manual'");
  await ensureMallColumn(env, "oauth_accounts", "trust_level", "INTEGER NOT NULL DEFAULT 0");
  await ensureMallColumn(env, "leaderboard_scores", "display_name", "TEXT");
  await ensureMallColumn(env, "mall_conversations", "unread_user", "INTEGER NOT NULL DEFAULT 0");
  await ensureMallColumn(env, "mall_conversations", "unread_admin", "INTEGER NOT NULL DEFAULT 0");
  await ensureMallColumn(env, "mall_email_templates", "event_type", "TEXT NOT NULL DEFAULT 'order_delivered'");
  await ensureMallColumn(env, "mall_email_templates", "params_json", "TEXT NOT NULL DEFAULT '[]'");
  await ensureMallColumn(env, "mall_backup_records", "format", "TEXT NOT NULL DEFAULT 'sql'");
  await ensureMallColumn(env, "mall_backup_records", "content_text", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "mall_backup_records", "created_by", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "mall_backup_records", "backup_type", "TEXT NOT NULL DEFAULT 'manual'");
  await ensureMallColumn(env, "mall_backup_records", "scope_json", "TEXT NOT NULL DEFAULT '[\"all\"]'");
  await ensureMallColumn(env, "mall_backup_records", "table_count", "INTEGER NOT NULL DEFAULT 0");
  await ensureMallColumn(env, "mall_backup_records", "expires_at", "TEXT");
  await ensureMallColumn(env, "mall_lottery_draws", "scope_key", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "mall_feedback", "reward_amount", "INTEGER NOT NULL DEFAULT 0");
  await ensureMallColumn(env, "mall_feedback", "admin_note", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "mall_feedback", "reviewed_by", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "mall_feedback", "reviewed_at", "TEXT");
  await ensureMallColumn(env, "mall_feedback", "submitted_at", "TEXT");
  await ensureMallColumn(env, "mall_feedback_logs", "before_json", "TEXT NOT NULL DEFAULT '{}'");
  await ensureMallColumn(env, "mall_feedback_logs", "after_json", "TEXT NOT NULL DEFAULT '{}'");
  await ensureMallColumn(env, "mall_ldc_ledger", "external_trade_no", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "mall_ldc_ledger", "external_status", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "mall_ldc_ledger", "external_error", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "mall_refunds", "user_id", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "mall_refunds", "amount", "INTEGER NOT NULL DEFAULT 0");
  await ensureMallColumn(env, "mall_refunds", "method", "TEXT NOT NULL DEFAULT 'credit'");
  await ensureMallColumn(env, "mall_refunds", "status", "TEXT NOT NULL DEFAULT 'pending'");
  await ensureMallColumn(env, "mall_refunds", "trade_no", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "mall_refunds", "external_response_json", "TEXT NOT NULL DEFAULT '{}'");
  await ensureMallColumn(env, "mall_refunds", "error", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "mall_refunds", "created_by", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "mall_refunds", "updated_at", "TEXT");
  await ensureMallColumn(env, "mall_admin_audit_logs", "admin_id", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "mall_admin_audit_logs", "admin_name", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "mall_admin_audit_logs", "action", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "mall_admin_audit_logs", "target_type", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "mall_admin_audit_logs", "target_id", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "mall_admin_audit_logs", "summary", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "mall_admin_audit_logs", "before_json", "TEXT NOT NULL DEFAULT '{}'");
  await ensureMallColumn(env, "mall_admin_audit_logs", "after_json", "TEXT NOT NULL DEFAULT '{}'");
  await ensureMallColumn(env, "mall_admin_audit_logs", "ip", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "mall_admin_audit_logs", "user_agent", "TEXT NOT NULL DEFAULT ''");

  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_mall_feedback_user_created ON mall_feedback(user_id, created_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_mall_feedback_status_created ON mall_feedback(status, created_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_mall_feedback_logs_feedback ON mall_feedback_logs(feedback_id, created_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_mall_ldc_user_created ON mall_ldc_ledger(user_id, created_at DESC)").run();
  await env.DB.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_mall_refunds_order_method ON mall_refunds(order_id, method)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_mall_refunds_order ON mall_refunds(order_id)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_mall_refunds_status_created ON mall_refunds(status, created_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_mall_user_coupons_user_status ON mall_user_coupons(user_id, status, expires_at)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_mall_user_coupons_campaign_rank ON mall_user_coupons(campaign_key, source_key, rank, created_at)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_mall_user_coupons_order ON mall_user_coupons(reserved_order_id, used_order_id)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_mall_admin_audit_created ON mall_admin_audit_logs(created_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_mall_admin_audit_target ON mall_admin_audit_logs(target_type, target_id, created_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_mall_rate_limits_scope_subject_created ON mall_rate_limits(scope, subject, created_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_mall_lottery_scope_user_created ON mall_lottery_draws(scope_key, user_id, created_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_mall_email_templates_event_default ON mall_email_templates(event_type, is_default, updated_at DESC)").run();

  const row = await env.DB.prepare("SELECT COUNT(*) AS count FROM mall_products").first();
  if (Number(row?.count || 0) === 0) {
    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO mall_products (
          id, name, description, category, price, original_price, stock, manual_stock, status,
          image_url, images_json, features_json, usage_guide, delivery_mode, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?, 'auto', 10)`
      ).bind(
        "linuxdo-deu-mail",
        "社区大学 DEU 邮箱",
        "高权重教育邮箱，适合学术资源申请与账号绑定。",
        "account",
        50,
        68,
        3,
        0,
        "https://img.icons8.com/isometric/512/message-shared.png",
        JSON.stringify(["https://img.icons8.com/isometric/512/message-shared.png"]),
        JSON.stringify(["自动锁定卡密", "订单云端留痕", "支持一键复制"]),
        "下单后等待管理员确认交付。交付完成后可在我的订单中查看卡密凭证。"
      ),
      env.DB.prepare(
        `INSERT INTO mall_products (
          id, name, description, category, price, original_price, stock, manual_stock, status,
          image_url, images_json, features_json, usage_guide, requires_user_info, delivery_mode, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?, 1, 'manual', 20)`
      ).bind(
        "linuxdo-credit-pack",
        "Linux.do 积分补给包",
        "用于社区权益流转的积分补给记录，支持人工核验交付。",
        "credit",
        120,
        150,
        8,
        8,
        "https://img.icons8.com/isometric/512/combo-chart.png",
        JSON.stringify(["https://img.icons8.com/isometric/512/combo-chart.png"]),
        JSON.stringify(["人工核验", "状态可追踪", "管理员交付"]),
        "请在订单信息中补充接收账号或备注，管理员处理后会更新交付结果。"
      ),
      env.DB.prepare(
        `INSERT INTO mall_products (
          id, name, description, category, price, original_price, stock, manual_stock, status,
          image_url, images_json, features_json, usage_guide, requires_user_info, delivery_mode, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?, 1, 'manual', 30)`
      ).bind(
        "linuxdo-service-pass",
        "专属服务通行证",
        "面向高级用户的权益服务凭证，订单创建后由管理员处理。",
        "service",
        300,
        360,
        5,
        5,
        "https://img.icons8.com/isometric/512/approval.png",
        JSON.stringify(["https://img.icons8.com/isometric/512/approval.png"]),
        JSON.stringify(["专属服务", "人工处理", "售后支持"]),
        "购买后请等待管理员确认，必要时会通过订单备注与你沟通。"
      )
    ]);
  }

  const cardRow = await env.DB.prepare(
    "SELECT COUNT(*) AS count FROM mall_cards WHERE product_id = 'linuxdo-deu-mail'"
  ).first();
  const demoProductRow = await env.DB.prepare(
    "SELECT id FROM mall_products WHERE id = 'linuxdo-deu-mail'"
  ).first();
  if (demoProductRow && Number(cardRow?.count || 0) === 0) {
    await env.DB.batch(["001", "002", "003"].map((suffix) => (
      env.DB.prepare("INSERT INTO mall_cards (id, product_id, content, status) VALUES (?, 'linuxdo-deu-mail', ?, 'unused')")
        .bind(`seed-card-deu-${suffix}`, `账号: deu_user_${suffix} | 密码: linuxdo-${suffix} | 说明: 首次登录后请修改密码`)
    )));
  }

  const settingsRow = await env.DB.prepare("SELECT key FROM mall_settings WHERE key = 'settings'").first();
  if (!settingsRow) {
    await env.DB.prepare("INSERT INTO mall_settings (key, value_json) VALUES ('settings', ?)")
      .bind(JSON.stringify(MALL_DEFAULT_SETTINGS))
      .run();
  }

  const templateRow = await env.DB.prepare("SELECT id FROM mall_email_templates WHERE id = 'default'").first();
  if (!templateRow) {
    await env.DB.prepare(
      `INSERT INTO mall_email_templates (id, event_type, name, subject, content, is_default)
       VALUES ('default', 'order_delivered', ?, ?, ?, 1)`
    ).bind(
      "默认交付通知",
      "您的订单已完成交付 - {order_id}",
      "您好 {username}，订单 {order_id} 已完成交付。\n\n商品：{product_name}\n交付内容：\n{delivery_note}\n\n感谢使用 {site_name}。"
    ).run();
  }
  const createdTemplateRow = await env.DB.prepare("SELECT id FROM mall_email_templates WHERE id = 'default-order-created'").first();
  if (!createdTemplateRow) {
    await env.DB.prepare(
      `INSERT INTO mall_email_templates (id, event_type, name, subject, content, is_default)
       VALUES ('default-order-created', 'order_created', ?, ?, ?, 1)`
    ).bind(
      "默认下单通知",
      "您的订单已创建 - {order_id}",
      "您好 {username}，您的订单已创建。\n\n商品：{product_name}\n订单号：{order_id}\n实付：{amount}\n状态：{order_status}\n下单时间：{order_time}\n\n感谢使用 {site_name}。"
    ).run();
  }
}

async function ensureMallColumn(env, tableName, columnName, definition) {
  try {
    const columns = await env.DB.prepare(`PRAGMA table_info(${tableName})`).all();
    const exists = (columns.results || []).some((column) => column.name === columnName);
    if (!exists) {
      await env.DB.prepare(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`).run();
    }
  } catch {
    // 兼容旧 D1 结构时尽量自愈；失败会在具体读写时暴露。
  }
}

async function ensureAuthSchema(env) {
  if (authSchemaRepairPromise) {
    return authSchemaRepairPromise;
  }
  authSchemaRepairPromise = ensureAuthSchemaFull(env).finally(() => {
    authSchemaRepairPromise = null;
  });
  return authSchemaRepairPromise;
}

async function ensureAuthSchemaFull(env) {
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      username_lower TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      register_ip TEXT NOT NULL DEFAULT '',
      last_ip TEXT NOT NULL DEFAULT '',
      last_user_agent TEXT NOT NULL DEFAULT '',
      last_seen_at TEXT,
      notification_email TEXT NOT NULL DEFAULT '',
      notify_email_enabled INTEGER NOT NULL DEFAULT 0,
      last_test_email_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
  await ensureMallColumn(env, "users", "register_ip", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "users", "last_ip", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "users", "last_user_agent", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "users", "last_seen_at", "TEXT");
  await ensureMallColumn(env, "users", "notification_email", "TEXT NOT NULL DEFAULT ''");
  await ensureMallColumn(env, "users", "notify_email_enabled", "INTEGER NOT NULL DEFAULT 0");
  await ensureMallColumn(env, "users", "last_test_email_at", "TEXT");
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      expires_at TEXT NOT NULL
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS oauth_accounts (
      provider TEXT NOT NULL,
      subject TEXT NOT NULL,
      user_id TEXT NOT NULL,
      username TEXT,
      trust_level INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (provider, subject)
    )`
  ).run();
}

async function ensureMallChatSchema(env) {
  if (chatSchemaRepairPromise) {
    return chatSchemaRepairPromise;
  }
  chatSchemaRepairPromise = ensureMallChatSchemaFull(env).finally(() => {
    chatSchemaRepairPromise = null;
  });
  return chatSchemaRepairPromise;
}

async function ensureMallChatSchemaFull(env) {
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL DEFAULT '',
      admin_user_id TEXT NOT NULL DEFAULT '',
      subject TEXT NOT NULL DEFAULT '',
      product_id TEXT NOT NULL DEFAULT '',
      order_id TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'open',
      last_message TEXT NOT NULL DEFAULT '',
      last_sender TEXT NOT NULL DEFAULT '',
      unread_user INTEGER NOT NULL DEFAULT 0,
      unread_admin INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS mall_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      sender_name TEXT NOT NULL DEFAULT '',
      sender_role TEXT NOT NULL DEFAULT 'user',
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
}

async function loadMallProducts(env, options = {}) {
  const rows = await env.DB.prepare(
    `SELECT
       mall_products.*,
       COALESCE(order_stats.sales, 0) AS sales,
       COALESCE(rating_stats.rating_count, 0) AS rating_count,
       COALESCE(rating_stats.avg_rating, 5) AS avg_rating
     FROM mall_products
     LEFT JOIN (
       SELECT product_id, SUM(quantity) AS sales
       FROM mall_orders
       WHERE status = 'completed'
       GROUP BY product_id
     ) order_stats ON order_stats.product_id = mall_products.id
     LEFT JOIN (
       SELECT product_id, COUNT(*) AS rating_count, AVG(rating) AS avg_rating
       FROM mall_ratings
       GROUP BY product_id
     ) rating_stats ON rating_stats.product_id = mall_products.id
     ${options.includeDeleted ? "" : "WHERE mall_products.status = 'active'"}
     ORDER BY mall_products.sort_order ASC, mall_products.created_at DESC`
  ).all();
  const products = (rows.results || []).map(formatMallProduct);
  await attachMallStock(env, products);
  return products;
}

async function loadMallProduct(env, productId, options = {}) {
  if (!normalizeMallId(productId)) {
    return null;
  }
  const row = await env.DB.prepare(
    `SELECT
       mall_products.*,
       COALESCE(order_stats.sales, 0) AS sales,
       COALESCE(rating_stats.rating_count, 0) AS rating_count,
       COALESCE(rating_stats.avg_rating, 5) AS avg_rating
     FROM mall_products
     LEFT JOIN (
       SELECT product_id, SUM(quantity) AS sales
       FROM mall_orders
       WHERE status = 'completed'
       GROUP BY product_id
     ) order_stats ON order_stats.product_id = mall_products.id
     LEFT JOIN (
       SELECT product_id, COUNT(*) AS rating_count, AVG(rating) AS avg_rating
       FROM mall_ratings
       GROUP BY product_id
     ) rating_stats ON rating_stats.product_id = mall_products.id
     WHERE mall_products.id = ?`
  ).bind(productId).first();
  if (!row || (!options.includeInactive && row.status !== "active")) {
    return null;
  }
  const product = formatMallProduct(row);
  await attachMallStock(env, [product]);
  return product;
}

async function attachMallStock(env, products) {
  if (!products.length) {
    return;
  }
  const stockRows = await env.DB.prepare(
    `SELECT product_id, COUNT(*) AS count
     FROM mall_cards
     WHERE status IN ('unused', 'scheduled') AND (available_at IS NULL OR available_at <= CURRENT_TIMESTAMP)
     GROUP BY product_id`
  ).all();
  const autoStock = new Map((stockRows.results || []).map((row) => [row.product_id, Number(row.count || 0)]));
  for (const product of products) {
    if (product.deliveryMode === "fixed_link") {
      product.stock = ADMIN_MAX_LIST_LIMIT;
      product.unlimitedStock = true;
    } else if (product.deliveryMode === "auto") {
      product.stock = autoStock.get(product.id) || 0;
    } else {
      product.stock = Number(product.manualStock || product.stock || 0);
    }
  }
}

async function getMallProductStock(env, product) {
  if ((product?.deliveryMode || "manual") === "fixed_link") {
    return ADMIN_MAX_LIST_LIMIT;
  }
  const list = [{ ...product }];
  await attachMallStock(env, list);
  return Number(list[0].stock || 0);
}

function canReplenishMallProduct(product) {
  return Boolean(product && product.deliveryMode === "auto" && product.status === "active");
}

function isAutoDeliverableProduct(product) {
  return ["auto", "fixed_link"].includes(product?.deliveryMode || "manual");
}

function buildFixedLinkDeliveryContent(product) {
  const items = normalizeNetdiskDeliveryItems(product?.fixedDeliveryItems || []);
  if (items.length) {
    return items
      .map((item, index) => {
        const codeText = item.accessCode ? ` 提取码：${item.accessCode}` : "";
        return `${index + 1}. ${getNetdiskProviderLabel(item.provider, item.url)}｜${item.label}：${item.url}${codeText}`;
      })
      .join("\n");
  }
  const url = normalizeFixedDeliveryUrl(product?.fixedDeliveryUrl || "");
  if (!url) {
    throw new ApiError(400, "fixed_delivery_not_configured", "固定链接发货商品未配置有效网盘链接");
  }
  const label = normalizeText(product?.fixedDeliveryLabel || "网盘链接", 80);
  return `${label}：${url}`;
}

async function getNextMallProductId(env) {
  const rows = await env.DB.prepare("SELECT id FROM mall_products").all();
  const used = new Set((rows.results || []).map((row) => String(row.id || "")));
  let max = 0;
  for (const id of used) {
    const match = id.match(/(?:^|-)product-(\d+)$/i) || id.match(/^product-(\d+)$/i);
    if (match) {
      max = Math.max(max, Number.parseInt(match[1], 10) || 0);
    }
  }
  let next = Math.max(max, used.size) + 1;
  let candidate = "";
  do {
    candidate = `product-${String(next).padStart(4, "0")}`;
    next += 1;
  } while (used.has(candidate));
  return candidate;
}

async function loadMallOrders(env, user, options = {}) {
  const includeArchived = Boolean(options.includeArchived);
  const rows = await env.DB.prepare(
    `SELECT mall_orders.*, mall_products.delivery_mode AS product_delivery_mode, users.username, oauth_accounts.username AS linuxdo_username
     FROM mall_orders
     LEFT JOIN users ON users.id = mall_orders.user_id
      LEFT JOIN oauth_accounts ON oauth_accounts.user_id = users.id
     LEFT JOIN mall_products ON mall_products.id = mall_orders.product_id
     WHERE mall_orders.user_id = ? ${includeArchived ? "" : "AND mall_orders.archived = 0"}
     ORDER BY mall_orders.created_at DESC
     LIMIT ?`
  ).bind(user.id, options.limit || 80).all();
  return (rows.results || []).map(formatMallOrder);
}

async function loadMallAdminOrders(env, limit = 100) {
  await expirePendingMallOrders(env);
  const safeLimit = normalizeAdminListLimit(limit, 100);
  const rows = await env.DB.prepare(
    `SELECT mall_orders.*, mall_products.delivery_mode AS product_delivery_mode, users.username, oauth_accounts.username AS linuxdo_username
     FROM mall_orders
     LEFT JOIN users ON users.id = mall_orders.user_id
     LEFT JOIN oauth_accounts ON oauth_accounts.user_id = users.id
     LEFT JOIN mall_products ON mall_products.id = mall_orders.product_id
     ORDER BY mall_orders.created_at DESC
     LIMIT ?`
  ).bind(safeLimit).all();
  return (rows.results || []).map(formatMallOrder);
}

async function loadMallChatConversations(env, options = {}) {
  const limit = normalizeAdminListLimit(options.limit || 100, 100);
  const where = options.admin ? "" : "WHERE c.user_id = ?";
  const statement = env.DB.prepare(
    `SELECT c.*,
            EXISTS(
              SELECT 1 FROM mall_messages m
              WHERE m.conversation_id = c.id AND m.sender_role = 'admin'
            ) AS admin_replied
     FROM mall_conversations c
     ${where}
     ORDER BY c.updated_at DESC
     LIMIT ?`
  );
  const rows = options.admin
    ? await statement.bind(limit).all()
    : await statement.bind(options.userId, Math.min(limit, ADMIN_MAX_LIST_LIMIT)).all();
  return (rows.results || []).map(formatMallConversation);
}

async function loadMallFeedback(env, options = {}) {
  const limit = normalizeAdminListLimit(options.limit || 100, 100);
  const deletedClause = options.includeDeleted ? "" : "f.status != 'deleted'";
  const whereParts = [];
  if (!options.admin) whereParts.push("f.user_id = ?");
  if (deletedClause) whereParts.push(deletedClause);
  const where = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";
  const statement = env.DB.prepare(
    `SELECT f.*, reviewer.username AS reviewer_username
     FROM mall_feedback f
     LEFT JOIN users reviewer ON reviewer.id = f.reviewed_by
     ${where}
     ORDER BY f.created_at DESC
     LIMIT ?`
  );
  const rows = options.admin
    ? await statement.bind(limit).all()
    : await statement.bind(options.userId, limit).all();
  return (rows.results || []).map(formatMallFeedback);
}

async function loadMallFeedbackItem(env, feedbackId) {
  const row = await env.DB.prepare(
    `SELECT f.*, reviewer.username AS reviewer_username
     FROM mall_feedback f
     LEFT JOIN users reviewer ON reviewer.id = f.reviewed_by
     WHERE f.id = ?`
  ).bind(feedbackId).first();
  return row ? formatMallFeedback(row) : null;
}

async function loadMallLdcLedger(env, limit = 200) {
  const safeLimit = normalizeAdminListLimit(limit, 200);
  const rows = await env.DB.prepare(
    `SELECT id, user_id, username, amount, reason, source_type, source_id, created_by,
            external_trade_no, external_status, external_error, created_at
     FROM mall_ldc_ledger
     ORDER BY created_at DESC
     LIMIT ?`
  ).bind(safeLimit).all();
  return (rows.results || []).map(formatMallLdcLedger);
}

async function loadMallFeedbackLedger(env, feedbackId) {
  const row = await env.DB.prepare(
    `SELECT id, user_id, username, amount, reason, source_type, source_id, created_by,
            external_trade_no, external_status, external_error, created_at
     FROM mall_ldc_ledger
     WHERE source_type = 'feedback' AND source_id = ?`
  ).bind(feedbackId).first();
  return row ? formatMallLdcLedger(row) : null;
}

async function loadMallRefunds(env, limit = 300) {
  const safeLimit = normalizeAdminListLimit(limit, 300);
  const rows = await env.DB.prepare(
    `SELECT id, order_id, user_id, amount, method, status, trade_no, external_response_json,
            error, created_by, created_at, updated_at
     FROM mall_refunds
     ORDER BY created_at DESC
     LIMIT ?`
  ).bind(safeLimit).all();
  return (rows.results || []).map(formatMallRefund);
}

async function loadMallRefundByOrder(env, orderId, method = "credit") {
  const row = await env.DB.prepare(
    `SELECT id, order_id, user_id, amount, method, status, trade_no, external_response_json,
            error, created_by, created_at, updated_at
     FROM mall_refunds
     WHERE order_id = ? AND method = ?`
  ).bind(orderId, method).first();
  return row ? formatMallRefund(row) : null;
}

async function loadMallAdminAuditLogs(env, limit = 300) {
  const safeLimit = normalizeAdminListLimit(limit, 300);
  const rows = await env.DB.prepare(
    `SELECT id, admin_id, admin_name, action, target_type, target_id, summary,
            before_json, after_json, ip, user_agent, created_at
     FROM mall_admin_audit_logs
     ORDER BY created_at DESC
     LIMIT ?`
  ).bind(safeLimit).all();
  return (rows.results || []).map(formatMallAdminAuditLog);
}

async function loadMallFeedbackLogs(env, options = {}) {
  const limit = normalizeAdminListLimit(options.limit || 300, 300);
  const where = options.feedbackId ? "WHERE feedback_id = ?" : "";
  const statement = env.DB.prepare(
    `SELECT id, feedback_id, actor_id, actor_name, actor_role, action, note, before_json, after_json, created_at
     FROM mall_feedback_logs
     ${where}
     ORDER BY created_at DESC
     LIMIT ?`
  );
  const rows = options.feedbackId
    ? await statement.bind(options.feedbackId, limit).all()
    : await statement.bind(limit).all();
  return (rows.results || []).map(formatMallFeedbackLog);
}

async function recordMallFeedbackLog(env, entry = {}) {
  await env.DB.prepare(
    `INSERT INTO mall_feedback_logs (
      id, feedback_id, actor_id, actor_name, actor_role, action, note, before_json, after_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    crypto.randomUUID(),
    normalizeText(entry.feedbackId, 80),
    normalizeText(entry.actorId, 80),
    normalizeText(entry.actorName, 120),
    normalizeChoice(entry.actorRole, ["user", "admin", "system"], "user"),
    normalizeText(entry.action, 40),
    normalizeText(entry.note, 1000),
    JSON.stringify(entry.before ?? {}),
    JSON.stringify(entry.after ?? {})
  ).run();
}

async function recordMallAdminAudit(request, env, admin, entry = {}) {
  try {
    await env.DB.prepare(
      `INSERT INTO mall_admin_audit_logs (
        id, admin_id, admin_name, action, target_type, target_id, summary,
        before_json, after_json, ip, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      crypto.randomUUID(),
      normalizeText(admin?.id, 80),
      normalizeText(admin?.linuxdo?.username || admin?.username || "", 120),
      normalizeText(entry.action, 80),
      normalizeText(entry.targetType, 80),
      normalizeText(entry.targetId, 160),
      normalizeText(entry.summary, 500),
      auditJson(entry.before),
      auditJson(entry.after),
      request ? getClientIp(request) : "",
      request ? normalizeText(request.headers.get("User-Agent") || "", 500) : ""
    ).run();
  } catch {
    // 审计写入失败不能影响管理员主操作。
  }
}

function auditJson(value) {
  try {
    const text = JSON.stringify(auditSafeValue(value ?? null));
    if (text.length <= 20000) {
      return text;
    }
    return JSON.stringify({ truncated: true, preview: text.slice(0, 19000) });
  } catch {
    return "{}";
  }
}

function auditSafeValue(value, depth = 0) {
  if (depth > 6) {
    return "[MaxDepth]";
  }
  if (value === null || value === undefined || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.slice(0, 100).map((item) => auditSafeValue(item, depth + 1));
  }
  const output = {};
  for (const [key, item] of Object.entries(value).slice(0, 120)) {
    if (isSensitiveAuditKey(key)) {
      output[key] = item ? "***" : "";
    } else {
      output[key] = auditSafeValue(item, depth + 1);
    }
  }
  return output;
}

function summarizeAuditItems(items, mapper = (item) => item, limit = 30) {
  const list = Array.isArray(items) ? items : [];
  return {
    count: list.length,
    truncated: list.length > limit,
    sample: list.slice(0, limit).map((item) => mapper(item))
  };
}

function summarizeBatchMutation(ids, extra = {}, limit = 80) {
  const list = Array.isArray(ids) ? ids : [];
  return {
    ...extra,
    requested: list.length,
    ids: list.slice(0, limit),
    truncated: list.length > limit
  };
}

function isSensitiveAuditKey(key) {
  return /password|secret|token|api[_-]?key|push[_-]?key|content_text/i.test(String(key || ""));
}

async function getMallUserLdcBalance(env, userId) {
  const row = await env.DB.prepare(
    "SELECT COALESCE(SUM(amount), 0) AS balance FROM mall_ldc_ledger WHERE user_id = ?"
  ).bind(userId).first();
  return Number(row?.balance || 0);
}

async function getMallUserTotalSpent(env, userId) {
  const row = await env.DB.prepare(
    "SELECT COALESCE(SUM(final_amount), 0) AS total FROM mall_orders WHERE user_id = ? AND status IN ('processing', 'completed')"
  ).bind(userId).first();
  return Number(row?.total || 0);
}

async function loadMallChatConversation(env, conversationId) {
  const row = await env.DB.prepare(
    `SELECT c.*,
            EXISTS(
              SELECT 1 FROM mall_messages m
              WHERE m.conversation_id = c.id AND m.sender_role = 'admin'
            ) AS admin_replied
     FROM mall_conversations c
     WHERE c.id = ?`
  )
    .bind(conversationId)
    .first();
  return row ? formatMallConversation(row) : null;
}

async function loadMallChatMessages(env, conversationId, afterId = 0) {
  const rows = await env.DB.prepare(
    `SELECT id, conversation_id, sender_id, sender_name, sender_role, content, created_at
     FROM mall_messages
     WHERE conversation_id = ? AND id > ?
     ORDER BY id ASC
     LIMIT 200`
  ).bind(conversationId, afterId).all();
  return (rows.results || []).map(formatMallMessage);
}

async function getOrCreateMallConversation(env, user, body = {}) {
  const settings = await getMallSettings(env);
  const orderId = normalizeText(body.orderId, 80);
  let order = null;
  let existing = null;
  let subject = normalizeText(body.subject, 120) || "商城咨询";

  if (orderId) {
    if (!isUuidLike(orderId)) {
      throw new ApiError(400, "invalid_order", "订单无效");
    }
    order = await loadMallOrder(env, orderId);
    assertMallOrderOwner(order, user);
    assertMallOrderChatAllowed(order, settings.limits);
    subject = normalizeText(body.subject, 120) || `咨询订单：${order.productName}`;
    existing = await env.DB.prepare(
      "SELECT * FROM mall_conversations WHERE user_id = ? AND order_id = ? AND status != 'closed' ORDER BY updated_at DESC LIMIT 1"
    ).bind(user.id, orderId).first();
  } else {
    existing = await env.DB.prepare(
      "SELECT * FROM mall_conversations WHERE user_id = ? AND order_id = '' AND product_id = '' AND status != 'closed' ORDER BY updated_at DESC LIMIT 1"
    ).bind(user.id).first();
  }

  if (existing) {
    return await loadMallChatConversation(env, existing.id);
  }

  const id = crypto.randomUUID();
  const displayName = user.linuxdo?.username || user.username;
  await env.DB.prepare(
    `INSERT INTO mall_conversations (
      id, user_id, user_name, subject, product_id, order_id, status, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, 'open', CURRENT_TIMESTAMP)`
  ).bind(id, user.id, displayName, subject, order?.productId || "", order?.id || "").run();
  return await loadMallChatConversation(env, id);
}

async function createMallChatMessage(env, conversation, user, body = {}, senderRole = "user", options = {}) {
  if (!conversation) {
    throw new ApiError(404, "conversation_not_found", "会话不存在");
  }
  if (conversation.status === "closed") {
    throw new ApiError(400, "conversation_closed", "该会话已关闭");
  }
  const settings = await getMallSettings(env);
  const limits = settings.limits || DEFAULT_MALL_LIMITS;
  const generalUserLimited = senderRole !== "admin" && !conversation.orderId && !conversation.adminReplied;
  if (conversation.orderId) {
    const order = await loadMallOrder(env, conversation.orderId);
    if (senderRole !== "admin") {
      assertMallOrderOwner(order, user);
    }
    assertMallOrderChatAllowed(order, limits);
  } else if (generalUserLimited) {
    await assertGeneralChatCanSend(env, conversation, limits);
  }
  const content = await sanitizeMallChatContent(body, {
    generalUser: generalUserLimited,
    limits,
    request: options?.request,
    env,
    user
  });
  const senderName = user.linuxdo?.username || user.username || (senderRole === "admin" ? "管理员" : "用户");
  const result = await env.DB.prepare(
    `INSERT INTO mall_messages (conversation_id, sender_id, sender_name, sender_role, content)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(conversation.id, user.id, senderName, senderRole, content).run();
  const unreadUser = senderRole === "admin" ? 1 : 0;
  const unreadAdmin = senderRole === "admin" ? 0 : 1;
  await env.DB.prepare(
    `UPDATE mall_conversations
     SET last_message = ?, last_sender = ?, unread_user = unread_user + ?, unread_admin = unread_admin + ?,
         status = 'open', updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  ).bind(content, senderRole, unreadUser, unreadAdmin, conversation.id).run();
  const id = Number(result.meta?.last_row_id || 0);
  const messages = await loadMallChatMessages(env, conversation.id, Math.max(0, id - 1));
  return messages.find((message) => message.id === id) || messages.at(-1) || null;
}

async function markMallChatRead(env, conversationId, role) {
  const column = role === "admin" ? "unread_admin" : "unread_user";
  await env.DB.prepare(`UPDATE mall_conversations SET ${column} = 0 WHERE id = ?`)
    .bind(conversationId)
    .run();
}

async function assertGeneralChatCanSend(env, conversation, limits = DEFAULT_MALL_LIMITS) {
  const maxFirstMessages = normalizeMallLimits(limits).generalChatFirstMessages;
  const adminReply = await env.DB.prepare(
    "SELECT 1 FROM mall_messages WHERE conversation_id = ? AND sender_role = 'admin' LIMIT 1"
  ).bind(conversation.id).first();
  if (adminReply) {
    return;
  }
  const row = await env.DB.prepare(
    "SELECT COUNT(*) AS count FROM mall_messages WHERE conversation_id = ? AND sender_role = 'user'"
  ).bind(conversation.id).first();
  if (Number(row?.count || 0) >= maxFirstMessages) {
    throw new ApiError(429, "waiting_admin_reply", `管理员回复前最多只能发送 ${maxFirstMessages} 条消息`);
  }
}

async function sanitizeMallChatContent(body, options = {}) {
  const limits = normalizeMallLimits(options.limits || DEFAULT_MALL_LIMITS);
  const rawContent = typeof body === "object" && body !== null ? body.content : body;
  const imageUrl = typeof body === "object" && body !== null ? normalizeText(body.imageUrl, 600) : "";
  let content = String(rawContent ?? "")
    .replace(/\r\n?/g, "\n")
    .trim()
    .slice(0, limits.chatMaxChars);
  content = normalizeSafeHtmlMarkdownInput(content);
  if (imageUrl) {
    const resolvedImageUrl = await resolveChatImageUrlWithContext(options, imageUrl);
    content = `${content}${content ? "\n\n" : ""}![图片](${resolvedImageUrl})`;
  }
  if (!content) {
    throw new ApiError(400, "empty_message", "消息内容不能为空");
  }
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(content)) {
    throw new ApiError(400, "unsafe_message", "消息包含非法控制字符");
  }
  if (/<\/?[a-z][\s\S]*>/i.test(content)) {
    throw new ApiError(400, "unsafe_message", "消息包含未支持的 HTML 或脚本标签");
  }
  if (/\b(?:javascript|vbscript|data):/i.test(content) || /\bon[a-z]+\s*=/i.test(content)) {
    throw new ApiError(400, "unsafe_message", "消息包含高风险脚本内容");
  }
  if (/\b(?:eval|Function|setTimeout|setInterval)\s*\(/i.test(content)) {
    throw new ApiError(400, "unsafe_message", "消息不允许包含脚本代码");
  }
  if (/\b(?:document|window|localStorage|sessionStorage)\s*[\.\[]/i.test(content) || /(?:^|[;\s])import\s+[\w*{]/i.test(content)) {
    throw new ApiError(400, "unsafe_message", "消息不允许包含脚本代码");
  }
  const imageMatches = [...content.matchAll(/!\[([^\]]{0,80})]\(([^)]+)\)/g)];
  const imageUrls = imageMatches.map((match) => String(match[2] || "").trim());
  const maxImages = options.generalUser ? limits.generalChatMaxImages : limits.chatMaxImages;
  if (imageUrls.length > maxImages) {
    throw new ApiError(400, "too_many_images", `最多允许添加 ${maxImages} 张图片`);
  }
  for (const match of imageMatches) {
    const alt = String(match[1] || "");
    const url = String(match[2] || "").trim();
    const resolvedUrl = await resolveChatImageUrlWithContext(options, url);
    if (resolvedUrl !== url) {
      content = content.replace(match[0], `![${alt}](${resolvedUrl})`);
    }
  }
  const links = content.matchAll(/\[[^\]]+]\(([^)]+)\)/g);
  for (const match of links) {
    const url = String(match[1] || "").trim();
    if (!/^https?:\/\//i.test(url) || /[\s<>]/.test(url)) {
      throw new ApiError(400, "unsafe_message", "Markdown 链接只允许 http/https 地址");
    }
  }
  if (options.generalUser) {
    const textOnly = content
      .replace(/!\[[^\]]{0,80}]\([^)]+\)/g, "")
      .replace(/\[[^\]]+]\([^)]+\)/g, "")
      .replace(/[*_~`>#\-|\s]/g, "")
      .trim();
    if ([...textOnly].length > limits.generalChatMaxChars) {
      throw new ApiError(400, "general_chat_too_long", `普通咨询文字部分不能超过 ${limits.generalChatMaxChars} 字`);
    }
  }
  return content;
}

function normalizeSafeHtmlMarkdownInput(value) {
  let text = String(value || "");
  if (!/<\/?[a-z][\s\S]*?>/i.test(text)) {
    return text;
  }

  text = text
    .replace(/<h([1-6])\s*>\s*([\s\S]*?)\s*<\/h\1\s*>/gi, (_match, level, content) => `\n${"#".repeat(Number(level))} ${content.trim()}\n`)
    .replace(/<h([1-6])\s*>/gi, (_match, level) => `${"#".repeat(Number(level))} `)
    .replace(/<\/h[1-6]\s*>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<hr\s*\/?>/gi, "\n---\n")
    .replace(/<(strong|b)\s*>\s*([\s\S]*?)\s*<\/\1\s*>/gi, "**$2**")
    .replace(/<(em|i)\s*>\s*([\s\S]*?)\s*<\/\1\s*>/gi, "*$2*")
    .replace(/<(del|s)\s*>\s*([\s\S]*?)\s*<\/\1\s*>/gi, "~~$2~~")
    .replace(/<code\s*>\s*([\s\S]*?)\s*<\/code\s*>/gi, "`$1`")
    .replace(/<pre\s*>\s*([\s\S]*?)\s*<\/pre\s*>/gi, "\n```text\n$1\n```\n")
    .replace(/<blockquote\s*>\s*([\s\S]*?)\s*<\/blockquote\s*>/gi, (_match, content) => `\n${content.split(/\r?\n/).map((line) => `> ${line.trim()}`).join("\n")}\n`)
    .replace(/<\/?(ul|ol)\s*>/gi, "\n")
    .replace(/<li\s*>\s*([\s\S]*?)\s*<\/li\s*>/gi, "- $1\n")
    .replace(/<p\s*>\s*([\s\S]*?)\s*<\/p\s*>/gi, "\n$1\n")
    .replace(/<\/?p\s*>/gi, "\n");

  return text.replace(/\n{3,}/g, "\n\n").trim();
}

async function resolveChatImageUrl(url) {
  const text = normalizeText(url, 1000);
  const parsed = parsePublicHttpUrl(text);
  if (isDirectChatImageUrl(parsed)) {
    assertSafeChatImageUrl(text);
    return text;
  }
  if (isBingImageDetailUrl(parsed)) {
    const resolved = await resolveBingImageDetailUrl(parsed);
    assertSafeChatImageUrl(resolved);
    return resolved;
  }
  throw new ApiError(400, "unsafe_image", "图片地址必须是 png、jpg、jpeg、gif、webp、avif，或 Bing 图片详情页");
}

async function resolveChatImageUrlForRequest(request, env, user, url) {
  const text = normalizeText(url, 1000);
  if (text && /https?:\/\/(?:[^/?#]+\.)?bing\.com\/images\/search/i.test(text)) {
    const settings = await getMallSettings(env);
    await assertMallRateLimit(request, env, user, "bing_image_resolve", {
      ...(settings.limits?.rateLimits?.bingImageResolve || DEFAULT_RATE_LIMITS.bingImageResolve),
      message: "Bing 图片解析过于频繁，请稍后再试"
    });
  }
  return await resolveChatImageUrl(text);
}

async function resolveChatImageUrlWithContext(context = {}, url) {
  if (context.request && context.env && context.user) {
    return await resolveChatImageUrlForRequest(context.request, context.env, context.user, url);
  }
  return await resolveChatImageUrl(url);
}

function assertSafeChatImageUrl(url) {
  const text = String(url || "").trim();
  if (!/^https?:\/\//i.test(text) || /[\s<>]/.test(text)) {
    throw new ApiError(400, "unsafe_image", "图片只允许 http/https 地址");
  }
  const parsed = parsePublicHttpUrl(text);
  if (!isDirectChatImageUrl(parsed)) {
    throw new ApiError(400, "unsafe_image", "图片地址必须是 png、jpg、jpeg、gif、webp 或 avif");
  }
}

function parsePublicHttpUrl(value) {
  const text = String(value || "").trim();
  let parsed;
  try {
    parsed = new URL(text);
  } catch {
    throw new ApiError(400, "unsafe_image", "图片地址无效");
  }
  if (!["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password) {
    throw new ApiError(400, "unsafe_image", "图片只允许普通 http/https 地址");
  }
  if (parsed.protocol === "http:" && !isLocalDevelopmentHost(parsed.hostname)) {
    throw new ApiError(400, "unsafe_image", "公网图片必须使用 https 地址");
  }
  const host = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (!host || host === "localhost" || host.endsWith(".localhost") || host === "0.0.0.0") {
    throw new ApiError(400, "unsafe_image", "图片地址不能指向本机或内网");
  }
  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const parts = ipv4.slice(1).map((part) => Number(part));
    const [a, b] = parts;
    if (parts.some((part) => part < 0 || part > 255) || a === 10 || a === 127 || a === 0 || a === 169 && b === 254 || a === 172 && b >= 16 && b <= 31 || a === 192 && b === 168) {
      throw new ApiError(400, "unsafe_image", "图片地址不能指向本机或内网");
    }
  }
  if (host.includes(":") && (host === "::1" || host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80"))) {
    throw new ApiError(400, "unsafe_image", "图片地址不能指向本机或内网");
  }
  return parsed;
}

function isLocalDevelopmentHost(hostname) {
  const host = String(hostname || "").toLowerCase().replace(/^\[|\]$/g, "");
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

function isDirectChatImageUrl(parsed) {
  if (/\.(?:png|jpe?g|gif|webp|avif)(?:$|[?#])/i.test(parsed.pathname)) {
    return true;
  }
  const host = parsed.hostname.toLowerCase();
  return host === "th.bing.com" || host.endsWith(".mm.bing.net");
}

function isBingImageDetailUrl(parsed) {
  const host = parsed.hostname.toLowerCase();
  return (host === "bing.com" || host.endsWith(".bing.com"))
    && parsed.pathname.toLowerCase() === "/images/search"
    && (parsed.searchParams.get("view") === "detailV2" || parsed.searchParams.has("id") || parsed.searchParams.has("ccid"));
}

async function resolveBingImageDetailUrl(parsed) {
  const queryCandidate = getBingImageUrlFromQuery(parsed);
  if (queryCandidate) {
    return queryCandidate;
  }
  const response = await fetch(parsed.toString(), {
    redirect: "follow",
    headers: {
      "Accept": "text/html,application/xhtml+xml",
      "User-Agent": "Mozilla/5.0 ImageResolver/1.0"
    }
  });
  if (!response.ok) {
    throw new ApiError(400, "bing_image_unreachable", "无法读取 Bing 图片详情页，请复制图片地址或稍后重试");
  }
  const length = Number(response.headers.get("content-length") || 0);
  if (length > 800000) {
    throw new ApiError(400, "bing_image_too_large", "Bing 图片详情页过大，请复制图片地址");
  }
  const html = (await response.text()).slice(0, 800000);
  for (const candidate of extractBingImageCandidates(html)) {
    try {
      const parsedCandidate = parsePublicHttpUrl(candidate);
      if (isDirectChatImageUrl(parsedCandidate)) {
        return parsedCandidate.toString();
      }
    } catch {
      // Continue trying the next candidate.
    }
  }
  throw new ApiError(400, "bing_image_not_found", "无法从 Bing 图片页解析真实图片，请复制图片地址或上传本地图片");
}

function getBingImageUrlFromQuery(parsed) {
  for (const key of ["mediaurl", "murl", "imgurl", "rurl"]) {
    const value = parsed.searchParams.get(key);
    if (!value) continue;
    const candidate = cleanExtractedUrl(value);
    try {
      const candidateUrl = parsePublicHttpUrl(candidate);
      if (isDirectChatImageUrl(candidateUrl)) {
        return candidateUrl.toString();
      }
    } catch {
      // Try other parameters.
    }
  }
  return "";
}

function extractBingImageCandidates(html) {
  const candidates = [];
  const push = (value) => {
    const candidate = cleanExtractedUrl(value);
    if (candidate && !candidates.includes(candidate)) {
      candidates.push(candidate);
    }
  };
  const patterns = [
    /"murl"\s*:\s*"([^"]+)"/gi,
    /"mediaurl"\s*:\s*"([^"]+)"/gi,
    /"imgurl"\s*:\s*"([^"]+)"/gi,
    /&quot;murl&quot;\s*:\s*&quot;([^&]+)&quot;/gi,
    /&quot;mediaurl&quot;\s*:\s*&quot;([^&]+)&quot;/gi,
    /(?:murl|mediaurl|imgurl)=([^&"'<>]+)/gi,
    /https?:\\?\/\\?\/[^"'<>\\\s]+?\.(?:png|jpe?g|gif|webp|avif)(?:[?#][^"'<>\\\s]*)?/gi
  ];
  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      push(match[1] || match[0]);
      if (candidates.length >= 20) {
        return candidates;
      }
    }
  }
  return candidates;
}

function cleanExtractedUrl(value) {
  let text = String(value || "").trim()
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/\\u002f/gi, "/")
    .replace(/\\u0026/gi, "&")
    .replace(/\\\//g, "/");
  for (let index = 0; index < 2; index += 1) {
    try {
      const decoded = decodeURIComponent(text);
      if (decoded === text) break;
      text = decoded;
    } catch {
      break;
    }
  }
  return text.replace(/\\+"/g, "\"").trim();
}

function assertMallChatAccess(conversation, user) {
  if (!conversation) {
    throw new ApiError(404, "conversation_not_found", "会话不存在");
  }
  if (isSuperAdminUser(user) || conversation.userId === user.id) {
    return;
  }
  throw new ApiError(403, "chat_forbidden", "无权访问该会话");
}

async function loadMallOrder(env, orderId) {
  if (!isUuidLike(orderId)) {
    return null;
  }
  const row = await env.DB.prepare(
    `SELECT mall_orders.*, mall_products.delivery_mode AS product_delivery_mode, users.username, oauth_accounts.username AS linuxdo_username
     FROM mall_orders
     LEFT JOIN users ON users.id = mall_orders.user_id
     LEFT JOIN oauth_accounts ON oauth_accounts.user_id = users.id
     LEFT JOIN mall_products ON mall_products.id = mall_orders.product_id
     WHERE mall_orders.id = ?`
  ).bind(orderId).first();
  return row ? formatMallOrder(row) : null;
}

async function loadMallOrdersByIds(env, ids = []) {
  const rows = await queryD1RowsByIdChunks(env, ids, (chunk) => env.DB.prepare(
    `SELECT mall_orders.*, mall_products.delivery_mode AS product_delivery_mode, users.username, oauth_accounts.username AS linuxdo_username
     FROM mall_orders
     LEFT JOIN users ON users.id = mall_orders.user_id
     LEFT JOIN oauth_accounts ON oauth_accounts.user_id = users.id
     LEFT JOIN mall_products ON mall_products.id = mall_orders.product_id
     WHERE mall_orders.id IN (${chunk.map(() => "?").join(",")})
     ORDER BY mall_orders.created_at DESC`
  ), { uuid: true });
  return rows.map(formatMallOrder);
}

async function reserveMallCards(env, productId, orderId, quantity) {
  const rows = await env.DB.prepare(
    `SELECT id, content
     FROM mall_cards
     WHERE product_id = ? AND status IN ('unused', 'scheduled') AND order_id = '' AND (available_at IS NULL OR available_at <= CURRENT_TIMESTAMP)
     ORDER BY created_at ASC
     LIMIT ?`
  ).bind(productId, quantity).all();
  return (rows.results || []).map((row) => ({ id: row.id, content: row.content, orderId }));
}

function isMallOrderExpired(order) {
  if (!order || order.status !== "pending") {
    return false;
  }
  const createdAt = parseMallTimestampMs(order.createdAt || "");
  return Number.isFinite(createdAt) && Date.now() - createdAt > MALL_PENDING_ORDER_TTL_MS;
}

function parseMallTimestampMs(value) {
  const text = normalizeText(value, 40);
  if (!text) return Number.NaN;
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(text)) {
    return Date.parse(`${text.replace(" ", "T")}${text.length === 16 ? ":00" : ""}Z`);
  }
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(text)) {
    return Date.parse(`${text}${text.length === 16 ? ":00" : ""}Z`);
  }
  return Date.parse(text);
}

async function expirePendingMallOrders(env, options = {}) {
  const cutoff = new Date(Date.now() - MALL_PENDING_ORDER_TTL_MS).toISOString().replace("T", " ").slice(0, 19);
  const whereUser = options.userId ? "AND user_id = ?" : "";
  const rows = await env.DB.prepare(
    `SELECT id FROM mall_orders
     WHERE status = 'pending' AND datetime(created_at) <= datetime(?) ${whereUser}
     ORDER BY created_at ASC
     LIMIT 80`
  ).bind(...(options.userId ? [cutoff, options.userId] : [cutoff])).all();
  for (const row of rows.results || []) {
    const order = await loadMallOrder(env, row.id);
    if (order) {
      await expireMallOrderIfNeeded(env, order);
    }
  }
}

async function expireMallOrderIfNeeded(env, order) {
  if (!order || !isMallOrderExpired(order)) {
    return order;
  }
  const expired = await markMallOrderExpired(env, order);
  return expired ? await loadMallOrder(env, order.id) : await loadMallOrder(env, order.id);
}

async function markMallOrderExpired(env, order) {
  const result = await env.DB.prepare(
    "UPDATE mall_orders SET status = 'expired', note = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'pending'"
  ).bind("订单超过 5 分钟未支付，已失效", order.id).run();
  if (!d1ChangedExactly(result, 1)) {
    return false;
  }
  await cancelMallOrderSideEffects(env, order);
  return true;
}

async function completeMallOrder(env, order, admin, body = {}) {
  if (!order) {
    throw new ApiError(404, "order_not_found", "订单不存在");
  }
  order = await expireMallOrderIfNeeded(env, order);
  if (order.status === "expired") {
    throw new ApiError(410, "order_expired", "订单已超过 5 分钟有效期，不能交付");
  }
  if (order.status === "completed") {
    return order;
  }
  if (!["pending", "processing"].includes(order.status)) {
    throw new ApiError(409, "order_state_locked", "当前订单状态不能完成交付");
  }
  const product = await loadMallProduct(env, order.productId, { includeInactive: true });
  if ((product?.deliveryMode || "manual") !== "manual" && admin?.id) {
    throw new ApiError(400, "delivery_mode_locked", "只有人工发货商品才支持手动交付");
  }
  if (isCreditPaidOrder(order, product) && Number(order.finalAmount || 0) > 0 && order.status !== "processing") {
    throw new ApiError(400, "order_not_paid", "积分站订单必须支付成功后才能交付");
  }
  let deliveryContent = normalizeText(body.deliveryContent || order.deliveryContent, 4000);

  if ((product?.deliveryMode || "manual") === "fixed_link" && !deliveryContent) {
    deliveryContent = buildFixedLinkDeliveryContent(product);
  }

  if ((product?.deliveryMode || "manual") === "auto" && !deliveryContent) {
    const cards = await env.DB.prepare(
      "SELECT id, content FROM mall_cards WHERE order_id = ? AND product_id = ? AND status = 'reserved' AND (available_at IS NULL OR available_at <= CURRENT_TIMESTAMP) ORDER BY created_at ASC LIMIT ?"
    ).bind(order.id, order.productId, order.quantity).all();
    const selected = cards.results || [];
    if (selected.length < order.quantity) {
      throw new ApiError(409, "stock_not_enough", "订单锁定的卡密不足，无法交付");
    }
    deliveryContent = selected.map((card) => card.content).join("\n");
    const cardResults = await env.DB.batch(selected.map((card) => (
      env.DB.prepare(
        "UPDATE mall_cards SET status = 'used', used_by = ?, used_at = CURRENT_TIMESTAMP WHERE id = ? AND order_id = ? AND status = 'reserved'"
      ).bind(order.username || order.userId, card.id, order.id)
    )));
    assertMallOrderCompletionResults(cardResults, selected.length);
  }

  if (!deliveryContent) {
    deliveryContent = normalizeText(body.note, 4000) || "管理员已确认完成，请按订单备注联系处理。";
  }

  const result = await env.DB.prepare(
    `UPDATE mall_orders
     SET status = 'completed', delivered = 1, delivery_content = ?, note = ?,
         completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND status IN ('pending', 'processing')`
  ).bind(deliveryContent, normalizeText(body.note || order.note || "订单已完成", 1000), order.id).run();
  if (!d1ChangedExactly(result, 1)) {
    throw new ApiError(409, "order_completion_conflict", "订单状态已变化，请刷新后重试");
  }
  const deliveredOrder = await loadMallOrder(env, order.id);
  await markMallOrderUserCouponsUsed(env, deliveredOrder);
  await sendMallOrderEmail(env, order.userId, "delivered", deliveredOrder, product, {
    deliveryContent,
    note: body.note || order.note || "订单已完成"
  }).catch(() => null);
  queueMallPurchasePushMe(env, body.ctx || null, deliveredOrder, product, {
    deliveryContent,
    note: body.note || order.note || "订单已完成交付",
    pushResult: "购买成功，PushMe 已提交发送队列"
  });
  return deliveredOrder;
}

async function cancelMallOrder(env, order, actor, options = {}) {
  if (!order) {
    throw new ApiError(404, "order_not_found", "订单不存在");
  }
  order = await expireMallOrderIfNeeded(env, order);
  const product = await loadMallProduct(env, order.productId, { includeInactive: true });
  if (isCreditPaidOrder(order, product) && Number(order.finalAmount || 0) > 0 && ["processing", "completed"].includes(order.status)) {
    throw new ApiError(400, "paid_order_requires_refund", "已支付的积分站订单不能取消，请使用退款功能");
  }
  if (order.status === "completed") {
    throw new ApiError(400, "completed_order_locked", "已完成订单不能取消");
  }
  if (order.status === "refunded") {
    throw new ApiError(400, "refunded_order_locked", "已退款订单不能取消");
  }
  if (order.status === "expired") {
    return json({ order });
  }
  const canceled = await markMallOrderCanceled(env, order, options.byAdmin ? "管理员已取消订单" : "用户已取消订单");
  if (!canceled) {
    throw new ApiError(409, "order_state_changed", "订单状态已变化，请刷新后重试");
  }
  await cancelMallOrderSideEffects(env, order);
  return json({ order: await loadMallOrder(env, order.id) });
}

async function markMallOrderCanceled(env, order, note) {
  const result = await env.DB.prepare(
    "UPDATE mall_orders SET status = 'canceled', note = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status = ?"
  ).bind(normalizeText(note, 1000), order.id, order.status).run();
  return d1ChangedExactly(result, 1);
}

async function prepareMallOrderForDeletion(env, order) {
  if (["completed", "refunded"].includes(order.status)) {
    return false;
  }
  if (order.status === "expired" || order.status === "canceled") {
    return true;
  }
  const canceled = await markMallOrderCanceled(env, order, "用户删除未完成订单");
  if (canceled) {
    await cancelMallOrderSideEffects(env, order);
  }
  return canceled;
}

async function cancelMallOrderSideEffects(env, order) {
  const product = await loadMallProduct(env, order.productId, { includeInactive: true });
  const statements = [
    env.DB.prepare("UPDATE mall_cards SET status = CASE WHEN available_at IS NOT NULL AND available_at > CURRENT_TIMESTAMP THEN 'scheduled' ELSE 'unused' END, order_id = '', used_by = '', used_at = NULL WHERE order_id = ? AND status = 'reserved'")
      .bind(order.id)
  ];
  if (product && product.deliveryMode === "manual") {
    statements.push(
      env.DB.prepare(
        "UPDATE mall_products SET manual_stock = manual_stock + ?, stock = stock + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
      ).bind(order.quantity, order.quantity, order.productId)
    );
  }
  if (order.couponCode) {
    statements.push(
      env.DB.prepare("UPDATE mall_coupons SET used_count = CASE WHEN used_count > 0 THEN used_count - 1 ELSE 0 END WHERE code = ?")
        .bind(order.couponCode)
    );
  }
  statements.push(
    env.DB.prepare(
      `UPDATE mall_user_coupons
       SET status = CASE WHEN expires_at IS NOT NULL AND datetime(expires_at) <= datetime('now') THEN 'expired' ELSE 'active' END,
           reserved_order_id = '', used_order_id = '', used_at = NULL, updated_at = CURRENT_TIMESTAMP
       WHERE (reserved_order_id = ? OR used_order_id = ?) AND status IN ('reserved', 'used')`
    ).bind(order.id, order.id)
  );
  await env.DB.batch(statements);
}

async function beginMallRefundRecord(env, order, admin, method, amount) {
  const refundId = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT OR IGNORE INTO mall_refunds (
      id, order_id, user_id, amount, method, status, trade_no, created_by
    ) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)`
  ).bind(
    refundId,
    order.id,
    order.userId || "",
    Math.max(0, Number.parseInt(amount || 0, 10) || 0),
    method,
    order.tradeNo || "",
    admin?.id || ""
  ).run();
  const refund = await loadMallRefundByOrder(env, order.id, method);
  if (!refund) {
    throw new ApiError(500, "refund_record_failed", "退款记录创建失败，请稍后重试");
  }
  return { refund, created: refund.id === refundId };
}

async function markMallRefundStatus(env, refundId, status, details = {}) {
  await env.DB.prepare(
    `UPDATE mall_refunds
     SET status = ?, trade_no = COALESCE(NULLIF(?, ''), trade_no),
         external_response_json = ?, error = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  ).bind(
    normalizeChoice(status, ["pending", "processing", "succeeded", "failed"], "pending"),
    normalizeText(details.tradeNo, 120),
    auditJson(details.externalResponse ?? {}),
    normalizeText(details.error, 500),
    refundId
  ).run();
}

function extractCreditRefundTradeNo(data) {
  if (!data || typeof data !== "object") {
    return "";
  }
  return normalizeText(data.trade_no || data.tradeNo || data.data?.trade_no || data.data?.tradeNo || "", 120);
}

async function refundMallOrder(env, order, admin, body = {}) {
  if (!order) {
    throw new ApiError(404, "order_not_found", "订单不存在");
  }
  if (order.status === "refunded") {
    const existingRefund = await loadMallRefundByOrder(env, order.id, "credit")
      || await loadMallRefundByOrder(env, order.id, "manual");
    return json({ order, refund: existingRefund });
  }
  if (order.status !== "completed") {
    throw new ApiError(400, "refund_not_allowed", "只有已完成订单支持退款");
  }
  const product = await loadMallProduct(env, order.productId, { includeInactive: true });
  const shouldRefundCredit = isCreditPaidOrder(order, product) && Number(order.finalAmount || 0) > 0;
  const refundMethod = shouldRefundCredit ? "credit" : "manual";
  const refundAmount = Number(order.finalAmount || 0);
  let creditRefund = null;
  let refundRecordState = await beginMallRefundRecord(env, order, admin, refundMethod, refundAmount);
  if (!refundRecordState.created) {
    if (refundRecordState.refund.status === "succeeded") {
      creditRefund = refundRecordState.refund.externalResponse || null;
    } else {
      throw new ApiError(
        409,
        "refund_already_processing",
        refundRecordState.refund.status === "failed"
          ? "该订单已有失败退款记录，请先核对积分站流水，避免重复退款"
          : "该订单已有退款处理中记录，请勿重复提交"
      );
    }
  } else if (shouldRefundCredit) {
    await markMallRefundStatus(env, refundRecordState.refund.id, "processing", {
      tradeNo: order.tradeNo,
      externalResponse: { message: "积分站退款请求已发起" }
    });
    try {
      creditRefund = await refundCreditPayment(env, order);
      await markMallRefundStatus(env, refundRecordState.refund.id, "succeeded", {
        tradeNo: extractCreditRefundTradeNo(creditRefund) || order.tradeNo,
        externalResponse: creditRefund
      });
      refundRecordState = { refund: await loadMallRefundByOrder(env, order.id, refundMethod), created: true };
    } catch (error) {
      await markMallRefundStatus(env, refundRecordState.refund.id, "failed", {
        tradeNo: order.tradeNo,
        externalResponse: { error: error?.code || "credit_refund_failed" },
        error: error?.message || "积分站退款失败"
      }).catch(() => null);
      throw error;
    }
  } else {
    creditRefund = { skipped: true, method: "manual", message: "非积分站支付订单仅记录人工退款" };
    await markMallRefundStatus(env, refundRecordState.refund.id, "succeeded", {
      externalResponse: creditRefund
    });
    refundRecordState = { refund: await loadMallRefundByOrder(env, order.id, refundMethod), created: true };
  }
  const markedRefunded = await markMallOrderRefunded(env, order, body.note || (shouldRefundCredit ? "积分站已原路退款" : "管理员已标记退款"));
  if (!markedRefunded) {
    return json({
      order: await loadMallOrder(env, order.id),
      creditRefund,
      refund: refundRecordState.refund || await loadMallRefundByOrder(env, order.id, refundMethod)
    });
  }
  const statements = [
    env.DB.prepare(
      "UPDATE mall_cards SET status = CASE WHEN status = 'used' THEN 'inactive' WHEN available_at IS NOT NULL AND available_at > CURRENT_TIMESTAMP THEN 'scheduled' ELSE 'unused' END, order_id = CASE WHEN status = 'used' THEN order_id ELSE '' END, used_by = CASE WHEN status = 'used' THEN used_by ELSE '' END, used_at = CASE WHEN status = 'used' THEN used_at ELSE NULL END WHERE order_id = ? AND status IN ('reserved', 'used')"
    ).bind(order.id)
  ];
  if (product && product.deliveryMode === "manual") {
    statements.push(
      env.DB.prepare(
        "UPDATE mall_products SET manual_stock = manual_stock + ?, stock = stock + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
      ).bind(order.quantity, order.quantity, order.productId)
    );
  }
  if (order.couponCode) {
    statements.push(
      env.DB.prepare("UPDATE mall_coupons SET used_count = CASE WHEN used_count > 0 THEN used_count - 1 ELSE 0 END WHERE code = ?")
        .bind(order.couponCode)
    );
  }
  statements.push(
    env.DB.prepare(
      `UPDATE mall_user_coupons
       SET status = CASE WHEN expires_at IS NOT NULL AND datetime(expires_at) <= datetime('now') THEN 'expired' ELSE 'active' END,
           reserved_order_id = '', used_order_id = '', used_at = NULL, updated_at = CURRENT_TIMESTAMP
       WHERE (reserved_order_id = ? OR used_order_id = ?) AND status IN ('reserved', 'used')`
    ).bind(order.id, order.id)
  );
  await env.DB.batch(statements);
  return json({
    order: await loadMallOrder(env, order.id),
    creditRefund,
    refund: refundRecordState.refund || await loadMallRefundByOrder(env, order.id, refundMethod)
  });
}

async function markMallOrderRefunded(env, order, note) {
  const result = await env.DB.prepare(
    `UPDATE mall_orders
     SET status = 'refunded', note = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND status = ?`
  ).bind(normalizeText(note, 1000), order.id, order.status).run();
  return d1ChangedExactly(result, 1);
}

function toD1DateTime(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().replace("T", " ").slice(0, 19);
}

function addDaysToD1DateTime(value, days) {
  const base = parseMallTimestampMs(value);
  if (!Number.isFinite(base)) {
    return toD1DateTime(Date.now() + days * 24 * 60 * 60 * 1000);
  }
  return toD1DateTime(base + days * 24 * 60 * 60 * 1000);
}

function normalizeCampaignRewardEntries(map = {}) {
  const normalized = normalizeMinesweeperRewardMap(map, {});
  return Object.entries(normalized).map(([level, value]) => ({
    level,
    label: MINESWEEPER_LEVEL_LABELS[level] || level,
    value
  }));
}

function buildMinesweeperCampaignWindow(config = MALL_DEFAULT_SETTINGS.minesweeperCampaign, now = Date.now()) {
  const campaign = normalizeMinesweeperCampaignSettings(config);
  const startMs = parseMallTimestampMs(campaign.startAt);
  const endMs = parseMallTimestampMs(campaign.endsAt);
  const validWindow = Number.isFinite(startMs) && Number.isFinite(endMs) && endMs > startMs;
  return {
    ...campaign,
    active: Boolean(campaign.enabled && validWindow && now >= startMs && now < endMs),
    started: Boolean(validWindow && now >= startMs),
    ended: Boolean(validWindow && now >= endMs),
    levelPercentCoupons: normalizeCampaignRewardEntries(campaign.levelPercentCoupons),
    levelFirstFixedCoupons: normalizeCampaignRewardEntries(campaign.levelFirstFixedCoupons)
  };
}

async function getMinesweeperCampaignWindow(env, now = Date.now()) {
  const settings = env ? await getMallSettings(env).catch(() => MALL_DEFAULT_SETTINGS) : MALL_DEFAULT_SETTINGS;
  return buildMinesweeperCampaignWindow(settings.minesweeperCampaign, now);
}

function campaignRewardValue(entries = [], level) {
  const found = entries.find((item) => item.level === level);
  return Number(found?.value || 0);
}

function normalizeOrderDiscounts(value) {
  const rows = Array.isArray(value) ? value : [];
  return rows.map((item) => ({
    source: normalizeChoice(item?.source, ["manual_coupon", "user_coupon", "lottery"], "manual_coupon"),
    id: normalizeText(item?.id, 120),
    code: normalizeText(item?.code, 120),
    label: normalizeText(item?.label, 160),
    type: normalizeChoice(item?.type, ["fixed", "percent", "lottery"], "fixed"),
    value: Number(item?.value || 0),
    amount: normalizeMoney(item?.amount),
    rank: Math.max(0, Number.parseInt(item?.rank || 0, 10) || 0)
  })).filter((item) => item.amount > 0 || item.code || item.label);
}

function calculateStackedCouponDiscount(coupon, remaining) {
  const safeRemaining = Math.max(0, normalizeMoney(remaining));
  const value = Number(coupon?.value || 0);
  if (safeRemaining <= 0 || value <= 0) {
    return 0;
  }
  if (coupon?.type === "percent") {
    return Math.min(safeRemaining, Math.floor(safeRemaining * Math.max(0, Math.min(100, value)) / 100));
  }
  return Math.min(safeRemaining, Math.max(0, Math.round(value)));
}

function buildDiscountItem(source, coupon, amount) {
  return {
    source,
    id: coupon.id || "",
    code: coupon.code || "",
    label: coupon.label || coupon.code || "",
    type: coupon.type || "fixed",
    value: Number(coupon.value || 0),
    amount: normalizeMoney(amount),
    rank: Number(coupon.rank || 0)
  };
}

async function loadAvailableMallUserCoupons(env, userId, productId = "") {
  await ensureMallRuntime(env);
  await expireMallUserCoupons(env, userId);
  const window = await getMinesweeperCampaignWindow(env);
  const rows = await env.DB.prepare(
    `SELECT *
     FROM mall_user_coupons
     WHERE user_id = ?
       AND campaign_key = ?
       AND status = 'active'
       AND NOT ${MINESWEEPER_CAMPAIGN_LEGACY_SOURCE_SQL}
       AND (product_id = '' OR product_id = ?)
       AND (starts_at IS NULL OR datetime(starts_at) <= datetime('now'))
       AND (expires_at IS NULL OR datetime(expires_at) > datetime('now'))
     ORDER BY CASE WHEN type = 'percent' THEN 0 ELSE 1 END, value DESC, created_at ASC`
  ).bind(userId, window.key, productId || "").all();
  return (rows.results || []).map(formatMallUserCoupon);
}

async function expireMallUserCoupons(env, userId = "") {
  await ensureMinesweeperCouponSchema(env);
  const sql = userId
    ? "UPDATE mall_user_coupons SET status = 'expired', updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND status = 'active' AND expires_at IS NOT NULL AND datetime(expires_at) <= datetime('now')"
    : "UPDATE mall_user_coupons SET status = 'expired', updated_at = CURRENT_TIMESTAMP WHERE status = 'active' AND expires_at IS NOT NULL AND datetime(expires_at) <= datetime('now')";
  await env.DB.prepare(sql).bind(...(userId ? [userId] : [])).run();
}

async function reserveMallUserCouponsForOrder(env, orderId, coupons = []) {
  return coupons.map((coupon) => env.DB.prepare(
    `UPDATE mall_user_coupons
     SET status = 'reserved', reserved_order_id = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND user_id = ? AND status = 'active'
       AND (expires_at IS NULL OR datetime(expires_at) > datetime('now'))`
  ).bind(orderId, coupon.id, coupon.userId));
}

async function releaseMallOrderUserCoupons(env, order) {
  if (!order?.id) return;
  await ensureMinesweeperCouponSchema(env);
  await env.DB.prepare(
    `UPDATE mall_user_coupons
     SET status = CASE WHEN expires_at IS NOT NULL AND datetime(expires_at) <= datetime('now') THEN 'expired' ELSE 'active' END,
         reserved_order_id = '', used_order_id = '', used_at = NULL, updated_at = CURRENT_TIMESTAMP
     WHERE (reserved_order_id = ? OR used_order_id = ?) AND status IN ('reserved', 'used')`
  ).bind(order.id, order.id).run();
}

async function markMallOrderUserCouponsUsed(env, order) {
  if (!order?.id) return;
  await ensureMinesweeperCouponSchema(env);
  await env.DB.prepare(
    `UPDATE mall_user_coupons
     SET status = 'used', used_order_id = ?, reserved_order_id = '', used_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
     WHERE reserved_order_id = ? AND status = 'reserved'`
  ).bind(order.id, order.id).run();
}

async function buildMallOrderDiscountPlan(env, user, product, amount, manualCoupon, lottery) {
  let remaining = Math.max(0, normalizeMoney(amount));
  const discounts = [];
  if (manualCoupon) {
    const amountUsed = Math.min(remaining, normalizeMoney(manualCoupon.discountAmount));
    if (amountUsed > 0) {
      discounts.push(buildDiscountItem("manual_coupon", { ...manualCoupon, label: `优惠码 ${manualCoupon.code}` }, amountUsed));
      remaining -= amountUsed;
    }
  }
  const userCoupons = await loadAvailableMallUserCoupons(env, user.id, product.id);
  const selectedUserCoupons = [];
  for (const coupon of userCoupons) {
    const discount = calculateStackedCouponDiscount(coupon, remaining);
    if (discount <= 0) {
      continue;
    }
    discounts.push(buildDiscountItem("user_coupon", coupon, discount));
    selectedUserCoupons.push(coupon);
    remaining = Math.max(0, remaining - discount);
  }
  const lotteryValue = lottery?.value ?? 1;
  const lotteryDiscount = Math.min(remaining, Math.max(0, Math.round(remaining * (1 - lotteryValue))));
  if (lotteryDiscount > 0) {
    discounts.push({
      source: "lottery",
      id: "",
      code: "",
      label: lottery?.label || "手气折扣",
      type: "lottery",
      value: lotteryValue,
      amount: lotteryDiscount,
      rank: 0
    });
    remaining = Math.max(0, remaining - lotteryDiscount);
  }
  const discountAmount = Math.max(0, normalizeMoney(amount) - remaining);
  return {
    discounts: normalizeOrderDiscounts(discounts),
    userCoupons: selectedUserCoupons,
    discountAmount,
    finalAmount: remaining
  };
}

function buildMinesweeperCouponCode(userId, sourceKey, value = 0) {
  const suffix = String(userId || "").replace(/[^a-z0-9]/gi, "").slice(0, 8).toUpperCase() || randomHex(4).toUpperCase();
  const source = String(sourceKey || "").replace(/[^a-z0-9]/gi, "").slice(0, 10).toUpperCase();
  return `MS${value || ""}${source}${suffix}`.slice(0, 40);
}

function buildMinesweeperCouponLabel(sourceKey, value, rank = 0, level = "") {
  const levelText = MINESWEEPER_LEVEL_LABELS[level] || level || "扫雷";
  if (String(sourceKey || "").includes("percent")) {
    return `${levelText}首通 ${value}% 优惠`;
  }
  return `${levelText}第一名直减券`;
}

async function loadMinesweeperCampaignFirstClears(env, limit = 500, options = {}) {
  const safeLimit = Math.max(1, Math.min(5000, Number.parseInt(limit || 500, 10) || 500));
  const window = options.campaign || await getMinesweeperCampaignWindow(env);
  const userId = normalizeText(options.userId || "", 80);
  const params = [window.startAt, window.endsAt];
  if (userId) {
    params.push(userId);
  }
  params.push(safeLimit);
  const rows = await env.DB.prepare(
    `WITH level_first_clears AS (
       SELECT level, user_id, MIN(won_at) AS first_clear_at
       FROM leaderboard_scores
       WHERE datetime(won_at) >= datetime(?)
         AND datetime(won_at) < datetime(?)
       GROUP BY level, user_id
     ),
     ranked AS (
       SELECT
         level,
         user_id,
         first_clear_at,
         ROW_NUMBER() OVER (PARTITION BY level ORDER BY datetime(first_clear_at) ASC, user_id ASC) AS rank
       FROM level_first_clears
     )
     SELECT
       ranked.level,
       ranked.user_id,
       ranked.first_clear_at,
       ranked.rank,
       users.username AS account_username,
       oauth_accounts.username AS linuxdo_username
     FROM ranked
     LEFT JOIN users ON users.id = ranked.user_id
     LEFT JOIN oauth_accounts ON oauth_accounts.user_id = ranked.user_id
     ${userId ? "WHERE ranked.user_id = ?" : ""}
     ORDER BY ranked.rank ASC,
       CASE ranked.level WHEN 'beginner' THEN 1 WHEN 'intermediate' THEN 2 WHEN 'expert' THEN 3 ELSE 4 END,
       datetime(ranked.first_clear_at) ASC,
       ranked.user_id ASC
     LIMIT ?`
  ).bind(...params).all();
  return (rows.results || []).map((row) => ({
    level: row.level,
    levelLabel: MINESWEEPER_LEVEL_LABELS[row.level] || row.level || "",
    userId: row.user_id,
    username: row.linuxdo_username || row.account_username || row.user_id,
    firstClearAt: row.first_clear_at,
    rank: Number(row.rank || 0)
  }));
}

async function loadMinesweeperCampaignRank(env, userId) {
  const ranks = await loadMinesweeperCampaignFirstClears(env, 20, { userId });
  return ranks.length ? { rank: ranks[0], ranks } : null;
}

async function deactivateStaleMinesweeperCampaignCoupons(env, userId = "", campaignKey = MINESWEEPER_COUPON_CAMPAIGN_KEY, keepSourceKeys = []) {
  const safeUserId = normalizeText(userId, 80);
  const params = [normalizeText(campaignKey, 80) || MINESWEEPER_COUPON_CAMPAIGN_KEY];
  if (safeUserId) {
    params.push(safeUserId);
  }
  const keepKeys = [...new Set(keepSourceKeys.map((item) => normalizeText(item, 80)).filter(Boolean))];
  const keepClause = keepKeys.length ? `AND source_key NOT IN (${keepKeys.map(() => "?").join(", ")})` : "";
  params.push(...keepKeys);
  await env.DB.prepare(
    `UPDATE mall_user_coupons
     SET status = 'inactive', updated_at = CURRENT_TIMESTAMP
     WHERE campaign_key = ?
       ${safeUserId ? "AND user_id = ?" : ""}
       AND status = 'active'
       AND (reserved_order_id = '' OR reserved_order_id IS NULL)
       AND (used_order_id = '' OR used_order_id IS NULL)
       AND ${MINESWEEPER_CAMPAIGN_GENERATED_SOURCE_SQL}
       ${keepClause}`
  ).bind(...params).run();
}

async function deactivateUnqualifiedMinesweeperCampaignCoupons(env, campaign, awards = [], awardKeys = new Set(), userId = "") {
  const safeUserId = normalizeText(userId, 80);
  const awardUsers = [...new Set(awards.map((award) => normalizeText(award.userId, 80)).filter(Boolean))];
  const params = [campaign.key];
  let userFilter = "";
  if (safeUserId) {
    userFilter = "AND user_id = ?";
    params.push(safeUserId);
  } else if (awardUsers.length) {
    userFilter = `AND user_id IN (${awardUsers.map(() => "?").join(", ")})`;
    params.push(...awardUsers);
  }
  const rows = await env.DB.prepare(
    `SELECT id, user_id, source_key
     FROM mall_user_coupons
     WHERE campaign_key = ?
       ${userFilter}
       AND status = 'active'
       AND (reserved_order_id = '' OR reserved_order_id IS NULL)
       AND (used_order_id = '' OR used_order_id IS NULL)
       AND ${MINESWEEPER_CAMPAIGN_GENERATED_SOURCE_SQL}`
  ).bind(...params).all();
  const staleIds = (rows.results || [])
    .filter((row) => !awardKeys.has(`${row.user_id}\u0000${row.source_key}`))
    .map((row) => row.id)
    .filter(isUuidLike);
  await runD1InChunks(env, staleIds, (id) => (
    env.DB.prepare("UPDATE mall_user_coupons SET status = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'active' AND (reserved_order_id = '' OR reserved_order_id IS NULL) AND (used_order_id = '' OR used_order_id IS NULL)")
      .bind(id)
  ));
}

async function insertMinesweeperCampaignCoupon(env, award, sourceKey, type, value, options = {}) {
  const validDays = clampInteger(options.validDays, MINESWEEPER_COUPON_VALID_DAYS, 1, 3650);
  const campaignKey = normalizeText(options.campaignKey, 80) || MINESWEEPER_COUPON_CAMPAIGN_KEY;
  const expiresAt = addDaysToD1DateTime(award.firstClearAt, validDays);
  const rank = Math.max(0, Number.parseInt(options.rank || award.rank || 0, 10) || 0);
  const code = buildMinesweeperCouponCode(award.userId, sourceKey, value);
  const label = buildMinesweeperCouponLabel(sourceKey, value, rank, award.level);
  await env.DB.prepare(
    `INSERT INTO mall_user_coupons (
      id, user_id, code, campaign_key, source_key, label, type, value,
      product_id, stackable, status, rank, meta_json, starts_at, expires_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', 1, 'active', ?, ?, ?, ?)
     ON CONFLICT(user_id, campaign_key, source_key) DO UPDATE SET
       code = excluded.code,
       label = excluded.label,
       type = excluded.type,
       value = excluded.value,
       status = excluded.status,
       rank = excluded.rank,
       meta_json = excluded.meta_json,
       starts_at = excluded.starts_at,
       expires_at = excluded.expires_at,
       updated_at = CURRENT_TIMESTAMP
     WHERE mall_user_coupons.status NOT IN ('reserved', 'used')
       AND (mall_user_coupons.reserved_order_id = '' OR mall_user_coupons.reserved_order_id IS NULL)
       AND (mall_user_coupons.used_order_id = '' OR mall_user_coupons.used_order_id IS NULL)
       AND NOT (mall_user_coupons.expires_at IS NOT NULL AND datetime(mall_user_coupons.expires_at) <= datetime('now'))`
  ).bind(
    crypto.randomUUID(),
    award.userId,
    code,
    campaignKey,
    sourceKey,
    label,
    type,
    value,
    rank,
    auditJson({
      firstClearAt: award.firstClearAt,
      level: award.level || "",
      rank,
      username: award.username || "",
      validDays
    }),
    award.firstClearAt,
    expiresAt
  ).run();
}

async function syncMinesweeperCampaignAwards(env, options = {}) {
  await ensureMallRuntime(env);
  await expireMallUserCoupons(env, options.userId || "");
  const window = await getMinesweeperCampaignWindow(env);
  if (!window.started) {
    return { campaign: window, synced: 0 };
  }
  if (window.enabled === false) {
    await deactivateStaleMinesweeperCampaignCoupons(env, options.userId || "", window.key);
    return { campaign: window, synced: 0 };
  }
  const targetAwards = options.userId
    ? await loadMinesweeperCampaignFirstClears(env, 20, { userId: options.userId, campaign: window })
    : await loadMinesweeperCampaignFirstClears(env, options.limit || 500, { campaign: window });
  const activeSourceKeys = new Set();
  const awardKeys = new Set();
  for (const award of targetAwards) {
    const percentValue = campaignRewardValue(window.levelPercentCoupons, award.level);
    if (percentValue) {
      activeSourceKeys.add(`first-clear-${award.level}-percent`);
      awardKeys.add(`${award.userId}\u0000first-clear-${award.level}-percent`);
      await insertMinesweeperCampaignCoupon(env, award, `first-clear-${award.level}-percent`, "percent", percentValue, {
        campaignKey: window.key,
        validDays: window.validDays
      });
    }
    if (award.rank === 1) {
      const fixedValue = campaignRewardValue(window.levelFirstFixedCoupons, award.level);
      if (fixedValue) {
        activeSourceKeys.add(`first-${award.level}-fixed`);
        awardKeys.add(`${award.userId}\u0000first-${award.level}-fixed`);
        await insertMinesweeperCampaignCoupon(env, award, `first-${award.level}-fixed`, "fixed", fixedValue, {
          campaignKey: window.key,
          validDays: window.validDays,
          rank: award.rank
        });
      }
    }
  }
  await deactivateStaleMinesweeperCampaignCoupons(env, options.userId || "", window.key, [...activeSourceKeys]);
  await deactivateUnqualifiedMinesweeperCampaignCoupons(env, window, targetAwards, awardKeys, options.userId || "");
  await expireMallUserCoupons(env, options.userId || "");
  return { campaign: window, synced: targetAwards.length, awards: targetAwards };
}

async function loadMinesweeperUserCoupons(env, userId) {
  await ensureMallRuntime(env);
  await syncMinesweeperCampaignAwards(env, { userId });
  const window = await getMinesweeperCampaignWindow(env);
  const rows = await env.DB.prepare(
    `SELECT *
     FROM mall_user_coupons
     WHERE user_id = ? AND campaign_key = ?
       AND NOT (status = 'inactive' AND ${MINESWEEPER_CAMPAIGN_GENERATED_SOURCE_SQL})
     ORDER BY created_at DESC`
  ).bind(userId, window.key).all();
  return (rows.results || []).map(formatMallUserCoupon);
}

async function getMallAvailableCoupons(request, env, user) {
  const productId = normalizeMallId(new URL(request.url).searchParams.get("productId") || "");
  await syncMinesweeperCampaignAwards(env, { userId: user.id });
  const window = await getMinesweeperCampaignWindow(env);
  return json({
    campaign: window,
    userCoupons: productId
      ? await loadAvailableMallUserCoupons(env, user.id, productId)
      : await loadMinesweeperUserCoupons(env, user.id)
  });
}

async function getMinesweeperCouponCampaign(env, user = null) {
  await syncMinesweeperCampaignAwards(env, user?.id ? { userId: user.id } : { limit: 20 });
  const window = await getMinesweeperCampaignWindow(env);
  const settings = await getMallSettings(env).catch(() => MALL_DEFAULT_SETTINGS);
  const rank = user?.id ? await loadMinesweeperCampaignRank(env, user.id) : null;
  const userCoupons = user?.id ? await loadMinesweeperUserCoupons(env, user.id) : [];
  return json({
    campaign: window,
    currency: getMallCurrencyInfo(settings),
    rank: rank?.rank || null,
    ranks: rank?.ranks || [],
    userCoupons
  });
}

async function getMinesweeperCampaignAdminSummary(env) {
  await syncMinesweeperCampaignAwards(env, { limit: 500 });
  const window = await getMinesweeperCampaignWindow(env);
  const settings = await getMallSettings(env).catch(() => MALL_DEFAULT_SETTINGS);
  const [statusRows, couponRows] = await Promise.all([
    env.DB.prepare(
      `SELECT status, COUNT(*) AS count
       FROM mall_user_coupons
       WHERE campaign_key = ?
       GROUP BY status`
    ).bind(window.key).all(),
    env.DB.prepare(
      `SELECT mall_user_coupons.*, users.username AS account_username, oauth_accounts.username AS linuxdo_username
       FROM mall_user_coupons
       LEFT JOIN users ON users.id = mall_user_coupons.user_id
       LEFT JOIN oauth_accounts ON oauth_accounts.user_id = mall_user_coupons.user_id
       WHERE campaign_key = ?
       ORDER BY created_at DESC
       LIMIT 80`
    ).bind(window.key).all()
  ]);
  const firstClears = await loadMinesweeperCampaignFirstClears(env, 50, { campaign: window });
  return {
    campaign: window,
    settings: settings.minesweeperCampaign || MALL_DEFAULT_SETTINGS.minesweeperCampaign,
    statusCounts: countMapFromRows(statusRows),
    firstClears,
    coupons: (couponRows.results || []).map((row) => ({
      ...formatMallUserCoupon(row),
      username: row.linuxdo_username || row.account_username || row.user_id
    }))
  };
}

async function getValidMallCoupon(env, code, productId, amount) {
  const row = await env.DB.prepare(
    `SELECT id, code, product_id, type, value, limit_count, used_count, starts_at, expires_at, status
     FROM mall_coupons
     WHERE UPPER(code) = UPPER(?)`
  ).bind(code).first();
  if (!row || row.status !== "active") {
    return null;
  }
  if (row.product_id && row.product_id !== productId) {
    return null;
  }
  if (Number(row.limit_count || 0) > 0 && Number(row.used_count || 0) >= Number(row.limit_count || 0)) {
    return null;
  }
  const now = Date.now();
  if (row.starts_at && Date.parse(row.starts_at) > now) {
    return null;
  }
  if (row.expires_at && Date.parse(row.expires_at) <= now) {
    return null;
  }
  const value = Number(row.value || 0);
  const discountAmount = row.type === "percent"
    ? Math.floor(amount * Math.max(0, Math.min(100, value)) / 100)
    : Math.min(amount, Math.max(0, value));
  return {
    id: row.id,
    code: row.code,
    productId: row.product_id || "",
    type: row.type,
    value,
    discountAmount,
    limitCount: Number(row.limit_count || 0),
    usedCount: Number(row.used_count || 0)
  };
}

async function loadMallHotProducts(env) {
  const products = await loadMallProducts(env);
  return products
    .filter((item) => item.status === "active" && Number(item.sales || 0) > 0)
    .sort((left, right) => (right.sales - left.sales) || (right.ratingCount - left.ratingCount) || left.sortOrder - right.sortOrder)
    .slice(0, 10);
}

async function loadMallRecentTransactions(env) {
  const rows = await env.DB.prepare(
    `SELECT product_name, buyer_username, final_amount, completed_at, created_at
     FROM mall_orders
     WHERE status = 'completed'
     ORDER BY COALESCE(completed_at, created_at) DESC
     LIMIT 10`
  ).all();
  return (rows.results || []).map((row) => ({
    user: maskUsername(row.buyer_username || "用户"),
    product: row.product_name,
    amount: Number(row.final_amount || 0),
    time: row.completed_at || row.created_at
  }));
}

async function getMallOrderCount(env) {
  const row = await env.DB.prepare("SELECT COUNT(*) AS count FROM mall_orders").first();
  return Number(row?.count || 0);
}

async function loadMallAds(env, options = {}) {
  const rows = await env.DB.prepare(
    `SELECT id, title, description, image_url, link_url, position, status, sort_order, style_json, starts_at, ends_at, created_at, updated_at
     FROM mall_ads
     ${options.includeInactive ? "" : "WHERE status = 'active' AND (starts_at IS NULL OR starts_at <= CURRENT_TIMESTAMP) AND (ends_at IS NULL OR ends_at > CURRENT_TIMESTAMP)"}
     ORDER BY position ASC, sort_order ASC, created_at DESC`
  ).all();
  return (rows.results || []).map(formatMallAd);
}

async function loadMallRatings(env, productId, limit = 30) {
  const rows = await env.DB.prepare(
    `SELECT id, order_id, product_id, user_id, username, rating, comment, created_at
     FROM mall_ratings
     WHERE product_id = ?
     ORDER BY created_at DESC
     LIMIT ?`
  ).bind(productId, limit).all();
  return (rows.results || []).map(formatMallRating);
}

async function loadMallAdminRatings(env, limit = 100) {
  const safeLimit = normalizeAdminListLimit(limit, 100);
  const rows = await env.DB.prepare(
    `SELECT mall_ratings.*, mall_products.name AS product_name
     FROM mall_ratings
     LEFT JOIN mall_products ON mall_products.id = mall_ratings.product_id
     ORDER BY mall_ratings.created_at DESC
     LIMIT ?`
  ).bind(safeLimit).all();
  return (rows.results || []).map(formatMallRating);
}

async function loadMallRatingsByIds(env, ids = []) {
  const safeIds = normalizeIds(ids).filter(isSafeRecordId);
  if (!safeIds.length) return [];
  const rows = await queryD1RowsByIdChunks(env, safeIds, (chunk) => env.DB.prepare(
    `SELECT mall_ratings.*, mall_products.name AS product_name
     FROM mall_ratings
     LEFT JOIN mall_products ON mall_products.id = mall_ratings.product_id
     WHERE mall_ratings.id IN (${chunk.map(() => "?").join(",")})
     ORDER BY mall_ratings.created_at DESC`
  ));
  return rows.map(formatMallRating);
}

async function loadMallCards(env, limit = 200) {
  const safeLimit = normalizeAdminListLimit(limit, 200);
  const rows = await env.DB.prepare(
    `SELECT mall_cards.*, mall_products.name AS product_name
     FROM mall_cards
     LEFT JOIN mall_products ON mall_products.id = mall_cards.product_id
     ORDER BY mall_cards.created_at DESC
     LIMIT ?`
  ).bind(safeLimit).all();
  return (rows.results || []).map(formatMallCard);
}

async function loadMallCard(env, cardId) {
  if (!isSafeRecordId(cardId)) return null;
  const row = await env.DB.prepare(
    `SELECT mall_cards.*, mall_products.name AS product_name
     FROM mall_cards
     LEFT JOIN mall_products ON mall_products.id = mall_cards.product_id
     WHERE mall_cards.id = ?`
  ).bind(cardId).first();
  return row ? formatMallCard(row) : null;
}

async function loadMallCardsByIds(env, ids = []) {
  const safeIds = normalizeIds(ids).filter(isSafeRecordId);
  if (!safeIds.length) return [];
  const rows = await queryD1RowsByIdChunks(env, safeIds, (chunk) => env.DB.prepare(
    `SELECT mall_cards.*, mall_products.name AS product_name
     FROM mall_cards
     LEFT JOIN mall_products ON mall_products.id = mall_cards.product_id
     WHERE mall_cards.id IN (${chunk.map(() => "?").join(",")})
     ORDER BY mall_cards.created_at DESC`
  ));
  return rows.map(formatMallCard);
}

async function loadMallCoupons(env, limit = 200) {
  const safeLimit = normalizeAdminListLimit(limit, 200);
  const rows = await env.DB.prepare(
    `SELECT id, code, product_id, type, value, limit_count, used_count, starts_at, expires_at, status, created_at, updated_at
     FROM mall_coupons
     ORDER BY created_at DESC
     LIMIT ?`
  ).bind(safeLimit).all();
  return (rows.results || []).map(formatMallCoupon);
}

async function loadMallCoupon(env, couponId) {
  if (!isSafeRecordId(couponId)) return null;
  const row = await env.DB.prepare(
    `SELECT id, code, product_id, type, value, limit_count, used_count, starts_at, expires_at, status, created_at, updated_at
     FROM mall_coupons
     WHERE id = ?`
  ).bind(couponId).first();
  return row ? formatMallCoupon(row) : null;
}

async function loadMallCouponsByIds(env, ids = []) {
  const safeIds = normalizeIds(ids).filter(isSafeRecordId);
  if (!safeIds.length) return [];
  const rows = await queryD1RowsByIdChunks(env, safeIds, (chunk) => env.DB.prepare(
    `SELECT id, code, product_id, type, value, limit_count, used_count, starts_at, expires_at, status, created_at, updated_at
     FROM mall_coupons
     WHERE id IN (${chunk.map(() => "?").join(",")})
     ORDER BY created_at DESC`
  ));
  return rows.map(formatMallCoupon);
}

async function loadMallUserCouponsForBackup(env, limit = 5000) {
  const safeLimit = normalizeAdminListLimit(limit, 5000);
  await ensureMinesweeperCouponSchema(env);
  const rows = await env.DB.prepare(
    `SELECT *
     FROM mall_user_coupons
     ORDER BY created_at DESC
     LIMIT ?`
  ).bind(safeLimit).all();
  return (rows.results || []).map(formatMallUserCoupon);
}

async function loadMallBlacklist(env, limit = 300) {
  const safeLimit = normalizeAdminListLimit(limit, 300);
  const rows = await env.DB.prepare(
    "SELECT id, kind, value, reason, created_at FROM mall_blacklist ORDER BY created_at DESC LIMIT ?"
  ).bind(safeLimit).all();
  return (rows.results || []).map(formatBlacklistItem);
}

async function loadMallEmailTemplates(env, limit = 100) {
  const safeLimit = normalizeAdminListLimit(limit, 100);
  const rows = await env.DB.prepare(
    `SELECT id, event_type, name, subject, content, params_json, is_default, created_at, updated_at
     FROM mall_email_templates
     ORDER BY event_type ASC, is_default DESC, updated_at DESC
     LIMIT ?`
  ).bind(safeLimit).all();
  return (rows.results || []).map(formatEmailTemplate);
}

async function loadMallLoginAttempts(env, limit = 200) {
  const safeLimit = normalizeAdminListLimit(limit, 200);
  const rows = await env.DB.prepare(
    `SELECT id, ip, username, success, reason, user_agent, created_at
     FROM mall_login_attempts
     ORDER BY created_at DESC
     LIMIT ?`
  ).bind(safeLimit).all();
  return (rows.results || []).map(formatLoginAttempt);
}

async function loadMallBackupRecords(env, limit = 50) {
  const safeLimit = normalizeAdminListLimit(limit, 50);
  const rows = await env.DB.prepare(
    `SELECT id, name, size_bytes, format, created_by, backup_type, scope_json, table_count, expires_at,
            CASE WHEN LENGTH(COALESCE(content_text, '')) > 0 THEN 1 ELSE 0 END AS has_content,
            created_at
     FROM mall_backup_records
     ORDER BY created_at DESC
     LIMIT ?`
  ).bind(safeLimit).all();
  return (rows.results || []).map((row) => ({
    id: row.id,
    name: row.name,
    sizeBytes: Number(row.size_bytes || 0),
    format: row.format || inferBackupFormat(row.name),
    createdBy: row.created_by || "",
    backupType: row.backup_type || inferBackupType(row.name),
    scope: normalizeBackupScope(parseJson(row.scope_json, inferBackupScopeFromName(row.name)), inferBackupScopeFromName(row.name)),
    tableCount: Number(row.table_count || 0),
    expiresAt: row.expires_at || "",
    hasContent: Boolean(row.has_content),
    createdAt: row.created_at
  }));
}

async function loadMallBackupRecord(env, backupId) {
  if (!isSafeRecordId(backupId)) return null;
  const row = await env.DB.prepare(
    `SELECT id, name, size_bytes, format, content_text, created_by, backup_type, scope_json, table_count, expires_at, created_at
     FROM mall_backup_records
     WHERE id = ?`
  ).bind(backupId).first();
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    sizeBytes: Number(row.size_bytes || 0),
    format: row.format || inferBackupFormat(row.name),
    content: row.content_text || "",
    createdBy: row.created_by || "",
    backupType: row.backup_type || inferBackupType(row.name),
    scope: normalizeBackupScope(parseJson(row.scope_json, inferBackupScopeFromName(row.name)), inferBackupScopeFromName(row.name)),
    tableCount: Number(row.table_count || 0),
    expiresAt: row.expires_at || "",
    createdAt: row.created_at
  };
}

async function saveMallBackupRecord(env, { id, name, format, content, admin, scope, backupType, tableCount, retentionDays }) {
  const body = String(content || "");
  const fileFormat = normalizeChoice(format || inferBackupFormat(name), ["sql", "json"], "sql");
  const normalizedScope = normalizeBackupScope(scope || inferBackupScopeFromName(name), DEFAULT_BACKUP_SCOPE);
  const type = normalizeChoice(backupType || inferBackupType(name), ["manual", "auto", "import", "restore_safety"], "manual");
  let retentionSource = retentionDays;
  if (!retentionSource) {
    try {
      const settings = await getMallSettings(env);
      retentionSource = settings.backup?.retentionDays || settings.backup?.keepDays || 7;
    } catch {
      retentionSource = 7;
    }
  }
  const retention = Math.max(1, Math.min(3650, Number.parseInt(retentionSource || 7, 10) || 7));
  const expiresAt = new Date(Date.now() + retention * 24 * 60 * 60 * 1000).toISOString();
  await env.DB.prepare(
    `INSERT INTO mall_backup_records (id, name, size_bytes, format, content_text, created_by, backup_type, scope_json, table_count, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id || `backup-${Date.now()}`,
    normalizeText(name, 180) || `linuxdo-mall-backup-${Date.now()}.${fileFormat}`,
    body.length,
    fileFormat,
    body,
    admin?.linuxdo?.username || admin?.username || "",
    type,
    JSON.stringify(normalizedScope),
    Math.max(0, Number.parseInt(tableCount || 0, 10) || 0),
    expiresAt
  ).run();
  try {
    const settings = await getMallSettings(env);
    await pruneMallBackupRecords(env, settings.backup?.retentionDays || settings.backup?.keepDays || 7);
  } catch {
    // 过期备份清理失败不影响本次备份写入。
  }
}

async function pruneMallBackupRecords(env, keepDays = 7) {
  const days = Math.max(1, Math.min(3650, Number.parseInt(keepDays || 7, 10) || 7));
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  await env.DB.prepare("DELETE FROM mall_backup_records WHERE datetime(created_at) < datetime(?)")
    .bind(cutoff)
    .run();
}

async function downloadMallBackupRecord(env, backupId) {
  await ensureMallSeed(env);
  const record = await loadMallBackupRecord(env, backupId);
  if (!record) {
    throw new ApiError(404, "backup_not_found", "备份记录不存在");
  }
  if (!record.content) {
    throw new ApiError(404, "backup_content_missing", "这个备份是旧记录，只保存了文件名和大小，没有保存备份内容");
  }
  const format = normalizeChoice(record.format, ["sql", "json"], inferBackupFormat(record.name));
  return new Response(record.content, {
    headers: {
      "Content-Type": format === "json" ? "application/json; charset=utf-8" : "application/sql; charset=utf-8",
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename="${sanitizeDownloadFilename(record.name, `linuxdo-mall-backup.${format}`)}"`
    }
  });
}

async function restoreMallBackupRecord(env, admin, backupId) {
  await ensureMallSeed(env);
  const record = await loadMallBackupRecord(env, backupId);
  if (!record) {
    throw new ApiError(404, "backup_not_found", "备份记录不存在");
  }
  if (!record.content) {
    throw new ApiError(404, "backup_content_missing", "这个备份是旧记录，只保存了文件名和大小，无法直接恢复");
  }
  const format = normalizeChoice(record.format, ["sql", "json"], inferBackupFormat(record.name));
  if (format === "json") {
    throw new ApiError(400, "json_restore_not_full", "旧版 JSON 备份不支持一键完整恢复，请使用 SQL 数据库备份");
  }
  await exportMallAdminSqlData(env, admin, {
    recordOnly: true,
    requireStoredContent: true,
    backupType: "restore_safety",
    scope: DEFAULT_BACKUP_SCOPE
  });
  return await importMallAdminSqlData(record.content, env, admin, { skipRecord: true, restoredFrom: record.id });
}

async function runScheduledMallBackup(env) {
  await ensureMallSeed(env);
  const settings = await getMallSettings(env);
  await maybeRunDueMallBackup(env, settings);
}

async function maybeRunDueMallBackup(env, settings) {
  const backup = settings?.backup || {};
  const frequency = normalizeChoice(backup.frequency, BACKUP_FREQUENCIES, "daily");
  if (backup.enabled === false || frequency === "manual") {
    return;
  }
  const now = new Date();
  const last = await env.DB.prepare(
    "SELECT created_at FROM mall_backup_records WHERE created_by = 'system' AND name LIKE 'linuxdo-mall-auto-%' ORDER BY created_at DESC LIMIT 1"
  ).first();
  if (!isScheduledBackupDue(frequency, backup.hour, last?.created_at, now)) {
    return;
  }
  await exportMallAdminSqlData(env, {
    id: "scheduled-backup",
    username: "system",
    linuxdo: { username: "system", id: "" }
  }, {
    recordOnly: true,
    requireStoredContent: true,
    scope: backup.scope || DEFAULT_BACKUP_SCOPE,
    auto: true
  });
}

function isScheduledBackupDue(frequency, configuredHour, lastCreatedAt, now = new Date()) {
  const intervalMs = {
    hourly: 60 * 60 * 1000,
    daily: 24 * 60 * 60 * 1000,
    weekly: 7 * 24 * 60 * 60 * 1000,
    monthly: 30 * 24 * 60 * 60 * 1000
  }[frequency];
  if (!intervalMs) {
    return false;
  }
  const lastMs = Date.parse(lastCreatedAt || "");
  if (Number.isFinite(lastMs) && now.getTime() - lastMs < intervalMs - 60 * 1000) {
    return false;
  }
  if (frequency === "hourly") {
    return true;
  }
  const beijing = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const hour = beijing.getUTCHours();
  const targetHour = Math.max(0, Math.min(23, Number.parseInt(configuredHour || 4, 10) || 4));
  return hour >= targetHour;
}

function inferBackupFormat(name) {
  return /\.json$/i.test(String(name || "")) ? "json" : "sql";
}

function inferBackupType(name) {
  const text = String(name || "").toLowerCase();
  if (text.startsWith("linuxdo-mall-auto-")) return "auto";
  if (text.startsWith("import-")) return "import";
  if (text.includes("restore-safety")) return "restore_safety";
  return "manual";
}

function inferBackupScopeFromName(name) {
  const text = String(name || "").toLowerCase();
  const match = text.match(/linuxdo-mall-(?:backup|auto)-([a-z-]+)-\d{4}-\d{2}-\d{2}t/);
  if (!match) return DEFAULT_BACKUP_SCOPE;
  return normalizeBackupScope(match[1].split("-"), DEFAULT_BACKUP_SCOPE);
}

function extractSqlBackupScope(sql) {
  const match = String(sql || "").match(/^--\s*Scope:\s*([^\r\n]+)/im);
  return normalizeBackupScope(match?.[1] || DEFAULT_BACKUP_SCOPE, DEFAULT_BACKUP_SCOPE);
}

function extractSqlBackupTableCount(sql) {
  const match = String(sql || "").match(/^--\s*Tables:\s*([^\r\n]+)/im);
  if (!match) return 0;
  const tables = match[1].split(",").map((item) => item.trim()).filter((item) => SQL_BACKUP_TABLES.includes(item));
  return new Set(tables).size;
}

function sanitizeDownloadFilename(value, fallback) {
  const name = String(value || fallback || "backup.sql").replace(/[\\/:*?"<>|\r\n]+/g, "-").slice(0, 180);
  return name || fallback || "backup.sql";
}

async function loadMallMessagesForBackup(env, limit = 3000) {
  const safeLimit = normalizeAdminListLimit(limit, 3000);
  const rows = await env.DB.prepare(
    `SELECT id, conversation_id, sender_id, sender_name, sender_role, content, created_at
     FROM mall_messages
     ORDER BY id DESC
     LIMIT ?`
  ).bind(safeLimit).all();
  return (rows.results || []).map(formatMallMessage);
}

async function loadMallLotteryDraws(env, limit = 3000) {
  const safeLimit = normalizeAdminListLimit(limit, 3000);
  const rows = await env.DB.prepare(
    `SELECT id, user_id, product_id, draw_date, scope_key, prize_label, prize_value, created_at
     FROM mall_lottery_draws
     ORDER BY created_at DESC
     LIMIT ?`
  ).bind(safeLimit).all();
  return (rows.results || []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    productId: row.product_id,
    drawDate: row.draw_date,
    scopeKey: row.scope_key || "",
    prizeLabel: row.prize_label || "",
    prizeValue: Number(row.prize_value || 1),
    createdAt: row.created_at
  }));
}

async function loadSqlBackupRows(env, tableName) {
  assertSqlBackupTable(tableName);
  const rows = await env.DB.prepare(`SELECT * FROM ${tableName}`).all();
  return rows.results || [];
}

function buildSqlInsert(tableName, row) {
  assertSqlBackupTable(tableName);
  const entries = Object.entries(row || {});
  const columns = entries.map(([key]) => `"${key.replace(/"/g, '""')}"`).join(", ");
  const values = entries.map(([, value]) => sqlLiteral(value)).join(", ");
  return `INSERT INTO ${tableName} (${columns}) VALUES (${values});`;
}

function sqlLiteral(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "NULL";
  }
  if (typeof value === "boolean") {
    return value ? "1" : "0";
  }
  if (value instanceof ArrayBuffer) {
    return `X'${bytesToHex(new Uint8Array(value))}'`;
  }
  if (ArrayBuffer.isView(value)) {
    return `X'${bytesToHex(new Uint8Array(value.buffer, value.byteOffset, value.byteLength))}'`;
  }
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlCommentValue(value) {
  return String(value || "").replace(/[\r\n]/g, " ").slice(0, 120);
}

function parseBackupScopeList(value) {
  const values = Array.isArray(value) ? value : [value];
  return values
    .flatMap((item) => String(item ?? "").split(","))
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeBackupScope(value, fallback = DEFAULT_BACKUP_SCOPE) {
  const requested = parseBackupScopeList(value);
  const normalized = requested.filter((item, index) => BACKUP_SCOPE_KEYS.includes(item) && requested.indexOf(item) === index);
  if (normalized.includes("all")) {
    return ["all"];
  }
  if (normalized.length) {
    return normalized;
  }
  const fallbackValues = parseBackupScopeList(fallback).filter((item, index, list) => BACKUP_SCOPE_KEYS.includes(item) && list.indexOf(item) === index);
  if (fallbackValues.includes("all")) {
    return ["all"];
  }
  return fallbackValues.length ? fallbackValues : ["all"];
}

function resolveBackupScopeTables(scope) {
  const normalized = normalizeBackupScope(scope);
  if (normalized.includes("all")) {
    return SQL_BACKUP_TABLES.filter((tableName) => !SQL_BACKUP_DEFAULT_EXCLUDED_TABLES.has(tableName));
  }
  const tables = new Set();
  for (const key of normalized) {
    for (const tableName of SQL_BACKUP_SCOPE_GROUPS[key] || []) {
      tables.add(tableName);
    }
  }
  return SQL_BACKUP_TABLES.filter((tableName) => tables.has(tableName));
}

function parseBackupScopeFromRequest(url, options = {}) {
  const repeated = url.searchParams.getAll("scope").filter(Boolean);
  const rawScope = repeated.length
    ? repeated
    : (url.searchParams.get("scopes") || url.searchParams.get("scope") || options.scope || options.exportScope);
  return normalizeBackupScope(rawScope, ["all"]);
}

function assertSqlBackupTable(tableName) {
  if (!SQL_BACKUP_TABLES.includes(tableName)) {
    throw new ApiError(400, "invalid_backup_table", "备份表不在允许范围内");
  }
}

function looksLikeMallSqlBackup(sql) {
  const text = String(sql || "").trimStart();
  return text.startsWith(SQL_BACKUP_MARKER);
}

function splitSqlStatements(sql) {
  const statements = [];
  let current = "";
  let quote = "";
  let lineComment = false;
  for (let index = 0; index < sql.length; index += 1) {
    const char = sql[index];
    const next = sql[index + 1] || "";
    if (lineComment) {
      current += char;
      if (char === "\n") lineComment = false;
      continue;
    }
    if (!quote && char === "-" && next === "-") {
      lineComment = true;
      current += char;
      continue;
    }
    if (quote) {
      current += char;
      if (char === quote) {
        if (quote === "'" && next === "'") {
          current += next;
          index += 1;
        } else {
          quote = "";
        }
      }
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      current += char;
      continue;
    }
    if (char === ";") {
      const statement = stripSqlComments(current).trim();
      if (statement) statements.push(statement);
      current = "";
      continue;
    }
    current += char;
  }
  const tail = stripSqlComments(current).trim();
  if (tail) statements.push(tail);
  return statements;
}

function stripSqlComments(value) {
  return String(value || "")
    .split(/\r?\n/)
    .filter((line) => !line.trimStart().startsWith("--"))
    .join("\n");
}

function validateSqlBackupStatements(statements) {
  const allowed = new Set(SQL_BACKUP_TABLES);
  for (const statement of statements) {
    const normalized = statement.trim().replace(/\s+/g, " ");
    if (isSqlBackupMetaStatement(normalized)) continue;
    const deleteMatch = normalized.match(/^DELETE FROM ([a-z_][a-z0-9_]*)$/i);
    if (deleteMatch && allowed.has(deleteMatch[1])) continue;
    const insertMatch = normalized.match(/^INSERT INTO ([a-z_][a-z0-9_]*)\s*\(/i);
    if (insertMatch && allowed.has(insertMatch[1])) continue;
    throw new ApiError(400, "unsafe_sql_backup", `SQL 备份包含不允许的语句：${normalized.slice(0, 80)}`);
  }
}

function isSqlBackupMetaStatement(statement) {
  const normalized = String(statement || "").trim().replace(/\s+/g, " ");
  return /^PRAGMA foreign_keys\s*=\s*(?:OFF|ON)$/i.test(normalized)
    || /^(?:BEGIN(?: TRANSACTION)?|COMMIT|END)$/i.test(normalized);
}

function sqlBackupInsertTable(statement) {
  const match = String(statement || "").trim().match(/^INSERT INTO ([a-z_][a-z0-9_]*)\s*\(/i);
  return match ? match[1] : "";
}

function sqlBackupDeleteTable(statement) {
  const match = String(statement || "").trim().replace(/\s+/g, " ").match(/^DELETE FROM ([a-z_][a-z0-9_]*)$/i);
  return match ? match[1] : "";
}

function sqlBackupTouchedTables(statements) {
  const tables = new Set();
  for (const statement of statements) {
    const deleteTable = sqlBackupDeleteTable(statement);
    if (deleteTable) tables.add(deleteTable);
    const insertTable = sqlBackupInsertTable(statement);
    if (insertTable) tables.add(insertTable);
  }
  return tables;
}

function sameStringMultiset(left, right) {
  if (left.length !== right.length) return false;
  const counts = new Map();
  for (const item of left) {
    const key = normalizeSqlBackupCompareText(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  for (const item of right) {
    const key = normalizeSqlBackupCompareText(item);
    const count = counts.get(key) || 0;
    if (!count) return false;
    if (count === 1) counts.delete(key);
    else counts.set(key, count - 1);
  }
  return counts.size === 0;
}

function normalizeSqlBackupCompareText(value) {
  return String(value || "").trim().replace(/;$/, "");
}

async function isMallSqlBackupAlreadyApplied(env, dataStatements) {
  const tables = new Set();
  const importedRows = new Map();
  for (const statement of dataStatements) {
    const deleteTable = sqlBackupDeleteTable(statement);
    if (deleteTable) {
      tables.add(deleteTable);
      continue;
    }
    const insertTable = sqlBackupInsertTable(statement);
    if (insertTable) {
      tables.add(insertTable);
      if (!importedRows.has(insertTable)) importedRows.set(insertTable, []);
      importedRows.get(insertTable).push(String(statement || "").trim());
    }
  }
  if (!tables.size) return false;
  for (const tableName of tables) {
    assertSqlBackupTable(tableName);
    const currentRows = await loadSqlBackupRows(env, tableName);
    const currentStatements = currentRows.map((row) => buildSqlInsert(tableName, row));
    const expectedStatements = importedRows.get(tableName) || [];
    if (!sameStringMultiset(expectedStatements, currentStatements)) {
      return false;
    }
  }
  return true;
}

async function executeBackupStatements(env, statements) {
  let changed = 0;
  let knownChanges = true;
  for (let index = 0; index < statements.length; index += 80) {
    const chunk = statements.slice(index, index + 80).map((statement) => (
      typeof statement === "string" ? env.DB.prepare(statement) : statement
    ));
    const results = await env.DB.batch(chunk);
    for (const result of results || []) {
      const count = d1ChangeCount(result);
      if (count === null) {
        knownChanges = false;
      } else {
        changed += count;
      }
    }
  }
  const imported = knownChanges ? changed : statements.length;
  return {
    imported,
    skippedExact: knownChanges ? Math.max(0, statements.length - changed) : 0,
    checked: statements.length
  };
}

function d1ChangeCount(result) {
  const meta = result?.meta || {};
  for (const key of ["changes", "rows_written", "rowsWritten"]) {
    if (Number.isFinite(Number(meta[key]))) {
      return Number(meta[key]);
    }
  }
  if (meta.changed_db === false || meta.changedDb === false) {
    return 0;
  }
  return null;
}

function d1ChangedExactly(result, expected) {
  const count = d1ChangeCount(result);
  if (count === null) {
    return true;
  }
  return count === expected;
}

async function runD1InChunks(env, items, buildStatement, chunkSize = D1_ID_CHUNK_SIZE) {
  const list = Array.isArray(items) ? items.filter(Boolean) : [];
  const results = [];
  for (let index = 0; index < list.length; index += chunkSize) {
    const chunk = list.slice(index, index + chunkSize);
    const statements = chunk.map((item) => buildStatement(item)).filter(Boolean);
    if (statements.length) {
      results.push(...await env.DB.batch(statements));
    }
  }
  return results;
}

async function queryD1RowsByIdChunks(env, ids, buildStatement, options = {}) {
  const safeIds = normalizeIds(ids).filter(options.uuid ? isUuidLike : isSafeRecordId);
  if (!safeIds.length) {
    return [];
  }
  const rows = [];
  const chunkSize = options.chunkSize || D1_ID_CHUNK_SIZE;
  for (let index = 0; index < safeIds.length; index += chunkSize) {
    const chunk = safeIds.slice(index, index + chunkSize);
    const result = await buildStatement(chunk).bind(...chunk).all();
    rows.push(...(result.results || []));
  }
  return rows;
}

async function selectD1RowsByIds(env, tableName, selectSql, columnName, ids, options = {}) {
  const wherePrefix = options.whereSql ? `${options.whereSql} AND ` : "";
  const orderSql = options.orderSql ? ` ORDER BY ${options.orderSql}` : "";
  return await queryD1RowsByIdChunks(env, ids, (chunk) => env.DB.prepare(
    `SELECT ${selectSql} FROM ${tableName} WHERE ${wherePrefix}${columnName} IN (${chunk.map(() => "?").join(",")})${orderSql}`
  ), options);
}

async function deleteD1RowsByIds(env, tableName, columnName, ids, options = {}) {
  const safeIds = normalizeIds(ids).filter(options.uuid ? isUuidLike : isSafeRecordId);
  if (!safeIds.length) {
    return 0;
  }
  let deleted = 0;
  for (let index = 0; index < safeIds.length; index += D1_ID_CHUNK_SIZE) {
    const chunk = safeIds.slice(index, index + D1_ID_CHUNK_SIZE);
    const result = await env.DB.prepare(
      `DELETE FROM ${tableName} WHERE ${columnName} IN (${chunk.map(() => "?").join(",")})`
    ).bind(...chunk).run();
    const changes = d1ChangeCount(result);
    deleted += changes == null ? chunk.length : changes;
  }
  return deleted;
}

async function updateD1RowsByIds(env, tableName, columnName, ids, setSql, bindPrefix = [], options = {}) {
  const safeIds = normalizeIds(ids).filter(options.uuid ? isUuidLike : isSafeRecordId);
  if (!safeIds.length) {
    return 0;
  }
  let updated = 0;
  for (let index = 0; index < safeIds.length; index += D1_ID_CHUNK_SIZE) {
    const chunk = safeIds.slice(index, index + D1_ID_CHUNK_SIZE);
    const result = await env.DB.prepare(
      `UPDATE ${tableName} SET ${setSql} WHERE ${columnName} IN (${chunk.map(() => "?").join(",")})`
    ).bind(...bindPrefix, ...chunk).run();
    const changes = d1ChangeCount(result);
    updated += changes == null ? chunk.length : changes;
  }
  return updated;
}

async function deleteD1RowsBySubqueryIds(env, targetTable, targetColumn, sourceTable, sourceColumn, ids, options = {}) {
  const safeIds = normalizeIds(ids).filter(options.uuid ? isUuidLike : isSafeRecordId);
  if (!safeIds.length) {
    return 0;
  }
  let deleted = 0;
  for (let index = 0; index < safeIds.length; index += D1_ID_CHUNK_SIZE) {
    const chunk = safeIds.slice(index, index + D1_ID_CHUNK_SIZE);
    const result = await env.DB.prepare(
      `DELETE FROM ${targetTable}
       WHERE ${targetColumn} IN (
         SELECT id FROM ${sourceTable} WHERE ${sourceColumn} IN (${chunk.map(() => "?").join(",")})
       )`
    ).bind(...chunk).run();
    const changes = d1ChangeCount(result);
    deleted += changes == null ? chunk.length : changes;
  }
  return deleted;
}

async function deleteMallUsersByIds(env, ids = []) {
  const userIds = normalizeUserIds(ids);
  if (!userIds.length) {
    return 0;
  }

  await deleteD1RowsBySubqueryIds(env, "mall_messages", "conversation_id", "mall_conversations", "user_id", userIds, { uuid: true });
  await deleteD1RowsBySubqueryIds(env, "mall_feedback_logs", "feedback_id", "mall_feedback", "user_id", userIds, { uuid: true });
  await deleteD1RowsByIds(env, "leaderboard_scores", "user_id", userIds, { uuid: true });
  await deleteD1RowsByIds(env, "game_sync", "user_id", userIds, { uuid: true });
  await deleteD1RowsByIds(env, "sessions", "user_id", userIds, { uuid: true });
  await deleteD1RowsByIds(env, "oauth_accounts", "user_id", userIds, { uuid: true });
  await updateD1RowsByIds(env, "mall_cards", "used_by", userIds, "order_id = '', used_by = ''", [], { uuid: true });
  await deleteD1RowsByIds(env, "mall_conversations", "user_id", userIds, { uuid: true });
  await deleteD1RowsByIds(env, "mall_ratings", "user_id", userIds, { uuid: true });
  await deleteD1RowsByIds(env, "mall_feedback", "user_id", userIds, { uuid: true });
  await deleteD1RowsByIds(env, "mall_ldc_ledger", "user_id", userIds, { uuid: true });
  await deleteD1RowsByIds(env, "mall_refunds", "user_id", userIds, { uuid: true });
  await deleteD1RowsByIds(env, "mall_lottery_draws", "user_id", userIds, { uuid: true });
  await deleteD1RowsByIds(env, "mall_user_coupons", "user_id", userIds, { uuid: true });
  await deleteD1RowsByIds(env, "mall_orders", "user_id", userIds, { uuid: true });
  return await deleteD1RowsByIds(env, "users", "id", userIds, { uuid: true });
}

function sqlChangedWhere(columns, tableAlias = "") {
  const prefix = tableAlias ? `${tableAlias}.` : "";
  return columns.map((column) => `${prefix}${column} IS NOT excluded.${column}`).join(" OR ");
}

async function exportMallAdminData(request, env, admin, options = {}) {
  const url = new URL(request.url);
  const format = normalizeChoice(url.searchParams.get("format"), ["sql", "json"], "sql");
  const scope = parseBackupScopeFromRequest(url, options);
  const exportOptions = { ...options, scope };
  if (format === "json") {
    return await exportMallAdminJsonData(env, admin, exportOptions);
  }
  return await exportMallAdminSqlData(env, admin, exportOptions);
}

async function exportMallAdminJsonData(env, admin, options = {}) {
  await ensureMallSeed(env);
  const scope = normalizeBackupScope(options.scope || options.exportScope || "all");
  const selectedTables = new Set(resolveBackupScopeTables(scope));
  const shouldExport = (tableName) => selectedTables.has(tableName);
  const [settings, products, orders, cards, coupons, userCoupons, ratings, ads, feedback, feedbackLogs, ldcLedger, users, blacklist, emailTemplates, backupRecords, loginAttempts, conversations, messages, lotteryDraws, refunds, auditLogs] = await Promise.all([
    shouldExport("mall_settings") ? getMallSettings(env) : null,
    shouldExport("mall_products") ? loadMallProducts(env, { includeDeleted: true }) : [],
    shouldExport("mall_orders") ? loadMallAdminOrders(env, ADMIN_MAX_LIST_LIMIT) : [],
    shouldExport("mall_cards") ? loadMallCards(env, ADMIN_MAX_LIST_LIMIT) : [],
    shouldExport("mall_coupons") ? loadMallCoupons(env, ADMIN_MAX_LIST_LIMIT) : [],
    shouldExport("mall_user_coupons") ? loadMallUserCouponsForBackup(env, ADMIN_MAX_LIST_LIMIT) : [],
    shouldExport("mall_ratings") ? loadMallAdminRatings(env, ADMIN_MAX_LIST_LIMIT) : [],
    shouldExport("mall_ads") ? loadMallAds(env, { includeInactive: true }) : [],
    shouldExport("mall_feedback") ? loadMallFeedback(env, { admin: true, limit: 3000 }) : [],
    shouldExport("mall_feedback_logs") ? loadMallFeedbackLogs(env, { limit: 5000 }) : [],
    shouldExport("mall_ldc_ledger") ? loadMallLdcLedger(env, 3000) : [],
    shouldExport("users") ? loadMallUsers(env, ADMIN_MAX_LIST_LIMIT) : [],
    shouldExport("mall_blacklist") ? loadMallBlacklist(env, ADMIN_MAX_LIST_LIMIT) : [],
    shouldExport("mall_email_templates") ? loadMallEmailTemplates(env, ADMIN_MAX_LIST_LIMIT) : [],
    loadMallBackupRecords(env, 80),
    shouldExport("mall_login_attempts") ? loadMallLoginAttempts(env, ADMIN_MAX_LIST_LIMIT) : [],
    shouldExport("mall_conversations") ? loadMallChatConversations(env, { admin: true, limit: ADMIN_MAX_LIST_LIMIT }) : [],
    shouldExport("mall_messages") ? loadMallMessagesForBackup(env, ADMIN_MAX_LIST_LIMIT) : [],
    shouldExport("mall_lottery_draws") ? loadMallLotteryDraws(env, ADMIN_MAX_LIST_LIMIT) : [],
    shouldExport("mall_refunds") ? loadMallRefunds(env, ADMIN_MAX_LIST_LIMIT) : [],
    shouldExport("mall_admin_audit_logs") ? loadMallAdminAuditLogs(env, ADMIN_MAX_LIST_LIMIT) : []
  ]);
  const backup = {
    exportedAt: new Date().toISOString(),
    project: "Linuxdo-Mall Cloudflare",
    scope,
    tables: Array.from(selectedTables),
    admin: {
      username: admin.linuxdo?.username || admin.username,
      linuxdoId: admin.linuxdo?.id || ""
    },
    settings,
    products,
    orders,
    cards,
    coupons,
    userCoupons,
    ratings,
    ads,
    feedback,
    feedbackLogs,
    ldcLedger,
    users,
    blacklist,
    emailTemplates,
    backupRecords,
    loginAttempts,
    conversations,
    messages,
    lotteryDraws,
    refunds,
    auditLogs
  };
  const body = JSON.stringify(backup, null, 2);
  const recordId = `backup-${Date.now()}`;
  const scopeName = scope.includes("all") ? "all" : scope.join("-");
  const name = `linuxdo-mall-backup-${scopeName}-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  try {
    await saveMallBackupRecord(env, {
      id: recordId,
      name,
      format: "json",
      content: body,
      admin,
      scope,
      backupType: options.backupType || "manual",
      tableCount: selectedTables.size,
      retentionDays: options.retentionDays
    });
  } catch (error) {
    if (options.requireStoredContent) {
      throw new ApiError(507, "backup_store_failed", "当前数据无法先保存到 D1 备份表，已停止恢复操作");
    }
    await (async () => {
      await env.DB.prepare("INSERT INTO mall_backup_records (id, name, size_bytes, format, created_by, backup_type, scope_json, table_count) VALUES (?, ?, ?, 'json', ?, ?, ?, ?)")
        .bind(recordId, name, body.length, admin.linuxdo?.username || admin.username || "", options.backupType || "manual", JSON.stringify(scope), selectedTables.size)
        .run();
    })();
  }
  if (options.recordOnly) {
    return json({ ok: true, record: { id: recordId, name, sizeBytes: body.length } });
  }
  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename="${name}"`
    }
  });
}

async function exportMallAdminSqlData(env, admin, options = {}) {
  await ensureMallSeed(env);
  const scope = normalizeBackupScope(options.scope || options.exportScope || "all");
  const tables = resolveBackupScopeTables(scope);
  const exportedAt = new Date().toISOString();
  const chunks = [
    SQL_BACKUP_MARKER,
    `-- Exported-At: ${exportedAt}`,
    `-- Admin: ${sqlCommentValue(admin.linuxdo?.username || admin.username || "")}`,
    `-- Linuxdo-ID: ${sqlCommentValue(admin.linuxdo?.id || "")}`,
    `-- Scope: ${sqlCommentValue(scope.join(","))}`,
    `-- Tables: ${sqlCommentValue(tables.join(","))}`,
    "PRAGMA foreign_keys=OFF;",
    "BEGIN TRANSACTION;"
  ];
  for (const tableName of [...tables].reverse()) {
    chunks.push(`DELETE FROM ${tableName};`);
  }
  for (const tableName of tables) {
    const rows = await loadSqlBackupRows(env, tableName);
    for (const row of rows) {
      chunks.push(buildSqlInsert(tableName, row));
    }
  }
  chunks.push(
    "COMMIT;",
    "PRAGMA foreign_keys=ON;",
    ""
  );
  const body = chunks.join("\n");
  const recordId = `backup-${Date.now()}`;
  const scopeName = scope.includes("all") ? "all" : scope.join("-");
  const prefix = options.auto ? "linuxdo-mall-auto" : "linuxdo-mall-backup";
  const name = `${prefix}-${scopeName}-${exportedAt.replace(/[:.]/g, "-")}.sql`;
  try {
    await saveMallBackupRecord(env, {
      id: recordId,
      name,
      format: "sql",
      content: body,
      admin,
      scope,
      backupType: options.backupType || (options.auto ? "auto" : "manual"),
      tableCount: tables.length,
      retentionDays: options.retentionDays
    });
  } catch (error) {
    if (options.requireStoredContent) {
      throw new ApiError(507, "backup_store_failed", "当前数据无法先保存到 D1 备份表，已停止恢复操作");
    }
    await (async () => {
      await env.DB.prepare("INSERT INTO mall_backup_records (id, name, size_bytes, format, created_by, backup_type, scope_json, table_count) VALUES (?, ?, ?, 'sql', ?, ?, ?, ?)")
        .bind(recordId, name, body.length, admin.linuxdo?.username || admin.username || "", options.backupType || (options.auto ? "auto" : "manual"), JSON.stringify(scope), tables.length)
        .run();
    })();
  }
  if (options.recordOnly) {
    return json({ ok: true, record: { id: recordId, name, sizeBytes: body.length } });
  }
  return new Response(body, {
    headers: {
      "Content-Type": "application/sql; charset=utf-8",
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename="${name}"`
    }
  });
}

async function importMallAdminData(request, env, admin) {
  await ensureMallSeed(env);
  await exportMallAdminSqlData(env, admin, {
    recordOnly: true,
    requireStoredContent: true,
    backupType: "restore_safety",
    scope: DEFAULT_BACKUP_SCOPE
  });
  const contentType = request.headers.get("content-type") || "";
  if (/text\/|sql|octet-stream/i.test(contentType)) {
    const sql = await request.text();
    if (looksLikeMallSqlBackup(sql)) {
      return await importMallAdminSqlData(sql, env, admin);
    }
    throw new ApiError(400, "invalid_sql_backup", "SQL 备份文件格式不正确");
  }
  const backup = await readJson(request);
  return await importMallAdminJsonData(backup, env, admin);
}

async function importMallAdminJsonData(backup, env, admin, options = {}) {
  await ensureMallSeed(env);
  if (!backup || typeof backup !== "object" || backup.project !== "Linuxdo-Mall Cloudflare") {
    throw new ApiError(400, "invalid_backup", "备份文件格式不正确");
  }
  const mode = normalizeChoice(backup.mode || "merge", ["merge", "replace"], "merge");
  const backupUsers = normalizeBackupArray(backup.users, 1000);
  const requireImportedUsers = backupUsers.length > 0;
  const importedUserIds = new Set();
  const statements = [];
  if (mode === "replace") {
    statements.push(
      env.DB.prepare("DELETE FROM mall_settings"),
      env.DB.prepare("DELETE FROM mall_products"),
      env.DB.prepare("DELETE FROM mall_orders"),
      env.DB.prepare("DELETE FROM mall_cards"),
      env.DB.prepare("DELETE FROM mall_coupons"),
      env.DB.prepare("DELETE FROM mall_user_coupons"),
      env.DB.prepare("DELETE FROM mall_ratings"),
      env.DB.prepare("DELETE FROM mall_ads"),
      env.DB.prepare("DELETE FROM mall_feedback"),
      env.DB.prepare("DELETE FROM mall_feedback_logs"),
      env.DB.prepare("DELETE FROM mall_ldc_ledger"),
      env.DB.prepare("DELETE FROM mall_blacklist"),
      env.DB.prepare("DELETE FROM mall_email_templates"),
      env.DB.prepare("DELETE FROM mall_login_attempts"),
      env.DB.prepare("DELETE FROM mall_conversations"),
      env.DB.prepare("DELETE FROM mall_messages"),
      env.DB.prepare("DELETE FROM mall_lottery_draws"),
      env.DB.prepare("DELETE FROM mall_refunds"),
      env.DB.prepare("DELETE FROM mall_admin_audit_logs")
    );
    if (requireImportedUsers) {
      statements.push(
        env.DB.prepare("DELETE FROM sessions"),
        env.DB.prepare("DELETE FROM oauth_accounts"),
        env.DB.prepare("DELETE FROM users")
      );
    }
  }
  if (backup.settings) {
    const settings = mergeMallSettings(MALL_DEFAULT_SETTINGS, backup.settings);
    statements.push(
      env.DB.prepare(
        `INSERT INTO mall_settings (key, value_json, updated_at) VALUES ('settings', ?, CURRENT_TIMESTAMP)
         ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = CURRENT_TIMESTAMP
         WHERE mall_settings.value_json IS NOT excluded.value_json`
      ).bind(JSON.stringify(settings))
    );
  }
  for (const user of backupUsers) {
    const userId = normalizeText(user.id, 80);
    const username = normalizeStoredAccountUsername(user.accountUsername || user.username);
    if (!userId || !username) continue;
    importedUserIds.add(userId);
    statements.push(env.DB.prepare(
      `INSERT INTO users (
        id, username, username_lower, password_hash, password_salt,
        register_ip, last_ip, last_user_agent, last_seen_at,
        notification_email, notify_email_enabled, last_test_email_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP), COALESCE(?, CURRENT_TIMESTAMP))
      ON CONFLICT(id) DO UPDATE SET
        username = excluded.username,
        username_lower = excluded.username_lower,
        register_ip = excluded.register_ip,
        last_ip = excluded.last_ip,
        last_user_agent = excluded.last_user_agent,
        last_seen_at = excluded.last_seen_at,
        notification_email = excluded.notification_email,
        notify_email_enabled = excluded.notify_email_enabled,
        last_test_email_at = excluded.last_test_email_at,
        updated_at = CURRENT_TIMESTAMP
      WHERE ${sqlChangedWhere([
        "username", "username_lower", "register_ip", "last_ip", "last_user_agent",
        "last_seen_at", "notification_email", "notify_email_enabled", "last_test_email_at"
      ], "users")}`
    ).bind(
      userId,
      username,
      username.toLowerCase(),
      "imported_locked",
      randomHex(16),
      normalizeText(user.registerIp, 80),
      normalizeText(user.lastIp, 80),
      normalizeText(user.lastUserAgent, 500),
      normalizeNullableDate(user.lastSeenAt),
      normalizeEmailAddress(user.email),
      user.notifyEmailEnabled ? 1 : 0,
      normalizeNullableDate(user.lastTestEmailAt),
      normalizeNullableDate(user.createdAt),
      normalizeNullableDate(user.updatedAt || user.createdAt)
    ));
    if (/^\d+$/.test(String(user.linuxdoId || ""))) {
      statements.push(env.DB.prepare(
        `INSERT INTO oauth_accounts (provider, subject, user_id, username, trust_level, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP), COALESCE(?, CURRENT_TIMESTAMP))
         ON CONFLICT(provider, subject) DO UPDATE SET
           user_id = excluded.user_id,
           username = excluded.username,
           trust_level = excluded.trust_level,
           updated_at = excluded.updated_at
         WHERE ${sqlChangedWhere(["user_id", "username", "trust_level", "updated_at"], "oauth_accounts")}`
      ).bind(
        LINUXDO_PROVIDER,
        String(user.linuxdoId),
        userId,
        normalizeText(user.username || user.accountUsername, 120),
        Math.max(0, Math.min(4, Number.parseInt(user.linuxdoTrustLevel || 0, 10) || 0)),
        normalizeNullableDate(user.createdAt),
        normalizeNullableDate(user.updatedAt || user.createdAt)
      ));
    }
  }
  for (const product of normalizeBackupArray(backup.products, 1000)) {
    const item = normalizeProductPayload(product, product);
    statements.push(env.DB.prepare(
      `INSERT INTO mall_products (
        id, name, description, category, price, original_price, stock, manual_stock,
        status, image_url, images_json, features_json, official_token, usage_guide, requires_user_info,
        after_sale_enabled, after_sale_guide, user_info_fields_json, stock_threshold, limit_per_user, min_trust_level,
        payment_mode, delivery_mode, fixed_delivery_url, fixed_delivery_label, fixed_delivery_links_json, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name, description = excluded.description, category = excluded.category,
        price = excluded.price, original_price = excluded.original_price, stock = excluded.stock,
        manual_stock = excluded.manual_stock, status = excluded.status, image_url = excluded.image_url,
        images_json = excluded.images_json, features_json = excluded.features_json,
        official_token = excluded.official_token, usage_guide = excluded.usage_guide,
        requires_user_info = excluded.requires_user_info, after_sale_enabled = excluded.after_sale_enabled,
        after_sale_guide = excluded.after_sale_guide, user_info_fields_json = excluded.user_info_fields_json,
        stock_threshold = excluded.stock_threshold, limit_per_user = excluded.limit_per_user,
        min_trust_level = excluded.min_trust_level, payment_mode = excluded.payment_mode,
        delivery_mode = excluded.delivery_mode, fixed_delivery_url = excluded.fixed_delivery_url,
        fixed_delivery_label = excluded.fixed_delivery_label, fixed_delivery_links_json = excluded.fixed_delivery_links_json,
        sort_order = excluded.sort_order, updated_at = CURRENT_TIMESTAMP
      WHERE ${sqlChangedWhere([
        "name", "description", "category", "price", "original_price", "stock", "manual_stock",
        "status", "image_url", "images_json", "features_json", "official_token", "usage_guide",
        "requires_user_info", "after_sale_enabled", "after_sale_guide", "user_info_fields_json",
        "stock_threshold", "limit_per_user", "min_trust_level", "payment_mode", "delivery_mode",
        "fixed_delivery_url", "fixed_delivery_label", "fixed_delivery_links_json", "sort_order"
      ], "mall_products")}`
    ).bind(
      item.id, item.name, item.description, item.category, item.price, item.originalPrice,
      item.stock, item.manualStock, item.status, item.imageUrl, JSON.stringify(item.images),
      JSON.stringify(item.features), item.officialToken, item.usageGuide, item.requiresUserInfo ? 1 : 0,
      item.afterSaleEnabled ? 1 : 0, item.afterSaleGuide, JSON.stringify(item.userInfoFields),
      item.stockThreshold, item.limitPerUser, item.minTrustLevel,
      item.paymentMode, item.deliveryMode, item.fixedDeliveryUrl, item.fixedDeliveryLabel, JSON.stringify(item.fixedDeliveryItems || []), item.sortOrder
    ));
  }
  for (const order of normalizeBackupArray(backup.orders, 3000)) {
    if (!isUuidLike(order.id) || !normalizeMallId(order.productId)) continue;
    if (requireImportedUsers && !importedUserIds.has(normalizeText(order.userId, 80))) continue;
    statements.push(env.DB.prepare(
      `INSERT INTO mall_orders (
        id, user_id, product_id, product_name, quantity, amount, final_amount,
        coupon_code, discount_amount, status, note, delivery_content, delivered,
        archived, rated, user_info_json, trade_no, payment_mode, completed_at,
        discounts_json, buyer_username, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP), COALESCE(?, CURRENT_TIMESTAMP))
      ON CONFLICT(id) DO UPDATE SET status = excluded.status, note = excluded.note,
        delivery_content = excluded.delivery_content, delivered = excluded.delivered,
        archived = excluded.archived, rated = excluded.rated, trade_no = excluded.trade_no,
        payment_mode = excluded.payment_mode, completed_at = excluded.completed_at,
        discounts_json = excluded.discounts_json,
        updated_at = CURRENT_TIMESTAMP
      WHERE ${sqlChangedWhere([
        "status", "note", "delivery_content", "delivered", "archived", "rated",
        "trade_no", "payment_mode", "completed_at", "discounts_json"
      ], "mall_orders")}`
    ).bind(
      order.id,
      normalizeText(order.userId, 80),
      normalizeMallId(order.productId),
      normalizeText(order.productName, 160),
      Math.max(1, Number.parseInt(order.quantity || 1, 10) || 1),
      normalizeMoney(order.amount),
      normalizeMoney(order.finalAmount),
      normalizeCouponCode(order.couponCode),
      normalizeMoney(order.discountAmount),
      normalizeOrderStatus(order.status),
      normalizeText(order.note, 1000),
      normalizeText(order.deliveryContent, 4000),
      order.delivered ? 1 : 0,
      order.archived ? 1 : 0,
      order.rated ? 1 : 0,
      JSON.stringify(normalizeUserInfo(order.userInfo)),
      normalizeText(order.tradeNo, 120),
      normalizeChoice(order.paymentMode, ["credit", "test", ""], ""),
      normalizeNullableDate(order.completedAt),
      JSON.stringify(normalizeOrderDiscounts(order.discounts || order.discountDetails || [])),
      normalizeText(order.username || order.buyerUsername, 120),
      normalizeNullableDate(order.createdAt),
      normalizeNullableDate(order.updatedAt)
    ));
  }
  for (const card of normalizeBackupArray(backup.cards, 5000)) {
    if (!isSafeRecordId(card.id) || !normalizeMallId(card.productId)) continue;
    statements.push(env.DB.prepare(
      `INSERT INTO mall_cards (id, product_id, content, status, used_by, order_id, available_at, created_at, used_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP), ?)
       ON CONFLICT(id) DO UPDATE SET product_id = excluded.product_id, content = excluded.content,
       status = excluded.status, used_by = excluded.used_by, order_id = excluded.order_id,
       available_at = excluded.available_at, used_at = excluded.used_at
       WHERE ${sqlChangedWhere([
         "product_id", "content", "status", "used_by", "order_id", "available_at", "used_at"
       ], "mall_cards")}`
    ).bind(
      card.id,
      normalizeMallId(card.productId),
      normalizeText(card.content, 2000),
      normalizeChoice(card.status, ["unused", "scheduled", "reserved", "used", "inactive"], "unused"),
      normalizeText(card.usedBy, 120),
      normalizeText(card.orderId, 120),
      normalizeNullableDate(card.availableAt),
      normalizeNullableDate(card.createdAt),
      normalizeNullableDate(card.usedAt)
    ));
  }
  for (const coupon of normalizeBackupArray(backup.coupons, 2000)) {
    const item = normalizeCouponPayload(coupon, coupon.id || crypto.randomUUID());
    statements.push(env.DB.prepare(
      `INSERT INTO mall_coupons (id, code, product_id, type, value, limit_count, used_count, starts_at, expires_at, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET code = excluded.code, product_id = excluded.product_id,
       type = excluded.type, value = excluded.value, limit_count = excluded.limit_count,
       used_count = excluded.used_count, starts_at = excluded.starts_at, expires_at = excluded.expires_at,
       status = excluded.status, updated_at = CURRENT_TIMESTAMP
       WHERE ${sqlChangedWhere([
         "code", "product_id", "type", "value", "limit_count", "used_count", "starts_at", "expires_at", "status"
       ], "mall_coupons")}`
    ).bind(item.id, item.code, item.productId, item.type, item.value, item.limitCount, Number(coupon.usedCount || 0), item.startsAt, item.expiresAt, item.status));
  }
  for (const coupon of normalizeBackupArray(backup.userCoupons, 5000)) {
    const item = normalizeMallUserCouponBackup(coupon);
    if (!item || (requireImportedUsers && !importedUserIds.has(item.userId))) continue;
    statements.push(env.DB.prepare(
      `INSERT INTO mall_user_coupons (
        id, user_id, code, campaign_key, source_key, label, type, value, product_id,
        stackable, status, reserved_order_id, used_order_id, rank, meta_json,
        starts_at, expires_at, used_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP), COALESCE(?, CURRENT_TIMESTAMP))
      ON CONFLICT(id) DO UPDATE SET
        code = excluded.code, campaign_key = excluded.campaign_key, source_key = excluded.source_key,
        label = excluded.label, type = excluded.type, value = excluded.value, product_id = excluded.product_id,
        stackable = excluded.stackable, status = excluded.status, reserved_order_id = excluded.reserved_order_id,
        used_order_id = excluded.used_order_id, rank = excluded.rank, meta_json = excluded.meta_json,
        starts_at = excluded.starts_at, expires_at = excluded.expires_at, used_at = excluded.used_at,
        updated_at = excluded.updated_at
      WHERE ${sqlChangedWhere([
        "code", "campaign_key", "source_key", "label", "type", "value", "product_id",
        "stackable", "status", "reserved_order_id", "used_order_id", "rank", "meta_json",
        "starts_at", "expires_at", "used_at", "updated_at"
      ], "mall_user_coupons")}`
    ).bind(
      item.id,
      item.userId,
      item.code,
      item.campaignKey,
      item.sourceKey,
      item.label,
      item.type,
      item.value,
      item.productId,
      item.stackable ? 1 : 0,
      item.status,
      item.reservedOrderId,
      item.usedOrderId,
      item.rank,
      JSON.stringify(item.meta),
      item.startsAt,
      item.expiresAt,
      item.usedAt,
      item.createdAt,
      item.updatedAt
    ));
  }
  for (const ad of normalizeBackupArray(backup.ads, 1000)) {
    const item = normalizeAdPayload(ad, ad.id || crypto.randomUUID());
    statements.push(env.DB.prepare(
      `INSERT INTO mall_ads (id, title, description, image_url, link_url, position, status, sort_order, style_json, starts_at, ends_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET title = excluded.title, description = excluded.description,
       image_url = excluded.image_url, link_url = excluded.link_url, position = excluded.position,
       status = excluded.status, sort_order = excluded.sort_order, style_json = excluded.style_json,
       starts_at = excluded.starts_at, ends_at = excluded.ends_at, updated_at = CURRENT_TIMESTAMP
       WHERE ${sqlChangedWhere([
         "title", "description", "image_url", "link_url", "position", "status",
         "sort_order", "style_json", "starts_at", "ends_at"
       ], "mall_ads")}`
    ).bind(item.id, item.title, item.description, item.imageUrl, item.linkUrl, item.position, item.status, item.sortOrder, JSON.stringify(item.style), item.startsAt, item.endsAt));
  }
  for (const item of normalizeBackupArray(backup.feedback, 3000)) {
    if (!isUuidLike(item.id)) continue;
    if (requireImportedUsers && !importedUserIds.has(normalizeText(item.userId, 80))) continue;
    statements.push(env.DB.prepare(
      `INSERT INTO mall_feedback (
        id, user_id, username, type, title, content, status, reward_amount, admin_note,
        reviewed_by, reviewed_at, submitted_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP), COALESCE(?, CURRENT_TIMESTAMP))
      ON CONFLICT(id) DO UPDATE SET
        username = excluded.username, type = excluded.type, title = excluded.title,
        content = excluded.content, status = excluded.status, reward_amount = excluded.reward_amount,
        admin_note = excluded.admin_note, reviewed_by = excluded.reviewed_by,
        reviewed_at = excluded.reviewed_at, submitted_at = excluded.submitted_at, updated_at = CURRENT_TIMESTAMP
      WHERE ${sqlChangedWhere([
        "username", "type", "title", "content", "status", "reward_amount",
        "admin_note", "reviewed_by", "reviewed_at", "submitted_at"
      ], "mall_feedback")}`
    ).bind(
      item.id,
      normalizeText(item.userId, 80),
      normalizeText(item.username, 120),
      normalizeChoice(item.type, ["bug", "question"], "bug"),
      normalizeText(item.title, 120),
      normalizeText(item.content, 3000),
      normalizeFeedbackStatus(item.status),
      Number(item.rewardAmount || 0) > 0 ? normalizeLdcReward(item.rewardAmount) : 0,
      normalizeText(item.adminNote, 1000),
      normalizeText(item.reviewedBy, 80),
      normalizeNullableDate(item.reviewedAt),
      normalizeNullableDate(item.submittedAt),
      normalizeNullableDate(item.createdAt),
      normalizeNullableDate(item.updatedAt)
    ));
  }
  for (const item of normalizeBackupArray(backup.ldcLedger, 5000)) {
    if (!isSafeRecordId(item.id)) continue;
    if (requireImportedUsers && !importedUserIds.has(normalizeText(item.userId, 80))) continue;
    statements.push(env.DB.prepare(
      `INSERT INTO mall_ldc_ledger (id, user_id, username, amount, reason, source_type, source_id, created_by, external_trade_no, external_status, external_error, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))
       ON CONFLICT(id) DO UPDATE SET
         username = excluded.username, amount = excluded.amount, reason = excluded.reason,
         source_type = excluded.source_type, source_id = excluded.source_id, created_by = excluded.created_by,
         external_trade_no = excluded.external_trade_no, external_status = excluded.external_status,
         external_error = excluded.external_error
       WHERE ${sqlChangedWhere(["username", "amount", "reason", "source_type", "source_id", "created_by", "external_trade_no", "external_status", "external_error"], "mall_ldc_ledger")}`
    ).bind(
      item.id,
      normalizeText(item.userId, 80),
      normalizeText(item.username, 120),
      normalizeLdcReward(item.amount || 50),
      normalizeText(item.reason, 300),
      normalizeText(item.sourceType, 40),
      normalizeText(item.sourceId, 120),
      normalizeText(item.createdBy, 80),
      normalizeText(item.externalTradeNo, 120),
      normalizeText(item.externalStatus, 40),
      normalizeText(item.externalError, 300),
      normalizeNullableDate(item.createdAt)
    ));
  }
  for (const item of normalizeBackupArray(backup.refunds, 5000)) {
    if (!isSafeRecordId(item.id) || !isUuidLike(item.orderId)) continue;
    if (requireImportedUsers && !importedUserIds.has(normalizeText(item.userId, 80))) continue;
    const method = normalizeChoice(item.method, ["credit", "manual"], "credit");
    const status = normalizeChoice(item.status, ["pending", "processing", "succeeded", "failed"], "pending");
    statements.push(env.DB.prepare(
      `INSERT INTO mall_refunds (
        id, order_id, user_id, amount, method, status, trade_no, external_response_json,
        error, created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP), COALESCE(?, CURRENT_TIMESTAMP))
      ON CONFLICT(order_id, method) DO UPDATE SET
        user_id = excluded.user_id, amount = excluded.amount, status = excluded.status,
        trade_no = excluded.trade_no, external_response_json = excluded.external_response_json,
        error = excluded.error, created_by = excluded.created_by, updated_at = excluded.updated_at
      WHERE ${sqlChangedWhere([
        "user_id", "amount", "status", "trade_no", "external_response_json", "error", "created_by", "updated_at"
      ], "mall_refunds")}`
    ).bind(
      item.id,
      item.orderId,
      normalizeText(item.userId, 80),
      normalizeMoney(item.amount),
      method,
      status,
      normalizeText(item.tradeNo, 120),
      auditJson(item.externalResponse || {}),
      normalizeText(item.error, 500),
      normalizeText(item.createdBy, 80),
      normalizeNullableDate(item.createdAt),
      normalizeNullableDate(item.updatedAt)
    ));
  }
  for (const item of normalizeBackupArray(backup.feedbackLogs, 5000)) {
    if (!isUuidLike(item.feedbackId)) continue;
    statements.push(env.DB.prepare(
      `INSERT OR IGNORE INTO mall_feedback_logs (
        id, feedback_id, actor_id, actor_name, actor_role, action, note, before_json, after_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))`
    ).bind(
      isSafeRecordId(item.id) ? item.id : crypto.randomUUID(),
      item.feedbackId,
      normalizeText(item.actorId, 80),
      normalizeText(item.actorName, 120),
      normalizeChoice(item.actorRole, ["user", "admin", "system"], "user"),
      normalizeText(item.action, 40),
      normalizeText(item.note, 1000),
      JSON.stringify(item.before || {}),
      JSON.stringify(item.after || {}),
      normalizeNullableDate(item.createdAt)
    ));
  }
  for (const item of normalizeBackupArray(backup.blacklist, 2000)) {
    const kind = normalizeChoice(item.kind, ["ip", "user"], "ip");
    const value = normalizeText(item.value, 120);
    if (!value) continue;
    statements.push(env.DB.prepare(
      `INSERT INTO mall_blacklist (id, kind, value, reason, source)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(kind, value) DO UPDATE SET reason = excluded.reason, source = excluded.source
       WHERE ${sqlChangedWhere(["reason", "source"], "mall_blacklist")}`
    ).bind(item.id || crypto.randomUUID(), kind, value, normalizeText(item.reason, 300), normalizeText(item.source || "backup", 80)));
  }
  for (const template of normalizeBackupArray(backup.emailTemplates, 500)) {
    const item = normalizeEmailTemplatePayload(template, template.id);
    statements.push(env.DB.prepare(
      `INSERT INTO mall_email_templates (id, event_type, name, subject, content, params_json, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET event_type = excluded.event_type, name = excluded.name, subject = excluded.subject,
       content = excluded.content, params_json = excluded.params_json,
       is_default = excluded.is_default, updated_at = CURRENT_TIMESTAMP
       WHERE ${sqlChangedWhere(["event_type", "name", "subject", "content", "params_json", "is_default"], "mall_email_templates")}`
    ).bind(item.id, item.eventType, item.name, item.subject, item.content, JSON.stringify(item.params), item.isDefault ? 1 : 0));
  }
  for (const item of normalizeBackupArray(backup.loginAttempts, 3000)) {
    statements.push(env.DB.prepare(
      `INSERT OR IGNORE INTO mall_login_attempts (id, ip, username, success, reason, user_agent, created_at)
       VALUES (?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))`
    ).bind(item.id || crypto.randomUUID(), normalizeText(item.ip, 80), normalizeText(item.username, 120), item.success ? 1 : 0, normalizeText(item.reason, 300), normalizeText(item.userAgent, 500), normalizeNullableDate(item.createdAt)));
  }
  for (const item of normalizeBackupArray(backup.auditLogs, 5000)) {
    statements.push(env.DB.prepare(
      `INSERT OR IGNORE INTO mall_admin_audit_logs (
        id, admin_id, admin_name, action, target_type, target_id, summary,
        before_json, after_json, ip, user_agent, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))`
    ).bind(
      isSafeRecordId(item.id) ? item.id : crypto.randomUUID(),
      normalizeText(item.adminId, 80),
      normalizeText(item.adminName, 120),
      normalizeText(item.action, 80),
      normalizeText(item.targetType, 80),
      normalizeText(item.targetId, 160),
      normalizeText(item.summary, 500),
      auditJson(item.before),
      auditJson(item.after),
      normalizeText(item.ip, 80),
      normalizeText(item.userAgent, 500),
      normalizeNullableDate(item.createdAt)
    ));
  }
  for (const item of normalizeBackupArray(backup.lotteryDraws, 5000)) {
    if (!normalizeMallId(item.productId)) continue;
    if (requireImportedUsers && !importedUserIds.has(normalizeText(item.userId, 80))) continue;
    statements.push(env.DB.prepare(
      `INSERT OR IGNORE INTO mall_lottery_draws (id, user_id, product_id, draw_date, scope_key, prize_label, prize_value, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))`
    ).bind(
      item.id || crypto.randomUUID(),
      normalizeText(item.userId, 80),
      normalizeMallId(item.productId),
      normalizeText(item.drawDate || getBeijingDateKey(), 20),
      normalizeText(item.scopeKey || item.scope_key, 160),
      normalizeText(item.prizeLabel, 60),
      normalizeLotteryValue(item.prizeValue),
      normalizeNullableDate(item.createdAt)
    ));
  }
  const importResult = await executeBackupStatements(env, statements);
  const sessionsPurged = requireImportedUsers;
  if (sessionsPurged) {
    await env.DB.prepare("DELETE FROM sessions").run();
  }
  if (!options.skipRecord) {
    const body = JSON.stringify(backup, null, 2);
    const scope = normalizeBackupScope(backup.scope || DEFAULT_BACKUP_SCOPE, DEFAULT_BACKUP_SCOPE);
    await saveMallBackupRecord(env, {
      id: `import-${Date.now()}`,
      name: `import-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
      format: "json",
      content: body,
      admin,
      scope,
      backupType: "import",
      tableCount: Array.isArray(backup.tables) ? backup.tables.length : resolveBackupScopeTables(scope).length
    });
  }
  return json({ ok: true, imported: importResult.imported, skippedExact: importResult.skippedExact, checked: importResult.checked, mode, sessionsPurged });
}

async function importMallAdminSqlData(sql, env, admin, options = {}) {
  const normalized = String(sql || "");
  if (!looksLikeMallSqlBackup(normalized)) {
    throw new ApiError(400, "invalid_sql_backup", "SQL 备份文件格式不正确");
  }
  if (normalized.length > MAX_SQL_IMPORT_BYTES) {
    throw new ApiError(413, "sql_backup_too_large", "SQL 备份不能超过 8MB");
  }
  const statements = splitSqlStatements(normalized).filter(Boolean);
  if (!statements.length) {
    throw new ApiError(400, "empty_sql_backup", "SQL 备份为空");
  }
  validateSqlBackupStatements(statements);
  const dataStatements = statements.filter((statement) => !isSqlBackupMetaStatement(statement));
  if (await isMallSqlBackupAlreadyApplied(env, dataStatements)) {
    return json({
      ok: true,
      imported: 0,
      skippedExact: dataStatements.length,
      checked: dataStatements.length,
      duplicate: true,
      mode: "skip",
      admin: admin.linuxdo?.username || admin.username || ""
    });
  }
  const touchedTables = sqlBackupTouchedTables(dataStatements);
  const importResult = await executeBackupStatements(env, dataStatements.map((statement) => env.DB.prepare(statement)));
  const sessionsPurged = (touchedTables.has("users") || touchedTables.has("oauth_accounts")) && !touchedTables.has("sessions");
  if (sessionsPurged) {
    await env.DB.prepare("DELETE FROM sessions").run();
  }
  if (!options.skipRecord) {
    const scope = extractSqlBackupScope(normalized);
    await saveMallBackupRecord(env, {
      id: `import-${Date.now()}`,
      name: `import-sql-${new Date().toISOString().replace(/[:.]/g, "-")}.sql`,
      format: "sql",
      content: normalized,
      admin,
      scope,
      backupType: "import",
      tableCount: extractSqlBackupTableCount(normalized) || resolveBackupScopeTables(scope).length
    });
  }
  return json({
    ok: true,
    imported: importResult.imported,
    skippedExact: 0,
    checked: importResult.checked,
    mode: "replace",
    sessionsPurged,
    admin: admin.linuxdo?.username || admin.username || ""
  });
}

function normalizeBackupArray(value, limit = 1000) {
  return Array.isArray(value) ? value.slice(0, limit) : [];
}

async function loadMallUsers(env, limit = 300) {
  const safeLimit = normalizeAdminListLimit(limit, 300);
  const rows = await env.DB.prepare(
    `SELECT
       users.id,
       users.username,
       users.created_at,
       users.register_ip,
       users.last_ip,
       users.last_user_agent,
       users.last_seen_at,
       users.notification_email,
       users.notify_email_enabled,
       users.last_test_email_at,
       oauth_accounts.subject AS linuxdo_id,
       oauth_accounts.username AS linuxdo_username,
       oauth_accounts.trust_level AS linuxdo_trust_level,
       COUNT(mall_orders.id) AS order_count,
       COALESCE(SUM(CASE WHEN mall_orders.status = 'completed' THEN mall_orders.final_amount ELSE 0 END), 0) AS total_spent,
       COALESCE(ldc.balance, 0) AS ldc_balance
     FROM users
     LEFT JOIN oauth_accounts ON oauth_accounts.user_id = users.id
     LEFT JOIN mall_orders ON mall_orders.user_id = users.id
     LEFT JOIN (
       SELECT user_id, SUM(amount) AS balance
       FROM mall_ldc_ledger
       GROUP BY user_id
     ) ldc ON ldc.user_id = users.id
     GROUP BY users.id
     ORDER BY users.created_at DESC
     LIMIT ?`
  ).bind(safeLimit).all();
  return (rows.results || []).map((row) => ({
    id: row.id,
    username: row.linuxdo_username || row.username,
    accountUsername: row.username,
    linuxdoId: row.linuxdo_id || "",
    linuxdoTrustLevel: Number(row.linuxdo_trust_level || 0),
    email: row.notification_email || "",
    notifyEmailEnabled: Boolean(row.notify_email_enabled),
    lastTestEmailAt: row.last_test_email_at || null,
    lastTestEmailAtBeijing: formatBeijingDateTime(row.last_test_email_at),
    createdAt: row.created_at,
    createdAtBeijing: formatBeijingDateTime(row.created_at),
    registerIp: row.register_ip || "",
    lastIp: row.last_ip || "",
    lastUserAgent: row.last_user_agent || "",
    lastSeenAt: row.last_seen_at || null,
    lastSeenAtBeijing: formatBeijingDateTime(row.last_seen_at),
    orderCount: Number(row.order_count || 0),
    totalSpent: Number(row.total_spent || 0),
    ldcBalance: Number(row.ldc_balance || 0)
  }));
}

async function loadMallUsersByIds(env, ids = []) {
  const rows = await queryD1RowsByIdChunks(env, ids, (chunk) => env.DB.prepare(
    `SELECT
       users.id,
       users.username,
       users.created_at,
       users.register_ip,
       users.last_ip,
       users.last_user_agent,
       users.last_seen_at,
       users.notification_email,
       users.notify_email_enabled,
       users.last_test_email_at,
       oauth_accounts.subject AS linuxdo_id,
       oauth_accounts.username AS linuxdo_username,
       oauth_accounts.trust_level AS linuxdo_trust_level,
       COUNT(mall_orders.id) AS order_count,
       COALESCE(SUM(CASE WHEN mall_orders.status = 'completed' THEN mall_orders.final_amount ELSE 0 END), 0) AS total_spent,
       COALESCE(ldc.balance, 0) AS ldc_balance
     FROM users
     LEFT JOIN oauth_accounts ON oauth_accounts.user_id = users.id
     LEFT JOIN mall_orders ON mall_orders.user_id = users.id
     LEFT JOIN (
       SELECT user_id, SUM(amount) AS balance
       FROM mall_ldc_ledger
       GROUP BY user_id
     ) ldc ON ldc.user_id = users.id
     WHERE users.id IN (${chunk.map(() => "?").join(",")})
     GROUP BY users.id
     ORDER BY users.created_at DESC`
  ), { uuid: true });
  return rows.map((row) => ({
    id: row.id,
    username: row.linuxdo_username || row.username,
    accountUsername: row.username,
    linuxdoId: row.linuxdo_id || "",
    linuxdoTrustLevel: Number(row.linuxdo_trust_level || 0),
    email: row.notification_email || "",
    notifyEmailEnabled: Boolean(row.notify_email_enabled),
    lastTestEmailAt: row.last_test_email_at || null,
    lastTestEmailAtBeijing: formatBeijingDateTime(row.last_test_email_at),
    createdAt: row.created_at,
    createdAtBeijing: formatBeijingDateTime(row.created_at),
    registerIp: row.register_ip || "",
    lastIp: row.last_ip || "",
    lastUserAgent: row.last_user_agent || "",
    lastSeenAt: row.last_seen_at || null,
    lastSeenAtBeijing: formatBeijingDateTime(row.last_seen_at),
    orderCount: Number(row.order_count || 0),
    totalSpent: Number(row.total_spent || 0),
    ldcBalance: Number(row.ldc_balance || 0)
  }));
}

function formatBeijingDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    hour12: false
  }).format(date).replace(/\//g, "-");
}

function isSameBeijingDay(left, right) {
  const leftKey = getBeijingDateKey(left);
  const rightKey = getBeijingDateKey(right);
  return Boolean(leftKey && rightKey && leftKey === rightKey);
}

async function getUserProductBoughtCount(env, userId, productId) {
  const row = await env.DB.prepare(
    "SELECT COALESCE(SUM(quantity), 0) AS count FROM mall_orders WHERE user_id = ? AND product_id = ? AND status NOT IN ('canceled', 'refunded')"
  ).bind(userId, productId).first();
  return Number(row?.count || 0);
}

async function getMallSettings(env) {
  const row = await env.DB.prepare("SELECT value_json FROM mall_settings WHERE key = 'settings'").first();
  return mergeMallSettings(MALL_DEFAULT_SETTINGS, parseJson(row?.value_json, {}));
}

async function recordMallLoginAttempt(request, env, username, success, reason) {
  try {
    await ensureMallRuntime(env);
    await env.DB.prepare(
      `INSERT INTO mall_login_attempts (id, ip, username, success, reason, user_agent)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(
      crypto.randomUUID(),
      getClientIp(request),
      normalizeText(username, 120),
      success ? 1 : 0,
      normalizeText(reason, 300),
      normalizeText(request.headers.get("User-Agent") || "", 500)
    ).run();
  } catch {
    // 登录记录失败不影响登录主流程。
  }
}

async function touchUserAccess(env, userId, request) {
  if (!userId) return;
  try {
    await ensureAuthRuntime(env);
    await env.DB.prepare(
      `UPDATE users
       SET last_ip = ?, last_user_agent = ?, last_seen_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP,
           register_ip = CASE WHEN register_ip = '' OR register_ip IS NULL THEN ? ELSE register_ip END
       WHERE id = ?`
    ).bind(
      getClientIp(request),
      normalizeText(request.headers.get("User-Agent") || "", 500),
      getClientIp(request),
      userId
    ).run();
  } catch {
    // 访问记录失败不影响主流程。
  }
}

async function maybeBlacklistFailedLoginIp(request, env, username = "") {
  try {
    await ensureMallRuntime(env);
    const ip = getClientIp(request);
    if (!ip || isSuperAdminLoginName(username)) {
      return;
    }
    const settings = await getMallSettings(env);
    const limits = settings.limits || DEFAULT_MALL_LIMITS;
    const maxAttempts = Number(limits.failedLoginMaxAttempts ?? DEFAULT_MALL_LIMITS.failedLoginMaxAttempts);
    const windowMinutes = Number(limits.failedLoginWindowMinutes ?? DEFAULT_MALL_LIMITS.failedLoginWindowMinutes);
    if (maxAttempts <= 0 || windowMinutes <= 0) {
      return;
    }
    const cutoff = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();
    const row = await env.DB.prepare(
      `SELECT COUNT(*) AS count
       FROM mall_login_attempts
       WHERE ip = ? AND success = 0 AND datetime(created_at) >= datetime(?)`
    ).bind(ip, cutoff).first();
    if (Number(row?.count || 0) < maxAttempts) {
      return;
    }
    await env.DB.prepare(
      `INSERT INTO mall_blacklist (id, kind, value, reason, source)
       VALUES (?, 'ip', ?, ?, 'auto_login_fail')
       ON CONFLICT(kind, value) DO UPDATE SET reason = excluded.reason, source = excluded.source`
    ).bind(
      crypto.randomUUID(),
      ip,
      `后台连续登录失败达到 ${maxAttempts} 次，最近用户名：${normalizeText(username, 80) || "未知"}`
    ).run();
  } catch {
    // 自动风控失败不影响登录错误返回。
  }
}

function isSuperAdminLoginName(username) {
  return String(username || "").trim().toLowerCase() === SUPER_ADMIN_USERNAME;
}

function getClientIp(request) {
  return normalizeText(
    request.headers.get("CF-Connecting-IP") ||
      request.headers.get("X-Forwarded-For")?.split(",")[0] ||
      "",
    80
  );
}

async function assertNotBlacklisted(request, env, user = null) {
  try {
    if (user && isSuperAdminUser(user)) {
      return;
    }
    await ensureMallRuntime(env);
    const ip = getClientIp(request);
    if (ip) {
      const blockedIp = await env.DB.prepare("SELECT id FROM mall_blacklist WHERE kind = 'ip' AND value = ?").bind(ip).first();
      if (blockedIp) {
        throw new ApiError(403, "blacklisted", "当前 IP 已被风控拦截");
      }
    }
    if (user && !isSuperAdminUser(user)) {
      const values = [
        user.username,
        user.linuxdo?.username,
        user.linuxdo?.id
      ].filter(Boolean).map((item) => String(item));
      for (const value of values) {
        const blockedUser = await env.DB.prepare("SELECT id FROM mall_blacklist WHERE kind = 'user' AND value = ?").bind(value).first();
        if (blockedUser) {
          throw new ApiError(403, "blacklisted", "当前用户已被风控拦截");
        }
      }
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
}

async function assertMallRateLimit(request, env, user, scope, options = {}) {
  await ensureMallRuntime(env);
  if (options.enabled === false) {
    return;
  }
  const limit = Math.max(1, Math.min(10000, Number.parseInt(options.limit || 30, 10) || 30));
  const windowSeconds = Math.max(10, Math.min(86400, Number.parseInt(options.windowSeconds || 3600, 10) || 3600));
  const normalizedScope = normalizeText(scope, 80) || "default";
  const ip = getClientIp(request);
  const subject = normalizeText(user?.id || user?.linuxdo?.id || ip || "anonymous", 120);
  if (user && isSuperAdminUser(user)) {
    return;
  }
  const cutoff = new Date(Date.now() - windowSeconds * 1000).toISOString();
  await env.DB.prepare("DELETE FROM mall_rate_limits WHERE datetime(created_at) < datetime(?)")
    .bind(cutoff)
    .run();
  const row = await env.DB.prepare(
    `SELECT COUNT(*) AS count
     FROM mall_rate_limits
     WHERE scope = ? AND subject = ? AND datetime(created_at) >= datetime(?)`
  ).bind(normalizedScope, subject, cutoff).first();
  if (Number(row?.count || 0) >= limit) {
    throw new ApiError(429, "rate_limited", options.message || "操作过于频繁，请稍后再试");
  }
  await env.DB.prepare(
    `INSERT INTO mall_rate_limits (id, scope, subject, ip, user_id)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(
    crypto.randomUUID(),
    normalizedScope,
    subject,
    ip,
    normalizeText(user?.id || "", 80)
  ).run();
}

function assertMallOrderOwner(order, user) {
  if (!order) {
    throw new ApiError(404, "order_not_found", "订单不存在");
  }
  if (order.userId !== user.id && !user.isAdmin) {
    throw new ApiError(403, "order_forbidden", "无权访问该订单");
  }
}

function assertMallOrderChatAllowed(order, limits = DEFAULT_MALL_LIMITS) {
  const chatDays = normalizeMallLimits(limits).orderChatDays;
  if (!order) {
    throw new ApiError(404, "order_not_found", "订单不存在");
  }
  if (order.status !== "completed") {
    throw new ApiError(403, "order_chat_unavailable", "只有已完成订单支持咨询订单");
  }
  const createdAt = parseMallTimestampMs(order.createdAt || "");
  if (!Number.isFinite(createdAt)) {
    throw new ApiError(400, "order_chat_unavailable", "该订单暂不支持私聊");
  }
  if (chatDays > 0 && Date.now() - createdAt > chatDays * 24 * 60 * 60 * 1000) {
    throw new ApiError(403, "order_chat_expired", `订单超过 ${chatDays} 天后无法继续私聊`);
  }
}

function formatMallProduct(row) {
  const images = parseJson(row.images_json, []);
  const imageUrl = row.image_url || images[0] || "";
  const fixedDeliveryItems = normalizeNetdiskDeliveryItems(parseJson(row.fixed_delivery_links_json, []));
  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    category: row.category || "service",
    price: Number(row.price || 0),
    originalPrice: Number(row.original_price || row.price || 0),
    stock: Number(row.stock || 0),
    manualStock: Number(row.manual_stock || 0),
    status: row.status || "active",
    imageUrl,
    images: images.length ? images : (imageUrl ? [imageUrl] : []),
    features: parseJson(row.features_json, []),
    officialToken: row.official_token || "",
    usageGuide: row.usage_guide || "",
    requiresUserInfo: Boolean(row.requires_user_info),
    afterSaleEnabled: Boolean(row.after_sale_enabled),
    afterSaleGuide: row.after_sale_guide || "",
    userInfoFields: parseJson(row.user_info_fields_json, []),
    stockThreshold: Number(row.stock_threshold || 5),
    limitPerUser: Number(row.limit_per_user || 0),
    minTrustLevel: Number(row.min_trust_level || 0),
    paymentMode: row.payment_mode || "credit",
    deliveryMode: row.delivery_mode || "manual",
    fixedDeliveryUrl: row.fixed_delivery_url || "",
    fixedDeliveryLabel: row.fixed_delivery_label || "网盘链接",
    fixedDeliveryItems: fixedDeliveryItems.length ? fixedDeliveryItems : normalizeNetdiskDeliveryItems([{
      label: row.fixed_delivery_label || "网盘链接",
      url: row.fixed_delivery_url || ""
    }]),
    unlimitedStock: row.delivery_mode === "fixed_link",
    sortOrder: Number(row.sort_order || 0),
    sales: Number(row.sales || 0),
    ratingCount: Number(row.rating_count || 0),
    avgRating: Math.round(Number(row.avg_rating || 5) * 10) / 10,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function formatMallOrder(row) {
  return {
    id: row.id,
    userId: row.user_id,
    productId: row.product_id,
    productName: row.product_name,
    quantity: Number(row.quantity || 1),
    amount: Number(row.amount || 0),
    finalAmount: Number(row.final_amount || row.amount || 0),
    couponCode: row.coupon_code || "",
    discountAmount: Number(row.discount_amount || 0),
    discounts: normalizeOrderDiscounts(parseJson(row.discounts_json, [])),
    status: row.status || "pending",
    note: row.note || "",
    deliveryContent: row.delivery_content || "",
    delivered: Boolean(row.delivered),
    archived: Boolean(row.archived),
    rated: Boolean(row.rated),
    userInfo: parseJson(row.user_info_json, {}),
    tradeNo: row.trade_no || "",
    paymentMode: row.payment_mode || "",
    deliveryMode: row.product_delivery_mode || "manual",
    completedAt: row.completed_at || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    username: row.linuxdo_username || row.buyer_username || row.username || null
  };
}

function formatMallConversation(row) {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name || "",
    adminUserId: row.admin_user_id || "",
    subject: row.subject || "商城咨询",
    productId: row.product_id || "",
    orderId: row.order_id || "",
    status: row.status || "open",
    lastMessage: row.last_message || "",
    lastSender: row.last_sender || "",
    adminReplied: Boolean(row.admin_replied),
    unreadUser: Number(row.unread_user || 0),
    unreadAdmin: Number(row.unread_admin || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function formatMallFeedback(row) {
  return {
    id: row.id,
    userId: row.user_id,
    username: row.username || "",
    type: normalizeChoice(row.type, ["bug", "question"], "bug"),
    title: row.title || "",
    content: row.content || "",
    status: normalizeFeedbackStatus(row.status),
    rewardAmount: Number(row.reward_amount || 0),
    adminNote: row.admin_note || "",
    reviewedBy: row.reviewed_by || "",
    reviewerUsername: row.reviewer_username || "",
    reviewedAt: row.reviewed_at || null,
    submittedAt: row.submitted_at || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function formatMallFeedbackLog(row) {
  return {
    id: row.id,
    feedbackId: row.feedback_id,
    actorId: row.actor_id || "",
    actorName: row.actor_name || "",
    actorRole: row.actor_role || "user",
    action: row.action || "",
    note: row.note || "",
    before: parseJson(row.before_json, {}),
    after: parseJson(row.after_json, {}),
    createdAt: row.created_at
  };
}

function pickFeedbackLogSnapshot(feedback) {
  if (!feedback) return null;
  return {
    type: feedback.type,
    title: feedback.title,
    content: feedback.content,
    status: feedback.status,
    rewardAmount: Number(feedback.rewardAmount || 0),
    adminNote: feedback.adminNote || ""
  };
}

function formatMallLdcLedger(row) {
  return {
    id: row.id,
    userId: row.user_id,
    username: row.username || "",
    amount: Number(row.amount || 0),
    reason: row.reason || "",
    sourceType: row.source_type || "",
    sourceId: row.source_id || "",
    createdBy: row.created_by || "",
    externalTradeNo: row.external_trade_no || "",
    externalStatus: row.external_status || "",
    externalError: row.external_error || "",
    createdAt: row.created_at
  };
}

function formatMallRefund(row) {
  return {
    id: row.id,
    orderId: row.order_id,
    userId: row.user_id || "",
    amount: Number(row.amount || 0),
    method: row.method || "credit",
    status: row.status || "pending",
    tradeNo: row.trade_no || "",
    externalResponse: parseJson(row.external_response_json, {}),
    error: row.error || "",
    createdBy: row.created_by || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function formatMallAdminAuditLog(row) {
  return {
    id: row.id,
    adminId: row.admin_id || "",
    adminName: row.admin_name || "",
    action: row.action || "",
    targetType: row.target_type || "",
    targetId: row.target_id || "",
    summary: row.summary || "",
    before: parseJson(row.before_json, null),
    after: parseJson(row.after_json, null),
    ip: row.ip || "",
    userAgent: row.user_agent || "",
    createdAt: row.created_at
  };
}

function formatMallMessage(row) {
  return {
    id: Number(row.id || 0),
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    senderName: row.sender_name || "",
    senderRole: row.sender_role || "user",
    content: row.content || "",
    createdAt: row.created_at
  };
}

function formatMallCard(row) {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name || row.product_id,
    content: row.content,
    status: row.status,
    usedBy: row.used_by || "",
    orderId: row.order_id || "",
    availableAt: row.available_at || null,
    createdAt: row.created_at,
    usedAt: row.used_at || null
  };
}

function formatMallCoupon(row) {
  return {
    id: row.id,
    code: row.code,
    productId: row.product_id || "",
    type: row.type || "fixed",
    value: Number(row.value || 0),
    limitCount: Number(row.limit_count || 0),
    usedCount: Number(row.used_count || 0),
    startsAt: row.starts_at || null,
    expiresAt: row.expires_at || null,
    status: row.status || "active",
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function formatMallUserCoupon(row) {
  return {
    id: row.id,
    userId: row.user_id,
    code: row.code,
    campaignKey: row.campaign_key || "",
    sourceKey: row.source_key || "",
    label: row.label || "",
    type: row.type || "fixed",
    value: Number(row.value || 0),
    productId: row.product_id || "",
    stackable: Boolean(row.stackable),
    status: row.status || "active",
    reservedOrderId: row.reserved_order_id || "",
    usedOrderId: row.used_order_id || "",
    rank: Number(row.rank || 0),
    meta: parseJson(row.meta_json, {}),
    startsAt: row.starts_at || null,
    expiresAt: row.expires_at || null,
    usedAt: row.used_at || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function formatMallRating(row) {
  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    productName: row.product_name || "",
    userId: row.user_id,
    username: row.username,
    rating: Number(row.rating || 5),
    comment: row.comment || "",
    createdAt: row.created_at
  };
}

function formatMallAd(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || "",
    imageUrl: normalizeMallAssetImageUrl(row.image_url || ""),
    linkUrl: normalizePublicLinkUrl(row.link_url || ""),
    position: row.position || "sidebar",
    status: row.status || "active",
    sortOrder: Number(row.sort_order || 0),
    style: normalizeAdStyle(parseJson(row.style_json, {})),
    startsAt: row.starts_at || null,
    endsAt: row.ends_at || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function formatBlacklistItem(row) {
  return {
    id: row.id,
    kind: row.kind,
    value: row.value,
    reason: row.reason || "",
    source: row.source || "manual",
    createdAt: row.created_at
  };
}

function formatEmailTemplate(row) {
  return {
    id: row.id,
    eventType: normalizeEmailTemplateEventType(row.event_type || row.eventType),
    name: row.name,
    subject: row.subject || "",
    content: row.content || "",
    params: normalizeEmailTemplateParams(parseJson(row.params_json, [])),
    isDefault: Boolean(row.is_default),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function formatLoginAttempt(row) {
  return {
    id: row.id,
    ip: row.ip || "",
    username: row.username || "",
    success: Boolean(row.success),
    reason: row.reason || "",
    userAgent: row.user_agent || "",
    createdAt: row.created_at
  };
}

function orderStatusText(value) {
  return ({
    pending: "待处理",
    processing: "处理中",
    completed: "已完成",
    canceled: "已取消",
    refunded: "已退款"
  })[value] || value || "";
}

function normalizeProductPayload(body, existing = null) {
  const requestedPaymentMode = normalizeChoice(body.paymentMode ?? existing?.paymentMode, ["credit", "test"], "credit");
  const deliveryMode = normalizeChoice(body.deliveryMode ?? existing?.deliveryMode, PRODUCT_DELIVERY_MODES, "manual");
  const rawId = existing?.id || body.id || body.name || crypto.randomUUID();
  const id = normalizeMallId(slugify(rawId)) || crypto.randomUUID();
  const name = normalizeText(body.name ?? existing?.name, 120);
  if (!name) {
    throw new ApiError(400, "invalid_product", "商品名称不能为空");
  }
  const imageUrl = normalizeMallAssetImageUrl(body.imageUrl ?? existing?.imageUrl);
  const images = normalizeStringArray(body.images ?? existing?.images ?? (imageUrl ? [imageUrl] : []), 8, 1000)
    .map(normalizeMallAssetImageUrl)
    .filter(Boolean);
  const fallbackFixedDeliveryItems = existing?.fixedDeliveryItems?.length
    ? existing.fixedDeliveryItems
    : [{ label: existing?.fixedDeliveryLabel || "网盘链接", url: existing?.fixedDeliveryUrl || "" }];
  const fixedDeliveryItems = deliveryMode === "fixed_link"
    ? normalizeNetdiskDeliveryItems(body.fixedDeliveryItems ?? fallbackFixedDeliveryItems)
    : [];
  const fixedDeliveryUrl = deliveryMode === "fixed_link"
    ? (fixedDeliveryItems[0]?.url || normalizeFixedDeliveryUrl(body.fixedDeliveryUrl ?? existing?.fixedDeliveryUrl))
    : "";
  if (deliveryMode === "fixed_link" && !fixedDeliveryItems.length && !fixedDeliveryUrl) {
    throw new ApiError(400, "fixed_delivery_url_required", "固定链接发货至少需要填写一个有效的 https 网盘链接");
  }
  const primaryFixedDeliveryItem = fixedDeliveryItems[0] || null;
  const manualStock = deliveryMode === "fixed_link"
    ? 0
    : Math.max(0, Number.parseInt(body.manualStock ?? existing?.manualStock ?? body.stock ?? existing?.stock ?? 0, 10) || 0);
  const stock = deliveryMode === "fixed_link"
    ? ADMIN_MAX_LIST_LIMIT
    : Math.max(0, Number.parseInt(body.stock ?? existing?.stock ?? 0, 10) || 0);
  return {
    id,
    name,
    description: normalizeText(body.description ?? existing?.description, 1000),
    category: normalizeChoice(body.category ?? existing?.category, ["account", "code", "credit", "service", "other"], "service"),
    price: normalizeMoney(body.price ?? existing?.price),
    originalPrice: normalizeMoney(body.originalPrice ?? existing?.originalPrice ?? body.price ?? existing?.price),
    stock,
    manualStock,
    status: normalizeChoice(body.status ?? existing?.status, ["active", "inactive", "deleted"], "active"),
    imageUrl,
    images: images.length ? images : (imageUrl ? [imageUrl] : []),
    features: normalizeStringArray(body.features ?? existing?.features ?? [], 8, 80),
    officialToken: normalizeText(body.officialToken ?? existing?.officialToken, 300),
    usageGuide: normalizeText(body.usageGuide ?? existing?.usageGuide, 3000),
    requiresUserInfo: Boolean(body.requiresUserInfo ?? existing?.requiresUserInfo),
    afterSaleEnabled: Boolean(body.afterSaleEnabled ?? existing?.afterSaleEnabled),
    afterSaleGuide: normalizeText(body.afterSaleGuide ?? existing?.afterSaleGuide, 3000),
    userInfoFields: normalizeUserInfoFields(body.userInfoFields ?? existing?.userInfoFields ?? []),
    stockThreshold: Math.max(0, Number.parseInt(body.stockThreshold ?? existing?.stockThreshold ?? 5, 10) || 5),
    limitPerUser: Math.max(0, Number.parseInt(body.limitPerUser ?? existing?.limitPerUser ?? 0, 10) || 0),
    minTrustLevel: Math.max(0, Number.parseInt(body.minTrustLevel ?? existing?.minTrustLevel ?? 0, 10) || 0),
    paymentMode: requestedPaymentMode,
    deliveryMode,
    fixedDeliveryUrl,
    fixedDeliveryLabel: primaryFixedDeliveryItem?.label || normalizeText(body.fixedDeliveryLabel ?? existing?.fixedDeliveryLabel ?? "网盘链接", 80) || "网盘链接",
    fixedDeliveryItems,
    sortOrder: Number.parseInt(body.sortOrder ?? existing?.sortOrder ?? 0, 10) || 0
  };
}

function normalizeFixedDeliveryUrl(value) {
  const text = normalizeText(value, 1000);
  if (!text) return "";
  try {
    const parsed = parsePublicHttpUrl(text);
    if (parsed.protocol !== "https:") return "";
    return parsed.toString();
  } catch {
    return "";
  }
}

function normalizeCouponPayload(body, fallbackId) {
  const code = normalizeCouponCode(body.code);
  if (!code) {
    throw new ApiError(400, "invalid_coupon", "优惠码不能为空");
  }
  return {
    id: isUuidLike(body.id) ? body.id : fallbackId,
    code,
    productId: normalizeMallId(body.productId) || "",
    type: normalizeChoice(body.type, ["fixed", "percent"], "fixed"),
    value: Math.max(0, Number.parseInt(body.value || 0, 10) || 0),
    limitCount: Math.max(0, Number.parseInt(body.limitCount || 0, 10) || 0),
    startsAt: normalizeNullableDate(body.startsAt),
    expiresAt: normalizeNullableDate(body.expiresAt),
    status: normalizeChoice(body.status, ["active", "inactive"], "active")
  };
}

function normalizeMallUserCouponBackup(body = {}) {
  const id = isSafeRecordId(body.id) ? body.id : crypto.randomUUID();
  const userId = normalizeText(body.userId || body.user_id, 80);
  const code = normalizeCouponCode(body.code);
  if (!userId || !code) {
    return null;
  }
  return {
    id,
    userId,
    code,
    campaignKey: normalizeText(body.campaignKey || body.campaign_key || MINESWEEPER_COUPON_CAMPAIGN_KEY, 80),
    sourceKey: normalizeText(body.sourceKey || body.source_key || "", 80),
    label: normalizeText(body.label || body.name || code, 160),
    type: normalizeChoice(body.type, ["fixed", "percent"], "fixed"),
    value: normalizeMoney(body.value),
    productId: normalizeMallId(body.productId || body.product_id),
    stackable: body.stackable !== false,
    status: normalizeChoice(body.status, ["active", "reserved", "used", "expired", "inactive"], "active"),
    reservedOrderId: isUuidLike(body.reservedOrderId || body.reserved_order_id) ? (body.reservedOrderId || body.reserved_order_id) : "",
    usedOrderId: isUuidLike(body.usedOrderId || body.used_order_id) ? (body.usedOrderId || body.used_order_id) : "",
    rank: Math.max(0, Number.parseInt(body.rank || 0, 10) || 0),
    meta: body.meta && typeof body.meta === "object" && !Array.isArray(body.meta) ? body.meta : parseJson(body.metaJson || body.meta_json, {}),
    startsAt: normalizeNullableDate(body.startsAt || body.starts_at),
    expiresAt: normalizeNullableDate(body.expiresAt || body.expires_at),
    usedAt: normalizeNullableDate(body.usedAt || body.used_at),
    createdAt: normalizeNullableDate(body.createdAt || body.created_at),
    updatedAt: normalizeNullableDate(body.updatedAt || body.updated_at)
  };
}

function normalizeAdPayload(body, fallbackId) {
  const title = normalizeText(body.title, 120);
  if (!title) {
    throw new ApiError(400, "invalid_ad", "广告标题不能为空");
  }
  return {
    id: isUuidLike(body.id) ? body.id : fallbackId,
    title,
    description: normalizeText(body.description, 300),
    imageUrl: normalizeMallAssetImageUrl(body.imageUrl),
    linkUrl: normalizePublicLinkUrl(body.linkUrl),
    position: normalizeChoice(body.position, ["top", "hero", "between_products", "sidebar", "footer", "floating"], "sidebar"),
    status: normalizeChoice(body.status, ["active", "inactive"], "active"),
    sortOrder: Number.parseInt(body.sortOrder || 0, 10) || 0,
    style: normalizeAdStyle(body.style || body),
    startsAt: normalizeNullableDate(body.startsAt),
    endsAt: normalizeNullableDate(body.endsAt)
  };
}

function normalizeAdStyle(value = {}) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return {
    layout: normalizeChoice(source.layout, ["compact", "banner", "media", "card"], "card"),
    theme: normalizeChoice(source.theme, ["blue", "green", "amber", "red", "gray"], "blue"),
    size: normalizeChoice(source.size, ["small", "medium", "large"], "medium"),
    imageMode: normalizeChoice(source.imageMode, ["cover", "contain", "none"], "cover"),
    buttonText: normalizeText(source.buttonText || "查看", 40),
    background: normalizePrizeColor(source.background || "#ffffff"),
    foreground: normalizePrizeColor(source.foreground || "#0f172a")
  };
}

function normalizeEmailTemplatePayload(body, fallbackId = "") {
  const id = normalizeMallId(body.id || fallbackId || `tpl-${randomHex(4)}`) || `tpl-${randomHex(4)}`;
  const eventType = normalizeEmailTemplateEventType(body.eventType || body.event_type);
  const name = normalizeText(body.name, 120);
  const subject = normalizeText(body.subject, 200);
  const content = normalizeText(body.content, 12000);
  if (!name || !content) {
    throw new ApiError(400, "invalid_template", "模板名称和内容不能为空");
  }
  return {
    id,
    eventType,
    name,
    subject: subject || name,
    content,
    params: normalizeEmailTemplateParams(body.params, true),
    isDefault: Boolean(body.isDefault)
  };
}

function normalizeEmailTemplateEventType(value) {
  return normalizeChoice(value, EMAIL_TEMPLATE_EVENT_TYPES, "order_delivered");
}

function normalizeEmailTemplateParams(value, strict = false) {
  if (!Array.isArray(value)) {
    return [];
  }
  const reserved = new Set([
    "username",
    "order_id",
    "product_name",
    "delivery_note",
    "site_name",
    "order_time",
    "delivery_time",
    "order_status",
    "payment_mode",
    "delivery_mode",
    "amount",
    "note"
  ]);
  const seen = new Set();
  const params = [];
  for (const item of value) {
    const rawKey = String(item?.key || "").trim().toLowerCase();
    const hasAnyValue = rawKey || item?.label || item?.description || item?.sample;
    if (!hasAnyValue) {
      continue;
    }
    const key = rawKey.slice(0, 40);
    if (!/^[a-z][a-z0-9_]{1,39}$/.test(key)) {
      if (strict) {
        throw new ApiError(400, "invalid_template_param", "自定义参数名只能使用小写字母、数字、下划线，并以字母开头");
      }
      continue;
    }
    if (reserved.has(key)) {
      if (strict) {
        throw new ApiError(400, "reserved_template_param", `{${key}} 是系统参数，不能作为自定义参数`);
      }
      continue;
    }
    if (seen.has(key)) {
      if (strict) {
        throw new ApiError(400, "duplicate_template_param", `{${key}} 参数重复`);
      }
      continue;
    }
    seen.add(key);
    params.push({
      key,
      label: normalizeText(item?.label, 80),
      description: normalizeText(item?.description, 200),
      sample: normalizeText(item?.sample, 500)
    });
    if (params.length >= 50) {
      break;
    }
  }
  return params;
}

function normalizeMallId(value) {
  const text = String(value || "").trim();
  return /^[a-z0-9][a-z0-9_-]{1,80}$/i.test(text) ? text : "";
}

function normalizeCouponCode(value) {
  const text = String(value || "").trim().toUpperCase();
  return /^[A-Z0-9_-]{3,40}$/.test(text) ? text : "";
}

function normalizeText(value, maxLength = 500) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function clampInteger(value, fallback, min, max) {
  const number = Number.parseInt(value, 10);
  const base = Number.isFinite(number) ? number : fallback;
  return Math.max(min, Math.min(max, base));
}

function normalizeEmailAddress(value) {
  const email = normalizeText(value, 180).toLowerCase();
  if (!email) return "";
  return /^[^\s@<>"'`]+@[^\s@<>"'`]+\.[^\s@<>"'`]{2,}$/.test(email) ? email : "";
}

function normalizeEmailFrom(value) {
  const raw = normalizeText(value, 260);
  if (!raw) return "";
  const bracketMatch = raw.match(/<([^<>]+)>/);
  if (bracketMatch) {
    return normalizeEmailAddress(bracketMatch[1]) ? raw : "";
  }
  return normalizeEmailAddress(raw) ? raw : "";
}

function normalizeProxyImageUrl(value) {
  try {
    const url = parsePublicHttpUrl(value);
    return url.toString();
  } catch {
    return "";
  }
}

function normalizeImageContentType(value) {
  const type = String(value || "").split(";")[0].trim().toLowerCase();
  if (type === "image/png") return "image/png";
  if (type === "image/jpeg" || type === "image/jpg") return "image/jpeg";
  if (type === "image/webp") return "image/webp";
  if (type === "image/gif") return "image/gif";
  if (type === "image/avif") return "image/avif";
  return "";
}

function normalizeMoney(value) {
  return Math.max(0, Math.round(Number(value || 0)));
}

function normalizeMinesweeperCampaignDateTime(value, fallback) {
  const text = normalizeText(value, 60);
  if (!text) {
    return fallback || "";
  }
  const parsed = parseMallTimestampMs(text);
  if (!Number.isFinite(parsed)) {
    return fallback || "";
  }
  return toD1DateTime(parsed);
}

function normalizeMinesweeperRewardMap(value, fallback, options = {}) {
  const source = Array.isArray(value)
    ? Object.fromEntries(value.map((item) => [item?.level, item?.value]))
    : (value && typeof value === "object" ? value : {});
  const defaults = fallback && typeof fallback === "object" ? fallback : {};
  const min = Number.isFinite(options.min) ? options.min : 0;
  const max = Number.isFinite(options.max) ? options.max : 100000;
  return Object.fromEntries(Object.keys(MINESWEEPER_LEVEL_LABELS).map((level) => {
    const fallbackValue = Number(defaults[level] ?? 0);
    return [level, clampInteger(source[level] ?? source[MINESWEEPER_LEVEL_LABELS[level]] ?? fallbackValue, fallbackValue, min, max)];
  }));
}

function normalizeMinesweeperCampaignSettings(value = {}, fallback = MALL_DEFAULT_SETTINGS.minesweeperCampaign) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const base = fallback && typeof fallback === "object" ? fallback : MALL_DEFAULT_SETTINGS.minesweeperCampaign;
  const basePercent = base.levelPercentCoupons || MINESWEEPER_LEVEL_PERCENT_COUPONS;
  const baseFixed = base.levelFirstFixedCoupons || MINESWEEPER_LEVEL_FIRST_FIXED_COUPONS;
  const startAt = normalizeMinesweeperCampaignDateTime(
    source.startAt ?? source.start_at ?? base.startAt,
    base.startAt || toD1DateTime(MINESWEEPER_COUPON_CAMPAIGN_START_MS)
  );
  const endsAt = normalizeMinesweeperCampaignDateTime(
    source.endsAt ?? source.ends_at ?? base.endsAt,
    base.endsAt || toD1DateTime(MINESWEEPER_COUPON_CAMPAIGN_END_MS)
  );
  return {
    enabled: normalizeBoolean(source.enabled ?? base.enabled, true),
    key: normalizeText(source.key ?? source.campaignKey ?? source.campaign_key ?? base.key ?? MINESWEEPER_COUPON_CAMPAIGN_KEY, 80) || MINESWEEPER_COUPON_CAMPAIGN_KEY,
    startAt,
    endsAt,
    validDays: clampInteger(source.validDays ?? source.valid_days ?? base.validDays, base.validDays || MINESWEEPER_COUPON_VALID_DAYS, 1, 3650),
    levelPercentCoupons: normalizeMinesweeperRewardMap(source.levelPercentCoupons ?? source.level_percent_coupons, basePercent, { min: 0, max: 100 }),
    levelFirstFixedCoupons: normalizeMinesweeperRewardMap(source.levelFirstFixedCoupons ?? source.level_first_fixed_coupons, baseFixed, { min: 0, max: 100000 })
  };
}

function normalizeLdcReward(value, limits = DEFAULT_MALL_LIMITS) {
  const normalizedLimits = normalizeMallLimits(limits);
  const amount = Math.round(Number(value || normalizedLimits.feedbackRewardDefault));
  if (!Number.isFinite(amount)) {
    return normalizedLimits.feedbackRewardDefault;
  }
  return Math.max(normalizedLimits.feedbackRewardMin, Math.min(normalizedLimits.feedbackRewardMax, amount));
}

function normalizeRateLimits(value = {}) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const output = {};
  for (const [key, defaults] of Object.entries(DEFAULT_RATE_LIMITS)) {
    const existing = source[key] && typeof source[key] === "object" && !Array.isArray(source[key]) ? source[key] : {};
    const item = { ...defaults, ...existing };
    output[key] = {
      enabled: normalizeBoolean(item.enabled, defaults.enabled),
      limit: clampInteger(item.limit ?? defaults.limit, defaults.limit, 1, 10000),
      windowSeconds: clampInteger(item.windowSeconds ?? item.window ?? defaults.windowSeconds, defaults.windowSeconds, 10, 86400)
    };
  }
  return output;
}

function normalizeMallLimits(value = {}) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const baseRateLimits = source.rateLimits || source.rate_limits || DEFAULT_RATE_LIMITS;
  const output = {
    userTestEmailCooldownHours: clampInteger(source.userTestEmailCooldownHours ?? source.user_test_email_cooldown_hours, DEFAULT_MALL_LIMITS.userTestEmailCooldownHours, 0, 720),
    orderChatDays: clampInteger(source.orderChatDays ?? source.order_chat_days, DEFAULT_MALL_LIMITS.orderChatDays, 0, 3650),
    generalChatFirstMessages: clampInteger(source.generalChatFirstMessages ?? source.general_chat_first_messages, DEFAULT_MALL_LIMITS.generalChatFirstMessages, 1, 20),
    generalChatMaxChars: clampInteger(source.generalChatMaxChars ?? source.general_chat_max_chars, DEFAULT_MALL_LIMITS.generalChatMaxChars, 10, 5000),
    generalChatMaxImages: clampInteger(source.generalChatMaxImages ?? source.general_chat_max_images, DEFAULT_MALL_LIMITS.generalChatMaxImages, 0, 10),
    chatMaxChars: clampInteger(source.chatMaxChars ?? source.chat_max_chars, DEFAULT_MALL_LIMITS.chatMaxChars, 100, 12000),
    chatMaxImages: clampInteger(source.chatMaxImages ?? source.chat_max_images, DEFAULT_MALL_LIMITS.chatMaxImages, 0, 20),
    feedbackTitleMinChars: clampInteger(source.feedbackTitleMinChars ?? source.feedback_title_min_chars, DEFAULT_MALL_LIMITS.feedbackTitleMinChars, 1, 80),
    feedbackContentMinChars: clampInteger(source.feedbackContentMinChars ?? source.feedback_content_min_chars, DEFAULT_MALL_LIMITS.feedbackContentMinChars, 1, 1000),
    feedbackTitleMaxChars: clampInteger(source.feedbackTitleMaxChars ?? source.feedback_title_max_chars, DEFAULT_MALL_LIMITS.feedbackTitleMaxChars, 20, 300),
    feedbackContentMaxChars: clampInteger(source.feedbackContentMaxChars ?? source.feedback_content_max_chars, DEFAULT_MALL_LIMITS.feedbackContentMaxChars, 100, 20000),
    feedbackMaxImages: clampInteger(source.feedbackMaxImages ?? source.feedback_max_images, DEFAULT_MALL_LIMITS.feedbackMaxImages, 0, 20),
    feedbackRewardMin: clampInteger(source.feedbackRewardMin ?? source.feedback_reward_min, DEFAULT_MALL_LIMITS.feedbackRewardMin, 0, 100000),
    feedbackRewardMax: clampInteger(source.feedbackRewardMax ?? source.feedback_reward_max, DEFAULT_MALL_LIMITS.feedbackRewardMax, 0, 100000),
    feedbackRewardDefault: clampInteger(source.feedbackRewardDefault ?? source.feedback_reward_default, DEFAULT_MALL_LIMITS.feedbackRewardDefault, 0, 100000),
    failedLoginWindowMinutes: clampInteger(source.failedLoginWindowMinutes ?? source.failed_login_window_minutes, DEFAULT_MALL_LIMITS.failedLoginWindowMinutes, 1, 10080),
    failedLoginMaxAttempts: clampInteger(source.failedLoginMaxAttempts ?? source.failed_login_max_attempts, DEFAULT_MALL_LIMITS.failedLoginMaxAttempts, 0, 100),
    rateLimits: normalizeRateLimits(baseRateLimits)
  };
  if (output.feedbackTitleMinChars > output.feedbackTitleMaxChars) {
    output.feedbackTitleMinChars = output.feedbackTitleMaxChars;
  }
  if (output.feedbackContentMinChars > output.feedbackContentMaxChars) {
    output.feedbackContentMinChars = output.feedbackContentMaxChars;
  }
  if (output.feedbackRewardMin > output.feedbackRewardMax) {
    output.feedbackRewardMin = output.feedbackRewardMax;
  }
  output.feedbackRewardDefault = Math.max(output.feedbackRewardMin, Math.min(output.feedbackRewardMax, output.feedbackRewardDefault));
  return output;
}

function normalizeFeedbackStatus(value) {
  return normalizeChoice(value, ["draft", "pending", "approved", "rejected", "deleted"], "pending");
}

function normalizeLotteryValue(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return 1;
  }
  return Math.max(0, Math.min(1, number));
}

function normalizePrizeList(prizes) {
  const rows = Array.isArray(prizes) ? prizes : [];
  const normalized = rows
    .map(normalizePrizeItem)
    .filter((item) => item.label)
    .slice(0, 50);
  return normalized.length
    ? normalized
    : MALL_DEFAULT_SETTINGS.luckyDraw.prizes.map(normalizePrizeItem);
}

function normalizePrizeItem(prize = {}) {
  return {
    label: normalizeText(prize.label, 40),
    value: normalizePrizeValue(prize.value),
    weight: normalizePrizeWeight(prize.weight),
    color: normalizePrizeColor(prize.color)
  };
}

function normalizePrizeValue(value) {
  const text = String(value ?? "").trim();
  if (!text) return 1;
  let number;
  if (text.endsWith("%")) {
    number = Number(text.slice(0, -1)) / 100;
  } else {
    const discount = text.match(/^(\d+(?:\.\d+)?)\s*折$/);
    number = discount ? Number(discount[1]) / 10 : Number(text);
  }
  if (!Number.isFinite(number)) return 1;
  return Math.max(0, Math.min(1, number));
}

function normalizePrizeWeight(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 1;
  return Math.max(0, Math.min(100, number));
}

function normalizePrizeColor(value) {
  let text = String(value || "").trim();
  if (/^[0-9a-f]{6}$/i.test(text)) {
    text = `#${text}`;
  }
  return /^#[0-9a-f]{6}$/i.test(text) ? text.toLowerCase() : "#2563eb";
}

function normalizeUserInfo(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  const result = {};
  for (const [key, item] of Object.entries(value).slice(0, 20)) {
    const safeKey = normalizeText(key, 80);
    const safeValue = normalizeText(item, 500);
    if (safeKey && safeValue) {
      result[safeKey] = safeValue;
    }
  }
  return result;
}

function normalizeUserInfoFields(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.slice(0, 20).map((item) => ({
    name: normalizeText(item?.name, 80),
    label: normalizeText(item?.label || item?.name, 120),
    type: normalizeChoice(item?.type, ["text", "textarea", "select"], "text"),
    required: Boolean(item?.required),
    description: normalizeText(item?.description, 200),
    options: normalizeStringArray(item?.options || [], 20, 80)
  })).filter((item) => item.name);
}

function normalizeContactLinks(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  const allowed = ["qq", "qq_group", "telegram", "telegram_group", "feishu", "wechat", "url"];
  return value.slice(0, 20).map((item) => {
    const type = normalizeChoice(item?.type, allowed, "url");
    const valueText = normalizeText(item?.value, 300);
    const url = normalizeContactUrl(item?.url);
    return {
      type,
      label: normalizeText(item?.label, 80),
      value: valueText,
      url: url || (type === "url" ? normalizeContactUrl(valueText) : "")
    };
  }).filter((item) => item.value || item.url);
}

function normalizeContactUrl(value) {
  return normalizePublicLinkUrl(value);
}

function normalizeSiteImageUrl(value) {
  const text = normalizeText(value || "", 300000);
  if (!text) {
    return "";
  }
  if (/^data:image\/(?:png|jpe?g|gif|webp|avif);base64,[a-z0-9+/=\s]+$/i.test(text)) {
    return text.replace(/\s+/g, "");
  }
  if (/^https?:\/\/[^\s"'<>`]+$/i.test(text)) {
    return text;
  }
  if (/^\/(?!\/)[^\s"'<>`]+$/i.test(text)) {
    return text;
  }
  return "";
}

function normalizeCurrencyImageUrl(value) {
  return normalizeSiteImageUrl(value);
}

function normalizeMallAssetImageUrl(value) {
  const text = normalizeSiteImageUrl(value);
  if (!text || /^http:\/\//i.test(text)) {
    return "";
  }
  return text;
}

function normalizePublicLinkUrl(value) {
  const text = normalizeText(value, 1000);
  if (!text) return "";
  if (/^\/(?!\/)[^\s"'<>`]+$/i.test(text)) return text;
  try {
    const parsed = parsePublicHttpUrl(text);
    if (parsed.protocol !== "https:") {
      return "";
    }
    return parsed.toString();
  } catch {
    return "";
  }
}

function normalizeNetdiskDeliveryItems(value) {
  const source = Array.isArray(value) ? value : [];
  const items = [];
  for (const rawItem of source.slice(0, 20)) {
    const parsed = parseNetdiskSharePayload(rawItem);
    const url = parsed.url;
    if (!url) continue;
    const label = normalizeText(
      rawItem?.label || rawItem?.name || rawItem?.title || parsed.label || "网盘链接",
      80
    ) || "网盘链接";
    items.push({
      label,
      url,
      provider: detectNetdiskProvider(url, rawItem?.provider || parsed.provider || ""),
      accessCode: normalizeNetdiskAccessCode(rawItem?.accessCode || rawItem?.code || parsed.accessCode || ""),
      shareText: normalizeText(rawItem?.shareText || rawItem?.rawText || rawItem?.raw || parsed.shareText || "", 2000)
    });
  }
  return items;
}

function parseNetdiskSharePayload(rawItem) {
  const rawText = typeof rawItem === "string"
    ? rawItem
    : [
        rawItem?.shareText,
        rawItem?.rawText,
        rawItem?.raw,
        rawItem?.text,
        rawItem?.url,
        rawItem?.link,
        rawItem?.value
      ].filter(Boolean).join("\n");
  const shareText = normalizeText(rawText, 2000);
  const urlFromText = extractNetdiskUrl(shareText);
  const explicitUrl = normalizeFixedDeliveryUrl(rawItem?.url || rawItem?.link || rawItem?.value || "");
  const url = explicitUrl || urlFromText;
  const provider = detectNetdiskProvider(url, rawItem?.provider || "");
  const accessCode = normalizeNetdiskAccessCode(
    rawItem?.accessCode || rawItem?.code || extractNetdiskAccessCode(shareText) || extractNetdiskAccessCode(url)
  );
  return {
    url,
    provider,
    accessCode,
    shareText,
    label: getNetdiskProviderLabel(provider, url)
  };
}

function extractNetdiskUrl(value) {
  const text = String(value || "");
  const match = text.match(/https:\/\/[^\s<>"'`]+/i);
  return normalizeFixedDeliveryUrl(match?.[0] || "");
}

function extractNetdiskAccessCode(value) {
  const text = String(value || "");
  if (!text) return "";
  const queryMatch = text.match(/[?&](?:pwd|passcode|code)=([a-z0-9]{1,16})/i);
  if (queryMatch) {
    return normalizeNetdiskAccessCode(queryMatch[1]);
  }
  const labelMatch = text.match(/(?:提取码|访问码|密码|口令)\s*[:：]?\s*([a-z0-9]{1,16})/i);
  if (labelMatch) {
    return normalizeNetdiskAccessCode(labelMatch[1]);
  }
  return "";
}

function normalizeNetdiskAccessCode(value) {
  return normalizeText(value, 16).replace(/[^a-z0-9]/gi, "").slice(0, 16);
}

function detectNetdiskProvider(value, fallback = "") {
  const explicit = normalizeText(fallback, 40).toLowerCase();
  if (explicit) {
    const matched = KNOWN_NETDISK_PROVIDERS.find((item) => item.key === explicit || item.label.toLowerCase() === explicit);
    if (matched) return matched.key;
  }
  try {
    const parsed = new URL(String(value || "").trim());
    const host = parsed.hostname.toLowerCase();
    const matched = KNOWN_NETDISK_PROVIDERS.find((item) => item.hostMatch(host));
    return matched ? matched.key : "unknown";
  } catch {
    return "unknown";
  }
}

function getNetdiskProviderLabel(provider, url = "") {
  const key = normalizeText(provider, 40).toLowerCase();
  const matched = KNOWN_NETDISK_PROVIDERS.find((item) => item.key === key);
  if (matched) return matched.label;
  if (url) {
    const detected = detectNetdiskProvider(url);
    if (detected !== "unknown") {
      return getNetdiskProviderLabel(detected);
    }
  }
  return "网盘链接";
}

function normalizeStringArray(value, maxItems, maxLength) {
  const items = Array.isArray(value) ? value : String(value || "").split(/\r?\n/);
  return items.map((item) => normalizeText(item, maxLength)).filter(Boolean).slice(0, maxItems);
}

function normalizeMarkdownGuides(value) {
  const source = Array.isArray(value) ? value : DEFAULT_MARKDOWN_GUIDES;
  const guides = source.map((item) => ({
    title: normalizeText(item?.title, 40),
    keyword: normalizeText(item?.keyword, 160),
    code: normalizeText(item?.code, 500),
    note: normalizeText(item?.note, 180)
  })).filter((item) => item.title && item.code);
  return (guides.length ? guides : DEFAULT_MARKDOWN_GUIDES).slice(0, 40);
}

function normalizeIds(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return [...new Set(value.map((item) => String(item || "").trim()).filter(Boolean))].slice(0, 500);
}

function normalizeChoice(value, allowed, fallback) {
  const text = String(value || "").trim();
  return allowed.includes(text) ? text : fallback;
}

function normalizeBoolean(value, fallback = true) {
  if (value === true || value === false) {
    return value;
  }
  if (value === 1 || value === "1") {
    return true;
  }
  if (value === 0 || value === "0") {
    return false;
  }
  const text = String(value ?? "").trim().toLowerCase();
  if (["true", "yes", "on", "enabled", "正常营业"].includes(text)) {
    return true;
  }
  if (["false", "no", "off", "disabled", "维护中"].includes(text)) {
    return false;
  }
  return fallback;
}

function normalizeOrderStatus(value) {
  return normalizeChoice(value, ["pending", "completed", "canceled", "processing", "refunded", "expired"], "pending");
}

function normalizeNullableDate(value) {
  const text = normalizeText(value, 40);
  if (!text || Number.isNaN(Date.parse(text))) {
    return null;
  }
  return new Date(text).toISOString();
}

function mergeMallSettings(base, patch) {
  const normalizedPatch = normalizeLegacyMallSettings(patch || {});
  const patchSiteInfo = normalizedPatch.siteInfo || {};
  const merged = {
    siteInfo: { ...(base.siteInfo || {}), ...(normalizedPatch.siteInfo || {}) },
    announcement: { ...(base.announcement || {}), ...(normalizedPatch.announcement || {}) },
    pushme: { ...(base.pushme || {}), ...(normalizedPatch.pushme || {}) },
    luckyDraw: { ...(base.luckyDraw || {}), ...(normalizedPatch.luckyDraw || {}) },
    minesweeperCampaign: normalizeMinesweeperCampaignSettings(
      { ...(base.minesweeperCampaign || {}), ...(normalizedPatch.minesweeperCampaign || {}) },
      base.minesweeperCampaign || MALL_DEFAULT_SETTINGS.minesweeperCampaign
    ),
    markdownGuides: normalizedPatch.markdownGuides || base.markdownGuides || DEFAULT_MARKDOWN_GUIDES,
    backup: { ...(base.backup || {}), ...(normalizedPatch.backup || {}) },
    limits: { ...(base.limits || DEFAULT_MALL_LIMITS), ...(normalizedPatch.limits || {}) },
    adminUsers: { ...(base.adminUsers || {}), ...(normalizedPatch.adminUsers || {}) },
    theme: normalizedPatch.theme || base.theme || "system"
  };
  merged.siteInfo.title = normalizeText(merged.siteInfo.title || "Linuxdo Mall", 80);
  merged.siteInfo.subtitle = normalizeText(merged.siteInfo.subtitle || "官方权益流转中心", 120);
  merged.siteInfo.footer = normalizeText(merged.siteInfo.footer || "", 200);
  merged.siteInfo.contact = normalizeText(merged.siteInfo.contact || "", 120);
  if (!Array.isArray(patchSiteInfo.contacts) && normalizeText(patchSiteInfo.contact || "", 120)) {
    merged.siteInfo.contacts = normalizeLegacyContact(merged.siteInfo.contact);
  } else {
    merged.siteInfo.contacts = normalizeContactLinks(merged.siteInfo.contacts || []);
  }
  merged.siteInfo.currencyMode = normalizeChoice(merged.siteInfo.currencyMode, ["text", "image"], "text");
  merged.siteInfo.currencySymbol = normalizeText(merged.siteInfo.currencySymbol || "L", 24);
  merged.siteInfo.currencyImageUrl = normalizeCurrencyImageUrl(merged.siteInfo.currencyImageUrl || "");
  merged.siteInfo.logoMode = normalizeChoice(merged.siteInfo.logoMode, ["text", "image"], "text");
  merged.siteInfo.logoText = normalizeText(merged.siteInfo.logoText || "L", 4);
  merged.siteInfo.logoImageUrl = normalizeSiteImageUrl(merged.siteInfo.logoImageUrl || "");
  merged.siteInfo.maintenanceImageUrl = normalizeSiteImageUrl(merged.siteInfo.maintenanceImageUrl || "");
  merged.siteInfo.maintenanceReason = normalizeText(merged.siteInfo.maintenanceReason || "", 300);
  merged.siteInfo.siteActive = normalizeBoolean(merged.siteInfo.siteActive, true);
  merged.announcement.top = normalizeText(merged.announcement.top || "", 300);
  merged.announcement.title = normalizeText(merged.announcement.title || "商城公告", 80);
  merged.announcement.type = normalizeChoice(merged.announcement.type, ["info", "success", "warning", "danger"], "info");
  merged.announcement.style = normalizeChoice(merged.announcement.style, ["soft", "solid", "outline"], "soft");
  merged.announcement.linkText = normalizeText(merged.announcement.linkText || "", 40);
  merged.announcement.linkUrl = normalizePublicLinkUrl(merged.announcement.linkUrl || "");
  merged.announcement.dismissible = normalizeBoolean(merged.announcement.dismissible, true);
  merged.announcement.active = normalizeBoolean(merged.announcement.active, true);
  merged.pushme.enabled = normalizeBoolean(merged.pushme.enabled, false);
  merged.pushme.pushKey = normalizeText(merged.pushme.pushKey || "", 300);
  merged.pushme.secretConfigured = false;
  merged.pushme.serverUrl = normalizePushMeServerUrl(merged.pushme.serverUrl || "https://push.i-i.me");
  merged.pushme.title = normalizeText(merged.pushme.title || "[#商城] 新订单通知", 120);
  merged.pushme.type = normalizeChoice(merged.pushme.type, ["html", "markdown", "text"], "html");
  merged.luckyDraw.enabled = normalizeBoolean(merged.luckyDraw.enabled, true);
  merged.luckyDraw.cooldownMinutes = Math.max(0, Number.parseInt(merged.luckyDraw.cooldownMinutes || 120, 10) || 0);
  merged.luckyDraw.scope = normalizeChoice(merged.luckyDraw.scope, LOTTERY_SCOPES, "product_daily");
  merged.markdownGuides = normalizeMarkdownGuides(merged.markdownGuides);
  merged.backup.enabled = normalizeBoolean(merged.backup.enabled, true);
  merged.backup.frequency = normalizeChoice(merged.backup.frequency, BACKUP_FREQUENCIES, "daily");
  merged.backup.hour = Math.max(0, Math.min(23, Number.parseInt(merged.backup.hour || 4, 10) || 4));
  const retentionDays = Math.max(1, Math.min(3650, Number.parseInt(merged.backup.retentionDays || merged.backup.keepDays || 7, 10) || 7));
  merged.backup.retentionDays = retentionDays;
  merged.backup.keepDays = retentionDays;
  if (!Array.isArray(merged.backup.scope)) {
    merged.backup.scope = merged.backup.includeLogs === false ? ["mall", "users", "games"] : DEFAULT_BACKUP_SCOPE;
  }
  merged.backup.scope = normalizeBackupScope(merged.backup.scope, DEFAULT_BACKUP_SCOPE);
  merged.limits = normalizeMallLimits(merged.limits);
  return merged;
}

function normalizeLegacyContact(value) {
  const text = normalizeText(value, 120);
  if (!text) {
    return [];
  }
  const match = text.match(/^(TG|Telegram|QQ|QQ群|飞书|微信)\s*[:：]\s*(.+)$/i);
  if (!match) {
    return [{ type: "url", label: "联系方式", value: text, url: "" }];
  }
  const label = match[1];
  const contactValue = normalizeText(match[2], 300);
  const typeMap = {
    tg: "telegram",
    telegram: "telegram",
    qq: "qq",
    "qq群": "qq_group",
    "飞书": "feishu",
    "微信": "wechat"
  };
  return [{
    type: typeMap[label.toLowerCase()] || "url",
    label,
    value: contactValue,
    url: ""
  }];
}

function normalizeLegacyMallSettings(settings) {
  const normalized = { ...settings };
  if (settings.site_info && !settings.siteInfo) {
    normalized.siteInfo = {
      title: settings.site_info.title,
      subtitle: settings.site_info.subtitle,
      footer: settings.site_info.footer,
      contact: settings.site_info.contact,
      contacts: settings.site_info.contacts,
      currencyMode: settings.site_info.currency_mode,
      currencySymbol: settings.site_info.currency_symbol,
      currencyImageUrl: settings.site_info.currency_image_url,
      logoMode: settings.site_info.logo_mode,
      logoText: settings.site_info.logo_text,
      logoImageUrl: settings.site_info.logo_image_url,
      maintenanceImageUrl: settings.site_info.maintenance_image_url,
      maintenanceReason: settings.site_info.maintenance_reason,
      siteActive: settings.site_info.site_active
    };
  }
  if (settings.lucky_draw && !settings.luckyDraw) {
    normalized.luckyDraw = {
      enabled: settings.lucky_draw.enabled,
      prizes: settings.lucky_draw.prizes,
      cooldownMinutes: settings.lucky_draw.cooldown_minutes,
      productIds: settings.lucky_draw.product_ids
    };
  }
  if (settings.minesweeper_campaign && !settings.minesweeperCampaign) {
    normalized.minesweeperCampaign = {
      enabled: settings.minesweeper_campaign.enabled,
      key: settings.minesweeper_campaign.key,
      startAt: settings.minesweeper_campaign.start_at,
      endsAt: settings.minesweeper_campaign.ends_at,
      validDays: settings.minesweeper_campaign.valid_days,
      levelPercentCoupons: settings.minesweeper_campaign.level_percent_coupons,
      levelFirstFixedCoupons: settings.minesweeper_campaign.level_first_fixed_coupons
    };
  }
  if (settings.announcement && settings.announcement.link_text && !settings.announcement.linkText) {
    normalized.announcement = {
      ...settings.announcement,
      linkText: settings.announcement.link_text,
      linkUrl: settings.announcement.link_url
    };
  }
  if (settings.markdown_guides && !settings.markdownGuides) {
    normalized.markdownGuides = settings.markdown_guides;
  }
  if (settings.admin_users && !settings.adminUsers) {
    normalized.adminUsers = settings.admin_users;
  }
  if (settings.backup && (settings.backup.keep_days || settings.backup.retention_days || settings.backup.save_scope)) {
    normalized.backup = {
      ...settings.backup,
      keepDays: settings.backup.keepDays || settings.backup.keep_days,
      retentionDays: settings.backup.retentionDays || settings.backup.retention_days,
      scope: settings.backup.scope || settings.backup.save_scope
    };
  }
  if (settings.rateLimits && !settings.limits?.rateLimits) {
    normalized.limits = {
      ...(normalized.limits || {}),
      rateLimits: settings.rateLimits
    };
  }
  if (settings.rate_limits && !settings.limits?.rateLimits) {
    normalized.limits = {
      ...(normalized.limits || {}),
      rateLimits: settings.rate_limits
    };
  }
  return normalized;
}

function isUuidLike(value) {
  return /^[0-9a-f-]{20,80}$/i.test(String(value || ""));
}

function isSafeRecordId(value) {
  return /^[a-z0-9][a-z0-9_-]{1,100}$/i.test(String(value || ""));
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function maskUsername(value) {
  const text = String(value || "用户");
  if (text.length <= 2) {
    return `${text}***`;
  }
  return `${text.slice(0, 1)}***${text.slice(-1)}`;
}

async function getLeaderboardRank(env, level, userId) {
  const row = await env.DB.prepare(
    `WITH ranked AS (
       SELECT
         user_id,
         username,
         display_name,
         seconds,
         won_at,
         RANK() OVER (ORDER BY seconds ASC, won_at ASC) AS rank
       FROM leaderboard_scores
       WHERE level = ?
     )
     SELECT user_id, username, display_name, seconds, won_at, rank
     FROM ranked
     WHERE user_id = ?`
  )
    .bind(level, userId)
    .first();

  if (!row) {
    return null;
  }

  return {
    rank: row.rank,
    level,
    userId: row.user_id,
    username: row.display_name || row.username,
    seconds: row.seconds,
    wonAt: row.won_at
  };
}

async function readCredentials(request) {
  const body = await readJson(request);
  const username = normalizeUsername(body.username);
  const password = typeof body.password === "string" ? body.password : "";

  if (!username) {
    throw new ApiError(400, "invalid_username", "用户名需为 3-24 位字母、数字、下划线或中文");
  }
  if (password.length < 6 || password.length > 128) {
    throw new ApiError(400, "invalid_password", "密码长度需为 6-128 位");
  }

  return { username, password };
}

function normalizeUsername(value) {
  const username = String(value || "").trim();
  return /^[\p{L}\p{N}_]{3,24}$/u.test(username) ? username : "";
}

function normalizeStoredAccountUsername(value) {
  const username = String(value || "").trim();
  return /^[\p{L}\p{N}_]{1,32}$/u.test(username) ? username.slice(0, 32) : "";
}

function normalizeLevel(value) {
  const level = String(value || "beginner");
  if (level === "beginner" || level === "intermediate" || level === "expert") {
    return level;
  }
  throw new ApiError(400, "invalid_level", "无效难度");
}

function normalizeScoreSeconds(value) {
  const seconds = Number(value);
  if (!Number.isInteger(seconds) || seconds < 1 || seconds > 999) {
    throw new ApiError(400, "invalid_score", "无效成绩");
  }
  return seconds;
}

function normalizeUserIds(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value
    .map((item) => String(item || "").trim())
    .filter((item) => /^[0-9a-f-]{20,64}$/i.test(item))
  )].slice(0, 500);
}

function normalizeScoreTargets(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set();
  const scores = [];
  for (const item of value) {
    const userId = String(item?.userId || "").trim();
    if (!/^[0-9a-f-]{20,64}$/i.test(userId)) {
      continue;
    }
    let level;
    try {
      level = normalizeLevel(item?.level);
    } catch {
      continue;
    }
    const key = `${level}:${userId}`;
    if (!seen.has(key)) {
      seen.add(key);
      scores.push({ level, userId });
    }
    if (scores.length >= 500) {
      break;
    }
  }
  return scores;
}

async function fetchLinuxDoToken(request, env, code) {
  const base = getLinuxDoBase(env);
  const body = new URLSearchParams();
  body.set("grant_type", "authorization_code");
  body.set("code", code);
  body.set("redirect_uri", getLinuxDoRedirectUri(request, env));

  const response = await fetch(new URL("/oauth2/token", base), {
    method: "POST",
    headers: {
      Authorization: `Basic ${base64(`${env.LINUXDO_CLIENT_ID}:${env.LINUXDO_CLIENT_SECRET}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json"
    },
    body
  });

  const token = await response.json().catch(() => null);
  if (!response.ok || !token?.access_token) {
    throw new ApiError(502, "linuxdo_token_failed", "Linux.do 授权失败");
  }

  return token;
}

async function fetchLinuxDoProfile(env, accessToken) {
  const base = getLinuxDoBase(env);
  const response = await fetch(new URL("/api/user", base), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json"
    }
  });

  const profile = await response.json().catch(() => null);
  if (!response.ok || !profile?.id) {
    throw new ApiError(502, "linuxdo_user_failed", "Linux.do 用户信息获取失败");
  }

  return profile;
}

async function findOrCreateLinuxDoUser(env, profile) {
  await ensureMallRuntime(env);
  await ensureAuthRuntime(env);
  const subject = String(profile.id);
  const trustLevel = getLinuxDoTrustLevel(profile);
  const existing = await env.DB.prepare(
    `SELECT users.id, users.username
     FROM oauth_accounts
     JOIN users ON users.id = oauth_accounts.user_id
     WHERE oauth_accounts.provider = ? AND oauth_accounts.subject = ?`
  )
    .bind(LINUXDO_PROVIDER, subject)
    .first();

  if (existing) {
    await env.DB.prepare(
      "UPDATE oauth_accounts SET username = ?, trust_level = ?, updated_at = CURRENT_TIMESTAMP WHERE provider = ? AND subject = ?"
    )
      .bind(profile.username || null, trustLevel, LINUXDO_PROVIDER, subject)
      .run();
    return { id: existing.id, username: existing.username };
  }

  const userId = crypto.randomUUID();
  const username = await makeUniqueOAuthUsername(env, profile.username || `user_${subject}`, subject);
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO users (
        id, username, username_lower, password_hash, password_salt
      ) VALUES (?, ?, ?, ?, ?)`
    ).bind(userId, username, username.toLowerCase(), `oauth:${LINUXDO_PROVIDER}`, randomHex(16)),
    env.DB.prepare(
      "INSERT INTO oauth_accounts (provider, subject, user_id, username, trust_level) VALUES (?, ?, ?, ?, ?)"
    ).bind(LINUXDO_PROVIDER, subject, userId, profile.username || null, trustLevel)
  ]);

  return { id: userId, username };
}

function getLinuxDoTrustLevel(profile) {
  const raw = profile?.trust_level ??
    profile?.trustLevel ??
    profile?.trust_level_locked ??
    profile?.user?.trust_level ??
    profile?.user?.trustLevel ??
    0;
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) ? Math.max(0, Math.min(4, value)) : 0;
}

async function makeUniqueOAuthUsername(env, rawUsername, subject) {
  const baseName = `linuxdo_${String(rawUsername).replace(/[^\p{L}\p{N}_]/gu, "_").slice(0, 16) || "user"}`;
  const candidates = [baseName, `${baseName}_${subject}`.slice(0, 32)];

  for (const candidate of candidates) {
    const existing = await env.DB.prepare("SELECT id FROM users WHERE username_lower = ?")
      .bind(candidate.toLowerCase())
      .first();
    if (!existing) {
      return candidate;
    }
  }

  return `linuxdo_${subject}_${randomHex(3)}`.slice(0, 32);
}

function assertLinuxDoConfig(env) {
  if (!env.LINUXDO_CLIENT_ID || !env.LINUXDO_CLIENT_SECRET) {
    throw new ApiError(503, "linuxdo_not_configured", "Linux.do 登录尚未配置");
  }
}

function getLinuxDoBase(env) {
  return env.LINUXDO_CONNECT_BASE || LINUXDO_CONNECT_BASE;
}

function getLinuxDoRedirectUri(request, env) {
  const basePath = getRequestBasePath(request, env);
  return env.LINUXDO_CALLBACK_URL || `${new URL(request.url).origin}${basePath}api/auth/linuxdo/callback`;
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "invalid_json", "请求格式错误");
  }
}

async function hashPassword(password, saltHex) {
  const passwordBytes = new TextEncoder().encode(password);
  const saltBytes = hexToBytes(saltHex);
  const key = await crypto.subtle.importKey("raw", passwordBytes, "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: saltBytes, iterations: PASSWORD_ITERATIONS },
    key,
    256
  );
  return bytesToHex(new Uint8Array(bits));
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return bytesToHex(new Uint8Array(digest));
}

function md5Hex(value) {
  const bytes = new TextEncoder().encode(String(value));
  const bitLength = bytes.length * 8;
  const paddedLength = (((bytes.length + 8) >> 6) + 1) * 64;
  const buffer = new Uint8Array(paddedLength);
  buffer.set(bytes);
  buffer[bytes.length] = 0x80;
  const view = new DataView(buffer.buffer);
  view.setUint32(paddedLength - 8, bitLength >>> 0, true);
  view.setUint32(paddedLength - 4, Math.floor(bitLength / 0x100000000), true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let offset = 0; offset < paddedLength; offset += 64) {
    const words = Array.from({ length: 16 }, (_, index) => view.getUint32(offset + index * 4, true));
    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let index = 0; index < 64; index += 1) {
      let f;
      let g;
      if (index < 16) {
        f = (b & c) | ((~b) & d);
        g = index;
      } else if (index < 32) {
        f = (d & b) | ((~d) & c);
        g = (5 * index + 1) % 16;
      } else if (index < 48) {
        f = b ^ c ^ d;
        g = (3 * index + 5) % 16;
      } else {
        f = c ^ (b | (~d));
        g = (7 * index) % 16;
      }

      const rotated = rotateLeft(add32(a, f, MD5_K[index], words[g]), MD5_S[index]);
      a = d;
      d = c;
      c = b;
      b = add32(b, rotated);
    }

    a0 = add32(a0, a);
    b0 = add32(b0, b);
    c0 = add32(c0, c);
    d0 = add32(d0, d);
  }

  return [a0, b0, c0, d0]
    .map((word) => wordToLittleEndianHex(word))
    .join("");
}

function add32(...values) {
  return values.reduce((sum, value) => (sum + (value >>> 0)) >>> 0, 0);
}

function rotateLeft(value, shift) {
  return ((value << shift) | (value >>> (32 - shift))) >>> 0;
}

function wordToLittleEndianHex(word) {
  let result = "";
  for (let index = 0; index < 4; index += 1) {
    result += ((word >>> (index * 8)) & 0xff).toString(16).padStart(2, "0");
  }
  return result;
}

const MD5_S = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
];

const MD5_K = Array.from({ length: 64 }, (_, index) => (
  Math.floor(Math.abs(Math.sin(index + 1)) * 0x100000000) >>> 0
));

function randomHex(byteLength) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

function timingSafeEqual(left, right) {
  if (left.length !== right.length) {
    return false;
  }

  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return diff === 0;
}

function base64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function getCookie(request, name) {
  const cookie = request.headers.get("Cookie") || "";
  for (const part of cookie.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) {
      return value.join("=");
    }
  }
  return "";
}

function makeSessionCookie(request, token) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=${getCookiePath(request)}; Max-Age=${SESSION_DAYS * 86400}${secure}`;
}

async function makeCsrfCookie(request, token) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `ms_csrf=${await buildCsrfTokenFromSession(token)}; SameSite=Lax; Path=${getCookiePath(request)}; Max-Age=${SESSION_DAYS * 86400}${secure}`;
}

function clearSessionCookie(request) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=${getCookiePath(request)}; Max-Age=0${secure}`;
}

function clearCsrfCookie(request) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `ms_csrf=; SameSite=Lax; Path=${getCookiePath(request)}; Max-Age=0${secure}`;
}

function makeOAuthStateCookie(request, state) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${OAUTH_STATE_COOKIE}=${state}; HttpOnly; SameSite=Lax; Path=${getCookiePath(request)}; Max-Age=600${secure}`;
}

function clearOAuthStateCookie(request) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${OAUTH_STATE_COOKIE}=; HttpOnly; SameSite=Lax; Path=${getCookiePath(request)}; Max-Age=0${secure}`;
}

function makeOAuthReturnCookie(request, returnTo) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${OAUTH_RETURN_COOKIE}=${encodeURIComponent(returnTo)}; HttpOnly; SameSite=Lax; Path=${getCookiePath(request)}; Max-Age=600${secure}`;
}

function clearOAuthReturnCookie(request) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${OAUTH_RETURN_COOKIE}=; HttpOnly; SameSite=Lax; Path=${getCookiePath(request)}; Max-Age=0${secure}`;
}

function getCookiePath(request) {
  return request.headers.get("x-minesweeper-base-path") || "/";
}

function getRequestBasePath(request, env) {
  return request.headers.get("x-minesweeper-base-path") || getBasePath(env, new URL(request.url).pathname);
}

function redirectAuthResult(request, result, basePath, cookies) {
  const url = new URL(request.url);
  const returnTo = normalizeReturnTo(getCookie(request, OAUTH_RETURN_COOKIE), basePath);
  const target = new URL(returnTo, url.origin);
  url.pathname = target.pathname;
  url.search = target.search;
  url.hash = target.hash;
  url.searchParams.set("auth", result);
  const headers = new Headers({
    Location: url.toString(),
    "Cache-Control": "no-store"
  });
  const cookieList = Array.isArray(cookies) ? cookies : [cookies];
  for (const cookie of cookieList.filter(Boolean)) {
    headers.append("Set-Cookie", cookie);
  }

  return new Response(null, { status: 302, headers });
}

function normalizeReturnTo(value, basePath = DEFAULT_BASE_PATH) {
  const fallback = basePath || "/";
  const raw = decodeURIComponent(String(value || fallback));
  if (!raw.startsWith("/") || raw.startsWith("//")) {
    return fallback;
  }

  const url = new URL(raw, "https://local.invalid");
  const base = basePath || "/";
  if (base !== "/" && !url.pathname.startsWith(base)) {
    return fallback;
  }
  const appPath = base === "/" ? url.pathname : `/${url.pathname.slice(base.length)}`;
  if (appPath.startsWith("/api/") || appPath === "/login") {
    return fallback;
  }
  return `${url.pathname}${url.search}${url.hash}`;
}

function parseJson(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function json(data, status = 200, headers = {}) {
  const responseHeaders = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  const rawCookieValue = !headers || headers instanceof Headers
    ? null
    : headers["Set-Cookie"] || headers["set-cookie"] || null;
  const rawCookieHeaders = Array.isArray(rawCookieValue)
    ? rawCookieValue
    : rawCookieValue
      ? [rawCookieValue]
      : [];
  const inputHeaders = headers instanceof Headers
    ? headers
    : new Headers(Object.fromEntries(Object.entries(headers || {}).filter(([key]) => key.toLowerCase() !== "set-cookie")));
  inputHeaders.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      responseHeaders.append("Set-Cookie", value);
    } else {
      responseHeaders.set(key, value);
    }
  });
  for (const cookie of rawCookieHeaders.filter(Boolean)) {
    responseHeaders.append("Set-Cookie", cookie);
  }
  return new Response(JSON.stringify(data), {
    status,
    headers: responseHeaders
  });
}

class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
