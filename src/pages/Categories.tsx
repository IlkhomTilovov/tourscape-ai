import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/translations";
import { Card, CardContent } from "@/components/ui/card";
import * as LucideIcons from "lucide-react";

interface Category {
  id: string;
  name_en: string;
  name_uz: string;
  name_ru: string;
  name_de: string;
  icon: string | null;
}

const Categories = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCategories(data || []);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">{t("categories")}</h1>
          <p className="text-muted-foreground mb-8">
            {language === "UZ" && "Sayohatlarni kategoriya bo'yicha tanlang"}
            {language === "EN" && "Choose tours by category"}
            {language === "RU" && "Выберите туры по категориям"}
            {language === "DE" && "Wählen Sie Touren nach Kategorie"}
          </p>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-40 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {language === "UZ" && "Kategoriyalar topilmadi"}
                {language === "EN" && "No categories found"}
                {language === "RU" && "Категории не найдены"}
                {language === "DE" && "Keine Kategorien gefunden"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category) => {
                const Icon = getIconComponent(category.icon);
                return (
                  <Card
                    key={category.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-6 h-40">
                      <Icon className="h-12 w-12 mb-3 text-primary" />
                      <h3 className="font-semibold text-center">
                        {getLocalizedName(category)}
                      </h3>
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
