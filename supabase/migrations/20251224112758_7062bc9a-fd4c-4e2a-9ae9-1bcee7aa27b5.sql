-- Drop current INSERT policy
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;

-- Create policy that allows both authenticated users and anonymous users to insert
CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);