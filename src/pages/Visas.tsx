import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Clock, Calendar, FileText, CheckCircle } from "lucide-react";

interface Visa {
  id: string;
  country: string;
  visa_type: string;
  duration: string;
  processing_time: string;
  requirements: string;
  price: number;
}

const Visas = () => {
  const { t } = useLanguage();
  const [visas, setVisas] = useState<Visa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisas();

    // Real-time updates
    const channel = supabase
      .channel('visas-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'visas'
        },
        () => {
          fetchVisas();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchVisas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("visas")
      .select("*")
      .order("country", { ascending: true });
    
    if (error) {
      console.error("Error fetching visas:", error);
    } else {
      setVisas(data || []);
    }
    setLoading(false);
  };

  const parseRequirements = (requirements: string) => {
    return requirements.split('\n').filter(req => req.trim() !== '');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Vizalar</h1>
            <p className="text-lg text-muted-foreground">
              Turli mamlakatlar uchun viza ma'lumotlari va talablar
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Yuklanmoqda...</p>
            </div>
          ) : visas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Hozircha viza ma'lumotlari mavjud emas</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visas.map((visa) => (
                <Card key={visa.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="border-b bg-muted/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                          <Globe className="h-6 w-6 text-primary" />
                          {visa.country}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-2">
                          {visa.visa_type}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-primary">
                          ${visa.price}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Duration */}
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Amal qilish muddati</p>
                          <p className="font-semibold">{visa.duration}</p>
                        </div>
                      </div>

                      {/* Processing Time */}
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Tayyorlanish vaqti</p>
                          <p className="font-semibold">{visa.processing_time}</p>
                        </div>
                      </div>

                      {/* Requirements */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <p className="font-semibold">Kerakli hujjatlar:</p>
                        </div>
                        <div className="space-y-2 ml-7">
                          {parseRequirements(visa.requirements).map((req, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-muted-foreground">{req}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full mt-4">
                        Ariza topshirish
                      </Button>
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

export default Visas;
