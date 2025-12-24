import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Globe, Award, Shield } from "lucide-react";

const AdminAbout = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mission: "",
    vision: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    // Statistics
    stat1_value: "10K+",
    stat1_label_uz: "Mijozlar",
    stat1_label_en: "Customers",
    stat1_label_ru: "Клиентов",
    stat1_label_de: "Kunden",
    stat2_value: "50+",
    stat2_label_uz: "Yo'nalishlar",
    stat2_label_en: "Destinations",
    stat2_label_ru: "Направлений",
    stat2_label_de: "Ziele",
    stat3_value: "15+",
    stat3_label_uz: "Yil tajriba",
    stat3_label_en: "Years Experience",
    stat3_label_ru: "Лет опыта",
    stat3_label_de: "Jahre Erfahrung",
    stat4_value: "100%",
    stat4_label_uz: "Ishonch",
    stat4_label_en: "Trust",
    stat4_label_ru: "Доверие",
    stat4_label_de: "Vertrauen",
  });
  const [loading, setLoading] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const { data, error } = await supabase
        .from("about")
        .select("*")
        .eq("id", "main")
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error("About fetch error:", error);
        throw error;
      }
      
      console.log("About data loaded:", data ? "exists with id: " + data.id : "not found");
      
      if (data) {
        setExistingId(data.id);
        setFormData({
          title: data.title || "",
          description: data.description || "",
          mission: data.mission || "",
          vision: data.vision || "",
          contact_email: data.contact_email || "",
          contact_phone: data.contact_phone || "",
          address: data.address || "",
          // Statistics
          stat1_value: data.stat1_value || "10K+",
          stat1_label_uz: data.stat1_label_uz || "Mijozlar",
          stat1_label_en: data.stat1_label_en || "Customers",
          stat1_label_ru: data.stat1_label_ru || "Клиентов",
          stat1_label_de: data.stat1_label_de || "Kunden",
          stat2_value: data.stat2_value || "50+",
          stat2_label_uz: data.stat2_label_uz || "Yo'nalishlar",
          stat2_label_en: data.stat2_label_en || "Destinations",
          stat2_label_ru: data.stat2_label_ru || "Направлений",
          stat2_label_de: data.stat2_label_de || "Ziele",
          stat3_value: data.stat3_value || "15+",
          stat3_label_uz: data.stat3_label_uz || "Yil tajriba",
          stat3_label_en: data.stat3_label_en || "Years Experience",
          stat3_label_ru: data.stat3_label_ru || "Лет опыта",
          stat3_label_de: data.stat3_label_de || "Jahre Erfahrung",
          stat4_value: data.stat4_value || "100%",
          stat4_label_uz: data.stat4_label_uz || "Ishonch",
          stat4_label_en: data.stat4_label_en || "Trust",
          stat4_label_ru: data.stat4_label_ru || "Доверие",
          stat4_label_de: data.stat4_label_de || "Vertrauen",
        });
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (existingId) {
        const { error } = await supabase
          .from("about")
          .update(formData)
          .eq("id", existingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("about")
          .insert([{ ...formData, id: "main" }]);
        if (error) throw error;
        setExistingId("main");
      }
      
      toast.success("Ma'lumot yangilandi");
    } catch (error) {
      console.error("Error saving about data:", error);
      toast.error("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const statIcons = [Users, Globe, Award, Shield];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">About Ma'lumotlari</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Asosiy Ma'lumotlar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Sarlavha</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Ta'rif</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mission">Missiya</Label>
              <Textarea
                id="mission"
                value={formData.mission}
                onChange={(e) =>
                  setFormData({ ...formData, mission: e.target.value })
                }
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vision">Vizion</Label>
              <Textarea
                id="vision"
                value={formData.vision}
                onChange={(e) =>
                  setFormData({ ...formData, vision: e.target.value })
                }
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Statistika</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3, 4].map((num) => {
              const Icon = statIcons[num - 1];
              return (
                <div key={num} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">Statistika {num}</span>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-3">
                    <div className="space-y-2">
                      <Label>Qiymat</Label>
                      <Input
                        value={formData[`stat${num}_value` as keyof typeof formData]}
                        onChange={(e) =>
                          setFormData({ ...formData, [`stat${num}_value`]: e.target.value })
                        }
                        placeholder="10K+"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>UZ</Label>
                      <Input
                        value={formData[`stat${num}_label_uz` as keyof typeof formData]}
                        onChange={(e) =>
                          setFormData({ ...formData, [`stat${num}_label_uz`]: e.target.value })
                        }
                        placeholder="O'zbekcha"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>EN</Label>
                      <Input
                        value={formData[`stat${num}_label_en` as keyof typeof formData]}
                        onChange={(e) =>
                          setFormData({ ...formData, [`stat${num}_label_en`]: e.target.value })
                        }
                        placeholder="English"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>RU</Label>
                      <Input
                        value={formData[`stat${num}_label_ru` as keyof typeof formData]}
                        onChange={(e) =>
                          setFormData({ ...formData, [`stat${num}_label_ru`]: e.target.value })
                        }
                        placeholder="Русский"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>DE</Label>
                      <Input
                        value={formData[`stat${num}_label_de` as keyof typeof formData]}
                        onChange={(e) =>
                          setFormData({ ...formData, [`stat${num}_label_de`]: e.target.value })
                        }
                        placeholder="Deutsch"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Bog'lanish Ma'lumotlari</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_email">Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Telefon</Label>
                <Input
                  id="contact_phone"
                  value={formData.contact_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Manzil</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={loading} size="lg">
          {loading ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </form>
    </div>
  );
};

export default AdminAbout;