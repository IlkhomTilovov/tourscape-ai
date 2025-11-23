import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DestinationCard from "@/components/DestinationCard";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/translations";

interface Destination {
  id: string;
  name_en: string;
  name_uz: string;
  name_ru: string;
  name_de: string;
  description_en: string | null;
  description_uz: string | null;
  description_ru: string | null;
  description_de: string | null;
  country: string;
  image_url: string | null;
}

const Destinations = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [tourCounts, setTourCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchDestinations();
    fetchTourCounts();
  }, []);

  const fetchDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDestinations(data || []);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTourCounts = async () => {
    try {
      const { data, error } = await supabase
        .from("tours")
        .select("destination_id");

      if (error) throw error;
      
      const counts: Record<string, number> = {};
      data?.forEach((tour) => {
        if (tour.destination_id) {
          counts[tour.destination_id] = (counts[tour.destination_id] || 0) + 1;
        }
      });
      
      setTourCounts(counts);
    } catch (error) {
      console.error("Error fetching tour counts:", error);
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

  const handleDestinationClick = (destinationId: string) => {
    navigate(`/search?destination=${destinationId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">{t("destinations")}</h1>
          <p className="text-muted-foreground mb-8">
            {language === "UZ" && "Ajoyib yo'nalishlarni kashf eting"}
            {language === "EN" && "Discover amazing destinations"}
            {language === "RU" && "Откройте для себя удивительные направления"}
            {language === "DE" && "Entdecken Sie erstaunliche Reiseziele"}
          </p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : destinations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {language === "UZ" && "Yo'nalishlar topilmadi"}
                {language === "EN" && "No destinations found"}
                {language === "RU" && "Направления не найдены"}
                {language === "DE" && "Keine Reiseziele gefunden"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((destination) => (
                <div
                  key={destination.id}
                  onClick={() => handleDestinationClick(destination.id)}
                  className="cursor-pointer"
                >
                  <DestinationCard
                    name={getLocalizedText(
                      destination.name_en,
                      destination.name_uz,
                      destination.name_ru,
                      destination.name_de
                    )}
                    country={destination.country}
                    image={destination.image_url || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"}
                    tourCount={tourCounts[destination.id] || 0}
                    slug={destination.id}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Destinations;
