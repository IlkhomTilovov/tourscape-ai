-- Add name and pickup_address columns to bookings table
ALTER TABLE public.bookings 
ADD COLUMN user_name text,
ADD COLUMN pickup_address text;