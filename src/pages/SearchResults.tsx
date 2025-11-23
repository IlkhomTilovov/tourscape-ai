import { useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const SearchResults = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const location = searchParams.get("location") || "Paris";
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  const tours = Array(12).fill(null).map((_, i) => ({
    id: `tour-${i}`,
    image: `https://images.unsplash.com/photo-${1502602898657 + i}-3e91760cbb34?auto=format&fit=crop&w=800&q=80`,
    title: `Amazing Experience in ${location} ${i + 1}`,
    location: location,
    duration: `${2 + (i % 4)} ${t("duration")}`,
    rating: 4.5 + (i % 5) / 10,
    reviewCount: 1000 + i * 100,
    price: 50 + i * 15,
    category: ["Culture", "Adventure", "Food", "History"][i % 4],
    bestseller: i < 3,
  }));

  const categories = [
    { key: "cultureHistory", label: t("cultureHistory") },
    { key: "foodDrink", label: t("foodDrink") },
    { key: "outdoorActivities", label: t("outdoorActivities") },
    { key: "museumsAttractions", label: t("museumsAttractions") },
    { key: "toursSightseeing", label: t("toursSightseeing") },
  ];
  
  const durations = [
    { key: "02", label: t("hours02") },
    { key: "24", label: t("hours24") },
    { key: "48", label: t("hours48") },
    { key: "fullDay", label: t("fullDay") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {t("thingsToDo")} {location}
          </h1>
          <p className="text-muted-foreground">
            {tours.length} {t("experiencesFound")}
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
                  {t("priceRange")}
                </Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={500}
                  step={10}
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
                  {t("categoriesSection")}
                </Label>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category.key} className="flex items-center space-x-2">
                      <Checkbox id={category.key} />
                      <Label
                        htmlFor={category.key}
                        className="text-sm cursor-pointer"
                      >
                        {category.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">
                  {t("durationLabel")}
                </Label>
                <div className="space-y-3">
                  {durations.map((duration) => (
                    <div key={duration.key} className="flex items-center space-x-2">
                      <Checkbox id={duration.key} />
                      <Label
                        htmlFor={duration.key}
                        className="text-sm cursor-pointer"
                      >
                        {duration.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  {t("ratingFilter")}
                </Label>
                <div className="space-y-3">
                  {["4.5+", "4.0+", "3.5+"].map((rating) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <Checkbox id={rating} />
                      <Label htmlFor={rating} className="text-sm cursor-pointer">
                        {rating} {t("starsLabel")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
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

              <Select defaultValue="recommended">
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={t("sortBy")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">{t("recommended")}</SelectItem>
                  <SelectItem value="price-low">{t("priceLowToHigh")}</SelectItem>
                  <SelectItem value="price-high">{t("priceHighToLow")}</SelectItem>
                  <SelectItem value="rating">{t("highestRatedSort")}</SelectItem>
                  <SelectItem value="duration">{t("durationLabel")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tour Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {tours.map((tour) => (
                <TourCard key={tour.id} {...tour} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center space-x-2">
                <Button variant="outline" disabled>
                  {t("previous")}
                </Button>
                {[1, 2, 3, 4].map((page) => (
                  <Button
                    key={page}
                    variant={page === 1 ? "default" : "outline"}
                  >
                    {page}
                  </Button>
                ))}
                <Button variant="outline">{t("next")}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;
