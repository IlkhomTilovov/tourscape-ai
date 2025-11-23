// Deno edge function for translation

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } });
  }

  try {
    const { text, targetLanguages } = await req.json();

    const translations: Record<string, string> = {};

    for (const lang of targetLanguages) {
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [{
            role: 'user',
            content: `Translate the following text to ${lang}. Return ONLY the translated text without any additional context or explanation:\n\n${text}`
          }],
          temperature: 0.3,
        }),
      });

      const data = await response.json();
      translations[lang] = data.choices[0].message.content.trim();
    }

    return new Response(JSON.stringify({ translations }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Translation failed';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
});
