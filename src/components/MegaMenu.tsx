import { useNavigate } from "react-router-dom";
import { ChevronRight, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MegaMenuCategory {
  id: string;
  name_en: string;
  name_uz: string;
  name_ru: string;
  name_de: string;
  url: string;
}

interface MegaMenuProps {
  categories: MegaMenuCategory[];
  onClose: () => void;
}

const MegaMenu = ({ categories, onClose }: MegaMenuProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Fetch featured destinations
  const { data: destinations = [] } = useQuery({
    queryKey: ["featured-destinations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  const getCategoryName = (category: MegaMenuCategory) => {
    switch (language) {
      case "EN":
        return category.name_en;
      case "UZ":
        return category.name_uz;
      case "RU":
        return category.name_ru;
      case "DE":
        return category.name_de;
      default:
        return category.name_en;
    }
  };

  const getDestinationName = (destination: any) => {
    switch (language) {
      case "EN":
        return destination.name_en;
      case "UZ":
        return destination.name_uz;
      case "RU":
        return destination.name_ru;
      case "DE":
        return destination.name_de;
      default:
        return destination.name_en;
    }
  };

  const getDestinationDescription = (destination: any) => {
    switch (language) {
      case "EN":
        return destination.description_en || "Explore amazing places";
      case "UZ":
        return destination.description_uz || "Ajoyib joylarni kashf eting";
      case "RU":
        return destination.description_ru || "Исследуйте удивительные места";
      case "DE":
        return destination.description_de || "Erkunden Sie erstaunliche Orte";
      default:
        return destination.description_en || "Explore amazing places";
    }
  };

  const handleCategoryClick = (url: string) => {
    navigate(url);
    onClose();
  };

  return (
    <div className="fixed left-0 right-0 top-16 w-full bg-background border-t border-border shadow-2xl z-50 animate-fade-in">
      <div className="max-w-[1400px] px-8 py-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="md:col-span-1 space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
              {language === "UZ" ? "Kategoriyalar" : 
               language === "RU" ? "Категории" : 
               language === "DE" ? "Kategorien" : "Categories"}
            </h3>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.url)}
                className="w-full flex items-center justify-between px-3 py-2 text-foreground hover:bg-accent rounded-md transition-colors group"
              >
                <span className="text-sm">{getCategoryName(category)}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>

          {/* Featured Content */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {destinations.length > 0 ? (
              destinations.map((destination, index) => (
                <div
                  key={destination.id}
                  onClick={() => handleCategoryClick(`/search?destination=${destination.name_en}`)}
                  className="group relative overflow-hidden rounded-lg aspect-[4/3] cursor-pointer"
                  style={{
                    backgroundImage: destination.image_url
                      ? `url(${destination.image_url})`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {!destination.image_url && (
                    <div
                      className={`absolute inset-0 ${
                        index === 0
                          ? "bg-gradient-to-br from-primary/30 to-primary/10"
                          : index === 1
                          ? "bg-gradient-to-br from-accent/30 to-accent/10"
                          : "bg-gradient-to-br from-secondary/30 to-secondary/10"
                      }`}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h4 className="font-bold text-lg mb-2">
                      {getDestinationName(destination)}
                    </h4>
                    <p className="text-sm text-white/90 mb-3 line-clamp-2">
                      {getDestinationDescription(destination)}
                    </p>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="group relative overflow-hidden rounded-lg aspect-[4/3] bg-gradient-to-br from-primary/20 to-primary/5 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h4 className="font-bold text-lg mb-2">
                      {language === "UZ" ? "Mashhur Sayohatlar" :
                       language === "RU" ? "Популярные Туры" :
                       language === "DE" ? "Beliebte Touren" : "Popular Tours"}
                    </h4>
                    <p className="text-sm text-white/90 mb-3">
                      {language === "UZ" ? "Eng yaxshi takliflar" :
                       language === "RU" ? "Лучшие предложения" :
                       language === "DE" ? "Beste Angebote" : "Best offers"}
                    </p>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="group relative overflow-hidden rounded-lg aspect-[4/3] bg-gradient-to-br from-accent/20 to-accent/5 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h4 className="font-bold text-lg mb-2">
                      {language === "UZ" ? "Tarixiy Joylar" :
                       language === "RU" ? "Исторические Места" :
                       language === "DE" ? "Historische Orte" : "Historical Places"}
                    </h4>
                    <p className="text-sm text-white/90 mb-3">
                      {language === "UZ" ? "Madaniy meros" :
                       language === "RU" ? "Культурное наследие" :
                       language === "DE" ? "Kulturerbe" : "Cultural heritage"}
                    </p>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="group relative overflow-hidden rounded-lg aspect-[4/3] bg-gradient-to-br from-secondary/20 to-secondary/5 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h4 className="font-bold text-lg mb-2">
                      {language === "UZ" ? "Tabiat Sayohatlari" :
                       language === "RU" ? "Природные Туры" :
                       language === "DE" ? "Naturtouren" : "Nature Tours"}
                    </h4>
                    <p className="text-sm text-white/90 mb-3">
                      {language === "UZ" ? "Go'zal manzaralar" :
                       language === "RU" ? "Красивые пейзажи" :
                       language === "DE" ? "Schöne Landschaften" : "Beautiful landscapes"}
                    </p>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
