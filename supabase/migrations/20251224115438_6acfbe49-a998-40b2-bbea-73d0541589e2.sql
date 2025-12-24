-- Completely disable RLS on bookings table for now
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own pending bookings" ON public.bookings;