-- Enable realtime for flights table
ALTER TABLE public.flights REPLICA IDENTITY FULL;

-- Add flights table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.flights;