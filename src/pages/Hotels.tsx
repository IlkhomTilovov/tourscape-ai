import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Star, Users, Wifi, Coffee, Car, Utensils } from "lucide-react";

interface Hotel {
  id: string;
  name: string;
  location: string;
  description: string;
  price_per_night: number;
  rating: number;
  available_rooms: number;
  amenities: string | null;
}

const Hotels = () => {
  const { t } = useLanguage();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels();

    // Real-time updates
    const channel = supabase
      .channel('hotels-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'hotels'
        },
        () => {
          fetchHotels();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("hotels")
      .select("*")
      .order("rating", { ascending: false });
    
    if (error) {
      console.error("Error fetching hotels:", error);
    } else {
      setHotels(data || []);
    }
    setLoading(false);
  };

  const getAmenitiesIcons = (amenities: string | null) => {
    if (!amenities) return [];
    const amenitiesList = amenities.toLowerCase();
    const icons = [];
    
    if (amenitiesList.includes('wifi')) icons.push({ icon: Wifi, label: 'WiFi' });
    if (amenitiesList.includes('breakfast') || amenitiesList.includes('restaurant')) 
      icons.push({ icon: Utensils, label: 'Restaurant' });
    if (amenitiesList.includes('parking')) icons.push({ icon: Car, label: 'Parking' });
    if (amenitiesList.includes('coffee') || amenitiesList.includes('cafe')) 
      icons.push({ icon: Coffee, label: 'Cafe' });
    
    return icons;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Mehmonxonalar</h1>
            <p className="text-lg text-muted-foreground">
              Eng yaxshi mehmonxonalarni toping va bron qiling
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Yuklanmoqda...</p>
            </div>
          ) : hotels.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Hozircha mehmonxonalar mavjud emas</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotels.map((hotel) => (
                <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Building2 className="h-16 w-16 text-primary/40" />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1">{hotel.name}</h3>
                          <div className="flex items-center gap-1 text-muted-foreground text-sm">
                            <MapPin className="h-4 w-4" />
                            <span>{hotel.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="font-semibold">{hotel.rating}</span>
                        </div>
                      </div>

                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {hotel.description}
                      </p>

                      {/* Amenities */}
                      {hotel.amenities && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {getAmenitiesIcons(hotel.amenities).map((item, index) => {
                            const Icon = item.icon;
                            return (
                              <Badge key={index} variant="secondary" className="gap-1">
                                <Icon className="h-3 w-3" />
                                <span className="text-xs">{item.label}</span>
                              </Badge>
                            );
                          })}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Kecha uchun</p>
                          <p className="text-2xl font-bold text-primary">
                            ${hotel.price_per_night}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground mb-2">
                            <Users className="h-4 w-4 inline mr-1" />
                            {hotel.available_rooms} xona
                          </p>
                          <Button>
                            Bron qilish
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Hotels;
