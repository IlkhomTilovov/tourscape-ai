import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Save, Image as ImageIcon } from "lucide-react";

interface HomepageContent {
  id: string;
  hero_title_en: string;
  hero_title_uz: string;
  hero_title_ru: string;
  hero_title_de: string;
  hero_subtitle_en: string;
  hero_subtitle_uz: string;
  hero_subtitle_ru: string;
  hero_subtitle_de: string;
  hero_image_url: string | null;
  stats_title_en: string;
  stats_title_uz: string;
  stats_title_ru: string;
  stats_title_de: string;
  stats_subtitle_en: string;
  stats_subtitle_uz: string;
  stats_subtitle_ru: string;
  stats_subtitle_de: string;
  stat1_value: string;
  stat1_label_en: string;
  stat1_label_uz: string;
  stat1_label_ru: string;
  stat1_label_de: string;
  stat2_value: string;
  stat2_label_en: string;
  stat2_label_uz: string;
  stat2_label_ru: string;
  stat2_label_de: string;
  stat3_value: string;
  stat3_label_en: string;
  stat3_label_uz: string;
  stat3_label_ru: string;
  stat3_label_de: string;
}

const AdminHomepage = () => {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from("homepage_content")
      .select("*")
      .eq("id", "main")
      .single();

    if (error) {
      console.error("Error fetching homepage content:", error);
      toast.error("Xatolik yuz berdi");
    } else if (data) {
      setContent(data as unknown as HomepageContent);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!content) return;

    setSaving(true);
    const { error } = await supabase
      .from("homepage_content")
      .update(content)
      .eq("id", "main");

    if (error) {
      console.error("Error saving:", error);
      toast.error("Saqlashda xatolik yuz berdi");
    } else {
      toast.success("Muvaffaqiyatli saqlandi!");
    }
    setSaving(false);
  };

  const updateField = (field: keyof HomepageContent, value: string) => {
    if (!content) return;
    setContent({ ...content, [field]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!content) {
    return <div>Ma'lumot topilmadi</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bosh Sahifa Sozlamalari</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Saqlash
        </Button>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Hero Bo'limi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Hero Rasm URL</Label>
            <Input
              value={content.hero_image_url || ""}
              onChange={(e) => updateField("hero_image_url", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <Tabs defaultValue="uz" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="uz">O'zbek</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ru">Русский</TabsTrigger>
              <TabsTrigger value="de">Deutsch</TabsTrigger>
            </TabsList>

            <TabsContent value="uz" className="space-y-4">
              <div>
                <Label>Sarlavha (UZ)</Label>
                <Input
                  value={content.hero_title_uz}
                  onChange={(e) => updateField("hero_title_uz", e.target.value)}
                />
              </div>
              <div>
                <Label>Qo'shimcha matn (UZ)</Label>
                <Textarea
                  value={content.hero_subtitle_uz}
                  onChange={(e) => updateField("hero_subtitle_uz", e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="en" className="space-y-4">
              <div>
                <Label>Title (EN)</Label>
                <Input
                  value={content.hero_title_en}
                  onChange={(e) => updateField("hero_title_en", e.target.value)}
                />
              </div>
              <div>
                <Label>Subtitle (EN)</Label>
                <Textarea
                  value={content.hero_subtitle_en}
                  onChange={(e) => updateField("hero_subtitle_en", e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="ru" className="space-y-4">
              <div>
                <Label>Заголовок (RU)</Label>
                <Input
                  value={content.hero_title_ru}
                  onChange={(e) => updateField("hero_title_ru", e.target.value)}
                />
              </div>
              <div>
                <Label>Подзаголовок (RU)</Label>
                <Textarea
                  value={content.hero_subtitle_ru}
                  onChange={(e) => updateField("hero_subtitle_ru", e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="de" className="space-y-4">
              <div>
                <Label>Überschrift (DE)</Label>
                <Input
                  value={content.hero_title_de}
                  onChange={(e) => updateField("hero_title_de", e.target.value)}
                />
              </div>
              <div>
                <Label>Untertitel (DE)</Label>
                <Textarea
                  value={content.hero_subtitle_de}
                  onChange={(e) => updateField("hero_subtitle_de", e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <Card>
        <CardHeader>
          <CardTitle>Statistika Bo'limi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="uz" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="uz">O'zbek</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ru">Русский</TabsTrigger>
              <TabsTrigger value="de">Deutsch</TabsTrigger>
            </TabsList>

            <TabsContent value="uz" className="space-y-4">
              <div>
                <Label>Sarlavha (UZ)</Label>
                <Input
                  value={content.stats_title_uz}
                  onChange={(e) => updateField("stats_title_uz", e.target.value)}
                />
              </div>
              <div>
                <Label>Qo'shimcha matn (UZ)</Label>
                <Textarea
                  value={content.stats_subtitle_uz}
                  onChange={(e) => updateField("stats_subtitle_uz", e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="en" className="space-y-4">
              <div>
                <Label>Title (EN)</Label>
                <Input
                  value={content.stats_title_en}
                  onChange={(e) => updateField("stats_title_en", e.target.value)}
                />
              </div>
              <div>
                <Label>Subtitle (EN)</Label>
                <Textarea
                  value={content.stats_subtitle_en}
                  onChange={(e) => updateField("stats_subtitle_en", e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="ru" className="space-y-4">
              <div>
                <Label>Заголовок (RU)</Label>
                <Input
                  value={content.stats_title_ru}
                  onChange={(e) => updateField("stats_title_ru", e.target.value)}
                />
              </div>
              <div>
                <Label>Подзаголовок (RU)</Label>
                <Textarea
                  value={content.stats_subtitle_ru}
                  onChange={(e) => updateField("stats_subtitle_ru", e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="de" className="space-y-4">
              <div>
                <Label>Überschrift (DE)</Label>
                <Input
                  value={content.stats_title_de}
                  onChange={(e) => updateField("stats_title_de", e.target.value)}
                />
              </div>
              <div>
                <Label>Untertitel (DE)</Label>
                <Textarea
                  value={content.stats_subtitle_de}
                  onChange={(e) => updateField("stats_subtitle_de", e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Stats Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label>Statistika 1 Qiymati</Label>
              <Input
                value={content.stat1_value}
                onChange={(e) => updateField("stat1_value", e.target.value)}
                placeholder="15M+"
              />
              <Tabs defaultValue="uz" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="uz">UZ</TabsTrigger>
                  <TabsTrigger value="en">EN</TabsTrigger>
                  <TabsTrigger value="ru">RU</TabsTrigger>
                  <TabsTrigger value="de">DE</TabsTrigger>
                </TabsList>
                <TabsContent value="uz">
                  <Input
                    value={content.stat1_label_uz}
                    onChange={(e) => updateField("stat1_label_uz", e.target.value)}
                    placeholder="Mamnun mijozlar"
                  />
                </TabsContent>
                <TabsContent value="en">
                  <Input
                    value={content.stat1_label_en}
                    onChange={(e) => updateField("stat1_label_en", e.target.value)}
                    placeholder="Happy Customers"
                  />
                </TabsContent>
                <TabsContent value="ru">
                  <Input
                    value={content.stat1_label_ru}
                    onChange={(e) => updateField("stat1_label_ru", e.target.value)}
                    placeholder="Довольных клиентов"
                  />
                </TabsContent>
                <TabsContent value="de">
                  <Input
                    value={content.stat1_label_de}
                    onChange={(e) => updateField("stat1_label_de", e.target.value)}
                    placeholder="Zufriedene Kunden"
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label>Statistika 2 Qiymati</Label>
              <Input
                value={content.stat2_value}
                onChange={(e) => updateField("stat2_value", e.target.value)}
                placeholder="500K+"
              />
              <Tabs defaultValue="uz" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="uz">UZ</TabsTrigger>
                  <TabsTrigger value="en">EN</TabsTrigger>
                  <TabsTrigger value="ru">RU</TabsTrigger>
                  <TabsTrigger value="de">DE</TabsTrigger>
                </TabsList>
                <TabsContent value="uz">
                  <Input
                    value={content.stat2_label_uz}
                    onChange={(e) => updateField("stat2_label_uz", e.target.value)}
                    placeholder="Tajribalar"
                  />
                </TabsContent>
                <TabsContent value="en">
                  <Input
                    value={content.stat2_label_en}
                    onChange={(e) => updateField("stat2_label_en", e.target.value)}
                    placeholder="Experiences"
                  />
                </TabsContent>
                <TabsContent value="ru">
                  <Input
                    value={content.stat2_label_ru}
                    onChange={(e) => updateField("stat2_label_ru", e.target.value)}
                    placeholder="Впечатлений"
                  />
                </TabsContent>
                <TabsContent value="de">
                  <Input
                    value={content.stat2_label_de}
                    onChange={(e) => updateField("stat2_label_de", e.target.value)}
                    placeholder="Erlebnisse"
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label>Statistika 3 Qiymati</Label>
              <Input
                value={content.stat3_value}
                onChange={(e) => updateField("stat3_value", e.target.value)}
                placeholder="180+"
              />
              <Tabs defaultValue="uz" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="uz">UZ</TabsTrigger>
                  <TabsTrigger value="en">EN</TabsTrigger>
                  <TabsTrigger value="ru">RU</TabsTrigger>
                  <TabsTrigger value="de">DE</TabsTrigger>
                </TabsList>
                <TabsContent value="uz">
                  <Input
                    value={content.stat3_label_uz}
                    onChange={(e) => updateField("stat3_label_uz", e.target.value)}
                    placeholder="Mamlakatlar"
                  />
                </TabsContent>
                <TabsContent value="en">
                  <Input
                    value={content.stat3_label_en}
                    onChange={(e) => updateField("stat3_label_en", e.target.value)}
                    placeholder="Countries"
                  />
                </TabsContent>
                <TabsContent value="ru">
                  <Input
                    value={content.stat3_label_ru}
                    onChange={(e) => updateField("stat3_label_ru", e.target.value)}
                    placeholder="Стран"
                  />
                </TabsContent>
                <TabsContent value="de">
                  <Input
                    value={content.stat3_label_de}
                    onChange={(e) => updateField("stat3_label_de", e.target.value)}
                    placeholder="Länder"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHomepage;