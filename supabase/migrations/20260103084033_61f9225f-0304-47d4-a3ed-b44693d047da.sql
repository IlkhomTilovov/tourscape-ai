-- Drop existing restrictive INSERT policy
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;

-- Recreate as PERMISSIVE policy (default)
CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
TO public
WITH CHECK (true);