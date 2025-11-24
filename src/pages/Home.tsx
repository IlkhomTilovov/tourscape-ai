import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import TourCard from "@/components/TourCard";
import DestinationCard from "@/components/DestinationCard";
import Footer from "@/components/Footer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import heroImage from "@/assets/hero-uzbekistan.jpg";
import * as LucideIcons from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const Home = () => {
  const { t, language } = useLanguage();
  const [categories, setCategories] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [tours, setTours] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchDestinations();
    fetchTours();

    // Real-time updates for categories
    const categoriesChannel = supabase
      .channel('categories-changes')
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

    // Real-time updates for destinations
    const destinationsChannel = supabase
      .channel('destinations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'destinations'
        },
        () => {
          fetchDestinations();
        }
      )
      .subscribe();

    // Real-time updates for tours
    const toursChannel = supabase
      .channel('tours-changes')
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

    return () => {
      supabase.removeChannel(categoriesChannel);
      supabase.removeChannel(destinationsChannel);
      supabase.removeChannel(toursChannel);
    };
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").limit(6);
    if (data) {
      setCategories(data);
    }
  };

  const fetchDestinations = async () => {
    const { data } = await supabase.from("destinations").select("*").limit(4);
    if (data) {
      setDestinations(data);
    }
  };

  const fetchTours = async () => {
    const { data } = await supabase
      .from("tours")
      .select("*, destinations(name_en, name_uz, name_ru, name_de), categories(name_en, name_uz, name_ru, name_de)")
      .eq("is_bestseller", true)
      .limit(3);
    if (data) {
      setTours(data);
    }
  };

  const getIconComponent = (iconName: string | null) => {
    if (!iconName) return LucideIcons.Compass;
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Compass;
  };

  const getLocalizedName = (item: any, field: string) => {
    const fieldMap: any = {
      uz: `${field}_uz`,
      ru: `${field}_ru`,
      de: `${field}_de`,
      en: `${field}_en`,
    };
    return item[fieldMap[language]] || item[`${field}_en`] || "";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in text-balance drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            {t("heroTitle")}
          </h1>
          <p className="text-xl text-white mb-12 animate-slide-up drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {t("heroSubtitle")}
          </p>

          {/* Search Bar */}
          <div className="animate-scale-in">
            <SearchBar />
          </div>
        </div>
      </section>



      {/* Popular Destinations */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">{t("destinationsTitle")}</h2>
        
        {/* Mobile: Grid Layout */}
        <div className="grid grid-cols-1 gap-6 md:hidden">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              name={getLocalizedName(destination, "name")}
              country={destination.country}
              image={destination.image_url || ""}
              tourCount={0}
              slug={destination.id}
            />
          ))}
        </div>

        {/* Desktop/Tablet: Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full hidden md:block"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {destinations.map((destination) => (
              <CarouselItem key={destination.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <DestinationCard
                  name={getLocalizedName(destination, "name")}
                  country={destination.country}
                  image={destination.image_url || ""}
                  tourCount={0}
                  slug={destination.id}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </section>

      {/* Trust Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Why book with TravelHub?</h2>
          <p className="text-muted-foreground mb-12">
            Join millions of travelers who trust us for their unforgettable experiences
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">15M+</div>
              <p className="text-muted-foreground">Happy customers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500K+</div>
              <p className="text-muted-foreground">Experiences</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">180+</div>
              <p className="text-muted-foreground">Countries</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
