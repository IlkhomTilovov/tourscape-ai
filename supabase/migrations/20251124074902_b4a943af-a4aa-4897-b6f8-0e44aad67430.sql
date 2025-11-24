-- Create flights table
CREATE TABLE public.flights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  airline TEXT NOT NULL,
  from_city TEXT NOT NULL,
  to_city TEXT NOT NULL,
  departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
  arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
  price NUMERIC NOT NULL,
  available_seats INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hotels table
CREATE TABLE public.hotels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  price_per_night NUMERIC NOT NULL,
  rating NUMERIC NOT NULL DEFAULT 0,
  available_rooms INTEGER NOT NULL DEFAULT 0,
  amenities TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create visas table
CREATE TABLE public.visas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country TEXT NOT NULL,
  visa_type TEXT NOT NULL,
  duration TEXT NOT NULL,
  processing_time TEXT NOT NULL,
  price NUMERIC NOT NULL,
  requirements TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create about table
CREATE TABLE public.about (
  id TEXT NOT NULL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  mission TEXT,
  vision TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for flights
CREATE POLICY "Anyone can view flights" ON public.flights FOR SELECT USING (true);
CREATE POLICY "Admins can insert flights" ON public.flights FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update flights" ON public.flights FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete flights" ON public.flights FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Create RLS policies for hotels
CREATE POLICY "Anyone can view hotels" ON public.hotels FOR SELECT USING (true);
CREATE POLICY "Admins can insert hotels" ON public.hotels FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update hotels" ON public.hotels FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete hotels" ON public.hotels FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Create RLS policies for visas
CREATE POLICY "Anyone can view visas" ON public.visas FOR SELECT USING (true);
CREATE POLICY "Admins can insert visas" ON public.visas FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update visas" ON public.visas FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete visas" ON public.visas FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Create RLS policies for about
CREATE POLICY "Anyone can view about" ON public.about FOR SELECT USING (true);
CREATE POLICY "Admins can insert about" ON public.about FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update about" ON public.about FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete about" ON public.about FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_flights_updated_at
BEFORE UPDATE ON public.flights
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hotels_updated_at
BEFORE UPDATE ON public.hotels
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_visas_updated_at
BEFORE UPDATE ON public.visas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_about_updated_at
BEFORE UPDATE ON public.about
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();