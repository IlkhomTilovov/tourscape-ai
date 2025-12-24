-- Drop existing INSERT policy that requires authentication
DROP POLICY IF EXISTS "Authenticated users can create their own bookings" ON public.bookings;

-- Create new policy allowing anyone (including guests) to insert bookings
CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

-- Keep existing policies for admins and authenticated users to view/update their bookings