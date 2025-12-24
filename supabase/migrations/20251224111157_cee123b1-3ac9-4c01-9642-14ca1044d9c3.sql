-- 1. Add user_id column to link bookings to authenticated users
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Drop the insecure INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create bookings" ON public.bookings;

-- 3. Create secure INSERT policy - requires authentication and sets user_id
CREATE POLICY "Authenticated users can create their own bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL AND (user_id IS NULL OR user_id = auth.uid()));

-- 4. Add policy for users to view their own bookings
CREATE POLICY "Users can view their own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 5. Add policy for users to update their own pending bookings
CREATE POLICY "Users can update their own pending bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (user_id = auth.uid() AND payment_status = 'pending')
WITH CHECK (user_id = auth.uid());