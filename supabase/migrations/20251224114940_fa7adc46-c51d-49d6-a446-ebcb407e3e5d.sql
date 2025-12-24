-- Temporarily disable RLS
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on bookings table
DROP POLICY IF EXISTS "Public can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own pending bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;

-- Re-enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create fresh policies
-- 1. Anyone can INSERT bookings (public access for booking creation)
CREATE POLICY "Anyone can insert bookings" 
ON public.bookings 
AS PERMISSIVE
FOR INSERT 
TO public
WITH CHECK (true);

-- 2. Admins can view all bookings
CREATE POLICY "Admins can view all bookings" 
ON public.bookings 
AS PERMISSIVE
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Users can view their own bookings
CREATE POLICY "Users can view own bookings" 
ON public.bookings 
AS PERMISSIVE
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- 4. Admins can update any booking
CREATE POLICY "Admins can update bookings" 
ON public.bookings 
AS PERMISSIVE
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. Users can update their own pending bookings
CREATE POLICY "Users can update own pending bookings" 
ON public.bookings 
AS PERMISSIVE
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid() AND payment_status = 'pending')
WITH CHECK (user_id = auth.uid());