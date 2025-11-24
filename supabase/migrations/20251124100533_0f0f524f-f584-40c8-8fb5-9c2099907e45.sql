-- Enable realtime for hotels table
ALTER TABLE public.hotels REPLICA IDENTITY FULL;

-- Add hotels table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.hotels;