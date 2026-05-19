CREATE TABLE IF NOT EXISTS mall_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'service',
  price INTEGER NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  image_url TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mall_products_status_sort ON mall_products(status, sort_order, created_at);

CREATE TABLE IF NOT EXISTS mall_orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  amount INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_mall_orders_user_created ON mall_orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mall_orders_status_created ON mall_orders(status, created_at DESC);

INSERT OR IGNORE INTO mall_products (id, name, description, category, price, stock, status, image_url, sort_order)
VALUES
  ('linuxdo-deu-mail', '社区大学 DEU 邮箱', '高权重教育邮箱权益，适合学术资源申请与账号绑定。', 'account', 50, 18, 'active', '', 10),
  ('linuxdo-credit-pack', 'Linux.do 积分补给包', '用于社区权益流转的积分补给记录，支持人工核验交付。', 'credit', 120, 8, 'active', '', 20),
  ('linuxdo-service-pass', '专属服务通行证', '面向高级用户的权益服务凭证，订单创建后由管理员处理。', 'service', 300, 5, 'active', '', 30);
