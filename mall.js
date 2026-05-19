const state = {
  user: null,
  settings: null,
  products: [],
  orders: [],
  feedback: [],
  minesweeperActivity: null,
  ldcBalance: 0,
  userMallSpent: 0,
  ads: [],
  hotProducts: [],
  recentTransactions: [],
  stats: { orders: 0 },
  currentCategory: "all",
  currentAdminTab: "dashboard",
  currentProductStatus: "active",
  currentCardStatus: "all",
  currentOrderStatus: "all",
  currentCouponStatus: "all",
  currentFeedbackStatus: "pending",
  currentFeedbackId: "",
  adminPageSize: 20,
  adminPages: {},
  adminProductFilter: "all",
  chat: {
    open: false,
    conversations: [],
    activeConversationId: "",
    messages: [],
    pollTimer: null,
    adminPollTimer: null,
    context: null,
    position: null
  },
  admin: null,
  minesweeperAdmin: null,
  selected: new Set()
};

const MINE_LEVEL_LABELS = {
  beginner: "初级",
  intermediate: "中级",
  expert: "高级",
  all: "全部"
};

const EMAIL_TEMPLATE_PARAMS = [
  { key: "username", label: "买家用户名", description: "下单用户的 Linux.do 用户名或本地用户名。", sample: "suimi" },
  { key: "order_id", label: "订单号", description: "商城订单唯一编号，用于用户核对订单。", sample: "07d04ff1-96b1-4433-a0ea-2b400730f82a" },
  { key: "product_name", label: "商品名称", description: "订单购买的商品名称。", sample: "测试商品" },
  { key: "delivery_note", label: "交付内容", description: "管理员交付说明、卡密或自动交付凭证。", sample: "这里会显示交付内容或卡密凭证。" },
  { key: "site_name", label: "站点名称", description: "后台站点基础中配置的商城名称。", sample: "Linuxdo Mall" },
  { key: "order_time", label: "下单时间", description: "买家创建订单的时间。", sample: "2026/5/15 14:15" },
  { key: "delivery_time", label: "交付时间", description: "订单完成交付或通知发送的时间。", sample: "2026/5/15 17:39" },
  { key: "order_status", label: "订单状态", description: "订单当前状态，例如待支付、处理中、已完成。", sample: "待支付" },
  { key: "payment_mode", label: "支付方式", description: "商品或订单使用的支付方式。", sample: "积分站支付" },
  { key: "delivery_mode", label: "发货方式", description: "商品配置的自动发货或手动发货方式。", sample: "自动发货" },
  { key: "amount", label: "实付金额", description: "订单最终支付的金额。", sample: "50 L" },
  { key: "note", label: "订单备注", description: "订单备注或管理员交付备注。", sample: "示例备注" }
];
const EMAIL_TEMPLATE_EVENT_TYPES = [
  ["order_created", "订单创建通知"],
  ["order_delivered", "订单交付通知"]
];

const CONTACT_TYPES = [
  ["qq", "QQ"],
  ["qq_group", "QQ群"],
  ["telegram", "TG 私聊"],
  ["telegram_group", "TG 群"],
  ["feishu", "飞书"],
  ["wechat", "微信"],
  ["url", "其他链接"]
];
const SITE_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/gif", "image/webp", "image/avif"]);
const MAX_SITE_IMAGE_BYTES = 240 * 1024;
const MAX_PROCESSED_SITE_IMAGE_BYTES = 240 * 1024;
const ANNOUNCEMENT_DISMISS_PREFIX = "linuxdo_mall_announcement_dismissed_";
const ADMIN_PAGE_SIZE_OPTIONS = [20, 50, 100, 200, 500, "all"];
const CARD_KEY_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ADMIN_TAB_KEYS = new Set([
  "dashboard", "orders", "chat", "feedback", "products", "cards", "coupons", "ratings",
  "ads", "announcementSettings", "lotterySettings", "markdownGuides",
  "pushSettings", "emailSettings", "emailTemplates", "settings", "users",
  "rateLimits", "blacklist", "backupSettings", "loginAttempts", "minesweeper"
]);
const BACKUP_SCOPE_OPTIONS = [
  { value: "all", label: "全部数据", description: "包含商城、用户、游戏、风控、私聊、抽奖等全部 D1 数据。" },
  { value: "mall", label: "商城业务", description: "商品、订单、卡密、优惠码、评价、广告、邮箱模板、反馈和系统设置。" },
  { value: "users", label: "用户登录", description: "用户、Linux.do 绑定、登录会话。" },
  { value: "games", label: "娱乐活动", description: "扫雷娱乐活动的同步数据和排行榜。" },
  { value: "security", label: "风控记录", description: "黑名单、登录失败和访问风控记录。" },
  { value: "chat", label: "私聊消息", description: "会话和消息内容。" },
  { value: "lottery", label: "抽奖记录", description: "每日抽奖和奖品记录。" }
];
const BACKUP_SCOPE_MODULE_VALUES = BACKUP_SCOPE_OPTIONS
  .map((item) => item.value)
  .filter((value) => value !== "all");
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
  rateLimits: {
    orderCreate: { enabled: true, limit: 20, windowSeconds: 600 },
    feedbackCreate: { enabled: true, limit: 8, windowSeconds: 3600 },
    bingImageResolve: { enabled: true, limit: 20, windowSeconds: 3600 },
    adminImageProxy: { enabled: true, limit: 60, windowSeconds: 600 }
  }
};
const LEGACY_MALL_CACHE_PREFIXES = [
  "minesweeper-pwa-",
  "linuxdo-mall-",
  "mall-"
];
const LEGACY_MALL_SW_RELOAD_KEY = "linuxdo_mall_legacy_sw_reload_v2";

const app = document.querySelector(".mall-app");
const views = {
  home: document.querySelector("#homeView"),
  product: document.querySelector("#productView"),
  orders: document.querySelector("#ordersView"),
  profile: document.querySelector("#profileView"),
  feedback: document.querySelector("#feedbackView"),
  admin: document.querySelector("#adminView")
};
const loginBanner = document.querySelector("#loginBanner");
const announcementBar = document.querySelector("#announcementBar");
const loginButton = document.querySelector("#loginButton");
const loginBannerButton = document.querySelector("#loginBannerButton");
const logoutButton = document.querySelector("#logoutButton");
const cloudGameSelect = document.querySelector("#cloudGameSelect");
const userMenu = document.querySelector("#userMenu");
const userMenuButton = document.querySelector("#userMenuButton");
const userMenuPopover = document.querySelector("#userMenuPopover");
const siteFooter = document.querySelector("#siteFooter");
const modalLayer = document.querySelector("#modalLayer");
const modalCard = document.querySelector(".modal-card");
const modalContent = document.querySelector("#modalContent");
const modalClose = document.querySelector("#modalClose");
const chatDock = document.querySelector("#chatDock");
const chatWindowPortal = document.querySelector("#chatWindowPortal");
const toastStack = document.querySelector("#toastStack");
const siteFavicon = document.querySelector("#siteFavicon");

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

function getMallRateLimitsForUi(value = {}) {
  const source = value && typeof value === "object" ? value : {};
  return Object.fromEntries(Object.entries(DEFAULT_MALL_LIMITS.rateLimits).map(([key, defaults]) => [
    key,
    { ...defaults, ...(source[key] || {}) }
  ]));
}

function getMallLimitsForUi(source = state.settings?.limits || state.admin?.settings?.limits || {}) {
  const limits = source && typeof source === "object" ? source : {};
  return {
    ...DEFAULT_MALL_LIMITS,
    ...limits,
    rateLimits: getMallRateLimitsForUi(limits.rateLimits || {})
  };
}

function isTestEmailCoolingDown(lastTestEmailAt, cooldownHours = DEFAULT_MALL_LIMITS.userTestEmailCooldownHours) {
  const hours = Number(cooldownHours || 0);
  if (!lastTestEmailAt || hours <= 0) return false;
  const lastMs = Date.parse(lastTestEmailAt);
  return Number.isFinite(lastMs) && Date.now() - lastMs < hours * 60 * 60 * 1000;
}

function formatRewardRange(limits = getMallLimitsForUi()) {
  return `${renderMoney(limits.feedbackRewardMin || 0)}-${renderMoney(limits.feedbackRewardMax || 0)}`;
}

function formatEmailCooldownText(hours) {
  const value = Number(hours || 0);
  if (value <= 0) return "普通用户测试邮件不限制发送间隔。";
  if (value >= 24) return "普通用户测试邮件成功发送后，需要第二天或冷却结束后才能再次测试。";
  return `普通用户测试邮件成功发送后，每 ${value} 小时可再次测试。`;
}

function readCookie(name) {
  const prefix = `${name}=`;
  return document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length) || "";
}

async function cleanupLegacyRootServiceWorker() {
  if (!("serviceWorker" in navigator) || !location.protocol.startsWith("http")) {
    return false;
  }
  if (location.pathname.startsWith("/games/minesweeper/")) {
    return false;
  }

  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data?.type === "MALL_ROOT_SW_CLEANED") {
      reloadAfterServiceWorkerCleanup();
    }
  });

  try {
    let touchedRootRegistration = false;
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      const scopeUrl = new URL(registration.scope);
      if (scopeUrl.origin !== location.origin || scopeUrl.pathname !== "/") {
        continue;
      }
      touchedRootRegistration = true;
      await registration.update().catch(() => {});
      await registration.unregister().catch(() => false);
    }

    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => LEGACY_MALL_CACHE_PREFIXES.some((prefix) => key.startsWith(prefix)))
          .map((key) => caches.delete(key))
      );
    }

    if (touchedRootRegistration || navigator.serviceWorker.controller) {
      return reloadAfterServiceWorkerCleanup();
    }
  } catch {
    return false;
  }
  return false;
}

function reloadAfterServiceWorkerCleanup() {
  try {
    if (sessionStorage.getItem(LEGACY_MALL_SW_RELOAD_KEY) === "1") {
      return false;
    }
    sessionStorage.setItem(LEGACY_MALL_SW_RELOAD_KEY, "1");
  } catch {
    // If sessionStorage is unavailable, skip the forced reload to avoid loops.
    return false;
  }
  location.reload();
  return true;
}

function apiFetch(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  const method = String(options.method || "GET").toUpperCase();
  if (!["GET", "HEAD", "OPTIONS"].includes(method) && !headers["X-CSRF-Token"]) {
    const csrfToken = readCookie("ms_csrf");
    if (csrfToken) headers["X-CSRF-Token"] = csrfToken;
  }
  return fetch(path, {
    ...options,
    credentials: "same-origin",
    headers
  });
}

async function apiJson(path, options = {}) {
  const response = await apiFetch(path, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.error || "请求失败");
  }
  return data;
}

function currentPath() {
  return location.pathname.replace(/\/+$/, "") || "/";
}

function setLoginLinks() {
  const returnTo = `${location.pathname}${location.search}${location.hash}`;
  const href = `/api/auth/linuxdo/start?return_to=${encodeURIComponent(returnTo)}`;
  loginButton.href = href;
  loginBannerButton.href = href;
}

async function bootstrap() {
  setLoginLinks();
  clearAuthQuery();
  try {
    const data = await apiJson(`/api/mall/bootstrap?_=${Date.now()}`, { cache: "no-store" });
    state.user = data.user || null;
    state.settings = data.settings || null;
    state.products = data.products || [];
    state.orders = data.orders || [];
    state.feedback = data.feedback || [];
    state.minesweeperActivity = data.minesweeperActivity || null;
    state.ldcBalance = Number(data.ldcBalance || 0);
    state.userMallSpent = Number(data.userMallSpent || 0);
    state.ads = data.ads || [];
    state.hotProducts = data.hotProducts || [];
    state.recentTransactions = data.recentTransactions || [];
    state.stats = data.stats || { orders: 0 };
    applySession();
    applySettings();
    renderChatDock();
    renderHome();
    route();
    hydrateChat().catch(() => {});
  } catch (error) {
    showToast(error.message || "商城数据读取失败", "error");
    applySession();
    renderChatDock();
    route();
  }
}

function clearAuthQuery() {
  const url = new URL(location.href);
  if (url.searchParams.has("auth")) {
    const auth = url.searchParams.get("auth");
    url.searchParams.delete("auth");
    history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    if (auth === "success") {
      showToast("登录成功");
    } else if (auth === "maintenance") {
      showToast("网站维护中，暂时无法登录", "error");
    } else if (auth === "error") {
      showToast("登录失败，请重试", "error");
    }
  }
}

function applySession() {
  const loggedIn = Boolean(state.user);
  const frontLocked = isFrontMaintenanceLocked();
  app.dataset.authState = loggedIn ? "logged-in" : "logged-out";
  app.dataset.maintenanceState = frontLocked ? "locked" : "open";
  qsa(".auth-only").forEach((item) => { item.hidden = frontLocked || !loggedIn; });
  qsa(".guest-only").forEach((item) => { item.hidden = frontLocked || loggedIn; });
  qsa(".admin-only").forEach((item) => { item.hidden = !state.user?.isAdmin; });
  qsa(".front-feature").forEach((item) => { item.hidden = frontLocked || !loggedIn; });
  qsa(".user-only").forEach((item) => { item.hidden = frontLocked || !loggedIn || Boolean(state.user?.isAdmin); });
  if (chatDock) chatDock.hidden = frontLocked || !loggedIn;
  const displayName = state.user?.linuxdo?.username || state.user?.username || "未登录";
  const userAvatar = qs("#userAvatar");
  const userName = qs("#userName");
  const userMeta = qs("#userMeta");
  if (userAvatar) userAvatar.textContent = displayName.slice(0, 1).toUpperCase();
  if (userName) userName.textContent = displayName;
  if (userMeta) {
    userMeta.innerHTML = state.user?.linuxdo?.id
      ? `
        <span>Linux.do ID: ${escapeHtml(state.user.linuxdo.id)} · TL${Number(state.user.linuxdo.trustLevel || 0)}</span>
        <span class="user-spent-line">本站消费 ${renderMoney(state.userMallSpent || 0)}</span>
      `
      : `
        <span>登录后同步订单和账户信息</span>
        <span class="user-spent-line">本站消费 ${renderMoney(state.userMallSpent || 0)}</span>
      `;
  }
  if (!loggedIn || frontLocked) closeUserMenu();
}

function applySettings() {
  const settings = state.settings || {};
  const site = settings.siteInfo || {};
  document.body.dataset.theme = settings.theme || "system";
  document.title = site.title || "Linuxdo Mall";
  renderSiteLogo(site);
  qsa("[data-site-title]").forEach((item) => { item.textContent = site.title || "Linuxdo Mall"; });
  qsa("[data-site-subtitle]").forEach((item) => { item.textContent = site.subtitle || "商城商品与订单中心"; });
  renderAnnouncementBar();
  renderSiteFooter();
}

function renderSiteLogo(site = {}) {
  const logoText = String(site.logoText || "L").trim().slice(0, 4) || "L";
  const logoImageUrl = normalizeSiteImageUrl(site.logoImageUrl);
  const useImage = Boolean(logoImageUrl);
  qsa("[data-site-logo]").forEach((item) => {
    item.innerHTML = useImage
      ? `<img src="${escapeAttr(logoImageUrl)}" alt="${escapeAttr(site.title || "Logo")}" loading="eager">`
      : escapeHtml(logoText);
    item.classList.toggle("has-image", Boolean(useImage));
  });
  renderSiteFavicon({ useImage, logoImageUrl, logoText, siteTitle: site.title });
}

function renderSiteFavicon({ useImage, logoImageUrl, logoText, siteTitle }) {
  if (!siteFavicon) return;
  const href = useImage ? logoImageUrl : buildTextLogoFavicon(logoText, siteTitle);
  siteFavicon.setAttribute("href", href || "/icon.svg");
  siteFavicon.setAttribute("type", inferImageMimeType(href) || "image/svg+xml");
}

function buildTextLogoFavicon(text, title) {
  const label = String(text || "L").trim().slice(0, 4) || "L";
  const fontSize = label.length > 2 ? 34 : label.length > 1 ? 42 : 50;
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" role="img" aria-label="${escapeAttr(title || "Logo")}">`,
    `<rect width="64" height="64" rx="14" fill="#2563eb"/>`,
    `<text x="50%" y="53%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="${fontSize}" font-weight="800" fill="#ffffff">${escapeHtml(label)}</text>`,
    `</svg>`
  ].join("");
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function inferImageMimeType(url) {
  const text = String(url || "").trim();
  if (!text) return "";
  const dataMatch = text.match(/^data:(image\/(?:svg\+xml|png|jpe?g|gif|webp|avif));/i);
  if (dataMatch) return dataMatch[1].replace("image/jpg", "image/jpeg");
  const cleanUrl = text.split(/[?#]/, 1)[0];
  if (/\.svg$/i.test(cleanUrl)) return "image/svg+xml";
  if (/\.png$/i.test(cleanUrl)) return "image/png";
  if (/\.jpe?g$/i.test(cleanUrl)) return "image/jpeg";
  if (/\.gif$/i.test(cleanUrl)) return "image/gif";
  if (/\.webp$/i.test(cleanUrl)) return "image/webp";
  if (/\.avif$/i.test(cleanUrl)) return "image/avif";
  return "";
}

function route() {
  const path = currentPath();
  renderChatDock();
  qsa("[data-route]").forEach((link) => {
    const routePath = link.getAttribute("data-route");
    link.classList.toggle("is-current", routePath === path);
  });
  if (isFrontMaintenanceLocked()) {
    if (path === "/admin") {
      if (!requireLogin()) return;
      if (!state.user?.isAdmin) {
        renderMaintenanceHome();
        showView("home");
        return;
      }
    } else {
      renderMaintenanceHome();
      showView("home");
      return;
    }
  }
  if (path.startsWith("/product/")) {
    if (!requireLogin()) return;
    renderProductDetail(decodeURIComponent(path.slice("/product/".length)));
    return;
  }
  if (path === "/orders" || path === "/query") {
    if (!requireLogin()) return;
    renderOrders();
    showView("orders");
    return;
  }
  if (path === "/profile") {
    if (!requireLogin()) return;
    renderProfile();
    showView("profile");
    return;
  }
  if (path === "/feedback") {
    if (!requireLogin()) return;
    renderFeedback();
    showView("feedback");
    return;
  }
  if (path === "/admin") {
    if (!requireLogin()) return;
    if (!state.user?.isAdmin) {
      showToast("需要超级管理员权限", "error");
      navigate("/");
      return;
    }
    state.currentAdminTab = requestedAdminTab() || "dashboard";
    renderAdmin().catch((error) => showToast(error.message, "error"));
    showView("admin");
    return;
  }
  if (!requireLogin({ quiet: true })) {
    showView("home");
    return;
  }
  renderHome();
  showView("home");
}

function requestedAdminTab() {
  const tab = new URLSearchParams(location.search).get("tab") || "";
  const normalized = tab === "smtpSettings" ? "emailSettings" : tab;
  return ADMIN_TAB_KEYS.has(normalized) ? normalized : "";
}

function showView(name) {
  app.dataset.currentView = name;
  Object.entries(views).forEach(([key, view]) => {
    view.hidden = key !== name;
  });
  loginBanner.hidden = !(name === "home" && !state.user && !isFrontMaintenanceLocked());
  if (siteFooter) siteFooter.hidden = name === "admin";
  updateAnnouncementVisibility(name);
  window.scrollTo({ top: 0, behavior: "instant" });
}

function renderAnnouncementBar() {
  const announcement = state.settings?.announcement || {};
  const text = String(announcement.top || "").trim();
  if (announcement.active && text) {
    const title = String(announcement.title || "公告").trim();
    const type = ["info", "success", "warning", "danger"].includes(announcement.type) ? announcement.type : "info";
    const style = ["soft", "solid", "outline"].includes(announcement.style) ? announcement.style : "soft";
    const linkUrl = normalizeExternalHref(announcement.linkUrl || "");
    announcementBar.dataset.announcementType = type;
    announcementBar.dataset.announcementStyle = style;
    announcementBar.innerHTML = `
      <span class="announcement-label">${escapeHtml(title)}</span>
      <span class="announcement-text">${escapeHtml(text)}</span>
      ${announcement.linkText && linkUrl ? `<a class="announcement-link" href="${escapeAttr(linkUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(announcement.linkText)}</a>` : ""}
      ${announcement.dismissible === false ? "" : `<button class="announcement-close" type="button" data-announcement-close aria-label="关闭公告" title="关闭公告">×</button>`}
    `;
    qs("[data-announcement-close]", announcementBar)?.addEventListener("click", () => {
      dismissAnnouncement(text);
    });
  } else {
    announcementBar.removeAttribute("data-announcement-type");
    announcementBar.removeAttribute("data-announcement-style");
    announcementBar.innerHTML = "";
  }
  updateAnnouncementVisibility(activeViewName());
}

function updateAnnouncementVisibility(viewName = activeViewName()) {
  const announcement = state.settings?.announcement || {};
  const text = String(announcement.top || "").trim();
  const hasAnnouncement = Boolean(announcement.active && text);
  announcementBar.hidden = !(viewName === "home" && state.user && hasAnnouncement && !isAnnouncementDismissed(text) && !isMallMaintenanceMode());
}

function announcementDismissKey(text) {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) - hash + text.charCodeAt(index)) | 0;
  }
  return `${ANNOUNCEMENT_DISMISS_PREFIX}${Math.abs(hash)}`;
}

function isAnnouncementDismissed(text) {
  if (!text) return false;
  try {
    return localStorage.getItem(announcementDismissKey(text)) === "1";
  } catch {
    return false;
  }
}

function dismissAnnouncement(text) {
  try {
    localStorage.setItem(announcementDismissKey(text), "1");
  } catch {
    // localStorage may be unavailable in strict privacy modes; hiding still works for this render.
  }
  announcementBar.hidden = true;
}

function renderSiteFooter() {
  if (!siteFooter) return;
  const site = state.settings?.siteInfo || {};
  const contacts = normalizeContactLinks(site.contacts, site.contact);
  siteFooter.innerHTML = `
    <div class="site-footer-main">
      <span>${escapeHtml(site.footer || "© 2026 Linuxdo Mall. All Rights Reserved.")}</span>
      ${contacts.length ? `
        <nav class="footer-contact-list" aria-label="联系方式">
          ${contacts.map(renderContactLink).join("")}
        </nav>
      ` : ""}
    </div>
  `;
}

function renderCurrencyPrefix() {
  const site = state.settings?.siteInfo || {};
  const imageUrl = normalizeCurrencyImageUrl(site.currencyImageUrl);
  if (site.currencyMode === "image" && imageUrl) {
    return `<img class="currency-icon" src="${escapeAttr(imageUrl)}" alt="${escapeAttr(site.currencySymbol || "货币")}" loading="lazy">`;
  }
  return escapeHtml(site.currencySymbol || "L");
}

function money(value) {
  return `${renderCurrencyPrefix()} <span>${Number(value || 0).toLocaleString("zh-CN")}</span>`;
}

function renderMoney(value) {
  return `<span class="money-value">${money(value)}</span>`;
}

function currencyText() {
  const site = state.settings?.siteInfo || state.admin?.settings?.siteInfo || {};
  return String(site.currencySymbol || "L").trim() || "L";
}

function formatMoneyText(value) {
  return `${Number(value || 0).toLocaleString("zh-CN")} ${currencyText()}`;
}

function renderMaintenanceHome() {
  const site = state.settings?.siteInfo || {};
  const imageUrl = normalizeSiteImageUrl(site.maintenanceImageUrl);
  const reason = String(site.maintenanceReason || "").trim() || "管理员已将站点状态设置为维护中，暂时无法浏览商品或创建订单。";
  views.home.innerHTML = `
    <section class="not-found-panel maintenance-panel">
      ${imageUrl ? `<img class="maintenance-visual" src="${escapeAttr(imageUrl)}" alt="商城维护中" loading="eager">` : ""}
      <span class="not-found-icon">维护中</span>
      <h1>商城维护中</h1>
      <p class="lead maintenance-reason">${escapeHtml(reason).replace(/\n/g, "<br>")}</p>
    </section>
  `;
}

function renderFooterContactsInline() {
  const contacts = normalizeContactLinks(state.settings?.siteInfo?.contacts, state.settings?.siteInfo?.contact);
  if (!contacts.length) return "";
  return `<div class="footer-contact-list centered">${contacts.map(renderContactLink).join("")}</div>`;
}

function isMallMaintenanceMode() {
  return state.settings?.siteInfo?.siteActive === false;
}

function isFrontMaintenanceLocked() {
  return isMallMaintenanceMode();
}

function activeViewName() {
  const active = Object.entries(views).find(([, view]) => !view.hidden);
  return active?.[0] || "";
}

function setUserMenuOpen(open) {
  if (!userMenu || !userMenuButton || !userMenuPopover) return;
  const allowed = Boolean(open && state.user && !isFrontMaintenanceLocked());
  userMenu.classList.toggle("is-open", allowed);
  userMenuButton.setAttribute("aria-expanded", String(allowed));
  userMenuPopover.hidden = !allowed;
}

function closeUserMenu() {
  setUserMenuOpen(false);
}

function toggleUserMenu() {
  setUserMenuOpen(userMenuPopover?.hidden !== false);
}

function navigate(path) {
  closeUserMenu();
  history.pushState(null, "", path);
  setLoginLinks();
  route();
}

function requireLogin(options = {}) {
  if (state.user) {
    return true;
  }
  if (!options.quiet) showToast("请先登录", "error");
  showView("home");
  return false;
}

function renderHome() {
  if (!state.user) {
    if (!isFrontMaintenanceLocked()) {
      views.home.innerHTML = "";
    }
    return;
  }
  if (isFrontMaintenanceLocked()) {
    renderMaintenanceHome();
    return;
  }
  restoreHomeShell();
  renderProductSummary();
  renderCategories();
  renderProducts();
  renderMinesweeperCampaignPanel();
  renderHotList();
  renderTransactions();
  renderAds();
}

function renderProductSummary() {
  const activeProducts = state.products.filter((item) => item.status === "active");
  const activeCount = activeProducts.filter((item) => !isProductSoldOut(item)).length;
  const soldoutCount = activeProducts.filter((item) => isProductSoldOut(item)).length;
  const title = qs("#productSummaryTitle");
  if (title) title.textContent = "商品";
  const badges = qs("#productSummaryBadges");
  if (!badges) return;
  badges.innerHTML = `
    <span class="summary-chip summary-active">在售 ${activeCount}</span>
    ${soldoutCount > 0 ? `<span class="summary-chip summary-soldout">已售罄 ${soldoutCount}</span>` : ""}
  `;
}

function restoreHomeShell() {
  if (qs("#productGrid")) return;
  views.home.innerHTML = `
    <section class="home-toolbar search-only">
      <div class="ad-slot ad-slot-top" id="topAdSlot" hidden></div>
      <div class="toolbar-actions">
        <label class="search-box">
          <span>搜索</span>
          <input id="searchInput" type="search" placeholder="商品名称 / 描述">
        </label>
        <button class="btn btn-ghost" id="refreshButton" type="button">刷新</button>
      </div>
    </section>
    <section class="ad-slot ad-slot-hero" id="heroAdSlot" hidden></section>
    <section class="home-grid">
      <section class="content-column">
        <section class="section-head" id="products">
          <div>
            <p class="eyebrow">PRODUCTS</p>
            <h2 id="productSummaryTitle">商品</h2>
          </div>
          <div class="product-summary-badges" id="productSummaryBadges"></div>
        </section>
        <section class="ad-slot ad-slot-between" id="betweenAdSlot" hidden></section>
        <div class="product-grid" id="productGrid"></div>
        <section class="panel home-campaign-panel" id="minesweeperCampaignPanel" hidden>
          <div class="panel-head">
            <h2>商城活动</h2>
            <span>扫雷福利</span>
          </div>
          <div class="home-campaign-body"></div>
        </section>
      </section>
      <aside class="activity-rail">
        <section class="panel">
          <div class="panel-head">
            <h2>热销榜</h2>
            <span>Top 10</span>
          </div>
          <div class="rank-list" id="hotList"></div>
        </section>
        <section class="panel">
          <div class="panel-head">
            <h2>近期成交</h2>
          </div>
          <div class="transaction-list" id="transactionList"></div>
        </section>
        <section class="panel" id="adPanel" hidden>
          <div class="panel-head">
            <h2>推荐</h2>
          </div>
          <div class="ad-list" id="adList"></div>
        </section>
      </aside>
    </section>
    <section class="ad-slot ad-slot-footer" id="footerAdSlot" hidden></section>
    <section class="floating-ad-slot" id="floatingAdSlot" hidden></section>
  `;
  qs("#searchInput")?.addEventListener("input", renderProducts);
  qs("#refreshButton")?.addEventListener("click", () => bootstrap());
}

function renderContactEditorRow(contact) {
  const type = contact.type || "url";
  return `
    <div class="contact-editor-row" data-contact-row>
      <label>类型
        <select name="contactType">
          ${CONTACT_TYPES.map(([value, label]) => `<option value="${value}" ${type === value ? "selected" : ""}>${label}</option>`).join("")}
        </select>
      </label>
      <label>显示名称<input name="contactLabel" value="${escapeAttr(contact.label || contactTypeLabel(type))}" placeholder="例如 TG 私聊"></label>
      <label>账号/群号/链接<input name="contactValue" value="${escapeAttr(contact.value || "")}" placeholder="例如 @suimigg、123456、https://..."></label>
      <label>自定义跳转链接<input name="contactUrl" value="${escapeAttr(contact.url || "")}" placeholder="可选，优先使用"></label>
      <button class="btn btn-small btn-danger" type="button" data-remove-contact>删除</button>
    </div>
  `;
}

function readContactRows(form) {
  return qsa("[data-contact-row]", form).map((row) => ({
    type: qs('[name="contactType"]', row).value,
    label: qs('[name="contactLabel"]', row).value.trim(),
    value: qs('[name="contactValue"]', row).value.trim(),
    url: qs('[name="contactUrl"]', row).value.trim()
  })).filter((item) => item.value || item.url);
}

function normalizeContactLinks(value, legacyContact = "") {
  const source = Array.isArray(value) ? value : [];
  const contacts = source.map((item) => {
    const type = CONTACT_TYPES.some(([key]) => key === item?.type) ? item.type : "url";
    const label = String(item?.label || contactTypeLabel(type)).trim();
    const rawValue = String(item?.value || "").trim();
    const rawUrl = normalizeExternalHref(item?.url || "");
    const href = rawUrl || contactHref(type, rawValue);
    return { type, label, value: rawValue, url: rawUrl, href };
  }).filter((item) => item.value || item.href);
  if (!contacts.length && legacyContact) {
    contacts.push({ type: "url", label: "联系方式", value: legacyContact, url: "", href: contactHref("url", legacyContact) });
  }
  return contacts.slice(0, 20);
}

function contactTypeLabel(type) {
  return CONTACT_TYPES.find(([value]) => value === type)?.[1] || "联系方式";
}

function contactHref(type, value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/^https?:\/\//i.test(text)) return normalizeExternalHref(text);
  const cleanAt = text.replace(/^@+/, "");
  if (type === "qq") return normalizeExternalHref(`https://wpa.qq.com/msgrd?v=3&uin=${encodeURIComponent(text)}&site=qq&menu=yes`);
  if (type === "qq_group") return normalizeExternalHref(`https://qm.qq.com/cgi-bin/qm/qr?k=${encodeURIComponent(text)}`);
  if (type === "telegram" || type === "telegram_group") return normalizeExternalHref(`https://t.me/${encodeURIComponent(cleanAt)}`);
  if (type === "feishu") {
    if (/^https?:\/\//i.test(text)) return normalizeExternalHref(text);
    return text.includes(".feishu.cn") || text.includes(".larksuite.com") ? normalizeExternalHref(`https://${text}`) : "";
  }
  if (type === "url") return normalizeExternalHref(text);
  return "";
}

function renderContactLink(contact) {
  const text = `${contact.label}${contact.value ? `：${contact.value}` : ""}`;
  if (contact.href) {
    return `<a class="footer-contact-link" href="${escapeAttr(contact.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`;
  }
  return `<span class="footer-contact-link is-static">${escapeHtml(text)}</span>`;
}

function fileToDataUrl(file, label = "图片") {
  return new Promise((resolve, reject) => {
    if (!isSupportedSiteImageFile(file)) {
      reject(new Error(`${label}只支持 PNG、JPG、GIF、WebP 或 AVIF`));
      return;
    }
    if (file.size > MAX_SITE_IMAGE_BYTES) {
      reject(new Error(`${label}不能超过 240KB`));
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(new Error("图片读取失败")));
    reader.readAsDataURL(file);
  });
}

async function maintenanceImageFileToDataUrl(file) {
  const dataUrl = await fileToDataUrl(file, "维护页图片");
  return await processMaintenanceImageDataUrl(dataUrl);
}

async function maintenanceImageUrlToTransparentDataUrl(url) {
  const imageUrl = normalizeSiteImageUrl(url);
  if (!/^https?:\/\//i.test(imageUrl)) return imageUrl;
  try {
    const response = await apiFetch(`/api/mall/admin/image-proxy?url=${encodeURIComponent(imageUrl)}`, { cache: "no-store" });
    if (!response.ok) return imageUrl;
    const blob = await response.blob();
    if (!SITE_IMAGE_TYPES.has(blob.type) || blob.size > 1536 * 1024) return imageUrl;
    const dataUrl = await blobToDataUrl(blob);
    return await processMaintenanceImageDataUrl(dataUrl);
  } catch {
    return imageUrl;
  }
}

async function processMaintenanceImageDataUrl(dataUrl) {
  if (!/^data:image\/(?:png|jpe?g|webp);base64,/i.test(dataUrl)) {
    return dataUrl;
  }
  try {
    const processed = await removeNearWhiteImageBackground(dataUrl);
    return estimateDataUrlBytes(processed) <= MAX_PROCESSED_SITE_IMAGE_BYTES ? processed : dataUrl;
  } catch {
    return dataUrl;
  }
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(new Error("图片读取失败")));
    reader.readAsDataURL(blob);
  });
}

function estimateDataUrlBytes(value) {
  const text = String(value || "");
  const base64 = text.includes(",") ? text.split(",", 2)[1] : text;
  return Math.ceil(base64.length * 0.75);
}

function removeNearWhiteImageBackground(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth || image.width;
      canvas.height = image.naturalHeight || image.height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context || !canvas.width || !canvas.height) {
        reject(new Error("图片处理失败"));
        return;
      }
      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let index = 0; index < data.length; index += 4) {
        const red = data[index];
        const green = data[index + 1];
        const blue = data[index + 2];
        const alpha = data[index + 3];
        const isNearWhite = red > 238 && green > 238 && blue > 238 && Math.max(red, green, blue) - Math.min(red, green, blue) < 18;
        if (isNearWhite) {
          const distance = Math.max(0, 255 - Math.min(red, green, blue));
          data[index + 3] = Math.min(alpha, Math.round(distance * 10));
        }
      }
      context.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    });
    image.addEventListener("error", () => reject(new Error("图片处理失败")));
    image.src = dataUrl;
  });
}

function isSupportedSiteImageFile(file) {
  if (!file) return false;
  if (SITE_IMAGE_TYPES.has(file.type)) return true;
  return /\.(png|jpe?g|gif|webp|avif)$/i.test(file.name || "");
}

function normalizeSiteImageUrl(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/^data:image\/(?:png|jpe?g|gif|webp|avif);base64,[a-z0-9+/=\s]+$/i.test(text)) {
    return text.replace(/\s+/g, "");
  }
  if (/^https:\/\/[^\s"'<>`]+$/i.test(text)) return normalizeSafeRenderedUrl(text) || "";
  if (/^\/(?!\/)[^\s"'<>`]+$/i.test(text)) return text;
  return "";
}

function normalizeCurrencyImageUrl(value) {
  return normalizeSiteImageUrl(value);
}

function renderCategories() {
  const root = qs("#categoryFilters");
  if (!root) return;
  root.innerHTML = "";
  root.hidden = true;
  state.currentCategory = "all";
}

function renderProducts() {
  const root = qs("#productGrid");
  const keyword = qs("#searchInput")?.value.trim().toLowerCase() || "";
  const products = state.products.filter((product) => {
    const matchCategory = state.currentCategory === "all" || product.category === state.currentCategory;
    const haystack = `${product.name} ${product.description}`.toLowerCase();
    return matchCategory && (!keyword || haystack.includes(keyword));
  });
  root.innerHTML = "";
  if (!products.length) {
    root.appendChild(emptyState("没有匹配的商品"));
    return;
  }
  for (const product of products) {
    const card = document.createElement("article");
    card.className = "product-card";
  const stock = Number(product.stock || 0);
  const fixedLink = isFixedLinkProduct(product);
  const lowStock = !fixedLink && stock > 0 && stock <= Number(product.stockThreshold || 5);
  const soldOut = isProductSoldOut(product);
  const cardStateClass = soldOut ? "is-soldout" : lowStock ? "is-lowstock" : "is-instock";
  const trustBadge = product.minTrustLevel ? `<span class="badge badge-warning">TL${product.minTrustLevel}+</span>` : "";
    card.innerHTML = `
      <div class="product-media">${renderProductImage(product)}</div>
      <div class="product-body">
        <div class="product-card-head">
          <span class="badge">${categoryLabel(product.category)}</span>
          ${trustBadge}
        </div>
        <h3 class="product-title">${escapeHtml(product.name)}</h3>
        <div class="product-desc">${renderSafeMarkdown(product.description || "")}</div>
        <div class="product-meta">
          <span class="badge ${soldOut || lowStock ? "badge-danger" : "badge-success"}">${productStockLabel(product)}</span>
          <span class="badge">销量 ${product.sales || 0}</span>
        </div>
        ${soldOut ? `<p class="stock-warning stock-warning-soldout">当前库存为 0，暂时无法购买。</p>` : lowStock ? `<p class="stock-warning stock-warning-low">库存低于预警阈值，请尽快补货。</p>` : ""}
        <div class="price-row">
          <span class="price">${money(product.price)}</span>
          ${product.originalPrice > product.price ? `<span class="original-price">${money(product.originalPrice)}</span>` : ""}
        </div>
        <div class="product-actions">
          <button class="btn btn-ghost" type="button" data-action="detail">详情</button>
          <button class="btn btn-primary" type="button" data-action="buy" ${soldOut ? "disabled" : ""}>${soldOut ? "库存不足" : "购买"}</button>
        </div>
      </div>
    `;
    card.dataset.stockState = cardStateClass;
    card.querySelector('[data-action="detail"]').addEventListener("click", () => navigate(`/product/${encodeURIComponent(product.id)}`));
    card.querySelector('[data-action="buy"]').addEventListener("click", () => {
      if (!ensureProductPurchasable(product)) return;
      openBuyModal(product);
    });
    hydrateProductImages(card);
    root.appendChild(card);
  }
}

function renderProductImage(product) {
  const image = normalizeSiteImageUrl(product.imageUrl || product.images?.[0] || "");
  if (image) {
    return `<img src="${escapeAttr(image)}" alt="${escapeAttr(product.name)}" loading="lazy" data-fallback="${escapeAttr(product.name.slice(0, 1))}">`;
  }
  return `<div class="product-fallback">${escapeHtml(product.name.slice(0, 1))}</div>`;
}

function hydrateProductImages(root = document) {
  qsa(".product-media img, .detail-image img, .detail-thumb img", root).forEach((image) => {
    const replaceBrokenImage = () => {
      const fallback = document.createElement("div");
      fallback.className = "product-fallback";
      fallback.textContent = image.dataset.fallback || "L";
      image.replaceWith(fallback);
    };
    image.addEventListener("error", replaceBrokenImage, { once: true });
    if (image.complete && image.naturalWidth === 0) {
      replaceBrokenImage();
    }
  });
}

function renderProductCarousel(product) {
  const images = (product.images?.length ? product.images : (product.imageUrl ? [product.imageUrl] : []))
    .map(normalizeSiteImageUrl)
    .filter(Boolean);
  if (!images.length) {
    return `<button class="detail-image detail-image-button" type="button" data-lightbox-image="" data-lightbox-title="${escapeAttr(product.name)}">${renderProductImage(product)}</button>`;
  }
  return `
    <div class="detail-carousel" data-carousel>
      <button class="detail-image detail-image-button" type="button" data-carousel-stage data-lightbox-image="${escapeAttr(images[0])}" data-lightbox-title="${escapeAttr(product.name)}">
        <img src="${escapeAttr(images[0])}" alt="${escapeAttr(product.name)}" loading="lazy" data-fallback="${escapeAttr(product.name.slice(0, 1))}">
      </button>
      ${images.length > 1 ? `
        <div class="detail-thumbs">
          ${images.map((image, index) => `
            <button class="detail-thumb ${index === 0 ? "is-active" : ""}" type="button" data-carousel-image="${escapeAttr(image)}" aria-label="查看第 ${index + 1} 张图片">
              <img src="${escapeAttr(image)}" alt="" loading="lazy" data-fallback="${escapeAttr(product.name.slice(0, 1))}">
            </button>
          `).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

function hydrateProductCarousel(root = document) {
  qsa("[data-carousel]", root).forEach((carousel) => {
    const stage = qs("[data-carousel-stage]", carousel);
    stage?.addEventListener("click", () => {
      const image = stage.dataset.lightboxImage || qs("img", stage)?.src || "";
      if (image) openImageLightbox(image, stage.dataset.lightboxTitle || "商品图片");
    });
    qsa("[data-carousel-image]", carousel).forEach((button) => {
      button.addEventListener("click", () => {
        qsa("[data-carousel-image]", carousel).forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        const safeImage = normalizeSiteImageUrl(button.dataset.carouselImage || "");
        stage.dataset.lightboxImage = safeImage;
        stage.innerHTML = safeImage
          ? `<img src="${escapeAttr(safeImage)}" alt="" loading="lazy" data-fallback="L">`
          : `<div class="product-fallback">L</div>`;
        hydrateProductImages(stage);
      });
    });
  });
}

function openImageLightbox(imageUrl, title = "商品图片") {
  const safeUrl = normalizeSiteImageUrl(imageUrl);
  if (!safeUrl) {
    showToast("图片地址无效", "error");
    return;
  }
  openModal(`
    <p class="eyebrow">PRODUCT IMAGE</p>
    <h2 id="modalTitle">${escapeHtml(title)}</h2>
    <div class="image-lightbox">
      <img src="${escapeAttr(safeUrl)}" alt="${escapeAttr(title)}" loading="eager">
    </div>
  `, "image");
}

async function renderProductDetail(productId) {
  showView("product");
  const root = views.product;
  const cached = state.products.find((item) => item.id === productId);
  root.innerHTML = renderDetailSkeleton(cached);
  try {
    const data = await apiJson(`/api/mall/products/${encodeURIComponent(productId)}?_=${Date.now()}`, { cache: "no-store" });
    const product = data.product;
    const ratings = data.ratings || [];
    const trustLevel = Number(state.user?.linuxdo?.trustLevel || 0);
    const trustBlocked = Boolean(state.user && product.minTrustLevel > 0 && trustLevel < product.minTrustLevel);
    root.innerHTML = `
      <div class="section-head">
        <div>
          <p class="eyebrow">PRODUCT DETAIL</p>
          <h2>${escapeHtml(product.name)}</h2>
        </div>
        <button class="btn btn-ghost" type="button" data-back>返回商城</button>
      </div>
      <section class="product-detail">
        <div class="detail-media">
          ${renderProductCarousel(product)}
          <div class="detail-tabs">
            <button class="detail-tab is-active" type="button" data-tab="detail">详情</button>
            <button class="detail-tab" type="button" data-tab="reviews">评价 ${product.ratingCount || ratings.length}</button>
            <button class="detail-tab" type="button" data-tab="faq">使用说明</button>
            ${product.afterSaleEnabled ? `<button class="detail-tab" type="button" data-tab="after-sale">售后说明</button>` : ""}
          </div>
          <div id="detailTabPanel">${renderDetailPanel(product)}</div>
        </div>
        <aside class="detail-panel">
          <span class="badge">${categoryLabel(product.category)}</span>
          <h1 style="font-size:2.2rem; margin-top:14px;">${escapeHtml(product.name)}</h1>
          <div class="lead detail-summary">${renderSafeMarkdown(product.description || "")}</div>
          <div class="product-meta">
            <span class="badge badge-success">评分 ${product.avgRating || 5}</span>
            <span class="badge">评价 ${product.ratingCount || ratings.length}</span>
            <span class="badge ${!isFixedLinkProduct(product) && product.stock > 0 && product.stock <= Number(product.stockThreshold || 5) ? "badge-danger" : isProductSoldOut(product) ? "badge-danger" : "badge-success"}">${productStockLabel(product)}</span>
          </div>
          <div class="price-row">
            <span class="price">${money(product.price)}</span>
            ${product.originalPrice > product.price ? `<span class="original-price">${money(product.originalPrice)}</span>` : ""}
          </div>
          ${product.limitPerUser ? `<p class="muted">每人限购 ${product.limitPerUser} 件，你已购买 ${data.boughtCount || 0} 件。</p>` : ""}
          ${product.minTrustLevel ? `<p class="muted">购买要求 Linux.do TL${product.minTrustLevel}，当前 ${state.user ? `TL${trustLevel}` : "未登录"}。</p>` : ""}
          ${isProductSoldOut(product) ? `<p class="stock-warning">当前库存为 0，暂时无法购买。</p>` : ""}
          <button class="btn btn-primary" style="width:100%; margin-top:18px;" type="button" data-buy ${isProductSoldOut(product) || trustBlocked ? "disabled" : ""}>${isProductSoldOut(product) ? "库存不足" : "立即购买"}</button>
          <button class="btn btn-ghost" style="width:100%; margin-top:10px;" type="button" data-share>复制链接</button>
        </aside>
      </section>
    `;
    hydrateProductImages(root);
    hydrateProductCarousel(root);
    root.querySelector("[data-back]").addEventListener("click", () => navigate("/"));
    root.querySelector("[data-buy]").addEventListener("click", () => {
      if (!ensureProductPurchasable(product)) return;
      openBuyModal(product);
    });
    root.querySelector("[data-share]").addEventListener("click", () => copyText(location.href));
    qsa("[data-tab]", root).forEach((button) => {
      button.addEventListener("click", () => {
        qsa("[data-tab]", root).forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        const tab = button.dataset.tab;
        qs("#detailTabPanel", root).innerHTML = tab === "reviews"
          ? renderRatings(ratings)
          : tab === "faq"
            ? renderUsagePanel(product)
            : tab === "after-sale"
              ? renderAfterSalePanel(product)
              : renderDetailPanel(product);
      });
    });
  } catch (error) {
    if (String(error.message || "").includes("维护")) {
      renderMaintenanceHome();
      showView("home");
      return;
    }
    renderProductNotFound(root, error.message || "商品不存在或已下架");
  }
}

function renderDetailSkeleton(product) {
  return `<div class="empty-state">${product ? `正在读取 ${escapeHtml(product.name)}...` : "正在读取商品详情..."}</div>`;
}

function renderProductNotFound(root, message = "商品不存在或已下架") {
  root.innerHTML = `
    <section class="not-found-panel">
      <span class="not-found-icon">404</span>
      <p class="eyebrow">PRODUCT NOT FOUND</p>
      <h1>未找到商品</h1>
      <p class="lead">${escapeHtml(message)}，可能已被删除、下架，或链接输入错误。</p>
      <div class="row-actions">
        <button class="btn btn-primary" type="button" data-home>返回首页</button>
        <button class="btn btn-ghost" type="button" data-refresh>重新加载</button>
      </div>
    </section>
  `;
  qs("[data-home]", root).addEventListener("click", () => navigate("/"));
  qs("[data-refresh]", root).addEventListener("click", () => route());
}

function renderDetailPanel(product) {
  const features = product.features?.length ? product.features : [];
  return `
    <div class="panel" style="box-shadow:none;">
      <h3>商品简介</h3>
      <div class="markdown-content detail-markdown">${renderSafeMarkdown(product.description || "暂无简介")}</div>
      ${features.length ? `<div class="feature-grid optional-feature-grid">
        ${features.map((item) => `<div class="feature-item">${escapeHtml(item)}</div>`).join("")}
      </div>` : ""}
    </div>
  `;
}

function renderUsagePanel(product) {
  return `
    <div class="panel" style="box-shadow:none;">
      <h3>使用说明</h3>
      <div class="markdown-content detail-markdown">${renderSafeMarkdown(product.usageGuide || "暂无说明")}</div>
    </div>
  `;
}

function renderAfterSalePanel(product) {
  return `
    <div class="panel" style="box-shadow:none;">
      <h3>售后说明</h3>
      <div class="markdown-content detail-markdown">${renderSafeMarkdown(product.afterSaleGuide || "暂无售后说明")}</div>
    </div>
  `;
}

function renderRatings(ratings) {
  if (!ratings.length) {
    return `<div class="empty-state">暂无用户评价</div>`;
  }
  return `
    <div class="order-list">
      ${ratings.map((rating) => `
        <article class="order-card">
          <div class="order-card-head">
            <div>
              <strong>${escapeHtml(rating.username)}</strong>
              <div class="order-meta"><span>${"★".repeat(rating.rating)}${"☆".repeat(5 - rating.rating)}</span><span>${formatDate(rating.createdAt)}</span></div>
            </div>
          </div>
          <p>${escapeHtml(rating.comment || "未填写评价内容")}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function renderOrders() {
  const root = views.orders;
  root.innerHTML = `
    <div class="section-head">
      <div>
        <p class="eyebrow">MY ORDERS</p>
        <h2>我的订单 <span class="badge">共 ${state.orders.length} 单</span></h2>
      </div>
      <button class="btn btn-ghost" type="button" data-refresh-orders>刷新订单</button>
    </div>
    <div class="order-list" id="orderList"></div>
  `;
  root.querySelector("[data-refresh-orders]").addEventListener("click", refreshOrders);
  renderOrderList(qs("#orderList", root), state.orders);
}

function renderProfile() {
  const root = views.profile;
  const limits = getMallLimitsForUi();
  const email = state.user?.email || "";
  const enabled = Boolean(state.user?.notifyEmailEnabled);
  const testedToday = isTestEmailCoolingDown(state.user?.lastTestEmailAt, limits.userTestEmailCooldownHours);
  const testEmailButtonLabel = testedToday
    ? (Number(limits.userTestEmailCooldownHours || 0) >= 24 ? "今日已测试" : "冷却中")
    : "发送测试邮件";
  const feedbackCount = state.feedback.length;
  const pendingFeedbackCount = state.feedback.filter((item) => item.status === "pending").length;
  root.innerHTML = `
    <section class="profile-shell">
      <div class="section-head">
        <div>
          <p class="eyebrow">USER SETTINGS</p>
          <h2>用户设置</h2>
          <p class="muted">管理邮箱通知、Bug 反馈和账号相关入口。</p>
        </div>
      </div>
      <div class="profile-module-grid">
        <form class="admin-card profile-card" id="profileForm">
          <div>
            <p class="eyebrow">EMAIL</p>
            <h3>邮箱通知</h3>
          </div>
          <label>默认邮箱
            <input name="email" type="email" maxlength="180" value="${escapeAttr(email)}" placeholder="name@example.com">
          </label>
          <label class="check-row">
            <input name="notifyEmailEnabled" type="checkbox" value="true" ${enabled ? "checked" : ""}>
            默认推送订单通知到邮箱
          </label>
          <p class="settings-hint">启用后，手动发货和自动发货都会发送邮件通知。${escapeHtml(formatEmailCooldownText(limits.userTestEmailCooldownHours))}</p>
          <div class="row-actions">
            <button class="btn btn-primary" type="submit">保存设置</button>
            <button class="btn btn-ghost" type="button" data-test-profile-email ${testedToday ? "disabled" : ""}>${testEmailButtonLabel}</button>
          </div>
        </form>
        <article class="admin-card profile-card profile-module-card">
          <div>
            <p class="eyebrow">FEEDBACK</p>
            <h3>Bug 反馈</h3>
            <p class="muted">提交 Bug 或问题建议，审核通过后会发放 ${formatRewardRange(limits)}。保存状态可以继续修改，提交后进入审核。</p>
          </div>
          <div class="profile-module-stats">
            <span><strong>${feedbackCount}</strong><small>我的反馈</small></span>
            <span><strong>${pendingFeedbackCount}</strong><small>审核中</small></span>
          </div>
          <div class="row-actions">
            <a class="btn btn-primary" href="/feedback" data-route="/feedback">进入 Bug 反馈</a>
          </div>
        </article>
      </div>
    </section>
  `;
  qs("#profileForm", root)?.addEventListener("submit", saveProfileSettings);
  qs("[data-test-profile-email]", root)?.addEventListener("click", testProfileEmail);
}

async function saveProfileSettings(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  try {
    const data = await apiJson("/api/mall/profile", {
      method: "PUT",
      body: JSON.stringify({
        email: form.get("email"),
        notifyEmailEnabled: form.get("notifyEmailEnabled") === "true"
      })
    });
    state.user = data.user || state.user;
    applySession();
    renderProfile();
    showToast("用户设置已保存");
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function testProfileEmail(event) {
  const button = event.currentTarget;
  const form = qs("#profileForm");
  const email = qs('[name="email"]', form)?.value || "";
  button.disabled = true;
  button.textContent = "发送中...";
  try {
    const data = await apiJson("/api/mall/profile/test-email", {
      method: "POST",
      body: JSON.stringify({ email })
    });
    if (state.user) {
      state.user.lastTestEmailAt = data.lastTestEmailAt || new Date().toISOString();
    }
    renderProfile();
    showToast(`测试邮件已发送到 ${data.email}`);
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    button.disabled = false;
    const limits = getMallLimitsForUi();
    if (!isTestEmailCoolingDown(state.user?.lastTestEmailAt, limits.userTestEmailCooldownHours)) {
      button.textContent = "发送测试邮件";
    } else {
      button.textContent = Number(limits.userTestEmailCooldownHours || 0) >= 24 ? "今日已测试" : "冷却中";
    }
  }
}

function renderOrderList(root, orders) {
  root.innerHTML = "";
  if (!orders.length) {
    root.appendChild(emptyState("暂无订单"));
    return;
  }
  for (const order of orders) {
    const chatAvailable = canChatForOrder(order);
    const card = document.createElement("article");
    card.className = "order-card";
    card.innerHTML = `
      <div class="order-card-head">
        <div>
          <h3>${escapeHtml(order.productName)}</h3>
          <div class="order-meta">
            <span>订单 ${escapeHtml(order.id.slice(0, 8))}</span>
            <span>${formatDate(order.createdAt)}</span>
            <span>${money(order.finalAmount)}</span>
            <span>${order.quantity} 件</span>
          </div>
        </div>
        <span class="badge ${orderStatusClass(order.status)}">${orderStatusLabel(order.status)}</span>
      </div>
      ${order.deliveryContent ? `<div class="delivery-box">${renderDeliveryContent(order.deliveryContent)}</div>` : ""}
      ${renderOrderDiscounts(order)}
      ${order.note ? `<p class="muted">${escapeHtml(order.note)}</p>` : ""}
      <div class="row-actions">
        ${order.deliveryContent ? `<button class="btn btn-small btn-ghost" type="button" data-copy>复制凭证</button>` : ""}
        ${orderCanContinuePay(order) ? `<button class="btn btn-small btn-primary" type="button" data-continue-pay>继续支付</button>` : ""}
        ${orderCanUserCancel(order) ? `<button class="btn btn-small btn-ghost" type="button" data-cancel>取消</button>` : ""}
        ${order.status === "completed" && !order.rated ? `<button class="btn btn-small btn-primary" type="button" data-rate>评价</button>` : ""}
        ${order.status === "completed" ? `<button class="btn btn-small btn-ghost" type="button" data-chat-order ${chatAvailable ? "" : "disabled"}>${chatAvailable ? "咨询订单" : "咨询已过期"}</button>` : ""}
        ${orderCanDisputeRefund(order) ? `<button class="btn btn-small btn-ghost" type="button" data-dispute-refund>争议退款</button>` : ""}
        ${orderCanUserDelete(order) ? `<button class="btn btn-small btn-danger" type="button" data-delete>删除</button>` : ""}
        <button class="btn btn-small btn-ghost" type="button" data-archive>归档</button>
      </div>
    `;
    card.querySelector("[data-copy]")?.addEventListener("click", () => copyText(order.deliveryContent));
    card.querySelector("[data-continue-pay]")?.addEventListener("click", () => continuePayOrder(order.id));
    card.querySelector("[data-cancel]")?.addEventListener("click", () => updateOrder(order.id, { action: "cancel" }));
    card.querySelector("[data-delete]")?.addEventListener("click", () => deleteOrder(order.id));
    card.querySelector("[data-archive]")?.addEventListener("click", () => updateOrder(order.id, { action: "archive" }));
    card.querySelector("[data-rate]")?.addEventListener("click", () => openRatingModal(order));
    card.querySelector("[data-dispute-refund]")?.addEventListener("click", () => disputeRefundOrder(order));
    card.querySelector("[data-chat-order]")?.addEventListener("click", () => {
      if (!canChatForOrder(order)) {
        const chatDays = Number(getMallLimitsForUi().orderChatDays || 0);
        showToast(chatDays > 0 ? `订单超过 ${chatDays} 天后无法继续私聊` : "该订单暂不能私聊", "error");
        return;
      }
      openChatForContext({ orderId: order.id, subject: `咨询订单：${order.productName}` });
    });
    root.appendChild(card);
  }
}

function renderOrderDiscounts(order = {}) {
  const discounts = Array.isArray(order.discounts) ? order.discounts.filter((item) => Number(item.amount || 0) > 0) : [];
  if (!discounts.length && Number(order.discountAmount || 0) <= 0) {
    return "";
  }
  const rows = discounts.length ? discounts : [{
    label: order.couponCode ? `优惠码 ${order.couponCode}` : "订单优惠",
    amount: Number(order.discountAmount || 0),
    source: "manual_coupon"
  }];
  return `
    <div class="order-discount-box">
      <strong>已优惠 ${renderMoney(order.discountAmount || 0)}</strong>
      <div>
        ${rows.map((item) => `<span>${escapeHtml(formatDiscountSourceLabel(item))} -${renderMoney(item.amount || 0)}</span>`).join("")}
      </div>
    </div>
  `;
}

function formatDiscountSourceLabel(item = {}) {
  if (item.source === "user_coupon") return item.label || item.code || "自动优惠券";
  if (item.source === "lottery") return item.label || "手气折扣";
  return item.label || item.code || "优惠码";
}

function canChatForOrder(order) {
  if (order?.status !== "completed") return false;
  if (!order?.createdAt) return false;
  const chatDays = Number(getMallLimitsForUi().orderChatDays || 0);
  if (chatDays <= 0) return true;
  const createdAt = parseAppDate(order.createdAt).getTime();
  return Number.isFinite(createdAt) && Date.now() - createdAt <= chatDays * 24 * 60 * 60 * 1000;
}

function renderFeedback() {
  const root = views.feedback;
  const limits = getMallLimitsForUi();
  const feedback = state.feedback || [];
  root.innerHTML = `
    <section class="feedback-shell">
      <div class="section-head">
        <div>
          <p class="eyebrow">BUG REPORT</p>
          <h2>Bug 反馈 <span class="badge">${renderMoney(state.ldcBalance || 0)}</span></h2>
          <p class="muted">每个 Bug 或问题经过管理员审核后，会向提出者赠送 ${formatRewardRange(limits)}。</p>
        </div>
      </div>
      <div class="feedback-grid">
        <form class="feedback-form admin-card" id="feedbackForm">
          <h3>保存反馈</h3>
          <label>类型
            <select name="type">
              <option value="bug">Bug 反馈</option>
              <option value="question">问题建议</option>
            </select>
          </label>
          <label>标题
            <input name="title" maxlength="${Number(limits.feedbackTitleMaxChars || 120)}" required placeholder="例如：订单页面刷新后按钮状态异常">
          </label>
          <label>详细描述
            <textarea name="content" maxlength="${Number(limits.feedbackContentMaxChars || 3000)}" required placeholder="支持 Markdown；图片可使用 ![图片](https://example.com/a.png)。请说明复现步骤、期望结果、实际结果。"></textarea>
          </label>
          <label>图片 URL
            <input name="imageUrl" type="url" placeholder="可选：图片直链或 Bing 图片详情页">
          </label>
          <div class="feedback-markdown-tools">
            ${renderMarkdownAssist()}
          </div>
          <p class="feedback-rule">保存草稿后可以继续修改；提交审核后内容锁定。审核通过发放 ${formatRewardRange(limits)}。请不要提交脚本、HTML 或敏感信息。</p>
          <div class="row-actions">
            <button class="btn btn-ghost" type="submit" data-feedback-action="save">保存草稿</button>
            <button class="btn btn-primary" type="submit" data-feedback-action="submit">提交审核</button>
          </div>
        </form>
        <section class="feedback-history admin-card">
          <div class="panel-head">
            <h3>我的反馈</h3>
            <button class="btn btn-small btn-ghost" type="button" data-refresh-feedback>刷新</button>
          </div>
          ${feedback.length ? `
            <div class="feedback-list">
              ${feedback.map(renderFeedbackItem).join("")}
            </div>
          ` : `<div class="empty-state">暂无反馈记录</div>`}
        </section>
      </div>
    </section>
  `;
  qs("#feedbackForm", root)?.addEventListener("submit", submitFeedback);
  qs("[data-refresh-feedback]", root)?.addEventListener("click", refreshFeedback);
  qsa("[data-edit-feedback]", root).forEach((button) => button.addEventListener("click", () => openUserFeedbackEditor(button.dataset.editFeedback)));
  qsa("[data-delete-feedback]", root).forEach((button) => button.addEventListener("click", () => deleteUserFeedback(button.dataset.deleteFeedback)));
  bindMarkdownAssist(root);
}

function renderFeedbackItem(item) {
  const editable = item.status === "draft";
  return `
    <article class="feedback-item">
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <span>${feedbackTypeLabel(item.type)} · ${formatDate(item.createdAt)}</span>
      </div>
      <div class="feedback-render">${renderSafeMarkdown(item.content)}</div>
      <div class="feedback-meta">
        <span class="badge ${feedbackStatusClass(item.status)}">${feedbackStatusLabel(item.status)}</span>
        ${Number(item.rewardAmount || 0) > 0 ? `<span class="badge badge-success">+${renderMoney(item.rewardAmount)}</span>` : ""}
      </div>
      ${item.adminNote ? `<p class="feedback-note">管理员备注：${escapeHtml(item.adminNote)}</p>` : ""}
      <div class="row-actions compact">
        <button class="btn btn-small btn-ghost" type="button" data-edit-feedback="${escapeAttr(item.id)}" ${editable ? "" : "disabled"}>修改</button>
        <button class="btn btn-small btn-danger" type="button" data-delete-feedback="${escapeAttr(item.id)}" ${editable ? "" : "disabled"}>删除</button>
      </div>
    </article>
  `;
}

async function submitFeedback(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const action = event.submitter?.dataset.feedbackAction || "save";
  const button = event.submitter || qs("button[type='submit']", form);
  const payload = Object.fromEntries(new FormData(form).entries());
  payload.action = action;
  button.disabled = true;
  try {
    const data = await apiJson("/api/mall/feedback", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    state.feedback = data.feedbackList || [data.feedback, ...(state.feedback || [])].filter(Boolean);
    state.ldcBalance = Number(data.ldcBalance || state.ldcBalance || 0);
    form.reset();
    applySession();
    renderFeedback();
    showToast(action === "submit" ? "反馈已提交，等待管理员审核" : "草稿已保存");
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    button.disabled = false;
  }
}

async function refreshFeedback() {
  try {
    const data = await apiJson(`/api/mall/feedback?_=${Date.now()}`, { cache: "no-store" });
    state.feedback = data.feedback || [];
    state.ldcBalance = Number(data.ldcBalance || 0);
    applySession();
    renderFeedback();
  } catch (error) {
    showToast(error.message, "error");
  }
}

function openUserFeedbackEditor(feedbackId) {
  const limits = getMallLimitsForUi();
  const item = (state.feedback || []).find((entry) => entry.id === feedbackId);
  if (!item) {
    showToast("反馈不存在", "error");
    return;
  }
  if (item.status !== "draft") {
    showToast("反馈已提交或已审核，不能修改", "error");
    return;
  }
  openModal(`
    <p class="eyebrow">EDIT FEEDBACK</p>
    <h2 id="modalTitle">修改反馈</h2>
    <form class="form-grid" id="feedbackEditForm">
      <label>类型
        <select name="type">
          <option value="bug" ${item.type === "bug" ? "selected" : ""}>Bug 反馈</option>
          <option value="question" ${item.type === "question" ? "selected" : ""}>问题建议</option>
        </select>
      </label>
      <label>标题
        <input name="title" maxlength="${Number(limits.feedbackTitleMaxChars || 120)}" required value="${escapeAttr(item.title || "")}">
      </label>
      <label style="grid-column:1/-1;">详细描述
        <textarea name="content" maxlength="${Number(limits.feedbackContentMaxChars || 3000)}" required>${escapeHtml(item.content || "")}</textarea>
      </label>
      <label style="grid-column:1/-1;">图片 URL
        <input name="imageUrl" type="url" placeholder="可选：图片直链或 Bing 图片详情页">
      </label>
      <div style="grid-column:1/-1;" class="feedback-markdown-tools">
        ${renderMarkdownAssist()}
      </div>
      <div class="row-actions" style="grid-column:1/-1;">
        <button class="btn btn-ghost" type="submit" data-feedback-action="save">保存草稿</button>
        <button class="btn btn-primary" type="submit" data-feedback-action="submit">提交审核</button>
      </div>
    </form>
  `);
  bindMarkdownAssist(modalContent);
  qs("#feedbackEditForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const action = event.submitter?.dataset.feedbackAction || "save";
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    payload.action = action;
    try {
      const data = await apiJson(`/api/mall/feedback/${feedbackId}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      state.feedback = data.feedbackList || updateById(state.feedback || [], data.feedback);
      state.ldcBalance = Number(data.ldcBalance || state.ldcBalance || 0);
      if (action === "submit") closeModal();
      renderFeedback();
      showToast(action === "submit" ? "反馈已提交，等待管理员审核" : "草稿已保存");
    } catch (error) {
      showToast(error.message, "error");
    }
  });
}

async function deleteUserFeedback(feedbackId) {
  if (!confirm("确认删除这条草稿？")) return;
  try {
    const data = await apiJson(`/api/mall/feedback/${feedbackId}`, {
      method: "DELETE",
      body: JSON.stringify({})
    });
    state.feedback = data.feedbackList || (state.feedback || []).filter((entry) => entry.id !== feedbackId);
    state.ldcBalance = Number(data.ldcBalance || state.ldcBalance || 0);
    renderFeedback();
    showToast("反馈已删除");
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function openBuyModal(product) {
  if (!requireLogin()) return;
  if (!ensureProductPurchasable(product)) return;
  const trustLevel = Number(state.user?.linuxdo?.trustLevel || 0);
  if (product.minTrustLevel > 0 && trustLevel < product.minTrustLevel) {
    showToast(`该商品要求 Linux.do TL${product.minTrustLevel}，当前 TL${trustLevel}`, "error");
    return;
  }
  const settings = state.settings || {};
  const lotteryEnabled = settings.luckyDraw?.enabled !== false;
  const lotteryStatus = await getProductLotteryStatus(product);
  const autoCouponStatus = await getProductAutoCoupons(product);
  let selectedLottery = lotteryStatus.lottery || (lotteryEnabled ? null : { label: "抽奖已关闭", value: 1, reused: true });
  const isTestPayment = product.paymentMode === "test";
  const fields = product.requiresUserInfo
    ? (product.userInfoFields?.length ? product.userInfoFields : [{ name: "contact", label: "接收账号 / 备注", required: true }])
    : [];
  openModal(`
    <p class="eyebrow">CREATE ORDER</p>
    <h2 id="modalTitle">购买 ${escapeHtml(product.name)}</h2>
    <p class="lead">${escapeHtml(product.description)}</p>
    <div class="stats-grid" style="grid-template-columns: repeat(3, minmax(0, 1fr)); margin:18px 0;">
      <article class="stat-card"><span>原价</span><strong>${money(product.price)}</strong></article>
      <article class="stat-card"><span>手气折扣</span><strong data-lottery-result>${escapeHtml(formatLotteryResultText(selectedLottery, lotteryEnabled))}</strong></article>
      <article class="stat-card"><span>支付方式</span><strong>${escapeHtml(paymentModeLabel(product.paymentMode))}</strong></article>
    </div>
    ${renderBuyLotteryPanel(lotteryStatus, selectedLottery)}
    ${renderBuyAutoCouponPanel(autoCouponStatus, product)}
    <form class="form-grid" id="buyForm">
      <label>优惠码<input name="couponCode" placeholder="可选，例如 WELCOME10"></label>
      ${fields.map(renderUserInfoInput).join("")}
      <button class="btn btn-primary" type="submit" data-buy-submit ${lotteryEnabled && !selectedLottery ? "disabled" : ""}>${isTestPayment ? "测试支付并下单" : "确认下单"}</button>
    </form>
  `);
  qs("[data-lottery-draw]")?.addEventListener("click", async (event) => {
    const button = event.currentTarget;
    button.disabled = true;
    button.textContent = "抽取中...";
    try {
      const data = await apiJson("/api/mall/lottery/draw", {
        method: "POST",
        body: JSON.stringify({ productId: product.id })
      });
      selectedLottery = data.lottery || { label: "谢谢参与", value: 1, reused: true };
      const result = qs("[data-lottery-result]");
      if (result) result.textContent = formatLotteryResultText(selectedLottery, true);
      const card = qs("[data-lottery-current]");
      if (card) {
        card.innerHTML = renderLotteryCurrentHtml(selectedLottery, lotteryStatus);
        card.classList.add("has-result");
      }
      qs("[data-buy-submit]")?.removeAttribute("disabled");
      button.textContent = lotteryDrawDoneLabel(lotteryStatus);
      showToast(`抽奖结果：${selectedLottery.label}`);
    } catch (error) {
      button.disabled = false;
      button.textContent = "手动抽取";
      showToast(error.message || "抽奖失败", "error");
    }
  });
  qs("#buyForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (lotteryEnabled && !selectedLottery) {
      showToast(lotteryRequiredText(lotteryStatus), "error");
      return;
    }
    const form = new FormData(event.currentTarget);
    const userInfo = {};
    for (const [key, value] of form.entries()) {
      if (key.startsWith("info:")) {
        userInfo[key.slice(5)] = value;
      }
    }
    try {
      const data = await apiJson("/api/mall/orders", {
        method: "POST",
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          couponCode: form.get("couponCode"),
          userInfo
        })
      });
      if (data.payment?.submitUrl && data.payment?.fields) {
        redirectToCreditPayment(data.payment);
        return;
      }
      state.orders.unshift(data.order);
      refreshMinesweeperActivity().catch(() => {});
      const target = state.products.find((item) => item.id === product.id);
      if (target && !isFixedLinkProduct(target)) target.stock = Math.max(0, target.stock - 1);
      closeModal();
      renderHome();
      showToast(isTestPayment ? "测试支付已模拟成功" : "订单已创建");
      navigate("/orders");
    } catch (error) {
      showToast(error.message, "error");
    }
  });
}

async function getProductAutoCoupons(product) {
  try {
    return await apiJson(`/api/mall/coupons/available?productId=${encodeURIComponent(product.id)}&_=${Date.now()}`, { cache: "no-store" });
  } catch {
    return {
      campaign: state.minesweeperActivity?.campaign || null,
      userCoupons: getActiveMinesweeperCoupons(product)
    };
  }
}

async function refreshMinesweeperActivity() {
  if (!state.user) return null;
  const data = await apiJson(`/api/mall/coupons/available?_=${Date.now()}`, { cache: "no-store" });
  state.minesweeperActivity = {
    campaign: data.campaign || state.minesweeperActivity?.campaign || null,
    userCoupons: data.userCoupons || []
  };
  return state.minesweeperActivity;
}

function renderBuyAutoCouponPanel(status = {}, product = {}) {
  const coupons = (status.userCoupons || getActiveMinesweeperCoupons(product)).filter((coupon) => coupon.status === "active");
  const campaign = status.campaign || state.minesweeperActivity?.campaign || {};
  const preview = previewUserCouponDiscount(product.price || 0, coupons);
  const rewards = campaignRewardSentence(campaign);
  if (!coupons.length) {
    return `
      <section class="auto-coupon-panel is-empty">
        <div>
          <strong>活动自动券</strong>
          <p>活动期 ${escapeHtml(formatDate(campaign.startAt))} - ${escapeHtml(formatDate(campaign.endsAt))}，首通自动券：${escapeHtml(rewards.percentText)}；第一名赏金：${rewards.fixedText}。</p>
        </div>
        <a class="btn btn-small btn-ghost" href="/games/minesweeper/">查看活动</a>
      </section>
    `;
  }
  return `
    <section class="auto-coupon-panel">
      <div class="auto-coupon-head">
        <div>
          <strong>已自动使用活动券</strong>
          <p>预计抵扣 ${money(preview.total)}，实际金额以后端下单结果为准。</p>
        </div>
        <span class="badge badge-success">${coupons.length} 张可叠加</span>
      </div>
      <div class="auto-coupon-list">
        ${preview.items.map((item) => `
          <span class="auto-coupon-chip">
            <strong>${escapeHtml(item.label || item.code)}</strong>
            <small>${formatUserCouponValue(item)} · 预计 -${renderMoney(item.preview || 0)} · ${escapeHtml(formatDate(item.expiresAt))} 过期</small>
          </span>
        `).join("")}
      </div>
    </section>
  `;
}

function getActiveMinesweeperCoupons(product = {}) {
  const now = Date.now();
  return (state.minesweeperActivity?.userCoupons || [])
    .filter((coupon) => coupon.status === "active")
    .filter((coupon) => !coupon.productId || coupon.productId === product.id)
    .filter((coupon) => !coupon.expiresAt || parseAppDate(coupon.expiresAt).getTime() > now)
    .sort((left, right) => (left.type === "percent" ? 0 : 1) - (right.type === "percent" ? 0 : 1) || Number(right.value || 0) - Number(left.value || 0));
}

function previewUserCouponDiscount(amount, coupons = []) {
  let remaining = Math.max(0, Number(amount || 0));
  const items = [];
  for (const coupon of coupons) {
    const value = Number(coupon.value || 0);
    const preview = coupon.type === "percent"
      ? Math.min(remaining, Math.floor(remaining * Math.max(0, Math.min(100, value)) / 100))
      : Math.min(remaining, Math.max(0, Math.round(value)));
    if (preview <= 0) continue;
    remaining -= preview;
    items.push({ ...coupon, preview });
  }
  return { total: Math.max(0, Number(amount || 0) - remaining), items };
}

function formatUserCouponValue(coupon) {
  return coupon.type === "percent" ? `${Number(coupon.value || 0)}%` : renderMoney(coupon.value || 0);
}

async function getProductLotteryStatus(product) {
  if (state.settings?.luckyDraw?.enabled === false) {
    return { enabled: false, prizes: [], lottery: null };
  }
  try {
    return await apiJson(`/api/mall/lottery/draw?productId=${encodeURIComponent(product.id)}&_=${Date.now()}`, { cache: "no-store" });
  } catch (error) {
    showToast(error.message || "抽奖配置读取失败", "error");
    return { enabled: false, prizes: [], lottery: null };
  }
}

function renderBuyLotteryPanel(status = {}, selectedLottery = null) {
  if (status.enabled === false) {
    return `<section class="lottery-draw-panel"><div class="empty-state">抽奖已关闭，按原价下单。</div></section>`;
  }
  const prizes = normalizePrizeList(status.prizes || []);
  const totalWeight = prizes.reduce((sum, item) => sum + Number(item.weight || 0), 0);
  return `
    <section class="lottery-draw-panel">
      <div class="lottery-draw-head">
        <div>
          <strong>手动抽奖</strong>
          <small>${escapeHtml(lotteryRestrictionText(status))}</small>
        </div>
        <button class="btn btn-primary" type="button" data-lottery-draw ${selectedLottery ? "disabled" : ""}>${selectedLottery ? lotteryDrawDoneLabel(status) : "手动抽取"}</button>
      </div>
      <div class="lottery-current" data-lottery-current>
        ${renderLotteryCurrentHtml(selectedLottery, status)}
      </div>
      <div class="lottery-prize-list">
        ${prizes.map((prize) => `
          <div class="lottery-prize-item">
            <span style="--prize-color:${escapeAttr(prize.color)}"></span>
            <strong>${escapeHtml(prize.label)}</strong>
            <small>${formatDiscountLabel(prize.value)} · ${formatPrizeProbability(totalWeight > 0 ? Number(prize.weight || 0) / totalWeight * 100 : 0)}%</small>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderLotteryCurrentHtml(lottery, status = {}) {
  if (!lottery) {
    return `<span>${escapeHtml(lotteryRequiredText(status))}</span>`;
  }
  const nextAt = lottery.nextAvailableAt || status.nextAvailableAt || "";
  return `<span>抽奖结果</span><strong>${escapeHtml(lottery.label || "谢谢参与")}</strong><small>${formatDiscountLabel(lottery.value)}${Number.isFinite(Number(lottery.probability)) ? ` · 概率 ${formatPrizeProbability(lottery.probability)}%` : ""}${nextAt ? ` · 下次可抽 ${escapeHtml(formatDate(nextAt))}` : ""}</small>`;
}

function formatLotteryResultText(lottery, enabled = true) {
  if (!enabled) return "抽奖已关闭";
  if (!lottery) return "待手动抽取";
  return `${lottery.reused ? "已抽奖" : "本次抽奖"}：${lottery.label || "谢谢参与"}`;
}

function lotteryRestrictionText(status = {}) {
  const scope = status.scope || state.settings?.luckyDraw?.scope || "product_daily";
  const cooldown = Number(status.cooldownMinutes || state.settings?.luckyDraw?.cooldownMinutes || 0);
  if (scope === "global_daily") return "中奖概率按后台配置展示；全站每天只能抽取一次。";
  if (scope === "global_cooldown") return `中奖概率按后台配置展示；全站每 ${cooldown || 0} 分钟可抽取一次。`;
  if (scope === "product_cooldown") return `中奖概率按后台配置展示；每个商品每 ${cooldown || 0} 分钟可抽取一次。`;
  return "中奖概率按后台配置展示；每个商品每天只能抽取一次。";
}

function lotteryRequiredText(status = {}) {
  const scope = status.scope || state.settings?.luckyDraw?.scope || "product_daily";
  if (scope === "global_daily") return "请先点击“手动抽取”获取今日全站折扣。";
  if (scope === "global_cooldown") return "请先点击“手动抽取”获取当前全站折扣。";
  return "请先点击“手动抽取”获取本商品折扣。";
}

function lotteryDrawDoneLabel(status = {}) {
  const scope = status.scope || state.settings?.luckyDraw?.scope || "product_daily";
  return scope.endsWith("_daily") ? "今日已抽取" : "冷却中";
}

function formatDiscountLabel(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "无折扣";
  if (number <= 0) return "免单";
  if (number >= 1) return "无折扣";
  return `${formatPrizeNumber(number * 10)}折`;
}

function formatPrizeProbability(value) {
  return Number(value || 0).toFixed(4).replace(/\.?0+$/, "");
}

function ensureProductPurchasable(product) {
  if (!product || product.status !== "active") {
    showToast("商品已下架，暂时无法购买", "error");
    return false;
  }
  if (isProductSoldOut(product)) {
    showToast("库存不足，暂时无法购买", "error");
    return false;
  }
  return true;
}

function redirectToCreditPayment(payment) {
  const form = document.createElement("form");
  form.method = payment.method || "POST";
  form.action = payment.submitUrl;
  form.style.display = "none";
  Object.entries(payment.fields || {}).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
}

function renderUserInfoInput(field) {
  const label = escapeHtml(field.label || field.name);
  const name = `info:${escapeAttr(field.name)}`;
  const required = field.required ? "required" : "";
  const help = field.description ? `<small>${escapeHtml(field.description)}</small>` : "";
  if (field.type === "textarea") {
    return `<label>${label}<textarea name="${name}" ${required}></textarea>${help}</label>`;
  }
  if (field.type === "select" && Array.isArray(field.options) && field.options.length) {
    return `
      <label>${label}
        <select name="${name}" ${required}>
          <option value="">请选择</option>
          ${field.options.map((option) => `<option value="${escapeAttr(option)}">${escapeHtml(option)}</option>`).join("")}
        </select>
        ${help}
      </label>
    `;
  }
  return `<label>${label}<input name="${name}" ${required}>${help}</label>`;
}

function openRatingModal(order) {
  openModal(`
    <p class="eyebrow">RATING</p>
    <h2 id="modalTitle">评价 ${escapeHtml(order.productName)}</h2>
    <form class="form-grid" id="ratingForm">
      <label>评分
        <select name="rating">
          <option value="5">5 星</option>
          <option value="4">4 星</option>
          <option value="3">3 星</option>
          <option value="2">2 星</option>
          <option value="1">1 星</option>
        </select>
      </label>
      <label>评价内容<textarea name="comment" placeholder="分享你的使用感受"></textarea></label>
      <button class="btn btn-primary" type="submit">提交评价</button>
    </form>
  `);
  qs("#ratingForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await apiJson(`/api/mall/orders/${order.id}/rating`, {
        method: "POST",
        body: JSON.stringify({
          rating: form.get("rating"),
          comment: form.get("comment")
        })
      });
      order.rated = true;
      closeModal();
      renderOrders();
      showToast("评价已提交");
    } catch (error) {
      showToast(error.message, "error");
    }
  });
}

async function refreshOrders() {
  try {
    const data = await apiJson(`/api/mall/orders?_=${Date.now()}`, { cache: "no-store" });
    state.orders = data.orders || [];
    renderOrders();
    renderHome();
    showToast("订单已刷新");
  } catch (error) {
    if (String(error.message || "").includes("维护")) {
      renderMaintenanceHome();
      showView("home");
      return;
    }
    showToast(error.message, "error");
  }
}

async function updateOrder(orderId, payload) {
  if (!confirm("确认执行该订单操作？")) return;
  try {
    const data = await apiJson(`/api/mall/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
    state.orders = state.orders.map((item) => item.id === orderId ? data.order : item).filter((item) => !item.archived);
    renderOrders();
    renderHome();
    showToast("订单已更新");
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function continuePayOrder(orderId) {
  try {
    const data = await apiJson(`/api/mall/orders/${orderId}/pay`, {
      method: "POST",
      body: JSON.stringify({})
    });
    if (data.payment?.submitUrl && data.payment?.fields) {
      redirectToCreditPayment(data.payment);
      return;
    }
    if (data.order) {
      state.orders = state.orders.map((item) => item.id === orderId ? data.order : item);
      renderOrders();
      renderHome();
    }
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function disputeRefundOrder(order) {
  if (!confirm("确认发起争议退款？系统会自动创建订单私聊并通知管理员。")) return;
  try {
    await apiJson(`/api/mall/orders/${order.id}/dispute`, {
      method: "POST",
      body: JSON.stringify({ reason: `我对订单「${order.productName}」发起争议退款申请。` })
    });
    showToast("已发起争议退款，请在私聊中继续沟通");
    await refreshOrders();
    navigate("/chat");
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function deleteOrder(orderId) {
  if (!confirm("确认删除这条订单？")) return;
  try {
    await apiJson(`/api/mall/orders/${orderId}`, { method: "DELETE" });
    state.orders = state.orders.filter((item) => item.id !== orderId);
    renderOrders();
    renderHome();
    showToast("订单已删除");
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function renderAdmin() {
  views.admin.innerHTML = `
    <div class="section-head">
      <div>
        <p class="eyebrow">ADMIN</p>
        <h2>商城后台</h2>
      </div>
      <button class="btn btn-ghost" type="button" data-admin-refresh ${state.currentAdminTab === "chat" ? "hidden" : ""}>刷新后台</button>
    </div>
    <section class="admin-layout">
      <nav class="admin-tabs" id="adminTabs"></nav>
      <div class="admin-content" id="adminContent"><div class="empty-state">正在读取后台数据...</div></div>
    </section>
  `;
  qs("[data-admin-refresh]", views.admin).addEventListener("click", () => renderAdmin(true));
  const data = await apiJson(`/api/mall/admin/overview?limit=all&_=${Date.now()}`, { cache: "no-store" });
  state.admin = data;
  state.admin.products = (state.admin.products || []).map((product) => ({
    paymentMode: "credit",
    ...product
  }));
  renderAdminTabs();
  renderAdminTab();
}

function renderAdminTabs() {
  if (state.currentAdminTab === "overview") {
    state.currentAdminTab = "dashboard";
  }
  const adminUnreadChats = getAdminUnreadChatCount();
  const groups = [
    ["总览", [
      ["dashboard", "仪表盘"]
    ]],
    ["交易中心", [
      ["orders", "订单管理"],
      ["chat", "私聊消息"],
      ["feedback", "Bug 反馈"]
    ]],
    ["商品资产", [
      ["products", "商品管理"],
      ["cards", "卡密管理"],
      ["coupons", "优惠码"],
      ["ratings", "评价管理"]
    ]],
    ["内容运营", [
      ["ads", "广告推荐"],
      ["announcementSettings", "公告配置"],
      ["lotterySettings", "抽奖配置"],
      ["markdownGuides", "Markdown 用法"]
    ]],
    ["通知配置", [
      ["pushSettings", "推送配置"],
      ["emailSettings", "邮箱配置"],
      ["emailTemplates", "邮件模板"]
    ]],
    ["系统设置", [
      ["settings", "站点基础"],
      ["users", "用户管理"],
      ["backupSettings", "备份功能"]
    ]],
    ["风控限制", [
      ["rateLimits", "限制设置"],
      ["blacklist", "风控黑名单"],
      ["loginAttempts", "登录记录"]
    ]],
    ["娱乐活动", [
      ["minesweeper", "扫雷活动"]
    ]]
  ];
  const root = qs("#adminTabs");
  root.innerHTML = "";
  for (const [groupLabel, tabs] of groups) {
    const group = document.createElement("div");
    group.className = "admin-tab-group";
    group.innerHTML = `<span>${escapeHtml(groupLabel)}</span>`;
    for (const [key, label] of tabs) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "admin-tab";
      button.classList.toggle("is-active", state.currentAdminTab === key);
      button.innerHTML = `
        <span>${escapeHtml(label)}</span>
        ${key === "chat" && adminUnreadChats ? `<em class="admin-tab-badge">${formatUnreadCount(adminUnreadChats)}</em>` : ""}
      `;
      button.addEventListener("click", () => {
        state.currentAdminTab = key;
        state.selected.clear();
        renderAdminTabs();
        renderAdminTab();
      });
      group.appendChild(button);
    }
    root.appendChild(group);
  }
}

function renderAdminTab() {
  const tab = state.currentAdminTab;
  const root = qs("#adminContent");
  const refreshButton = qs("[data-admin-refresh]", views.admin);
  if (refreshButton) refreshButton.hidden = tab === "chat";
  if (tab === "overview" || tab === "dashboard") return renderAdminDashboard(root);
  if (tab === "products") return renderAdminProducts(root);
  if (tab === "orders") return renderAdminOrders(root);
  if (tab === "chat") return renderAdminChat(root);
  if (tab === "feedback") return renderAdminFeedback(root);
  if (tab === "cards") return renderAdminCards(root);
  if (tab === "coupons") return renderAdminCoupons(root);
  if (tab === "ratings") return renderAdminRatings(root);
  if (tab === "ads") return renderAdminAds(root);
  if (tab === "emailTemplates") return renderAdminEmailTemplates(root);
  if (tab === "minesweeper") return renderAdminMinesweeper(root);
  if (tab === "users") return renderAdminUsers(root);
  if (tab === "rateLimits") return renderAdminRateLimits(root);
  if (tab === "blacklist") return renderAdminBlacklist(root);
  if (tab === "settings") return renderAdminSettings(root);
  if (tab === "announcementSettings") return renderAdminAnnouncementSettings(root);
  if (tab === "lotterySettings") return renderAdminLotterySettings(root);
  if (tab === "markdownGuides") return renderAdminMarkdownGuides(root);
  if (tab === "pushSettings") return renderAdminPushSettings(root);
  if (tab === "emailSettings") return renderAdminEmailSettings(root);
  if (tab === "backupSettings") return renderAdminBackupSettings(root);
  if (tab === "loginAttempts") return renderAdminLoginAttempts(root);
}

function renderAdminInsightStrip() {
  const products = state.admin.products || [];
  const lowStock = products.filter((product) => productAdminState(product) === "active" && !isFixedLinkProduct(product) && product.stock <= (product.stockThreshold || 5));
  const failedLogins = (state.admin.loginAttempts || []).filter((item) => !item.success).length;
  return `
    <div class="admin-insight-strip">
      <article><span>低库存预警</span><strong>${lowStock.length}</strong></article>
      <article><span>黑名单规则</span><strong>${(state.admin.blacklist || []).length}</strong></article>
      <article><span>邮件模板</span><strong>${(state.admin.emailTemplates || []).length}</strong></article>
      <article><span>失败登录记录</span><strong>${failedLogins}</strong></article>
    </div>
  `;
}

function renderAdminDashboard(root) {
  const admin = state.admin.admin || {};
  const site = state.admin.settings?.siteInfo || {};
  const products = state.admin.products || [];
  const orders = state.admin.recentOrders || [];
  const cards = state.admin.cards || [];
  const conversations = state.admin.chatConversations || [];
  const backupRecords = state.admin.backupRecords || [];
  const loginAttempts = state.admin.loginAttempts || [];
  const s = state.admin.stats || {};
  const productCounts = s.productStatusCounts || countBy(products.map(productAdminState));
  const orderCounts = s.orderStatusCounts || countBy(orders.map((order) => order.status));
  const cardCounts = s.cardStatusCounts || countBy(cards.map((card) => card.status));
  const feedbackCounts = s.feedbackStatusCounts || countBy((state.admin.feedback || []).map((item) => item.status));
  const productRevenue = Array.isArray(s.productRevenue) ? s.productRevenue : [];
  const failedLogins = loginAttempts.filter((item) => !item.success).length;
  const openChats = Number(s.openChats ?? conversations.filter((item) => item.status !== "closed").length);
  const unreadChats = Number(s.unreadChats ?? conversations.filter((item) => Number(item.unreadAdmin || 0) > 0).length);
  const lowStock = products
    .filter((product) => productAdminState(product) === "active" && !isFixedLinkProduct(product) && Number(product.stock || 0) <= Number(product.stockThreshold || 5))
    .sort((left, right) => Number(left.stock || 0) - Number(right.stock || 0))
    .slice(0, 6);
  const lastBackup = backupRecords[0] || null;

  root.innerHTML = `
    <section class="dashboard-hero admin-card">
      <div>
        <p class="eyebrow">DASHBOARD</p>
        <h3>系统仪表盘</h3>
        <p class="muted">进入后台后默认显示商城、订单、库存、私聊和系统配置的基本情况。</p>
      </div>
      <div class="dashboard-status">
        <span class="badge ${site.siteActive === false ? "badge-danger" : "badge-success"}">${site.siteActive === false ? "维护中" : "正常营业"}</span>
        <span>${formatDate(new Date().toISOString())}</span>
      </div>
    </section>

    <div class="admin-grid">
      ${adminStat("用户", s.users)}
      ${adminStat("商品", s.products)}
      ${adminStat("订单", s.orders)}
        ${adminStat("成交额", renderMoney(s.revenue))}
      ${adminStat("可用卡密", s.cards)}
      ${adminStat("优惠码", s.coupons)}
      ${adminStat("评价", s.ratings)}
      ${adminStat("待处理", Number(orderCounts.pending || 0) + Number(orderCounts.processing || 0))}
      ${adminStat("待审反馈", feedbackCounts.pending || 0)}
      ${adminStat("已发金额", renderMoney(s.ldcIssued || 0))}
    </div>

    <div class="dashboard-grid">
      <section class="admin-card">
        <h3>系统基本信息</h3>
        ${smallMetricList([
          { label: "站点名称", value: site.title || "Linuxdo Mall" },
          { label: "站点副标题", value: site.subtitle || "-" },
          { label: "货币显示", value: site.currencyMode === "image" ? "图片" : (site.currencySymbol || "L") },
          { label: "管理员", value: admin.username || "-" },
          { label: "Linux.do ID", value: admin.linuxdoId || "-" }
        ])}
      </section>
      <section class="admin-card">
        <h3>业务状态</h3>
        ${smallMetricList([
          { label: "在售商品", value: Number(productCounts.active || 0) },
          { label: "售罄商品", value: Number(productCounts.soldout || 0) },
          { label: "下架商品", value: Number(productCounts.inactive || 0) },
          { label: "已删除商品", value: Number(productCounts.deleted || 0) },
          { label: "可用卡密", value: Number(cardCounts.unused || 0) + Number(cardCounts.scheduled || 0) }
        ])}
      </section>
      <section class="admin-card">
        <h3>待处理事项</h3>
        ${smallMetricList([
          { label: "待处理订单", value: Number(orderCounts.pending || 0) },
          { label: "处理中订单", value: Number(orderCounts.processing || 0) },
          { label: "开启私聊", value: openChats },
          { label: "未读私聊", value: unreadChats },
          { label: "失败登录记录", value: failedLogins }
        ])}
      </section>
      <section class="admin-card">
        <h3>配置概况</h3>
        ${smallMetricList([
          { label: "广告推荐", value: (state.admin.ads || []).length },
          { label: "黑名单规则", value: (state.admin.blacklist || []).length },
          { label: "邮件模板", value: (state.admin.emailTemplates || []).length },
          { label: "备份记录", value: backupRecords.length },
          { label: "最近备份", value: lastBackup ? formatDate(lastBackup.createdAt) : "暂无" }
        ])}
      </section>
      <section class="admin-card">
        <h3>商品成交额</h3>
        ${productRevenue.length ? smallMetricList(productRevenue.map((item) => ({
          label: `${item.productName} · ${Number(item.orderCount || 0)} 单`,
          value: renderMoney(item.amount || 0),
          valueHtml: true
        }))) : `<div class="empty-state">暂无购买成功数据</div>`}
      </section>
    </div>

    <div class="dashboard-grid wide">
      <section class="admin-card">
        <h3>订单状态</h3>
        ${smallMetricList(["pending", "processing", "completed", "canceled", "expired", "refunded"].map((status) => ({
          label: orderStatusLabel(status),
          value: Number(orderCounts[status] || 0)
        })))}
      </section>
      <section class="admin-card">
        <h3>库存预警</h3>
        ${lowStock.length ? smallMetricList(lowStock.map((product) => ({
          label: product.name,
          value: `${Number(product.stock || 0)} / 阈值 ${Number(product.stockThreshold || 5)}`
        }))) : `<div class="empty-state">当前没有低库存商品</div>`}
      </section>
    </div>

    <div class="admin-card">
      <h3>最近订单</h3>
      ${adminOrdersTable(orders.slice(0, 10))}
    </div>
  `;
  bindAdminOrderActions(root);
}

function renderAdminProducts(root) {
  const status = state.currentProductStatus || "active";
  const filtered = (state.admin.products || []).filter((product) => status === "all" || productAdminState(product) === status);
  const pageInfo = paginateAdminItems("products", filtered);
  const products = pageInfo.items;
  root.innerHTML = `
    <div class="batch-bar">
      <div>
        <h3>商品管理</h3>
        <p class="muted">移植原版发布、上下架、售罄、删除和批量处理流程；删除会进入“删除的商品”。</p>
      </div>
      <div class="row-actions compact">
        <button class="btn btn-ghost" type="button" data-batch-product-status="active">批量上架</button>
        <button class="btn btn-ghost" type="button" data-batch-product-status="inactive">批量下架</button>
        <button class="btn btn-danger" type="button" data-batch-product-delete>批量删除</button>
        <button class="btn btn-primary" type="button" data-new-product>发布新项目</button>
      </div>
    </div>
    <div class="admin-filter-strip">
      ${adminProductStatusFilterButton("all", "全部商品")}
      ${adminProductStatusFilterButton("active", "在售商品")}
      ${adminProductStatusFilterButton("soldout", "已售罄")}
      ${adminProductStatusFilterButton("inactive", "下架商品")}
      ${adminProductStatusFilterButton("deleted", "删除的商品")}
    </div>
    <div class="admin-card">
      ${renderAdminPager("products", pageInfo)}
      ${products.length ? `
        <table class="admin-table">
          <thead><tr><th>${renderSelectAllHeader("products")}</th><th>预览</th><th>商品</th><th>分类</th><th>价格</th><th>库存</th><th>支付</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>${products.map((p) => `
          <tr>
            <td><input type="checkbox" data-product-check value="${escapeAttr(p.id)}" ${state.selected.has(p.id) ? "checked" : ""}></td>
            <td><div class="admin-thumb">${renderProductImage(p)}</div></td>
            <td><strong>${escapeHtml(p.name)}</strong><br><span class="muted">${escapeHtml(p.id)}</span></td>
            <td>${categoryLabel(p.category)}</td>
            <td>${renderMoney(p.price)}</td>
            <td><strong>${productStockLabel(p)}</strong><br><span class="muted">预警 ${p.stockThreshold || 5} / 限购 ${p.limitPerUser || "不限"}</span></td>
            <td><span class="badge ${p.paymentMode === "test" ? "badge-warning" : ""}">${paymentModeLabel(p.paymentMode)}</span></td>
            <td><span class="badge ${productStatusClass(productAdminState(p))}">${productStatusLabel(productAdminState(p))}</span></td>
            <td>
              <button class="btn btn-small btn-ghost" data-edit-product="${escapeAttr(p.id)}">编辑</button>
              ${canReplenishProduct(p) ? `<button class="btn btn-small btn-ghost" data-import-product-cards="${escapeAttr(p.id)}">补货</button>` : ""}
              ${p.status === "active"
                ? `<button class="btn btn-small btn-ghost" data-status-product="${escapeAttr(p.id)}" data-status-value="inactive">下架</button>`
                : `<button class="btn btn-small btn-primary" data-status-product="${escapeAttr(p.id)}" data-status-value="active">${p.status === "deleted" ? "恢复上架" : "上架"}</button>`}
              <button class="btn btn-small btn-danger" data-delete-product="${escapeAttr(p.id)}">删除</button>
            </td>
          </tr>
          `).join("")}</tbody>
        </table>
      ` : `<div class="empty-state">暂无${productStatusGroupLabel(status)}</div>`}
    </div>
  `;
  qsa("[data-product-check]", root).forEach((item) => item.addEventListener("change", toggleSelected));
  bindSelectAll(root, "products", "[data-product-check]");
  bindAdminPager(root, "products", renderAdminProducts);
  qs("[data-new-product]", root).addEventListener("click", () => openProductEditor());
  qsa("[data-batch-product-status]", root).forEach((button) => button.addEventListener("click", () => adminBatchProductStatus(button.dataset.batchProductStatus)));
  qs("[data-batch-product-delete]", root)?.addEventListener("click", openProductBatchDeleteModal);
  qsa("[data-product-status-filter]", root).forEach((button) => {
    button.addEventListener("click", () => {
      state.currentProductStatus = button.dataset.productStatusFilter;
      state.selected.clear();
      renderAdminProducts(root);
    });
  });
  qsa("[data-edit-product]", root).forEach((button) => button.addEventListener("click", () => {
    openProductEditor(state.admin.products.find((item) => item.id === button.dataset.editProduct));
  }));
  qsa("[data-status-product]", root).forEach((button) => button.addEventListener("click", () => {
    adminSetProductStatus(button.dataset.statusProduct, button.dataset.statusValue);
  }));
  qsa("[data-import-product-cards]", root).forEach((button) => button.addEventListener("click", () => openCardImporter(button.dataset.importProductCards)));
  qsa("[data-delete-product]", root).forEach((button) => button.addEventListener("click", () => openProductDeleteModal(button.dataset.deleteProduct)));
}

function adminSimpleFilterButton(scope, value, label, count, currentValue) {
  const active = (currentValue || "all") === value;
  return `
    <button class="filter-button ${active ? "is-active" : ""}" type="button" data-${scope}-filter="${escapeAttr(value)}">
      <span>${escapeHtml(label)}</span><strong>${count}</strong>
    </button>
  `;
}

function openProductDeleteModal(productId) {
  const product = (state.admin.products || []).find((item) => item.id === productId);
  if (!product) {
    showToast("商品不存在", "error");
    return;
  }
  const alreadyDeleted = productAdminState(product) === "deleted";
  openModal(`
    <p class="eyebrow">DELETE PRODUCT</p>
    <h2 id="modalTitle">删除商品</h2>
    <div class="danger-zone">
      <strong>${escapeHtml(product.name)}</strong>
      <p>${alreadyDeleted
        ? "该商品已经在删除列表中，再次删除会直接从 D1 彻底删除。关联卡密、优惠码、评价和抽奖记录也会删除，无法恢复。"
        : "临时删除会把商品移入“删除的商品”，可恢复上架；彻底删除会从 D1 删除商品以及关联卡密、优惠码、评价和抽奖记录。"}
      </p>
    </div>
    <div class="row-actions">
      ${alreadyDeleted ? "" : `<button class="btn btn-ghost" type="button" data-product-delete-mode="soft">临时删除</button>`}
      <button class="btn btn-danger" type="button" data-product-delete-mode="hard">彻底删除</button>
    </div>
  `);
  qsa("[data-product-delete-mode]", modalContent).forEach((button) => {
    button.addEventListener("click", async () => {
      const mode = button.dataset.productDeleteMode;
      const message = mode === "hard"
        ? "确认从 D1 彻底删除该商品？关联卡密、优惠码、评价和抽奖记录也会删除，无法恢复。"
        : "确认临时删除该商品？";
      if (!confirm(message)) return;
      try {
        await apiJson(`/api/mall/admin/products/${productId}`, {
          method: "DELETE",
          body: JSON.stringify({ mode })
        });
        closeModal();
        showToast(mode === "hard" ? "商品已彻底删除" : "商品已移入删除列表");
        await renderAdmin(true);
      } catch (error) {
        showToast(error.message, "error");
      }
    });
  });
}

function openProductBatchDeleteModal() {
  const productMap = new Map((state.admin.products || []).map((product) => [product.id, product]));
  const ids = [...state.selected].filter((id) => productMap.has(id));
  if (!ids.length) {
    showToast("请先选择商品", "error");
    return;
  }
  const alreadyDeletedCount = ids.filter((id) => productAdminState(productMap.get(id)) === "deleted").length;
  const normalCount = ids.length - alreadyDeletedCount;
  const softDeleteButton = normalCount > 0
    ? `<button class="btn btn-ghost" type="button" data-product-batch-delete-mode="soft">临时删除</button>`
    : "";
  openModal(`
    <p class="eyebrow">BATCH DELETE</p>
    <h2 id="modalTitle">批量删除商品</h2>
    <div class="danger-zone">
      <strong>已选择 ${ids.length} 个商品</strong>
      <p>${normalCount > 0
        ? `其中 ${normalCount} 个可临时删除，${alreadyDeletedCount} 个已经在删除列表中。选择“临时删除”时，已在删除列表中的商品会直接彻底删除。`
        : "选中的商品都已经在删除列表中，再次删除会直接彻底删除。"}
      </p>
      <p>彻底删除会从 D1 删除商品以及关联卡密、优惠码、评价和抽奖记录，无法恢复。</p>
    </div>
    <div class="row-actions">
      ${softDeleteButton}
      <button class="btn btn-danger" type="button" data-product-batch-delete-mode="hard">彻底删除</button>
    </div>
  `);
  qsa("[data-product-batch-delete-mode]", modalContent).forEach((button) => {
    button.addEventListener("click", async () => {
      const mode = button.dataset.productBatchDeleteMode;
      const message = mode === "hard"
        ? `确认从 D1 彻底删除选中的 ${ids.length} 个商品？关联数据也会删除，无法恢复。`
        : alreadyDeletedCount > 0
          ? `确认批量临时删除选中的 ${ids.length} 个商品？已在删除列表中的 ${alreadyDeletedCount} 个商品会直接彻底删除。`
          : `确认批量临时删除选中的 ${ids.length} 个商品？`;
      if (!confirm(message)) return;
      try {
        const result = await apiJson("/api/mall/admin/products", {
          method: "DELETE",
          body: JSON.stringify({ ids, mode })
        });
        closeModal();
        state.selected.clear();
        const hardDeleted = Number(result.hardDeleted || 0);
        const softDeleted = Number(result.softDeleted || 0);
        showToast(`批量删除完成：临时删除 ${softDeleted} 个，彻底删除 ${hardDeleted} 个`);
        await renderAdmin(true);
      } catch (error) {
        showToast(error.message, "error");
      }
    });
  });
}

function adminProductSelectFilter(scope, currentValue = "all") {
  const products = state.admin?.products || [];
  return `
    <label class="admin-product-filter">商品
      <select data-${scope}-product-filter>
        <option value="all" ${currentValue === "all" ? "selected" : ""}>全部商品</option>
        ${products.map((product) => `<option value="${escapeAttr(product.id)}" ${currentValue === product.id ? "selected" : ""}>${escapeHtml(product.name)}</option>`).join("")}
      </select>
    </label>
  `;
}

function filterByAdminProduct(items, getter, productId = state.adminProductFilter || "all") {
  if (!productId || productId === "all") return items;
  return items.filter((item) => getter(item) === productId);
}

function paginateAdminItems(scope, items) {
  const size = state.adminPageSize || 20;
  if (size === "all") {
    return { items, page: 1, pages: 1, total: items.length, start: items.length ? 1 : 0, end: items.length };
  }
  const pageSize = Number(size || 20);
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(Math.max(1, Number(state.adminPages[scope] || 1)), pages);
  state.adminPages[scope] = page;
  const startIndex = (page - 1) * pageSize;
  return {
    items: items.slice(startIndex, startIndex + pageSize),
    page,
    pages,
    total: items.length,
    start: items.length ? startIndex + 1 : 0,
    end: Math.min(items.length, startIndex + pageSize)
  };
}

function renderAdminPager(scope, pageInfo) {
  const loadedLimit = Number(state.admin?.dataLimits?.listLimit || 0);
  const maxLimit = Number(state.admin?.dataLimits?.maxListLimit || 0);
  const limitHint = loadedLimit && maxLimit && pageInfo.total >= loadedLimit
    ? `<small>已加载前 ${loadedLimit} 条，更多数据请使用备份导出</small>`
    : "";
  return `
    <div class="admin-pager" data-admin-pager="${escapeAttr(scope)}">
      <label>每页
        <select data-admin-page-size>
          ${ADMIN_PAGE_SIZE_OPTIONS.map((option) => `<option value="${option}" ${String(state.adminPageSize) === String(option) ? "selected" : ""}>${option === "all" ? "全部" : option}</option>`).join("")}
        </select>
      </label>
      <span>${pageInfo.start}-${pageInfo.end} / ${pageInfo.total}</span>
      <button class="btn btn-small btn-ghost" type="button" data-admin-page-prev ${pageInfo.page <= 1 ? "disabled" : ""}>上一页</button>
      <strong>${pageInfo.page} / ${pageInfo.pages}</strong>
      <button class="btn btn-small btn-ghost" type="button" data-admin-page-next ${pageInfo.page >= pageInfo.pages ? "disabled" : ""}>下一页</button>
      ${limitHint}
    </div>
  `;
}

function bindAdminPager(root, scope, renderFn) {
  qs("[data-admin-page-size]", root)?.addEventListener("change", (event) => {
    const value = event.currentTarget.value;
    state.adminPageSize = value === "all" ? "all" : Number(value);
    state.adminPages[scope] = 1;
    state.selected.clear();
    renderFn(root);
  });
  qs("[data-admin-page-prev]", root)?.addEventListener("click", () => {
    state.adminPages[scope] = Math.max(1, Number(state.adminPages[scope] || 1) - 1);
    state.selected.clear();
    renderFn(root);
  });
  qs("[data-admin-page-next]", root)?.addEventListener("click", () => {
    state.adminPages[scope] = Number(state.adminPages[scope] || 1) + 1;
    state.selected.clear();
    renderFn(root);
  });
}

function renderSelectAllHeader(scope) {
  return `<input type="checkbox" data-select-all="${escapeAttr(scope)}" aria-label="全选当前页">`;
}

function bindSelectAll(root, scope, checkboxSelector) {
  const all = qs(`[data-select-all="${scope}"]`, root);
  const boxes = qsa(checkboxSelector, root);
  if (!all) return;
  all.checked = boxes.length > 0 && boxes.every((box) => state.selected.has(box.value));
  all.indeterminate = boxes.some((box) => state.selected.has(box.value)) && !all.checked;
  all.addEventListener("change", () => {
    boxes.forEach((box) => {
      box.checked = all.checked;
      if (all.checked) state.selected.add(box.value);
      else state.selected.delete(box.value);
    });
  });
}

function bindProductFilter(root, scope, renderFn) {
  qs(`[data-${scope}-product-filter]`, root)?.addEventListener("change", (event) => {
    state.adminProductFilter = event.currentTarget.value;
    state.adminPages[scope] = 1;
    state.selected.clear();
    renderFn(root);
  });
}

function adminProductStatusFilterButton(status, label) {
  const count = status === "all"
    ? state.admin.products.length
    : state.admin.products.filter((product) => productAdminState(product) === status).length;
  const active = (state.currentProductStatus || "active") === status;
  return `
    <button class="filter-button ${active ? "is-active" : ""}" type="button" data-product-status-filter="${status}">
      <span>${label}</span><strong>${count}</strong>
    </button>
  `;
}

function renderAdminOrders(root) {
  const status = state.currentOrderStatus || "all";
  const filteredByStatus = status === "all" ? state.admin.recentOrders : state.admin.recentOrders.filter((order) => order.status === status);
  const filtered = filterByAdminProduct(filteredByStatus, (order) => order.productId);
  const pageInfo = paginateAdminItems("orders", filtered);
  const orders = pageInfo.items;
  root.innerHTML = `
    <div class="batch-bar">
      <div>
        <h3>订单管理</h3>
        <p class="muted">积分站订单会调用官方接口原路退款；测试支付、免单订单走本地退款处理。</p>
      </div>
      <div class="row-actions compact">
        <button class="btn btn-ghost" type="button" data-export-orders>导出订单 JSON</button>
        <button class="btn btn-danger" type="button" data-batch-delete-orders>批量删除选中订单</button>
      </div>
    </div>
    <div class="admin-filter-strip">
      ${adminSimpleFilterButton("order", "all", "全部订单", state.admin.recentOrders.length, state.currentOrderStatus)}
      ${["pending", "processing", "completed", "canceled", "expired", "refunded"].map((value) => adminSimpleFilterButton("order", value, orderStatusLabel(value), state.admin.recentOrders.filter((order) => order.status === value).length, state.currentOrderStatus)).join("")}
      ${adminProductSelectFilter("order", state.adminProductFilter)}
    </div>
    <div class="admin-card">
      ${renderAdminPager("orders", pageInfo)}
      ${adminOrdersTable(orders, true)}
    </div>
  `;
  qsa("[data-order-filter]", root).forEach((button) => button.addEventListener("click", () => {
    state.currentOrderStatus = button.dataset.orderFilter;
    state.selected.clear();
    renderAdminOrders(root);
  }));
  qsa("[data-order-check]", root).forEach((item) => item.addEventListener("change", toggleSelected));
  bindSelectAll(root, "orders", "[data-order-check]");
  bindProductFilter(root, "order", renderAdminOrders);
  bindAdminPager(root, "orders", renderAdminOrders);
  bindAdminOrderActions(root);
  qs("[data-batch-delete-orders]", root).addEventListener("click", () => adminBatchDelete("/api/mall/admin/orders", "orderIds", "订单"));
  qs("[data-export-orders]", root).addEventListener("click", () => downloadJson("orders", state.admin.recentOrders));
}

function renderAdminChat(root) {
  const conversations = state.admin.chatConversations || [];
  const unreadTotal = getAdminUnreadChatCount();
  const preferredId = state.chat.adminOpenedConversationId ? state.chat.activeConversationId : "";
  const activeId = preferredId && conversations.some((conversation) => conversation.id === preferredId)
    ? preferredId
    : "";
  state.chat.activeConversationId = activeId;
  root.innerHTML = `
    <div class="batch-bar">
      <div>
        <h3>私聊消息</h3>
        <p class="muted">买家咨询集中在右侧会话头部处理，可关闭会话，也可重新开启继续回复。</p>
      </div>
      <div class="admin-unread-summary ${unreadTotal ? "has-unread" : ""}">
        <strong>${formatUnreadCount(unreadTotal)}</strong>
        <span>未读消息</span>
      </div>
    </div>
    <section class="admin-chat-shell">
      <aside class="chat-thread-list">
        ${conversations.length ? conversations.map((conversation) => `
          <button class="chat-thread ${conversation.id === activeId ? "is-active" : ""}" type="button" data-admin-chat-thread="${escapeAttr(conversation.id)}">
            <span>
              <strong>${escapeHtml(conversation.userName || "买家")}</strong>
              <small>${escapeHtml(conversation.subject)}</small>
            </span>
            <span class="chat-thread-meta">
              ${conversation.status === "closed" ? `<i>已关闭</i>` : ""}
              ${conversation.unreadAdmin ? `<em title="管理员未读 ${Number(conversation.unreadAdmin)} 条">未读 ${formatUnreadCount(conversation.unreadAdmin)}</em>` : ""}
            </span>
          </button>
        `).join("") : `<div class="empty-state">暂无私聊</div>`}
      </aside>
      <div class="admin-chat-panel">
        ${activeId ? renderAdminChatPanel(activeId) : `<div class="empty-state">左侧显示所有会话的未读数量，点击会话后才会标记为已读。</div>`}
      </div>
    </section>
  `;
  qsa("[data-admin-chat-thread]", root).forEach((button) => button.addEventListener("click", async () => {
    state.chat.activeConversationId = button.dataset.adminChatThread;
    state.chat.adminOpenedConversationId = true;
    state.chat.messages = [];
    await loadChatMessages(state.chat.activeConversationId);
    renderAdminTabs();
    renderAdminChat(root);
  }));
  qs("[data-admin-chat-form]", root)?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const textarea = form.elements.content;
    const button = qs("button[type='submit']", form);
    button.disabled = true;
    try {
      await sendChatMessage(textarea.value, true, form.elements.imageUrl?.value || "");
      form.reset();
      renderAdminChatMessages(root);
      await refreshAdminChatListOnly();
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      button.disabled = false;
      textarea.focus();
    }
  });
  const adminTextarea = qs("[data-admin-chat-form] textarea", root);
  if (adminTextarea) {
    adminTextarea.addEventListener("keydown", handleChatTextareaKeydown);
  }
  bindMarkdownAssist(root);
  qs("[data-refresh-admin-chat-current]", root)?.addEventListener("click", refreshAdminChat);
  qs("[data-toggle-chat-status]", root)?.addEventListener("click", (event) => {
    setAdminChatStatus(activeId, event.currentTarget.dataset.toggleChatStatus);
  });
  qs("[data-delete-admin-chat]", root)?.addEventListener("click", () => deleteAdminChat(activeId));
  if (activeId) {
    loadChatMessages(activeId).then(() => {
      renderAdminChatMessages(root);
    }).catch((error) => showToast(error.message, "error"));
    startAdminChatPolling();
  }
}

function renderAdminFeedback(root) {
  const limits = getMallLimitsForUi(state.admin?.settings?.limits);
  const allFeedback = state.admin.feedback || [];
  const status = state.currentFeedbackStatus || "pending";
  const filtered = status === "all" ? allFeedback : allFeedback.filter((item) => item.status === status);
  const pageInfo = paginateAdminItems("feedback", filtered);
  const items = pageInfo.items;
  const counts = countBy(allFeedback.map((item) => item.status));
  const activeId = state.currentFeedbackId && filtered.some((item) => item.id === state.currentFeedbackId)
    ? state.currentFeedbackId
    : items[0]?.id || "";
  state.currentFeedbackId = activeId;
  const activeFeedback = allFeedback.find((item) => item.id === activeId) || null;
  const activeLogs = (state.admin.feedbackLogs || []).filter((log) => log.feedbackId === activeId);
  const activeLedger = (state.admin.ldcLedger || []).find((row) => row.sourceType === "feedback" && row.sourceId === activeId) || null;
  const creditDistributed = activeLedger?.externalStatus === "distributed";
  const canReview = activeFeedback?.status === "pending";
  const canResendCredit = activeFeedback?.status === "approved" && activeLedger && !creditDistributed;
  root.innerHTML = `
    <div class="batch-bar feedback-head">
      <div>
        <h3>Bug 反馈审核</h3>
        <p class="muted">草稿可修改，提交审核后锁定内容。审核只能通过或不通过，通过后发放 ${formatRewardRange(limits)}。</p>
      </div>
      <div class="feedback-status-strip">
        ${adminSimpleFilterButton("feedback", "all", "全部", allFeedback.length, status)}
        ${adminSimpleFilterButton("feedback", "draft", "草稿", counts.draft || 0, status)}
        ${adminSimpleFilterButton("feedback", "pending", "待审核", counts.pending || 0, status)}
        ${adminSimpleFilterButton("feedback", "approved", "已通过", counts.approved || 0, status)}
        ${adminSimpleFilterButton("feedback", "rejected", "不通过", counts.rejected || 0, status)}
        ${counts.deleted ? adminSimpleFilterButton("feedback", "deleted", "已删除", counts.deleted || 0, status) : ""}
      </div>
    </div>
    <div class="feedback-admin-layout">
      <aside class="feedback-admin-list admin-card">
        <div class="panel-head">
          <h3>反馈列表</h3>
          <span>${pageInfo.total} 条</span>
        </div>
        ${renderAdminPager("feedback", pageInfo)}
        ${items.length ? `
          <div class="feedback-admin-items">
            ${items.map((item) => `
              <button class="feedback-admin-item ${item.id === activeId ? "is-active" : ""}" type="button" data-open-feedback="${escapeAttr(item.id)}">
                <strong>${escapeHtml(item.title)}</strong>
                <span>${escapeHtml(item.username || "-")} · ${feedbackStatusLabel(item.status)}</span>
                <small>${escapeHtml(item.content.slice(0, 90))}</small>
              </button>
            `).join("")}
          </div>
        ` : `<div class="empty-state">暂无反馈</div>`}
      </aside>
      <section class="feedback-admin-detail">
        ${activeFeedback ? `
          <article class="admin-card feedback-detail-card">
            <div class="feedback-detail-head">
              <div>
                <h3>${escapeHtml(activeFeedback.title)}</h3>
                <p class="muted">${escapeHtml(activeFeedback.username || "-")} · ${feedbackTypeLabel(activeFeedback.type)} · ${formatDate(activeFeedback.createdAt)}</p>
              </div>
              <div class="row-actions compact">
                <button class="btn btn-primary" type="button" data-review-feedback="${escapeAttr(activeFeedback.id)}" ${canReview || canResendCredit ? "" : "disabled"}>${canResendCredit ? "补发金额" : "审核"}</button>
                <button class="btn btn-danger" type="button" data-delete-feedback="${escapeAttr(activeFeedback.id)}" ${activeFeedback.status === "deleted" ? "disabled" : ""}>删除</button>
              </div>
            </div>
            <div class="feedback-review-detail">
              <div class="feedback-detail-body">${renderSafeMarkdown(activeFeedback.content)}</div>
              <div class="feedback-meta">
                <span class="badge ${feedbackStatusClass(activeFeedback.status)}">${feedbackStatusLabel(activeFeedback.status)}</span>
                ${Number(activeFeedback.rewardAmount || 0) > 0 ? `<span class="badge badge-success">+${renderMoney(activeFeedback.rewardAmount)}</span>` : ""}
                ${activeLedger ? `<span class="badge ${creditDistributed ? "badge-success" : "badge-warning"}">${creditDistributed ? "已转发" : "待补发"}</span>` : ""}
              </div>
              ${activeFeedback.adminNote ? `<p class="feedback-note">管理员备注：${escapeHtml(activeFeedback.adminNote)}</p>` : ""}
              <p class="muted">反馈 ID：${escapeHtml(activeFeedback.id)}</p>
            </div>
          </article>
          <article class="admin-card feedback-log-card">
            <div class="panel-head">
              <h3>操作记录</h3>
              <span>${activeLogs.length} 条</span>
            </div>
            ${activeLogs.length ? `
              <div class="feedback-log-list">
                ${activeLogs.map(renderFeedbackLogItem).join("")}
              </div>
            ` : `<div class="empty-state">暂无操作记录</div>`}
          </article>
        ` : `<div class="admin-card empty-state">请选择一个反馈查看详情</div>`}
      </section>
    </div>
  `;
  bindAdminPager(root, "feedback", renderAdminFeedback);
  qsa("[data-feedback-filter]", root).forEach((button) => button.addEventListener("click", () => {
    state.currentFeedbackStatus = button.dataset.feedbackFilter;
    state.adminPages.feedback = 1;
    state.currentFeedbackId = "";
    renderAdminFeedback(root);
  }));
  qsa("[data-open-feedback]", root).forEach((button) => button.addEventListener("click", () => {
    state.currentFeedbackId = button.dataset.openFeedback;
    renderAdminFeedback(root);
  }));
  qsa("[data-review-feedback]", root).forEach((button) => button.addEventListener("click", () => openFeedbackReviewModal(button.dataset.reviewFeedback)));
  qsa("[data-delete-feedback]", root).forEach((button) => button.addEventListener("click", () => adminDeleteFeedback(button.dataset.deleteFeedback)));
}

function renderLdcLedgerTable(rows) {
  if (!rows.length) return `<div class="empty-state">暂无金额发放流水</div>`;
  return `
    <table class="admin-table">
      <thead><tr><th>用户</th><th>数量</th><th>原因</th><th>转发</th><th>来源</th><th>时间</th></tr></thead>
      <tbody>${rows.slice(0, 20).map((row) => `
        <tr>
          <td>${escapeHtml(row.username || row.userId || "-")}</td>
          <td><strong>+${renderMoney(row.amount || 0)}</strong></td>
          <td>${escapeHtml(row.reason || "-")}</td>
          <td>${row.externalStatus === "distributed" ? "已转发" : "本地记录"}</td>
          <td>${escapeHtml(row.sourceType || "-")}</td>
          <td>${formatDate(row.createdAt)}</td>
        </tr>
      `).join("")}</tbody>
    </table>
  `;
}

function renderFeedbackLogItem(log) {
  return `
    <article class="feedback-log-item">
      <div>
        <strong>${feedbackLogActionLabel(log.action)}</strong>
        <span>${escapeHtml(log.actorName || "-")} · ${escapeHtml(log.actorRole || "-")} · ${formatDate(log.createdAt)}</span>
      </div>
      ${log.note ? `<p>${escapeHtml(log.note)}</p>` : ""}
      ${feedbackLogChangeSummary(log)}
    </article>
  `;
}

function feedbackLogChangeSummary(log) {
  const before = log.before || {};
  const after = log.after || {};
  const fields = [
    ["type", "类型", feedbackTypeLabel],
    ["title", "标题"],
    ["content", "内容"],
    ["status", "状态", feedbackStatusLabel],
    ["rewardAmount", "奖励"],
    ["adminNote", "备注"]
  ];
  const changes = fields
    .filter(([key]) => Object.prototype.hasOwnProperty.call(after, key))
    .map(([key, label, formatter]) => {
      const beforeText = formatter ? formatter(before[key]) : String(before[key] ?? "-");
      const afterText = formatter ? formatter(after[key]) : String(after[key] ?? "-");
      if (beforeText === afterText && log.action !== "create") return "";
      return `<span><b>${escapeHtml(label)}</b>：${escapeHtml(shortLogValue(beforeText))} → ${escapeHtml(shortLogValue(afterText))}</span>`;
    })
    .filter(Boolean);
  if (!changes.length) return "";
  return `<div class="feedback-log-changes">${changes.join("")}</div>`;
}

function shortLogValue(value) {
  const text = String(value || "-").replace(/\s+/g, " ").trim() || "-";
  return text.length > 80 ? `${text.slice(0, 80)}...` : text;
}

function openFeedbackReviewModal(feedbackId) {
  const limits = getMallLimitsForUi(state.admin?.settings?.limits);
  const item = (state.admin.feedback || []).find((entry) => entry.id === feedbackId);
  if (!item) {
    showToast("反馈不存在", "error");
    return;
  }
  const ledger = (state.admin.ldcLedger || []).find((row) => row.sourceType === "feedback" && row.sourceId === feedbackId) || null;
  const resend = item.status === "approved" && ledger && ledger.externalStatus !== "distributed";
  openModal(`
    <p class="eyebrow">FEEDBACK REVIEW</p>
    <h2 id="modalTitle">${resend ? "补发金额" : "审核反馈"}</h2>
    <div class="feedback-review-detail">
      <strong>${escapeHtml(item.title)}</strong>
      <span>${escapeHtml(item.username || "-")} · ${feedbackTypeLabel(item.type)} · ${formatDate(item.createdAt)}</span>
      <div class="feedback-detail-body">${renderSafeMarkdown(item.content)}</div>
    </div>
    <form class="form-grid" id="feedbackReviewForm">
      ${resend ? `<input type="hidden" name="action" value="approve">` : `
        <label>审核结果
          <select name="action">
            <option value="approve">通过并发放奖励</option>
            <option value="reject">不通过</option>
          </select>
        </label>
      `}
      <label>奖励金额
        <input name="rewardAmount" type="number" min="${Number(limits.feedbackRewardMin || 0)}" max="${Number(limits.feedbackRewardMax || 0)}" step="1" value="${escapeAttr(item.rewardAmount || limits.feedbackRewardDefault)}">
        <small class="muted">后台限制范围：${formatRewardRange(limits)}</small>
      </label>
      <label style="grid-column:1/-1;">管理员备注
        <textarea name="adminNote" maxlength="1000" placeholder="可选，用户可以看到">${escapeHtml(item.adminNote || "")}</textarea>
      </label>
      <button class="btn btn-primary" type="submit">${resend ? "确认补发" : "保存审核"}</button>
    </form>
  `);
  qs("#feedbackReviewForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    await adminSave(`/api/mall/admin/feedback/${feedbackId}`, payload, "反馈审核", "PATCH");
  });
}

async function adminDeleteFeedback(feedbackId) {
  if (!confirm("确认从 D1 彻底删除这条反馈？删除后用户端也会同步消失，相关操作记录和本地金额流水也会删除。")) return;
  try {
    const data = await apiJson(`/api/mall/admin/feedback/${feedbackId}`, {
      method: "DELETE",
      body: JSON.stringify({})
    });
    state.admin.feedback = (state.admin.feedback || []).filter((entry) => entry.id !== (data.deletedId || feedbackId));
    state.currentFeedbackId = "";
    if (data.feedbackLogs) state.admin.feedbackLogs = data.feedbackLogs;
    if (data.ldcLedger) state.admin.ldcLedger = data.ldcLedger;
    renderAdminFeedback(qs("#adminContent"));
    showToast("反馈已彻底删除");
  } catch (error) {
    showToast(error.message, "error");
  }
}

function getAdminUnreadChatCount() {
  return (state.admin?.chatConversations || [])
    .reduce((sum, conversation) => sum + Math.max(0, Number(conversation.unreadAdmin || 0)), 0);
}

function formatUnreadCount(value) {
  const count = Math.max(0, Number(value || 0));
  return count > 99 ? "99+" : String(count);
}

function renderAdminChatPanel(conversationId) {
  const conversation = (state.admin.chatConversations || []).find((item) => item.id === conversationId);
  if (!conversation) return `<div class="empty-state">会话不存在</div>`;
  const closed = conversation.status === "closed";
  return `
    <div class="chat-panel-head">
      <div>
        <h3>${escapeHtml(conversation.userName || "买家")}</h3>
        <p class="muted">${escapeHtml(conversation.subject)}${conversation.orderId ? ` · 订单 ${escapeHtml(conversation.orderId.slice(0, 8))}` : ""}</p>
      </div>
      <div class="chat-panel-actions">
        <span class="badge ${closed ? "badge-warning" : "badge-success"}">${closed ? "已关闭" : "进行中"}</span>
        <button class="btn btn-small btn-ghost" type="button" data-refresh-admin-chat-current>刷新</button>
        <button class="btn btn-small ${closed ? "btn-primary" : "btn-danger"}" type="button" data-toggle-chat-status="${closed ? "reopen" : "close"}">
          ${closed ? "重新开启" : "关闭会话"}
        </button>
        <button class="btn btn-small btn-danger" type="button" data-delete-admin-chat>删除会话</button>
      </div>
    </div>
    <div class="chat-messages admin-chat-messages" data-admin-chat-messages></div>
    ${closed ? `<p class="chat-hint">会话已关闭，重新开启后管理员和买家才能继续发送消息。</p>` : ""}
    <div class="chat-compose-shell">
      <form class="chat-compose" data-admin-chat-form>
        <textarea name="content" maxlength="2000" ${closed ? "disabled" : ""} placeholder="回复买家，支持安全 Markdown"></textarea>
      <input name="imageUrl" type="url" ${closed ? "disabled" : ""} placeholder="图片 URL 或 Bing 图片页，可选：png / jpg / gif / webp / avif">
        <button class="btn btn-primary" type="submit" ${closed ? "disabled" : ""}>发送</button>
      </form>
      ${renderMarkdownAssist()}
    </div>
  `;
}

function renderAdminChatMessages(root = document) {
  const target = qs("[data-admin-chat-messages]", root);
  if (!target) return;
  const nearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 80;
  target.innerHTML = renderChatMessageList(state.chat.messages);
  if (nearBottom) target.scrollTop = target.scrollHeight;
}

function renderAdminCards(root) {
  const status = state.currentCardStatus || "all";
  const filteredByStatus = status === "all" ? state.admin.cards : state.admin.cards.filter((card) => card.status === status);
  const filtered = filterByAdminProduct(filteredByStatus, (card) => card.productId);
  const pageInfo = paginateAdminItems("cards", filtered);
  const cards = pageInfo.items;
  const hasImportableProducts = (state.admin.products || []).some(canReplenishProduct);
  root.innerHTML = `
    <div class="batch-bar">
      <div>
        <h3>卡密管理</h3>
        <p class="muted">卡密可批量导入、定时上架、编辑和删除；自动交付商品从这里扣库存。</p>
      </div>
      <div class="row-actions compact">
        <button class="btn btn-primary" type="button" data-import-cards ${hasImportableProducts ? "" : "disabled"}>导入卡密</button>
        <button class="btn btn-danger" type="button" data-batch-delete-cards>批量删除</button>
      </div>
    </div>
    <div class="admin-filter-strip">
      ${adminSimpleFilterButton("card", "all", "全部卡密", state.admin.cards.length, state.currentCardStatus)}
      ${["unused", "scheduled", "reserved", "used", "inactive"].map((value) => adminSimpleFilterButton("card", value, cardStatusLabel(value), state.admin.cards.filter((card) => card.status === value).length, state.currentCardStatus)).join("")}
      ${adminProductSelectFilter("card", state.adminProductFilter)}
    </div>
    <div class="admin-card">
      ${renderAdminPager("cards", pageInfo)}
      ${cards.length ? `<table class="admin-table">
        <thead><tr><th>${renderSelectAllHeader("cards")}</th><th>商品</th><th>内容</th><th>状态</th><th>订单</th><th>时间</th><th>操作</th></tr></thead>
        <tbody>${cards.map((c) => `
          <tr>
            <td><input type="checkbox" data-card-check value="${escapeAttr(c.id)}" ${state.selected.has(c.id) ? "checked" : ""}></td>
            <td>${escapeHtml(c.productName)}</td>
            <td>${escapeHtml(c.content)}</td>
            <td>${cardStatusLabel(c.status)}</td>
            <td>${escapeHtml(c.orderId || "-")}</td>
            <td>${formatDate(c.createdAt)}</td>
            <td><button class="btn btn-small btn-ghost" type="button" data-edit-card="${escapeAttr(c.id)}">编辑</button></td>
          </tr>
        `).join("")}</tbody>
      </table>` : `<div class="empty-state">暂无卡密</div>`}
    </div>
  `;
  qsa("[data-card-filter]", root).forEach((button) => button.addEventListener("click", () => {
    state.currentCardStatus = button.dataset.cardFilter;
    state.selected.clear();
    renderAdminCards(root);
  }));
  qsa("[data-card-check]", root).forEach((item) => item.addEventListener("change", toggleSelected));
  bindSelectAll(root, "cards", "[data-card-check]");
  bindProductFilter(root, "card", renderAdminCards);
  bindAdminPager(root, "cards", renderAdminCards);
  qsa("[data-edit-card]", root).forEach((button) => button.addEventListener("click", () => openCardEditor(state.admin.cards.find((card) => card.id === button.dataset.editCard))));
  qs("[data-import-cards]", root).addEventListener("click", () => openCardImporter());
  qs("[data-batch-delete-cards]", root).addEventListener("click", () => adminBatchDelete("/api/mall/admin/cards", "ids", "卡密"));
}

function renderAdminCoupons(root) {
  const status = state.currentCouponStatus || "all";
  const filteredByStatus = status === "all" ? state.admin.coupons : state.admin.coupons.filter((coupon) => coupon.status === status);
  const filtered = filterByAdminProduct(filteredByStatus, (coupon) => coupon.productId || "all");
  const pageInfo = paginateAdminItems("coupons", filtered);
  const coupons = pageInfo.items;
  root.innerHTML = `
    <div class="batch-bar">
      <div>
        <h3>优惠码管理</h3>
        <p class="muted">支持固定金额、百分比、使用上限、有效期和限制商品。</p>
      </div>
      <div class="row-actions compact">
        <button class="btn btn-primary" type="button" data-new-coupon>新增优惠码</button>
        <button class="btn btn-ghost" type="button" data-batch-coupon>批量生成</button>
        <button class="btn btn-danger" type="button" data-batch-delete-coupons>批量删除</button>
      </div>
    </div>
    <div class="admin-filter-strip">
      ${adminSimpleFilterButton("coupon", "all", "全部优惠码", state.admin.coupons.length, state.currentCouponStatus)}
      ${["active", "inactive"].map((value) => adminSimpleFilterButton("coupon", value, value === "active" ? "启用中" : "已停用", state.admin.coupons.filter((coupon) => coupon.status === value).length, state.currentCouponStatus)).join("")}
      ${adminProductSelectFilter("coupon", state.adminProductFilter)}
    </div>
    <div class="admin-card">
      ${renderAdminPager("coupons", pageInfo)}
      ${coupons.length ? `<table class="admin-table">
        <thead><tr><th>${renderSelectAllHeader("coupons")}</th><th>代码</th><th>限制商品</th><th>类型</th><th>面值</th><th>使用</th><th>有效期</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>${coupons.map((c) => `
          <tr>
            <td><input type="checkbox" data-coupon-check value="${escapeAttr(c.id)}" ${state.selected.has(c.id) ? "checked" : ""}></td>
            <td><strong>${escapeHtml(c.code)}</strong></td>
            <td>${escapeHtml(productName(c.productId) || "全站可用")}</td>
            <td>${c.type === "percent" ? "百分比" : "固定抵扣"}</td>
            <td>${c.value}${c.type === "percent" ? "%" : ""}</td>
            <td>${c.usedCount}/${c.limitCount || "不限"}</td>
            <td>${formatDate(c.startsAt)} - ${formatDate(c.expiresAt)}</td>
            <td>${c.status === "active" ? "启用" : "停用"}</td>
            <td><button class="btn btn-small btn-ghost" type="button" data-edit-coupon="${escapeAttr(c.id)}">编辑</button></td>
          </tr>
        `).join("")}</tbody>
      </table>` : `<div class="empty-state">暂无优惠码</div>`}
    </div>
  `;
  qsa("[data-coupon-filter]", root).forEach((button) => button.addEventListener("click", () => {
    state.currentCouponStatus = button.dataset.couponFilter;
    state.selected.clear();
    renderAdminCoupons(root);
  }));
  qsa("[data-coupon-check]", root).forEach((item) => item.addEventListener("change", toggleSelected));
  bindSelectAll(root, "coupons", "[data-coupon-check]");
  bindProductFilter(root, "coupon", renderAdminCoupons);
  bindAdminPager(root, "coupons", renderAdminCoupons);
  qs("[data-new-coupon]", root).addEventListener("click", openCouponEditor);
  qs("[data-batch-coupon]", root).addEventListener("click", openCouponBatchGenerator);
  qsa("[data-edit-coupon]", root).forEach((button) => button.addEventListener("click", () => openCouponEditor(state.admin.coupons.find((coupon) => coupon.id === button.dataset.editCoupon))));
  qs("[data-batch-delete-coupons]", root).addEventListener("click", () => adminBatchDelete("/api/mall/admin/coupons", "ids", "优惠码"));
}

function renderAdminRatings(root) {
  const filtered = filterByAdminProduct(state.admin.ratings || [], (rating) => rating.productId);
  const pageInfo = paginateAdminItems("ratings", filtered);
  const ratings = pageInfo.items;
  root.innerHTML = `
    <div class="batch-bar">
      <h3>评价管理</h3>
      <button class="btn btn-danger" type="button" data-batch-delete-ratings>批量删除</button>
    </div>
    <div class="admin-filter-strip">${adminProductSelectFilter("rating", state.adminProductFilter)}</div>
    <div class="admin-card">
      ${renderAdminPager("ratings", pageInfo)}
      <table class="admin-table">
        <thead><tr><th>${renderSelectAllHeader("ratings")}</th><th>商品</th><th>用户</th><th>评分</th><th>评价</th><th>时间</th></tr></thead>
        <tbody>${ratings.map((r) => `
          <tr>
            <td><input type="checkbox" data-rating-check value="${escapeAttr(r.id)}" ${state.selected.has(r.id) ? "checked" : ""}></td>
            <td>${escapeHtml(r.productName || r.productId)}</td>
            <td>${escapeHtml(r.username)}</td>
            <td>${r.rating}</td>
            <td>${escapeHtml(r.comment)}</td>
            <td>${formatDate(r.createdAt)}</td>
          </tr>
        `).join("")}</tbody>
      </table>
    </div>
  `;
  qsa("[data-rating-check]", root).forEach((item) => item.addEventListener("change", toggleSelected));
  bindSelectAll(root, "ratings", "[data-rating-check]");
  bindProductFilter(root, "rating", renderAdminRatings);
  bindAdminPager(root, "ratings", renderAdminRatings);
  qs("[data-batch-delete-ratings]", root).addEventListener("click", () => adminBatchDelete("/api/mall/admin/ratings", "ids", "评价"));
}

function renderAdminAds(root) {
  const pageInfo = paginateAdminItems("ads", state.admin.ads || []);
  const ads = pageInfo.items;
  root.innerHTML = `
    <div class="batch-bar">
      <div>
        <h3>广告推荐</h3>
        <p class="muted">管理首页顶部、侧边栏和悬浮推荐位。</p>
      </div>
      <div class="row-actions compact">
        <button class="btn btn-primary" type="button" data-new-ad>新增广告</button>
        <button class="btn btn-danger" type="button" data-batch-delete-ads>批量删除</button>
      </div>
    </div>
    <div class="admin-card">
      ${renderAdminPager("ads", pageInfo)}
      <table class="admin-table">
        <thead><tr><th>${renderSelectAllHeader("ads")}</th><th>标题</th><th>位置</th><th>样式</th><th>链接</th><th>排序</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>${ads.map((ad) => `
          <tr>
            <td><input type="checkbox" data-ad-check value="${escapeAttr(ad.id)}" ${state.selected.has(ad.id) ? "checked" : ""}></td>
            <td>${escapeHtml(ad.title)}</td>
            <td>${adPositionLabel(ad.position)}</td>
            <td>${escapeHtml(ad.style?.layout || "card")} / ${escapeHtml(ad.style?.theme || "blue")}</td>
            <td>${escapeHtml(ad.linkUrl)}</td>
            <td>${ad.sortOrder || 0}</td>
            <td>${ad.status}</td>
            <td><button class="btn btn-small btn-ghost" type="button" data-edit-ad="${escapeAttr(ad.id)}">编辑</button></td>
          </tr>
        `).join("")}</tbody>
      </table>
    </div>
  `;
  qsa("[data-ad-check]", root).forEach((item) => item.addEventListener("change", toggleSelected));
  bindSelectAll(root, "ads", "[data-ad-check]");
  bindAdminPager(root, "ads", renderAdminAds);
  qs("[data-new-ad]", root).addEventListener("click", openAdEditor);
  qsa("[data-edit-ad]", root).forEach((button) => button.addEventListener("click", () => openAdEditor(state.admin.ads.find((ad) => ad.id === button.dataset.editAd))));
  qs("[data-batch-delete-ads]", root).addEventListener("click", () => adminBatchDelete("/api/mall/admin/ads", "ids", "广告"));
}

function renderAdminUsers(root) {
  const pageInfo = paginateAdminItems("users", state.admin.users || []);
  const users = pageInfo.items;
  root.innerHTML = `
    <div class="admin-card">
      <div class="batch-bar">
        <div>
          <h3>用户管理</h3>
          <p class="muted">用户账号、Linux.do ID、订单数和累计消费。不能删除当前管理员账号。</p>
        </div>
        <button class="btn btn-danger" type="button" data-batch-delete-users>删除选中用户</button>
      </div>
      ${renderAdminPager("users", pageInfo)}
      <table class="admin-table">
        <thead><tr><th>${renderSelectAllHeader("users")}</th><th>用户</th><th>Linux.do</th><th>信任等级</th><th>订单</th><th>消费</th><th>余额</th><th>注册 IP</th><th>访问 IP</th><th>注册北京时间</th><th>访问 UA</th></tr></thead>
        <tbody>${users.map((u) => `
          <tr>
            <td><input type="checkbox" data-user-check value="${escapeAttr(u.id)}" ${state.selected.has(u.id) ? "checked" : ""}></td>
            <td><strong>${escapeHtml(u.username)}</strong><br><span class="muted">${escapeHtml(u.accountUsername || "")}</span></td>
            <td>${escapeHtml(u.linuxdoId || "-")}</td>
            <td>TL${Number(u.linuxdoTrustLevel || 0)}</td>
            <td>${u.orderCount}</td>
            <td>${renderMoney(u.totalSpent)}</td>
            <td><strong>${renderMoney(u.ldcBalance || 0)}</strong></td>
            <td>${escapeHtml(u.registerIp || "-")}</td>
            <td>${escapeHtml(u.lastIp || "-")}</td>
            <td>${escapeHtml(u.createdAtBeijing || formatDate(u.createdAt))}</td>
            <td class="table-clip" title="${escapeAttr(u.lastUserAgent || "")}">${escapeHtml(u.lastUserAgent || "-")}</td>
          </tr>
        `).join("")}</tbody>
      </table>
    </div>
  `;
  qsa("[data-user-check]", root).forEach((item) => item.addEventListener("change", toggleSelected));
  bindSelectAll(root, "users", "[data-user-check]");
  bindAdminPager(root, "users", renderAdminUsers);
  qs("[data-batch-delete-users]", root).addEventListener("click", () => adminBatchDelete("/api/mall/admin/users", "userIds", "用户"));
}

function renderAdminSettings(root) {
  const site = state.admin.settings.siteInfo || {};
  const contacts = normalizeContactLinks(site.contacts, site.contact);
  const currencyMode = site.currencyMode === "image" ? "image" : "text";
  const logoMode = site.logoMode === "image" ? "image" : "text";
  root.innerHTML = `
    <form class="admin-settings-form" id="settingsForm">
      <section class="admin-card admin-form-section">
        <h3>基础文案</h3>
        <div class="form-grid two">
          <label>站点标题<input name="title" value="${escapeAttr(site.title || "")}"></label>
          <label>副标题<input name="subtitle" value="${escapeAttr(site.subtitle || "")}"></label>
          <label style="grid-column:1/-1;">页脚文案<input name="footer" value="${escapeAttr(site.footer || "")}"></label>
        </div>
      </section>
      <section class="admin-card admin-form-section">
        <h3>Logo 配置</h3>
        <div class="form-grid two">
          <label>Logo 类型
            <select name="logoMode">
              <option value="text" ${logoMode === "text" ? "selected" : ""}>纯文字</option>
              <option value="image" ${logoMode === "image" ? "selected" : ""}>图片</option>
            </select>
          </label>
          <label>Logo 文字<input name="logoText" value="${escapeAttr(site.logoText || "L")}" maxlength="4" placeholder="例如 L、DO、商城"></label>
          <label style="grid-column:1/-1;">Logo 图片 URL<input name="logoImageUrl" value="${escapeAttr(site.logoImageUrl || "")}" placeholder="在线图片 URL，或先使用下面的本地上传"></label>
          <label style="grid-column:1/-1;">上传 Logo 图片<input name="logoImageFile" type="file" accept="image/png,image/jpeg,image/gif,image/webp,image/avif"></label>
        </div>
      </section>
      <section class="admin-card admin-form-section">
        <h3>货币显示</h3>
        <div class="form-grid two">
          <label>货币类型
            <select name="currencyMode">
              <option value="text" ${currencyMode === "text" ? "selected" : ""}>纯文字</option>
              <option value="image" ${currencyMode === "image" ? "selected" : ""}>图片</option>
            </select>
          </label>
          <label>货币文字<input name="currencySymbol" value="${escapeAttr(site.currencySymbol || "L")}" placeholder="例如 L、积分、币"></label>
          <label style="grid-column:1/-1;">货币图片 URL<input name="currencyImageUrl" value="${escapeAttr(site.currencyImageUrl || "")}" placeholder="在线图片 URL，或先使用下面的本地上传"></label>
          <label style="grid-column:1/-1;">上传货币图片<input name="currencyImageFile" type="file" accept="image/png,image/jpeg,image/gif,image/webp,image/avif"></label>
        </div>
      </section>
      <section class="admin-card admin-form-section">
        <h3>主题与维护</h3>
        <div class="form-grid two">
          <label>主题
            <select name="theme">
              ${["system", "light"].map((theme) => `<option value="${theme}" ${state.admin.settings.theme === theme ? "selected" : ""}>${theme}</option>`).join("")}
            </select>
          </label>
          <label>站点状态
            <select name="siteActive">
              <option value="true" ${site.siteActive !== false ? "selected" : ""}>正常营业</option>
              <option value="false" ${site.siteActive === false ? "selected" : ""}>维护中</option>
            </select>
          </label>
          <label style="grid-column:1/-1;">维护页图片 URL<input name="maintenanceImageUrl" value="${escapeAttr(site.maintenanceImageUrl || "")}" placeholder="可选，维护中页面展示的在线图片 URL"></label>
          <label style="grid-column:1/-1;">上传维护页图片<input name="maintenanceImageFile" type="file" accept="image/png,image/jpeg,image/gif,image/webp,image/avif"><small class="muted">本地上传会默认将接近白色的背景处理为透明；在线图片会尽可能透明化，失败时保留原链接。</small></label>
          <label style="grid-column:1/-1;">维护原因<textarea name="maintenanceReason" rows="3" maxlength="300" placeholder="可选，展示在维护界面中">${escapeHtml(site.maintenanceReason || "")}</textarea></label>
        </div>
      </section>
      <section class="admin-card admin-form-section">
        <div class="template-custom-head">
          <div>
            <h3>页脚联系方式</h3>
            <p class="muted">联系方式只在商城首页页脚显示。QQ、QQ群、TG、飞书等会生成可点击链接；微信通常无法网页直达，会按文本展示。</p>
          </div>
          <button class="btn btn-small btn-ghost" type="button" data-add-contact>添加联系方式</button>
        </div>
        <div class="contact-editor" data-contact-list>
          ${contacts.map(renderContactEditorRow).join("") || `<div class="empty-state" data-empty-contact>暂无联系方式</div>`}
        </div>
      </section>
      <div class="editor-footer">
        <button class="btn btn-primary" type="submit">保存站点基础</button>
      </div>
    </form>
  `;
  qs("[data-add-contact]", root).addEventListener("click", () => {
    const list = qs("[data-contact-list]", root);
    qs("[data-empty-contact]", list)?.remove();
    list.insertAdjacentHTML("beforeend", renderContactEditorRow({ type: "telegram", label: "TG 私聊", value: "", url: "" }));
  });
  qs("[data-contact-list]", root).addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-contact]");
    if (!button) return;
    const list = qs("[data-contact-list]", root);
    button.closest("[data-contact-row]")?.remove();
    if (!qsa("[data-contact-row]", list).length) {
      list.innerHTML = `<div class="empty-state" data-empty-contact>暂无联系方式</div>`;
    }
  });
  qs("#settingsForm", root).addEventListener("submit", async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const logoFile = formElement.elements.logoImageFile?.files?.[0];
    const imageFile = formElement.elements.currencyImageFile?.files?.[0];
    const maintenanceFile = formElement.elements.maintenanceImageFile?.files?.[0];
    let logoImageUrl = "";
    let currencyImageUrl = "";
    let maintenanceImageUrl = "";
    try {
      logoImageUrl = logoFile ? await fileToDataUrl(logoFile, "Logo 图片") : String(form.get("logoImageUrl") || "").trim();
      currencyImageUrl = imageFile ? await fileToDataUrl(imageFile, "货币图片") : String(form.get("currencyImageUrl") || "").trim();
      maintenanceImageUrl = maintenanceFile
        ? await maintenanceImageFileToDataUrl(maintenanceFile)
        : await maintenanceImageUrlToTransparentDataUrl(String(form.get("maintenanceImageUrl") || "").trim());
    } catch (error) {
      showToast(error.message || "图片读取失败", "error");
      return;
    }
    if (form.get("logoMode") === "image" && logoImageUrl && !normalizeSiteImageUrl(logoImageUrl)) {
      showToast("Logo 图片只允许 http(s) 图片、站内 /static 路径或本地上传图片", "error");
      return;
    }
    if (form.get("currencyMode") === "image" && currencyImageUrl && !normalizeCurrencyImageUrl(currencyImageUrl)) {
      showToast("货币图片只允许 http(s) 图片、站内 /static 路径或本地上传图片", "error");
      return;
    }
    if (maintenanceImageUrl && !normalizeSiteImageUrl(maintenanceImageUrl)) {
      showToast("维护页图片只允许 http(s) 图片、站内 /static 路径或本地上传图片", "error");
      return;
    }
    await adminSave("/api/mall/admin/settings", {
      siteInfo: {
        title: form.get("title"),
        subtitle: form.get("subtitle"),
        logoMode: form.get("logoMode"),
        logoText: form.get("logoText"),
        logoImageUrl,
        contact: "",
        contacts: readContactRows(formElement),
        footer: form.get("footer"),
        currencyMode: form.get("currencyMode"),
        currencySymbol: form.get("currencySymbol"),
        currencyImageUrl,
        maintenanceImageUrl,
        maintenanceReason: form.get("maintenanceReason"),
        siteActive: form.get("siteActive") === "true"
      },
      theme: form.get("theme")
    }, "站点基础", "PUT");
  });
}

function renderAdminAnnouncementSettings(root) {
  const ann = state.admin.settings.announcement || {};
  root.innerHTML = `
    <form class="admin-settings-form" id="announcementSettingsForm">
      <section class="admin-card admin-form-section">
        <h3>公告配置</h3>
        <div class="form-grid two">
          <label>公告标题<input name="announcementTitle" value="${escapeAttr(ann.title || "商城公告")}"></label>
          <label>公告状态
            <select name="announcementActive">
              <option value="true" ${ann.active !== false ? "selected" : ""}>启用</option>
              <option value="false" ${ann.active === false ? "selected" : ""}>停用</option>
            </select>
          </label>
          <label>公告类型
            <select name="announcementType">
              ${["info", "success", "warning", "danger"].map((type) => `<option value="${type}" ${ann.type === type ? "selected" : ""}>${announcementTypeLabel(type)}</option>`).join("")}
            </select>
          </label>
          <label>展示形式
            <select name="announcementStyle">
              ${["soft", "solid", "outline"].map((style) => `<option value="${style}" ${ann.style === style ? "selected" : ""}>${announcementStyleLabel(style)}</option>`).join("")}
            </select>
          </label>
          <label>链接文字<input name="announcementLinkText" value="${escapeAttr(ann.linkText || "")}" placeholder="可选，例如 查看详情"></label>
          <label>链接地址<input name="announcementLinkUrl" value="${escapeAttr(ann.linkUrl || "")}" placeholder="可选，http(s) 或站内路径"></label>
          <label>允许关闭
            <select name="announcementDismissible">
              <option value="true" ${ann.dismissible !== false ? "selected" : ""}>允许用户关闭</option>
              <option value="false" ${ann.dismissible === false ? "selected" : ""}>始终显示</option>
            </select>
          </label>
          <label style="grid-column:1/-1;">公告正文<textarea name="announcement" rows="4" maxlength="300">${escapeHtml(ann.top || "")}</textarea></label>
        </div>
      </section>
      <div class="editor-footer">
        <button class="btn btn-primary" type="submit">保存公告配置</button>
      </div>
    </form>
  `;
  qs("#announcementSettingsForm", root).addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await adminSave("/api/mall/admin/settings", {
      announcement: {
        top: form.get("announcement"),
        title: form.get("announcementTitle"),
        type: form.get("announcementType"),
        style: form.get("announcementStyle"),
        linkText: form.get("announcementLinkText"),
        linkUrl: form.get("announcementLinkUrl"),
        dismissible: form.get("announcementDismissible") === "true",
        active: form.get("announcementActive") === "true"
      }
    }, "公告配置", "PUT");
  });
}

function announcementTypeLabel(type) {
  return { info: "信息", success: "成功", warning: "警告", danger: "重要" }[type] || type;
}

function announcementStyleLabel(style) {
  return { soft: "柔和底色", solid: "高亮底色", outline: "描边提示" }[style] || style;
}

function renderAdminLotterySettings(root) {
  const lucky = state.admin.settings.luckyDraw || {};
  const prizes = normalizePrizeList(lucky.prizes);
  const probabilityTotal = prizes.reduce((sum, item) => sum + Number(item.weight || 0), 0);
  root.innerHTML = `
    <form class="admin-settings-form" id="lotterySettingsForm">
      <section class="admin-card admin-form-section">
        <h3>抽奖配置</h3>
        <div class="form-grid two">
          <label>抽奖状态
            <select name="luckyEnabled">
              <option value="true" ${lucky.enabled !== false ? "selected" : ""}>启用</option>
              <option value="false" ${lucky.enabled === false ? "selected" : ""}>停用</option>
            </select>
          </label>
          <label>冷却分钟<input name="cooldownMinutes" type="number" min="0" max="43200" value="${Number(lucky.cooldownMinutes || 120)}"><small class="muted">选择“冷却”模式时生效；每日模式不使用该值。</small></label>
          <label>抽奖限制
            <select name="luckyScope">
              <option value="product_daily" ${!lucky.scope || lucky.scope === "product_daily" ? "selected" : ""}>每个商品每天一次</option>
              <option value="global_daily" ${lucky.scope === "global_daily" ? "selected" : ""}>全站每天一次</option>
              <option value="product_cooldown" ${lucky.scope === "product_cooldown" ? "selected" : ""}>每个商品按冷却分钟</option>
              <option value="global_cooldown" ${lucky.scope === "global_cooldown" ? "selected" : ""}>全站按冷却分钟</option>
            </select>
          </label>
          <div class="lottery-prize-editor">
            <div class="lottery-prize-head">
              <div>
                <strong>抽奖奖项</strong>
                <small>中奖概率按百分比配置，所有奖项概率合计建议为 100%；折扣值 0.95 为 9.5 折，1 为无折扣，0 为免单。</small>
              </div>
              <div class="row-actions compact">
                <button class="btn btn-small btn-primary" type="button" data-add-prize>添加奖项</button>
                <button class="btn btn-small btn-ghost" type="button" data-import-prizes>按模板导入</button>
                <button class="btn btn-small btn-ghost" type="button" data-export-prize-template>导出模板</button>
              </div>
            </div>
            <div class="prize-table">
              <div class="prize-row prize-row-head" aria-hidden="true">
                <span>奖项名称</span>
                <span>折扣值</span>
                <span>中奖概率%</span>
                <span>颜色</span>
                <span>操作</span>
              </div>
              <p class="settings-hint">当前概率合计：${formatPrizeProbability(probabilityTotal)}%</p>
              <div data-prize-list>
                ${renderPrizeRows(prizes)}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="editor-footer">
        <button class="btn btn-primary" type="submit">保存抽奖配置</button>
      </div>
    </form>
  `;
  const prizeList = qs("[data-prize-list]", root);
  qs("[data-add-prize]", root).addEventListener("click", () => {
    prizeList.insertAdjacentHTML("beforeend", renderPrizeRow({
      label: "新奖项",
      value: 1,
      weight: 1,
      color: "#2563eb"
    }));
  });
  qs("[data-import-prizes]", root).addEventListener("click", () => openPrizeImportModal(root));
  qs("[data-export-prize-template]", root).addEventListener("click", downloadLotteryTemplate);
  prizeList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-prize]");
    if (!button) return;
    const rows = qsa("[data-prize-row]", prizeList);
    if (rows.length <= 1) {
      showToast("至少保留一个抽奖奖项", "error");
      return;
    }
    button.closest("[data-prize-row]")?.remove();
  });
  qs("#lotterySettingsForm", root).addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const prizes = readPrizeRows(event.currentTarget);
    if (!prizes.length) {
      showToast("请至少添加一个抽奖奖项", "error");
      return;
    }
    if (!prizes.some((item) => item.weight > 0)) {
      showToast("至少需要一个中奖概率大于 0 的奖项", "error");
      return;
    }
    await adminSave("/api/mall/admin/settings", {
      luckyDraw: {
        enabled: form.get("luckyEnabled") === "true",
        cooldownMinutes: Number(form.get("cooldownMinutes")),
        scope: form.get("luckyScope"),
        prizes
      }
    }, "抽奖配置", "PUT");
  });
}

function renderAdminMarkdownGuides(root) {
  const guides = normalizeMarkdownGuideList(state.admin.settings.markdownGuides);
  root.innerHTML = `
    <form class="admin-settings-form" id="markdownGuideSettingsForm">
      <section class="admin-card admin-form-section">
        <div class="template-custom-head">
          <div>
            <h3>Markdown 用法</h3>
            <p class="muted">这里配置私聊窗口右侧的 Markdown 查询卡片。点击卡片会把示例语法插入输入框。</p>
          </div>
          <div class="row-actions compact">
            <button class="btn btn-small btn-primary" type="button" data-add-md-guide>添加用法</button>
            <button class="btn btn-small btn-ghost" type="button" data-reset-md-guides>恢复默认</button>
          </div>
        </div>
        <div class="markdown-guide-editor" data-md-guide-list>
          ${guides.map(renderMarkdownGuideEditorRow).join("")}
        </div>
      </section>
      <div class="editor-footer">
        <button class="btn btn-primary" type="submit">保存 Markdown 用法</button>
      </div>
    </form>
  `;
  const list = qs("[data-md-guide-list]", root);
  qs("[data-add-md-guide]", root).addEventListener("click", () => {
    list.insertAdjacentHTML("beforeend", renderMarkdownGuideEditorRow({
      title: "新用法",
      keyword: "关键词",
      code: "示例语法",
      note: "说明文字"
    }));
  });
  qs("[data-reset-md-guides]", root).addEventListener("click", () => {
    list.innerHTML = DEFAULT_MARKDOWN_GUIDES.map(renderMarkdownGuideEditorRow).join("");
  });
  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-md-guide]");
    if (!button) return;
    const rows = qsa("[data-md-guide-row]", list);
    if (rows.length <= 1) {
      showToast("至少保留一个 Markdown 用法", "error");
      return;
    }
    button.closest("[data-md-guide-row]")?.remove();
  });
  qs("#markdownGuideSettingsForm", root).addEventListener("submit", async (event) => {
    event.preventDefault();
    const guides = readMarkdownGuideRows(event.currentTarget);
    if (!guides.length) {
      showToast("请至少添加一个 Markdown 用法", "error");
      return;
    }
    await adminSave("/api/mall/admin/settings", { markdownGuides: guides }, "Markdown 用法", "PUT");
  });
}

function renderMarkdownGuideEditorRow(item) {
  return `
    <div class="markdown-guide-editor-row" data-md-guide-row>
      <label>标题<input name="mdTitle" value="${escapeAttr(item.title || "")}" maxlength="40" placeholder="例如 图片"></label>
      <label>搜索关键词<input name="mdKeyword" value="${escapeAttr(item.keyword || "")}" maxlength="160" placeholder="图片 image markdown"></label>
      <label class="wide">示例语法<textarea name="mdCode" maxlength="500" rows="3" placeholder="点击卡片时插入的内容">${escapeHtml(item.code || "")}</textarea></label>
      <label class="wide">说明<textarea name="mdNote" maxlength="180" rows="2" placeholder="展示给用户看的说明">${escapeHtml(item.note || "")}</textarea></label>
      <button class="btn btn-small btn-danger" type="button" data-remove-md-guide>删除</button>
    </div>
  `;
}

function readMarkdownGuideRows(form) {
  return qsa("[data-md-guide-row]", form).map((row) => ({
    title: qs('[name="mdTitle"]', row).value.trim().slice(0, 40),
    keyword: qs('[name="mdKeyword"]', row).value.trim().slice(0, 160),
    code: qs('[name="mdCode"]', row).value.trim().slice(0, 500),
    note: qs('[name="mdNote"]', row).value.trim().slice(0, 180)
  })).filter((item) => item.title && item.code).slice(0, 40);
}

function normalizeMarkdownGuideList(value) {
  const source = Array.isArray(value) && value.length ? value : DEFAULT_MARKDOWN_GUIDES;
  return source.map((item) => ({
    title: String(item.title || "").trim(),
    keyword: String(item.keyword || "").trim(),
    code: String(item.code || "").trim(),
    note: String(item.note || "").trim()
  })).filter((item) => item.title && item.code);
}

function renderAdminPushSettings(root) {
  const pushme = state.admin.settings.pushme || {};
  const secretNotice = pushme.secretConfigured && !pushme.pushKey
    ? `<p class="settings-hint">PushMe Key 已在 Cloudflare Secret 配置，留空会优先使用 Secret。</p>`
    : "";
  root.innerHTML = `
    <form class="admin-settings-form" id="pushSettingsForm">
      <section class="admin-card admin-form-section">
        <h3>推送配置</h3>
        <div class="form-grid two">
          <label>PushMe 状态
            <select name="pushmeEnabled">
              <option value="false" ${!pushme.enabled ? "selected" : ""}>停用</option>
              <option value="true" ${pushme.enabled ? "selected" : ""}>启用</option>
            </select>
          </label>
          <label>PushMe 服务地址<input name="pushmeServerUrl" value="${escapeAttr(pushme.serverUrl || "https://push.i-i.me")}"></label>
          <label>PushMe 推送 Key<input name="pushmePushKey" type="password" value="${escapeAttr(pushme.pushKey || "")}" placeholder="${pushme.secretConfigured ? "已在 Cloudflare Secret 配置，留空使用 Secret" : "建议使用 Cloudflare Secret 配置"}"></label>
          <label>PushMe 消息类型
            <select name="pushmeType">
              <option value="html" ${!pushme.type || pushme.type === "html" ? "selected" : ""}>html</option>
              <option value="markdown" ${pushme.type === "markdown" ? "selected" : ""}>markdown</option>
              <option value="text" ${pushme.type === "text" ? "selected" : ""}>text</option>
            </select>
          </label>
          <label style="grid-column:1/-1;">PushMe 默认标题<input name="pushmeTitle" value="${escapeAttr(pushme.title || "Linuxdo Mall 通知")}"></label>
        </div>
        ${secretNotice}
      </section>
      <div class="editor-footer">
        <button class="btn btn-primary" type="submit">保存推送配置</button>
      </div>
    </form>
  `;
  qs("#pushSettingsForm", root).addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await adminSave("/api/mall/admin/settings", {
      pushme: {
        enabled: form.get("pushmeEnabled") === "true",
        pushKey: form.get("pushmePushKey"),
        serverUrl: form.get("pushmeServerUrl"),
        title: form.get("pushmeTitle"),
        type: form.get("pushmeType")
      }
    }, "推送配置", "PUT");
  });
}

function renderAdminEmailSettings(root) {
  const emailService = state.admin.settings.emailService || {};
  const resendFrom = emailService.resendFrom || "Linuxdo Mall <mall@suimi.eu.cc>";
  root.innerHTML = `
    <section class="admin-card admin-form-section">
      <h3>Resend 邮件配置</h3>
      <p class="muted">当前商城只使用 Resend HTTPS API 发信，后台不再提供主机、端口、账号、密码这类邮件客户端配置。密钥必须放在 Cloudflare Pages Secrets 中，避免泄露。</p>
      <div class="admin-insight-strip email-status-strip">
        <article><span>发信服务</span><strong>${emailService.resendConfigured ? "Resend 已启用" : "未配置"}</strong></article>
        <article><span>API Key</span><strong>${emailService.resendConfigured ? "已配置" : "未配置"}</strong></article>
        <article><span>发件地址</span><strong>${emailService.resendFromConfigured ? escapeHtml(resendFrom) : "未配置"}</strong></article>
      </div>
      <p class="settings-hint">不需要填写邮件服务器地址。只要 Resend 域名已验证，并且 Cloudflare 中存在 RESEND_API_KEY 与 RESEND_FROM，就可以发信。</p>
    </section>
    <section class="admin-card admin-form-section">
      <h3>Resend 完整配置方法</h3>
      <ol class="email-setup-list">
        <li>
          <strong>添加并验证域名</strong>
          <p>进入 Resend 后台的 Domains，添加 <code>suimi.eu.cc</code>，然后按 Resend 给出的记录在 Cloudflare DNS 中添加。当前已验证时，Resend 页面会显示 <code>Verified</code>。</p>
        </li>
        <li>
          <strong>Cloudflare DNS 记录填写规则</strong>
          <pre class="email-setup-code">MX  send                 feedback-smtp.us-east-1.amazonses.com  priority 10
TXT send                 v=spf1 include:amazonses.com ~all
TXT resend._domainkey    p=Resend 给出的 DKIM 公钥
TXT _dmarc               v=DMARC1; p=none;</pre>
          <p>注意：在 Cloudflare 的 <code>suimi.eu.cc</code> 域名下，名称只填 <code>send</code> 和 <code>resend._domainkey</code>，不要再追加 <code>.suimi.eu.cc</code>。这里的 <code>feedback-smtp</code> 是 DNS 记录值，不是后台要填写的邮件服务器。</p>
        </li>
        <li>
          <strong>配置 Cloudflare Pages Secret</strong>
          <pre class="email-setup-code">npx wrangler pages secret put RESEND_API_KEY --project-name minesweeper-cloud
npx wrangler pages secret put RESEND_FROM --project-name minesweeper-cloud</pre>
          <p><code>RESEND_API_KEY</code> 填 Resend 的 API Key；<code>RESEND_FROM</code> 建议填写 <code>Linuxdo Mall &lt;mall@suimi.eu.cc&gt;</code>。</p>
        </li>
        <li>
          <strong>重新部署并测试</strong>
          <pre class="email-setup-code">npx wrangler pages deploy dist --project-name minesweeper-cloud --branch main</pre>
          <p>部署完成后，用下方测试发件功能验证。测试成功后，订单发货通知和用户测试邮件会走同一套 Resend 通道。</p>
        </li>
      </ol>
    </section>
    <section class="admin-card admin-form-section">
      <h3>测试发件</h3>
      <div class="form-grid two">
        <label>测试收件邮箱<input name="adminTestEmail" type="email" maxlength="180" placeholder="name@example.com"></label>
        <div class="row-actions" style="align-self:end;">
          <button class="btn btn-ghost" type="button" data-admin-test-email>发送测试邮件</button>
        </div>
      </div>
    </section>
  `;
  qs("[data-admin-test-email]", root)?.addEventListener("click", testAdminEmail);
}

async function testAdminEmail(event) {
  const button = event.currentTarget;
  const email = qs('[name="adminTestEmail"]')?.value || "";
  button.disabled = true;
  button.textContent = "发送中...";
  try {
    const data = await apiJson("/api/mall/admin/email-test", {
      method: "POST",
      body: JSON.stringify({ email })
    });
    showToast(`测试邮件已发送到 ${data.email}`);
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    button.disabled = false;
    button.textContent = "发送测试邮件";
  }
}

function normalizeBackupScopeForUi(value) {
  const raw = Array.isArray(value) ? value : String(value || "").split(",");
  const allowed = new Set(BACKUP_SCOPE_OPTIONS.map((item) => item.value));
  const selected = raw
    .map((item) => String(item || "").trim())
    .filter((item, index, list) => allowed.has(item) && list.indexOf(item) === index);
  if (!selected.length || selected.includes("all")) {
    return ["all"];
  }
  return selected;
}

function isFullBackupScopeSelection(value) {
  const selected = normalizeBackupScopeForUi(value);
  if (selected.includes("all")) return true;
  return BACKUP_SCOPE_MODULE_VALUES.every((item) => selected.includes(item));
}

function renderBackupScopeOptions(selected, name) {
  const values = new Set(normalizeBackupScopeForUi(selected));
  return BACKUP_SCOPE_OPTIONS.map((item) => `
    <label class="backup-scope-option">
      <input type="checkbox" name="${escapeAttr(name)}" value="${escapeAttr(item.value)}" ${values.has(item.value) ? "checked" : ""}>
      <span><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.description)}</small></span>
    </label>
  `).join("");
}

function renderBackupScopeControls(selected, name) {
  const values = normalizeBackupScopeForUi(selected);
  return `
    <div class="backup-scope-toolbar">
      <div class="backup-scope-summary">
        <span class="muted">当前选择</span>
        <strong data-backup-scope-summary="${escapeAttr(name)}">${escapeHtml(formatBackupScopeLabel(values))}</strong>
      </div>
      <div class="row-actions compact">
        <button class="btn btn-small btn-ghost" type="button" data-backup-scope-action="select-all" data-backup-scope-name="${escapeAttr(name)}">全选</button>
        <button class="btn btn-small btn-ghost" type="button" data-backup-scope-action="reset-all" data-backup-scope-name="${escapeAttr(name)}">全部数据</button>
      </div>
    </div>
  `;
}

function readBackupScopeValues(root, name) {
  return normalizeBackupScopeForUi(qsa(`input[name="${name}"]:checked`, root).map((input) => input.value));
}

function syncBackupScopeSummary(root, name) {
  const label = formatBackupScopeLabel(readBackupScopeValues(root, name));
  qsa(`[data-backup-scope-summary="${escapeAttr(name)}"]`, root).forEach((node) => {
    node.textContent = label;
  });
}

function updateBackupScopeGroup(root, name, values) {
  const normalized = normalizeBackupScopeForUi(values);
  const boxes = qsa(`input[name="${name}"]`, root);
  const useAll = normalized.includes("all");
  boxes.forEach((box) => {
    box.checked = useAll ? box.value === "all" : normalized.includes(box.value);
  });
  syncBackupScopeSummary(root, name);
}

function bindBackupScopeGroup(root, name) {
  const boxes = qsa(`input[name="${name}"]`, root);
  const allBox = boxes.find((box) => box.value === "all");
  const selectAllButtons = qsa(`[data-backup-scope-action="select-all"][data-backup-scope-name="${escapeAttr(name)}"]`, root);
  const resetButtons = qsa(`[data-backup-scope-action="reset-all"][data-backup-scope-name="${escapeAttr(name)}"]`, root);
  const refresh = () => syncBackupScopeSummary(root, name);
  selectAllButtons.forEach((button) => {
    button.addEventListener("click", () => {
      updateBackupScopeGroup(root, name, BACKUP_SCOPE_MODULE_VALUES);
    });
  });
  resetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      updateBackupScopeGroup(root, name, ["all"]);
    });
  });
  boxes.forEach((box) => {
    box.addEventListener("change", () => {
      if (box.value === "all" && box.checked) {
        updateBackupScopeGroup(root, name, ["all"]);
        return;
      }
      if (box.value !== "all" && box.checked && allBox) {
        allBox.checked = false;
      }
      if (!boxes.some((item) => item.checked) && allBox) {
        allBox.checked = true;
      }
      refresh();
    });
  });
  refresh();
}

function formatBackupScopeLabel(scope) {
  const values = normalizeBackupScopeForUi(scope);
  if (values.includes("all")) return "全部数据";
  if (isFullBackupScopeSelection(values)) return "全部数据";
  const labels = BACKUP_SCOPE_OPTIONS
    .filter((item) => values.includes(item.value))
    .map((item) => item.label);
  return labels.length ? labels.join(" · ") : "全部数据";
}

function backupTypeLabel(value) {
  return ({
    manual: "手动",
    auto: "自动",
    import: "导入",
    restore_safety: "恢复保护"
  })[value] || value || "手动";
}

function backupTypeClass(value) {
  if (value === "auto") return "badge-success";
  if (value === "import") return "badge-warning";
  if (value === "restore_safety") return "badge-muted";
  return "";
}

function buildBackupRecordSummary(records) {
  const summary = { manual: 0, auto: 0, imported: 0, restoreSafety: 0, lastTime: "" };
  let lastTs = 0;
  for (const record of records || []) {
    const type = record.backupType || "manual";
    if (type === "auto") summary.auto += 1;
    else if (type === "import") summary.imported += 1;
    else if (type === "restore_safety") summary.restoreSafety += 1;
    else summary.manual += 1;
    const ts = Date.parse(record.createdAt || "");
    if (Number.isFinite(ts) && ts >= lastTs) {
      lastTs = ts;
      summary.lastTime = formatDate(record.createdAt);
    }
  }
  return summary;
}

const RATE_LIMIT_FIELDS = [
  ["orderCreate", "下单限制", "用户创建订单的频率限制。"],
  ["feedbackCreate", "反馈提交", "用户创建 Bug 反馈或问题建议的频率限制。"],
  ["bingImageResolve", "Bing 图片解析", "私聊、反馈中解析 Bing 图片详情页的频率限制。"],
  ["adminImageProxy", "后台在线图片处理", "管理员处理在线图片透明化、代理读取的频率限制。"]
];

function renderAdminRateLimits(root) {
  const limits = getMallLimitsForUi(state.admin?.settings?.limits);
  root.innerHTML = `
    <form class="admin-settings-form" id="rateLimitSettingsForm">
      <section class="admin-card admin-form-section">
        <div class="template-custom-head">
          <div>
            <p class="eyebrow">BUSINESS LIMITS</p>
            <h3>业务限制</h3>
            <p class="muted">这些限制会同时影响前台提示和后端校验。脚本拦截、危险链接拦截、越权检查属于安全底线，不提供关闭选项。</p>
          </div>
        </div>
        <div class="form-grid two">
          <label>普通用户测试邮件冷却（小时）<input name="userTestEmailCooldownHours" type="number" min="0" max="720" value="${Number(limits.userTestEmailCooldownHours)}"><small class="muted">0 表示不限制。</small></label>
          <label>订单咨询有效期（天）<input name="orderChatDays" type="number" min="0" max="3650" value="${Number(limits.orderChatDays)}"><small class="muted">0 表示订单咨询不按天数过期。</small></label>
          <label>普通咨询首发条数<input name="generalChatFirstMessages" type="number" min="1" max="20" value="${Number(limits.generalChatFirstMessages)}"><small class="muted">管理员未回复前，普通咨询最多可先发的消息条数。</small></label>
          <label>普通咨询文字上限<input name="generalChatMaxChars" type="number" min="10" max="5000" value="${Number(limits.generalChatMaxChars)}"></label>
          <label>普通咨询图片上限<input name="generalChatMaxImages" type="number" min="0" max="10" value="${Number(limits.generalChatMaxImages)}"></label>
          <label>自由私聊文字上限<input name="chatMaxChars" type="number" min="100" max="12000" value="${Number(limits.chatMaxChars)}"></label>
          <label>自由私聊图片上限<input name="chatMaxImages" type="number" min="0" max="20" value="${Number(limits.chatMaxImages)}"></label>
          <label>反馈标题最短字符<input name="feedbackTitleMinChars" type="number" min="1" max="80" value="${Number(limits.feedbackTitleMinChars)}"></label>
          <label>反馈标题最长字符<input name="feedbackTitleMaxChars" type="number" min="20" max="300" value="${Number(limits.feedbackTitleMaxChars)}"></label>
          <label>反馈内容最短字符<input name="feedbackContentMinChars" type="number" min="1" max="1000" value="${Number(limits.feedbackContentMinChars)}"></label>
          <label>反馈内容最长字符<input name="feedbackContentMaxChars" type="number" min="100" max="20000" value="${Number(limits.feedbackContentMaxChars)}"></label>
          <label>反馈图片上限<input name="feedbackMaxImages" type="number" min="0" max="20" value="${Number(limits.feedbackMaxImages)}"></label>
          <label>反馈奖励最小金额<input name="feedbackRewardMin" type="number" min="0" max="100000" value="${Number(limits.feedbackRewardMin)}"></label>
          <label>反馈奖励最大金额<input name="feedbackRewardMax" type="number" min="0" max="100000" value="${Number(limits.feedbackRewardMax)}"></label>
          <label>反馈奖励默认金额<input name="feedbackRewardDefault" type="number" min="0" max="100000" value="${Number(limits.feedbackRewardDefault)}"></label>
          <label>失败登录统计窗口（分钟）<input name="failedLoginWindowMinutes" type="number" min="1" max="10080" value="${Number(limits.failedLoginWindowMinutes)}"></label>
          <label>失败登录拉黑阈值<input name="failedLoginMaxAttempts" type="number" min="0" max="100" value="${Number(limits.failedLoginMaxAttempts)}"><small class="muted">0 表示不自动拉黑。suimi / 126431 不受此限制。</small></label>
        </div>
      </section>
      <section class="admin-card admin-form-section">
        <div class="template-custom-head">
          <div>
            <p class="eyebrow">RATE LIMITS</p>
            <h3>接口频率限制</h3>
            <p class="muted">按用户或 IP 记录在 D1 的 mall_rate_limits 表中。停用只停用频率限制，不影响权限、安全校验。</p>
          </div>
        </div>
        <div class="rate-limit-grid">
          ${RATE_LIMIT_FIELDS.map(([key, title, description]) => renderRateLimitEditor(key, title, description, limits.rateLimits[key])).join("")}
        </div>
      </section>
      <div class="editor-footer">
        <button class="btn btn-primary" type="submit">保存限制设置</button>
      </div>
    </form>
  `;
  qs("#rateLimitSettingsForm", root).addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      userTestEmailCooldownHours: Number(form.get("userTestEmailCooldownHours")),
      orderChatDays: Number(form.get("orderChatDays")),
      generalChatFirstMessages: Number(form.get("generalChatFirstMessages")),
      generalChatMaxChars: Number(form.get("generalChatMaxChars")),
      generalChatMaxImages: Number(form.get("generalChatMaxImages")),
      chatMaxChars: Number(form.get("chatMaxChars")),
      chatMaxImages: Number(form.get("chatMaxImages")),
      feedbackTitleMinChars: Number(form.get("feedbackTitleMinChars")),
      feedbackTitleMaxChars: Number(form.get("feedbackTitleMaxChars")),
      feedbackContentMinChars: Number(form.get("feedbackContentMinChars")),
      feedbackContentMaxChars: Number(form.get("feedbackContentMaxChars")),
      feedbackMaxImages: Number(form.get("feedbackMaxImages")),
      feedbackRewardMin: Number(form.get("feedbackRewardMin")),
      feedbackRewardMax: Number(form.get("feedbackRewardMax")),
      feedbackRewardDefault: Number(form.get("feedbackRewardDefault")),
      failedLoginWindowMinutes: Number(form.get("failedLoginWindowMinutes")),
      failedLoginMaxAttempts: Number(form.get("failedLoginMaxAttempts")),
      rateLimits: {}
    };
    for (const [key] of RATE_LIMIT_FIELDS) {
      payload.rateLimits[key] = {
        enabled: form.get(`${key}Enabled`) === "true",
        limit: Number(form.get(`${key}Limit`)),
        windowSeconds: Number(form.get(`${key}WindowSeconds`))
      };
    }
    if (payload.feedbackRewardMin > payload.feedbackRewardMax) {
      showToast("反馈奖励最小值不能大于最大值", "error");
      return;
    }
    if (payload.feedbackRewardDefault < payload.feedbackRewardMin || payload.feedbackRewardDefault > payload.feedbackRewardMax) {
      showToast("反馈奖励默认值必须在最小值和最大值之间", "error");
      return;
    }
    await adminSave("/api/mall/admin/settings", { limits: payload }, "限制设置", "PUT");
  });
}

function renderRateLimitEditor(key, title, description, value = {}) {
  const item = { ...DEFAULT_MALL_LIMITS.rateLimits[key], ...(value || {}) };
  return `
    <article class="rate-limit-card">
      <div>
        <strong>${escapeHtml(title)}</strong>
        <p class="muted">${escapeHtml(description)}</p>
      </div>
      <div class="form-grid two compact-form">
        <label>状态
          <select name="${escapeAttr(key)}Enabled">
            <option value="true" ${item.enabled !== false ? "selected" : ""}>启用</option>
            <option value="false" ${item.enabled === false ? "selected" : ""}>停用</option>
          </select>
        </label>
        <label>窗口秒数<input name="${escapeAttr(key)}WindowSeconds" type="number" min="10" max="86400" value="${Number(item.windowSeconds || 3600)}"></label>
        <label style="grid-column:1/-1;">窗口内允许次数<input name="${escapeAttr(key)}Limit" type="number" min="1" max="10000" value="${Number(item.limit || 30)}"></label>
      </div>
    </article>
  `;
}

function renderAdminBackupSettings(root) {
  const backup = state.admin.settings.backup || {};
  const records = state.admin.backupRecords || [];
  const backupScope = normalizeBackupScopeForUi(backup.scope || (backup.includeLogs === false ? ["mall", "users", "games"] : ["all"]));
  const backupState = backup.enabled === false ? "已停用" : `已启用 · ${backup.frequency === "manual" ? "仅手动" : backup.frequency === "hourly" ? "每小时" : backup.frequency === "weekly" ? "每周" : backup.frequency === "monthly" ? "每月" : "每天"} · ${backup.hour ?? 4}:00`;
  const backupRecordSummary = buildBackupRecordSummary(records);
  root.innerHTML = `
    <div class="admin-card backup-summary">
      <div>
        <p class="eyebrow">BACKUP STATUS</p>
        <h3>备份状态</h3>
        <p class="muted">自动备份、保留时长、保存范围都保存在 D1 中，导出和记录下载都可以单独选择范围。</p>
      </div>
      <div class="backup-summary-grid">
        <article><span>当前策略</span><strong>${escapeHtml(backupState)}</strong></article>
        <article><span>保存范围</span><strong>${escapeHtml(formatBackupScopeLabel(backup.scope || ["all"]))}</strong></article>
        <article><span>记录数量</span><strong>${records.length}</strong></article>
        <article><span>最近备份</span><strong>${escapeHtml(backupRecordSummary.lastTime || "-")}</strong></article>
      </div>
    </div>
    <form class="admin-settings-form" id="backupSettingsForm">
      <section class="admin-card admin-form-section">
        <h3>备份功能</h3>
        <div class="form-grid two">
          <label>自动备份
            <select name="backupEnabled">
              <option value="true" ${backup.enabled !== false ? "selected" : ""}>启用</option>
              <option value="false" ${backup.enabled === false ? "selected" : ""}>停用</option>
            </select>
          </label>
          <label>备份频次
            <select name="backupFrequency">
              <option value="manual" ${backup.frequency === "manual" ? "selected" : ""}>仅手动备份</option>
              <option value="hourly" ${backup.frequency === "hourly" ? "selected" : ""}>每小时</option>
              <option value="daily" ${!backup.frequency || backup.frequency === "daily" ? "selected" : ""}>每天</option>
              <option value="weekly" ${backup.frequency === "weekly" ? "selected" : ""}>每周</option>
              <option value="monthly" ${backup.frequency === "monthly" ? "selected" : ""}>每月</option>
            </select>
          </label>
          <label>执行小时<input name="backupHour" type="number" min="0" max="23" value="${Number(backup.hour || 4)}"></label>
          <label>保存时长（天）<input name="backupRetentionDays" type="number" min="1" max="3650" value="${Number(backup.retentionDays || backup.keepDays || 7)}"></label>
        </div>
        <div class="backup-scope-panel">
          <div>
            <strong>保存范围</strong>
            <p class="muted">用于自动备份和后台“按配置导出”。支持多选模块，也可以一键全选或恢复为全部数据。</p>
          </div>
          ${renderBackupScopeControls(backupScope, "backupScope")}
          <div class="scope-check-grid">
            ${renderBackupScopeOptions(backupScope, "backupScope")}
          </div>
        </div>
      </section>
      <div class="editor-footer">
        <button class="btn btn-ghost" type="button" data-run-backup-now>立即按当前配置备份</button>
        <button class="btn btn-primary" type="submit">保存备份配置</button>
      </div>
    </form>
    <div class="admin-module-head">
      <div>
        <p class="eyebrow">BACKUP</p>
        <h3>备份导出</h3>
        <p class="muted">默认导出全部 D1 SQL 数据库备份；也可以勾选指定范围导出。JSON 仅保留为旧备份兼容，不作为完整恢复格式。</p>
      </div>
    </div>
    <div class="admin-card backup-export-card">
      <div class="backup-export-head">
        <div>
          <strong>导出数据库范围</strong>
          <p class="muted">默认导出全部；也可多选模块、直接全选，或者一键切回“全部数据”。</p>
        </div>
        <div class="row-actions compact">
          <button class="btn btn-primary" type="button" data-download-backup>导出 SQL 数据库备份</button>
          <button class="btn btn-ghost" type="button" data-download-json-backup>导出旧版 JSON</button>
          <button class="btn btn-ghost" type="button" data-import-backup>导入备份</button>
        </div>
      </div>
      ${renderBackupScopeControls(["all"], "exportScope")}
      <div class="scope-check-grid">
        ${renderBackupScopeOptions(["all"], "exportScope")}
      </div>
    </div>
    <div class="admin-card">
      <div class="admin-module-head compact-head">
        <div>
          <h3>备份记录</h3>
          <p class="muted">记录里会显示类型、范围、表数量和过期时间。旧记录没有这些字段会显示为兼容记录。</p>
        </div>
        <div class="row-actions compact">
          <span class="badge">手动 ${backupRecordSummary.manual}</span>
          <span class="badge">自动 ${backupRecordSummary.auto}</span>
          <span class="badge">导入 ${backupRecordSummary.imported}</span>
          <span class="badge">保护 ${backupRecordSummary.restoreSafety}</span>
        </div>
      </div>
      ${records.length ? `<table class="admin-table">
        <thead><tr><th>文件名</th><th>类型</th><th>范围</th><th>表数</th><th>大小</th><th>数据状态</th><th>过期</th><th>时间</th><th>操作</th></tr></thead>
        <tbody>${records.map((record) => `
          <tr>
            <td>${escapeHtml(record.name)}</td>
            <td><span class="badge ${backupTypeClass(record.backupType)}">${escapeHtml(backupTypeLabel(record.backupType))}</span></td>
            <td>${escapeHtml(formatBackupScopeLabel(record.scope || ["all"]))}</td>
            <td>${Number(record.tableCount || 0)}</td>
            <td>${formatBytes(record.sizeBytes)}</td>
            <td>${record.hasContent ? `<span class="badge badge-success">已保存</span>` : `<span class="badge badge-muted">旧记录</span>`}</td>
            <td>${record.expiresAt ? formatDate(record.expiresAt) : `<span class="badge badge-muted">未设置</span>`}</td>
            <td>${formatDate(record.createdAt)}</td>
            <td class="row-actions compact">
              <button class="btn btn-small btn-ghost" type="button" data-download-record-backup="${escapeAttr(record.id)}" ${record.hasContent ? "" : "disabled"}>下载</button>
              <button class="btn btn-small btn-ghost" type="button" data-restore-backup="${escapeAttr(record.id)}" ${record.hasContent && String(record.format || "sql").toLowerCase() === "sql" ? "" : "disabled"}>恢复</button>
              <button class="btn btn-small btn-ghost" type="button" data-view-backup="${escapeAttr(record.id)}">详情</button>
              <button class="btn btn-small btn-danger" type="button" data-delete-backup="${escapeAttr(record.id)}">删除</button>
            </td>
          </tr>
        `).join("")}</tbody>
      </table>` : `<div class="empty-state">暂无备份导出记录</div>`}
    </div>
  `;
  qs("#backupSettingsForm", root).addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await adminSave("/api/mall/admin/settings", {
      backup: {
        enabled: form.get("backupEnabled") === "true",
        frequency: form.get("backupFrequency"),
        hour: Number(form.get("backupHour")),
        retentionDays: Number(form.get("backupRetentionDays")),
        keepDays: Number(form.get("backupRetentionDays")),
        scope: readBackupScopeValues(root, "backupScope")
      }
    }, "备份配置", "PUT");
  });
  bindBackupScopeGroup(root, "backupScope");
  bindBackupScopeGroup(root, "exportScope");
  qs("[data-run-backup-now]", root).addEventListener("click", runBackupNow);
  qs("[data-download-backup]", root).addEventListener("click", downloadAdminBackup);
  qs("[data-download-json-backup]", root).addEventListener("click", downloadAdminJsonBackup);
  qs("[data-import-backup]", root).addEventListener("click", openBackupImportModal);
  qsa("[data-download-record-backup]", root).forEach((button) => button.addEventListener("click", () => downloadBackupRecord(button.dataset.downloadRecordBackup)));
  qsa("[data-restore-backup]", root).forEach((button) => button.addEventListener("click", () => restoreBackupRecord(button.dataset.restoreBackup)));
  qsa("[data-view-backup]", root).forEach((button) => button.addEventListener("click", () => openBackupRecordModal(button.dataset.viewBackup)));
  qsa("[data-delete-backup]", root).forEach((button) => button.addEventListener("click", () => adminDelete(`/api/mall/admin/backup/${button.dataset.deleteBackup}`, "备份记录")));
}

function openBackupImportModal() {
  openModal(`
    <p class="eyebrow">BACKUP IMPORT</p>
    <h2 id="modalTitle">导入数据库备份</h2>
    <p class="lead">推荐导入本系统导出的 SQL 备份。SQL 导入会按数据库快照恢复完整数据；旧版 JSON 只作为兼容导入。</p>
    <form class="form-grid" id="backupImportForm">
      <label>导入模式
        <select name="mode">
          <option value="merge">合并导入</option>
          <option value="replace">替换导入</option>
        </select>
      </label>
      <label>选择备份文件<input name="file" type="file" accept=".sql,.json,application/json,text/plain,application/sql" required></label>
      <button class="btn btn-primary" type="submit">开始导入</button>
    </form>
  `);
  qs("#backupImportForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file = form.get("file");
    if (!file || !file.text) {
      showToast("请选择备份文件", "error");
      return;
    }
    if (form.get("mode") === "replace" && !confirm("替换导入会清空后台业务数据后重新导入，确认继续？")) return;
    try {
      const text = await file.text();
      if (/\.sql$/i.test(file.name || "") || text.trimStart().startsWith("-- Linuxdo Mall D1 SQL Backup") || text.trimStart().startsWith("-- Linuxdo-Mall D1 SQL Backup")) {
        if (!confirm("SQL 数据库备份会按快照恢复数据，确认导入？")) return;
        await adminUpload("/api/mall/admin/backup/import", text, "SQL 数据库备份", "application/sql;charset=utf-8");
        return;
      }
      const backup = JSON.parse(text);
      backup.mode = form.get("mode");
      const data = await apiJson("/api/mall/admin/backup/import", {
        method: "POST",
        body: JSON.stringify(backup)
      });
      closeModal();
      showToast(formatImportResult("JSON 备份导入", data));
      await renderAdmin(true);
    } catch (error) {
      showToast(error.message || "备份文件格式错误", "error");
    }
  });
}

function renderPrizeRows(prizes) {
  const rows = normalizePrizeList(prizes);
  return rows.map(renderPrizeRow).join("");
}

function renderPrizeRow(prize) {
  const row = normalizePrizeItem(prize);
  return `
    <div class="prize-row" data-prize-row>
      <label><span>奖项名称</span><input data-prize-label value="${escapeAttr(row.label)}" placeholder="例如：9.5折"></label>
      <label><span>折扣值</span><input data-prize-value type="number" min="0" max="1" step="0.01" value="${escapeAttr(formatPrizeNumber(row.value))}"></label>
      <label><span>中奖概率%</span><input data-prize-weight type="number" min="0" max="100" step="0.01" value="${escapeAttr(formatPrizeNumber(row.weight))}"></label>
      <label class="color-field"><span>颜色</span><input data-prize-color type="color" value="${escapeAttr(row.color)}"></label>
      <button class="btn btn-small btn-danger" type="button" data-remove-prize>删除</button>
    </div>
  `;
}

function readPrizeRows(root) {
  return qsa("[data-prize-row]", root)
    .map((row) => normalizePrizeItem({
      label: qs("[data-prize-label]", row)?.value,
      value: qs("[data-prize-value]", row)?.value,
      weight: qs("[data-prize-weight]", row)?.value,
      color: qs("[data-prize-color]", row)?.value
    }))
    .filter((item) => item.label)
    .slice(0, 50);
}

function normalizePrizeList(prizes) {
  const rows = Array.isArray(prizes) ? prizes : [];
  const normalized = rows
    .map(normalizePrizeItem)
    .filter((item) => item.label)
    .slice(0, 50);
  return normalized.length ? normalized : [
    { label: "谢谢参与", value: 1, weight: 5, color: "#475569" },
    { label: "9.5折", value: 0.95, weight: 35, color: "#2563eb" },
    { label: "9.0折", value: 0.9, weight: 30, color: "#0f766e" },
    { label: "8.5折", value: 0.85, weight: 15, color: "#7c3aed" },
    { label: "免单", value: 0, weight: 0.5, color: "#f59e0b" }
  ];
}

function normalizePrizeItem(prize = {}) {
  return {
    label: String(prize.label || "").trim().slice(0, 40),
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
  if (/^[0-9a-f]{6}$/i.test(text)) text = `#${text}`;
  return /^#[0-9a-f]{6}$/i.test(text) ? text.toLowerCase() : "#2563eb";
}

function formatPrizeNumber(value) {
  return Number(value || 0).toFixed(4).replace(/\.?0+$/, "");
}

function openPrizeImportModal(settingsRoot) {
  openModal(`
    <p class="eyebrow">LOTTERY IMPORT</p>
    <h2 id="modalTitle">导入抽奖奖项</h2>
    <p class="lead">固定格式为：奖项名称,折扣值,中奖概率%,颜色。可直接粘贴 CSV 内容，第一行表头会自动跳过。</p>
    <form class="form-grid" id="prizeImportForm">
      <label>选择 CSV 模板文件<input name="file" type="file" accept=".csv,text/csv,text/plain"></label>
      <label>固定格式 CSV
        <textarea name="csv" required placeholder="奖项名称,折扣值,中奖概率%,颜色&#10;谢谢参与,1,5,#475569&#10;9.5折,0.95,35,#2563eb&#10;免单,0,0.5,#f59e0b"></textarea>
      </label>
      <div class="row-actions compact">
        <button class="btn btn-primary" type="submit">导入并替换当前奖项</button>
        <button class="btn btn-ghost" type="button" data-download-prize-template>导出模板</button>
        <button class="btn btn-ghost" type="button" data-modal-cancel>取消</button>
      </div>
    </form>
  `);
  qs("[data-download-prize-template]").addEventListener("click", downloadLotteryTemplate);
  qs("[data-modal-cancel]").addEventListener("click", closeModal);
  qs("#prizeImportForm input[type='file']").addEventListener("change", async (event) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    qs("#prizeImportForm textarea[name='csv']").value = await file.text();
  });
  qs("#prizeImportForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const prizes = parsePrizeCsv(form.get("csv"));
    if (!prizes.length) {
      showToast("导入内容为空或格式不正确", "error");
      return;
    }
    if (!prizes.some((item) => item.weight > 0)) {
      showToast("至少需要一个中奖概率大于 0 的奖项", "error");
      return;
    }
    const prizeList = qs("[data-prize-list]", settingsRoot);
    prizeList.innerHTML = renderPrizeRows(prizes);
    closeModal();
    showToast(`已导入 ${prizes.length} 个抽奖奖项`);
  });
}

function parsePrizeCsv(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => parseCsvLine(line))
    .filter((cells, index) => !isPrizeCsvHeader(cells, index))
    .map((cells) => normalizePrizeItem({
      label: cells[0],
      value: cells[1],
      weight: cells[2],
      color: cells[3]
    }))
    .filter((item) => item.label)
    .slice(0, 50);
}

function parseCsvLine(line) {
  const delimiter = line.includes("\t") && !line.includes(",") ? "\t" : ",";
  const cells = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === "\"") {
      if (quoted && line[index + 1] === "\"") {
        cell += "\"";
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === delimiter && !quoted) {
      cells.push(cell.trim());
      cell = "";
    } else {
      cell += char;
    }
  }
  cells.push(cell.trim());
  return cells;
}

function isPrizeCsvHeader(cells, index) {
  if (index !== 0) return false;
  const first = String(cells[0] || "").trim().toLowerCase();
  return ["label", "name", "奖项", "奖项名称"].includes(first);
}

function downloadLotteryTemplate() {
  const rows = [
    ["奖项名称", "折扣值", "中奖概率%", "颜色"],
    ["谢谢参与", "1", "5", "#475569"],
    ["9.5折", "0.95", "35", "#2563eb"],
    ["9.0折", "0.9", "30", "#0f766e"],
    ["8.5折", "0.85", "15", "#7c3aed"],
    ["免单", "0", "0.5", "#f59e0b"]
  ];
  downloadFile(
    "lottery-prizes-template.csv",
    `\ufeff${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`,
    "text/csv;charset=utf-8"
  );
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, "\"\"")}"` : text;
}

function renderAdminBlacklist(root) {
  const pageInfo = paginateAdminItems("blacklist", state.admin.blacklist || []);
  const items = pageInfo.items;
  root.innerHTML = `
    <div class="batch-bar">
      <div>
        <h3>风控黑名单</h3>
        <p class="muted">移植原版黑名单模块，支持 IP 和用户名规则，规则保存在 D1。</p>
      </div>
      <button class="btn btn-danger" type="button" data-batch-delete-blacklist>删除选中规则</button>
    </div>
    <div class="admin-card">
      <form class="form-grid two compact-form" id="blacklistForm">
        <label>类型
          <select name="kind">
            <option value="ip">IP</option>
            <option value="user">用户</option>
          </select>
        </label>
        <label>拦截值<input name="value" required placeholder="IP 或用户名"></label>
        <label style="grid-column:1/-1;">原因<input name="reason" placeholder="可选"></label>
        <button class="btn btn-primary" type="submit">添加规则</button>
      </form>
    </div>
    <div class="admin-card">
      ${renderAdminPager("blacklist", pageInfo)}
      ${items.length ? `<table class="admin-table">
        <thead><tr><th>${renderSelectAllHeader("blacklist")}</th><th>类型</th><th>值</th><th>原因</th><th>来源</th><th>时间</th><th>操作</th></tr></thead>
        <tbody>${items.map((item) => `
          <tr>
            <td><input type="checkbox" data-blacklist-check value="${escapeAttr(item.id)}" ${state.selected.has(item.id) ? "checked" : ""}></td>
            <td>${item.kind === "ip" ? "IP" : "用户"}</td>
            <td><strong>${escapeHtml(item.value)}</strong></td>
            <td>${escapeHtml(item.reason || "-")}</td>
            <td>${escapeHtml(item.source || "manual")}</td>
            <td>${formatDate(item.createdAt)}</td>
            <td><button class="btn btn-small btn-danger" type="button" data-delete-blacklist="${escapeAttr(item.id)}">解除</button></td>
          </tr>
        `).join("")}</tbody>
      </table>` : `<div class="empty-state">暂无黑名单规则</div>`}
    </div>
  `;
  qs("#blacklistForm", root).addEventListener("submit", async (event) => {
    event.preventDefault();
    await adminSave("/api/mall/admin/blacklist", Object.fromEntries(new FormData(event.currentTarget).entries()), "黑名单规则");
  });
  qsa("[data-blacklist-check]", root).forEach((item) => item.addEventListener("change", toggleSelected));
  bindSelectAll(root, "blacklist", "[data-blacklist-check]");
  bindAdminPager(root, "blacklist", renderAdminBlacklist);
  qsa("[data-delete-blacklist]", root).forEach((button) => button.addEventListener("click", () => adminDelete(`/api/mall/admin/blacklist/${button.dataset.deleteBlacklist}`, "黑名单规则")));
  qs("[data-batch-delete-blacklist]", root).addEventListener("click", () => adminBatchDelete("/api/mall/admin/blacklist", "ids", "黑名单规则"));
}

function renderAdminEmailTemplates(root) {
  const templates = state.admin.emailTemplates || [];
  root.innerHTML = `
    <div class="batch-bar">
      <div>
        <h3>邮件模板</h3>
        <p class="muted">订单创建和订单交付都会使用这里配置的模板发送邮件。每个场景可设置一个默认模板。</p>
      </div>
      <button class="btn btn-primary" type="button" data-new-template>新建模板</button>
    </div>
    <div class="admin-card">
      ${templates.length ? `<table class="admin-table">
        <thead><tr><th>模板</th><th>场景</th><th>ID</th><th>主题</th><th>自定义参数</th><th>状态</th><th>更新时间</th><th>操作</th></tr></thead>
        <tbody>${templates.map((tpl) => `
          <tr>
            <td><strong>${escapeHtml(tpl.name)}</strong></td>
            <td>${escapeHtml(emailTemplateEventLabel(tpl.eventType))}</td>
            <td><code>${escapeHtml(tpl.id)}</code></td>
            <td>${escapeHtml(tpl.subject)}</td>
            <td>${normalizeEmailTemplateParams(tpl.params).length}</td>
            <td>${tpl.isDefault ? "默认" : "可用"}</td>
            <td>${formatDate(tpl.updatedAt || tpl.createdAt)}</td>
            <td>
              <button class="btn btn-small btn-ghost" type="button" data-preview-template="${escapeAttr(tpl.id)}">预览</button>
              <button class="btn btn-small btn-ghost" type="button" data-edit-template="${escapeAttr(tpl.id)}">编辑</button>
              ${tpl.id !== "default" ? `<button class="btn btn-small btn-danger" type="button" data-delete-template="${escapeAttr(tpl.id)}">删除</button>` : ""}
            </td>
          </tr>
        `).join("")}</tbody>
      </table>` : `<div class="empty-state">暂无邮件模板</div>`}
    </div>
  `;
  qs("[data-new-template]", root).addEventListener("click", () => openEmailTemplateEditor());
  qsa("[data-edit-template]", root).forEach((button) => button.addEventListener("click", () => openEmailTemplateEditor(templates.find((tpl) => tpl.id === button.dataset.editTemplate))));
  qsa("[data-preview-template]", root).forEach((button) => button.addEventListener("click", () => openEmailTemplatePreview(templates.find((tpl) => tpl.id === button.dataset.previewTemplate))));
  qsa("[data-delete-template]", root).forEach((button) => button.addEventListener("click", () => adminDelete(`/api/mall/admin/email-templates/${button.dataset.deleteTemplate}`, "邮件模板")));
}

function renderAdminLoginAttempts(root) {
  const pageInfo = paginateAdminItems("loginAttempts", state.admin.loginAttempts || []);
  const attempts = pageInfo.items;
  root.innerHTML = `
    <div class="batch-bar">
      <div>
        <h3>登录记录</h3>
        <p class="muted">记录 Linux.do 和本地登录的成功、失败、IP 与 User-Agent，用于排查登录问题。</p>
      </div>
      <button class="btn btn-danger" type="button" data-clear-login-attempts>清空记录</button>
    </div>
    <div class="admin-card">
      ${renderAdminPager("loginAttempts", pageInfo)}
      ${attempts.length ? `<table class="admin-table">
        <thead><tr><th>时间</th><th>用户</th><th>IP</th><th>结果</th><th>原因</th><th>User-Agent</th></tr></thead>
        <tbody>${attempts.map((item) => `
          <tr>
            <td>${formatDate(item.createdAt)}</td>
            <td>${escapeHtml(item.username || "-")}</td>
            <td>${escapeHtml(item.ip || "-")}</td>
            <td><span class="badge ${item.success ? "badge-success" : "badge-danger"}">${item.success ? "成功" : "失败"}</span></td>
            <td>${escapeHtml(item.reason || "-")}</td>
            <td>${escapeHtml(item.userAgent || "-")}</td>
          </tr>
        `).join("")}</tbody>
      </table>` : `<div class="empty-state">暂无登录记录</div>`}
    </div>
  `;
  bindAdminPager(root, "loginAttempts", renderAdminLoginAttempts);
  qs("[data-clear-login-attempts]", root).addEventListener("click", () => adminDelete("/api/mall/admin/login-attempts", "登录记录"));
}

function renderAdminBackup(root) {
  const records = state.admin.backupRecords || [];
  root.innerHTML = `
    <div class="admin-module-head">
      <div>
        <p class="eyebrow">BACKUP</p>
        <h3>备份导出</h3>
        <p class="muted">这里默认导出并保存 D1 SQL 数据库备份，可直接用于 D1 内恢复或本地 SQLite 导入；JSON 仅作为旧备份兼容。</p>
      </div>
    </div>
    <div class="admin-card backup-export-card">
      <div class="backup-export-head">
        <div>
          <strong>导出数据库范围</strong>
          <p class="muted">默认导出全部；也可多选模块、直接全选，或者一键切回“全部数据”。</p>
        </div>
        <div class="row-actions compact">
          <button class="btn btn-primary" type="button" data-download-backup>导出 SQL 数据库备份</button>
          <button class="btn btn-ghost" type="button" data-download-json-backup>导出旧版 JSON</button>
        </div>
      </div>
      ${renderBackupScopeControls(["all"], "exportScope")}
      <div class="scope-check-grid">
        ${renderBackupScopeOptions(["all"], "exportScope")}
      </div>
    </div>
    <div class="admin-card">
      ${records.length ? `<table class="admin-table">
        <thead><tr><th>文件名</th><th>格式</th><th>大小</th><th>保存状态</th><th>时间</th><th>操作</th></tr></thead>
        <tbody>${records.map((record) => `
          <tr>
            <td>${escapeHtml(record.name)}</td>
            <td><span class="badge">${escapeHtml((record.format || "sql").toUpperCase())}</span></td>
            <td>${formatBytes(record.sizeBytes)}</td>
            <td>${record.hasContent ? `<span class="badge badge-success">已保存到 D1</span>` : `<span class="badge badge-muted">旧记录</span>`}</td>
            <td>${formatDate(record.createdAt)}</td>
            <td class="row-actions compact">
              <button class="btn btn-small btn-ghost" type="button" data-download-record-backup="${escapeAttr(record.id)}" ${record.hasContent ? "" : "disabled"}>下载</button>
              <button class="btn btn-small btn-ghost" type="button" data-restore-backup="${escapeAttr(record.id)}" ${record.hasContent && String(record.format || "sql").toLowerCase() === "sql" ? "" : "disabled"}>恢复</button>
              <button class="btn btn-small btn-danger" type="button" data-delete-backup="${escapeAttr(record.id)}">删除</button>
            </td>
          </tr>
        `).join("")}</tbody>
      </table>` : `<div class="empty-state">暂无备份导出记录</div>`}
    </div>
  `;
  bindBackupScopeGroup(root, "exportScope");
  qs("[data-download-backup]", root).addEventListener("click", downloadAdminBackup);
  qs("[data-download-json-backup]", root).addEventListener("click", downloadAdminJsonBackup);
  qsa("[data-download-record-backup]", root).forEach((button) => button.addEventListener("click", () => downloadBackupRecord(button.dataset.downloadRecordBackup)));
  qsa("[data-restore-backup]", root).forEach((button) => button.addEventListener("click", () => restoreBackupRecord(button.dataset.restoreBackup)));
  qsa("[data-delete-backup]", root).forEach((button) => button.addEventListener("click", () => adminDelete(`/api/mall/admin/backup/${button.dataset.deleteBackup}`, "备份记录")));
}

function renderAdminMinesweeper(root) {
  root.innerHTML = `<div class="empty-state">正在读取扫雷云端数据...</div>`;
  loadAdminMinesweeper(root).catch((error) => {
    root.innerHTML = `<div class="empty-state">${escapeHtml(error.message || "扫雷数据读取失败")}</div>`;
  });
}

async function loadAdminMinesweeper(root) {
  const data = await apiJson(`/api/mall/admin/minesweeper/overview?_=${Date.now()}`, { cache: "no-store" });
  if (state.currentAdminTab !== "minesweeper") return;
  state.minesweeperAdmin = data;
  state.selected.clear();
  renderAdminMinesweeperPanel(root, data);
}

function renderAdminMinesweeperPanel(root, data) {
  const stats = data.stats || {};
  root.innerHTML = `
    <div class="admin-module-head">
      <div>
        <p class="eyebrow">ACTIVITY MODULE</p>
        <h3>扫雷活动管理</h3>
        <p class="muted">管理扫雷娱乐活动的奖励配置、排行榜、同步存档和用户数据。扫雷继续使用商城 Linux.do 登录状态。</p>
      </div>
      <div class="row-actions compact">
        <a class="btn btn-ghost" href="/games/minesweeper/">打开扫雷</a>
        <button class="btn btn-ghost" type="button" data-refresh-minesweeper>刷新数据</button>
      </div>
    </div>
    <div class="admin-grid">
      ${adminStat("游戏用户", stats.users || 0)}
      ${adminStat("Linux.do 账号", stats.linuxdoAccounts || 0)}
      ${adminStat("登录会话", stats.sessions || 0)}
      ${adminStat("云端存档", stats.syncs || 0)}
      ${adminStat("排行成绩", stats.scores || 0)}
    </div>
    ${renderAdminMinesweeperCampaign(data.couponCampaign)}
    <div class="mine-level-grid">
      ${renderMineLevelCards(data.leaderboardLevels || [])}
    </div>
    <div class="admin-card">
      <div class="batch-bar">
        <div>
          <h3>排行榜成绩</h3>
          <p class="muted">可选择性删除单个用户在指定难度下的最好成绩。</p>
        </div>
        <button class="btn btn-danger" type="button" data-delete-mine-scores>删除选中成绩</button>
      </div>
      ${adminMinesweeperScoresTable(data.topScores || [])}
    </div>
    <div class="admin-card">
      <div class="batch-bar">
        <div>
          <h3>游戏用户与存档</h3>
          <p class="muted">清理游戏存档会同时删除该用户的扫雷同步数据和排行榜成绩；删除用户账号会连同会话和 OAuth 绑定一起删除。</p>
        </div>
        <div class="row-actions compact">
          <button class="btn btn-danger" type="button" data-delete-mine-sync>清理选中游戏数据</button>
          <button class="btn btn-danger" type="button" data-delete-mine-users>删除选中用户账号</button>
        </div>
      </div>
      ${adminMinesweeperUsersTable(data.users || [])}
    </div>
  `;

  qsa("[data-mine-check]", root).forEach((item) => item.addEventListener("change", toggleSelected));
  bindMineUserSelectAll(root);
  qsa("[data-clear-level]", root).forEach((button) => {
    button.addEventListener("click", () => adminMinesweeperClearLevel(button.dataset.clearLevel));
  });
  qs("#minesweeperCampaignSettingsForm", root)?.addEventListener("submit", saveAdminMinesweeperCampaignSettings);
  qs("[data-refresh-minesweeper]", root).addEventListener("click", () => renderAdminMinesweeper(root));
  qs("[data-delete-mine-scores]", root).addEventListener("click", () => adminMinesweeperDeleteScores(root));
  qs("[data-delete-mine-sync]", root).addEventListener("click", () => adminMinesweeperDeleteUserSync(root));
  qs("[data-delete-mine-users]", root).addEventListener("click", () => adminMinesweeperDeleteUsers(root));
}

function renderAdminMinesweeperCampaign(summary = {}) {
  const campaign = summary?.campaign || {};
  const settings = summary?.settings || state.admin?.settings?.minesweeperCampaign || campaign || {};
  const counts = summary?.statusCounts || {};
  const firstClears = summary?.firstClears || [];
  const coupons = summary?.coupons || [];
  const rewards = campaignRewardSentence(campaign);
  return `
    <div class="admin-card minesweeper-campaign-card">
      <div class="batch-bar">
        <div>
          <h3>商城娱乐活动奖励</h3>
          <p class="muted">北京时间 ${escapeHtml(formatDate(campaign.startAt))} - ${escapeHtml(formatDate(campaign.endsAt))}，首通自动券：${escapeHtml(rewards.percentText)}；第一名赏金：${rewards.fixedText}，有效期 ${Number(campaign.validDays || 30)} 天。</p>
        </div>
        <span class="badge ${campaignStatusClass(campaign)}">${escapeHtml(campaignStatusText(campaign))}</span>
      </div>
      <form class="campaign-settings-form" id="minesweeperCampaignSettingsForm">
        <div class="campaign-settings-head">
          <h4>扫雷活动奖励配置</h4>
          <label class="check-row"><input type="checkbox" name="enabled" ${settings.enabled !== false ? "checked" : ""}> 启用活动</label>
        </div>
        <div class="campaign-settings-grid">
          <label>活动 Key<input name="key" value="${escapeAttr(settings.key || campaign.key || "")}" maxlength="80"></label>
          <label>开始时间<input name="startAt" type="datetime-local" value="${escapeAttr(toLocalDatetime(settings.startAt || campaign.startAt))}"></label>
          <label>结束时间<input name="endsAt" type="datetime-local" value="${escapeAttr(toLocalDatetime(settings.endsAt || campaign.endsAt))}"></label>
          <label>优惠券有效期<input name="validDays" type="number" min="1" max="3650" step="1" value="${Number(settings.validDays || campaign.validDays || 30)}"></label>
        </div>
        <div class="campaign-reward-grid">
          ${["beginner", "intermediate", "expert"].map((level) => `
            <fieldset>
              <legend>${escapeHtml(levelLabel(level))}</legend>
              <label>首通折扣券 %<input name="percent:${level}" type="number" min="0" max="100" step="1" value="${getCampaignRewardValue(settings, "levelPercentCoupons", level)}"></label>
              <label>第一名直减<input name="fixed:${level}" type="number" min="0" max="100000" step="1" value="${getCampaignRewardValue(settings, "levelFirstFixedCoupons", level)}"></label>
            </fieldset>
          `).join("")}
        </div>
        <div class="form-actions">
          <button class="btn btn-primary" type="submit">保存活动配置</button>
          <span class="muted">配置保存后，商城首页活动提示、扫雷页和自动发券会同步使用。</span>
        </div>
      </form>
      <div class="admin-grid compact">
        ${adminStat("首通记录", firstClears.length)}
        ${adminStat("可用券", counts.active || 0)}
        ${adminStat("锁定中", counts.reserved || 0)}
        ${adminStat("已使用", counts.used || 0)}
        ${adminStat("已过期", counts.expired || 0)}
      </div>
      <div class="campaign-admin-columns">
        <div>
          <h4>首通排行</h4>
          ${firstClears.length ? `<table class="admin-table compact">
            <thead><tr><th>难度</th><th>名次</th><th>用户</th><th>首通时间</th></tr></thead>
            <tbody>${firstClears.slice(0, 10).map((item) => `
              <tr><td>${escapeHtml(levelLabel(item.level))}</td><td>#${item.rank}</td><td>${escapeHtml(item.username || item.userId)}</td><td>${formatDate(item.firstClearAt)}</td></tr>
            `).join("")}</tbody>
          </table>` : `<div class="empty-state">暂无首通用户</div>`}
        </div>
        <div>
          <h4>活动券记录</h4>
          ${coupons.length ? `<table class="admin-table compact">
            <thead><tr><th>用户</th><th>券</th><th>状态</th><th>过期</th></tr></thead>
            <tbody>${coupons.slice(0, 12).map((coupon) => `
              <tr>
                <td>${escapeHtml(coupon.username || coupon.userId || "-")}</td>
                <td><strong>${escapeHtml(coupon.label || coupon.code)}</strong><br><span class="muted">${escapeHtml(coupon.code || "")}</span></td>
                <td>${escapeHtml(userCouponStatusLabel(coupon.status))}</td>
                <td>${formatDate(coupon.expiresAt)}</td>
              </tr>
            `).join("")}</tbody>
          </table>` : `<div class="empty-state">暂无活动券</div>`}
        </div>
      </div>
    </div>
  `;
}

function renderMineLevelCards(levels) {
  const levelMap = new Map(levels.map((item) => [item.level, item]));
  const cards = ["beginner", "intermediate", "expert"].map((level) => {
    const item = levelMap.get(level) || {};
    return `
      <article class="mine-level-card">
        <span>${levelLabel(level)}</span>
        <strong>${item.entries || 0}</strong>
        <small>最佳 ${formatMineSeconds(item.bestSeconds)}</small>
        <button class="btn btn-small btn-danger" type="button" data-clear-level="${level}">清空本难度</button>
      </article>
    `;
  });
  cards.push(`
    <article class="mine-level-card danger">
      <span>全部难度</span>
      <strong>${levels.reduce((sum, item) => sum + Number(item.entries || 0), 0)}</strong>
      <small>一次清空所有排行榜成绩</small>
      <button class="btn btn-small btn-danger" type="button" data-clear-level="all">清空全部</button>
    </article>
  `);
  return cards.join("");
}

function adminMinesweeperScoresTable(scores) {
  if (!scores.length) return `<div class="empty-state">暂无排行榜成绩</div>`;
  return `
    <table class="admin-table">
      <thead><tr><th></th><th>难度</th><th>排名</th><th>用户</th><th>成绩</th><th>时间</th></tr></thead>
      <tbody>${scores.map((score) => `
        <tr>
          <td><input type="checkbox" data-mine-check value="score:${escapeAttr(score.level)}:${escapeAttr(score.userId)}"></td>
          <td>${levelLabel(score.level)}</td>
          <td>#${score.rank}</td>
          <td><strong>${escapeHtml(score.username || "-")}</strong><br><span class="muted">${escapeHtml(score.userId)}</span></td>
          <td>${formatMineSeconds(score.seconds)}</td>
          <td>${formatDate(score.wonAt)}</td>
        </tr>
      `).join("")}</tbody>
    </table>
  `;
}

function adminMinesweeperUsersTable(users) {
  if (!users.length) return `<div class="empty-state">暂无游戏用户</div>`;
  return `
    <table class="admin-table">
      <thead><tr><th><input type="checkbox" data-select-all-mine-users aria-label="全选当前用户"></th><th>用户</th><th>Linux.do</th><th>排行成绩</th><th>最近同步</th><th>注册时间</th></tr></thead>
      <tbody>${users.map((user) => `
        <tr>
          <td><input type="checkbox" data-mine-check value="mine-user:${escapeAttr(user.id)}"></td>
          <td><strong>${escapeHtml(user.username || "-")}</strong><br><span class="muted">${escapeHtml(user.accountUsername || user.id)}</span></td>
          <td>${escapeHtml(user.linuxdoUsername || "-")}<br><span class="muted">${escapeHtml(user.linuxdoId || "-")}</span></td>
          <td>${user.scoreCount || 0}</td>
          <td>${formatDate(user.lastSyncAt)}</td>
          <td>${formatDate(user.createdAt)}</td>
        </tr>
      `).join("")}</tbody>
    </table>
  `;
}

function bindMineUserSelectAll(root) {
  const all = qs("[data-select-all-mine-users]", root);
  const boxes = qsa('input[data-mine-check][value^="mine-user:"]', root);
  if (!all) return;
  const sync = () => {
    const selectedCount = boxes.filter((box) => state.selected.has(box.value)).length;
    all.checked = boxes.length > 0 && selectedCount === boxes.length;
    all.indeterminate = selectedCount > 0 && selectedCount < boxes.length;
  };
  boxes.forEach((box) => {
    box.addEventListener("change", sync);
  });
  all.addEventListener("change", () => {
    boxes.forEach((box) => {
      box.checked = all.checked;
      if (all.checked) {
        state.selected.add(box.value);
      } else {
        state.selected.delete(box.value);
      }
    });
    sync();
  });
  sync();
}

async function saveAdminMinesweeperCampaignSettings(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const startAt = localDatetimeToIso(form.get("startAt"));
  const endsAt = localDatetimeToIso(form.get("endsAt"));
  if (!startAt || !endsAt || Date.parse(endsAt) <= Date.parse(startAt)) {
    showToast("请填写有效的活动开始和结束时间", "error");
    return;
  }
  const levelPercentCoupons = {};
  const levelFirstFixedCoupons = {};
  ["beginner", "intermediate", "expert"].forEach((level) => {
    levelPercentCoupons[level] = Number(form.get(`percent:${level}`) || 0);
    levelFirstFixedCoupons[level] = Number(form.get(`fixed:${level}`) || 0);
  });
  await adminSave("/api/mall/admin/settings", {
    minesweeperCampaign: {
      enabled: form.get("enabled") === "on",
      key: String(form.get("key") || "").trim(),
      startAt,
      endsAt,
      validDays: Number(form.get("validDays") || 30),
      levelPercentCoupons,
      levelFirstFixedCoupons
    }
  }, "商城娱乐活动配置", "PUT");
}

async function adminMinesweeperClearLevel(level) {
  const safeLevel = level === "all" ? "all" : String(level || "");
  if (!confirm(`确认清空${levelLabel(safeLevel)}排行榜？该操作会永久删除云端成绩。`)) return;
  try {
    await apiJson(`/api/mall/admin/minesweeper/leaderboard?level=${encodeURIComponent(safeLevel)}`, { method: "DELETE" });
    showToast("排行榜已清空");
    renderAdminMinesweeper(qs("#adminContent"));
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function adminMinesweeperDeleteScores(root) {
  const scores = [...state.selected]
    .filter((item) => item.startsWith("score:"))
    .map((item) => {
      const [, level, userId] = item.split(":");
      return { level, userId };
    });
  if (!scores.length) {
    showToast("请先选择排行榜成绩", "error");
    return;
  }
  if (!confirm(`确认删除选中的 ${scores.length} 条扫雷成绩？`)) return;
  try {
    await apiJson("/api/mall/admin/minesweeper/scores", { method: "DELETE", body: JSON.stringify({ scores }) });
    showToast("扫雷成绩已删除");
    renderAdminMinesweeper(root);
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function adminMinesweeperDeleteUserSync(root) {
  const userIds = selectedMineUserIds();
  if (!userIds.length) {
    showToast("请先选择游戏用户", "error");
    return;
  }
  if (!confirm(`确认清理选中 ${userIds.length} 个用户的扫雷存档和成绩？`)) return;
  try {
    await apiJson("/api/mall/admin/minesweeper/user-sync", { method: "DELETE", body: JSON.stringify({ userIds }) });
    showToast("游戏云端数据已清理");
    renderAdminMinesweeper(root);
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function adminMinesweeperDeleteUsers(root) {
  const userIds = selectedMineUserIds();
  if (!userIds.length) {
    showToast("请先选择游戏用户", "error");
    return;
  }
  if (!confirm(`确认删除选中的 ${userIds.length} 个用户账号？该操作会删除登录会话和 Linux.do 绑定。`)) return;
  try {
    await apiJson("/api/mall/admin/minesweeper/users", { method: "DELETE", body: JSON.stringify({ userIds }) });
    showToast("用户账号已删除");
    renderAdminMinesweeper(root);
  } catch (error) {
    showToast(error.message, "error");
  }
}

function selectedMineUserIds() {
  return [...state.selected]
    .filter((item) => item.startsWith("mine-user:"))
    .map((item) => item.slice("mine-user:".length));
}

function adminOrdersTable(orders, selectable = false) {
  if (!orders.length) return `<div class="empty-state">暂无订单</div>`;
  return `
    <table class="admin-table">
      <thead><tr>${selectable ? `<th>${renderSelectAllHeader("orders")}</th>` : ""}<th>订单</th><th>用户</th><th>买家信息</th><th>金额</th><th>状态</th><th>时间</th><th>操作</th></tr></thead>
      <tbody>${orders.map((order) => `
        <tr>
          ${selectable ? `<td><input type="checkbox" data-order-check value="${escapeAttr(order.id)}" ${state.selected.has(order.id) ? "checked" : ""}></td>` : ""}
          <td><strong>${escapeHtml(order.productName)}</strong><br><span class="muted">${escapeHtml(order.id)}</span></td>
          <td>${escapeHtml(order.username || "-")}</td>
          <td>${renderUserInfoSummary(order.userInfo)}</td>
          <td>${renderMoney(order.finalAmount)}</td>
          <td><span class="badge ${orderStatusClass(order.status)}">${orderStatusLabel(order.status)}</span></td>
          <td>${formatDate(order.createdAt)}</td>
          <td>
            ${orderCanManualDeliver(order) ? `<button class="btn btn-small btn-primary" data-deliver-order="${escapeAttr(order.id)}">交付</button>` : ""}
            ${orderCanRefund(order) ? `<button class="btn btn-small btn-ghost" data-refund-order="${escapeAttr(order.id)}">${orderCanCreditRefund(order) ? "原路退款" : "退款"}</button>` : ""}
            <button class="btn btn-small btn-danger" data-delete-order="${escapeAttr(order.id)}">删除</button>
          </td>
        </tr>
      `).join("")}</tbody>
    </table>
  `;
}

function bindAdminOrderActions(root) {
  qsa("[data-deliver-order]", root).forEach((button) => button.addEventListener("click", () => openDeliverModal(button.dataset.deliverOrder)));
  qsa("[data-refund-order]", root).forEach((button) => button.addEventListener("click", () => adminRefundOrder(button.dataset.refundOrder)));
  qsa("[data-delete-order]", root).forEach((button) => button.addEventListener("click", () => adminDelete(`/api/mall/admin/orders/${button.dataset.deleteOrder}`, "订单")));
}

function renderUserInfoSummary(userInfo) {
  const entries = Object.entries(userInfo || {}).filter(([, value]) => String(value || "").trim());
  if (!entries.length) return "-";
  return entries.slice(0, 3).map(([key, value]) => `<span class="muted">${escapeHtml(key)}: ${escapeHtml(value)}</span>`).join("<br>");
}

function adminStat(label, value) {
  return `<article class="stat-card"><span>${escapeHtml(label)}</span><strong>${value && String(value).includes("<") ? value : escapeHtml(value)}</strong></article>`;
}

function smallMetricList(items) {
  if (!items.length) return `<div class="empty-state">暂无数据</div>`;
  return `
    <div class="metric-list">
      ${items.map((item) => `
        <div class="metric-row">
          <span>${escapeHtml(item.label)}</span>
          <strong>${item.valueHtml ? item.value : escapeHtml(item.value)}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function countBy(items) {
  return items.reduce((result, item) => {
    const key = String(item || "");
    result[key] = Number(result[key] || 0) + 1;
    return result;
  }, {});
}

async function adminSetProductStatus(productId, status) {
  const product = state.admin.products.find((item) => item.id === productId);
  if (!product) return;
  const action = status === "deleted" ? "删除" : status === "active" ? "上架" : "下架";
  if (!confirm(`确认${action}商品「${product.name}」？`)) return;
  try {
    await apiJson(`/api/mall/admin/products/${productId}`, {
      method: "PATCH",
      body: JSON.stringify({ ...product, status })
    });
    showToast(`商品已${action}`);
    await renderAdmin(true);
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function adminBatchProductStatus(status) {
  const ids = [...state.selected].filter((id) => state.admin.products.some((product) => product.id === id));
  if (!ids.length) {
    showToast("请先选择商品", "error");
    return;
  }
  const action = status === "deleted" ? "删除" : status === "active" ? "上架" : "下架";
  if (!confirm(`确认批量${action}选中的 ${ids.length} 个商品？`)) return;
  try {
    await apiJson("/api/mall/admin/products", { method: "PATCH", body: JSON.stringify({ ids, status }) });
    state.selected.clear();
    showToast(`商品已批量${action}`);
    await renderAdmin(true);
  } catch (error) {
    showToast(error.message, "error");
  }
}

function openProductEditor(product = null) {
  const imagesText = (product?.images?.length ? product.images : (product?.imageUrl ? [product.imageUrl] : [])).join("\n");
  const supportOptions = ["自动交付", "安全保障", "售后支持"];
  const checkedSupports = new Set(product?.features || []);
  const userFields = product?.userInfoFields?.length ? product.userInfoFields : [
    { name: "contact", label: "接收账号 / 联系方式 / 备注", type: "text", required: true, description: "", options: [] }
  ];
  openModal(`
    <p class="eyebrow">PRODUCT</p>
    <h2 id="modalTitle">${product ? "修改项目参数" : "发布新项目"}</h2>
    <form class="product-editor" id="productForm">
      <section class="editor-section">
        <h3>基础信息</h3>
        <div class="form-grid two">
          <label>商品 ID<input name="id" value="${escapeAttr(product?.id || "系统自动生成")}" disabled></label>
          <label>项目名称<input name="name" required value="${escapeAttr(product?.name || "")}" placeholder="例如：社区大学 DEU 邮箱"></label>
          <label>流转单价<input name="price" type="number" min="0" required value="${product?.price || 0}"></label>
          <label>划线原价<input name="originalPrice" type="number" min="0" value="${product?.originalPrice || product?.price || 0}"></label>
          <label>分类<select name="category">${["account", "code", "credit", "service", "other"].map((c) => `<option value="${c}" ${product?.category === c ? "selected" : ""}>${categoryLabel(c)}</option>`).join("")}</select></label>
          <label>状态<select name="status">${["active", "inactive", "deleted"].map((s) => `<option value="${s}" ${productStatusValue(product?.status) === s ? "selected" : ""}>${productStatusLabel(s)}</option>`).join("")}</select></label>
          <label>支付方式<select name="paymentMode"><option value="credit" ${product?.paymentMode !== "test" ? "selected" : ""}>积分站真实支付</option><option value="test" ${product?.paymentMode === "test" ? "selected" : ""}>测试支付 / 模拟成功</option></select></label>
          <label>交付方式<select name="deliveryMode" id="deliveryMode">
            <option value="manual" ${!["auto", "fixed_link"].includes(product?.deliveryMode || "manual") ? "selected" : ""}>人工交付 / 手动库存</option>
            <option value="auto" ${product?.deliveryMode === "auto" ? "selected" : ""}>卡密自动交付</option>
            <option value="fixed_link" ${product?.deliveryMode === "fixed_link" ? "selected" : ""}>固定网盘链接发货</option>
          </select></label>
          <label>排序<input name="sortOrder" type="number" value="${product?.sortOrder || 0}"></label>
        </div>
      </section>
      <section class="editor-grid">
        <div class="editor-panel accent">
          <label>官方流转同步 Token<input name="officialToken" value="${escapeAttr(product?.officialToken || "")}" placeholder="可选，粘贴官方生成的 Token"></label>
        </div>
        <div class="editor-panel danger">
          <label>库存报警阈值<input name="stockThreshold" type="number" min="0" value="${product?.stockThreshold || 5}"></label>
        </div>
        <div class="editor-panel primary">
          <label>个人限购额度<input name="limitPerUser" type="number" min="0" value="${product?.limitPerUser || 0}" placeholder="0 表示不限购"></label>
        </div>
        <div class="editor-panel warning">
          <label>最低信任等级
            <select name="minTrustLevel">
              ${[0, 1, 2, 3, 4].map((level) => `<option value="${level}" ${Number(product?.minTrustLevel || 0) === level ? "selected" : ""}>级别 ${level}</option>`).join("")}
            </select>
          </label>
        </div>
      </section>
      <section class="editor-section product-stock-section" data-product-stock-section>
        <h3>库存管理</h3>
        <label class="check-row"><input type="checkbox" checked disabled> 启用库存控制</label>
        <div class="form-grid two">
          <label data-auto-stock-field>卡密可用库存<input type="number" min="0" value="${product?.stock || 0}" disabled></label>
          <label data-manual-stock-field>手动库存<input name="manualStock" type="number" min="0" value="${product?.manualStock ?? product?.stock ?? 0}"></label>
        </div>
        <p class="muted" data-stock-mode-hint>卡密自动交付商品的库存按未使用卡密自动统计；人工交付商品需要填写手动库存。</p>
      </section>
      <section class="editor-section" data-fixed-link-section>
        <h3>固定链接发货</h3>
        <div class="fixed-link-toolbar">
          <p class="muted">直接粘贴整段分享文案，系统会自动拆出下载链接、提取码和网盘类型。</p>
          <div class="row-actions">
            <button class="btn btn-small btn-ghost" type="button" data-paste-fixed-link>粘贴识别</button>
            <button class="btn btn-small btn-ghost" type="button" data-add-fixed-link>添加条目</button>
          </div>
        </div>
        <div class="template-param-editor" data-fixed-link-list>
          ${renderFixedLinkRows(product?.fixedDeliveryItems?.length ? product.fixedDeliveryItems : [{
            label: product?.fixedDeliveryLabel || "网盘链接",
            url: product?.fixedDeliveryUrl || "",
            provider: detectNetdiskProvider(product?.fixedDeliveryUrl || ""),
            shareText: product?.fixedDeliveryUrl || ""
          }])}
        </div>
        <p class="muted">选择固定网盘链接发货后，不需要卡券库存，用户支付成功或免单后会自动收到全部已配置链接，可无限发货。</p>
      </section>
      <section class="editor-section">
        <h3>展示内容</h3>
        <div class="form-grid">
          <label>产品简介（支持 Markdown，多行展示）<textarea name="description" placeholder="展示在首页和详情页，支持 Markdown">${escapeHtml(product?.description || "")}</textarea></label>
          <label>使用说明（支持 Markdown，多行展示）<textarea name="usageGuide" placeholder="购买前展示给用户，支持 Markdown">${escapeHtml(product?.usageGuide || "")}</textarea></label>
          <label class="check-row"><input name="afterSaleEnabled" type="checkbox" value="true" ${product?.afterSaleEnabled ? "checked" : ""} data-after-sale-toggle> 当前商品显示售后说明</label>
          <label data-after-sale-guide>售后说明（支持 Markdown，多行展示）<textarea name="afterSaleGuide" placeholder="仅在勾选售后说明时展示给用户">${escapeHtml(product?.afterSaleGuide || "")}</textarea></label>
          <div class="support-check-grid">
            <span>详情页支持标识</span>
            ${supportOptions.map((item) => `
              <label class="check-row"><input name="supports" type="checkbox" value="${escapeAttr(item)}" ${checkedSupports.has(item) ? "checked" : ""}> ${escapeHtml(item)}</label>
            `).join("")}
          </div>
        </div>
      </section>
      <section class="editor-section">
        <h3>图片配置</h3>
        <div class="form-grid">
          <label>商城首页图片 URL<input name="imageUrl" value="${escapeAttr(product?.imageUrl || "")}" placeholder="商品卡片展示图"></label>
          <label>详情页轮播图 URL（每行一个）<textarea name="images" placeholder="轮播图每行一个 URL，第一张会作为详情页首图">${escapeHtml(imagesText)}</textarea></label>
        </div>
      </section>
      <section class="editor-section product-user-fields">
        <h3>买家信息字段</h3>
        <label class="check-row"><input name="requiresUserInfo" type="checkbox" value="true" ${product?.requiresUserInfo ? "checked" : ""}> 购买时要求买家补充信息</label>
        <div class="template-custom-head">
          <p class="muted">字段支持单行文本、多行文本和下拉选择；下拉选项一行一个。</p>
          <button class="btn btn-small btn-ghost" type="button" data-add-user-field>添加字段</button>
        </div>
        <div class="user-field-editor" data-user-field-list>
          ${userFields.map(renderUserFieldEditorRow).join("")}
        </div>
      </section>
      <div class="editor-footer">
        <button class="btn btn-ghost" type="button" data-modal-cancel>取消</button>
        <button class="btn btn-primary" type="submit">${product ? "保存修改" : "保存并立即上架"}</button>
      </div>
    </form>
  `, "wide");
  qs("[data-modal-cancel]").addEventListener("click", closeModal);
  qs("#productForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.price = Number(payload.price);
    payload.originalPrice = Number(payload.originalPrice);
    payload.deliveryMode = form.get("deliveryMode");
    if (payload.deliveryMode === "fixed_link") {
      payload.fixedDeliveryItems = readFixedLinkRows(event.currentTarget);
      if (!payload.fixedDeliveryItems) {
        return;
      }
      payload.fixedDeliveryLabel = payload.fixedDeliveryItems[0]?.label || "网盘链接";
      payload.fixedDeliveryUrl = payload.fixedDeliveryItems[0]?.url || "";
    } else {
      payload.fixedDeliveryItems = [];
      payload.fixedDeliveryLabel = "网盘链接";
      payload.fixedDeliveryUrl = "";
    }
    payload.manualStock = payload.deliveryMode === "auto" || payload.deliveryMode === "fixed_link"
      ? Number(product?.manualStock || 0)
      : Number(form.get("manualStock") || 0);
    payload.stock = payload.deliveryMode === "auto"
      ? Number(product?.stock || 0)
      : payload.deliveryMode === "fixed_link"
        ? 0
      : payload.manualStock;
    payload.sortOrder = Number(payload.sortOrder);
    payload.stockThreshold = Number(payload.stockThreshold);
    payload.limitPerUser = Number(payload.limitPerUser);
    payload.minTrustLevel = Number(payload.minTrustLevel);
    payload.requiresUserInfo = form.get("requiresUserInfo") === "true";
    payload.afterSaleEnabled = form.get("afterSaleEnabled") === "true";
    payload.afterSaleGuide = form.get("afterSaleGuide");
    payload.images = splitLines(form.get("images"));
    payload.features = form.getAll("supports");
    payload.userInfoFields = readUserFieldRows(event.currentTarget);
    if (!payload.userInfoFields) {
      return;
    }
    if (!payload.imageUrl && payload.images.length) {
      payload.imageUrl = payload.images[0];
    }
    await adminSave(product ? `/api/mall/admin/products/${product.id}` : "/api/mall/admin/products", payload, "商品", product ? "PUT" : "POST");
  });
  const deliverySelect = qs("#deliveryMode");
  const syncStockFields = () => syncProductStockFields(qs("#productForm"));
  deliverySelect?.addEventListener("change", syncStockFields);
  syncStockFields();
  qs("[data-after-sale-toggle]")?.addEventListener("change", () => syncAfterSaleFields(qs("#productForm")));
  syncAfterSaleFields(qs("#productForm"));
  const fixedLinkList = qs("[data-fixed-link-list]");
  qs("[data-paste-fixed-link]")?.addEventListener("click", async () => {
    const paste = await navigator.clipboard.readText().catch(() => "");
    if (!paste.trim()) {
      showToast("剪贴板里没有可识别的分享内容", "error");
      return;
    }
    qs("[data-fixed-link-empty]", fixedLinkList)?.remove();
    fixedLinkList.insertAdjacentHTML("beforeend", renderFixedLinkRow({ shareText: paste }));
    const row = qsa("[data-fixed-link-row]", fixedLinkList).at(-1);
    syncFixedLinkRow(row);
    showToast("已解析分享内容");
  });
  qs("[data-add-fixed-link]")?.addEventListener("click", () => {
    qs("[data-fixed-link-empty]", fixedLinkList)?.remove();
    fixedLinkList.insertAdjacentHTML("beforeend", renderFixedLinkRow({ label: "网盘链接", url: "", provider: "unknown" }));
  });
  fixedLinkList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-fixed-link]");
    if (!button) return;
    button.closest("[data-fixed-link-row]")?.remove();
    if (!qsa("[data-fixed-link-row]", fixedLinkList).length) {
      fixedLinkList.innerHTML = renderFixedLinkRows([]);
    }
  });
  fixedLinkList?.addEventListener("input", (event) => {
    const input = event.target.closest('[name="fixedDeliveryItemUrl"], [name="fixedDeliveryItemShareText"], [name="fixedDeliveryItemAccessCode"]');
    if (!input) return;
    syncFixedLinkRow(input.closest("[data-fixed-link-row]"));
  });
  const userFieldList = qs("[data-user-field-list]");
  qs("[data-add-user-field]")?.addEventListener("click", () => {
    userFieldList.insertAdjacentHTML("beforeend", renderUserFieldEditorRow({
      name: `field_${qsa("[data-user-field-row]", userFieldList).length + 1}`,
      label: "新字段",
      type: "text",
      required: false,
      description: "",
      options: []
    }));
  });
  userFieldList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-user-field]");
    if (!button) return;
    button.closest("[data-user-field-row]")?.remove();
  });
}

function syncAfterSaleFields(form) {
  if (!form) return;
  const enabled = qs('[name="afterSaleEnabled"]', form)?.checked;
  const guide = qs("[data-after-sale-guide]", form);
  const textarea = qs('[name="afterSaleGuide"]', form);
  if (guide) guide.hidden = !enabled;
  if (textarea) textarea.disabled = !enabled;
}

function syncProductStockFields(form) {
  if (!form) return;
  const deliveryMode = qs('[name="deliveryMode"]', form)?.value || "manual";
  const isAuto = deliveryMode === "auto";
  const isFixedLink = deliveryMode === "fixed_link";
  const autoField = qs("[data-auto-stock-field]", form);
  const manualField = qs("[data-manual-stock-field]", form);
  const manualInput = qs('[name="manualStock"]', form);
  const fixedSection = qs("[data-fixed-link-section]", form);
  const fixedInputs = qsa("[data-fixed-link-section] input", form);
  const hint = qs("[data-stock-mode-hint]", form);
  if (autoField) autoField.hidden = !isAuto;
  if (manualField) manualField.hidden = isAuto || isFixedLink;
  if (manualInput) manualInput.disabled = isAuto || isFixedLink;
  if (fixedSection) fixedSection.hidden = !isFixedLink;
  fixedInputs.forEach((input) => {
    input.disabled = !isFixedLink;
    input.required = isFixedLink && input.name === "fixedDeliveryItemUrl";
  });
  if (hint) {
    hint.textContent = isFixedLink
      ? "当前商品为固定链接自动交付，不占用卡密库存，可无限发货。"
      : isAuto
        ? "当前商品为卡密自动交付，库存由未使用卡密自动统计，请在卡密管理中导入或下架卡密。"
        : "当前商品为人工交付，请填写手动库存；用户购买后会扣减该库存。";
  }
}

function renderFixedLinkRows(items = []) {
  const rows = Array.isArray(items) && items.length ? items : [];
  return rows.length
    ? rows.map((item) => renderFixedLinkRow(item)).join("")
    : `<div class="empty-state fixed-link-empty" data-fixed-link-empty>暂无网盘链接，点击“粘贴识别”或“添加条目”。</div>`;
}

function renderFixedLinkRow(item = {}) {
  const parsed = parseNetdiskSharePayload(item);
  const provider = parsed.provider;
  return `
    <div class="fixed-link-row" data-fixed-link-row>
      <label class="fixed-link-share">分享文本<textarea name="fixedDeliveryItemShareText" rows="4" placeholder="粘贴整段网盘分享文案，系统会自动识别下载链接和提取码">${escapeHtml(item.shareText || item.url || "")}</textarea></label>
      <div class="fixed-link-meta">
        <label>链接名称<input name="fixedDeliveryItemLabel" maxlength="80" value="${escapeAttr(item.label || "网盘链接")}" placeholder="网盘链接 / 下载地址"></label>
        <label>网盘类型<input name="fixedDeliveryItemProviderLabel" value="${escapeAttr(getNetdiskProviderLabel(provider))}" disabled></label>
        <label>下载链接<input name="fixedDeliveryItemUrl" type="url" value="${escapeAttr(parsed.url || item.url || "")}" placeholder="https://..."></label>
        <label>提取码<input name="fixedDeliveryItemAccessCode" maxlength="16" value="${escapeAttr(parsed.accessCode || item.accessCode || "")}" placeholder="自动识别或手动填写"></label>
      </div>
      <input type="hidden" name="fixedDeliveryItemProvider" value="${escapeAttr(provider)}">
      <button class="btn btn-small btn-danger" type="button" data-remove-fixed-link>删除</button>
    </div>
  `;
}

function readFixedLinkRows(form) {
  const rows = qsa("[data-fixed-link-row]", form);
  const items = [];
  for (const row of rows) {
    const label = qs('[name="fixedDeliveryItemLabel"]', row)?.value.trim() || "网盘链接";
    const shareText = qs('[name="fixedDeliveryItemShareText"]', row)?.value.trim() || "";
    const parsed = parseNetdiskSharePayload({
      shareText,
      url: qs('[name="fixedDeliveryItemUrl"]', row)?.value.trim() || "",
      accessCode: qs('[name="fixedDeliveryItemAccessCode"]', row)?.value.trim() || ""
    });
    const url = parsed.url;
    if (!url) continue;
    const safeUrl = normalizeSafeRenderedUrl(url);
    if (!safeUrl) {
      showToast("固定网盘链接必须是有效的 https 分享地址", "error");
      return null;
    }
    items.push({
      label,
      url: safeUrl,
      provider: detectNetdiskProvider(safeUrl, parsed.provider),
      accessCode: parsed.accessCode || "",
      shareText
    });
  }
  if (!items.length) {
    showToast("至少需要配置一条固定网盘链接", "error");
    return null;
  }
  return items;
}

function syncFixedLinkRow(row) {
  if (!row) return;
  const parsed = parseNetdiskSharePayload({
    shareText: qs('[name="fixedDeliveryItemShareText"]', row)?.value.trim() || "",
    url: qs('[name="fixedDeliveryItemUrl"]', row)?.value.trim() || "",
    accessCode: qs('[name="fixedDeliveryItemAccessCode"]', row)?.value.trim() || ""
  });
  const provider = parsed.provider;
  const providerInput = qs('[name="fixedDeliveryItemProvider"]', row);
  const labelInput = qs('[name="fixedDeliveryItemProviderLabel"]', row);
  const urlInput = qs('[name="fixedDeliveryItemUrl"]', row);
  const codeInput = qs('[name="fixedDeliveryItemAccessCode"]', row);
  if (urlInput && parsed.url) urlInput.value = parsed.url;
  if (codeInput && parsed.accessCode) codeInput.value = parsed.accessCode;
  if (providerInput) providerInput.value = provider;
  if (labelInput) labelInput.value = getNetdiskProviderLabel(provider);
}

function renderUserFieldEditorRow(field = {}) {
  const type = field.type || "text";
  return `
    <div class="user-field-row" data-user-field-row>
      <label>字段名<input name="fieldName" value="${escapeAttr(field.name || "")}" placeholder="contact"></label>
      <label>显示名称<input name="fieldLabel" value="${escapeAttr(field.label || field.name || "")}" placeholder="接收账号"></label>
      <label>类型
        <select name="fieldType">
          <option value="text" ${type === "text" ? "selected" : ""}>单行文本</option>
          <option value="textarea" ${type === "textarea" ? "selected" : ""}>多行文本</option>
          <option value="select" ${type === "select" ? "selected" : ""}>下拉选择</option>
        </select>
      </label>
      <label>必填
        <select name="fieldRequired">
          <option value="false" ${!field.required ? "selected" : ""}>否</option>
          <option value="true" ${field.required ? "selected" : ""}>是</option>
        </select>
      </label>
      <label class="wide">说明<input name="fieldDescription" value="${escapeAttr(field.description || "")}" placeholder="显示给买家的提示"></label>
      <label class="wide">选项<textarea name="fieldOptions" rows="2" placeholder="下拉选择时使用，每行一个">${escapeHtml((field.options || []).join("\n"))}</textarea></label>
      <button class="btn btn-small btn-danger" type="button" data-remove-user-field>删除</button>
    </div>
  `;
}

function readUserFieldRows(form) {
  const rows = qsa("[data-user-field-row]", form);
  const seen = new Set();
  const fields = [];
  for (const row of rows) {
    const name = qs('[name="fieldName"]', row).value.trim();
    const label = qs('[name="fieldLabel"]', row).value.trim();
    if (!name && !label) continue;
    if (!/^[a-zA-Z][a-zA-Z0-9_-]{1,39}$/.test(name)) {
      showToast("买家字段名只能使用字母、数字、下划线或短横线，并以字母开头", "error");
      return null;
    }
    if (seen.has(name)) {
      showToast(`买家字段 ${name} 重复`, "error");
      return null;
    }
    seen.add(name);
    fields.push({
      name,
      label: label || name,
      type: qs('[name="fieldType"]', row).value,
      required: qs('[name="fieldRequired"]', row).value === "true",
      description: qs('[name="fieldDescription"]', row).value.trim(),
      options: splitLines(qs('[name="fieldOptions"]', row).value)
    });
  }
  return fields;
}

function openCardImporter(productId = "") {
  const importableProducts = (state.admin.products || []).filter(canReplenishProduct);
  if (!importableProducts.length) {
    showToast("没有可补货的在售自动交付商品", "error");
    return;
  }
  const selectedProductId = importableProducts.some((product) => product.id === productId)
    ? productId
    : importableProducts[0].id;
  openModal(`
    <p class="eyebrow">CARDS</p>
    <h2 id="modalTitle">导入卡密</h2>
    <form class="form-grid" id="cardForm">
      <label>商品<select name="productId">${importableProducts.map((p) => `<option value="${escapeAttr(p.id)}" ${p.id === selectedProductId ? "selected" : ""}>${escapeHtml(p.name)}</option>`).join("")}</select></label>
      <label>卡密方式
        <select name="mode" data-card-mode>
          <option value="manual">手动导入</option>
          <option value="generate">随机生成带校验卡密</option>
        </select>
      </label>
      <section class="card-import-panel" data-card-manual-panel>
        <label>卡密内容<textarea name="content" required placeholder="一行一条卡密"></textarea></label>
      </section>
      <section class="card-import-panel" data-card-generate-panel hidden>
        <div class="form-grid two">
          <label>卡头<input name="prefix" maxlength="32" placeholder="例如 VIP / XXMALL"></label>
          <label>数量<input name="count" type="number" min="1" max="500" step="1" value="10"></label>
          <label>总长度<input name="length" type="number" min="6" max="64" step="1" value="18"></label>
          <label>字符集<input value="0-9、A-Z" disabled></label>
        </div>
        <p class="settings-hint">随机卡密最后一位是校验码，算法为 Luhn mod 36：卡头和随机部分全部参与计算，支持大写字母和数字。</p>
        <div class="card-code-preview">
          <span>示例</span>
          <code data-card-preview>VIP0000000000000</code>
        </div>
      </section>
      <label>定时上架<input name="availableAt" type="datetime-local"></label>
      <button class="btn btn-primary" type="submit" data-card-submit>导入</button>
    </form>
  `);
  const cardForm = qs("#cardForm");
  const modeSelect = qs("[data-card-mode]", cardForm);
  const syncCardMode = () => {
    const generating = modeSelect.value === "generate";
    qs("[data-card-manual-panel]", cardForm).hidden = generating;
    qs("[data-card-generate-panel]", cardForm).hidden = !generating;
    qs('[name="content"]', cardForm).required = !generating;
    qs("[data-card-submit]", cardForm).textContent = generating ? "生成并导入" : "导入";
    updateCardPreview(cardForm);
  };
  modeSelect.addEventListener("change", syncCardMode);
  ["prefix", "count", "length"].forEach((name) => {
    qs(`[name="${name}"]`, cardForm)?.addEventListener("input", () => updateCardPreview(cardForm));
  });
  syncCardMode();
  cardForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const selectedProduct = (state.admin.products || []).find((product) => product.id === form.get("productId"));
    if (!canReplenishProduct(selectedProduct)) {
      showToast("已下架或已删除商品不能补货", "error");
      return;
    }
    const mode = form.get("mode") === "generate" ? "generate" : "manual";
    const payload = {
      mode,
      productId: form.get("productId"),
      availableAt: form.get("availableAt")
    };
    if (mode === "generate") {
      payload.prefix = normalizeCardPrefixForUi(form.get("prefix"));
      payload.count = Number(form.get("count") || 10);
      payload.length = Number(form.get("length") || 18);
      if (payload.prefix.length >= payload.length) {
        showToast("卡密总长度必须大于卡头长度，最后一位会作为校验码", "error");
        return;
      }
    } else {
      payload.content = form.get("content");
    }
    await adminSave("/api/mall/admin/cards", payload, "卡密");
  });
}

function updateCardPreview(form) {
  const preview = qs("[data-card-preview]", form);
  if (!preview) return;
  const prefix = normalizeCardPrefixForUi(qs('[name="prefix"]', form)?.value || "");
  const length = Math.max(6, Math.min(64, Number(qs('[name="length"]', form)?.value || 18)));
  if (prefix.length >= length) {
    preview.textContent = "卡头长度不能大于或等于总长度";
    return;
  }
  const payloadLength = length - 1;
  const randomPart = "0".repeat(Math.max(0, payloadLength - prefix.length));
  const payload = `${prefix}${randomPart}`.slice(0, payloadLength);
  preview.textContent = `${payload}${calculateCardCheckDigitForUi(payload)}`;
}

function normalizeCardPrefixForUi(value) {
  return String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 32);
}

function calculateCardCheckDigitForUi(payload) {
  const normalized = normalizeCardPrefixForUi(payload);
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

function openCardEditor(card) {
  if (!card) return;
  openModal(`
    <p class="eyebrow">CARD</p>
    <h2 id="modalTitle">编辑卡密</h2>
    <form class="form-grid" id="cardEditForm">
      <label>商品<select name="productId">${state.admin.products.map((p) => `<option value="${escapeAttr(p.id)}" ${p.id === card.productId ? "selected" : ""}>${escapeHtml(p.name)}</option>`).join("")}</select></label>
      <label>状态<select name="status">${["unused", "scheduled", "reserved", "used", "inactive"].map((status) => `<option value="${status}" ${card.status === status ? "selected" : ""}>${cardStatusLabel(status)}</option>`).join("")}</select></label>
      <label>卡密内容<textarea name="content" required>${escapeHtml(card.content || "")}</textarea></label>
      <label>定时上架<input name="availableAt" type="datetime-local" value="${escapeAttr(toLocalDatetime(card.availableAt))}"></label>
      <button class="btn btn-primary" type="submit">保存卡密</button>
    </form>
  `);
  qs("#cardEditForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await adminSave(`/api/mall/admin/cards/${card.id}`, Object.fromEntries(form.entries()), "卡密", "PUT");
  });
}

function openCouponEditor(coupon = null) {
  openModal(`
    <p class="eyebrow">COUPON</p>
    <h2 id="modalTitle">${coupon ? "编辑优惠码" : "新增优惠码"}</h2>
    <form class="form-grid two" id="couponForm">
      <label>代码<input name="code" required placeholder="WELCOME10" value="${escapeAttr(coupon?.code || "")}"></label>
      <label>类型<select name="type"><option value="fixed" ${coupon?.type !== "percent" ? "selected" : ""}>固定抵扣</option><option value="percent" ${coupon?.type === "percent" ? "selected" : ""}>百分比</option></select></label>
      <label>面值<input name="value" type="number" min="0" required value="${coupon?.value || 0}"></label>
      <label>使用上限<input name="limitCount" type="number" min="0" value="${coupon?.limitCount || 0}"></label>
      <label>开始时间<input name="startsAt" type="datetime-local" value="${escapeAttr(toLocalDatetime(coupon?.startsAt))}"></label>
      <label>过期时间<input name="expiresAt" type="datetime-local" value="${escapeAttr(toLocalDatetime(coupon?.expiresAt))}"></label>
      <label>状态<select name="status"><option value="active" ${coupon?.status !== "inactive" ? "selected" : ""}>启用</option><option value="inactive" ${coupon?.status === "inactive" ? "selected" : ""}>停用</option></select></label>
      <label style="grid-column:1/-1;">限制商品<select name="productId"><option value="">全站可用</option>${state.admin.products.map((p) => `<option value="${escapeAttr(p.id)}" ${coupon?.productId === p.id ? "selected" : ""}>${escapeHtml(p.name)}</option>`).join("")}</select></label>
      <button class="btn btn-primary" type="submit">保存</button>
    </form>
  `);
  qs("#couponForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    payload.value = Number(payload.value);
    payload.limitCount = Number(payload.limitCount);
    await adminSave(coupon ? `/api/mall/admin/coupons/${coupon.id}` : "/api/mall/admin/coupons", payload, "优惠码", coupon ? "PUT" : "POST");
  });
}

function openCouponBatchGenerator() {
  openModal(`
    <p class="eyebrow">COUPON BATCH</p>
    <h2 id="modalTitle">批量生成优惠码</h2>
    <form class="form-grid two" id="couponBatchForm">
      <label>前缀<input name="prefix" value="CODE" maxlength="16" placeholder="例如 VIP"></label>
      <label>数量<input name="count" type="number" min="1" max="200" value="10"></label>
      <label>类型<select name="type"><option value="fixed">固定抵扣</option><option value="percent">百分比</option></select></label>
      <label>面值<input name="value" type="number" min="1" required value="10"></label>
      <label>每码可用次数<input name="limitCount" type="number" min="1" value="1"></label>
      <label>状态<select name="status"><option value="active">启用</option><option value="inactive">停用</option></select></label>
      <label>开始时间<input name="startsAt" type="datetime-local"></label>
      <label>过期时间<input name="expiresAt" type="datetime-local"></label>
      <label style="grid-column:1/-1;">限制商品<select name="productId"><option value="">全站可用</option>${state.admin.products.map((p) => `<option value="${escapeAttr(p.id)}">${escapeHtml(p.name)}</option>`).join("")}</select></label>
      <button class="btn btn-primary" type="submit">生成优惠码</button>
    </form>
  `);
  qs("#couponBatchForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    payload.count = Number(payload.count);
    payload.value = Number(payload.value);
    payload.limitCount = Number(payload.limitCount);
    await adminSave("/api/mall/admin/coupons/batch", payload, "批量优惠码");
  });
}

function openAdEditor(ad = null) {
  const style = ad?.style || {};
  openModal(`
    <p class="eyebrow">AD</p>
    <h2 id="modalTitle">${ad ? "编辑广告" : "新增广告"}</h2>
    <form class="form-grid two" id="adForm">
      <label>标题<input name="title" required value="${escapeAttr(ad?.title || "")}"></label>
      <label>位置<select name="position">${["top", "hero", "between_products", "sidebar", "footer", "floating"].map((position) => `<option value="${position}" ${ad?.position === position ? "selected" : ""}>${adPositionLabel(position)}</option>`).join("")}</select></label>
      <label style="grid-column:1/-1;">描述<input name="description" value="${escapeAttr(ad?.description || "")}"></label>
      <label>排序<input name="sortOrder" type="number" value="${ad?.sortOrder || 0}"></label>
      <label>状态<select name="status"><option value="active" ${ad?.status !== "inactive" ? "selected" : ""}>启用</option><option value="inactive" ${ad?.status === "inactive" ? "selected" : ""}>停用</option></select></label>
      <label style="grid-column:1/-1;">图片 URL<input name="imageUrl" value="${escapeAttr(ad?.imageUrl || "")}"></label>
      <label style="grid-column:1/-1;">链接<input name="linkUrl" value="${escapeAttr(ad?.linkUrl || "")}"></label>
      <label>布局<select name="layout">${["card", "banner", "media", "compact"].map((value) => `<option value="${value}" ${style.layout === value ? "selected" : ""}>${adLayoutLabel(value)}</option>`).join("")}</select></label>
      <label>主题<select name="theme">${["blue", "green", "amber", "red", "gray"].map((value) => `<option value="${value}" ${style.theme === value ? "selected" : ""}>${adThemeLabel(value)}</option>`).join("")}</select></label>
      <label>尺寸<select name="size">${["small", "medium", "large"].map((value) => `<option value="${value}" ${style.size === value ? "selected" : ""}>${adSizeLabel(value)}</option>`).join("")}</select></label>
      <label>图片模式<select name="imageMode">${["cover", "contain", "none"].map((value) => `<option value="${value}" ${style.imageMode === value ? "selected" : ""}>${adImageModeLabel(value)}</option>`).join("")}</select></label>
      <label>按钮文字<input name="buttonText" value="${escapeAttr(style.buttonText || "查看")}"></label>
      <label>开始时间<input name="startsAt" type="datetime-local" value="${escapeAttr(toLocalDatetime(ad?.startsAt))}"></label>
      <label>结束时间<input name="endsAt" type="datetime-local" value="${escapeAttr(toLocalDatetime(ad?.endsAt))}"></label>
      <button class="btn btn-primary" type="submit">保存</button>
    </form>
  `);
  qs("#adForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    payload.sortOrder = Number(payload.sortOrder);
    payload.style = {
      layout: payload.layout,
      theme: payload.theme,
      size: payload.size,
      imageMode: payload.imageMode,
      buttonText: payload.buttonText
    };
    await adminSave(ad ? `/api/mall/admin/ads/${ad.id}` : "/api/mall/admin/ads", payload, "广告", ad ? "PUT" : "POST");
  });
}

function adPositionLabel(value) {
  return {
    top: "顶部广告",
    hero: "首页横幅",
    between_products: "商品列表前",
    sidebar: "侧边栏",
    footer: "底部广告",
    floating: "悬浮广告"
  }[value] || value;
}

function adLayoutLabel(value) {
  return { card: "卡片", banner: "横幅", media: "图文", compact: "紧凑" }[value] || value;
}

function adThemeLabel(value) {
  return { blue: "蓝色", green: "绿色", amber: "琥珀", red: "红色", gray: "灰色" }[value] || value;
}

function adSizeLabel(value) {
  return { small: "小", medium: "中", large: "大" }[value] || value;
}

function adImageModeLabel(value) {
  return { cover: "裁切填充", contain: "完整显示", none: "不显示图片" }[value] || value;
}

function openDeliverModal(orderId) {
  const order = state.admin.recentOrders.find((item) => item.id === orderId);
  openModal(`
    <p class="eyebrow">DELIVERY</p>
    <h2 id="modalTitle">交付订单</h2>
    <p class="lead">${escapeHtml(order?.productName || orderId)}</p>
    <form class="form-grid" id="deliverForm">
      <label>交付内容<textarea name="deliveryContent" placeholder="自动交付商品可留空，系统会取卡密。"></textarea></label>
      <label>备注<input name="note" value="订单已完成"></label>
      <button class="btn btn-primary" type="submit">确认交付</button>
    </form>
  `);
  qs("#deliverForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    payload.action = "deliver";
    await adminSave(`/api/mall/admin/orders/${orderId}`, payload, "订单", "PATCH");
  });
}

function openEmailTemplateEditor(template = null) {
  const eventType = normalizeEmailTemplateEventType(template?.eventType);
  const defaultSubject = eventType === "order_created" ? "您的订单已创建 - {order_id}" : "您的订单已完成交付 - {order_id}";
  const defaultContent = eventType === "order_created"
    ? "您好 {username}，您的订单已创建。\n\n商品：{product_name}\n订单号：{order_id}\n实付：{amount}\n状态：{order_status}\n下单时间：{order_time}\n\n感谢使用 {site_name}。"
    : "您好 {username}，订单 {order_id} 已完成交付。\n\n商品：{product_name}\n交付内容：\n{delivery_note}\n\n感谢使用 {site_name}。";
  const params = normalizeEmailTemplateParams(template?.params);
  openModal(`
    <p class="eyebrow">EMAIL</p>
    <h2 id="modalTitle">${template ? "编辑邮件模板" : "新建邮件模板"}</h2>
    <form class="form-grid" id="templateForm">
      <label>模板 ID<input name="id" value="${escapeAttr(template?.id || "")}" ${template ? "disabled" : ""} placeholder="留空自动生成"></label>
      <label>模板名称<input name="name" required value="${escapeAttr(template?.name || "")}"></label>
      <label>发信场景<select name="eventType">${EMAIL_TEMPLATE_EVENT_TYPES.map(([value, label]) => `<option value="${value}" ${eventType === value ? "selected" : ""}>${label}</option>`).join("")}</select></label>
      <label>邮件主题<input name="subject" required value="${escapeAttr(template?.subject || defaultSubject)}"></label>
      <label class="check-row"><input name="isDefault" type="checkbox" value="true" ${template?.isDefault ? "checked" : ""}> 设为默认模板</label>
      <div class="email-template-grid">
        <label class="email-template-content">邮件内容<textarea name="content" required placeholder="{username} {order_id} {product_name} {delivery_note} {site_name}">${escapeHtml(template?.content || defaultContent)}</textarea></label>
        <aside class="template-param-panel">
          <h3>系统参数</h3>
          <p class="muted">在主题或内容中写入花括号参数，发送时会自动替换为对应订单数据。</p>
          <div class="template-param-list">
            ${EMAIL_TEMPLATE_PARAMS.map((param) => renderTemplateParamHelp(param)).join("")}
          </div>
        </aside>
      </div>
      <section class="template-custom-params">
        <div class="template-custom-head">
          <div>
            <h3>自定义参数</h3>
            <p class="muted">自定义参数用于模板预留额外变量，例如 {service_contact}、{renew_link}。预览值用于后台预览；实际发信会替换系统参数，自定义参数没有传入值时会显示为空。</p>
          </div>
          <button class="btn btn-small btn-ghost" type="button" data-add-template-param>添加参数</button>
        </div>
        <div class="template-param-editor" data-template-param-list>
          ${params.map(renderTemplateParamRow).join("") || `<div class="empty-state" data-empty-template-param>暂无自定义参数</div>`}
        </div>
      </section>
      <button class="btn btn-primary" type="submit">保存模板</button>
    </form>
  `, "wide");
  qs("[data-add-template-param]")?.addEventListener("click", () => {
    const list = qs("[data-template-param-list]");
    qs("[data-empty-template-param]", list)?.remove();
    list.insertAdjacentHTML("beforeend", renderTemplateParamRow(createDefaultTemplateParam(list)));
  });
  qs("[data-template-param-list]")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-template-param]");
    if (!button) return;
    button.closest("[data-template-param-row]")?.remove();
    const list = qs("[data-template-param-list]");
    if (!qsa("[data-template-param-row]", list).length) {
      list.innerHTML = `<div class="empty-state" data-empty-template-param>暂无自定义参数</div>`;
    }
  });
  qs("#templateForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.id = template?.id || payload.id;
    payload.eventType = form.get("eventType") || "order_delivered";
    payload.isDefault = form.get("isDefault") === "true";
    payload.params = readTemplateParamRows(event.currentTarget);
    if (!payload.params) return;
    await adminSave(template ? `/api/mall/admin/email-templates/${template.id}` : "/api/mall/admin/email-templates", payload, "邮件模板", template ? "PUT" : "POST");
  });
}

function openEmailTemplatePreview(template) {
  if (!template) return;
  const subject = applyTemplatePreview(template.subject, template.params);
  const content = applyTemplatePreview(template.content, template.params);
  openModal(`
    <p class="eyebrow">PREVIEW</p>
    <h2 id="modalTitle">${escapeHtml(subject)}</h2>
    <div class="delivery-box">${renderDeliveryContent(content)}</div>
  `);
}

function applyTemplatePreview(content, params = []) {
  const values = {
    username: state.user?.linuxdo?.username || state.user?.username || "suimi",
    order_id: "demo-order-id",
    product_name: "示例商品",
    delivery_note: "这里会显示交付内容或卡密凭证。",
    site_name: state.settings?.siteInfo?.title || "Linuxdo Mall",
    order_time: new Date().toLocaleString("zh-CN"),
    delivery_time: new Date().toLocaleString("zh-CN"),
    order_status: "待支付",
    payment_mode: "积分站支付",
    delivery_mode: "自动发货",
    amount: formatMoneyText(50),
    note: "示例备注"
  };
  for (const param of normalizeEmailTemplateParams(params)) {
    values[param.key] = param.sample || `{${param.key}}`;
  }
  return String(content || "").replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`);
}

function normalizeEmailTemplateEventType(value) {
  return EMAIL_TEMPLATE_EVENT_TYPES.some(([eventType]) => eventType === value) ? value : "order_delivered";
}

function emailTemplateEventLabel(value) {
  const item = EMAIL_TEMPLATE_EVENT_TYPES.find(([eventType]) => eventType === normalizeEmailTemplateEventType(value));
  return item ? item[1] : "订单交付通知";
}

function renderTemplateParamHelp(param) {
  return `
    <div class="template-param-help">
      <code>{${escapeHtml(param.key)}}</code>
      <div>
        <strong>${escapeHtml(param.label)}</strong>
        <span>${escapeHtml(param.description)}</span>
      </div>
    </div>
  `;
}

function renderTemplateParamRow(param) {
  return `
    <div class="template-param-row" data-template-param-row>
      <label>参数名<input name="paramKey" required value="${escapeAttr(param.key || "")}" placeholder="service_contact"></label>
      <label>显示名称<input name="paramLabel" value="${escapeAttr(param.label || "")}" placeholder="客服联系方式"></label>
      <label>说明<input name="paramDescription" value="${escapeAttr(param.description || "")}" placeholder="这个参数代表什么"></label>
      <label>预览值<input name="paramSample" value="${escapeAttr(param.sample || "")}" placeholder="后台预览时替换的值"></label>
      <button class="btn btn-small btn-danger" type="button" data-remove-template-param>删除</button>
    </div>
  `;
}

function createDefaultTemplateParam(list) {
  const used = new Set(readRawTemplateParamRows(list).map((item) => item.key).filter(Boolean));
  let index = used.size + 1;
  while (used.has(`custom_param_${index}`)) index += 1;
  return {
    key: `custom_param_${index}`,
    label: `自定义参数${index}`,
    description: "自定义模板参数",
    sample: "示例值"
  };
}

function normalizeEmailTemplateParams(value) {
  return Array.isArray(value)
    ? value.map((item) => ({
      key: String(item?.key || "").trim(),
      label: String(item?.label || "").trim(),
      description: String(item?.description || "").trim(),
      sample: String(item?.sample || "").trim()
    })).filter((item) => item.key)
    : [];
}

function normalizeTemplateParamKey(value) {
  return String(value || "").trim().toLowerCase();
}

function readRawTemplateParamRows(form) {
  return qsa("[data-template-param-row]", form).map((row) => ({
    key: normalizeTemplateParamKey(qs('[name="paramKey"]', row).value),
    label: qs('[name="paramLabel"]', row).value.trim(),
    description: qs('[name="paramDescription"]', row).value.trim(),
    sample: qs('[name="paramSample"]', row).value.trim()
  }));
}

function readTemplateParamRows(form) {
  const rows = readRawTemplateParamRows(form);
  const reserved = new Set(EMAIL_TEMPLATE_PARAMS.map((item) => item.key));
  const seen = new Set();
  const params = [];
  for (const item of rows) {
    const hasAnyValue = item.key || item.label || item.description || item.sample;
    if (!hasAnyValue) continue;
    if (!item.key) {
      showToast("自定义参数必须填写参数名", "error");
      return null;
    }
    if (!/^[a-z][a-z0-9_]{1,39}$/.test(item.key)) {
      showToast("参数名只能使用小写字母、数字、下划线，并以字母开头，例如 service_contact", "error");
      return null;
    }
    if (reserved.has(item.key)) {
      showToast(`{${item.key}} 是系统参数，不能作为自定义参数`, "error");
      return null;
    }
    if (seen.has(item.key)) {
      showToast(`自定义参数 {${item.key}} 重复`, "error");
      return null;
    }
    seen.add(item.key);
    params.push(item);
  }
  return params;
}

async function adminSave(path, payload, label, method = "POST") {
  try {
    const data = await apiJson(path, { method, body: JSON.stringify(payload) });
    if (data.settings) {
      state.settings = data.settings;
      if (state.admin) state.admin.settings = data.settings;
      applySettings();
    }
    if (data.feedback && state.admin) {
      state.admin.feedback = updateById(state.admin.feedback || [], data.feedback);
    }
    if (data.ldcLedger && state.admin) {
      state.admin.ldcLedger = data.ldcLedger;
    }
    if (data.feedbackLogs && state.admin) {
      state.admin.feedbackLogs = data.feedbackLogs;
    }
    closeModal();
    showToast(`${label}已保存`);
    await renderAdmin(true);
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function adminUpload(path, content, label, type = "text/plain;charset=utf-8") {
  try {
    const data = await apiJson(path, {
      method: "POST",
      headers: { "Content-Type": type },
      body: content
    });
    closeModal();
    showToast(formatImportResult(label, data));
    await renderAdmin(true);
  } catch (error) {
    showToast(error.message, "error");
  }
}

function formatImportResult(label, data = {}) {
  const imported = Number(data.imported || 0);
  const skipped = Number(data.skippedExact || 0);
  if (data.duplicate || (imported === 0 && skipped > 0)) {
    return `${label}未导入：内容完全一致，已跳过 ${skipped} 条`;
  }
  if (skipped > 0) {
    return `${label}已导入 ${imported} 条，完全一致跳过 ${skipped} 条`;
  }
  return `${label}已导入，共处理 ${imported} 条`;
}

async function adminDelete(path, label) {
  if (!confirm(`确认删除${label}？`)) return;
  try {
    await apiJson(path, { method: "DELETE", body: JSON.stringify({}) });
    showToast(`${label}已删除`);
    await renderAdmin(true);
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function adminBatchDelete(path, key, label) {
  const ids = [...state.selected];
  if (!ids.length) {
    showToast("请先选择数据", "error");
    return;
  }
  if (!confirm(`确认删除选中的 ${ids.length} 条${label}？`)) return;
  try {
    await apiJson(path, { method: "DELETE", body: JSON.stringify({ [key]: ids, ids }) });
    state.selected.clear();
    showToast(`${label}已批量删除`);
    await renderAdmin(true);
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function adminRefundOrder(orderId) {
  const order = state.admin?.recentOrders?.find((item) => item.id === orderId);
  const message = orderCanCreditRefund(order)
    ? "确认调用积分站接口原路退款？成功后订单会标记为已退款，库存/卡密会同步处理。"
    : "确认将该订单退款？测试支付、免单或未支付订单只会在本地标记，并恢复库存/释放未交付卡密。";
  if (!confirm(message)) return;
  try {
    await apiJson(`/api/mall/admin/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({ action: "refund", note: "管理员已标记退款" })
    });
    showToast(orderCanCreditRefund(order) ? "积分站原路退款已完成" : "订单已退款");
    await renderAdmin(true);
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function refreshChatConversations() {
  if (!state.user) return;
  const data = await apiJson(`/api/mall/chat?_=${Date.now()}`, { cache: "no-store" });
  state.chat.conversations = data.conversations || [];
}

async function hydrateChat() {
  if (!state.user) return;
  await refreshChatConversations();
  if (!state.chat.activeConversationId && state.chat.conversations.length) {
    state.chat.activeConversationId = state.chat.conversations[0].id;
  }
  if (state.chat.open && state.chat.activeConversationId) {
    state.chat.messages = [];
    await loadChatMessages(state.chat.activeConversationId);
  }
  renderChatDock();
  if (state.chat.conversations.length || state.chat.open) {
    startChatPolling();
  }
}

async function openChatForContext(context = {}) {
  if (!state.user) {
    showToast("请先登录", "error");
    return;
  }
  try {
    renderChatDock();
    const data = await apiJson("/api/mall/chat", {
      method: "POST",
      body: JSON.stringify(context)
    });
    state.chat.conversations = updateConversationList(state.chat.conversations, data.conversation);
    state.chat.activeConversationId = data.conversation?.id || state.chat.conversations[0]?.id || "";
    state.chat.open = true;
    state.chat.position = null;
    await loadChatMessages(state.chat.activeConversationId);
    renderChatDock();
    startChatPolling();
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function loadChatMessages(conversationId) {
  if (!conversationId) return;
  const afterId = Math.max(0, ...state.chat.messages.map((message) => Number(message.id || 0)));
  let data;
  try {
    data = await apiJson(`/api/mall/chat/${conversationId}/messages?afterId=${afterId}&_=${Date.now()}`, { cache: "no-store" });
  } catch (error) {
    if (String(error.message || "").includes("会话不存在") || String(error.message || "").includes("conversation")) {
      state.chat.conversations = (state.chat.conversations || []).filter((item) => item.id !== conversationId);
      if (state.admin?.chatConversations) {
        state.admin.chatConversations = state.admin.chatConversations.filter((item) => item.id !== conversationId);
      }
      state.chat.messages = [];
      if (state.chat.activeConversationId === conversationId) state.chat.activeConversationId = "";
      renderChatDock();
      return;
    }
    throw error;
  }
  const messages = data.messages || [];
  if (afterId === 0) {
    state.chat.messages = messages;
  } else if (messages.length) {
    const seen = new Set(state.chat.messages.map((message) => message.id));
    state.chat.messages = [...state.chat.messages, ...messages.filter((message) => !seen.has(message.id))];
  }
  if (data.conversation) {
    const updateList = (list) => {
      const index = list.findIndex((item) => item.id === data.conversation.id);
      if (index >= 0) list[index] = data.conversation;
      return list;
    };
    state.chat.conversations = updateList(state.chat.conversations);
    if (state.admin?.chatConversations) {
      state.admin.chatConversations = updateList(state.admin.chatConversations);
    }
  }
}

async function sendChatMessage(content, admin = false, imageUrl = "") {
  const text = String(content || "").trim();
  const image = String(imageUrl || "").trim();
  if (!text && !image) return;
  const conversationId = state.chat.activeConversationId;
  if (!conversationId) {
    await openChatForContext({ subject: "商城咨询" });
  }
  const targetId = state.chat.activeConversationId;
  if (!targetId) {
    showToast("会话创建失败，请稍后重试", "error");
    return;
  }
  const data = await apiJson(`/api/mall/chat/${targetId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content: text, imageUrl: image })
  });
  if (data.message) state.chat.messages.push(data.message);
  if (data.conversation) {
    if (admin && state.admin) {
      state.admin.chatConversations = updateConversationList(state.admin.chatConversations || [], data.conversation);
    } else {
      state.chat.conversations = updateConversationList(state.chat.conversations, data.conversation);
    }
  }
  renderChatDock();
}

function updateConversationList(list, conversation) {
  const next = [conversation, ...list.filter((item) => item.id !== conversation.id)];
  return next.sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
}

function updateById(list, item) {
  if (!item?.id) return list || [];
  const next = [item, ...(list || []).filter((entry) => entry.id !== item.id)];
  return next.sort((a, b) => String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || "")));
}

async function refreshAdminChat() {
  const data = await apiJson(`/api/mall/chat?scope=admin&_=${Date.now()}`, { cache: "no-store" });
  state.admin.chatConversations = data.conversations || [];
  if (state.chat.activeConversationId) {
    await loadChatMessages(state.chat.activeConversationId);
  }
  if (state.currentAdminTab === "chat") {
    renderAdminChat(qs("#adminContent"));
  }
}

async function refreshAdminChatListOnly() {
  const data = await apiJson(`/api/mall/chat?scope=admin&_=${Date.now()}`, { cache: "no-store" });
  state.admin.chatConversations = data.conversations || [];
}

async function setAdminChatStatus(conversationId, action) {
  const nextAction = action === "reopen" ? "reopen" : "close";
  const actionLabel = nextAction === "reopen" ? "重新开启" : "关闭";
  if (!conversationId || !confirm(`确认${actionLabel}这个私聊会话？`)) return;
  try {
    await apiJson(`/api/mall/chat/${conversationId}`, {
      method: "PATCH",
      body: JSON.stringify({ action: nextAction })
    });
    showToast(nextAction === "reopen" ? "会话已重新开启" : "会话已关闭");
    await refreshAdminChat();
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function deleteAdminChat(conversationId) {
  if (!conversationId || !confirm("确认删除这个私聊会话？删除后用户和管理员都会清空该会话的所有聊天记录，无法恢复。")) return;
  try {
    const data = await apiJson(`/api/mall/chat/${conversationId}`, {
      method: "DELETE",
      body: JSON.stringify({})
    });
    const deletedId = data.deletedId || conversationId;
    state.admin.chatConversations = (state.admin.chatConversations || []).filter((item) => item.id !== deletedId);
    state.chat.messages = [];
    state.chat.activeConversationId = "";
    state.chat.adminOpenedConversationId = false;
    showToast("私聊会话已删除");
    await refreshAdminChatListOnly();
    renderAdminTabs();
    renderAdminChat(qs("#adminContent"));
  } catch (error) {
    showToast(error.message, "error");
  }
}

function updateUserMenuChatEntry({ hidden = false, unread = 0, conversations = [] } = {}) {
  const button = qs("[data-user-menu-chat]");
  if (!button) return;
  button.hidden = hidden;
  button.classList.toggle("has-unread", unread > 0);
  const badge = qs("[data-chat-unread]", button);
  if (badge) {
    badge.hidden = unread <= 0;
    badge.textContent = unread > 99 ? "99+" : String(unread);
  }
  const hint = qs("#userMenuChatHint", button);
  if (hint) {
    hint.textContent = conversations.length ? `${conversations.length} 个会话` : "订单咨询和普通咨询";
  }
}

function renderChatDock() {
  if (isFrontMaintenanceLocked() || !state.user || state.user?.isAdmin || currentPath() === "/admin") {
    if (chatDock) {
      chatDock.hidden = true;
      chatDock.innerHTML = "";
    }
    updateUserMenuChatEntry({ hidden: true });
    state.chat.open = false;
    if (chatWindowPortal) {
      chatWindowPortal.hidden = true;
      chatWindowPortal.innerHTML = "";
    }
    return;
  }
  const conversations = state.chat.conversations || [];
  const unread = conversations.reduce((sum, item) => sum + Number(item.unreadUser || 0), 0);
  const activeId = state.chat.activeConversationId || conversations[0]?.id || "";
  if (activeId) state.chat.activeConversationId = activeId;
  const activeConversation = conversations.find((conversation) => conversation.id === activeId) || null;
  const limits = getMallLimitsForUi();
  const generalChat = Boolean(!activeConversation || !activeConversation.orderId);
  const restrictedGeneralChat = Boolean(generalChat && !activeConversation?.adminReplied);
  const waitingAdminReply = Boolean(activeConversation && restrictedGeneralChat && activeConversation.lastSender === "user");
  const chatLimitText = restrictedGeneralChat
    ? `普通咨询限制：管理员回复前最多先发 ${limits.generalChatFirstMessages} 条；文字不超过 ${limits.generalChatMaxChars} 字，可附 ${limits.generalChatMaxImages} 张图片。`
    : generalChat
    ? "管理员已回复：当前会话可自由对话，支持文字、安全 Markdown、常见 HTML 快捷写法和图片 URL。"
    : `订单咨询：支持文字、安全 Markdown、常见 HTML 快捷写法和图片 URL；${Number(limits.orderChatDays || 0) > 0 ? `订单创建超过 ${limits.orderChatDays} 天后不可继续咨询。` : "订单咨询不设置天数过期。"}`;
  updateUserMenuChatEntry({ hidden: false, unread, conversations });
  if (chatDock) {
    chatDock.hidden = true;
    chatDock.innerHTML = "";
  }
  renderChatWindowPortal({
    conversations,
    activeId,
    activeMessages: state.chat.messages.length
      ? renderChatMessageList(state.chat.messages)
      : `<div class="empty-state">${activeId ? "正在读取消息..." : "可以先发送一条普通咨询，管理员回复前不能继续发送。"}</div>`,
    chatLimitText,
    limits,
    waitingAdminReply,
    restrictedGeneralChat
  });
}

function renderChatWindowPortal({ conversations, activeId, activeMessages, chatLimitText, limits, waitingAdminReply, restrictedGeneralChat }) {
  if (!chatWindowPortal) return;
  if (!state.chat.open) {
    chatWindowPortal.hidden = true;
    chatWindowPortal.innerHTML = "";
    return;
  }
  chatWindowPortal.hidden = false;
  chatWindowPortal.innerHTML = `
    <section class="chat-window" ${getChatWindowPositionStyle()}>
      <header class="chat-window-head" data-chat-drag-handle>
        <div>
          <strong>联系管理员</strong>
          <small>${conversations.length ? `${conversations.length} 个会话` : "商城咨询"}</small>
        </div>
        <button class="icon-button" type="button" data-chat-toggle aria-label="收起">×</button>
      </header>
      <div class="chat-window-body">
        <section class="chat-main-pane">
          ${conversations.length > 1 ? `
            <div class="chat-thread-tabs">
              ${conversations.slice(0, 5).map((conversation) => `
                <button class="${conversation.id === activeId ? "is-active" : ""}" type="button" data-chat-thread="${escapeAttr(conversation.id)}">
                  ${escapeHtml(conversation.subject || "咨询")}
                </button>
              `).join("")}
            </div>
          ` : ""}
          <div class="chat-messages" data-chat-messages>${activeMessages}</div>
          <p class="chat-rule">${escapeHtml(chatLimitText)}</p>
          ${waitingAdminReply ? `<p class="chat-hint">已发送普通咨询，请等待管理员回复后再继续发送。</p>` : ""}
          <div class="chat-compose-shell">
            <form class="chat-compose" data-chat-form>
              <textarea name="content" maxlength="${restrictedGeneralChat ? Number(limits.generalChatMaxChars || 100) : Number(limits.chatMaxChars || 2000)}" ${waitingAdminReply ? "disabled" : ""} placeholder="${restrictedGeneralChat ? `普通咨询最多 ${Number(limits.generalChatMaxChars || 100)} 字` : "支持 Markdown 或 h1 快捷标题，禁止脚本和带属性 HTML"}"></textarea>
              <input name="imageUrl" type="url" ${waitingAdminReply ? "disabled" : ""} placeholder="图片 URL 或 Bing 图片页，可选：png / jpg / gif / webp / avif">
              <button class="btn btn-primary" type="submit" ${waitingAdminReply ? "disabled" : ""}>发送</button>
            </form>
          </div>
        </section>
        <aside class="chat-side-pane">
          ${renderMarkdownAssist()}
        </aside>
      </div>
    </section>
  `;
  qs("[data-chat-toggle]", chatWindowPortal)?.addEventListener("click", () => {
    state.chat.open = false;
    renderChatDock();
  });
  qsa("[data-chat-thread]", chatWindowPortal).forEach((button) => button.addEventListener("click", async () => {
    state.chat.activeConversationId = button.dataset.chatThread;
    state.chat.messages = [];
    await loadChatMessages(state.chat.activeConversationId);
    renderChatDock();
  }));
  qs("[data-chat-form]", chatWindowPortal)?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const textarea = form.elements.content;
    const content = textarea.value;
    const imageUrl = form.elements.imageUrl?.value || "";
    const button = qs("button[type='submit']", form);
    button.disabled = true;
    try {
      await sendChatMessage(content, false, imageUrl);
      form.reset();
      await loadChatMessages(state.chat.activeConversationId);
      updateChatDockSoft();
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      button.disabled = false;
      textarea.focus();
    }
  });
  const textarea = qs("[data-chat-form] textarea", chatWindowPortal);
  if (textarea) {
    textarea.addEventListener("keydown", handleChatTextareaKeydown);
  }
  bindMarkdownAssist(chatWindowPortal);
  bindChatWindowDrag(chatWindowPortal);
  const messageBox = qs("[data-chat-messages]", chatWindowPortal);
  if (messageBox) messageBox.scrollTop = messageBox.scrollHeight;
}

function getChatWindowPositionStyle() {
  const position = state.chat.position;
  if (!position) {
    return "";
  }
  return `style="--chat-left:${Math.round(position.left)}px;--chat-top:${Math.round(position.top)}px;--chat-transform:none;"`;
}

function bindChatWindowDrag(root = document) {
  const chatWindow = qs(".chat-window", root);
  const handle = qs("[data-chat-drag-handle]", root);
  if (!chatWindow || !handle) return;
  keepChatWindowInBounds(chatWindow);
  handle.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    if (event.target.closest("button, a, input, textarea, select")) return;
    const rect = chatWindow.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    chatWindow.classList.add("is-dragging");
    chatWindow.style.setProperty("--chat-transform", "none");
    event.preventDefault();
    handle.setPointerCapture?.(event.pointerId);

    const moveWindow = (moveEvent) => {
      const next = clampChatWindowPosition(
        moveEvent.clientX - offsetX,
        moveEvent.clientY - offsetY,
        chatWindow
      );
      state.chat.position = next;
      chatWindow.style.setProperty("--chat-left", `${Math.round(next.left)}px`);
      chatWindow.style.setProperty("--chat-top", `${Math.round(next.top)}px`);
    };

    const stopDrag = (upEvent) => {
      handle.releasePointerCapture?.(upEvent.pointerId);
      chatWindow.classList.remove("is-dragging");
      window.removeEventListener("pointermove", moveWindow);
      window.removeEventListener("pointerup", stopDrag);
      window.removeEventListener("pointercancel", stopDrag);
    };

    window.addEventListener("pointermove", moveWindow);
    window.addEventListener("pointerup", stopDrag);
    window.addEventListener("pointercancel", stopDrag);
  });
}

function keepChatWindowInBounds(chatWindow) {
  if (!state.chat.position) return;
  const next = clampChatWindowPosition(state.chat.position.left, state.chat.position.top, chatWindow);
  state.chat.position = next;
  chatWindow.style.setProperty("--chat-left", `${Math.round(next.left)}px`);
  chatWindow.style.setProperty("--chat-top", `${Math.round(next.top)}px`);
}

function clampChatWindowPosition(left, top, chatWindow) {
  const rect = chatWindow.getBoundingClientRect();
  const margin = 12;
  const maxLeft = Math.max(margin, window.innerWidth - rect.width - margin);
  const maxTop = Math.max(margin, window.innerHeight - rect.height - margin);
  return {
    left: Math.min(Math.max(margin, left), maxLeft),
    top: Math.min(Math.max(margin, top), maxTop)
  };
}

function handleChatTextareaKeydown(event) {
  if (event.key !== "Enter" || event.shiftKey || event.isComposing) {
    return;
  }
  event.preventDefault();
  event.currentTarget.form?.requestSubmit();
}

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

function getMarkdownGuides() {
  const guides = Array.isArray(state.settings?.markdownGuides) ? state.settings.markdownGuides : [];
  const source = guides.length ? guides : DEFAULT_MARKDOWN_GUIDES;
  return source.map((item) => ({
    title: String(item.title || "").trim(),
    keyword: String(item.keyword || "").trim(),
    code: String(item.code || "").trim(),
    note: String(item.note || "").trim()
  })).filter((item) => item.title && item.code);
}

function renderMarkdownAssist() {
  const guides = getMarkdownGuides();
  return `
    <aside class="markdown-assist" data-markdown-assist>
      <div class="markdown-assist-head">
        <strong>Markdown</strong>
        <span>实时查询</span>
      </div>
      <input class="markdown-search" type="search" data-md-search placeholder="查语法：图片 / 链接 / 表格">
      <div class="markdown-guide-list">
        ${guides.map((item) => `
          <button class="markdown-guide" type="button" data-md-guide="${escapeAttr(item.keyword)}" data-md-template="${escapeAttr(item.code)}">
            <strong>${escapeHtml(item.title)}</strong>
            <code>${escapeHtml(item.code)}</code>
            <span>${escapeHtml(item.note)}</span>
          </button>
        `).join("")}
      </div>
      <div class="markdown-compat">
        支持常见无属性 HTML 快捷写法，会自动转为 Markdown；脚本和带属性标签会拒绝。
      </div>
    </aside>
    <aside class="markdown-preview" data-markdown-preview-panel>
      <div class="markdown-preview-head">
        <strong>实时预览</strong>
        <span>发送前显示效果</span>
      </div>
      <div data-md-preview>输入 Markdown 后在这里预览</div>
    </aside>
  `;
}

function bindMarkdownAssist(root = document) {
  qsa("[data-markdown-assist]", root).forEach((assist) => {
    const shell = assist.closest(".chat-window-body") || assist.closest(".chat-compose-shell") || assist.closest(".feedback-form") || assist.closest("form") || assist.parentElement;
    const textarea = qs("textarea", shell || document);
    const search = qs("[data-md-search]", assist);
    const preview = qs("[data-md-preview]", shell || assist);
    const refreshPreview = () => {
      if (!preview || !textarea) return;
      const value = textarea.value.trim();
      preview.innerHTML = value ? renderSafeMarkdown(value) : "输入 Markdown 后在这里预览";
    };
    search?.addEventListener("input", () => {
      const query = search.value.trim().toLowerCase();
      qsa("[data-md-guide]", assist).forEach((item) => {
        const haystack = `${item.dataset.mdGuide || ""} ${item.textContent || ""}`.toLowerCase();
        item.hidden = Boolean(query && !haystack.includes(query));
      });
    });
    qsa("[data-md-template]", assist).forEach((button) => {
      button.addEventListener("click", () => {
        if (!textarea || textarea.disabled) return;
        const insert = button.dataset.mdTemplate || "";
        const start = textarea.selectionStart ?? textarea.value.length;
        const end = textarea.selectionEnd ?? textarea.value.length;
        const prefix = textarea.value.slice(0, start);
        const suffix = textarea.value.slice(end);
        const needsSpace = prefix && !/[\s\n]$/.test(prefix);
        textarea.value = `${prefix}${needsSpace ? "\n" : ""}${insert}${suffix}`;
        const caret = prefix.length + (needsSpace ? 1 : 0) + insert.length;
        textarea.focus();
        textarea.setSelectionRange(caret, caret);
        refreshPreview();
      });
    });
    textarea?.addEventListener("input", refreshPreview);
    refreshPreview();
  });
}

function updateChatDockSoft() {
  if (!state.user) return;
  if (!state.chat.open) {
    renderChatDock();
    return;
  }
  const root = chatWindowPortal || chatDock || document;
  const messageBox = qs("[data-chat-messages]", root);
  if (messageBox) {
    const nearBottom = messageBox.scrollHeight - messageBox.scrollTop - messageBox.clientHeight < 80;
    messageBox.innerHTML = renderChatMessageList(state.chat.messages);
    if (nearBottom) messageBox.scrollTop = messageBox.scrollHeight;
  }
  qsa("[data-chat-thread]", root).forEach((button) => {
    button.classList.toggle("is-active", button.dataset.chatThread === state.chat.activeConversationId);
  });
  const countLabel = qs(".chat-window-head small", root);
  if (countLabel) {
    countLabel.textContent = state.chat.conversations.length ? `${state.chat.conversations.length} 个会话` : "商城咨询";
  }
}

function renderChatMessageList(messages) {
  if (!messages.length) return `<div class="empty-state">暂无消息</div>`;
  return messages.map((message) => `
    <article class="chat-message ${message.senderRole === "admin" ? "from-admin" : "from-user"}">
      <div>
        <strong>${escapeHtml(message.senderName || (message.senderRole === "admin" ? "管理员" : "买家"))}</strong>
        <span>${formatDate(message.createdAt)}</span>
      </div>
      <div class="chat-message-content">${renderSafeMarkdown(message.content)}</div>
    </article>
  `).join("");
}

function renderSafeMarkdown(value) {
  const source = normalizeSafeHtmlMarkdownInput(String(value || "").slice(0, 4000));
  if (!source.trim()) return "";

  const codeBlocks = [];
  const fenced = source.replace(/(?:```|~~~)(?:([a-z0-9_-]+)\n)?([\s\S]*?)(?:```|~~~)/gi, (_match, language, code) => {
    const token = `__CHAT_CODE_${codeBlocks.length}__`;
    const lang = String(language || "").slice(0, 30);
    codeBlocks.push(`<pre><code${lang ? ` data-lang="${escapeAttr(lang)}"` : ""}>${escapeHtml(code.replace(/^\n/, "").replace(/\n$/, ""))}</code></pre>`);
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
    blocks.push(`<p>${paragraph.map((line) => renderSafeMarkdownInline(line)).join("<br>")}</p>`);
    paragraph = [];
  };
  const flushQuote = () => {
    if (!quote.length) return;
    blocks.push(`<blockquote>${quote.map((line) => renderSafeMarkdownInline(line)).join("<br>")}</blockquote>`);
    quote = [];
  };
  const flushList = () => {
    if (!listItems.length) return;
    const tag = listType === "ol" ? "ol" : "ul";
    const listClass = listType === "task" ? " class=\"task-list\"" : "";
    blocks.push(`<${tag}${listClass}>${listItems.map((item) => `<li>${item}</li>`).join("")}</${tag}>`);
    listType = "";
    listItems = [];
  };
  const flushTable = () => {
    if (!tableHeader) return;
    const header = `<tr>${tableHeader.map((cell) => `<th>${renderSafeMarkdownInline(cell)}</th>`).join("")}</tr>`;
    const body = tableRows.map((row) => `<tr>${row.map((cell) => `<td>${renderSafeMarkdownInline(cell)}</td>`).join("")}</tr>`).join("");
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
    const trimmed = lines[index].trim();
    if (!trimmed) {
      flushAll();
      continue;
    }
    const codeTokenMatch = trimmed.match(/^__CHAT_CODE_(\d+)__$/);
    if (codeTokenMatch) {
      flushAll();
      blocks.push(codeBlocks[Number(codeTokenMatch[1])] || "");
      continue;
    }
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushAll();
      const level = headingMatch[1].length;
      blocks.push(`<h${level}>${renderSafeMarkdownInline(headingMatch[2])}</h${level}>`);
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
      if (listType && listType !== nextType) flushList();
      listType = nextType;
      const content = taskMatch ? taskMatch[2] : orderedMatch ? orderedMatch[1] : unorderedMatch[1];
      listItems.push(taskMatch
        ? `<label class="task-item"><input type="checkbox" ${taskMatch[1].toLowerCase() === "x" ? "checked" : ""} disabled> ${renderSafeMarkdownInline(content)}</label>`
        : renderSafeMarkdownInline(content));
      continue;
    }
    flushList();
    const tableCandidate = trimmed.includes("|");
    const nextLine = lines[index + 1] ? lines[index + 1].trim() : "";
    const separatorLine = /^\|?[:\-\s|]+\|?$/.test(nextLine) && nextLine.includes("-");
    if (!tableHeader && tableCandidate && separatorLine) {
      flushAll();
      tableHeader = splitMarkdownTableRow(trimmed);
      index += 1;
      continue;
    }
    if (tableHeader && tableCandidate) {
      tableRows.push(splitMarkdownTableRow(trimmed));
      continue;
    }
    flushTable();
    paragraph.push(trimmed);
  }
  flushAll();
  return blocks.join("").replace(/__CHAT_CODE_(\d+)__/g, (_match, index) => codeBlocks[Number(index)] || "");
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

function renderSafeMarkdownInline(value) {
  let text = String(value ?? "");
  const tokens = [];
  const stash = (html) => {
    const token = `@@CHAT_INLINE_${tokens.length}@@`;
    tokens.push(html);
    return token;
  };
  text = text.replace(/`([^`\n]+)`/g, (_match, code) => stash(`<code>${escapeHtml(code)}</code>`));
  text = text.replace(/!\[([^\]]{0,80})]\((https?:\/\/(?:[^)\s<]+\.)?bing\.com\/images\/search\?[^)\s<]+)\)/gi, (_match, alt) => (
    stash(`<span class="chat-image-pending">${escapeHtml(alt || "Bing 图片")}：发送后自动解析真实图片</span>`)
  ));
  text = text.replace(/!\[([^\]]{0,80})]\((https?:\/\/(?:th\.bing\.com|[^)\s<]+\.mm\.bing\.net)\/[^)\s<]+)\)/gi, (_match, alt, src) => {
    const safeSrc = normalizeSafeRenderedUrl(src, { image: true });
    return safeSrc ? stash(`<img class="chat-image" src="${escapeAttr(safeSrc)}" alt="${escapeAttr(alt || "图片")}" loading="lazy">`) : escapeHtml(_match);
  });
  text = text.replace(/!\[([^\]]{0,80})]\((https?:\/\/[^)\s<]+?\.(?:png|jpe?g|gif|webp|avif)(?:[?#][^)\s<]*)?)\)/gi, (_match, alt, src) => {
    const safeSrc = normalizeSafeRenderedUrl(src, { image: true });
    return safeSrc ? stash(`<img class="chat-image" src="${escapeAttr(safeSrc)}" alt="${escapeAttr(alt || "图片")}" loading="lazy">`) : escapeHtml(_match);
  });
  text = text.replace(/\[([^\]]+)]\((https?:\/\/[^)\s<]+)\)/gi, (_match, label, href) => {
    const safeHref = normalizeSafeRenderedUrl(href);
    return safeHref ? stash(`<a href="${escapeAttr(safeHref)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`) : escapeHtml(_match);
  });
  text = escapeHtml(text);
  text = text
    .replace(/~~([^~\n]+)~~/g, "<del>$1</del>")
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
  return text.replace(/@@CHAT_INLINE_(\d+)@@/g, (_match, index) => tokens[Number(index)] || "");
}

function normalizeSafeRenderedUrl(value, options = {}) {
  const raw = String(value || "").trim();
  if (!raw || /[\s<>"'`\\]/.test(raw)) return "";
  let url;
  try {
    url = new URL(raw);
  } catch {
    return "";
  }
  if (!["https:"].includes(url.protocol) || url.username || url.password) return "";
  const host = url.hostname.toLowerCase();
  if (!host || host === "localhost" || host.endsWith(".localhost") || host === "0.0.0.0") return "";
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host)) {
    const parts = host.split(".").map((part) => Number(part));
    const [a, b] = parts;
    if (parts.some((part) => part < 0 || part > 255) || a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)) {
      return "";
    }
  }
  if (options.image) {
    const isImagePath = /\.(?:png|jpe?g|gif|webp|avif)$/i.test(url.pathname);
    const isTrustedBingImage = host === "th.bing.com" || host.endsWith(".mm.bing.net");
    if (!isImagePath && !isTrustedBingImage) return "";
  }
  return url.toString();
}

function splitMarkdownTableRow(row) {
  return row
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function startChatPolling() {
  stopChatPolling();
  if (!state.user || (!state.chat.open && !state.chat.conversations.length)) return;
  state.chat.pollTimer = setInterval(async () => {
    try {
      await refreshChatConversations();
      if (state.chat.open && state.chat.activeConversationId) {
        await loadChatMessages(state.chat.activeConversationId);
      }
      updateChatDockSoft();
    } catch {
      // 静默等待下一次轮询。
    }
  }, 5000);
}

function stopChatPolling() {
  if (state.chat.pollTimer) {
    clearInterval(state.chat.pollTimer);
    state.chat.pollTimer = null;
  }
}

function startAdminChatPolling() {
  if (state.chat.adminPollTimer) return;
  state.chat.adminPollTimer = setInterval(async () => {
    if (state.currentAdminTab !== "chat") {
      clearInterval(state.chat.adminPollTimer);
      state.chat.adminPollTimer = null;
      return;
    }
    try {
      await refreshAdminChatListOnly();
      if (state.chat.activeConversationId) {
        await loadChatMessages(state.chat.activeConversationId);
        renderAdminChatMessages(qs("#adminContent"));
      }
    } catch {
      // 后台轮询失败时等待下一轮。
    }
  }, 5000);
}

function downloadJson(name, data) {
  downloadFile(`${name}-${Date.now()}.json`, JSON.stringify(data, null, 2), "application/json;charset=utf-8");
}

function downloadFile(filename, content, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  link.remove();
}

async function runBackupNow() {
  const root = qs("#adminContent") || document;
  const scope = readBackupScopeValues(root, "backupScope");
  const retentionDays = Number(qs('[name="backupRetentionDays"]', root)?.value || state.admin?.settings?.backup?.retentionDays || 7);
  if (!confirm(`立即生成一份 SQL 备份？\n范围：${formatBackupScopeLabel(scope)}\n保存时长：${retentionDays} 天`)) return;
  try {
    const data = await apiJson("/api/mall/admin/backup/run", {
      method: "POST",
      body: JSON.stringify({ scope, retentionDays })
    });
    showToast(`备份已生成：${data.record?.name || "SQL 备份"}`);
    await renderAdmin(true);
  } catch (error) {
    showToast(error.message || "备份生成失败", "error");
  }
}

function buildBackupExportUrl(format) {
  const params = new URLSearchParams({ format });
  for (const scope of readBackupScopeValues(document, "exportScope")) {
    params.append("scope", scope);
  }
  return `/api/mall/admin/backup/export?${params.toString()}`;
}

function downloadAdminBackup() {
  location.href = buildBackupExportUrl("sql");
}

function downloadAdminJsonBackup() {
  location.href = buildBackupExportUrl("json");
}

function downloadBackupRecord(recordId) {
  if (!recordId) return;
  location.href = `/api/mall/admin/backup/${encodeURIComponent(recordId)}/download`;
}

function openBackupRecordModal(recordId) {
  const record = (state.admin?.backupRecords || []).find((item) => item.id === recordId);
  if (!record) {
    showToast("备份记录不存在", "error");
    return;
  }
  const canDownload = Boolean(record.hasContent);
  const canRestore = canDownload && String(record.format || "sql").toLowerCase() === "sql";
  openModal(`
    <p class="eyebrow">BACKUP RECORD</p>
    <h2 id="modalTitle">备份记录详情</h2>
    <div class="backup-detail">
      <div class="backup-detail-name">
        <strong>${escapeHtml(record.name)}</strong>
        <span class="badge ${backupTypeClass(record.backupType)}">${escapeHtml(backupTypeLabel(record.backupType))}</span>
      </div>
      <div class="backup-detail-grid">
        <article><span>记录 ID</span><strong>${escapeHtml(record.id)}</strong></article>
        <article><span>格式</span><strong>${escapeHtml((record.format || "sql").toUpperCase())}</strong></article>
        <article><span>范围</span><strong>${escapeHtml(formatBackupScopeLabel(record.scope || ["all"]))}</strong></article>
        <article><span>表数量</span><strong>${Number(record.tableCount || 0)}</strong></article>
        <article><span>文件大小</span><strong>${formatBytes(record.sizeBytes)}</strong></article>
        <article><span>创建人</span><strong>${escapeHtml(record.createdBy || "-")}</strong></article>
        <article><span>创建时间</span><strong>${formatDate(record.createdAt)}</strong></article>
        <article><span>过期时间</span><strong>${record.expiresAt ? formatDate(record.expiresAt) : "未设置"}</strong></article>
        <article><span>保存状态</span><strong>${record.hasContent ? "内容已保存到 D1" : "旧记录，仅有文件名和大小"}</strong></article>
      </div>
      <p class="muted">恢复 SQL 备份会先自动生成一份恢复保护备份，然后按该备份中的范围覆盖对应数据。JSON 旧格式只用于兼容导入，不支持一键完整恢复。</p>
      <div class="row-actions compact">
        <button class="btn btn-primary" type="button" data-modal-download-backup ${canDownload ? "" : "disabled"}>下载备份</button>
        <button class="btn btn-ghost" type="button" data-modal-restore-backup ${canRestore ? "" : "disabled"}>恢复 SQL</button>
      </div>
    </div>
  `, "wide");
  qs("[data-modal-download-backup]")?.addEventListener("click", () => downloadBackupRecord(record.id));
  qs("[data-modal-restore-backup]")?.addEventListener("click", () => restoreBackupRecord(record.id));
}

async function restoreBackupRecord(recordId) {
  if (!recordId) return;
  if (!confirm("确认从这个 D1 备份恢复数据？恢复会覆盖当前业务数据，备份记录本身会保留。")) return;
  try {
    const data = await apiJson(`/api/mall/admin/backup/${encodeURIComponent(recordId)}/restore`, {
      method: "POST",
      body: JSON.stringify({})
    });
    closeModal();
    showToast(formatImportResult("备份恢复", data));
    await renderAdmin(true);
  } catch (error) {
    showToast(error.message || "备份恢复失败", "error");
  }
}

function formatBytes(value) {
  const bytes = Number(value || 0);
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function toLocalDatetime(value) {
  if (!value) return "";
  const date = parseAppDate(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function localDatetimeToIso(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function getCampaignRewardValue(campaign, key, level) {
  const source = campaign?.[key];
  if (source && typeof source === "object" && !Array.isArray(source)) {
    return Number(source[level] || 0);
  }
  const rows = Array.isArray(source) ? source : [];
  const item = rows.find((row) => row.level === level);
  return Number(item?.value || 0);
}

function campaignRewardSentence(campaign = {}) {
  const percentText = ["beginner", "intermediate", "expert"]
    .map((level) => `${levelLabel(level)} ${getCampaignRewardValue(campaign, "levelPercentCoupons", level)}%`)
    .join(" / ");
  const fixedText = ["beginner", "intermediate", "expert"]
    .map((level) => `${levelLabel(level)} ${renderMoney(getCampaignRewardValue(campaign, "levelFirstFixedCoupons", level))}`)
    .join(" / ");
  return { percentText, fixedText };
}

function campaignStatusText(campaign = {}) {
  if (campaign.enabled === false) return "已停用";
  if (campaign.active) return "进行中";
  if (campaign.ended) return "已结束";
  if (campaign.started) return "已暂停";
  return "未开始";
}

function campaignStatusClass(campaign = {}) {
  if (campaign.enabled === false) return "badge-muted";
  if (campaign.active) return "badge-success";
  if (campaign.ended) return "badge-muted";
  if (campaign.started) return "badge-warning";
  return "badge-muted";
}

function toggleSelected(event) {
  const id = event.currentTarget.value;
  if (event.currentTarget.checked) {
    state.selected.add(id);
  } else {
    state.selected.delete(id);
  }
}

function renderHotList() {
  const root = qs("#hotList");
  root.innerHTML = "";
  const items = state.hotProducts
    .filter((item) => Number(item.sales || 0) > 0)
    .sort((left, right) => Number(right.sales || 0) - Number(left.sales || 0))
    .slice(0, 10);
  if (!items.length) {
    root.appendChild(emptyState("暂无热销商品"));
    return;
  }
  items.forEach((item, index) => {
    const link = document.createElement("a");
    link.className = "rank-item";
    link.href = `/product/${encodeURIComponent(item.id)}`;
    link.innerHTML = `<span class="rank-badge">${index + 1}</span><span><strong>${escapeHtml(item.name)}</strong><small>销量 ${Number(item.sales || 0).toLocaleString("zh-CN")} · ${money(item.price)}</small></span>`;
    link.addEventListener("click", interceptRoute);
    root.appendChild(link);
  });
}

function renderMinesweeperCampaignPanel() {
  const panel = qs("#minesweeperCampaignPanel");
  if (!panel) return;
  const body = qs(".home-campaign-body", panel);
  const campaign = state.minesweeperActivity?.campaign || state.settings?.minesweeperCampaign || null;
  const hasPercent = ["beginner", "intermediate", "expert"].some((level) => getCampaignRewardValue(campaign, "levelPercentCoupons", level) > 0);
  const hasFixed = ["beginner", "intermediate", "expert"].some((level) => getCampaignRewardValue(campaign, "levelFirstFixedCoupons", level) > 0);
  if (!campaign || campaign.enabled === false || (!hasPercent && !hasFixed)) {
    panel.hidden = true;
    if (body) body.innerHTML = "";
    return;
  }
  const rewards = campaignRewardSentence(campaign);
  const status = campaignStatusText(campaign);
  panel.hidden = false;
  body.innerHTML = `
    <div class="home-campaign-status">
      <span class="badge ${campaignStatusClass(campaign)}">${escapeHtml(status)}</span>
      <span>${escapeHtml(formatDate(campaign.startAt))} - ${escapeHtml(formatDate(campaign.endsAt))}</span>
    </div>
    <div class="home-campaign-prizes">
      <span><strong>扫雷娱乐通关券</strong>${escapeHtml(rewards.percentText)}</span>
      <span><strong>榜首额外券</strong>${rewards.fixedText}</span>
    </div>
    <a class="btn btn-small btn-ghost" href="/games/minesweeper/">进入娱乐活动</a>
  `;
}

function renderTransactions() {
  const root = qs("#transactionList");
  root.innerHTML = "";
  if (!state.recentTransactions.length) {
    root.appendChild(emptyState("暂无成交"));
    return;
  }
  state.recentTransactions.forEach((item) => {
    const row = document.createElement("div");
    row.className = "transaction-item";
    row.innerHTML = `<span class="rank-badge">✓</span><span><strong>${escapeHtml(item.user)} 购买 ${escapeHtml(item.product)}</strong><small>${formatDate(item.time)} · ${money(item.amount)}</small></span>`;
    root.appendChild(row);
  });
}

function renderAds() {
  renderAdSlot("#topAdSlot", "top");
  renderAdSlot("#heroAdSlot", "hero");
  renderAdSlot("#betweenAdSlot", "between_products");
  renderAdSlot("#footerAdSlot", "footer");
  renderAdSlot("#floatingAdSlot", "floating");
  const root = qs("#adList");
  const panel = qs("#adPanel");
  if (!root || !panel) return;
  const ads = state.ads.filter((item) => item.position === "sidebar");
  panel.hidden = ads.length === 0;
  root.innerHTML = ads.map(renderAdItem).join("");
}

function renderAdSlot(selector, position) {
  const root = qs(selector);
  if (!root) return;
  const ads = state.ads.filter((item) => item.position === position);
  root.hidden = ads.length === 0;
  root.innerHTML = ads.map(renderAdItem).join("");
}

function renderAdItem(ad) {
  const style = ad.style || {};
  const href = normalizeExternalHref(ad.linkUrl) || "#";
  const tag = href === "#" ? "div" : "a";
  const attrs = tag === "a" ? `href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer"` : "";
  const imageUrl = normalizeSiteImageUrl(ad.imageUrl);
  return `
    <${tag} class="ad-item ad-${escapeAttr(ad.position || "sidebar")} ad-layout-${escapeAttr(style.layout || "card")} ad-theme-${escapeAttr(style.theme || "blue")}" ${attrs}>
      ${imageUrl && style.imageMode !== "none" ? `<span class="ad-media"><img src="${escapeAttr(imageUrl)}" alt="${escapeAttr(ad.title)}" loading="lazy"></span>` : `<span class="rank-badge">AD</span>`}
      <span class="ad-copy"><strong>${escapeHtml(ad.title)}</strong><small>${escapeHtml(ad.description)}</small></span>
      ${style.buttonText ? `<em>${escapeHtml(style.buttonText)}</em>` : ""}
    </${tag}>
  `;
}

function normalizeExternalHref(value) {
  const text = String(value || "").trim();
  if (/^https:\/\//i.test(text)) return normalizeSafeRenderedUrl(text) || "";
  if (/^\/(?!\/)[^\s"'<>`]+$/i.test(text)) return text;
  return "";
}

function drawLottery(prizes) {
  const items = prizes.length ? prizes : [{ label: "无折扣", value: 1, weight: 1 }];
  const total = items.reduce((sum, item) => sum + Number(item.weight || 0), 0) || 1;
  let cursor = Math.random() * total;
  for (const item of items) {
    cursor -= Number(item.weight || 0);
    if (cursor <= 0) return item;
  }
  return items[0];
}

function openModal(html, size = "") {
  modalCard.dataset.modalSize = size;
  modalContent.innerHTML = html;
  modalLayer.hidden = false;
}

function closeModal() {
  modalLayer.hidden = true;
  modalCard.dataset.modalSize = "";
  modalContent.innerHTML = "";
}

function emptyState(text) {
  const div = document.createElement("div");
  div.className = "empty-state";
  div.textContent = text;
  return div;
}

function showToast(message, type = "success") {
  const item = document.createElement("div");
  item.className = "toast";
  item.textContent = message;
  if (type === "error") item.style.borderColor = "var(--danger)";
  toastStack.appendChild(item);
  setTimeout(() => item.remove(), 3200);
}

function categoryLabel(value) {
  return ({ account: "账号权益", code: "自动交付", credit: "积分", service: "服务", other: "其他" })[value] || value || "服务";
}

function productName(productId) {
  return state.admin?.products?.find((product) => product.id === productId)?.name || "";
}

function orderStatusLabel(value) {
  return ({ pending: "待支付", processing: "处理中", completed: "已完成", canceled: "已取消", expired: "已失效", refunded: "已退款" })[value] || value;
}

function userCouponStatusLabel(value) {
  return ({ active: "可用", reserved: "已锁定", used: "已使用", expired: "已过期", inactive: "已停用" })[value] || value || "-";
}

function orderStatusClass(value) {
  if (value === "completed") return "badge-success";
  if (value === "canceled" || value === "refunded" || value === "expired") return "badge-danger";
  return "badge-warning";
}

function feedbackTypeLabel(value) {
  return ({ bug: "Bug 反馈", question: "问题建议" })[value] || "Bug 反馈";
}

function feedbackStatusLabel(value) {
  return ({ draft: "草稿", pending: "待审核", approved: "已通过", rejected: "不通过", deleted: "已删除" })[value] || "待审核";
}

function feedbackStatusClass(value) {
  return ({ draft: "badge", pending: "badge-warning", approved: "badge-success", rejected: "badge-danger", deleted: "badge-danger" })[value] || "badge-warning";
}

function feedbackLogActionLabel(value) {
  return ({
    create: "保存草稿",
    update: "修改草稿",
    submit: "提交审核",
    admin_update: "管理员修改",
    delete: "用户删除",
    admin_delete: "管理员删除",
    approve: "审核通过",
    reject: "审核不通过",
    pending: "改回待审核"
  })[value] || value || "操作";
}

function cardStatusLabel(value) {
  return ({ unused: "未使用", scheduled: "定时上架", reserved: "已锁定", used: "已使用", inactive: "未启用" })[value] || value || "-";
}

function productStatusLabel(value) {
  return ({ active: "销售中", soldout: "已售罄", inactive: "已下架", deleted: "已删除" })[value] || value || "销售中";
}

function productStatusClass(value) {
  if (value === "active") return "badge-success";
  if (value === "deleted") return "badge-danger";
  if (value === "soldout") return "badge-danger";
  return "badge-warning";
}

function productStatusValue(value) {
  return value === "inactive" || value === "deleted" ? value : "active";
}

function productStatusGroupLabel(value) {
  return ({ all: "商品", active: "在售商品", soldout: "售罄商品", inactive: "下架商品", deleted: "删除的商品" })[value] || "商品";
}

function paymentModeLabel(value) {
  return value === "test" ? "测试支付" : "积分站";
}

function isFixedLinkProduct(product) {
  return Boolean(product && (product.deliveryMode === "fixed_link" || product.unlimitedStock));
}

const KNOWN_NETDISK_PROVIDERS = [
  { key: "baidu", label: "百度网盘", match: (host) => host === "pan.baidu.com" || host.endsWith(".baidu.com") },
  { key: "alipan", label: "阿里云盘", match: (host) => host === "www.alipan.com" || host.endsWith(".alipan.com") || host === "www.aliyundrive.com" || host.endsWith(".aliyundrive.com") },
  { key: "quark", label: "夸克网盘", match: (host) => host === "pan.quark.cn" || host.endsWith(".quark.cn") },
  { key: "tianyi", label: "天翼云盘", match: (host) => host === "cloud.189.cn" || host.endsWith(".189.cn") },
  { key: "115", label: "115网盘", match: (host) => host === "115.com" || host.endsWith(".115.com") },
  { key: "xunlei", label: "迅雷网盘", match: (host) => host === "pan.xunlei.com" || host.endsWith(".xunlei.com") },
  { key: "uc", label: "UC网盘", match: (host) => host === "drive.uc.cn" || host.endsWith(".uc.cn") },
  { key: "caiyun", label: "彩云网盘", match: (host) => host === "caiyun.139.com" || host.endsWith(".caiyun.139.com") }
];

function isProductSoldOut(product) {
  if (!product || product.status !== "active") return true;
  if (isFixedLinkProduct(product)) return false;
  return Number(product.stock || 0) <= 0;
}

function productStockLabel(product) {
  return isFixedLinkProduct(product) ? "无限发货" : `库存 ${Number(product?.stock || 0)}`;
}

function orderCanCreditRefund(order) {
  if (!order || Number(order.finalAmount || 0) <= 0 || !order.tradeNo || order.tradeNo.startsWith("TEST-")) {
    return false;
  }
  return !order.paymentMode || order.paymentMode === "credit";
}

function orderCanRefund(order) {
  if (!order || Number(order.finalAmount || 0) <= 0) {
    return false;
  }
  return order.status === "completed";
}

function orderCanManualDeliver(order) {
  if (!order) {
    return false;
  }
  if (order.deliveryMode !== "manual") {
    return false;
  }
  return ["pending", "processing"].includes(order.status);
}

function orderCanContinuePay(order) {
  return Boolean(order && order.status === "pending" && Number(order.finalAmount || 0) > 0 && (!order.paymentMode || order.paymentMode === "credit"));
}

function orderCanUserCancel(order) {
  return Boolean(order && order.status === "pending");
}

function orderCanUserDelete(order) {
  return Boolean(order && ["pending", "processing", "canceled", "expired"].includes(order.status));
}

function orderCanDisputeRefund(order) {
  return Boolean(order && order.status === "completed" && Number(order.finalAmount || 0) > 0);
}

function productAdminState(product) {
  const status = productStatusValue(product.status);
  if (status === "deleted" || status === "inactive") return status;
  return isProductSoldOut(product) ? "soldout" : "active";
}

function canReplenishProduct(product) {
  return Boolean(product && product.deliveryMode === "auto" && productStatusValue(product.status) === "active");
}

function levelLabel(value) {
  return MINE_LEVEL_LABELS[value] || value || "-";
}

function formatMineSeconds(value) {
  const seconds = Number(value || 0);
  if (!seconds) return "-";
  return `${seconds} 秒`;
}

function parseAppDate(value) {
  if (value instanceof Date) {
    return value;
  }
  const text = String(value || "").trim();
  if (!text) {
    return new Date(Number.NaN);
  }
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(text)) {
    return new Date(`${text.replace(" ", "T")}${text.length === 16 ? ":00" : ""}Z`);
  }
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(text)) {
    return new Date(`${text}${text.length === 16 ? ":00" : ""}Z`);
  }
  return new Date(text);
}

function formatDate(value) {
  if (!value) return "-";
  const date = parseAppDate(value);
  if (Number.isNaN(date.getTime())) return "-";
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    hour12: false
  }).formatToParts(date).reduce((result, part) => {
    if (part.type !== "literal") result[part.type] = part.value;
    return result;
  }, {});
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[char]);
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

function splitLines(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function detectNetdiskProvider(value, fallback = "") {
  const explicit = String(fallback || "").trim().toLowerCase();
  if (explicit) {
    const matched = KNOWN_NETDISK_PROVIDERS.find((item) => item.key === explicit || item.label.toLowerCase() === explicit);
    if (matched) return matched.key;
  }
  try {
    const url = new URL(String(value || "").trim());
    const host = url.hostname.toLowerCase();
    const matched = KNOWN_NETDISK_PROVIDERS.find((item) => item.match(host));
    return matched ? matched.key : "unknown";
  } catch {
    return "unknown";
  }
}

function getNetdiskProviderLabel(provider) {
  const key = String(provider || "").trim().toLowerCase();
  const matched = KNOWN_NETDISK_PROVIDERS.find((item) => item.key === key);
  return matched ? matched.label : "网盘链接";
}

function parseNetdiskSharePayload(rawItem) {
  const rawText = typeof rawItem === "string"
    ? rawItem
    : [
        rawItem?.shareText,
        rawItem?.rawText,
        rawItem?.raw,
        rawItem?.text,
        rawItem?.url
      ].filter(Boolean).join("\n");
  const shareText = String(rawText || "").trim();
  const explicitUrl = normalizeSafeRenderedUrl(rawItem?.url || "");
  const textUrlMatch = shareText.match(/https:\/\/[^\s<>"'`]+/i);
  const extractedUrl = normalizeSafeRenderedUrl(textUrlMatch?.[0] || "");
  const url = explicitUrl || extractedUrl || "";
  const explicitCode = normalizeNetdiskAccessCode(rawItem?.accessCode || rawItem?.code || "");
  const queryCodeMatch = String(url || "").match(/[?&](?:pwd|passcode|code)=([a-z0-9]{1,16})/i);
  const textCodeMatch = shareText.match(/(?:提取码|访问码|密码|口令)\s*[:：]?\s*([a-z0-9]{1,16})/i);
  const accessCode = explicitCode || normalizeNetdiskAccessCode(queryCodeMatch?.[1] || textCodeMatch?.[1] || "");
  const provider = detectNetdiskProvider(url, rawItem?.provider || "");
  return { shareText, url, accessCode, provider };
}

function normalizeNetdiskAccessCode(value) {
  return String(value || "").trim().replace(/[^a-z0-9]/gi, "").slice(0, 16);
}

function renderDeliveryContent(content) {
  return String(content || "")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(.*?)(https:\/\/[^\s]+)(?:\s+提取码[:：]\s*([a-z0-9]{1,16}))?$/i);
      if (!match) {
        return `<div class="delivery-line">${escapeHtml(line)}</div>`;
      }
      const prefix = match[1] || "";
      const url = normalizeSafeRenderedUrl(match[2]);
      const accessCode = normalizeNetdiskAccessCode(match[3] || "");
      if (!url) {
        return `<div class="delivery-line">${escapeHtml(line)}</div>`;
      }
      return `
        <div class="delivery-link-card">
          <div class="delivery-link-main">
            <span class="delivery-link-label">${escapeHtml(prefix.replace(/[：:\s]+$/g, "")) || "下载链接"}</span>
            <a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a>
          </div>
          ${accessCode ? `<span class="delivery-access-code">提取码 ${escapeHtml(accessCode)}</span>` : ""}
        </div>
      `;
    })
    .join("");
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("已复制");
  } catch {
    showToast("复制失败", "error");
  }
}

function interceptRoute(event, link = event.currentTarget) {
  const url = new URL(link.href, location.origin);
  if (url.origin !== location.origin) return;
  event.preventDefault();
  closeUserMenu();
  navigate(`${url.pathname}${url.search}${url.hash}`);
}

userMenuButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleUserMenu();
});

logoutButton?.addEventListener("click", async () => {
  closeUserMenu();
  try {
    await apiFetch("/api/auth/logout", { method: "POST" });
  } finally {
    state.user = null;
    state.orders = [];
    state.chat.conversations = [];
    state.chat.messages = [];
    state.chat.activeConversationId = "";
    state.chat.open = false;
    applySession();
    stopChatPolling();
    renderChatDock();
    navigate("/");
    showToast("已退出登录");
  }
});

cloudGameSelect?.addEventListener("change", (event) => {
  if (isFrontMaintenanceLocked()) {
    event.currentTarget.value = "";
    showToast("网站维护中，暂时无法使用娱乐活动", "error");
    return;
  }
  const target = event.currentTarget.value;
  if (!target) return;
  closeUserMenu();
  location.href = target;
});

modalClose.addEventListener("click", closeModal);
window.addEventListener("popstate", route);
window.addEventListener("resize", () => {
  const chatWindow = qs(".chat-window", chatWindowPortal || chatDock || document);
  if (chatWindow) {
    keepChatWindowInBounds(chatWindow);
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeUserMenu();
});
document.addEventListener("click", (event) => {
  const chatButton = event.target.closest("[data-user-menu-chat]");
  if (chatButton) {
    event.preventDefault();
    closeUserMenu();
    openChatForContext({ subject: "商城咨询" });
    return;
  }
  const link = event.target.closest("a[data-route]");
  if (link) {
    interceptRoute(event, link);
    return;
  }
  if (userMenu && !userMenu.contains(event.target)) closeUserMenu();
});
qs("#searchInput")?.addEventListener("input", renderProducts);
qs("#refreshButton")?.addEventListener("click", bootstrap);

cleanupLegacyRootServiceWorker().then((reloading) => {
  if (!reloading) {
    bootstrap();
  }
});
