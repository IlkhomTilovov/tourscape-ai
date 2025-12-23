import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Phone, MapPin } from "lucide-react";

interface AboutData {
  title: string;
  description: string;
  mission: string | null;
  vision: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
}

const About = () => {
  const { language, t } = useLanguage();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const { data, error } = await supabase
        .from("about")
        .select("*")
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching about data:", error);
      }
      
      if (data) {
        setAboutData(data);
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-10 bg-muted rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If no data from database, show default content
  if (!aboutData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">{t("about")}</h1>
            <p className="text-lg text-muted-foreground">
              {language === "UZ" && "Ma'lumot topilmadi."}
              {language === "EN" && "No information available."}
              {language === "RU" && "Информация недоступна."}
              {language === "DE" && "Keine Informationen verfügbar."}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">{aboutData.title}</h1>

          <div className="space-y-8">
            {/* Description */}
            {aboutData.description && (
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-muted-foreground whitespace-pre-line">
                  {aboutData.description}
                </p>
              </div>
            )}

            {/* Mission */}
            {aboutData.mission && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  {language === "UZ" && "Bizning Missiyamiz"}
                  {language === "EN" && "Our Mission"}
                  {language === "RU" && "Наша Миссия"}
                  {language === "DE" && "Unsere Mission"}
                </h2>
                <p className="text-lg text-muted-foreground whitespace-pre-line">
                  {aboutData.mission}
                </p>
              </div>
            )}

            {/* Vision */}
            {aboutData.vision && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  {language === "UZ" && "Bizning Viziyamiz"}
                  {language === "EN" && "Our Vision"}
                  {language === "RU" && "Наше Видение"}
                  {language === "DE" && "Unsere Vision"}
                </h2>
                <p className="text-lg text-muted-foreground whitespace-pre-line">
                  {aboutData.vision}
                </p>
              </div>
            )}

            {/* Contact Information */}
            {(aboutData.contact_email || aboutData.contact_phone || aboutData.address) && (
              <div className="bg-muted/50 rounded-lg p-6 mt-8">
                <h2 className="text-2xl font-semibold mb-6">
                  {language === "UZ" && "Bog'lanish"}
                  {language === "EN" && "Contact Us"}
                  {language === "RU" && "Свяжитесь с Нами"}
                  {language === "DE" && "Kontaktieren Sie Uns"}
                </h2>
                <div className="space-y-4">
                  {aboutData.contact_email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <a href={`mailto:${aboutData.contact_email}`} className="text-lg hover:text-primary transition-colors">
                        {aboutData.contact_email}
                      </a>
                    </div>
                  )}
                  {aboutData.contact_phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <a href={`tel:${aboutData.contact_phone}`} className="text-lg hover:text-primary transition-colors">
                        {aboutData.contact_phone}
                      </a>
                    </div>
                  )}
                  {aboutData.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="text-lg">{aboutData.address}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
