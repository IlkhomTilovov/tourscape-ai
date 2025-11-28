-- Remove the trigger that's causing the error
DROP TRIGGER IF EXISTS on_booking_created ON bookings;
DROP FUNCTION IF EXISTS notify_telegram_on_booking();