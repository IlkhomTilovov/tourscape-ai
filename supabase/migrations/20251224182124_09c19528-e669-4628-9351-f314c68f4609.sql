-- Enable RLS for bookings table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including anonymous users) to create bookings
CREATE POLICY "Anyone can create bookings"
ON public.bookings
FOR INSERT
TO public
WITH CHECK (true);

-- Allow admins to view all bookings
CREATE POLICY "Admins can view all bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow users to view their own bookings (by email)
CREATE POLICY "Users can view own bookings by email"
ON public.bookings
FOR SELECT
TO authenticated
USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Allow admins to update bookings
CREATE POLICY "Admins can update bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete bookings
CREATE POLICY "Admins can delete bookings"
ON public.bookings
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));