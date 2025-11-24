-- Drop the old text-based category column
ALTER TABLE public.destinations DROP COLUMN IF EXISTS category;

-- Add new category_id column as foreign key
ALTER TABLE public.destinations 
  ADD COLUMN category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX idx_destinations_category_id ON public.destinations(category_id);