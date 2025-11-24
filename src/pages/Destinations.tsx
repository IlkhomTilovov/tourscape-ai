import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/translations";
import { ChevronRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

interface Category {
  id: string;
  name_en: string;
  name_uz: string;
  name_ru: string;
  name_de: string;
  icon: string | null;
}

interface CategoryWithCount extends Category {
  destinationCount: number;
  tourCount: number;
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
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchDestinations();

    // Real-time updates for categories
    const categoriesChannel = supabase
      .channel('categories-page-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        () => {
          fetchCategories();
        }
      )
      .subscribe();

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

    // Real-time updates for tours
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
          fetchCategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(categoriesChannel);
      supabase.removeChannel(destinationsChannel);
      supabase.removeChannel(toursChannel);
    };
  }, []);

  const fetchCategories = async () => {
    try {
      const { data: categoriesData, error: catError } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: true });

      if (catError) throw catError;

      // Get destinations to count for each category
      const { data: destinationsData } = await supabase
        .from("destinations")
        .select("id, name_en");

      // Get tours with category_id
      const { data: toursData } = await supabase
        .from("tours")
        .select("id, category_id");

      // Count destinations and tours for each category
      const categoriesWithCounts = (categoriesData || []).map(cat => {
        const categoryDestinations = destinationsData?.filter(
          dest => dest.name_en.toLowerCase() === cat.name_en.toLowerCase()
        ) || [];
        
        const categoryTours = toursData?.filter(
          tour => tour.category_id === cat.id
        ) || [];

        return {
          ...cat,
          destinationCount: categoryDestinations.length,
          tourCount: categoryTours.length
        };
      });

      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/search?category=${categoryId}`);
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

  const getIconComponent = (iconName: string | null) => {
    if (!iconName) return LucideIcons.Compass;
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Compass;
  };

  const getLocalizedName = (item: Category) => {
    const fieldMap: any = {
      uz: "name_uz",
      ru: "name_ru",
      de: "name_de",
      en: "name_en",
    };
    const field = fieldMap[language.toLowerCase()] || "name_en";
    return item[field as keyof Category] || item.name_en;
  };

  const filteredCategories = selectedCategory
    ? categories.filter((c) => c.id === selectedCategory)
    : categories;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Categories */}
            <div className="lg:w-80 flex-shrink-0">
              <h2 className="text-muted-foreground uppercase tracking-wide text-sm font-semibold mb-4">
                {language === "UZ" && "KATEGORIYALAR"}
                {language === "EN" && "CATEGORIES"}
                {language === "RU" && "КАТЕГОРИИ"}
                {language === "DE" && "KATEGORIEN"}
              </h2>
              
              <div className="space-y-2">
                {/* All Categories Option */}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
                    selectedCategory === null
                      ? "bg-primary text-primary-foreground"
                      : "bg-card hover:bg-accent text-foreground border border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LucideIcons.Grid3x3 className="w-5 h-5" />
                    <span className="font-medium">
                      {language === "UZ" && "Barchasi"}
                      {language === "EN" && "All"}
                      {language === "RU" && "Все"}
                      {language === "DE" && "Alle"}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </button>

                {categories.map((category) => {
                  const Icon = getIconComponent(category.icon);
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-card hover:bg-accent text-foreground border border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{getLocalizedName(category)}</span>
                      </div>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Content - Categories */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {language === "UZ" && "Kategoriyalar topilmadi"}
                    {language === "EN" && "No categories found"}
                    {language === "RU" && "Категории не найдены"}
                    {language === "DE" && "Keine Kategorien gefunden"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCategories.map((category) => {
                    const Icon = getIconComponent(category.icon);
                    return (
                      <Card
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className="cursor-pointer hover:shadow-lg transition-shadow group"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                              <Icon className="w-8 h-8 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-2">
                                {getLocalizedName(category)}
                              </h3>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <p>
                                  {category.tourCount} {
                                    language === "UZ" ? "ta tur" :
                                    language === "RU" ? "туров" :
                                    language === "DE" ? "Touren" :
                                    "tours"
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Destinations;
