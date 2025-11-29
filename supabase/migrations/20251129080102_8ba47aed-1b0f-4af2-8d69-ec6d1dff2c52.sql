-- Add image_urls array column to tours table for multiple images
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}';

-- Add comment to explain the column
COMMENT ON COLUMN public.tours.image_urls IS 'Array of image URLs for tour gallery';