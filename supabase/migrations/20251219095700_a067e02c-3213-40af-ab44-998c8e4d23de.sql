-- Fix review-images INSERT policy to require folder structure
DROP POLICY IF EXISTS "Anyone can upload review images" ON storage.objects;

CREATE POLICY "Anyone can upload review images with path"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'review-images' AND
  -- Ensure uploads follow tour_id/filename pattern (folder structure required)
  (storage.foldername(name))[1] IS NOT NULL
);