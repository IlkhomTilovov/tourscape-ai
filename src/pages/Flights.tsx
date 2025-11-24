import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Calendar, Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";

interface Flight {
  id: string;
  from_city: string;
  to_city: string;
  airline: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  available_seats: number;
}

const Flights = () => {
  const { t } = useLanguage();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlights();

    // Real-time updates
    const channel = supabase
      .channel('flights-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'flights'
        },
        () => {
          fetchFlights();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchFlights = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("flights")
      .select("*")
      .order("departure_time", { ascending: true });
    
    if (error) {
      console.error("Error fetching flights:", error);
    } else {
      setFlights(data || []);
    }
    setLoading(false);
  };

  const formatDateTime = (dateTime: string) => {
    return format(new Date(dateTime), "MMM dd, yyyy HH:mm");
  };

  const calculateDuration = (departure: string, arrival: string) => {
    const diff = new Date(arrival).getTime() - new Date(departure).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Parvozlar</h1>
            <p className="text-lg text-muted-foreground">
              Eng yaxshi narxlarda samolyot chiptalarini bron qiling
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Yuklanmoqda...</p>
            </div>
          ) : flights.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Hozircha parvozlar mavjud emas</p>
            </div>
          ) : (
            <div className="space-y-6">
              {flights.map((flight) => (
                <Card key={flight.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Airline */}
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-2">
                          <Plane className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-semibold">{flight.airline}</p>
                          </div>
                        </div>
                      </div>

                      {/* Route */}
                      <div className="md:col-span-6">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-2xl font-bold">{flight.from_city}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDateTime(flight.departure_time)}
                            </p>
                          </div>
                          
                          <div className="flex flex-col items-center">
                            <div className="w-full h-px bg-border relative">
                              <Plane className="h-4 w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background text-muted-foreground rotate-90" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {calculateDuration(flight.departure_time, flight.arrival_time)}
                            </p>
                          </div>
                          
                          <div className="flex-1 text-right">
                            <p className="text-2xl font-bold">{flight.to_city}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDateTime(flight.arrival_time)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Seats & Price */}
                      <div className="md:col-span-4 text-right">
                        <div className="flex items-center justify-end gap-2 mb-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {flight.available_seats} joy
                          </span>
                        </div>
                        <p className="text-3xl font-bold text-primary mb-2">
                          ${flight.price}
                        </p>
                        <Button className="w-full">
                          Bron qilish
                        </Button>
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

export default Flights;
