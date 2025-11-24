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
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="font-semibold text-xl text-gray-900 hidden sm:block">
              TravelHub
            </span>
          </Link>

          {/* Desktop Navigation with Dropdowns */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => {
              if (item.children && item.children.length > 0) {
                return (
                  <DropdownMenu key={item.id}>
                    <DropdownMenuTrigger asChild>
                      <button className="text-gray-700 hover:text-gray-900 font-medium text-[15px] flex items-center gap-1 py-2 border-b-2 border-transparent hover:border-orange-500 transition-colors">
                        {getMenuName(item)}
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white">
                      {item.children.map((child) => (
                        <DropdownMenuItem
                          key={child.id}
                          onClick={() => navigate(child.url || "/")}
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          {getMenuName(child)}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.url || "/")}
                  className="text-gray-700 hover:text-gray-900 font-medium text-[15px] py-2 border-b-2 border-transparent hover:border-orange-500 transition-colors"
                >
                  {getMenuName(item)}
                </button>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="hidden lg:flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <Globe className="h-5 w-5" />
              <span className="text-[15px] font-medium">Qidiruv</span>
            </button>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden sm:flex gap-1 text-gray-700 hover:text-gray-900">
                  <Globe className="h-4 w-4" />
                  {language}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                {languages.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile */}
            <Button variant="ghost" size="icon" className="hidden sm:flex text-gray-700 hover:text-gray-900">
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-700 hover:text-gray-900"
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
          <div className="md:hidden py-4 space-y-1 animate-fade-in bg-white border-t border-gray-200">
            {menuItems.map((item) => {
              if (item.children && item.children.length > 0) {
                return (
                  <div key={item.id} className="space-y-1">
                    <div className="px-4 py-2 text-sm font-semibold text-gray-900">
                      {getMenuName(item)}
                    </div>
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        className="w-full text-left px-8 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        onClick={() => {
                          navigate(child.url || "/");
                          setMobileMenuOpen(false);
                        }}
                      >
                        {getMenuName(child)}
                      </button>
                    ))}
                  </div>
                );
              }
              return (
                <button
                  key={item.id}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium"
                  onClick={() => {
                    navigate(item.url || "/");
                    setMobileMenuOpen(false);
                  }}
                >
                  {getMenuName(item)}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
