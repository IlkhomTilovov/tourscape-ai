import { Instagram, MessageCircle, Send, Phone, Mail, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.svg";

const Footer = () => {
  const { t } = useLanguage();
  
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
                  href="tel:+998932847117"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <span className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-sm">+998 93 284 71 17</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@bestour.uz"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <span className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-sm">info@bestour.uz</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span className="p-2 bg-primary/10 rounded-full">
                    <MapPin className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-sm">Toshkent shahri, O'zbekiston</span>
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
                <p className="text-foreground font-medium">Du-Sha: 09:00 - 18:00</p>
                <p className="text-muted-foreground">Yak: Dam olish</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/bestour.uz"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-primary/10 rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/998932847117"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-primary/10 rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="https://t.me/sherzod_757"
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
