import { Instagram, MessageCircle, Send, Phone, Mail, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.svg";

const Footer = () => {
  const { t, language } = useLanguage();

  const { data: footerContent } = useQuery({
    queryKey: ["footer-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("footer_content")
        .select("*")
        .eq("id", "main")
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const getAddress = () => {
    if (!footerContent) return "Toshkent shahri, O'zbekiston";
    switch (language) {
      case "UZ": return footerContent.address_uz;
      case "EN": return footerContent.address_en;
      case "RU": return footerContent.address_ru;
      case "DE": return footerContent.address_de;
      default: return footerContent.address_uz;
    }
  };

  const phone = footerContent?.phone || "+998 93 284 71 17";
  const email = footerContent?.email || "info@bestour.uz";
  const workingWeekday = footerContent?.working_hours_weekday || "09:00 - 18:00";
  const workingWeekend = footerContent?.working_hours_weekend || "Dam olish";
  const instagramUrl = footerContent?.instagram_url || "https://www.instagram.com/bestour.uz";
  const whatsappNumber = footerContent?.whatsapp_number || "+998932847117";
  const telegramUrl = footerContent?.telegram_url || "https://t.me/sherzod_757";
  
  return (
    <footer className="bg-muted/50 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="BesTour" className="h-12 w-12" />
              <div>
                <h3 className="font-bold text-xl text-foreground">BesTour</h3>
                <p className="text-sm text-muted-foreground">{t("heroSubtitle")}</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("heroSubtitle")}
            </p>
          </div>

          {/* Pages */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <h3 className="font-semibold text-lg text-foreground">{t("companySection")}</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <Link to="/tours" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  {t("tours")}
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  {t("destinations")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  {t("aboutUsLink")}
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  {t("categories")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <h3 className="font-semibold text-lg text-foreground">{t("contactLink")}</h3>
            </div>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <span className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-sm">{phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <span className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-sm">{email}</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span className="p-2 bg-primary/10 rounded-full">
                    <MapPin className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-sm">{getAddress()}</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Working Hours & Social */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <h3 className="font-semibold text-lg text-foreground">{t("followUsSection")}</h3>
            </div>
            
            {/* Working Hours */}
            <div className="flex items-start gap-3 mb-6">
              <span className="p-2 bg-primary/10 rounded-full">
                <Clock className="h-4 w-4 text-primary" />
              </span>
              <div className="text-sm">
                <p className="text-foreground font-medium">Du-Sha: {workingWeekday}</p>
                <p className="text-muted-foreground">Yak: {workingWeekend}</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-primary/10 rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-primary/10 rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-primary/10 rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="Telegram"
              >
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 BesTour. {t("allRightsReserved")}.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-primary transition-colors">
              {t("aboutUsLink")}
            </Link>
            <span className="text-border">•</span>
            <Link to="/tours" className="hover:text-primary transition-colors">
              {t("tours")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
