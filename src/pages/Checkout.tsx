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
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Banknote, Building2 } from "lucide-react";

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

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>
                    {getText("Buyurtma", "Order Summary", "Итого заказа", "Bestellübersicht")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-1">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} x ${item.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {getText("Oraliq jami", "Subtotal", "Промежуточный итог", "Zwischensumme")}
                      </span>
                      <span>${totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {getText("Xizmat to'lovi", "Service Fee", "Сервисный сбор", "Servicegebühr")}
                      </span>
                      <span>${(totalPrice * 0.05).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>{getText("Jami", "Total", "Всего", "Gesamt")}</span>
                      <span>${(totalPrice * 1.05).toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleSubmit} 
                    className="w-full" 
                    size="lg"
                  >
                    {getText("Buyurtmani tasdiqlash", "Confirm Order", "Подтвердить заказ", "Bestellung bestätigen")}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    {getText(
                      "Buyurtmani tasdiqlash orqali siz shartlarimizga rozilik bildirasiz",
                      "By confirming your order, you agree to our terms and conditions",
                      "Подтверждая заказ, вы соглашаетесь с нашими условиями",
                      "Mit der Bestätigung Ihrer Bestellung stimmen Sie unseren Bedingungen zu"
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
