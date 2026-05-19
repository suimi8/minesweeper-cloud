const LEVELS = {
  beginner: { label: "初级", rows: 9, cols: 9, mines: 10 },
  intermediate: { label: "中级", rows: 16, cols: 16, mines: 40 },
  expert: { label: "高级", rows: 16, cols: 30, mines: 99 }
};

const APP_BASE_PATH = getAppBasePath();
const API_BASE_PATH = `${APP_BASE_PATH}api`;
const ADMIN_PATH = `${APP_BASE_PATH}admin`;
const APP_HOME_PATH = APP_BASE_PATH || "/";

const app = document.querySelector("#app");
const board = document.querySelector("#board");
const boardWrap = document.querySelector(".board-wrap");
const mineCounter = document.querySelector("#mineCounter");
const timerText = document.querySelector("#timer");
const resetButton = document.querySelector("#resetButton");
const restartRoundButton = document.querySelector("#restartRoundButton");
const stateText = document.querySelector("#stateText");
const bestText = document.querySelector("#bestText");
const cloudText = document.querySelector("#cloudText");
const cloudToggle = document.querySelector("#cloudToggle");
const authModal = document.querySelector("#authModal");
const closeAuthModal = document.querySelector("#closeAuthModal");
const authForm = document.querySelector("#authForm");
const usernameInput = document.querySelector("#usernameInput");
const passwordInput = document.querySelector("#passwordInput");
const cloudAccount = document.querySelector("#cloudAccount");
const cloudUser = document.querySelector("#cloudUser");
const logoutButton = document.querySelector("#logoutButton");
const linuxdoLogin = document.querySelector("#linuxdoLogin");
const userCard = document.querySelector("#userCard");
const userAvatar = document.querySelector("#userAvatar");
const userName = document.querySelector("#userName");
const userProvider = document.querySelector("#userProvider");
const userSyncState = document.querySelector("#userSyncState");
const adminModal = document.querySelector("#adminModal");
const closeAdminModal = document.querySelector("#closeAdminModal");
const adminStatus = document.querySelector("#adminStatus");
const adminStats = document.querySelector("#adminStats");
const adminLevels = document.querySelector("#adminLevels");
const adminScores = document.querySelector("#adminScores");
const adminUsers = document.querySelector("#adminUsers");
const adminUserCount = document.querySelector("#adminUserCount");
const adminOverviewNote = document.querySelector("#adminOverviewNote");
const adminModuleSummary = document.querySelector("#adminModuleSummary");
const adminModuleButtons = [...document.querySelectorAll("[data-admin-module]")];
const adminModulePanels = [...document.querySelectorAll("[data-admin-panel]")];
const leaderboardSelectAll = document.querySelector("#leaderboardSelectAll");
const leaderboardClearSelected = document.querySelector("#leaderboardClearSelected");
const userSelectAll = document.querySelector("#userSelectAll");
const userDeleteSyncSelected = document.querySelector("#userDeleteSyncSelected");
const userDeleteSelected = document.querySelector("#userDeleteSelected");
const leaderboardStatus = document.querySelector("#leaderboardStatus");
const leaderboardList = document.querySelector("#leaderboardList");
const myRankText = document.querySelector("#myRank");
const learnList = document.querySelector("#learnList");
const leaderboardPane = document.querySelector("#leaderboardPane");
const learnPane = document.querySelector("#learnPane");
const campaignCard = document.querySelector("#campaignCard");
const campaignTitle = document.querySelector("#campaignTitle");
const campaignText = document.querySelector("#campaignText");
const campaignCoupons = document.querySelector("#campaignCoupons");
const sideTabs = [...document.querySelectorAll("[data-side-tab]")];
const levelButtons = [...document.querySelectorAll("[data-level-button]")];

if (isAdminPath()) {
  location.replace("/admin?tab=minesweeper");
}

const STORE_KEY = "minesweeper-state-v2";
const BEST_KEY = "minesweeper-best-v1";
const SYNC_META_KEY = "minesweeper-sync-meta-v1";
const LONG_PRESS_MS = 520;
const MOVE_TOLERANCE = 12;
const EXPRESSION_LESSONS = {
  "√1": { value: 1, title: "平方根", method: "平方根表示哪个数平方后等于被开方数。因为 1×1=1，所以 √1=1。" },
  "log₂2": { value: 1, title: "以 2 为底的对数", method: "log₂2 表示 2 的几次方等于 2。因为 2¹=2，所以 log₂2=1。" },
  "0!": { value: 1, title: "阶乘", method: "0! 是阶乘的规定值，等于 1。它让组合公式在边界情况也成立。" },
  "sin90°": { value: 1, title: "三角函数", method: "在单位圆中，90° 对应点的纵坐标是 1，所以 sin90°=1。" },
  "C(1,1)": { value: 1, title: "组合数", method: "C(n,k) 表示从 n 个对象中选 k 个。1 个里选 1 个只有 1 种，所以 C(1,1)=1。" },
  "√4": { value: 2, title: "平方根", method: "因为 2×2=4，所以 √4=2。" },
  "log₂4": { value: 2, title: "以 2 为底的对数", method: "log₂4 表示 2 的几次方等于 4。因为 2²=4，所以结果是 2。" },
  "2!": { value: 2, title: "阶乘", method: "2! 表示 2×1，所以 2!=2。" },
  "C(2,1)": { value: 2, title: "组合数", method: "从 2 个对象中选 1 个，有 2 种选法，所以 C(2,1)=2。" },
  "⌈1.2⌉": { value: 2, title: "上取整", method: "⌈x⌉ 表示不小于 x 的最小整数。不小于 1.2 的最小整数是 2。" },
  "√9": { value: 3, title: "平方根", method: "因为 3×3=9，所以 √9=3。" },
  "log₂8": { value: 3, title: "以 2 为底的对数", method: "因为 2³=8，所以 log₂8=3。" },
  "C(3,1)": { value: 3, title: "组合数", method: "从 3 个对象中选 1 个，有 3 种选法，所以 C(3,1)=3。" },
  "⌈2.1⌉": { value: 3, title: "上取整", method: "不小于 2.1 的最小整数是 3，所以 ⌈2.1⌉=3。" },
  "⌊3.9⌋": { value: 3, title: "下取整", method: "⌊x⌋ 表示不大于 x 的最大整数。不大于 3.9 的最大整数是 3。" },
  "√16": { value: 4, title: "平方根", method: "因为 4×4=16，所以 √16=4。" },
  "log₂16": { value: 4, title: "以 2 为底的对数", method: "因为 2⁴=16，所以 log₂16=4。" },
  "2²": { value: 4, title: "乘方", method: "2² 表示两个 2 相乘，即 2×2=4。" },
  "C(4,1)": { value: 4, title: "组合数", method: "从 4 个对象中选 1 个，有 4 种选法，所以 C(4,1)=4。" },
  "⌈3.1⌉": { value: 4, title: "上取整", method: "不小于 3.1 的最小整数是 4，所以 ⌈3.1⌉=4。" },
  "√25": { value: 5, title: "平方根", method: "因为 5×5=25，所以 √25=5。" },
  "log₂32": { value: 5, title: "以 2 为底的对数", method: "因为 2⁵=32，所以 log₂32=5。" },
  "C(5,1)": { value: 5, title: "组合数", method: "从 5 个对象中选 1 个，有 5 种选法，所以 C(5,1)=5。" },
  "⌊5.9⌋": { value: 5, title: "下取整", method: "不大于 5.9 的最大整数是 5，所以 ⌊5.9⌋=5。" },
  "⌈4.1⌉": { value: 5, title: "上取整", method: "不小于 4.1 的最小整数是 5，所以 ⌈4.1⌉=5。" },
  "√36": { value: 6, title: "平方根", method: "因为 6×6=36，所以 √36=6。" },
  "log₂64": { value: 6, title: "以 2 为底的对数", method: "因为 2⁶=64，所以 log₂64=6。" },
  "3!": { value: 6, title: "阶乘", method: "3! 表示 3×2×1，所以 3!=6。" },
  "C(6,1)": { value: 6, title: "组合数", method: "从 6 个对象中选 1 个，有 6 种选法，所以 C(6,1)=6。" },
  "⌈5.1⌉": { value: 6, title: "上取整", method: "不小于 5.1 的最小整数是 6，所以 ⌈5.1⌉=6。" },
  "√49": { value: 7, title: "平方根", method: "因为 7×7=49，所以 √49=7。" },
  "log₂128": { value: 7, title: "以 2 为底的对数", method: "因为 2⁷=128，所以 log₂128=7。" },
  "C(7,1)": { value: 7, title: "组合数", method: "从 7 个对象中选 1 个，有 7 种选法，所以 C(7,1)=7。" },
  "⌊7.9⌋": { value: 7, title: "下取整", method: "不大于 7.9 的最大整数是 7，所以 ⌊7.9⌋=7。" },
  "⌈6.1⌉": { value: 7, title: "上取整", method: "不小于 6.1 的最小整数是 7，所以 ⌈6.1⌉=7。" },
  "√64": { value: 8, title: "平方根", method: "因为 8×8=64，所以 √64=8。" },
  "log₂256": { value: 8, title: "以 2 为底的对数", method: "因为 2⁸=256，所以 log₂256=8。" },
  "C(8,1)": { value: 8, title: "组合数", method: "从 8 个对象中选 1 个，有 8 种选法，所以 C(8,1)=8。" },
  "⌈7.1⌉": { value: 8, title: "上取整", method: "不小于 7.1 的最小整数是 8，所以 ⌈7.1⌉=8。" },
  "⌊8.9⌋": { value: 8, title: "下取整", method: "不大于 8.9 的最大整数是 8，所以 ⌊8.9⌋=8。" }
};
const NUMBER_EXPRESSIONS = {
  1: ["√1", "log₂2", "0!", "sin90°", "C(1,1)"],
  2: ["√4", "log₂4", "2!", "C(2,1)", "⌈1.2⌉"],
  3: ["√9", "log₂8", "C(3,1)", "⌈2.1⌉", "⌊3.9⌋"],
  4: ["√16", "log₂16", "2²", "C(4,1)", "⌈3.1⌉"],
  5: ["√25", "log₂32", "C(5,1)", "⌊5.9⌋", "⌈4.1⌉"],
  6: ["√36", "log₂64", "3!", "C(6,1)", "⌈5.1⌉"],
  7: ["√49", "log₂128", "C(7,1)", "⌊7.9⌋", "⌈6.1⌉"],
  8: ["√64", "log₂256", "C(8,1)", "⌈7.1⌉", "⌊8.9⌋"]
};

let state = createState("beginner");
let timerId = null;
let longPressTimer = null;
let longPressPointerId = null;
let longPressStart = null;
let suppressNextClick = false;
let suppressNextContextMenu = false;
let currentUser = null;
let syncStatus = "local";
let syncTimer = null;
let isSyncing = false;
let pendingSync = false;
let lastFocusedElement = null;
let leaderboard = [];
let myRank = null;
let adminData = null;
let selectedAdminScores = new Set();
let selectedAdminUsers = new Set();
let couponCampaign = null;

function campaignCurrency() {
  const currency = couponCampaign?.currency || {};
  return {
    mode: currency.mode === "image" ? "image" : "text",
    symbol: String(currency.symbol || "L").trim() || "L",
    imageUrl: String(currency.imageUrl || "").trim()
  };
}

function renderCampaignCurrencyPrefix() {
  const currency = campaignCurrency();
  if (currency.mode === "image" && currency.imageUrl) {
    return `<img class="currency-icon" src="${escapeAttr(currency.imageUrl)}" alt="${escapeAttr(currency.symbol || "货币")}" loading="lazy">`;
  }
  return escapeHtml(currency.symbol);
}

function renderCampaignMoney(value) {
  return `<span class="money-value">${renderCampaignCurrencyPrefix()} <span>${Number(value || 0).toLocaleString("zh-CN")}</span></span>`;
}

function formatCampaignMoneyText(value) {
  return `${Number(value || 0).toLocaleString("zh-CN")} ${campaignCurrency().symbol}`;
}

function createState(level) {
  const config = LEVELS[level];
  return {
    level,
    rows: config.rows,
    cols: config.cols,
    mines: config.mines,
    cells: Array.from({ length: config.rows * config.cols }, (_, index) => ({
      index,
      mine: false,
      open: false,
      flagged: false,
      question: false,
      value: 0
    })),
    status: "ready",
    startedAt: null,
    elapsed: 0,
    flags: 0,
    opened: 0,
    firstClick: true
  };
}

function saveState() {
  persistLocalState(Date.now());
  queueCloudSync();
}

function persistLocalState(clientUpdatedAt) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
    setLocalUpdatedAt(clientUpdatedAt);
  } catch {
    // Storage can be blocked in private modes or unusual file:// policies.
  }
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEY));
    if (!parsed || !LEVELS[parsed.level] || !Array.isArray(parsed.cells)) {
      return null;
    }
    const expected = parsed.rows * parsed.cols;
    return parsed.cells.length === expected ? parsed : null;
  } catch {
    return null;
  }
}

function getBestTimes() {
  try {
    return JSON.parse(localStorage.getItem(BEST_KEY)) || {};
  } catch {
    return {};
  }
}

function setBestTime(level, seconds) {
  const best = getBestTimes();
  const scoreSeconds = Math.max(1, Math.min(999, Math.trunc(seconds)));
  if (!best[level] || scoreSeconds < best[level]) {
    best[level] = scoreSeconds;
    try {
      localStorage.setItem(BEST_KEY, JSON.stringify(best));
    } catch {
      // Best time is optional; gameplay should continue without storage.
    }
  }
  queueCloudSync();
  submitLeaderboardScore(level, scoreSeconds);
}

function setBestTimes(best) {
  try {
    localStorage.setItem(BEST_KEY, JSON.stringify(best || {}));
  } catch {
    // Best time is optional; gameplay should continue without storage.
  }
}

function startTimer() {
  stopTimer();
  timerId = setInterval(() => {
    if (state.status !== "playing") {
      stopTimer();
      return;
    }
    state.elapsed = Math.min(999, Math.floor((Date.now() - state.startedAt) / 1000));
    syncHud();
    saveState();
  }, 500);
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function startGameIfNeeded(firstIndex) {
  if (!state.firstClick) {
    return;
  }
  state.firstClick = false;
  state.status = "playing";
  state.startedAt = Date.now() - state.elapsed * 1000;
  placeMines(firstIndex);
  calculateValues();
  startTimer();
}

function placeMines(safeIndex) {
  const safe = new Set([safeIndex, ...neighborsOf(safeIndex)]);
  const candidates = state.cells
    .map((cell) => cell.index)
    .filter((index) => !safe.has(index));

  shuffle(candidates);

  for (const index of candidates.slice(0, state.mines)) {
    state.cells[index].mine = true;
  }
}

function calculateValues() {
  for (const cell of state.cells) {
    if (cell.mine) {
      continue;
    }
    cell.value = neighborsOf(cell.index).filter((index) => state.cells[index].mine).length;
  }
}

function shuffle(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
}

function neighborsOf(index) {
  const row = Math.floor(index / state.cols);
  const col = index % state.cols;
  const result = [];

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (rowOffset === 0 && colOffset === 0) {
        continue;
      }

      const nextRow = row + rowOffset;
      const nextCol = col + colOffset;
      if (nextRow >= 0 && nextRow < state.rows && nextCol >= 0 && nextCol < state.cols) {
        result.push(nextRow * state.cols + nextCol);
      }
    }
  }

  return result;
}

function openCell(index) {
  if (state.status === "won" || state.status === "lost") {
    return;
  }

  const cell = state.cells[index];
  if (!cell || cell.open || cell.flagged) {
    return;
  }

  startGameIfNeeded(index);
  cell.question = false;
  cell.open = true;
  state.opened += 1;

  if (cell.mine) {
    loseGame(index);
    return;
  }

  if (cell.value === 0) {
    floodOpen(index);
  }

  checkWin();
  syncAll();
}

function floodOpen(startIndex) {
  const queue = [startIndex];
  const visited = new Set(queue);

  while (queue.length > 0) {
    const current = queue.shift();
    for (const nextIndex of neighborsOf(current)) {
      const next = state.cells[nextIndex];

      if (visited.has(nextIndex) || next.open || next.flagged || next.mine) {
        continue;
      }

      visited.add(nextIndex);
      next.question = false;
      next.open = true;
      state.opened += 1;

      if (next.value === 0) {
        queue.push(nextIndex);
      }
    }
  }
}

function toggleMark(index) {
  if (state.status === "won" || state.status === "lost") {
    return;
  }

  const cell = state.cells[index];
  if (!cell || cell.open) {
    return;
  }

  if (cell.flagged) {
    cell.flagged = false;
    cell.question = true;
    state.flags -= 1;
  } else if (cell.question) {
    cell.question = false;
  } else {
    cell.flagged = true;
    state.flags += 1;
  }

  syncAll();
}

function chordOpen(index) {
  if (state.status !== "playing") {
    return;
  }

  const cell = state.cells[index];
  if (!cell?.open || cell.value === 0) {
    return;
  }

  const neighbors = neighborsOf(index);
  const flaggedCount = neighbors.filter((nextIndex) => state.cells[nextIndex].flagged).length;
  if (flaggedCount !== cell.value) {
    return;
  }

  for (const nextIndex of neighbors) {
    const next = state.cells[nextIndex];
    if (!next.open && !next.flagged) {
      openCell(nextIndex);
    }
  }
}

function loseGame(blastIndex) {
  state.status = "lost";
  stopTimer();

  for (const cell of state.cells) {
    if (cell.mine) {
      cell.open = true;
    }
  }

  syncAll(blastIndex);
}

function checkWin() {
  const safeCells = state.rows * state.cols - state.mines;
  if (state.opened !== safeCells) {
    return;
  }

  state.status = "won";
  state.flags = state.mines;
  state.elapsed = Math.min(999, Math.floor((Date.now() - state.startedAt) / 1000));
  stopTimer();
  setBestTime(state.level, state.elapsed);

  for (const cell of state.cells) {
    if (cell.mine) {
      cell.flagged = true;
      cell.question = false;
    }
  }
}

function resetGame(level = state.level) {
  stopTimer();
  state = createState(level);
  syncAll();
}

function changeLevel(level) {
  if (!LEVELS[level] || state.level === level) {
    return;
  }
  resetGame(level);
  loadLeaderboard();
}

function syncAll(blastIndex = null, shouldSave = true) {
  syncAppState();
  syncBoard(blastIndex);
  syncHud();
  if (shouldSave) {
    saveState();
  }
}

function syncAppState() {
  app.dataset.gameState = state.status;
  app.dataset.level = state.level;

  for (const button of levelButtons) {
    const isActive = button.dataset.levelButton === state.level;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }
}

function syncBoard(blastIndex = null) {
  board.style.setProperty("--cols", state.cols);
  fitBoardToViewport();
  board.innerHTML = "";

  for (const cell of state.cells) {
    const expression = cell.open && !cell.mine && cell.value > 0 ? getNumberExpression(cell) : "";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "cell";
    button.dataset.index = String(cell.index);
    button.dataset.open = String(cell.open);
    button.dataset.flagged = String(cell.flagged);
    button.dataset.question = String(cell.question);
    button.dataset.mine = String(cell.mine && (cell.open || state.status === "won" || state.status === "lost"));
    button.dataset.value = String(cell.value);
    button.dataset.expression = expression;
    button.dataset.blast = String(blastIndex === cell.index);
    button.setAttribute("role", "gridcell");
    button.setAttribute("aria-label", describeCell(cell, expression));
    button.disabled = state.status === "won" || state.status === "lost";

    if (expression) {
      const expressionText = document.createElement("span");
      expressionText.className = "math-expression";
      expressionText.dataset.length = String(expression.length);
      expressionText.textContent = expression;
      button.appendChild(expressionText);
    }

    board.appendChild(button);
  }
}

function fitBoardToViewport() {
  const bounds = boardWrap.getBoundingClientRect();
  const gap = 3;
  const horizontalPadding = 8;
  const verticalPadding = 12;
  const maxByWidth = Math.floor((bounds.width - horizontalPadding - gap * (state.cols - 1)) / state.cols);
  const maxByHeight = Math.floor((bounds.height - verticalPadding - gap * (state.rows - 1)) / state.rows);
  const minReadableSize = state.cols >= 30 ? 20 : 26;
  const cellSize = Math.max(minReadableSize, Math.min(52, maxByWidth || 52, maxByHeight || 52));
  board.style.setProperty("--cell-size", `${cellSize}px`);
  board.dataset.compactMath = String(cellSize < 23);
}

window.addEventListener("resize", () => {
  fitBoardToViewport();
});

function syncHud() {
  syncMineCounter();
  timerText.textContent = padNumber(state.elapsed);

  const best = getBestTimes()[state.level];
  bestText.textContent = best ? `最佳: ${best}s` : "最佳: --";

  const messages = {
    ready: "点击格子开始，数字会以高中公式显示",
    playing: `${LEVELS[state.level].label}局进行中，公式结果就是相邻雷数`,
    won: `完成，用时 ${state.elapsed}s`,
    lost: "踩雷了，点击表情重开"
  };
  stateText.textContent = messages[state.status];
  syncCloudHud();
}

function syncCloudHud() {
  const labels = {
    local: "本地",
    online: "云端已连接",
    syncing: "同步中",
    saved: "云端已保存",
    offline: "云端暂不可用",
    error: "同步失败"
  };

  cloudText.textContent = labels[syncStatus] || labels.local;
  cloudToggle.textContent = currentUser ? "云端同步" : "返回商城登录";
  cloudUser.textContent = currentUser ? `${currentUser.username}` : "未登录";
  cloudAccount.hidden = !currentUser;
  authForm.hidden = true;
  userCard.dataset.loggedIn = String(Boolean(currentUser));
  const displayName = currentUser?.linuxdo?.username || currentUser?.username || "";
  userAvatar.textContent = currentUser ? displayName.slice(0, 1).toUpperCase() : "未";
  userName.textContent = currentUser ? displayName : "未登录";
  userProvider.textContent = currentUser ? getProviderLabel(currentUser.provider) : "本地游玩";
  userSyncState.textContent = currentUser?.linuxdo?.id
    ? `Linux.do ID: ${currentUser.linuxdo.id}`
    : currentUser
      ? labels[syncStatus] || labels.online
      : "请先登录商城";
  renderCouponCampaign();
  renderLeaderboard();
}

function renderCouponCampaign() {
  if (!campaignCard) return;
  const campaign = couponCampaign?.campaign || {};
  if (campaign.enabled === false) {
    campaignCard.hidden = true;
    return;
  }
  campaignCard.hidden = false;
  const coupons = Array.isArray(couponCampaign?.userCoupons) ? couponCampaign.userCoupons : [];
  const ranks = Array.isArray(couponCampaign?.ranks) ? couponCampaign.ranks : [];
  const currentRank = ranks.find((item) => item.level === state.level) || couponCampaign?.rank || null;
  campaignTitle.textContent = currentRank?.rank ? `${LEVELS[state.level].label}首通第 ${currentRank.rank} 名` : `${LEVELS[state.level].label}首通领券`;
  const start = formatShortDate(campaign.startAt || "2026-05-18 00:00:00");
  const end = formatShortDate(campaign.endsAt || "2026-05-25 00:00:00");
  const percentValue = getCampaignRewardValue(campaign, "levelPercentCoupons", state.level);
  const fixedValue = getCampaignRewardValue(campaign, "levelFirstFixedCoupons", state.level);
  campaignText.innerHTML = `${escapeHtml(start)}-${escapeHtml(end)} · 当前难度首通 ${Number(percentValue || 0)}% · 第一名 ${renderCampaignMoney(fixedValue || 0)}`;
  const activeCoupons = coupons.filter((coupon) => coupon.status === "active").slice(0, 2);
  campaignCoupons.innerHTML = activeCoupons.length ? activeCoupons.map((coupon) => `
    <span class="campaign-coupon ${coupon.status === "active" ? "is-active" : ""}">
      <strong>${escapeHtml(coupon.label || coupon.code)}</strong>
      <small>${coupon.type === "percent" ? `${Number(coupon.value || 0)}%` : renderCampaignMoney(coupon.value || 0)} · ${couponStatusLabel(coupon.status)} · ${formatShortDate(coupon.expiresAt)} 到期</small>
    </span>
  `).join("") : `<span class="campaign-empty">${currentUser ? "通关后自动发券" : "登录后参与"}</span>`;
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

function couponStatusLabel(status) {
  return ({ active: "可用", reserved: "已锁定", used: "已使用", expired: "已过期", inactive: "已停用" })[status] || status || "未知";
}

function formatShortDate(value) {
  if (!value) return "-";
  const date = parseAppDate(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).format(date);
}

function parseAppDate(value) {
  if (value instanceof Date) return value;
  const text = String(value || "").trim();
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(text)) {
    return new Date(`${text.replace(" ", "T")}${text.length === 16 ? ":00" : ""}Z`);
  }
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(text)) {
    return new Date(`${text}${text.length === 16 ? ":00" : ""}Z`);
  }
  return new Date(text);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function getProviderLabel(provider) {
  if (provider === "linuxdo") {
    return "Linux.do 登录";
  }
  if (provider === "password") {
    return "账号密码登录";
  }
  return "云端账号";
}

function syncMineCounter() {
  const markedCells = countMarkedCells();
  const remainingMines = calculateRemainingMines(state.mines, markedCells);

  state.flags = markedCells;
  const ruleText = "f(m,b)=m-b";
  const valueText = `f(${state.mines},${markedCells})=${padNumber(remainingMines)}`;

  mineCounter.querySelector(".function-rule").textContent = ruleText;
  mineCounter.querySelector(".function-value").textContent = valueText;
  mineCounter.dataset.totalMines = String(state.mines);
  mineCounter.dataset.markedCells = String(markedCells);
  mineCounter.dataset.remainingMines = String(remainingMines);
  mineCounter.title = `${ruleText}; ${state.mines} - ${markedCells} = ${remainingMines}`;
  mineCounter.setAttribute("aria-label", `剩余雷数函数 ${valueText}`);
}

function calculateRemainingMines(totalMines, markedCells) {
  return Math.max(0, Math.min(999, Math.trunc(totalMines - markedCells)));
}

function countMarkedCells() {
  return state.cells.reduce((total, cell) => total + Number(cell.flagged), 0);
}

function padNumber(value) {
  return String(Math.max(0, Math.min(999, Math.trunc(value)))).padStart(3, "0");
}

function getNumberExpression(cell) {
  const expressions = NUMBER_EXPRESSIONS[cell.value] || [String(cell.value)];
  const expressionIndex = Math.abs(cell.index * 31 + cell.value * 17 + state.rows * 7 + state.cols * 11) % expressions.length;
  return expressions[expressionIndex];
}

function describeCell(cell, expression = "") {
  if (cell.flagged) {
    return "已标记为雷";
  }
  if (!cell.open) {
    return "未打开格子";
  }
  if (cell.mine) {
    return "地雷";
  }
  if (cell.value === 0) {
    return "空白格";
  }
  return expression ? `公式 ${expression}，表示相邻地雷数量` : "已打开数字格";
}

function clearLongPress() {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
  }
  longPressTimer = null;
  longPressPointerId = null;
  longPressStart = null;
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || !location.protocol.startsWith("http")) {
    return;
  }

  navigator.serviceWorker.register(toAppPath("sw.js"), { scope: APP_BASE_PATH || "./" }).catch(() => {
    // Offline mode is an enhancement; local gameplay remains available.
  });
}

async function checkCloudSession({ silent = false } = {}) {
  setSyncStatus("local");
  try {
    const response = await apiFetch(`/auth/me?_=${Date.now()}`, {
      cache: "no-store"
    });
    if (!response.ok) {
      setCurrentUser(null);
      if (!silent) {
        stateText.textContent = "请先登录";
      }
      return;
    }

    const data = await response.json();
    setCurrentUser(data.user);
    await pullCloudSync();
    await loadCouponCampaign();
    await loadLeaderboard();
  } catch {
    setSyncStatus("offline");
  }
}

async function handleAuth(action) {
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  setSyncStatus("syncing");
  try {
    const response = await apiFetch(`/auth/${action}`, {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "登录失败");
    }

    passwordInput.value = "";
    setCurrentUser(data.user);
    await pullCloudSync();
    await loadCouponCampaign();
    await loadLeaderboard();
    queueCloudSync(true);
    closeAuthModalDialog();
  } catch (error) {
    setSyncStatus("error");
    stateText.textContent = error.message || "登录失败";
  }
}

async function logoutCloud() {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } finally {
    setCurrentUser(null);
    setSyncStatus("local");
    syncHud();
    loadLeaderboard();
    location.href = "/";
  }
}

async function pullCloudSync() {
  if (!currentUser) {
    return;
  }

  setSyncStatus("syncing");
  const response = await apiFetch("/sync");
  if (!response.ok) {
    setSyncStatus("error");
    return;
  }

  const remote = await response.json();
  const localUpdatedAt = getLocalUpdatedAt();
  const remoteUpdatedAt = Number(remote.clientUpdatedAt || 0);

  if (remote.state && remoteUpdatedAt > localUpdatedAt && isValidState(remote.state)) {
    stopTimer();
    state = remote.state;
    if (state.status === "playing") {
      state.startedAt = Date.now() - state.elapsed * 1000;
      startTimer();
    }
  }

  if (remote.best && remoteUpdatedAt >= localUpdatedAt) {
    setBestTimes(remote.best);
  }

  persistLocalState(Math.max(localUpdatedAt, remoteUpdatedAt));
  syncAppState();
  syncBoard();
  syncHud();
  setSyncStatus("online");
}

function queueCloudSync(immediate = false) {
  if (!currentUser) {
    return;
  }

  pendingSync = true;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(pushCloudSync, immediate ? 0 : 700);
}

async function pushCloudSync() {
  if (!currentUser || isSyncing || !pendingSync) {
    return;
  }

  isSyncing = true;
  pendingSync = false;
  setSyncStatus("syncing");

  try {
    const response = await apiFetch("/sync", {
      method: "PUT",
      body: JSON.stringify({
        state,
        best: getBestTimes(),
        clientUpdatedAt: getLocalUpdatedAt()
      })
    });

    if (!response.ok) {
      throw new Error("sync failed");
    }
    setSyncStatus("saved");
  } catch {
    pendingSync = true;
    setSyncStatus("offline");
  } finally {
    isSyncing = false;
  }
}

async function loadLeaderboard() {
  leaderboardStatus.textContent = `${LEVELS[state.level].label}榜单`;
  try {
    const response = await apiFetch(`/leaderboard?level=${encodeURIComponent(state.level)}&_=${Date.now()}`, {
      cache: "no-store"
    });
    if (!response.ok) {
      throw new Error("leaderboard failed");
    }
    const data = await response.json();
    leaderboard = Array.isArray(data.leaders) ? data.leaders : [];
    myRank = data.myRank || null;
    leaderboardStatus.textContent = `${LEVELS[state.level].label}前 10`;
    renderLeaderboard();
  } catch {
    leaderboard = [];
    myRank = null;
    leaderboardStatus.textContent = "榜单暂不可用";
    renderLeaderboard("暂时无法读取排行榜");
  }
}

async function submitLeaderboardScore(level, seconds) {
  if (!currentUser) {
    return;
  }

  try {
    const response = await apiFetch("/leaderboard", {
      method: "POST",
      body: JSON.stringify({ level, seconds })
    });
    if (!response.ok) {
      throw new Error("leaderboard submit failed");
    }
    const data = await response.json();
    if (data.campaign) {
      couponCampaign = {
        campaign: data.campaign,
        rank: data.campaignRank || null,
        ranks: data.campaignRanks || data.campaignRank?.ranks || [],
        userCoupons: data.userCoupons || []
      };
      renderCouponCampaign();
      const activeCoupons = (couponCampaign.userCoupons || []).filter((coupon) => coupon.status === "active");
      if (activeCoupons.length) {
        stateText.textContent = `成绩已写入，扫雷活动券已发放 ${activeCoupons.length} 张`;
      }
    }
    if (data.level === state.level) {
      leaderboard = Array.isArray(data.leaders) ? data.leaders : [];
      myRank = data.myRank || null;
      leaderboardStatus.textContent = `${LEVELS[state.level].label}前 10`;
      renderLeaderboard();
    }
  } catch {
    leaderboardStatus.textContent = "成绩未写入榜单";
  }
}

async function loadCouponCampaign() {
  try {
    const response = await apiFetch(`/minesweeper/campaign?_=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error("campaign failed");
    couponCampaign = await response.json();
  } catch {
    couponCampaign = { campaign: null, currency: { mode: "text", symbol: "L", imageUrl: "" }, rank: null, ranks: [], userCoupons: [] };
  }
  renderCouponCampaign();
}

function renderLeaderboard(message = "") {
  leaderboardList.innerHTML = "";
  renderMyRank();

  if (message || leaderboard.length === 0) {
    const empty = document.createElement("li");
    empty.className = "leaderboard-empty";
    empty.textContent = message || "暂无成绩，登录后完成一局即可上榜";
    leaderboardList.appendChild(empty);
    return;
  }

  for (const entry of leaderboard) {
    const row = document.createElement("li");
    row.className = "leaderboard-row";
    row.classList.toggle("is-me", currentUser?.id === entry.userId);

    const rank = document.createElement("span");
    rank.className = "leaderboard-rank";
    rank.textContent = `#${entry.rank}`;

    const name = document.createElement("span");
    name.className = "leaderboard-name";
    name.textContent = entry.username;

    const time = document.createElement("span");
    time.className = "leaderboard-time";
    time.textContent = `${entry.seconds}s`;

    row.append(rank, name, time);
    leaderboardList.appendChild(row);
  }
}

function renderMyRank() {
  if (!currentUser) {
    myRankText.textContent = "登录后显示你的排名";
    return;
  }

  if (!myRank) {
    myRankText.textContent = `${LEVELS[state.level].label}: 你还没有上榜成绩`;
    return;
  }

  myRankText.textContent = `${LEVELS[state.level].label}: 我的排名 #${myRank.rank} · ${myRank.seconds}s`;
}

function renderLearnList() {
  learnList.innerHTML = "";

  for (const value of Object.keys(NUMBER_EXPRESSIONS).map(Number)) {
    const group = document.createElement("section");
    group.className = "learn-group";

    const heading = document.createElement("h3");
    heading.textContent = `结果 = ${value}`;
    group.appendChild(heading);

    for (const expression of NUMBER_EXPRESSIONS[value]) {
      const lesson = EXPRESSION_LESSONS[expression];
      if (!lesson) {
        continue;
      }

      const item = document.createElement("article");
      item.className = "learn-item";

      const formula = document.createElement("strong");
      formula.className = "learn-formula";
      formula.textContent = `${expression} = ${lesson.value}`;

      const title = document.createElement("span");
      title.className = "learn-title";
      title.textContent = lesson.title;

      const method = document.createElement("p");
      method.textContent = lesson.method;

      item.append(formula, title, method);
      group.appendChild(item);
    }

    learnList.appendChild(group);
  }
}

async function openAdminPanel({ replacePath = false } = {}) {
  adminModal.hidden = false;
  document.body.classList.add("admin-mode");
  document.title = "后台管理 - 扫雷";
  adminStatus.textContent = "读取后台数据中";
  renderAdminOverview(null);
  switchAdminModule("overview");

  if (replacePath && !isAdminPath()) {
    history.pushState(null, "", ADMIN_PATH);
  }

  try {
    const response = await apiFetch(`/api/mall/admin/minesweeper/overview?_=${Date.now()}`, {
      cache: "no-store"
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "没有后台权限");
    }

    adminData = data;
    selectedAdminScores = new Set();
    selectedAdminUsers = new Set();
    adminStatus.textContent = `超级管理员: ${data.admin.username} · Linux.do ID ${data.admin.linuxdoId}`;
    renderAdminOverview(data);
  } catch (error) {
    adminData = null;
    adminStatus.textContent = currentUser
      ? error.message || "后台数据读取失败"
      : "请先使用超级管理员 Linux.do 账号登录";
    renderAdminOverview(null);
    if (!currentUser) {
      openAuthModal();
    }
  }
}

function closeAdminPanel({ restorePath = true } = {}) {
  adminModal.hidden = true;
  document.body.classList.remove("admin-mode");
  document.title = "扫雷";
  if (restorePath && isAdminPath()) {
    history.pushState(null, "", APP_HOME_PATH);
  }
}

function renderAdminOverview(data) {
  adminStats.innerHTML = "";
  adminModuleSummary.innerHTML = "";
  adminLevels.innerHTML = "";
  adminScores.innerHTML = "";
  adminUsers.innerHTML = "";
  adminUserCount.textContent = "0 人";
  adminOverviewNote.textContent = "实时数据";

  if (!data) {
    selectedAdminScores = new Set();
    selectedAdminUsers = new Set();
    adminStats.appendChild(makeAdminEmpty("暂无后台数据"));
    adminModuleSummary.appendChild(makeAdminModuleCard("权限状态", "等待登录", "使用超级管理员 Linux.do 账号登录后显示模块数据"));
    adminScores.appendChild(makeAdminTableRow(["-", "-", "-", "-", "-"]));
    adminUsers.appendChild(makeAdminTableRow(["-", "-", "-", "-", "-"]));
    return;
  }

  const stats = [
    ["用户", data.stats.users],
    ["Linux.do", data.stats.linuxdoAccounts],
    ["会话", data.stats.sessions],
    ["同步", data.stats.syncs],
    ["成绩", data.stats.scores]
  ];
  for (const [label, value] of stats) {
    const card = document.createElement("div");
    card.className = "admin-stat";
    const strong = document.createElement("strong");
    strong.textContent = String(value);
    const span = document.createElement("span");
    span.textContent = label;
    card.append(strong, span);
    adminStats.appendChild(card);
  }

  adminOverviewNote.textContent = `最近读取 ${formatAdminDate(new Date().toISOString())}`;
  const levelCount = data.leaderboardLevels?.length || 0;
  const userCount = data.users?.length || 0;
  const bestScore = data.topScores?.length
    ? `${Math.min(...data.topScores.map((score) => Number(score.seconds) || 999))}s`
    : "--";
  adminModuleSummary.append(
    makeAdminModuleCard("榜单管理", `${levelCount} 个难度`, `当前最佳成绩 ${bestScore}`),
    makeAdminModuleCard("用户管理", `${userCount} 个用户`, "显示最近 30 个云端账号"),
    makeAdminModuleCard("云端同步", `${data.stats.syncs} 条记录`, `${data.stats.sessions} 个有效会话`)
  );

  const levels = data.leaderboardLevels?.length ? data.leaderboardLevels : [];
  if (levels.length === 0) {
    adminLevels.appendChild(makeAdminEmpty("暂无榜单记录"));
  } else {
    for (const level of levels) {
      const item = document.createElement("div");
      item.className = "admin-level";
      const label = document.createElement("strong");
      label.textContent = LEVELS[level.level]?.label || level.level;
      const meta = document.createElement("span");
      meta.textContent = `${level.entries} 条 · 最佳 ${level.bestSeconds || "--"}s`;
      const clearButton = document.createElement("button");
      clearButton.type = "button";
      clearButton.className = "admin-action";
      clearButton.dataset.clearLeaderboard = level.level;
      clearButton.textContent = "清空";
      item.append(label, meta, clearButton);
      adminLevels.appendChild(item);
    }
  }

  const scores = data.topScores?.length ? data.topScores : [];
  if (scores.length === 0) {
    adminScores.appendChild(makeAdminTableRow(["-", "暂无成绩", "-", "-", "-"]));
  } else {
    for (const score of scores) {
      adminScores.appendChild(makeAdminScoreRow(score));
    }
  }

  const users = data.users?.length ? data.users : [];
  adminUserCount.textContent = `${users.length} 人`;
  if (users.length === 0) {
    adminUsers.appendChild(makeAdminTableRow(["-", "暂无用户", "-", "-", "-"]));
  } else {
    for (const user of users) {
      adminUsers.appendChild(makeAdminUserRow(user));
    }
  }
}

function makeAdminEmpty(text) {
  const empty = document.createElement("div");
  empty.className = "admin-empty";
  empty.textContent = text;
  return empty;
}

function makeAdminModuleCard(title, value, detail) {
  const card = document.createElement("article");
  card.className = "admin-module-card";
  const heading = document.createElement("strong");
  heading.textContent = title;
  const metric = document.createElement("span");
  metric.textContent = value;
  const paragraph = document.createElement("p");
  paragraph.textContent = detail;
  card.append(heading, metric, paragraph);
  return card;
}

function makeAdminCheckbox(checked, onChange) {
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = checked;
  input.addEventListener("change", onChange);
  return input;
}

function makeAdminScoreRow(score) {
  const row = document.createElement("tr");
  const key = `${score.level}:${score.userId}`;
  const selectCell = document.createElement("td");
  selectCell.appendChild(makeAdminCheckbox(selectedAdminScores.has(key), (event) => {
    if (event.target.checked) {
      selectedAdminScores.add(key);
    } else {
      selectedAdminScores.delete(key);
    }
  }));
  row.appendChild(selectCell);

  for (const value of [
    LEVELS[score.level]?.label || score.level,
    `#${score.rank}`,
    score.username,
    `${score.seconds}s`
  ]) {
    const cell = document.createElement("td");
    cell.textContent = String(value ?? "-");
    row.appendChild(cell);
  }

  return row;
}

function makeAdminUserRow(user) {
  const row = document.createElement("tr");
  const selectCell = document.createElement("td");
  selectCell.appendChild(makeAdminCheckbox(selectedAdminUsers.has(user.id), (event) => {
    if (event.target.checked) {
      selectedAdminUsers.add(user.id);
    } else {
      selectedAdminUsers.delete(user.id);
    }
  }));
  row.appendChild(selectCell);

  for (const value of [
    user.username,
    user.linuxdoId || "-",
    `${user.scoreCount || 0}`,
    formatAdminDate(user.lastSyncAt)
  ]) {
    const cell = document.createElement("td");
    cell.textContent = String(value ?? "-");
    row.appendChild(cell);
  }

  return row;
}

function makeAdminTableRow(values) {
  const row = document.createElement("tr");
  for (const value of values) {
    const cell = document.createElement("td");
    cell.textContent = String(value ?? "-");
    row.appendChild(cell);
  }
  return row;
}

function formatAdminDate(value) {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

async function clearLeaderboardFromAdmin(level) {
  const label = level === "all" ? "全部榜单" : `${LEVELS[level]?.label || level}榜单`;
  if (!confirm(`确认清空${label}？`)) {
    return;
  }

  adminStatus.textContent = "正在清空榜单";
  try {
    const response = await apiFetch(`/api/mall/admin/minesweeper/leaderboard?level=${encodeURIComponent(level)}`, {
      method: "DELETE"
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "清空失败");
    }

    adminStatus.textContent = `${label}已清空`;
    await loadLeaderboard();
    await refreshAdminPanel();
  } catch (error) {
    adminStatus.textContent = error.message || "清空失败";
  }
}

async function deleteSelectedScoresFromAdmin() {
  const scores = [...selectedAdminScores].map((key) => {
    const [level, userId] = key.split(":");
    return { level, userId };
  });

  if (scores.length === 0) {
    adminStatus.textContent = "请先选择要删除的榜单成绩";
    return;
  }
  if (!confirm(`确认删除选中的 ${scores.length} 条榜单成绩？`)) {
    return;
  }

  adminStatus.textContent = "正在删除选中成绩";
  try {
    const response = await apiFetch("/api/mall/admin/minesweeper/scores", {
      method: "DELETE",
      body: JSON.stringify({ scores })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "删除失败");
    }
    adminStatus.textContent = `已删除 ${data.deleted || scores.length} 条成绩`;
    await loadLeaderboard();
    await refreshAdminPanel();
  } catch (error) {
    adminStatus.textContent = error.message || "删除失败";
  }
}

async function deleteSelectedUserSyncFromAdmin() {
  const userIds = [...selectedAdminUsers];
  if (userIds.length === 0) {
    adminStatus.textContent = "请先选择用户";
    return;
  }
  if (!confirm(`确认删除选中 ${userIds.length} 个用户的云端同步数据和榜单成绩？账号本身会保留。`)) {
    return;
  }

  await deleteAdminUserPayload("/api/mall/admin/minesweeper/user-sync", { userIds }, "云端数据");
}

async function deleteSelectedUsersFromAdmin() {
  const userIds = [...selectedAdminUsers];
  if (userIds.length === 0) {
    adminStatus.textContent = "请先选择用户";
    return;
  }
  if (!confirm(`确认删除选中的 ${userIds.length} 个用户账号？这会同时删除会话、OAuth 关联、云端同步、榜单成绩和活动券。`)) {
    return;
  }

  await deleteAdminUserPayload("/api/mall/admin/minesweeper/users", { userIds }, "用户");
}

async function deleteAdminUserPayload(path, payload, label) {
  adminStatus.textContent = `正在删除${label}`;
  try {
    const response = await apiFetch(path, {
      method: "DELETE",
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "删除失败");
    }
    adminStatus.textContent = `已删除 ${data.deleted || payload.userIds.length} 项${label}`;
    await loadLeaderboard();
    await refreshAdminPanel();
  } catch (error) {
    adminStatus.textContent = error.message || "删除失败";
  }
}

async function refreshAdminPanel() {
  try {
    const response = await apiFetch(`/api/mall/admin/minesweeper/overview?_=${Date.now()}`, {
      cache: "no-store"
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "后台数据读取失败");
    }
    adminData = data;
    selectedAdminScores = new Set();
    selectedAdminUsers = new Set();
    adminStatus.textContent = `超级管理员: ${data.admin.username} · Linux.do ID ${data.admin.linuxdoId}`;
    renderAdminOverview(data);
  } catch (error) {
    adminStatus.textContent = error.message || "后台数据读取失败";
  }
}

function toggleAllAdminScores() {
  const scores = adminData?.topScores || [];
  if (scores.length === 0) {
    return;
  }
  const keys = scores.map((score) => `${score.level}:${score.userId}`);
  const shouldSelect = keys.some((key) => !selectedAdminScores.has(key));
  selectedAdminScores = shouldSelect ? new Set(keys) : new Set();
  renderAdminOverview(adminData);
  switchAdminModule("leaderboard");
}

function toggleAllAdminUsers() {
  const users = adminData?.users || [];
  if (users.length === 0) {
    return;
  }
  const ids = users.map((user) => user.id);
  const shouldSelect = ids.some((id) => !selectedAdminUsers.has(id));
  selectedAdminUsers = shouldSelect ? new Set(ids) : new Set();
  renderAdminOverview(adminData);
  switchAdminModule("users");
}

function switchAdminModule(moduleName) {
  const nextModule = ["leaderboard", "users"].includes(moduleName) ? moduleName : "leaderboard";

  for (const button of adminModuleButtons) {
    const isActive = button.dataset.adminModule === nextModule;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }

  for (const panel of adminModulePanels) {
    panel.hidden = panel.dataset.adminPanel !== nextModule;
  }
}

function switchSideTab(tabName) {
  const showLearn = tabName === "learn";
  leaderboardPane.hidden = showLearn;
  learnPane.hidden = !showLearn;

  for (const tab of sideTabs) {
    const isActive = tab.dataset.sideTab === tabName;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  }
}

function setCurrentUser(user) {
  currentUser = user || null;
  if (!currentUser) {
    couponCampaign = null;
  }
  syncCloudHud();
}

function setSyncStatus(status) {
  syncStatus = status;
  syncCloudHud();
}

function getLocalUpdatedAt() {
  try {
    const meta = JSON.parse(localStorage.getItem(SYNC_META_KEY));
    return Number(meta?.clientUpdatedAt || 0);
  } catch {
    return 0;
  }
}

function setLocalUpdatedAt(clientUpdatedAt) {
  try {
    localStorage.setItem(SYNC_META_KEY, JSON.stringify({ clientUpdatedAt }));
  } catch {
    // Sync metadata is optional when storage is blocked.
  }
}

function isValidState(candidate) {
  return Boolean(
    candidate &&
      LEVELS[candidate.level] &&
      Number.isInteger(candidate.rows) &&
      Number.isInteger(candidate.cols) &&
      Array.isArray(candidate.cells) &&
      candidate.cells.length === candidate.rows * candidate.cols
  );
}

function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  const method = String(options.method || "GET").toUpperCase();
  if (!["GET", "HEAD", "OPTIONS"].includes(method) && !headers["X-CSRF-Token"]) {
    const csrfToken = readCookie("ms_csrf");
    if (csrfToken) headers["X-CSRF-Token"] = csrfToken;
  }
  return fetch(toApiPath(path), {
    ...options,
    credentials: "same-origin",
    headers
  });
}

function readCookie(name) {
  const prefix = `${name}=`;
  return document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length) || "";
}

function openAuthModal() {
  location.href = `/${currentUser ? "" : `?return_to=${encodeURIComponent(`${location.pathname}${location.search}${location.hash}`)}`}`;
}

function closeAuthModalDialog() {
  authModal.hidden = true;
  document.body.classList.remove("modal-open");
  lastFocusedElement?.focus?.();
}

async function handleAuthRedirectMessage() {
  await checkCloudSession({ silent: true });
  if (currentUser) {
    stateText.textContent = "已使用商城登录态连接云端同步";
    queueCloudSync(true);
  } else {
    stateText.textContent = "请先登录商城后再进入扫雷";
  }
}

function getAppBasePath() {
  const script = document.currentScript || document.querySelector('script[src$="script.js"]');
  if (!script) {
    return "/";
  }

  const scriptUrl = new URL(script.getAttribute("src") || "./script.js", location.href);
  let path = scriptUrl.pathname.replace(/[^/]+$/, "");
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  return path.endsWith("/") ? path : `${path}/`;
}

function toAppPath(path = "") {
  const clean = String(path || "").replace(/^\/+/, "");
  return `${APP_BASE_PATH}${clean}`;
}

function toApiPath(path) {
  const clean = String(path || "").replace(/^\/+/, "");
  return `${API_BASE_PATH}/${clean}`;
}

function isAdminPath() {
  return location.pathname.replace(/\/+$/, "") === ADMIN_PATH.replace(/\/+$/, "");
}

board.addEventListener("click", (event) => {
  if (suppressNextClick) {
    event.preventDefault();
    suppressNextClick = false;
    return;
  }

  const cell = event.target.closest(".cell");
  if (!cell) {
    return;
  }
  const index = Number(cell.dataset.index);
  const model = state.cells[index];
  if (model?.open) {
    chordOpen(index);
  } else {
    openCell(index);
  }
});

board.addEventListener("contextmenu", (event) => {
  const cell = event.target.closest(".cell");
  if (!cell) {
    return;
  }
  event.preventDefault();
  if (suppressNextContextMenu) {
    suppressNextContextMenu = false;
    return;
  }
  toggleMark(Number(cell.dataset.index));
});

board.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse") {
    return;
  }

  const cell = event.target.closest(".cell");
  if (!cell) {
    return;
  }

  const index = Number(cell.dataset.index);
  longPressPointerId = event.pointerId;
  longPressStart = { x: event.clientX, y: event.clientY };
  longPressTimer = setTimeout(() => {
    suppressNextClick = true;
    suppressNextContextMenu = true;
    toggleMark(index);
    navigator.vibrate?.(12);
    clearLongPress();
  }, LONG_PRESS_MS);
});

board.addEventListener("pointermove", (event) => {
  if (event.pointerId !== longPressPointerId || !longPressStart) {
    return;
  }

  const moved = Math.hypot(event.clientX - longPressStart.x, event.clientY - longPressStart.y);
  if (moved > MOVE_TOLERANCE) {
    clearLongPress();
  }
});

board.addEventListener("pointerup", clearLongPress);
board.addEventListener("pointercancel", clearLongPress);
board.addEventListener("pointerleave", clearLongPress);

board.addEventListener("keydown", (event) => {
  const cell = event.target.closest(".cell");
  if (!cell) {
    return;
  }

  const index = Number(cell.dataset.index);
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openCell(index);
  }

  if (event.key.toLowerCase() === "f") {
    event.preventDefault();
    toggleMark(index);
  }
});

resetButton.addEventListener("click", () => resetGame());
restartRoundButton.addEventListener("click", () => resetGame());

cloudToggle.addEventListener("click", () => {
  openAuthModal();
});

closeAuthModal.addEventListener("click", closeAuthModalDialog);
closeAdminModal.addEventListener("click", (event) => {
  event.preventDefault();
  closeAdminPanel();
});
leaderboardSelectAll.addEventListener("click", toggleAllAdminScores);
leaderboardClearSelected.addEventListener("click", deleteSelectedScoresFromAdmin);
userSelectAll.addEventListener("click", toggleAllAdminUsers);
userDeleteSyncSelected.addEventListener("click", deleteSelectedUserSyncFromAdmin);
userDeleteSelected.addEventListener("click", deleteSelectedUsersFromAdmin);

authModal.addEventListener("click", (event) => {
  if (event.target === authModal) {
    closeAuthModalDialog();
  }
});

adminModal.addEventListener("click", (event) => {
  const moduleButton = event.target.closest("[data-admin-module]");
  if (moduleButton) {
    switchAdminModule(moduleButton.dataset.adminModule);
    return;
  }

  const clearButton = event.target.closest("[data-clear-leaderboard]");
  if (clearButton) {
    clearLeaderboardFromAdmin(clearButton.dataset.clearLeaderboard);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !authModal.hidden) {
    closeAuthModalDialog();
  }
});

authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  openAuthModal();
});

authForm.addEventListener("click", (event) => {
  const action = event.target.closest("[data-auth-action]")?.dataset.authAction;
  if (action === "register") {
    event.preventDefault();
    openAuthModal();
  }
});

logoutButton.addEventListener("click", logoutCloud);

for (const tab of sideTabs) {
  tab.addEventListener("click", () => switchSideTab(tab.dataset.sideTab));
}

for (const button of levelButtons) {
  button.addEventListener("click", () => {
    changeLevel(button.dataset.levelButton);
  });
}

window.addEventListener("beforeunload", saveState);
document.addEventListener("visibilitychange", () => {
  if (state.status === "playing") {
    state.elapsed = Math.min(999, Math.floor((Date.now() - state.startedAt) / 1000));
    syncHud();
    saveState();
  }
});

const savedState = loadState();
if (savedState) {
  state = savedState;
  if (state.status === "playing") {
    state.startedAt = Date.now() - state.elapsed * 1000;
    startTimer();
  }
}

syncAll(null, false);
renderLearnList();
registerServiceWorker();
handleAuthRedirectMessage().then(() => {
  if (isAdminPath()) {
    location.replace("/admin?tab=minesweeper");
  }
});
loadLeaderboard();
