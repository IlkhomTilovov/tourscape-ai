-- Drop existing INSERT policy
DROP POLICY IF EXISTS "Public can create bookings" ON public.bookings;

-- Create explicitly PERMISSIVE policy for public booking creation
CREATE POLICY "Public can create bookings" 
ON public.bookings 
AS PERMISSIVE
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);