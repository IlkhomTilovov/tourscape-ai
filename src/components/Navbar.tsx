import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Globe, User, Heart, ShoppingCart, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/translations";
import MegaMenu from "./MegaMenu";

interface MenuItem {
  id: string;
  name_en: string;
  name_uz: string;
  name_ru: string;
  name_de: string;
  url: string | null;
  parent_id: string | null;
  display_order: number;
  children?: MenuItem[];
}

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  
  const languages = [
    { code: "EN" as Language, name: "English", display: "EN" },
    { code: "UZ" as Language, name: "Uzbek", display: "UZ" },
    { code: "RU" as Language, name: "Russian", display: "RU" },
    { code: "DE" as Language, name: "German", display: "DE" },
  ];

  const { data: menuItems = [] } = useQuery({
    queryKey: ["menuItems"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("display_order");
      if (error) throw error;
      
      // Build hierarchical structure
      const items = data as MenuItem[];
      const parentItems = items.filter((item) => !item.parent_id);
      
      return parentItems.map((parent) => ({
        ...parent,
        children: items.filter((item) => item.parent_id === parent.id),
      }));
    },
  });

  const getMenuName = (item: MenuItem) => {
    switch (language) {
      case "EN":
        return item.name_en;
      case "UZ":
        return item.name_uz;
      case "RU":
        return item.name_ru;
      case "DE":
        return item.name_de;
      default:
        return item.name_en;
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 hero-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:block">
              TravelHub
            </span>
          </Link>

          {/* Desktop Navigation with Mega Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {menuItems
              .filter((item) => item.children && item.children.length > 0)
              .map((item) => (
                <div key={item.id} className="relative">
                  <Button 
                    variant="ghost" 
                    className="gap-1"
                    onClick={() => setMegaMenuOpen(megaMenuOpen === item.id ? null : item.id)}
                  >
                    {getMenuName(item)}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  {megaMenuOpen === item.id && (
                    <MegaMenu 
                      categories={item.children}
                      onClose={() => setMegaMenuOpen(null)}
                    />
                  )}
                </div>
              ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1">
            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <ShoppingCart className="h-5 w-5" />
            </Button>

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
            {menuItems.map((item) => {
              if (item.children && item.children.length > 0) {
                return (
                  <div key={item.id} className="space-y-1">
                    <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
                      {getMenuName(item)}
                    </div>
                    {item.children.map((child) => (
                      <Button
                        key={child.id}
                        variant="ghost"
                        className="w-full justify-start pl-6"
                        onClick={() => {
                          navigate(child.url || "/");
                          setMobileMenuOpen(false);
                        }}
                      >
                        {getMenuName(child)}
                      </Button>
                    ))}
                  </div>
                );
              }
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate(item.url || "/");
                    setMobileMenuOpen(false);
                  }}
                >
                  {getMenuName(item)}
                </Button>
              );
            })}
            <div className="flex items-center gap-2 pt-2 border-t">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
