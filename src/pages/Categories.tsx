import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/translations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as LucideIcons from "lucide-react";
import { ArrowRight } from "lucide-react";

interface Category {
  id: string;
  name_en: string;
  name_uz: string;
  name_ru: string;
  name_de: string;
  icon: string | null;
}

interface CategoryWithCount extends Category {
  tourCount: number;
}

const Categories = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();

    // Real-time updates for categories
    const categoriesChannel = supabase
      .channel('categories-list-changes')
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

    // Real-time updates for tours (for tour counts)
    const toursChannel = supabase
      .channel('categories-tours-changes')
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
      supabase.removeChannel(toursChannel);
    };
  }, []);

  const fetchCategories = async () => {
    try {
      const { data: categoriesData, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch tour counts for each category
      const { data: toursData } = await supabase
        .from("tours")
        .select("category_id");

      const tourCounts = toursData?.reduce((acc: Record<string, number>, tour) => {
        if (tour.category_id) {
          acc[tour.category_id] = (acc[tour.category_id] || 0) + 1;
        }
        return acc;
      }, {}) || {};

      const categoriesWithCounts: CategoryWithCount[] = (categoriesData || []).map((cat) => ({
        ...cat,
        tourCount: tourCounts[cat.id] || 0,
      }));

      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedName = (category: Category) => {
    const langMap: Record<Language, string> = {
      EN: category.name_en,
      UZ: category.name_uz,
      RU: category.name_ru,
      DE: category.name_de,
    };
    return langMap[language] || category.name_en;
  };

  const getIconComponent = (iconName: string | null) => {
    if (!iconName) return LucideIcons.Tag;
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Tag;
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/search?category=${categoryId}`);
  };

  const gradients = [
    "from-orange-400 to-pink-500",
    "from-blue-400 to-cyan-500",
    "from-green-400 to-emerald-500",
    "from-purple-400 to-indigo-500",
    "from-yellow-400 to-orange-500",
    "from-pink-400 to-rose-500",
    "from-teal-400 to-blue-500",
    "from-red-400 to-pink-500",
  ];

  const seoTitles: Record<Language, string> = {
    UZ: "Kategoriyalar",
    EN: "Categories",
    RU: "Категории",
    DE: "Kategorien"
  };

  const seoDescriptions: Record<Language, string> = {
    UZ: "Sayohat kategoriyalari - madaniy turlar, tabiat sayohatlari, sog'lomlashtirish va boshqalar.",
    EN: "Tour categories - cultural tours, nature trips, wellness and more.",
    RU: "Категории туров - культурные туры, природные поездки, оздоровление и многое другое.",
    DE: "Tourkategorien - Kulturtouren, Naturreisen, Wellness und mehr."
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-muted/10 to-background">
      <SEO 
        title={seoTitles[language]}
        description={seoDescriptions[language]}
        url="/categories"
      />
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              {t("categories")}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              {language === "UZ" && "Sevimli yo'nalishingizni toping va sarguzashtga tayyorlaning"}
              {language === "EN" && "Find your perfect adventure and start exploring"}
              {language === "RU" && "Найдите свое идеальное приключение"}
              {language === "DE" && "Finden Sie Ihr perfektes Abenteuer"}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-56 bg-muted/50 animate-pulse rounded-2xl card-elevated" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                <LucideIcons.Compass className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {language === "UZ" ? "Kategoriyalar topilmadi" : 
                 language === "EN" ? "No categories found" : 
                 language === "RU" ? "Категории не найдены" : 
                 "Keine Kategorien gefunden"}
              </h3>
              <p className="text-muted-foreground">
                {language === "UZ" ? "Tez orada yangi kategoriyalar qo'shiladi" : 
                 language === "EN" ? "New categories coming soon" : 
                 language === "RU" ? "Новые категории скоро появятся" : 
                 "Neue Kategorien kommen bald"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category, index) => {
                const Icon = getIconComponent(category.icon);
                const gradient = gradients[index % gradients.length];
                return (
                  <Card
                    key={category.id}
                    className="group cursor-pointer overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl card-elevated animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <CardContent className="p-0 relative h-56">
                      {/* Gradient Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                      
                      {/* Pattern Overlay */}
                      <div className="absolute inset-0 opacity-5" 
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }}
                      />
                      
                      {/* Content */}
                      <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                        {/* Icon Container */}
                        <div className={`mb-4 p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-10 w-10 text-white" strokeWidth={2} />
                        </div>
                        
                        {/* Category Name */}
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                          {getLocalizedName(category)}
                        </h3>
                        
                        {/* Tour Count Badge */}
                        <Badge variant="secondary" className="mb-3 bg-background/80 backdrop-blur-sm">
                          {category.tourCount} {language === "UZ" ? "sayohat" : 
                           language === "EN" ? "tours" : 
                           language === "RU" ? "туров" : 
                           "Touren"}
                        </Badge>
                        
                        {/* Arrow Icon */}
                        <div className="mt-auto flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                          <span>
                            {language === "UZ" ? "Ko'rish" : 
                             language === "EN" ? "Explore" : 
                             language === "RU" ? "Смотреть" : 
                             "Erkunden"}
                          </span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
