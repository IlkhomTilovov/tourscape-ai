import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BookingData {
  id: string;
  tour_id: string;
  booking_date: string;
  booking_time: string;
  adults: number;
  total_price: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  pickup_address: string;
  payment_status: string;
  payment_method: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Telegram credentials not configured');
    }

    const bookingData: BookingData = await req.json();
    console.log('Received booking data:', bookingData);

    // Get tour details
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: tour } = await supabase
      .from('tours')
      .select('title_uz, title_en, title_ru')
      .eq('id', bookingData.tour_id)
      .single();

    // Format message for Telegram
    const message = `
🎉 *Yangi buyurtma!*

🏖️ *Tur nomi:*
${tour?.title_uz || 'N/A'}

👤 *Mijoz ma\'lumotlari:*
👨 Ism: ${bookingData.user_name || 'N/A'}
📧 Email: ${bookingData.user_email || 'N/A'}
📱 Telefon: ${bookingData.user_phone || 'N/A'}
📍 Olib ketish manzili: ${bookingData.pickup_address || 'N/A'}

📅 *Sana:* ${bookingData.booking_date}
⏰ *Vaqt:* ${bookingData.booking_time || 'N/A'}
👥 *Odamlar soni:* ${bookingData.adults}

💰 *Narx:* $${bookingData.total_price}
💳 *To\'lov usuli:* ${bookingData.payment_method || 'N/A'}
✅ *To\'lov holati:* ${bookingData.payment_status}
`;

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const telegramResult = await telegramResponse.json();
    console.log('Telegram response:', telegramResult);

    if (!telegramResponse.ok) {
      throw new Error(`Telegram API error: ${JSON.stringify(telegramResult)}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent to Telegram' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
