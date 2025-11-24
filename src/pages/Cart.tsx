import { Link } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { language } = useLanguage();

  const getText = (uz: string, en: string, ru: string, de: string) => {
    switch (language) {
      case "UZ": return uz;
      case "EN": return en;
      case "RU": return ru;
      case "DE": return de;
      default: return en;
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">
              <h1 className="text-3xl font-bold mb-4">
                {getText("Savat bo'sh", "Cart is Empty", "Корзина пуста", "Warenkorb ist leer")}
              </h1>
              <p className="text-muted-foreground mb-8">
                {getText(
                  "Hali hech narsa qo'shilmagan",
                  "No items added yet",
                  "Товары еще не добавлены",
                  "Noch keine Artikel hinzugefügt"
                )}
              </p>
              <Button asChild>
                <Link to="/tours">
                  {getText("Turlarni ko'rish", "Browse Tours", "Просмотр туров", "Touren durchsuchen")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">
            {getText("Savat", "Shopping Cart", "Корзина", "Warenkorb")}
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{item.duration}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${item.price * item.quantity}</p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-muted-foreground">${item.price} each</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">
                    {getText("Jami", "Summary", "Итого", "Zusammenfassung")}
                  </h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {getText("Mahsulotlar", "Items", "Товары", "Artikel")}
                      </span>
                      <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>{getText("Jami", "Total", "Всего", "Gesamt")}</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                  <Button className="w-full" size="lg" asChild>
                    <Link to="/checkout">
                      {getText("Buyurtma berish", "Checkout", "Оформить заказ", "Zur Kasse")}
                    </Link>
                  </Button>
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
