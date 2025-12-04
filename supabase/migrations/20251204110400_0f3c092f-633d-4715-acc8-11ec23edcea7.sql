-- Drop existing foreign key constraints
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_tour_id_fkey;
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_tour_id_fkey;

-- Recreate with ON DELETE CASCADE for reviews (reviews should be deleted with tour)
ALTER TABLE public.reviews 
ADD CONSTRAINT reviews_tour_id_fkey 
FOREIGN KEY (tour_id) REFERENCES public.tours(id) ON DELETE CASCADE;

-- Recreate with ON DELETE SET NULL for bookings (keep booking history but remove tour reference)
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_tour_id_fkey 
FOREIGN KEY (tour_id) REFERENCES public.tours(id) ON DELETE SET NULL;

-- Also need to make tour_id nullable in bookings for SET NULL to work
ALTER TABLE public.bookings ALTER COLUMN tour_id DROP NOT NULL;