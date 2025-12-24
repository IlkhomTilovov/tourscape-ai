import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  structuredData?: object;
}

const SEO = ({
  title,
  description,
  keywords,
  image = 'https://bestour.uz/og-image.jpg',
  url,
  type = 'website',
  noindex = false,
  structuredData,
}: SEOProps) => {
  const { language } = useLanguage();
  
  const baseUrl = 'https://bestour.uz';
  const currentUrl = url ? `${baseUrl}${url}` : baseUrl;
  
  // Default titles and descriptions by language
  const defaultTitles: Record<string, string> = {
    UZ: "Bestour - O'zbekiston bo'ylab sayohatlar",
    EN: "Bestour - Tours Across Uzbekistan",
    RU: "Bestour - Туры по Узбекистану",
    DE: "Bestour - Touren durch Usbekistan",
  };
  
  const defaultDescriptions: Record<string, string> = {
    UZ: "O'zbekiston bo'ylab eng yaxshi sayohatlar va turlarni kashf eting. Samarqand, Buxoro, Xiva va boshqa tarixiy shaharlarga ekskursiyalar.",
    EN: "Discover the best tours and travels across Uzbekistan. Excursions to Samarkand, Bukhara, Khiva and other historic cities.",
    RU: "Откройте для себя лучшие туры и путешествия по Узбекистану. Экскурсии в Самарканд, Бухару, Хиву и другие исторические города.",
    DE: "Entdecken Sie die besten Touren und Reisen durch Usbekistan. Ausflüge nach Samarkand, Buchara, Chiwa und andere historische Städte.",
  };
  
  const defaultKeywords: Record<string, string> = {
    UZ: "sayohat, tur, O'zbekiston, Samarqand, Buxoro, Xiva, Toshkent, ekskursiya, turizm",
    EN: "travel, tour, Uzbekistan, Samarkand, Bukhara, Khiva, Tashkent, excursion, tourism",
    RU: "путешествие, тур, Узбекистан, Самарканд, Бухара, Хива, Ташкент, экскурсия, туризм",
    DE: "Reise, Tour, Usbekistan, Samarkand, Buchara, Chiwa, Taschkent, Ausflug, Tourismus",
  };
  
  const finalTitle = title 
    ? `${title} | Bestour` 
    : defaultTitles[language] || defaultTitles.EN;
  
  const finalDescription = description || defaultDescriptions[language] || defaultDescriptions.EN;
  const finalKeywords = keywords || defaultKeywords[language] || defaultKeywords.EN;
  
  // Language code for hreflang
  const langCodes: Record<string, string> = {
    UZ: 'uz',
    EN: 'en',
    RU: 'ru',
    DE: 'de',
  };
  
  const currentLangCode = langCodes[language] || 'en';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={currentLangCode} />
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={currentUrl} />
      
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Bestour" />
      <meta property="og:locale" content={currentLangCode} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Hreflang tags for language alternatives */}
      <link rel="alternate" hrefLang="uz" href={`${baseUrl}${url || ''}`} />
      <link rel="alternate" hrefLang="en" href={`${baseUrl}${url || ''}`} />
      <link rel="alternate" hrefLang="ru" href={`${baseUrl}${url || ''}`} />
      <link rel="alternate" hrefLang="de" href={`${baseUrl}${url || ''}`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${url || ''}`} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
