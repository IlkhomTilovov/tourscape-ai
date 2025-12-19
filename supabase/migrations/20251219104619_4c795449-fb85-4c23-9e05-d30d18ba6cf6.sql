-- Drop the insecure policy that allows anyone to view bookings
DROP POLICY IF EXISTS "Anyone can view bookings" ON public.bookings;

-- Ensure only admins can view bookings (recreate if needed)
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
CREATE POLICY "Admins can view all bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));