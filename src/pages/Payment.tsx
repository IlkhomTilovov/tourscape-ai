import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Wallet, CheckCircle, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BookingData {
  tourId: string;
  tourTitle: string;
  date: string;
  time?: string;
  adults: number;
  totalPrice: number;
}

interface ContactDetails {
  name: string;
  email: string;
  phone: string;
  pickupAddress: string;
}

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const { clearCart } = useCart();
  
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    name: "",
    email: "",
    phone: "",
    pickupAddress: "",
  });

  const bookingData: BookingData = location.state || {};

  const getText = (uz: string, en: string, ru: string, de: string) => {
    switch (language) {
      case "UZ": return uz;
      case "EN": return en;
      case "RU": return ru;
      case "DE": return de;
      default: return en;
    }
  };

  // Redirect if no booking data
  useEffect(() => {
    if (!bookingData.tourId || !bookingData.totalPrice) {
      toast.error(getText(
        "Buyurtma ma'lumotlari topilmadi",
        "Booking data not found",
        "Данные бронирования не найдены",
        "Buchungsdaten nicht gefunden"
      ));
      navigate("/tours");
    }
  }, []);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactDetails(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!contactDetails.name.trim()) {
      toast.error(getText("Ismingizni kiriting", "Enter your name", "Введите имя", "Geben Sie Ihren Namen ein"));
      return false;
    }
    if (!contactDetails.email.trim() || !contactDetails.email.includes("@")) {
      toast.error(getText("Email kiriting", "Enter valid email", "Введите email", "Geben Sie eine E-Mail ein"));
      return false;
    }
    if (!contactDetails.phone.trim()) {
      toast.error(getText("Telefon raqamini kiriting", "Enter phone number", "Введите номер телефона", "Geben Sie Telefonnummer ein"));
      return false;
    }
    if (!contactDetails.pickupAddress.trim()) {
      toast.error(getText("Manzilni kiriting", "Enter address", "Введите адрес", "Geben Sie Adresse ein"));
      return false;
    }
    return true;
  };

  const createBooking = async () => {
    const bookingPayload = {
      tour_id: bookingData.tourId,
      booking_date: bookingData.date,
      booking_time: bookingData.time || null,
      adults: bookingData.adults || 1,
      total_price: bookingData.totalPrice,
      user_name: contactDetails.name.trim(),
      user_email: contactDetails.email.trim(),
      user_phone: contactDetails.phone.trim(),
      pickup_address: contactDetails.pickupAddress.trim(),
      payment_method: paymentMethod,
      payment_status: "pending"
    };

    console.log("Creating booking with payload:", bookingPayload);

    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingPayload)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return data;
  };

  const sendTelegramNotification = async (booking: any) => {
    try {
      await supabase.functions.invoke('send-telegram-notification', {
        body: {
          id: booking.id,
          tour_id: booking.tour_id,
          booking_date: booking.booking_date,
          booking_time: booking.booking_time,
          adults: booking.adults,
          total_price: booking.total_price,
          user_name: booking.user_name,
          user_email: booking.user_email,
          user_phone: booking.user_phone,
          pickup_address: booking.pickup_address,
          payment_status: booking.payment_status,
          payment_method: booking.payment_method
        }
      });
    } catch (err) {
      console.error("Telegram notification failed:", err);
      // Don't throw - notification failure shouldn't block booking
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Create booking in database
      const booking = await createBooking();
      
      // Send notification (non-blocking)
      sendTelegramNotification(booking);

      // Show success
      setIsSuccess(true);
      clearCart();
      
      toast.success(getText(
        "Buyurtma muvaffaqiyatli yaratildi!",
        "Booking created successfully!",
        "Бронирование успешно создано!",
        "Buchung erfolgreich erstellt!"
      ));

      // Redirect after delay
      setTimeout(() => navigate("/"), 3000);
      
    } catch (error: any) {
      console.error("Booking creation failed:", error);
      
      const errorMessage = error?.message || "Unknown error";
      toast.error(getText(
        `Xatolik: ${errorMessage}`,
        `Error: ${errorMessage}`,
        `Ошибка: ${errorMessage}`,
        `Fehler: ${errorMessage}`
      ));
    } finally {
      setIsProcessing(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold">
              {getText("Buyurtma yaratildi!", "Booking Created!", "Бронирование создано!", "Buchung erstellt!")}
            </h1>
            <p className="text-muted-foreground">
              {getText(
                "Tez orada siz bilan bog'lanamiz",
                "We will contact you soon",
                "Мы свяжемся с вами в ближайшее время",
                "Wir werden uns bald bei Ihnen melden"
              )}
            </p>
            <Button onClick={() => navigate("/")} variant="outline">
              {getText("Bosh sahifaga", "Go to Homepage", "На главную", "Zur Startseite")}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            {getText("To'lov", "Payment", "Оплата", "Zahlung")}
          </h1>

          {/* Booking Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {getText("Buyurtma ma'lumotlari", "Booking Details", "Детали заказа", "Buchungsdetails")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{getText("Tur", "Tour", "Тур", "Tour")}</span>
                  <span className="font-medium">{bookingData.tourTitle || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{getText("Sana", "Date", "Дата", "Datum")}</span>
                  <span className="font-medium">{bookingData.date || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{getText("Kishilar", "People", "Люди", "Personen")}</span>
                  <span className="font-medium">{bookingData.adults || 1}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-3 border-t">
                  <span>{getText("Jami", "Total", "Всего", "Gesamt")}</span>
                  <span className="text-primary">${bookingData.totalPrice || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {getText("To'lov ma'lumotlari", "Payment Information", "Информация об оплате", "Zahlungsinformationen")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Details */}
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold">
                    {getText("Aloqa ma'lumotlari", "Contact Information", "Контактная информация", "Kontaktinformationen")}
                  </h3>
                  
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="name">{getText("Ism", "Name", "Имя", "Name")} *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={contactDetails.name}
                        onChange={handleContactChange}
                        placeholder={getText("Ismingiz", "Your name", "Ваше имя", "Ihr Name")}
                        disabled={isProcessing}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={contactDetails.email}
                        onChange={handleContactChange}
                        placeholder="example@email.com"
                        disabled={isProcessing}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">{getText("Telefon", "Phone", "Телефон", "Telefon")} *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={contactDetails.phone}
                        onChange={handleContactChange}
                        placeholder="+998 90 123 45 67"
                        disabled={isProcessing}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="pickupAddress">{getText("Manzil", "Address", "Адрес", "Adresse")} *</Label>
                      <Input
                        id="pickupAddress"
                        name="pickupAddress"
                        type="text"
                        value={contactDetails.pickupAddress}
                        onChange={handleContactChange}
                        placeholder={getText("Manzilingiz", "Your address", "Ваш адрес", "Ihre Adresse")}
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-3">
                  <h3 className="font-semibold">
                    {getText("To'lov usuli", "Payment Method", "Способ оплаты", "Zahlungsmethode")}
                  </h3>
                  
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod} 
                    className="space-y-2"
                    disabled={isProcessing}
                  >
                    <Label 
                      htmlFor="cash" 
                      className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors"
                    >
                      <RadioGroupItem value="cash" id="cash" />
                      <Wallet className="h-5 w-5" />
                      <span>{getText("Naqd pul", "Cash", "Наличные", "Bargeld")}</span>
                    </Label>
                    
                    <Label 
                      htmlFor="card" 
                      className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors"
                    >
                      <RadioGroupItem value="card" id="card" />
                      <CreditCard className="h-5 w-5" />
                      <span>{getText("Plastik karta", "Credit Card", "Банковская карта", "Kreditkarte")}</span>
                    </Label>
                    
                    <Label 
                      htmlFor="transfer" 
                      className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors"
                    >
                      <RadioGroupItem value="transfer" id="transfer" />
                      <Wallet className="h-5 w-5" />
                      <span>{getText("Bank o'tkazmasi", "Bank Transfer", "Банковский перевод", "Banküberweisung")}</span>
                    </Label>
                  </RadioGroup>
                </div>

                {/* Info text based on payment method */}
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                  {paymentMethod === "cash" && getText(
                    "Naqd pul bilan to'lash uchun siz bilan bog'lanamiz",
                    "We will contact you for cash payment",
                    "Мы свяжемся с вами для оплаты наличными",
                    "Wir werden Sie für die Barzahlung kontaktieren"
                  )}
                  {paymentMethod === "card" && getText(
                    "Karta orqali to'lash uchun siz bilan bog'lanamiz",
                    "We will contact you for card payment",
                    "Мы свяжемся с вами для оплаты картой",
                    "Wir werden Sie für die Kartenzahlung kontaktieren"
                  )}
                  {paymentMethod === "transfer" && getText(
                    "Bank rekvizitlari siz bilan bog'langanimizda beriladi",
                    "Bank details will be provided when we contact you",
                    "Банковские реквизиты будут предоставлены при связи",
                    "Bankdaten werden bei Kontaktaufnahme mitgeteilt"
                  )}
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-semibold" 
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {getText("Yaratilmoqda...", "Creating...", "Создание...", "Erstellen...")}
                    </>
                  ) : (
                    getText("Buyurtma berish", "Place Order", "Оформить заказ", "Bestellung aufgeben")
                  )}
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
