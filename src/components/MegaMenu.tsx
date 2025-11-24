import { useNavigate } from "react-router-dom";
import { ChevronRight, MapPin, Package } from "lucide-react";
import type { Language } from "@/lib/translations";

interface Category {
  id: string;
  name_en: string;
  name_uz: string;
  name_ru: string;
  name_de: string;
}

interface Destination {
  id: string;
  name_en: string;
  name_uz: string;
  name_ru: string;
  name_de: string;
  category_id: string | null;
}

interface Tour {
  id: string;
  title_en: string;
  title_uz: string;
  title_ru: string;
  title_de: string;
  category_id: string | null;
}

interface MegaMenuProps {
  categories: Category[];
  destinations: Destination[];
  tours: Tour[];
  language: Language;
  onClose: () => void;
}

const MegaMenu = ({ categories, destinations, tours, language, onClose }: MegaMenuProps) => {
  const navigate = useNavigate();

  const getName = (item: Category | Destination | Tour) => {
    const key = 'name_en' in item ? 'name' : 'title';
    const langKey = `${key}_${language.toLowerCase()}` as keyof typeof item;
    return (item[langKey] as string) || (item[`${key}_en` as keyof typeof item] as string);
  };

  const handleClick = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed left-0 right-0 top-16 w-full bg-background border-t border-border shadow-2xl z-50 animate-fade-in">
      <div className="max-w-[1400px] px-8 py-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Categories */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide flex items-center gap-2">
              <Package className="h-4 w-4" />
              {language === "UZ" ? "Kategoriyalar" : 
               language === "RU" ? "Категории" : 
               language === "DE" ? "Kategorien" : "Categories"}
            </h3>
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {categories.slice(0, 10).map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleClick(`/categories?category=${category.id}`)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors group"
                >
                  <span>{getName(category)}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
            {categories.length > 10 && (
              <button
                onClick={() => handleClick('/categories')}
                className="w-full text-sm text-primary hover:underline mt-2"
              >
                {language === "UZ" ? "Barchasini ko'rish" :
                 language === "RU" ? "Смотреть все" :
                 language === "DE" ? "Alle anzeigen" : "View all"}
              </button>
            )}
          </div>

          {/* Destinations */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {language === "UZ" ? "Manzillar" : 
               language === "RU" ? "Направления" : 
               language === "DE" ? "Reiseziele" : "Destinations"}
            </h3>
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {destinations.slice(0, 10).map((destination) => (
                <button
                  key={destination.id}
                  onClick={() => handleClick(`/destinations?destination=${destination.id}`)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors group"
                >
                  <span>{getName(destination)}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
            {destinations.length > 10 && (
              <button
                onClick={() => handleClick('/destinations')}
                className="w-full text-sm text-primary hover:underline mt-2"
              >
                {language === "UZ" ? "Barchasini ko'rish" :
                 language === "RU" ? "Смотреть все" :
                 language === "DE" ? "Alle anzeigen" : "View all"}
              </button>
            )}
          </div>

          {/* Popular Tours */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide flex items-center gap-2">
              <Package className="h-4 w-4" />
              {language === "UZ" ? "Mashhur turlar" : 
               language === "RU" ? "Популярные туры" : 
               language === "DE" ? "Beliebte Touren" : "Popular Tours"}
            </h3>
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {tours.slice(0, 10).map((tour) => (
                <button
                  key={tour.id}
                  onClick={() => handleClick(`/tours/${tour.id}`)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors group"
                >
                  <span className="truncate">{getName(tour)}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>
            {tours.length > 10 && (
              <button
                onClick={() => handleClick('/tours')}
                className="w-full text-sm text-primary hover:underline mt-2"
              >
                {language === "UZ" ? "Barchasini ko'rish" :
                 language === "RU" ? "Смотреть все" :
                 language === "DE" ? "Alle anzeigen" : "View all"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
