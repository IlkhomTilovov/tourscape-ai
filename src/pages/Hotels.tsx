import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hotel, Calendar, MapPin, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Hotels = () => {
  const { language } = useLanguage();

  const content = {
    EN: {
      title: "Find Your Perfect Stay",
      subtitle: "Book hotels worldwide with best prices",
      destination: "Destination",
      checkIn: "Check-in Date",
      checkOut: "Check-out Date",
      guests: "Guests",
      search: "Search Hotels",
      features: {
        title: "Why Choose Us",
        items: [
          { title: "Wide Selection", desc: "Thousands of hotels worldwide" },
          { title: "Best Rates", desc: "Guaranteed lowest prices" },
          { title: "Free Cancellation", desc: "Cancel anytime, no fees" },
        ]
      }
    },
    UZ: {
      title: "O'zingizga Mos Mehmonxona Toping",
      subtitle: "Dunyo bo'ylab mehmonxonalarni eng yaxshi narxlarda bron qiling",
      destination: "Manzil",
      checkIn: "Kirish sanasi",
      checkOut: "Chiqish sanasi",
      guests: "Mehmonlar",
      search: "Mehmonxona Qidirish",
      features: {
        title: "Nima uchun Bizni tanlaysiz",
        items: [
          { title: "Keng Tanlov", desc: "Dunyo bo'ylab minglab mehmonxonalar" },
          { title: "Eng yaxshi narxlar", desc: "Kafolatlangan past narxlar" },
          { title: "Bepul Bekor qilish", desc: "Istalgan vaqt bekor qiling" },
        ]
      }
    },
    RU: {
      title: "Найдите Идеальный Отель",
      subtitle: "Бронируйте отели по всему миру по лучшим ценам",
      destination: "Направление",
      checkIn: "Дата заезда",
      checkOut: "Дата выезда",
      guests: "Гости",
      search: "Поиск Отелей",
      features: {
        title: "Почему Выбирают Нас",
        items: [
          { title: "Большой выбор", desc: "Тысячи отелей по всему миру" },
          { title: "Лучшие цены", desc: "Гарантированно низкие цены" },
          { title: "Бесплатная отмена", desc: "Отмените в любое время" },
        ]
      }
    },
    DE: {
      title: "Finden Sie Ihr Perfektes Hotel",
      subtitle: "Buchen Sie Hotels weltweit zu besten Preisen",
      destination: "Ziel",
      checkIn: "Check-in Datum",
      checkOut: "Check-out Datum",
      guests: "Gäste",
      search: "Hotels Suchen",
      features: {
        title: "Warum Uns Wählen",
        items: [
          { title: "Große Auswahl", desc: "Tausende Hotels weltweit" },
          { title: "Beste Preise", desc: "Garantiert niedrigste Preise" },
          { title: "Kostenlose Stornierung", desc: "Jederzeit stornieren" },
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
                  <label className="text-sm font-medium mb-2 block">{t.destination}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Samarkand" className="pl-10" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t.checkIn}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="date" className="pl-10" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t.checkOut}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="date" className="pl-10" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t.guests}</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="number" min="1" defaultValue="2" className="pl-10" />
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

export default Hotels;
