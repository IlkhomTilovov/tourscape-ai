import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("aboutUsLink")}
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("careersLink")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("contactLink")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t("supportSection")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/help"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("helpCenterLink")}
                </Link>
              </li>
              <li>
                <Link
                  to="/cancellation"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("cancellationOptions")}
                </Link>
              </li>
              <li>
                <Link
                  to="/safety"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("safetyInfo")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t("partnersSection")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/partner"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("becomePartner")}
                </Link>
              </li>
              <li>
                <Link
                  to="/affiliate"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("affiliateProgram")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t("followUsSection")}</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Youtube className="h-6 w-6" />
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
