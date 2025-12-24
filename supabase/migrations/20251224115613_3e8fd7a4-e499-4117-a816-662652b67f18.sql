-- Enable RLS on bookings table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can INSERT bookings (public access)
CREATE POLICY "allow_public_insert" 
ON public.bookings 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Policy 2: Admins can view all bookings
CREATE POLICY "allow_admin_select" 
ON public.bookings 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy 3: Admins can update any booking
CREATE POLICY "allow_admin_update" 
ON public.bookings 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy 4: Admins can delete bookings
CREATE POLICY "allow_admin_delete" 
ON public.bookings 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));