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

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t("followUsSection")}</h3>
            <div className="flex space-x-4">
              <span className="text-muted-foreground">
                <Facebook className="h-6 w-6" />
              </span>
              <span className="text-muted-foreground">
                <Instagram className="h-6 w-6" />
              </span>
              <span className="text-muted-foreground">
                <Twitter className="h-6 w-6" />
              </span>
              <span className="text-muted-foreground">
                <Youtube className="h-6 w-6" />
              </span>
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
