-- Create tour images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('tour-images', 'tour-images', true);

-- RLS policies for tour-images bucket
CREATE POLICY "Admins can upload tour images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'tour-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update tour images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'tour-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete tour images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'tour-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Anyone can view tour images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'tour-images');