-- Create homepage_content table for managing hero and stats sections
CREATE TABLE public.homepage_content (
  id text PRIMARY KEY DEFAULT 'main',
  hero_title_en text NOT NULL DEFAULT 'Book Experiences You''ll Remember',
  hero_title_uz text NOT NULL DEFAULT 'Esda qoladigan tajribalarni bron qiling',
  hero_title_ru text NOT NULL DEFAULT 'Бронируйте незабываемые впечатления',
  hero_title_de text NOT NULL DEFAULT 'Buchen Sie unvergessliche Erlebnisse',
  hero_subtitle_en text NOT NULL DEFAULT 'Discover and book unforgettable travel experiences worldwide',
  hero_subtitle_uz text NOT NULL DEFAULT 'Butun dunyo bo''ylab unutilmas sayohat tajribalarini kashf eting',
  hero_subtitle_ru text NOT NULL DEFAULT 'Откройте для себя незабываемые путешествия по всему миру',
  hero_subtitle_de text NOT NULL DEFAULT 'Entdecken Sie unvergessliche Reiseerlebnisse weltweit',
  hero_image_url text,
  stats_title_en text NOT NULL DEFAULT 'Why book with TravelHub?',
  stats_title_uz text NOT NULL DEFAULT 'Nega TravelHub bilan bron qilish kerak?',
  stats_title_ru text NOT NULL DEFAULT 'Почему бронировать с TravelHub?',
  stats_title_de text NOT NULL DEFAULT 'Warum bei TravelHub buchen?',
  stats_subtitle_en text NOT NULL DEFAULT 'Join millions of travelers who trust us for their unforgettable experiences',
  stats_subtitle_uz text NOT NULL DEFAULT 'Unutilmas tajribalar uchun bizga ishongan millionlab sayohatchilardan biri bo''ling',
  stats_subtitle_ru text NOT NULL DEFAULT 'Присоединяйтесь к миллионам путешественников, которые доверяют нам',
  stats_subtitle_de text NOT NULL DEFAULT 'Schließen Sie sich Millionen von Reisenden an, die uns vertrauen',
  stat1_value text NOT NULL DEFAULT '15M+',
  stat1_label_en text NOT NULL DEFAULT 'Happy Customers',
  stat1_label_uz text NOT NULL DEFAULT 'Mamnun mijozlar',
  stat1_label_ru text NOT NULL DEFAULT 'Довольных клиентов',
  stat1_label_de text NOT NULL DEFAULT 'Zufriedene Kunden',
  stat2_value text NOT NULL DEFAULT '500K+',
  stat2_label_en text NOT NULL DEFAULT 'Experiences',
  stat2_label_uz text NOT NULL DEFAULT 'Tajribalar',
  stat2_label_ru text NOT NULL DEFAULT 'Впечатлений',
  stat2_label_de text NOT NULL DEFAULT 'Erlebnisse',
  stat3_value text NOT NULL DEFAULT '180+',
  stat3_label_en text NOT NULL DEFAULT 'Countries',
  stat3_label_uz text NOT NULL DEFAULT 'Mamlakatlar',
  stat3_label_ru text NOT NULL DEFAULT 'Стран',
  stat3_label_de text NOT NULL DEFAULT 'Länder',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

-- Anyone can view
CREATE POLICY "Anyone can view homepage content"
ON public.homepage_content FOR SELECT
USING (true);

-- Admins can update
CREATE POLICY "Admins can update homepage content"
ON public.homepage_content FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert
CREATE POLICY "Admins can insert homepage content"
ON public.homepage_content FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default row
INSERT INTO public.homepage_content (id) VALUES ('main');