-- Create footer_content table for managing footer information
CREATE TABLE public.footer_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  phone TEXT NOT NULL DEFAULT '+998 93 284 71 17',
  email TEXT NOT NULL DEFAULT 'info@bestour.uz',
  address_uz TEXT NOT NULL DEFAULT 'Toshkent shahri, O''zbekiston',
  address_en TEXT NOT NULL DEFAULT 'Tashkent, Uzbekistan',
  address_ru TEXT NOT NULL DEFAULT 'Ташкент, Узбекистан',
  address_de TEXT NOT NULL DEFAULT 'Taschkent, Usbekistan',
  working_hours_weekday TEXT NOT NULL DEFAULT '09:00 - 18:00',
  working_hours_weekend TEXT NOT NULL DEFAULT 'Dam olish',
  instagram_url TEXT DEFAULT 'https://www.instagram.com/bestour.uz',
  whatsapp_number TEXT DEFAULT '+998932847117',
  telegram_url TEXT DEFAULT 'https://t.me/sherzod_757',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.footer_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view footer content"
ON public.footer_content FOR SELECT
USING (true);

CREATE POLICY "Admins can update footer content"
ON public.footer_content FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert footer content"
ON public.footer_content FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default row
INSERT INTO public.footer_content (id) VALUES ('main');