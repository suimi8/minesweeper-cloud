ALTER TABLE mall_products ADD COLUMN original_price INTEGER NOT NULL DEFAULT 0;
ALTER TABLE mall_products ADD COLUMN images_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE mall_products ADD COLUMN features_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE mall_products ADD COLUMN usage_guide TEXT NOT NULL DEFAULT '';
ALTER TABLE mall_products ADD COLUMN requires_user_info INTEGER NOT NULL DEFAULT 0;
ALTER TABLE mall_products ADD COLUMN user_info_fields_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE mall_products ADD COLUMN manual_stock INTEGER NOT NULL DEFAULT 0;
ALTER TABLE mall_products ADD COLUMN stock_threshold INTEGER NOT NULL DEFAULT 5;
ALTER TABLE mall_products ADD COLUMN limit_per_user INTEGER NOT NULL DEFAULT 0;
ALTER TABLE mall_products ADD COLUMN min_trust_level INTEGER NOT NULL DEFAULT 0;
ALTER TABLE mall_products ADD COLUMN delivery_mode TEXT NOT NULL DEFAULT 'manual';

ALTER TABLE mall_orders ADD COLUMN final_amount INTEGER NOT NULL DEFAULT 0;
ALTER TABLE mall_orders ADD COLUMN coupon_code TEXT NOT NULL DEFAULT '';
ALTER TABLE mall_orders ADD COLUMN discount_amount INTEGER NOT NULL DEFAULT 0;
ALTER TABLE mall_orders ADD COLUMN delivery_content TEXT NOT NULL DEFAULT '';
ALTER TABLE mall_orders ADD COLUMN delivered INTEGER NOT NULL DEFAULT 0;
ALTER TABLE mall_orders ADD COLUMN archived INTEGER NOT NULL DEFAULT 0;
ALTER TABLE mall_orders ADD COLUMN rated INTEGER NOT NULL DEFAULT 0;
ALTER TABLE mall_orders ADD COLUMN user_info_json TEXT NOT NULL DEFAULT '{}';
ALTER TABLE mall_orders ADD COLUMN trade_no TEXT NOT NULL DEFAULT '';
ALTER TABLE mall_orders ADD COLUMN completed_at TEXT;
ALTER TABLE mall_orders ADD COLUMN buyer_username TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS mall_cards (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unused',
  used_by TEXT NOT NULL DEFAULT '',
  order_id TEXT NOT NULL DEFAULT '',
  available_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  used_at TEXT,
  FOREIGN KEY (product_id) REFERENCES mall_products(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_mall_cards_product_status ON mall_cards(product_id, status, available_at);

CREATE TABLE IF NOT EXISTS mall_coupons (
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
);

CREATE INDEX IF NOT EXISTS idx_mall_coupons_code ON mall_coupons(code);
CREATE INDEX IF NOT EXISTS idx_mall_coupons_status ON mall_coupons(status);

CREATE TABLE IF NOT EXISTS mall_ratings (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  comment TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES mall_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES mall_products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_mall_ratings_product_created ON mall_ratings(product_id, created_at DESC);

CREATE TABLE IF NOT EXISTS mall_ads (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  link_url TEXT NOT NULL DEFAULT '',
  position TEXT NOT NULL DEFAULT 'sidebar',
  status TEXT NOT NULL DEFAULT 'active',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mall_ads_position_status ON mall_ads(position, status, sort_order);

CREATE TABLE IF NOT EXISTS mall_settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mall_audit_logs (
  id TEXT PRIMARY KEY,
  admin_user_id TEXT NOT NULL,
  admin_username TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mall_audit_created ON mall_audit_logs(created_at DESC);

CREATE TABLE IF NOT EXISTS mall_blacklist (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL DEFAULT 'ip',
  value TEXT NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(kind, value)
);

CREATE TABLE IF NOT EXISTS mall_email_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  is_default INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mall_login_attempts (
  id TEXT PRIMARY KEY,
  ip TEXT NOT NULL DEFAULT '',
  username TEXT NOT NULL DEFAULT '',
  success INTEGER NOT NULL DEFAULT 0,
  reason TEXT NOT NULL DEFAULT '',
  user_agent TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

UPDATE mall_products
SET
  original_price = CASE WHEN original_price = 0 THEN price ELSE original_price END,
  image_url = CASE WHEN image_url = '' THEN 'https://img.icons8.com/isometric/512/message-shared.png' ELSE image_url END,
  images_json = CASE WHEN images_json = '[]' THEN json_array(CASE WHEN image_url = '' THEN 'https://img.icons8.com/isometric/512/message-shared.png' ELSE image_url END) ELSE images_json END,
  features_json = CASE WHEN features_json = '[]' THEN json_array('Linux.do 登录可购', '云端订单留痕', '管理员后台处理') ELSE features_json END,
  usage_guide = CASE WHEN usage_guide = '' THEN '下单后请在我的订单中查看处理状态。自动交付商品会展示卡密凭证，人工服务商品由管理员处理。' ELSE usage_guide END,
  manual_stock = CASE WHEN manual_stock = 0 THEN stock ELSE manual_stock END,
  delivery_mode = CASE WHEN category = 'account' THEN 'auto' ELSE 'manual' END;

INSERT OR IGNORE INTO mall_cards (id, product_id, content, status)
VALUES
  ('seed-card-deu-001', 'linuxdo-deu-mail', '账号: deu_user_001 | 密码: linuxdo-001 | 说明: 首次登录后请修改密码', 'unused'),
  ('seed-card-deu-002', 'linuxdo-deu-mail', '账号: deu_user_002 | 密码: linuxdo-002 | 说明: 首次登录后请修改密码', 'unused'),
  ('seed-card-deu-003', 'linuxdo-deu-mail', '账号: deu_user_003 | 密码: linuxdo-003 | 说明: 首次登录后请修改密码', 'unused');

INSERT OR IGNORE INTO mall_coupons (id, code, product_id, type, value, limit_count, status)
VALUES
  ('seed-coupon-welcome', 'WELCOME10', '', 'percent', 10, 100, 'active');

INSERT OR IGNORE INTO mall_ads (id, title, description, image_url, link_url, position, status, sort_order)
VALUES
  ('seed-ad-minesweeper', '数学扫雷挑战', '商城账号直通，成绩写入云端排行榜。', '/games/minesweeper/icon.svg', '/games/minesweeper/', 'sidebar', 'active', 10);
