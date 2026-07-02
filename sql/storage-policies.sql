-- Create images bucket in Supabase dashboard first.
-- Then run these policies:

CREATE POLICY "Public read images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "Admin upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Admin update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'images');

CREATE POLICY "Admin delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');
