import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import TourCard from "@/components/TourCard";
import DestinationCard from "@/components/DestinationCard";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-travel.jpg";
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
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in text-balance">
            {t("heroTitle")}
          </h1>
          <p className="text-xl text-white/90 mb-12 animate-slide-up">
            {t("heroSubtitle")}
          </p>

          {/* Search Bar */}
          <div className="animate-scale-in">
            <SearchBar />
          </div>
        </div>
      </section>


      {/* Trending Tours */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">{t("trendingTitle")}</h2>
          <Link
            to="/search"
            className="text-primary hover:underline font-semibold"
          >
            {t("viewAll")}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <TourCard
              key={tour.id}
              id={tour.id}
              image={tour.image_url || ""}
              title={getLocalizedName(tour, "title")}
              location={tour.destinations ? getLocalizedName(tour.destinations, "name") : ""}
              duration={tour.duration}
              rating={Number(tour.rating)}
              reviewCount={tour.reviews_count}
              price={Number(tour.price)}
              category={tour.categories ? getLocalizedName(tour.categories, "name") : ""}
              bestseller={tour.is_bestseller}
            />
          ))}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">{t("destinationsTitle")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
