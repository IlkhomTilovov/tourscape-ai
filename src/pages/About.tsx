import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Phone, MapPin, Target, Eye, Building2, Users, Globe, Award, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AboutData {
  title: string;
  description: string;
  mission: string | null;
  vision: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  // Statistics
  stat1_value: string | null;
  stat1_label_uz: string | null;
  stat1_label_en: string | null;
  stat1_label_ru: string | null;
  stat1_label_de: string | null;
  stat2_value: string | null;
  stat2_label_uz: string | null;
  stat2_label_en: string | null;
  stat2_label_ru: string | null;
  stat2_label_de: string | null;
  stat3_value: string | null;
  stat3_label_uz: string | null;
  stat3_label_en: string | null;
  stat3_label_ru: string | null;
  stat3_label_de: string | null;
  stat4_value: string | null;
  stat4_label_uz: string | null;
  stat4_label_en: string | null;
  stat4_label_ru: string | null;
  stat4_label_de: string | null;
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
        .eq("id", "main")
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

  const getTranslation = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      mission: {
        UZ: "Bizning Missiyamiz",
        EN: "Our Mission",
        RU: "Наша Миссия",
        DE: "Unsere Mission"
      },
      vision: {
        UZ: "Bizning Viziyamiz",
        EN: "Our Vision",
        RU: "Наше Видение",
        DE: "Unsere Vision"
      },
      contact: {
        UZ: "Bog'lanish",
        EN: "Contact Us",
        RU: "Свяжитесь с Нами",
        DE: "Kontaktieren Sie Uns"
      },
      noInfo: {
        UZ: "Ma'lumot topilmadi.",
        EN: "No information available.",
        RU: "Информация недоступна.",
        DE: "Keine Informationen verfügbar."
      }
    };
    return translations[key]?.[language] || translations[key]?.EN || key;
  };

  const getStatLabel = (statNum: number) => {
    if (!aboutData) return "";
    const langKey = language.toLowerCase() as 'uz' | 'en' | 'ru' | 'de';
    const key = `stat${statNum}_label_${langKey}` as keyof AboutData;
    return aboutData[key] || "";
  };

  const statIcons = [Users, Globe, Award, Shield];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1">
          {/* Hero Skeleton */}
          <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center animate-pulse">
                <div className="h-12 bg-muted rounded-lg w-2/3 mx-auto mb-6"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-5/6 mx-auto"></div>
                  <div className="h-4 bg-muted rounded w-4/6 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Cards Skeleton */}
          <div className="container mx-auto px-4 py-16">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[1, 2].map((i) => (
                <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Building2 className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-4">{t("about")}</h1>
            <p className="text-lg text-muted-foreground">{getTranslation("noInfo")}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const seoTitles: Record<string, string> = {
    UZ: "Biz haqimizda",
    EN: "About Us",
    RU: "О нас",
    DE: "Über uns"
  };

  const seoDescriptions: Record<string, string> = {
    UZ: "Bestour - O'zbekiston bo'ylab ishonchli sayohat agentligi. Bizning missiyamiz va tajribamiz haqida.",
    EN: "Bestour - Trusted travel agency across Uzbekistan. Learn about our mission and experience.",
    RU: "Bestour - Надежное туристическое агентство по Узбекистану. Узнайте о нашей миссии и опыте.",
    DE: "Bestour - Zuverlässiges Reisebüro in Usbekistan. Erfahren Sie mehr über unsere Mission und Erfahrung."
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title={seoTitles[language]}
        description={seoDescriptions[language]}
        url="/about"
      />
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-background py-20 md:py-28">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
                <Building2 className="h-4 w-4" />
                <span>{t("about")}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
                {aboutData.title}
              </h1>
              
              {aboutData.description && (
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed whitespace-pre-line animate-fade-in max-w-3xl mx-auto">
                  {aboutData.description}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-b border-border/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[1, 2, 3, 4].map((num, index) => {
                const Icon = statIcons[index];
                const value = aboutData[`stat${num}_value` as keyof AboutData];
                const label = getStatLabel(num);
                
                return (
                  <div key={num} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-foreground">{value}</div>
                    <div className="text-sm text-muted-foreground">{label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Mission & Vision Cards */}
        {(aboutData.mission || aboutData.vision) && (
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Mission Card */}
                {aboutData.mission && (
                  <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all duration-500 animate-fade-in">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
                    <CardContent className="p-8 relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Target className="h-7 w-7 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">
                          {getTranslation("mission")}
                        </h2>
                      </div>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {aboutData.mission}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Vision Card */}
                {aboutData.vision && (
                  <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-accent/30 to-accent/50 hover:from-accent/40 hover:to-accent/60 transition-all duration-500 animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
                    <CardContent className="p-8 relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-accent/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Eye className="h-7 w-7 text-accent-foreground" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">
                          {getTranslation("vision")}
                        </h2>
                      </div>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {aboutData.vision}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        {(aboutData.contact_email || aboutData.contact_phone || aboutData.address) && (
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {getTranslation("contact")}
                  </h2>
                  <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aboutData.contact_email && (
                    <a 
                      href={`mailto:${aboutData.contact_email}`}
                      className="group flex flex-col items-center p-6 bg-background rounded-2xl border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 animate-fade-in"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground mb-1">Email</span>
                      <span className="text-foreground font-medium text-center break-all">
                        {aboutData.contact_email}
                      </span>
                    </a>
                  )}
                  
                  {aboutData.contact_phone && (
                    <a 
                      href={`tel:${aboutData.contact_phone}`}
                      className="group flex flex-col items-center p-6 bg-background rounded-2xl border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 animate-fade-in"
                      style={{ animationDelay: '100ms' }}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground mb-1">
                        {language === "UZ" ? "Telefon" : language === "RU" ? "Телефон" : language === "DE" ? "Telefon" : "Phone"}
                      </span>
                      <span className="text-foreground font-medium">
                        {aboutData.contact_phone}
                      </span>
                    </a>
                  )}
                  
                  {aboutData.address && (
                    <div 
                      className="group flex flex-col items-center p-6 bg-background rounded-2xl border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 animate-fade-in sm:col-span-2 lg:col-span-1"
                      style={{ animationDelay: '200ms' }}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground mb-1">
                        {language === "UZ" ? "Manzil" : language === "RU" ? "Адрес" : language === "DE" ? "Adresse" : "Address"}
                      </span>
                      <span className="text-foreground font-medium text-center">
                        {aboutData.address}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default About;
