-- Column is added idempotently by the Worker ensureMallSeed() path.
CREATE TABLE IF NOT EXISTS migration_0009_marker (id INTEGER PRIMARY KEY);
