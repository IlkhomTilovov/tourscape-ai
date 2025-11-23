import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">{t("about")}</h1>

          {language === "UZ" && (
            <div className="space-y-6 text-lg">
              <p>
                TravelHub - bu sayohat tajribangizni yanada osonlashtirish va
                qiziqarli qilish uchun yaratilgan platforma.
              </p>
              <p>
                Biz dunyoning turli burchaklariga eng yaxshi sayohatlarni taklif etamiz.
                Har bir sayohat maxsus tanlab olingan va mijozlarimizning ehtiyojlariga
                moslashtirilgan.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">Bizning Missiyamiz</h2>
              <p>
                Har bir sayohatchi uchun unutilmas va xavfsiz sayohat tajribasini
                yaratish, dunyoning go'zalliklarini kashf etishda yordam berish.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">Nima uchun Bizni Tanlash Kerak?</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Professional gidlar va xizmat ko'rsatuvchilar</li>
                <li>Arzon narxlar va maxsus takliflar</li>
                <li>Xavfsizlik va qulaylik kafolati</li>
                <li>24/7 mijozlar xizmati</li>
              </ul>
            </div>
          )}

          {language === "EN" && (
            <div className="space-y-6 text-lg">
              <p>
                TravelHub is a platform created to make your travel experience
                easier and more exciting.
              </p>
              <p>
                We offer the best tours to different corners of the world. Each
                tour is specially selected and tailored to our customers' needs.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
              <p>
                To create an unforgettable and safe travel experience for every
                traveler, helping them discover the beauty of the world.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">Why Choose Us?</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Professional guides and service providers</li>
                <li>Affordable prices and special offers</li>
                <li>Safety and comfort guarantee</li>
                <li>24/7 customer service</li>
              </ul>
            </div>
          )}

          {language === "RU" && (
            <div className="space-y-6 text-lg">
              <p>
                TravelHub - это платформа, созданная для того, чтобы сделать ваш
                опыт путешествий проще и интереснее.
              </p>
              <p>
                Мы предлагаем лучшие туры в различные уголки мира. Каждый тур
                специально отобран и адаптирован к потребностям наших клиентов.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">Наша Миссия</h2>
              <p>
                Создать незабываемый и безопасный опыт путешествий для каждого
                путешественника, помогая открывать красоту мира.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">Почему Выбрать Нас?</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Профессиональные гиды и поставщики услуг</li>
                <li>Доступные цены и специальные предложения</li>
                <li>Гарантия безопасности и комфорта</li>
                <li>Круглосуточная служба поддержки клиентов</li>
              </ul>
            </div>
          )}

          {language === "DE" && (
            <div className="space-y-6 text-lg">
              <p>
                TravelHub ist eine Plattform, die entwickelt wurde, um Ihr
                Reiseerlebnis einfacher und aufregender zu gestalten.
              </p>
              <p>
                Wir bieten die besten Touren in verschiedene Ecken der Welt. Jede
                Tour ist speziell ausgewählt und auf die Bedürfnisse unserer Kunden
                zugeschnitten.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">Unsere Mission</h2>
              <p>
                Ein unvergessliches und sicheres Reiseerlebnis für jeden Reisenden
                zu schaffen und dabei zu helfen, die Schönheit der Welt zu entdecken.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">Warum Uns Wählen?</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Professionelle Reiseführer und Dienstleister</li>
                <li>Erschwingliche Preise und Sonderangebote</li>
                <li>Sicherheits- und Komfortgarantie</li>
                <li>24/7 Kundenservice</li>
              </ul>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
