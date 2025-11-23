import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TourCard from "@/components/TourCard";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/translations";

interface Tour {
  id: string;
  title_en: string;
  title_uz: string;
  title_ru: string;
  title_de: string;
  description_en: string | null;
  description_uz: string | null;
  description_ru: string | null;
  description_de: string | null;
  location_en: string | null;
  location_uz: string | null;
  location_ru: string | null;
  location_de: string | null;
  price: number;
  duration: string;
  rating: number | null;
  reviews_count: number | null;
  image_url: string | null;
  is_bestseller: boolean | null;
}

const Tours = () => {
  const { language, t } = useLanguage();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const { data, error } = await supabase
        .from("tours")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTours(data || []);
    } catch (error) {
      console.error("Error fetching tours:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedText = (
    en: string | null,
    uz: string | null,
    ru: string | null,
    de: string | null
  ) => {
    const langMap: Record<Language, string | null> = {
      EN: en,
      UZ: uz,
      RU: ru,
      DE: de,
    };
    return langMap[language] || en || "";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">{t("tours")}</h1>
          <p className="text-muted-foreground mb-8">
            {language === "UZ" && "Barcha sayohatlarimizni ko'ring"}
            {language === "EN" && "Browse all our tours"}
            {language === "RU" && "Посмотреть все наши туры"}
            {language === "DE" && "Alle unsere Touren ansehen"}
          </p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : tours.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {language === "UZ" && "Sayohatlar topilmadi"}
                {language === "EN" && "No tours found"}
                {language === "RU" && "Туры не найдены"}
                {language === "DE" && "Keine Touren gefunden"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour) => (
                <TourCard
                  key={tour.id}
                  id={tour.id}
                  title={getLocalizedText(
                    tour.title_en,
                    tour.title_uz,
                    tour.title_ru,
                    tour.title_de
                  )}
                  location={getLocalizedText(
                    tour.location_en,
                    tour.location_uz,
                    tour.location_ru,
                    tour.location_de
                  )}
                  price={tour.price}
                  duration={tour.duration}
                  rating={tour.rating || 0}
                  reviewCount={tour.reviews_count || 0}
                  category=""
                  image={tour.image_url || "https://images.unsplash.com/photo-1488646953014-85cb44e25828"}
                  bestseller={tour.is_bestseller || false}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tours;
