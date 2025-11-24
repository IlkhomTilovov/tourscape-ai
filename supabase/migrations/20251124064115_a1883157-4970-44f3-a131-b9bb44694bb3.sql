-- Create menu_items table for dynamic navigation
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_uz TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  name_de TEXT NOT NULL,
  url TEXT,
  parent_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view menu items"
  ON public.menu_items
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert menu items"
  ON public.menu_items
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update menu items"
  ON public.menu_items
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete menu items"
  ON public.menu_items
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial menu structure
INSERT INTO public.menu_items (name_en, name_uz, name_ru, name_de, url, display_order) VALUES
  ('Home', 'Asosiy', 'Главная', 'Startseite', '/', 1),
  ('Destinations', 'Yo''nalishlar', 'Направления', 'Reiseziele', '/destinations', 2),
  ('Tours', 'Turlar', 'Туры', 'Touren', '/tours', 3),
  ('Flights', 'Aviabiletlar', 'Авиабилеты', 'Flüge', '/flights', 4),
  ('Hotels', 'Mehmonxonalar', 'Отели', 'Hotels', '/hotels', 5),
  ('Visas', 'Vizalar', 'Визы', 'Visa', '/visas', 6),
  ('About', 'Biz haqimizda', 'О нас', 'Über uns', '/about', 7);

-- Get IDs for parent menus
DO $$
DECLARE
  destinations_id UUID;
  tours_id UUID;
  flights_id UUID;
  hotels_id UUID;
  visas_id UUID;
  about_id UUID;
BEGIN
  SELECT id INTO destinations_id FROM public.menu_items WHERE url = '/destinations';
  SELECT id INTO tours_id FROM public.menu_items WHERE url = '/tours';
  SELECT id INTO flights_id FROM public.menu_items WHERE url = '/flights';
  SELECT id INTO hotels_id FROM public.menu_items WHERE url = '/hotels';
  SELECT id INTO visas_id FROM public.menu_items WHERE url = '/visas';
  SELECT id INTO about_id FROM public.menu_items WHERE url = '/about';

  -- Destinations submenu
  INSERT INTO public.menu_items (name_en, name_uz, name_ru, name_de, url, parent_id, display_order) VALUES
    ('By Countries', 'Mamlakatlar bo''yicha', 'По странам', 'Nach Ländern', '/destinations?filter=countries', destinations_id, 1),
    ('By Cities', 'Shaharlar bo''yicha', 'По городам', 'Nach Städten', '/destinations?filter=cities', destinations_id, 2),
    ('Mountains & Sea', 'Tog''-dengiz', 'Горы и море', 'Berge & Meer', '/destinations?filter=nature', destinations_id, 3),
    ('Seasonal', 'Mavsumiy', 'Сезонные', 'Saisonal', '/destinations?filter=seasonal', destinations_id, 4);

  -- Tours submenu
  INSERT INTO public.menu_items (name_en, name_uz, name_ru, name_de, url, parent_id, display_order) VALUES
    ('Exclusive Tours', 'Eksklyuziv turlar', 'Эксклюзивные туры', 'Exklusive Touren', '/tours?type=exclusive', tours_id, 1),
    ('Group Tours', 'Guruh turlari', 'Групповые туры', 'Gruppenreisen', '/tours?type=group', tours_id, 2),
    ('Family Tours', 'Oilaviy turlar', 'Семейные туры', 'Familienreisen', '/tours?type=family', tours_id, 3),
    ('VIP Tours', 'VIP turlar', 'VIP туры', 'VIP Touren', '/tours?type=vip', tours_id, 4),
    ('Promotions', 'Aksiya va chegirmalar', 'Акции и скидки', 'Aktionen', '/tours?filter=promotions', tours_id, 5);

  -- Flights submenu
  INSERT INTO public.menu_items (name_en, name_uz, name_ru, name_de, url, parent_id, display_order) VALUES
    ('Search', 'Qidiruv', 'Поиск', 'Suche', '/flights/search', flights_id, 1),
    ('Cheap Tickets', 'Arzon chiptalar', 'Дешевые билеты', 'Billige Tickets', '/flights/cheap', flights_id, 2),
    ('Charter Flights', 'Charter reyslar', 'Чартерные рейсы', 'Charterflüge', '/flights/charter', flights_id, 3);

  -- Hotels submenu
  INSERT INTO public.menu_items (name_en, name_uz, name_ru, name_de, url, parent_id, display_order) VALUES
    ('By Star Rating', 'Yulduz darajasi', 'По звездам', 'Nach Sternen', '/hotels?filter=stars', hotels_id, 1),
    ('By Location', 'Joylashuv bo''yicha', 'По расположению', 'Nach Standort', '/hotels?filter=location', hotels_id, 2),
    ('Special Offers', 'Maxsus takliflar', 'Спецпредложения', 'Sonderangebote', '/hotels?filter=offers', hotels_id, 3);

  -- Visas submenu
  INSERT INTO public.menu_items (name_en, name_uz, name_ru, name_de, url, parent_id, display_order) VALUES
    ('Visa Types', 'Viza turlari', 'Типы виз', 'Visa-Typen', '/visas/types', visas_id, 1),
    ('Required Documents', 'Kerakli hujjatlar', 'Требуемые документы', 'Erforderliche Dokumente', '/visas/documents', visas_id, 2),
    ('Apply Online', 'Onlayn murojaat', 'Онлайн заявка', 'Online beantragen', '/visas/apply', visas_id, 3);

  -- About submenu
  INSERT INTO public.menu_items (name_en, name_uz, name_ru, name_de, url, parent_id, display_order) VALUES
    ('About Company', 'Kompaniya haqida', 'О компании', 'Über das Unternehmen', '/about/company', about_id, 1),
    ('Our Team', 'Jamoa', 'Наша команда', 'Unser Team', '/about/team', about_id, 2),
    ('Why Us', 'Nima uchun biz?', 'Почему мы?', 'Warum wir?', '/about/why-us', about_id, 3);
END $$;