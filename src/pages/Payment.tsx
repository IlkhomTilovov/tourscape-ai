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

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const { clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardDetails({
      ...cardDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "card") {
      if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv) {
        toast.error(getText(
          "Iltimos, barcha maydonlarni to'ldiring",
          "Please fill in all fields",
          "Пожалуйста, заполните все поля",
          "Bitte füllen Sie alle Felder aus"
        ));
        return;
      }
    }

    toast.success(getText(
      "To'lov muvaffaqiyatli amalga oshirildi!",
      "Payment successful!",
      "Оплата прошла успешно!",
      "Zahlung erfolgreich!"
    ));

    clearCart();
    
    setTimeout(() => {
      navigate("/");
    }, 2000);
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
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      <span>{getText("Plastik karta", "Credit/Debit Card", "Банковская карта", "Kreditkarte")}</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Wallet className="h-5 w-5" />
                      <span>{getText("Elektron hamyon", "Digital Wallet", "Электронный кошелек", "Digitale Geldbörse")}</span>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="space-y-4 animate-in fade-in-50">
                    <div>
                      <Label htmlFor="cardNumber">
                        {getText("Karta raqami", "Card Number", "Номер карты", "Kartennummer")}
                      </Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.cardNumber}
                        onChange={handleInputChange}
                        maxLength={19}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardName">
                        {getText("Karta egasining ismi", "Cardholder Name", "Имя владельца карты", "Karteninhaber")}
                      </Label>
                      <Input
                        id="cardName"
                        name="cardName"
                        placeholder="JOHN DOE"
                        value={cardDetails.cardName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">
                          {getText("Amal qilish muddati", "Expiry Date", "Срок действия", "Ablaufdatum")}
                        </Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={cardDetails.expiryDate}
                          onChange={handleInputChange}
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          type="password"
                          value={cardDetails.cvv}
                          onChange={handleInputChange}
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "wallet" && (
                  <div className="text-center py-8 text-muted-foreground animate-in fade-in-50">
                    {getText(
                      "Elektron hamyon orqali to'lov tez orada qo'shiladi",
                      "Digital wallet payment coming soon",
                      "Оплата через электронный кошелек скоро будет доступна",
                      "Digitale Geldbörse-Zahlung kommt bald"
                    )}
                  </div>
                )}

                <Button type="submit" className="w-full h-14 text-lg font-semibold" size="lg">
                  {getText("To'lovni tasdiqlash", "Confirm Payment", "Подтвердить оплату", "Zahlung bestätigen")}
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
