-- Columns are added idempotently by the Worker ensureMallSeed() path.
CREATE TABLE IF NOT EXISTS migration_0011_marker (id INTEGER PRIMARY KEY);

CREATE TABLE IF NOT EXISTS mall_lottery_draws (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  draw_date TEXT NOT NULL,
  prize_label TEXT NOT NULL DEFAULT '',
  prize_value REAL NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id, draw_date)
);
