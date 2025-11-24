import { useNavigate } from "react-router-dom";
import { ChevronRight, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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

  const handleCategoryClick = (url: string) => {
    navigate(url);
    onClose();
  };

  return (
    <div className="absolute top-full left-0 w-full bg-background border-t border-border shadow-lg z-50 animate-fade-in">
      <div className="container mx-auto px-4 py-8">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
