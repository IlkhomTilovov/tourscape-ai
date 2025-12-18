import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Phone, Mail, MapPin, Clock, Instagram, MessageCircle, Send } from "lucide-react";

const AdminFooter = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    address_uz: "",
    address_en: "",
    address_ru: "",
    address_de: "",
    working_hours_weekday: "",
    working_hours_weekend: "",
    instagram_url: "",
    whatsapp_number: "",
    telegram_url: "",
  });

  const { data: footerContent, isLoading } = useQuery({
    queryKey: ["footer-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("footer_content")
        .select("*")
        .eq("id", "main")
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (footerContent) {
      setFormData({
        phone: footerContent.phone || "",
        email: footerContent.email || "",
        address_uz: footerContent.address_uz || "",
        address_en: footerContent.address_en || "",
        address_ru: footerContent.address_ru || "",
        address_de: footerContent.address_de || "",
        working_hours_weekday: footerContent.working_hours_weekday || "",
        working_hours_weekend: footerContent.working_hours_weekend || "",
        instagram_url: footerContent.instagram_url || "",
        whatsapp_number: footerContent.whatsapp_number || "",
        telegram_url: footerContent.telegram_url || "",
      });
    }
  }, [footerContent]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from("footer_content")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", "main");
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["footer-content"] });
      toast({
        title: "Muvaffaqiyatli",
        description: "Footer ma'lumotlari saqlandi",
      });
    },
    onError: (error) => {
      toast({
        title: "Xatolik",
        description: "Ma'lumotlarni saqlashda xatolik yuz berdi",
        variant: "destructive",
      });
      console.error("Error updating footer:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Footer boshqaruvi</h1>
        <p className="text-muted-foreground">Footer ma'lumotlarini tahrirlash</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Aloqa ma'lumotlari
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon raqami</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+998 93 284 71 17"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@bestour.uz"
              />
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Manzil (4 tilda)
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address_uz">Manzil (O'zbekcha)</Label>
              <Input
                id="address_uz"
                value={formData.address_uz}
                onChange={(e) => setFormData({ ...formData, address_uz: e.target.value })}
                placeholder="Toshkent shahri, O'zbekiston"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_en">Address (English)</Label>
              <Input
                id="address_en"
                value={formData.address_en}
                onChange={(e) => setFormData({ ...formData, address_en: e.target.value })}
                placeholder="Tashkent, Uzbekistan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_ru">Адрес (Русский)</Label>
              <Input
                id="address_ru"
                value={formData.address_ru}
                onChange={(e) => setFormData({ ...formData, address_ru: e.target.value })}
                placeholder="Ташкент, Узбекистан"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_de">Adresse (Deutsch)</Label>
              <Input
                id="address_de"
                value={formData.address_de}
                onChange={(e) => setFormData({ ...formData, address_de: e.target.value })}
                placeholder="Taschkent, Usbekistan"
              />
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Ish vaqti
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="working_hours_weekday">Du-Sha (Ish kunlari)</Label>
              <Input
                id="working_hours_weekday"
                value={formData.working_hours_weekday}
                onChange={(e) => setFormData({ ...formData, working_hours_weekday: e.target.value })}
                placeholder="09:00 - 18:00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="working_hours_weekend">Yakshanba (Dam olish)</Label>
              <Input
                id="working_hours_weekend"
                value={formData.working_hours_weekend}
                onChange={(e) => setFormData({ ...formData, working_hours_weekend: e.target.value })}
                placeholder="Dam olish"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Instagram className="h-5 w-5" />
              Ijtimoiy tarmoqlar
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instagram_url" className="flex items-center gap-2">
                <Instagram className="h-4 w-4" /> Instagram URL
              </Label>
              <Input
                id="instagram_url"
                value={formData.instagram_url}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                placeholder="https://www.instagram.com/bestour.uz"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp_number" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" /> WhatsApp raqami
              </Label>
              <Input
                id="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                placeholder="+998932847117"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telegram_url" className="flex items-center gap-2">
                <Send className="h-4 w-4" /> Telegram URL
              </Label>
              <Input
                id="telegram_url"
                value={formData.telegram_url}
                onChange={(e) => setFormData({ ...formData, telegram_url: e.target.value })}
                placeholder="https://t.me/sherzod_757"
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={updateMutation.isPending} className="w-full md:w-auto">
          {updateMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Saqlash
        </Button>
      </form>
    </div>
  );
};

export default AdminFooter;