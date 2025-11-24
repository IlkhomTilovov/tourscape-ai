import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Calendar, MapPin, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Flights = () => {
  const { language } = useLanguage();

  const content = {
    EN: {
      title: "Book Your Flight",
      subtitle: "Find the best flight deals to your destination",
      from: "From",
      to: "To",
      departure: "Departure Date",
      passengers: "Passengers",
      search: "Search Flights",
      popularRoutes: "Popular Routes",
      features: {
        title: "Why Book With Us",
        items: [
          { title: "Best Prices", desc: "Competitive rates for all destinations" },
          { title: "Easy Booking", desc: "Simple and fast booking process" },
          { title: "24/7 Support", desc: "Customer support anytime you need" },
        ]
      }
    },
    UZ: {
      title: "Parvoz Bron Qilish",
      subtitle: "Manzilingizga eng yaxshi parvoz takliflarini toping",
      from: "Qayerdan",
      to: "Qayerga",
      departure: "Jo'nash sanasi",
      passengers: "Yo'lovchilar",
      search: "Parvoz Qidirish",
      popularRoutes: "Mashhur Yo'nalishlar",
      features: {
        title: "Nima uchun Biz bilan",
        items: [
          { title: "Eng yaxshi narxlar", desc: "Barcha yo'nalishlar uchun arzon narxlar" },
          { title: "Oson bron qilish", desc: "Tez va sodda bron qilish jarayoni" },
          { title: "24/7 Yordam", desc: "Istalgan vaqtda yordam xizmati" },
        ]
      }
    },
    RU: {
      title: "Забронировать Рейс",
      subtitle: "Найдите лучшие предложения авиабилетов",
      from: "Откуда",
      to: "Куда",
      departure: "Дата вылета",
      passengers: "Пассажиры",
      search: "Поиск Рейсов",
      popularRoutes: "Популярные Направления",
      features: {
        title: "Почему Мы",
        items: [
          { title: "Лучшие цены", desc: "Выгодные тарифы на все направления" },
          { title: "Легкое бронирование", desc: "Быстрый и простой процесс" },
          { title: "Поддержка 24/7", desc: "Служба поддержки в любое время" },
        ]
      }
    },
    DE: {
      title: "Flug Buchen",
      subtitle: "Finden Sie die besten Flugangebote",
      from: "Von",
      to: "Nach",
      departure: "Abflugdatum",
      passengers: "Passagiere",
      search: "Flüge Suchen",
      popularRoutes: "Beliebte Routen",
      features: {
        title: "Warum Bei Uns Buchen",
        items: [
          { title: "Beste Preise", desc: "Wettbewerbsfähige Tarife" },
          { title: "Einfache Buchung", desc: "Schneller Buchungsprozess" },
          { title: "24/7 Support", desc: "Kundenservice jederzeit" },
        ]
      }
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-gradient py-20 text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>
            <p className="text-xl opacity-90">{t.subtitle}</p>
          </div>
        </section>

        {/* Search Section */}
        <section className="container mx-auto px-4 -mt-10">
          <Card className="shadow-xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">{t.from}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Tashkent" className="pl-10" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t.to}</label>
                  <div className="relative">
                    <Plane className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Dubai" className="pl-10" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t.departure}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="date" className="pl-10" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t.passengers}</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="number" min="1" defaultValue="1" className="pl-10" />
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4" size="lg">
                {t.search}
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{t.features.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.features.items.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Flights;
