-- Add category column to destinations table
ALTER TABLE public.destinations 
ADD COLUMN category TEXT;

COMMENT ON COLUMN public.destinations.category IS 'Category types: regions, cities, nature, cultural, eco_tourism, health_spa, seasonal, thematic, events';