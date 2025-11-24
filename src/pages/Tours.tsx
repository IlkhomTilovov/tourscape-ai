import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TourCard from "@/components/TourCard";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/translations";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

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
  category_id: string | null;
  categories?: { name_uz: string; name_en: string; name_ru: string; name_de: string };
}

interface Category {
  id: string;
  name_uz: string;
  name_en: string;
  name_ru: string;
  name_de: string;
}

const Tours = () => {
  const { language, t } = useLanguage();
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);

  useEffect(() => {
    fetchTours();
    fetchCategories();

    // Real-time updates for tours
    const toursChannel = supabase
      .channel('tours-page-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tours'
        },
        () => {
          fetchTours();
        }
      )
      .subscribe();

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

    return () => {
      supabase.removeChannel(toursChannel);
      supabase.removeChannel(categoriesChannel);
    };
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tours, searchQuery, selectedCategory, sortBy, priceRange]);

  const fetchTours = async () => {
    try {
      const { data, error } = await supabase
        .from("tours")
        .select("*, categories(name_uz, name_en, name_ru, name_de)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTours(data || []);
    } catch (error) {
      console.error("Error fetching tours:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name_uz");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const applyFilters = () => {
    let result = [...tours];

    // Search filter
    if (searchQuery) {
      result = result.filter((tour) => {
        const title = getLocalizedText(
          tour.title_en,
          tour.title_uz,
          tour.title_ru,
          tour.title_de
        ).toLowerCase();
        const location = getLocalizedText(
          tour.location_en,
          tour.location_uz,
          tour.location_ru,
          tour.location_de
        ).toLowerCase();
        return title.includes(searchQuery.toLowerCase()) || 
               location.includes(searchQuery.toLowerCase());
      });
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((tour) => tour.category_id === selectedCategory);
    }

    // Price range filter
    result = result.filter((tour) => tour.price >= priceRange[0] && tour.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "popular":
        result.sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0));
        break;
      default:
        break;
    }

    setFilteredTours(result);
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t("tours")}
            </h1>
            <p className="text-muted-foreground text-lg">
              {language === "UZ" && "Barcha sayohatlarimizni ko'ring va sevimli yo'nalishingizni tanlang"}
              {language === "EN" && "Browse all our tours and choose your favorite destination"}
              {language === "RU" && "Посмотреть все наши туры и выберите свое любимое направление"}
              {language === "DE" && "Alle unsere Touren ansehen und wählen Sie Ihr Lieblingsziel"}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={
                    language === "UZ" ? "Sayohat yoki joylashuvni qidiring..." :
                    language === "EN" ? "Search tours or locations..." :
                    language === "RU" ? "Поиск туров или локаций..." :
                    "Touren oder Standorte suchen..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 border-2 focus:border-primary transition-all"
                />
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[200px] h-12 border-2">
                  <SelectValue placeholder={language === "UZ" ? "Saralash" : "Sort"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">
                    {language === "UZ" ? "Standart" : language === "EN" ? "Default" : language === "RU" ? "По умолчанию" : "Standard"}
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
                  <SelectItem value="popular">
                    {language === "UZ" ? "Eng mashhur" : language === "EN" ? "Most Popular" : language === "RU" ? "Самые популярные" : "Beliebteste"}
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Filter Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="lg" className="h-12 border-2 gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    {language === "UZ" ? "Filter" : language === "EN" ? "Filters" : language === "RU" ? "Фильтры" : "Filter"}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>
                      {language === "UZ" ? "Filterlar" : language === "EN" ? "Filters" : language === "RU" ? "Фильтры" : "Filter"}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
                    {/* Category Filter */}
                    <div className="space-y-3">
                      <Label>
                        {language === "UZ" ? "Kategoriya" : language === "EN" ? "Category" : language === "RU" ? "Категория" : "Kategorie"}
                      </Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            {language === "UZ" ? "Barcha kategoriyalar" : language === "EN" ? "All Categories" : language === "RU" ? "Все категории" : "Alle Kategorien"}
                          </SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {language === "UZ" ? category.name_uz : 
                               language === "EN" ? category.name_en : 
                               language === "RU" ? category.name_ru : 
                               category.name_de}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-3">
                      <Label>
                        {language === "UZ" ? "Narx oralig'i" : language === "EN" ? "Price Range" : language === "RU" ? "Диапазон цен" : "Preisspanne"}
                      </Label>
                      <div className="pt-4 pb-2">
                        <Slider
                          min={0}
                          max={5000}
                          step={50}
                          value={priceRange}
                          onValueChange={setPriceRange}
                          className="w-full"
                        />
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>

                    {/* Reset Button */}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSelectedCategory("all");
                        setPriceRange([0, 5000]);
                        setSearchQuery("");
                        setSortBy("default");
                      }}
                    >
                      {language === "UZ" ? "Tozalash" : language === "EN" ? "Reset" : language === "RU" ? "Сбросить" : "Zurücksetzen"}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedCategory !== "all" || priceRange[0] > 0 || priceRange[1] < 5000) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">
                  {filteredTours.length} {language === "UZ" ? "ta sayohat topildi" : language === "EN" ? "tours found" : language === "RU" ? "туров найдено" : "Touren gefunden"}
                </span>
              </div>
            )}
          </div>

          {/* Tours Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-xl card-elevated" />
              ))}
            </div>
          ) : filteredTours.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {language === "UZ" ? "Sayohatlar topilmadi" : 
                 language === "EN" ? "No tours found" : 
                 language === "RU" ? "Туры не найдены" : 
                 "Keine Touren gefunden"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {language === "UZ" ? "Iltimos, qidiruv sozlamalarini o'zgartiring yoki filtrlarni tozalang" : 
                 language === "EN" ? "Try adjusting your search or clearing filters" : 
                 language === "RU" ? "Попробуйте изменить поиск или очистить фильтры" : 
                 "Versuchen Sie, Ihre Suche anzupassen oder Filter zu löschen"}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setPriceRange([0, 5000]);
                  setSortBy("default");
                }}
              >
                {language === "UZ" ? "Filtrlarni tozalash" : 
                 language === "EN" ? "Clear Filters" : 
                 language === "RU" ? "Очистить фильтры" : 
                 "Filter löschen"}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((tour) => (
                <div key={tour.id} className="animate-in fade-in duration-500">
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
                    category={tour.categories ? 
                      (language === "UZ" ? tour.categories.name_uz : 
                       language === "EN" ? tour.categories.name_en : 
                       language === "RU" ? tour.categories.name_ru : 
                       tour.categories.name_de) : ""}
                    image={tour.image_url || "https://images.unsplash.com/photo-1488646953014-85cb44e25828"}
                    bestseller={tour.is_bestseller || false}
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

export default Tours;
