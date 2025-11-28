import { Facebook, Instagram, Twitter, Youtube, MessageCircle, Send, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.svg";

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-muted border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t("companySection")}</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">
                {t("aboutUsLink")}
              </li>
              <li className="text-muted-foreground">
                {t("careersLink")}
              </li>
              <li className="text-muted-foreground">
                {t("contactLink")}
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t("supportSection")}</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">
                {t("helpCenterLink")}
              </li>
              <li className="text-muted-foreground">
                {t("cancellationOptions")}
              </li>
              <li className="text-muted-foreground">
                {t("safetyInfo")}
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t("partnersSection")}</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">
                {t("becomePartner")}
              </li>
              <li className="text-muted-foreground">
                {t("affiliateProgram")}
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t("followUsSection")}</h3>
            <div className="flex flex-col space-y-3">
              <a
                href="https://www.instagram.com/bestour.uz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="text-sm">Instagram</span>
              </a>
              <a
                href="https://wa.me/998932847117"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm">WhatsApp: +998 93 284 71 17</span>
              </a>
              <a
                href="https://t.me/sherzod_757"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Send className="h-5 w-5" />
                <span className="text-sm">Telegram</span>
              </a>
              <a
                href="tel:+998932847117"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span className="text-sm">+998 93 284 71 17</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2024 TravelHub. {t("allRightsReserved")}.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
