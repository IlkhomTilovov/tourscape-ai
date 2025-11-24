import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DestinationCard from "@/components/DestinationCard";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/translations";
import { Button } from "@/components/ui/button";

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
  category: string | null;
}

const categoryLabels: Record<string, Record<Language, string>> = {
  regions: { UZ: "Viloyatlar bo'yicha", EN: "By Regions", RU: "По регионам", DE: "Nach Regionen" },
  cities: { UZ: "Shaharlar bo'yicha", EN: "By Cities", RU: "По городам", DE: "Nach Städten" },
  nature: { UZ: "Tabiiy yo'nalishlar", EN: "Nature Destinations", RU: "Природные направления", DE: "Naturdestinationen" },
  cultural: { UZ: "Madaniy yo'nalishlar", EN: "Cultural Destinations", RU: "Культурные направления", DE: "Kulturdestinationen" },
  eco_tourism: { UZ: "Eko-turizm", EN: "Eco-tourism", RU: "Эко-туризм", DE: "Ökotourismus" },
  health_spa: { UZ: "Sog'lomlashtirish va SPA", EN: "Health & SPA", RU: "Здоровье и СПА", DE: "Gesundheit & SPA" },
  seasonal: { UZ: "Mavsumiy yo'nalishlar", EN: "Seasonal Destinations", RU: "Сезонные направления", DE: "Saisonale Reiseziele" },
  thematic: { UZ: "Tematik yo'nalishlar", EN: "Thematic Destinations", RU: "Тематические направления", DE: "Themendestinationen" },
  events: { UZ: "Mahalliy tadbirlar", EN: "Local Events", RU: "Местные события", DE: "Lokale Veranstaltungen" },
};

const Destinations = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [tourCounts, setTourCounts] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchDestinations();
    fetchTourCounts();

    // Real-time updates for destinations
    const destinationsChannel = supabase
      .channel('destinations-page-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'destinations'
        },
        () => {
          fetchDestinations();
        }
      )
      .subscribe();

    // Real-time updates for tours (for tour counts)
    const toursChannel = supabase
      .channel('destinations-tours-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tours'
        },
        () => {
          fetchTourCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(destinationsChannel);
      supabase.removeChannel(toursChannel);
    };
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

  const filteredDestinations = selectedCategory
    ? destinations.filter((d) => d.category === selectedCategory)
    : destinations;

  const categories = Array.from(new Set(destinations.map((d) => d.category).filter(Boolean)));

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

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                size="sm"
              >
                {language === "UZ" && "Barchasi"}
                {language === "EN" && "All"}
                {language === "RU" && "Все"}
                {language === "DE" && "Alle"}
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat)}
                  size="sm"
                >
                  {categoryLabels[cat]?.[language] || cat}
                </Button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filteredDestinations.length === 0 ? (
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
              {filteredDestinations.map((destination) => (
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
