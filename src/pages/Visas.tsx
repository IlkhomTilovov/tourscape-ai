import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, Shield, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Visas = () => {
  const { language } = useLanguage();

  const content = {
    EN: {
      title: "Visa Services",
      subtitle: "Get your visa quickly and hassle-free",
      services: {
        title: "Our Visa Services",
        items: [
          { title: "Tourist Visa", desc: "Perfect for leisure travel", icon: FileText },
          { title: "Business Visa", desc: "For business trips and meetings", icon: Shield },
          { title: "Transit Visa", desc: "Short-term transit permits", icon: Clock },
        ]
      },
      process: {
        title: "Simple Process",
        steps: [
          { title: "Submit Documents", desc: "Upload required documents online" },
          { title: "Processing", desc: "We handle all paperwork" },
          { title: "Get Visa", desc: "Receive your visa quickly" },
        ]
      },
      cta: "Apply Now"
    },
    UZ: {
      title: "Viza Xizmatlari",
      subtitle: "Vizangizni tez va oson oling",
      services: {
        title: "Bizning Viza Xizmatlarimiz",
        items: [
          { title: "Turistik Viza", desc: "Dam olish sayohatlari uchun", icon: FileText },
          { title: "Biznes Viza", desc: "Biznes safari va uchrashuvlar uchun", icon: Shield },
          { title: "Tranzit Viza", desc: "Qisqa muddatli tranzit ruxsati", icon: Clock },
        ]
      },
      process: {
        title: "Oddiy Jarayon",
        steps: [
          { title: "Hujjatlar Topshirish", desc: "Kerakli hujjatlarni yuklang" },
          { title: "Qayta ishlash", desc: "Biz barcha qog'ozlarni bajaramiz" },
          { title: "Viza Olish", desc: "Vizangizni tez oling" },
        ]
      },
      cta: "Ariza Berish"
    },
    RU: {
      title: "Визовые Услуги",
      subtitle: "Получите визу быстро и без проблем",
      services: {
        title: "Наши Визовые Услуги",
        items: [
          { title: "Туристическая Виза", desc: "Для отдыха и туризма", icon: FileText },
          { title: "Бизнес Виза", desc: "Для деловых поездок", icon: Shield },
          { title: "Транзитная Виза", desc: "Краткосрочные разрешения", icon: Clock },
        ]
      },
      process: {
        title: "Простой Процесс",
        steps: [
          { title: "Подать Документы", desc: "Загрузите документы онлайн" },
          { title: "Обработка", desc: "Мы оформляем все документы" },
          { title: "Получить Визу", desc: "Получите визу быстро" },
        ]
      },
      cta: "Подать Заявку"
    },
    DE: {
      title: "Visa-Dienstleistungen",
      subtitle: "Erhalten Sie Ihr Visum schnell und problemlos",
      services: {
        title: "Unsere Visa-Dienste",
        items: [
          { title: "Touristenvisum", desc: "Perfekt für Urlaubsreisen", icon: FileText },
          { title: "Geschäftsvisum", desc: "Für Geschäftsreisen", icon: Shield },
          { title: "Transitvisum", desc: "Kurzfristige Genehmigungen", icon: Clock },
        ]
      },
      process: {
        title: "Einfacher Prozess",
        steps: [
          { title: "Dokumente Einreichen", desc: "Laden Sie Dokumente online hoch" },
          { title: "Bearbeitung", desc: "Wir kümmern uns um alles" },
          { title: "Visum Erhalten", desc: "Erhalten Sie Ihr Visum schnell" },
        ]
      },
      cta: "Jetzt Beantragen"
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

        {/* Services Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{t.services.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.services.items.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon className="h-12 w-12 text-primary mb-4" />
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">{t.cta}</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Process Section */}
        <section className="bg-muted py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">{t.process.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {t.process.steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Visas;
