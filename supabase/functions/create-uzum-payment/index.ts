import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      anonKey,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { tourId, adults, bookingDate, bookingTime, totalPrice, userEmail, userPhone } = await req.json();

    const adultsCount = Number(adults);
    if (!tourId || !Number.isFinite(adultsCount) || adultsCount < 1 || adultsCount > 20) {
      return new Response(
        JSON.stringify({ error: 'Invalid booking data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify tour and compute expected total
    const { data: tour, error: tourError } = await supabase
      .from('tours')
      .select('id, price')
      .eq('id', tourId)
      .single();

    if (tourError || !tour) {
      return new Response(
        JSON.stringify({ error: 'Invalid tour' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const expectedTotal = Number(tour.price) * adultsCount;
    const providedTotal = Number(totalPrice);
    if (!Number.isFinite(providedTotal) || Math.abs(providedTotal - expectedTotal) > 0.01) {
      return new Response(
        JSON.stringify({ error: 'Invalid price' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating Uzum payment for booking:', { tourId, adults: adultsCount, totalPrice: expectedTotal });

    // Convert date from DD/MM/YYYY to YYYY-MM-DD format
    let formattedDate = bookingDate;
    if (bookingDate && typeof bookingDate === 'string' && bookingDate.includes('/')) {
      const [day, month, year] = bookingDate.split('/');
      formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // Create booking record (RLS applies)
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        tour_id: tourId,
        user_id: userData.user.id,
        user_email: typeof userEmail === 'string' ? userEmail.trim() : null,
        user_phone: typeof userPhone === 'string' ? userPhone.trim() : null,
        adults: adultsCount,
        booking_date: formattedDate,
        booking_time: bookingTime ?? null,
        total_price: expectedTotal,
        payment_status: 'pending',
        payment_method: 'uzum',
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      throw bookingError;
    }

    console.log('Booking created:', booking.id);
    // Send Telegram notification
    try {
      await supabase.functions.invoke('send-telegram-notification', {
        body: {
          id: booking.id,
          tour_id: booking.tour_id,
          booking_date: booking.booking_date,
          booking_time: booking.booking_time,
          adults: booking.adults,
          total_price: booking.total_price,
          user_email: booking.user_email,
          user_phone: booking.user_phone,
          payment_status: booking.payment_status,
          payment_method: booking.payment_method
        }
      });
      console.log('Telegram notification sent successfully');
    } catch (notificationError) {
      console.error('Failed to send Telegram notification:', notificationError);
      // Don't fail the booking if notification fails
    }

    // TODO: Integrate with Uzum API when credentials are available
    // For now, return a mock payment URL
    // When you get Uzum API credentials, uncomment and configure:
    /*
    const uzumApiKey = Deno.env.get('UZUM_API_KEY');
    const uzumMerchantId = Deno.env.get('UZUM_MERCHANT_ID');
    
    const uzumResponse = await fetch('https://api.uzum.uz/payment/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${uzumApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        merchant_id: uzumMerchantId,
        amount: totalPrice * 100, // Convert to tiyin
        order_id: booking.id,
        description: `Tour booking #${booking.id}`,
        return_url: `${Deno.env.get('VITE_SUPABASE_URL')}/payment/success`,
        cancel_url: `${Deno.env.get('VITE_SUPABASE_URL')}/payment/cancel`,
      })
    });

    const uzumData = await uzumResponse.json();
    
    // Update booking with payment_id
    await supabase
      .from('bookings')
      .update({ payment_id: uzumData.payment_id })
      .eq('id', booking.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        bookingId: booking.id,
        paymentUrl: uzumData.payment_url 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    */

    // Mock response until Uzum API is configured
    return new Response(
      JSON.stringify({ 
        success: true, 
        bookingId: booking.id,
        message: 'Booking created successfully. Uzum payment integration will be added when API credentials are configured.',
        // Mock payment URL for demo
        paymentUrl: `https://uzum.uz/pay/demo/${booking.id}`,
        mock: true
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in create-uzum-payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});