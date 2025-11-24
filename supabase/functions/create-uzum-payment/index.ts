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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { tourId, adults, bookingDate, bookingTime, totalPrice, userEmail, userPhone } = await req.json();

    console.log('Creating Uzum payment for booking:', { tourId, adults, totalPrice });

    // Convert date from DD/MM/YYYY to YYYY-MM-DD format
    let formattedDate = bookingDate;
    if (bookingDate && bookingDate.includes('/')) {
      const [day, month, year] = bookingDate.split('/');
      formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // Create booking record
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        tour_id: tourId,
        user_email: userEmail,
        user_phone: userPhone,
        adults,
        booking_date: formattedDate,
        booking_time: bookingTime,
        total_price: totalPrice,
        payment_status: 'pending',
        payment_method: 'uzum'
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      throw bookingError;
    }

    console.log('Booking created:', booking.id);

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