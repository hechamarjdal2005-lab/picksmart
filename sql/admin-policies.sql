-- Admin write access for authenticated Supabase users.
-- These policies assume you manage admin users manually in Supabase Auth.

CREATE POLICY "Admin manage categories"
ON categories
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admin manage products"
ON products
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admin manage quick specs"
ON quick_specs
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admin manage pros cons"
ON pros_cons
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admin manage subscribers"
ON newsletter_subscribers
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admin manage editorial reviews"
ON editorial_reviews
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
