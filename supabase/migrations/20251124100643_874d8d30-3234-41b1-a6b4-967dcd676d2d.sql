-- Enable realtime for visas table
ALTER TABLE public.visas REPLICA IDENTITY FULL;

-- Add visas table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.visas;