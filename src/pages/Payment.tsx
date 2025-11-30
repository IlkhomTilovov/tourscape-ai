import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Wallet } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const { clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [contactDetails, setContactDetails] = useState({
    email: "",
    phone: "",
  });

  const bookingData = location.state || {};

  const getText = (uz: string, en: string, ru: string, de: string) => {
    switch (language) {
      case "UZ": return uz;
      case "EN": return en;
      case "RU": return ru;
      case "DE": return de;
      default: return en;
    }
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactDetails({
      ...contactDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate contact details
    if (!contactDetails.email && !contactDetails.phone) {
      toast.error(getText(
        "Iltimos, email yoki telefon raqamini kiriting",
        "Please enter email or phone number",
        "Пожалуйста, введите email или номер телефона",
        "Bitte geben Sie E-Mail oder Telefonnummer ein"
      ));
      return;
    }
    
    // For all payment methods except Uzum, create booking directly
    if (paymentMethod !== "uzum") {
      setIsProcessing(true);
      
      try {
        const { data: booking, error } = await supabase
          .from('bookings')
          .insert({
            tour_id: bookingData.tourId,
            booking_date: bookingData.date,
            booking_time: bookingData.time,
            adults: bookingData.adults || 1,
            total_price: bookingData.totalPrice,
            user_email: contactDetails.email,
            user_phone: contactDetails.phone,
            payment_method: paymentMethod,
            payment_status: paymentMethod === "cash" ? "pending" : "completed"
          })
          .select()
          .single();

        if (error) throw error;

        // Send Telegram notification
        await supabase.functions.invoke('send-telegram-notification', {
          body: {
            id: booking.id,
            tour_id: booking.tour_id,
            booking_date: booking.booking_date,
            booking_time: booking.booking_time,
            adults: booking.adults,
            total_price: booking.total_price,
            user_email: booking.user_email,
            user_phone: booking.user_phone,
            payment_status: booking.payment_status,
            payment_method: booking.payment_method
          }
        });

        const methodNames: Record<string, string> = {
          cash: getText("Naqd pul", "Cash", "Наличные", "Bargeld"),
          mastercard: "MasterCard",
          visa: "Visa",
          other: getText("Boshqa karta", "Other Card", "Другая карта", "Andere Karte")
        };
        
        toast.success(getText(
          `${methodNames[paymentMethod]} orqali buyurtma yaratildi!`,
          `Booking created with ${methodNames[paymentMethod]}!`,
          `Заказ создан через ${methodNames[paymentMethod]}!`,
          `Buchung erstellt mit ${methodNames[paymentMethod]}!`
        ));
        clearCart();
        setTimeout(() => navigate("/"), 2000);
        return;
      } catch (error) {
        console.error('Booking error:', error);
        toast.error(getText(
          "Buyurtma yaratishda xatolik yuz berdi",
          "Booking creation error occurred",
          "Ошибка при создании заказа",
          "Fehler bei der Buchungserstellung"
        ));
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    if (paymentMethod === "uzum") {
      setIsProcessing(true);
      
      try {
        const { data, error } = await supabase.functions.invoke('create-uzum-payment', {
          body: {
            tourId: bookingData.tourId,
            adults: bookingData.adults || 1,
            bookingDate: bookingData.date,
            bookingTime: bookingData.time,
            totalPrice: bookingData.totalPrice,
            userEmail: contactDetails.email,
            userPhone: contactDetails.phone,
          }
        });

        if (error) throw error;

        if (data.success) {
          toast.success(getText(
            "Buyurtma yaratildi! Uzum to'lov sahifasiga o'tilmoqda...",
            "Booking created! Redirecting to Uzum payment...",
            "Заказ создан! Переход на страницу оплаты Uzum...",
            "Buchung erstellt! Weiterleitung zur Uzum-Zahlung..."
          ));

          if (data.mock) {
            // Demo mode - show info about API integration
            toast.info(getText(
              "Demo rejim: Uzum API kalitlari qo'shilganda real to'lov ishga tushadi",
              "Demo mode: Real payment will work when Uzum API keys are added",
              "Демо режим: Реальная оплата будет работать при добавлении API ключей Uzum",
              "Demo-Modus: Echte Zahlung funktioniert nach Hinzufügen der Uzum-API-Schlüssel"
            ), { duration: 5000 });
          }

          clearCart();
          
          // In real implementation, redirect to Uzum payment page:
          // window.location.href = data.paymentUrl;
          
          // For demo, just redirect home after delay
          setTimeout(() => navigate("/"), 3000);
        }
      } catch (error) {
        console.error('Payment error:', error);
        toast.error(getText(
          "To'lovda xatolik yuz berdi",
          "Payment error occurred",
          "Ошибка при оплате",
          "Zahlungsfehler aufgetreten"
        ));
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            {getText("To'lov", "Payment", "Оплата", "Zahlung")}
          </h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {getText("Buyurtma ma'lumotlari", "Booking Details", "Детали заказа", "Buchungsdetails")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {getText("Tur", "Tour", "Тур", "Tour")}
                  </span>
                  <span className="font-medium">{bookingData.tourTitle || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {getText("Sana", "Date", "Дата", "Datum")}
                  </span>
                  <span className="font-medium">{bookingData.date || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {getText("Kattalar soni", "Number of Adults", "Количество взрослых", "Anzahl Erwachsene")}
                  </span>
                  <span className="font-medium">{bookingData.adults || 1}</span>
                </div>
                <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t">
                  <span>{getText("Jami", "Total", "Всего", "Gesamt")}</span>
                  <span>${bookingData.totalPrice || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {getText("To'lov usulini tanlang", "Select Payment Method", "Выберите способ оплаты", "Zahlungsmethode wählen")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-6">
                {/* Contact Information */}
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold">
                    {getText("Aloqa ma'lumotlari", "Contact Information", "Контактная информация", "Kontaktinformationen")}
                  </h3>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      value={contactDetails.email}
                      onChange={handleContactChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">
                      {getText("Telefon raqami", "Phone Number", "Номер телефона", "Telefonnummer")}
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+998 90 123 45 67"
                      value={contactDetails.phone}
                      onChange={handleContactChange}
                    />
                  </div>
                </div>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Wallet className="h-5 w-5" />
                      <span>{getText("Naqd pul", "Cash", "Наличные", "Bargeld")}</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="mastercard" id="mastercard" />
                    <Label htmlFor="mastercard" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      <span>MasterCard</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="visa" id="visa" />
                    <Label htmlFor="visa" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      <span>Visa</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      <span>{getText("Boshqa", "Other", "Другое", "Andere")}</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="uzum" id="uzum" />
                    <Label htmlFor="uzum" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Wallet className="h-5 w-5" />
                      <span>Uzum</span>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "cash" && (
                  <div className="text-center py-8 space-y-4 animate-in fade-in-50">
                    <div className="text-lg font-semibold">
                      {getText(
                        "Naqd pul bilan to'lash",
                        "Pay with Cash",
                        "Оплата наличными",
                        "Barzahlung"
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getText(
                        "Siz naqd pul bilan to'lashni tanladingiz. Buyurtma yaratilgandan so'ng siz bilan bog'lanamiz.",
                        "You selected cash payment. We will contact you after booking is created.",
                        "Вы выбрали оплату наличными. Мы свяжемся с вами после создания заказа.",
                        "Sie haben Barzahlung gewählt. Wir werden uns nach der Buchung mit Ihnen in Verbindung setzen."
                      )}
                    </p>
                  </div>
                )}

                {paymentMethod === "uzum" && (
                  <div className="text-center py-8 space-y-4 animate-in fade-in-50">
                    <div className="text-lg font-semibold">
                      {getText(
                        "Uzum orqali to'lash",
                        "Pay with Uzum",
                        "Оплата через Uzum",
                        "Bezahlen mit Uzum"
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getText(
                        "Siz Uzum to'lov tizimiga yo'naltirilasiz",
                        "You will be redirected to Uzum payment system",
                        "Вы будете перенаправлены в систему оплаты Uzum",
                        "Sie werden zum Uzum-Zahlungssystem weitergeleitet"
                      )}
                    </p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-semibold" 
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing 
                    ? getText("Kutilmoqda...", "Processing...", "Обработка...", "Verarbeitung...")
                    : getText("To'lovni tasdiqlash", "Confirm Payment", "Подтвердить оплату", "Zahlung bestätigen")
                  }
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
