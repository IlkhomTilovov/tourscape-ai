-- Remove the old unrestricted delete policy (if it still exists)
DROP POLICY IF EXISTS "Users can delete their review images" ON storage.objects;