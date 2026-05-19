CREATE TABLE IF NOT EXISTS mall_feedback_logs (
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
);

CREATE INDEX IF NOT EXISTS idx_mall_feedback_logs_feedback ON mall_feedback_logs(feedback_id, created_at DESC);
