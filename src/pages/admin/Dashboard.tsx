import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, MapPin, List, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [stats, setStats] = useState({
    tours: 0,
    destinations: 0,
    categories: 0,
  });
  const [popularTours, setPopularTours] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [toursRes, destinationsRes, categoriesRes] = await Promise.all([
        supabase.from("tours").select("*", { count: "exact", head: true }),
        supabase.from("destinations").select("*", { count: "exact", head: true }),
        supabase.from("categories").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        tours: toursRes.count || 0,
        destinations: destinationsRes.count || 0,
        categories: categoriesRes.count || 0,
      });
    };

    const fetchPopularTours = async () => {
      const { data } = await supabase
        .from("tours")
        .select("*, destinations(name_uz), categories(name_uz)")
        .eq("is_bestseller", true)
        .order("rating", { ascending: false })
        .limit(6);
      
      if (data) {
        setPopularTours(data);
      }
    };

    fetchStats();
    fetchPopularTours();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Tizim ma'lumotlari</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turlar</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tours}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manzillar</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.destinations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategoriyalar</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
          </CardContent>
        </Card>
      </div>

      {/* Mashhur Tajribalar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Mashhur Tajribalar</h2>
          <Link to="/admin/tours">
            <Button variant="link" className="text-primary">
              Barchasini ko'rish
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularTours.map((tour) => (
            <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src={tour.image_url || "/placeholder.svg"}
                  alt={tour.title_uz}
                  className="w-full h-full object-cover"
                />
                {tour.is_bestseller && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold">
                    Bestseller
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-1">{tour.title_uz}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{tour.destinations?.name_uz || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{tour.rating || 0}</span>
                    <span className="text-muted-foreground text-sm">
                      ({tour.reviews_count || 0} sharh)
                    </span>
                  </div>
                  <div className="font-bold text-primary">
                    ${tour.price}
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {tour.categories?.name_uz || "Kategoriyasiz"}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {popularTours.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              Hozircha mashhur tajribalar yo'q. Turlarni "Bestseller" qilib belgilang.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
