-- Site settings table (single-row, key-value via columns)
CREATE TABLE site_settings (
    id BIGINT PRIMARY KEY DEFAULT 1,
    logo_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT site_settings_single_row CHECK (id = 1)
);

-- Seed the initial row
INSERT INTO site_settings (id, logo_url) VALUES (1, NULL) ON CONFLICT (id) DO NOTHING;

-- RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_settings"
ON site_settings FOR SELECT
USING (true);

CREATE POLICY "Admin insert site_settings"
ON site_settings FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admin update site_settings"
ON site_settings FOR UPDATE
TO authenticated
USING (true);
