-- Drop existing INSERT policy
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;

-- Create policy that allows public (unauthenticated) access for INSERT
CREATE POLICY "Public can create bookings" 
ON public.bookings 
FOR INSERT 
TO public
WITH CHECK (true);