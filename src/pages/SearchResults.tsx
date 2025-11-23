import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import TourCard from "@/components/TourCard";
import Footer from "@/components/Footer";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/translations";

interface Tour {
  id: string;
  title_en: string;
  title_uz: string;
  title_ru: string;
  title_de: string;
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
  category_id: string | null;
  destination_id: string | null;
  categories?: { 
    id: string;
    name_uz: string; 
    name_en: string; 
    name_ru: string; 
    name_de: string; 
  };
  destinations?: {
    id: string;
    name_uz: string;
    name_en: string;
    name_ru: string;
    name_de: string;
  };
}

interface Category {
  id: string;
  name_uz: string;
  name_en: string;
  name_ru: string;
  name_de: string;
}

const SearchResults = () => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const destinationParam = searchParams.get("destination");
  
  const [tours, setTours] = useState<Tour[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : []);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>("");

  useEffect(() => {
    fetchTours();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
      fetchCategoryName(categoryParam);
    }
  }, [categoryParam]);

  const fetchCategoryName = async (catId: string) => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("id", catId)
      .single();
    
    if (data) {
      setCategoryName(
        language === "UZ" ? data.name_uz :
        language === "EN" ? data.name_en :
        language === "RU" ? data.name_ru :
        data.name_de
      );
    }
  };

  const fetchTours = async () => {
    try {
      let query = supabase
        .from("tours")
        .select("*, categories(*), destinations(*)");

      if (categoryParam) {
        query = query.eq("category_id", categoryParam);
      }

      if (destinationParam) {
        query = query.eq("destination_id", destinationParam);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      setTours(data || []);
    } catch (error) {
      console.error("Error fetching tours:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name_uz");
    
    if (data) {
      setCategories(data);
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

  const getCategoryName = (cat?: Category) => {
    if (!cat) return "";
    return language === "UZ" ? cat.name_uz :
           language === "EN" ? cat.name_en :
           language === "RU" ? cat.name_ru :
           cat.name_de;
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getFilteredAndSortedTours = () => {
    let filtered = [...tours];

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(tour => 
        tour.category_id && selectedCategories.includes(tour.category_id)
      );
    }

    // Price filter
    filtered = filtered.filter(tour => 
      tour.price >= priceRange[0] && tour.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "duration":
        filtered.sort((a, b) => a.duration.localeCompare(b.duration));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredTours = getFilteredAndSortedTours();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {categoryName ? categoryName : 
             language === "UZ" ? "Qidiruv Natijalari" :
             language === "EN" ? "Search Results" :
             language === "RU" ? "Результаты поиска" :
             "Suchergebnisse"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {language === "UZ" ? "Yuklanmoqda..." : "Loading..."}
              </span>
            ) : (
              <>
                {filteredTours.length} {language === "UZ" ? "sayohat topildi" : 
                 language === "EN" ? "tours found" : 
                 language === "RU" ? "туров найдено" : 
                 "Touren gefunden"}
              </>
            )}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-card rounded-xl p-6 border border-border sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">{t("filters")}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden"
                >
                  {t("close")}
                </Button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">
                  {language === "UZ" ? "Narx oralig'i" : 
                   language === "EN" ? "Price Range" : 
                   language === "RU" ? "Диапазон цен" : 
                   "Preisspanne"}
                </Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={5000}
                  step={50}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">
                  {language === "UZ" ? "Kategoriyalar" : 
                   language === "EN" ? "Categories" : 
                   language === "RU" ? "Категории" : 
                   "Kategorien"}
                </Label>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={category.id} 
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                      />
                      <Label
                        htmlFor={category.id}
                        className="text-sm cursor-pointer"
                      >
                        {getCategoryName(category)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedCategories(categoryParam ? [categoryParam] : []);
                  setPriceRange([0, 5000]);
                }}
              >
                {language === "UZ" ? "Filtrlarni tozalash" : 
                 language === "EN" ? "Clear Filters" : 
                 language === "RU" ? "Очистить фильтры" : 
                 "Filter löschen"}
              </Button>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(true)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {t("filters")}
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">
                    {language === "UZ" ? "Tavsiya etilgan" : language === "EN" ? "Recommended" : language === "RU" ? "Рекомендуемые" : "Empfohlen"}
                  </SelectItem>
                  <SelectItem value="price-low">
                    {language === "UZ" ? "Narx: Pastdan yuqoriga" : language === "EN" ? "Price: Low to High" : language === "RU" ? "Цена: По возрастанию" : "Preis: Niedrig bis Hoch"}
                  </SelectItem>
                  <SelectItem value="price-high">
                    {language === "UZ" ? "Narx: Yuqoridan pastga" : language === "EN" ? "Price: High to Low" : language === "RU" ? "Цена: По убыванию" : "Preis: Hoch bis Niedrig"}
                  </SelectItem>
                  <SelectItem value="rating">
                    {language === "UZ" ? "Eng yuqori reyting" : language === "EN" ? "Highest Rating" : language === "RU" ? "Наивысший рейтинг" : "Höchste Bewertung"}
                  </SelectItem>
                  <SelectItem value="duration">
                    {language === "UZ" ? "Davomiylik" : language === "EN" ? "Duration" : language === "RU" ? "Продолжительность" : "Dauer"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tour Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-96 bg-muted/50 animate-pulse rounded-xl card-elevated" />
                ))}
              </div>
            ) : filteredTours.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                  <SlidersHorizontal className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">
                  {language === "UZ" ? "Sayohatlar topilmadi" : 
                   language === "EN" ? "No tours found" : 
                   language === "RU" ? "Туры не найдены" : 
                   "Keine Touren gefunden"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {language === "UZ" ? "Filtrlarni o'zgartiring yoki tozalang" : 
                   language === "EN" ? "Try adjusting your filters" : 
                   language === "RU" ? "Попробуйте изменить фильтры" : 
                   "Versuchen Sie, Ihre Filter anzupassen"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTours.map((tour, index) => (
                  <div key={tour.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <TourCard
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
                      category={tour.categories ? getCategoryName(tour.categories) : ""}
                      image={tour.image_url || "https://images.unsplash.com/photo-1488646953014-85cb44e25828"}
                      bestseller={tour.is_bestseller || false}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;
