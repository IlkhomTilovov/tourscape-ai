-- Drop all policies on bookings
DROP POLICY IF EXISTS "allow_public_insert" ON public.bookings;
DROP POLICY IF EXISTS "allow_admin_select" ON public.bookings;
DROP POLICY IF EXISTS "allow_admin_update" ON public.bookings;
DROP POLICY IF EXISTS "allow_admin_delete" ON public.bookings;

-- Disable RLS completely - bookings will be managed via frontend access control
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON public.bookings TO anon;
GRANT ALL ON public.bookings TO authenticated;