import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import TourCard from "@/components/TourCard";
import DestinationCard from "@/components/DestinationCard";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-travel.jpg";
import { Compass, Landmark, Palmtree, Mountain, Ship, Camera } from "lucide-react";

const Home = () => {
  // Mock data - will be replaced with API calls
  const trendingTours = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
      title: "Eiffel Tower: Summit Access with Host",
      location: "Paris, France",
      duration: "2 hours",
      rating: 4.8,
      reviewCount: 12453,
      price: 89,
      category: "Landmarks",
      bestseller: true,
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80",
      title: "Colosseum Underground and Arena Floor Tour",
      location: "Rome, Italy",
      duration: "3 hours",
      rating: 4.9,
      reviewCount: 8932,
      price: 125,
      category: "History",
      bestseller: true,
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
      title: "Northern Lights Chase with Photography",
      location: "Reykjavik, Iceland",
      duration: "5 hours",
      rating: 4.7,
      reviewCount: 3421,
      price: 180,
      category: "Nature",
    },
  ];

  const destinations = [
    {
      name: "Paris",
      country: "France",
      image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80",
      tourCount: 1234,
      slug: "paris",
    },
    {
      name: "Tokyo",
      country: "Japan",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
      tourCount: 892,
      slug: "tokyo",
    },
    {
      name: "New York",
      country: "USA",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
      tourCount: 1567,
      slug: "new-york",
    },
    {
      name: "Barcelona",
      country: "Spain",
      image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80",
      tourCount: 743,
      slug: "barcelona",
    },
  ];

  const categories = [
    { name: "Museums & Art", icon: Landmark, count: 2341 },
    { name: "Outdoor Activities", icon: Mountain, count: 1876 },
    { name: "City Tours", icon: Compass, count: 3421 },
    { name: "Beach & Water", icon: Palmtree, count: 987 },
    { name: "Cruises", icon: Ship, count: 654 },
    { name: "Photography", icon: Camera, count: 432 },
  ];

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
            Discover experiences you'll<br />remember forever
          </h1>
          <p className="text-xl text-white/90 mb-12 animate-slide-up">
            Book amazing things to do around the world
          </p>

          {/* Search Bar */}
          <div className="animate-scale-in">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Explore by category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/category/${category.name.toLowerCase().replace(/ /g, "-")}`}
              className="card-elevated rounded-xl p-6 text-center bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="w-12 h-12 hero-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                <category.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
              <p className="text-xs text-muted-foreground">{category.count} activities</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Tours */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Trending experiences</h2>
          <Link
            to="/tours"
            className="text-primary hover:underline font-semibold"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingTours.map((tour) => (
            <TourCard key={tour.id} {...tour} />
          ))}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Popular destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <DestinationCard key={destination.slug} {...destination} />
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
