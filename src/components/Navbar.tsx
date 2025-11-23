import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Globe, User, Heart, ShoppingCart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/translations";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  
  const languages = [
    { code: "EN" as Language, name: "English", display: "EN" },
    { code: "UZ" as Language, name: "Uzbek", display: "UZ" },
    { code: "RU" as Language, name: "Russian", display: "RU" },
    { code: "DE" as Language, name: "German", display: "DE" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
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

          {/* Desktop Navigation with Dropdowns */}
          <div className="hidden md:flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1">
                  {t("destinations")}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigate("/destinations")}>
                  {t("destinations")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1">
                  {t("tours")}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigate("/tours")}>
                  {t("tours")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1">
                  {t("categories")}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigate("/categories")}>
                  {t("categories")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" onClick={() => navigate("/about")}>
              {t("about")}
            </Button>
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
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                navigate("/destinations");
                setMobileMenuOpen(false);
              }}
            >
              {t("destinations")}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                navigate("/tours");
                setMobileMenuOpen(false);
              }}
            >
              {t("tours")}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                navigate("/categories");
                setMobileMenuOpen(false);
              }}
            >
              {t("categories")}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                navigate("/about");
                setMobileMenuOpen(false);
              }}
            >
              {t("about")}
            </Button>
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
