import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Banknote, Building2, Users, CalendarIcon, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });
  
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [adults, setAdults] = useState("1");
  const [bookingDate, setBookingDate] = useState<Date>();

  const getText = (uz: string, en: string, ru: string, de: string) => {
    switch (language) {
      case "UZ": return uz;
      case "EN": return en;
      case "RU": return ru;
      case "DE": return de;
      default: return en;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      toast({
        title: getText("Xato", "Error", "Ошибка", "Fehler"),
        description: getText(
          "Iltimos, barcha maydonlarni to'ldiring",
          "Please fill in all fields",
          "Пожалуйста, заполните все поля",
          "Bitte füllen Sie alle Felder aus"
        ),
        variant: "destructive",
      });
      return;
    }

    // Process order
    toast({
      title: getText("Buyurtma qabul qilindi!", "Order Confirmed!", "Заказ подтвержден!", "Bestellung bestätigt!"),
      description: getText(
        "Tez orada siz bilan bog'lanamiz",
        "We will contact you soon",
        "Мы свяжемся с вами в ближайшее время",
        "Wir werden Sie bald kontaktieren"
      ),
    });

    // Clear cart and redirect
    clearCart();
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">
            {getText("To'lov", "Checkout", "Оформление заказа", "Zur Kasse")}
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                {/* Contact Information */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>
                      {getText("Aloqa ma'lumotlari", "Contact Information", "Контактная информация", "Kontaktinformationen")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">
                        {getText("To'liq ism", "Full Name", "Полное имя", "Vollständiger Name")} *
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">
                          {getText("Email", "Email", "Электронная почта", "E-Mail")} *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">
                          {getText("Telefon", "Phone", "Телефон", "Telefon")} *
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Address Information */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>
                      {getText("Manzil", "Address", "Адрес", "Adresse")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">
                        {getText("Ko'cha manzili", "Street Address", "Адрес улицы", "Straßenadresse")} *
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">
                          {getText("Shahar", "City", "Город", "Stadt")}
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">
                          {getText("Pochta indeksi", "Zip Code", "Почтовый индекс", "Postleitzahl")}
                        </Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {getText("To'lov usuli", "Payment Method", "Способ оплаты", "Zahlungsmethode")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                          <CreditCard className="h-5 w-5" />
                          {getText("Karta orqali", "Credit/Debit Card", "Кредитная/дебетовая карта", "Kredit-/Debitkarte")}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Banknote className="h-5 w-5" />
                          {getText("Naqd pul", "Cash on Arrival", "Наличные при прибытии", "Barzahlung bei Ankunft")}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="transfer" id="transfer" />
                        <Label htmlFor="transfer" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Building2 className="h-5 w-5" />
                          {getText("Bank o'tkazmasi", "Bank Transfer", "Банковский перевод", "Banküberweisung")}
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  {/* Price per person */}
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">
                      {getText("Dan boshlab", "From", "От", "Ab")}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">${totalPrice}</span>
                      <span className="text-muted-foreground">
                        {getText("odam uchun", "per person", "на человека", "pro Person")}
                      </span>
                    </div>
                  </div>

                  {/* Adults selector */}
                  <div className="space-y-2">
                    <Select value={adults} onValueChange={setAdults}>
                      <SelectTrigger className="w-full h-14 bg-muted/50 border-2 hover:border-primary transition-colors">
                        <div className="flex items-center gap-2 w-full">
                          <Users className="h-5 w-5 text-muted-foreground" />
                          <SelectValue>
                            {getText(
                              `Kattalar x ${adults}`,
                              `Adult x ${adults}`,
                              `Взрослый x ${adults}`,
                              `Erwachsene x ${adults}`
                            )}
                          </SelectValue>
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-background border-2 z-50">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {getText(
                              `Kattalar x ${num}`,
                              `Adult x ${num}`,
                              `Взрослый x ${num}`,
                              `Erwachsene x ${num}`
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date picker */}
                  <div className="space-y-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-14 justify-start text-left font-normal bg-muted/50 border-2 hover:border-primary hover:bg-muted/70 transition-colors",
                            !bookingDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-5 w-5" />
                          {bookingDate ? (
                            format(bookingDate, "PPP")
                          ) : (
                            <span>{getText("Sanani tanlang", "Pick a date", "Выберите дату", "Datum wählen")}</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-background border-2 z-50" align="start">
                        <Calendar
                          mode="single"
                          selected={bookingDate}
                          onSelect={setBookingDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Separator className="my-4" />

                  {/* Booking benefits */}
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">
                          {getText("Bepul bekor qilish", "Free cancellation", "Бесплатная отмена", "Kostenlose Stornierung")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {getText(
                            "24 soat oldin bekor qilsangiz to'liq qaytariladi",
                            "Cancel up to 24 hours in advance for a full refund",
                            "Отмена за 24 часа для полного возврата средств",
                            "Stornierung bis 24 Stunden im Voraus für volle Rückerstattung"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">
                          {getText("Band qiling va keyinroq to'lang", "Reserve now & pay later", "Забронируйте сейчас и оплатите позже", "Jetzt reservieren & später bezahlen")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {getText(
                            "Sayohat rejalaringizni moslashuvchan qiling — joyni band qiling va bugun hech narsa to'lamang",
                            "Keep your travel plans flexible — book your spot and pay nothing today",
                            "Сохраните гибкость планов — забронируйте место и ничего не платите сегодня",
                            "Halten Sie Ihre Reisepläne flexibel — buchen Sie Ihren Platz und zahlen Sie heute nichts"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Total calculation */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        ${totalPrice} x {adults} {getText("kishi", "person", "человек", "Person")}
                      </span>
                      <span>${totalPrice * parseInt(adults)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {getText("Xizmat to'lovi", "Service Fee", "Сервисный сбор", "Servicegebühr")}
                      </span>
                      <span>${(totalPrice * parseInt(adults) * 0.05).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>{getText("Jami", "Total", "Всего", "Gesamt")}</span>
                      <span>${(totalPrice * parseInt(adults) * 1.05).toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleSubmit} 
                    className="w-full" 
                    size="lg"
                  >
                    {getText("Buyurtmani tasdiqlash", "Confirm Booking", "Подтвердить бронирование", "Buchung bestätigen")}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    {getText(
                      "Buyurtmani tasdiqlash orqali siz shartlarimizga rozilik bildirasiz",
                      "By confirming your booking, you agree to our terms and conditions",
                      "Подтверждая бронирование, вы соглашаетесь с нашими условиями",
                      "Mit der Bestätigung Ihrer Buchung stimmen Sie unseren Bedingungen zu"
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
