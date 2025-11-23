-- Add image URLs column to reviews table
ALTER TABLE public.reviews 
ADD COLUMN image_urls text[] DEFAULT '{}';

-- Create a storage bucket for review images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-images', 'review-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for review images
CREATE POLICY "Anyone can view review images"
ON storage.objects FOR SELECT
USING (bucket_id = 'review-images');

CREATE POLICY "Anyone can upload review images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'review-images');

CREATE POLICY "Users can delete their review images"
ON storage.objects FOR DELETE
USING (bucket_id = 'review-images');