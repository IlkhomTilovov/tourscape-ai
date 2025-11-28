import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Globe, User, Heart, ShoppingCart, ChevronDown, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import type { Language } from "@/lib/translations";
import MegaMenu from "./MegaMenu";

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

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  
  const languages = [
    { code: "EN" as Language, name: "English", display: "EN" },
    { code: "UZ" as Language, name: "Uzbek", display: "UZ" },
    { code: "RU" as Language, name: "Russian", display: "RU" },
    { code: "DE" as Language, name: "German", display: "DE" },
  ];

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name_en");
      if (error) throw error;
      return data as Category[];
    },
  });

  // Fetch destinations
  const { data: destinations = [] } = useQuery({
    queryKey: ["destinations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .order("name_en");
      if (error) throw error;
      return data as Destination[];
    },
  });

  // Fetch tours
  const { data: tours = [] } = useQuery({
    queryKey: ["tours"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tours")
        .select("*")
        .order("title_en")
        .limit(20);
      if (error) throw error;
      return data as Tour[];
    },
  });

  const getLabel = (key: string) => {
    const labels: Record<string, Record<Language, string>> = {
      categories: { EN: "Categories", UZ: "Kategoriyalar", RU: "Категории", DE: "Kategorien" },
      destinations: { EN: "Destinations", UZ: "Manzillar", RU: "Направления", DE: "Reiseziele" },
      tours: { EN: "Tours", UZ: "Turlar", RU: "Туры", DE: "Touren" },
      hotels: { EN: "Hotels", UZ: "Mehmonxonalar", RU: "Отели", DE: "Hotels" },
      about: { EN: "About", UZ: "Haqida", RU: "О нас", DE: "Über uns" },
    };
    return labels[key]?.[language] || key;
  };

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="TravelHub Logo" className="h-12 w-auto" />
            <span className="font-bold text-xl text-foreground hidden sm:block">
              TravelHub
            </span>
          </Link>

          {/* Desktop Navigation with Mega Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Categories with Mega Menu */}
            <div className="relative">
              <Button 
                variant="ghost" 
                className="gap-1"
                onClick={() => setMegaMenuOpen(megaMenuOpen === "categories" ? null : "categories")}
              >
                {getLabel("categories")}
                <ChevronDown className="h-4 w-4" />
              </Button>
              {megaMenuOpen === "categories" && (
                <MegaMenu 
                  categories={categories}
                  destinations={destinations}
                  tours={tours}
                  language={language}
                  onClose={() => setMegaMenuOpen(null)}
                />
              )}
            </div>

            {/* Direct Links */}
            <Button variant="ghost" onClick={() => navigate("/destinations")}>
              {getLabel("destinations")}
            </Button>
            <Button variant="ghost" onClick={() => navigate("/tours")}>
              {getLabel("tours")}
            </Button>
            <Button variant="ghost" onClick={() => navigate("/hotels")}>
              {getLabel("hotels")}
            </Button>
            <Button variant="ghost" onClick={() => navigate("/about")}>
              {getLabel("about")}
            </Button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1">
            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="hidden sm:flex relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden sm:flex gap-1">
                  <Globe className="h-4 w-4" />
                  {language}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className="cursor-pointer"
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile */}
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>


        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in max-h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
            {/* Categories Collapsible */}
            <div>
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
              >
                {getLabel("categories")}
                <ChevronRight className={`h-4 w-4 transition-transform ${mobileCategoriesOpen ? 'rotate-90' : ''}`} />
              </Button>
              {mobileCategoriesOpen && (
                <div className="pl-4 space-y-1 mt-1">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant="ghost"
                      className="w-full justify-start text-sm"
                      onClick={() => {
                        navigate(`/categories?category=${category.id}`);
                        setMobileMenuOpen(false);
                        setMobileCategoriesOpen(false);
                      }}
                    >
                      {category[`name_${language.toLowerCase()}` as keyof Category] as string}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Navigation Links */}
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                navigate("/destinations");
                setMobileMenuOpen(false);
              }}
            >
              {getLabel("destinations")}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                navigate("/tours");
                setMobileMenuOpen(false);
              }}
            >
              {getLabel("tours")}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                navigate("/hotels");
                setMobileMenuOpen(false);
              }}
            >
              {getLabel("hotels")}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                navigate("/about");
                setMobileMenuOpen(false);
              }}
            >
              {getLabel("about")}
            </Button>
            <div className="flex items-center gap-2 pt-2 border-t">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Language Selector for Mobile */}
            <div className="pt-2 border-t mt-2 px-3">
              <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <SelectValue>
                      {language === "EN" && "Language"}
                      {language === "UZ" && "Til"}
                      {language === "RU" && "Язык"}
                      {language === "DE" && "Sprache"}
                    </SelectValue>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
