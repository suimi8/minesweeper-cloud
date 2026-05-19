ALTER TABLE mall_orders ADD COLUMN discounts_json TEXT NOT NULL DEFAULT '[]';

CREATE TABLE IF NOT EXISTS mall_user_coupons (
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
);

CREATE INDEX IF NOT EXISTS idx_mall_user_coupons_user_status ON mall_user_coupons(user_id, status, expires_at);
CREATE INDEX IF NOT EXISTS idx_mall_user_coupons_campaign_rank ON mall_user_coupons(campaign_key, source_key, rank, created_at);
CREATE INDEX IF NOT EXISTS idx_mall_user_coupons_order ON mall_user_coupons(reserved_order_id, used_order_id);
