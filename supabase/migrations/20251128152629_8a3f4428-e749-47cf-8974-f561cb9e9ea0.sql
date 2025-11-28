-- Create a function to notify Telegram when a booking is created
CREATE OR REPLACE FUNCTION notify_telegram_on_booking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_id bigint;
  booking_json jsonb;
BEGIN
  -- Build the booking data JSON
  booking_json := jsonb_build_object(
    'id', NEW.id,
    'tour_id', NEW.tour_id,
    'booking_date', NEW.booking_date,
    'booking_time', NEW.booking_time,
    'adults', NEW.adults,
    'total_price', NEW.total_price,
    'user_email', NEW.user_email,
    'user_phone', NEW.user_phone,
    'payment_status', NEW.payment_status,
    'payment_method', NEW.payment_method
  );

  -- Make HTTP request to edge function
  SELECT
    net.http_post(
      url := 'https://cryyvpzjerhlwbxpeeks.supabase.co/functions/v1/send-telegram-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := booking_json
    ) INTO request_id;

  RETURN NEW;
END;
$$;

-- Create trigger to call the function on new bookings
DROP TRIGGER IF EXISTS on_booking_created ON bookings;

CREATE TRIGGER on_booking_created
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_telegram_on_booking();