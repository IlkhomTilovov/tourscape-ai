-- Drop existing INSERT policy
DROP POLICY IF EXISTS "Public can create bookings" ON public.bookings;

-- Create PERMISSIVE policy that allows public (unauthenticated) access for INSERT
CREATE POLICY "Public can create bookings" 
ON public.bookings 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);