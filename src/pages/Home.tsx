import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
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
        </div>
      </section>



      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Categories List */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-semibold text-muted-foreground mb-6">CATEGORIES</h2>
            <div className="space-y-2">
              {destinations.slice(0, 3).map((destination) => (
                <Link
                  key={destination.id}
                  to={`/search?destination=${destination.id}`}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-accent transition-colors group"
                >
                  <span className="text-foreground group-hover:text-primary transition-colors">
                    {getLocalizedName(destination, "name")}
                  </span>
                  <LucideIcons.ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side - Large Destination Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {destinations.slice(0, 3).map((destination) => (
              <Link
                key={destination.id}
                to={`/search?destination=${destination.id}`}
                className="group relative h-64 rounded-2xl overflow-hidden"
              >
                {/* Background Image with Gradient Overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${destination.image_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'})`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
                </div>

                {/* Content */}
                <div className="relative h-full p-6 flex flex-col justify-end text-white">
                  <h3 className="text-3xl font-bold mb-2">
                    {getLocalizedName(destination, "name")}
                  </h3>
                  <p className="text-white/90 mb-4">
                    {getLocalizedName(destination, "description") || "Explore amazing places"}
                  </p>
                  <LucideIcons.ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
                </div>
              </Link>
            ))}
          </div>
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
