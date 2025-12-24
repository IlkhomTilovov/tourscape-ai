-- Drop existing RESTRICTIVE policies
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings by email" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;

-- Recreate as PERMISSIVE policies (default)
CREATE POLICY "Anyone can create bookings"
ON public.bookings
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all bookings"
ON public.bookings
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own bookings by email"
ON public.bookings
FOR SELECT
USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text);

CREATE POLICY "Admins can update bookings"
ON public.bookings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete bookings"
ON public.bookings
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));