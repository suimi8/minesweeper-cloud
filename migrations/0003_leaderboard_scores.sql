CREATE TABLE IF NOT EXISTS leaderboard_scores (
  level TEXT NOT NULL,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  seconds INTEGER NOT NULL,
  won_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (level, user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_scores_level_time ON leaderboard_scores(level, seconds, won_at);
