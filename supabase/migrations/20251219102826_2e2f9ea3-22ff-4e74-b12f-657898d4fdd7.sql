-- Drop the old policy that allows anyone to insert
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;

-- Create new policy requiring authentication for booking inserts
CREATE POLICY "Authenticated users can create bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (true);