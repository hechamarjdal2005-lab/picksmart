CREATE TABLE IF NOT EXISTS editorial_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    main_image_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE editorial_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
ON editorial_reviews FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated admin access"
ON editorial_reviews FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

