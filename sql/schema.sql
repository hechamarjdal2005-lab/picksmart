-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    blurb TEXT,
    price NUMERIC(10, 2),
    old_price NUMERIC(10, 2),
    rating NUMERIC(3, 2) CHECK (rating >= 0 AND rating <= 5),
    reviews_count INTEGER DEFAULT 0,
    main_image_url TEXT,
    main_image_alt TEXT,
    verdict TEXT,
    is_hero BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_best_pick BOOLEAN DEFAULT FALSE,
    is_amazon_choice BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quick Specs table
CREATE TABLE quick_specs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);

-- Pros and Cons table
CREATE TABLE pros_cons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('pro', 'con')),
    content TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);

-- Review Sections table
CREATE TABLE review_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    heading TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    image_alt TEXT,
    sort_order INTEGER DEFAULT 0
);

-- Gallery Images table
CREATE TABLE gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_alt TEXT,
    is_main BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0
);

-- Comparison table
CREATE TABLE comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    main_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    compare_product_name TEXT NOT NULL,
    compare_product_image_url TEXT,
    compare_product_image_alt TEXT,
    anc_rating TEXT,
    battery_life TEXT,
    price_display TEXT,
    is_current BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0
);

-- Affiliate Links table
CREATE TABLE affiliate_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    store_name TEXT NOT NULL,
    url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE
);

-- Newsletter Subscribers table
CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies (Public Read Access)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON categories FOR SELECT USING (true);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);

ALTER TABLE quick_specs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON quick_specs FOR SELECT USING (true);

ALTER TABLE pros_cons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON pros_cons FOR SELECT USING (true);

ALTER TABLE review_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON review_sections FOR SELECT USING (true);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON gallery_images FOR SELECT USING (true);

ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON comparisons FOR SELECT USING (true);

ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON affiliate_links FOR SELECT USING (true);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous insert access" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_pros_cons_product ON pros_cons(product_id);
CREATE INDEX idx_review_sections_product ON review_sections(product_id);
