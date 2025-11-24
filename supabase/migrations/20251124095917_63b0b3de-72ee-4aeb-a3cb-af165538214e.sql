-- Enable realtime for menu_items table
ALTER TABLE public.menu_items REPLICA IDENTITY FULL;

-- Enable realtime for categories table
ALTER TABLE public.categories REPLICA IDENTITY FULL;

-- Enable realtime for destinations table
ALTER TABLE public.destinations REPLICA IDENTITY FULL;

-- Enable realtime for tours table
ALTER TABLE public.tours REPLICA IDENTITY FULL;