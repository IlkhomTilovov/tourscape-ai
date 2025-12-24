-- Drop the problematic policy that tries to access auth.users
DROP POLICY IF EXISTS "Users can view own bookings by email" ON public.bookings;

-- Recreate without accessing auth.users table directly
-- Users can view their own bookings by matching user_id
CREATE POLICY "Users can view own bookings"
ON public.bookings
FOR SELECT
USING (user_id = auth.uid());