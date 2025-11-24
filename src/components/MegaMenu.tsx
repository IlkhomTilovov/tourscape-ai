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

          {/* Featured Content - Show first 3 categories as featured */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.slice(0, 3).map((category, index) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.url)}
                className="group relative overflow-hidden rounded-lg aspect-[4/3] cursor-pointer"
              >
                <div
                  className={`absolute inset-0 ${
                    index === 0
                      ? "bg-gradient-to-br from-primary/30 to-primary/10"
                      : index === 1
                      ? "bg-gradient-to-br from-accent/30 to-accent/10"
                      : "bg-gradient-to-br from-secondary/30 to-secondary/10"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h4 className="font-bold text-lg mb-2">
                    {getCategoryName(category)}
                  </h4>
                  <p className="text-sm text-white/90 mb-3">
                    {language === "UZ" ? "Ajoyib joylarni kashf eting" :
                     language === "RU" ? "Исследуйте удивительные места" :
                     language === "DE" ? "Erkunden Sie erstaunliche Orte" : "Explore amazing places"}
                  </p>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
            
            {/* Fill remaining slots if less than 3 categories */}
            {categories.length < 3 && Array.from({ length: 3 - categories.length }).map((_, index) => (
              <div key={`placeholder-${index}`} className="group relative overflow-hidden rounded-lg aspect-[4/3] bg-gradient-to-br from-muted/20 to-muted/5 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h4 className="font-bold text-lg mb-2">
                    {language === "UZ" ? "Tez kunda" :
                     language === "RU" ? "Скоро" :
                     language === "DE" ? "Demnächst" : "Coming Soon"}
                  </h4>
                  <p className="text-sm text-white/90 mb-3">
                    {language === "UZ" ? "Yangi yo'nalishlar" :
                     language === "RU" ? "Новые направления" :
                     language === "DE" ? "Neue Richtungen" : "New destinations"}
                  </p>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
