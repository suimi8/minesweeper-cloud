ALTER TABLE mall_feedback ADD COLUMN submitted_at TEXT;

ALTER TABLE mall_ldc_ledger ADD COLUMN external_trade_no TEXT NOT NULL DEFAULT '';
ALTER TABLE mall_ldc_ledger ADD COLUMN external_status TEXT NOT NULL DEFAULT '';
ALTER TABLE mall_ldc_ledger ADD COLUMN external_error TEXT NOT NULL DEFAULT '';
