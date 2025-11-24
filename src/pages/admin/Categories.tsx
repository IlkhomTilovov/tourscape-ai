import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Edit, Trash2, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Destination = {
  id: string;
  name_en: string;
  name_uz: string;
  name_ru: string;
  name_de: string;
  description_en: string | null;
  description_uz: string | null;
  description_ru: string | null;
  description_de: string | null;
  image_url: string | null;
  country: string;
  category: string | null;
};

type Tour = {
  id: string;
  title_en: string;
  title_uz: string;
  price: number;
  duration: string;
  destination_id: string;
};

const Categories = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [open, setOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [formData, setFormData] = useState({
    name_en: "",
    description_en: "",
    image_url: "",
    country: "",
    category: "",
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDestinations();
    fetchTours();
  }, []);

  const fetchDestinations = async () => {
    const { data, error } = await supabase.from("destinations").select("*").order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    } else {
      setDestinations(data || []);
    }
  };

  const fetchTours = async () => {
    const { data, error } = await supabase.from("tours").select("id, title_en, title_uz, price, duration, destination_id");
    if (error) {
      console.error("Tours fetch error:", error);
    } else {
      setTours(data || []);
    }
  };

  const getToursForDestination = (destinationId: string) => {
    return tours.filter(tour => tour.destination_id === destinationId);
  };

  const getCategoryName = (category: string | null) => {
    const categories: Record<string, string> = {
      regions: "Viloyatlar bo'yicha",
      cities: "Shaharlar bo'yicha",
      city: "Shaharlar bo'yicha",
      nature: "Tabiiy yo'nalishlar",
      cultural: "Madaniy yo'nalishlar",
      eco_tourism: "Eko-turizm",
      health_spa: "Sog'lomlashtirish va SPA",
      seasonal: "Mavsumiy yo'nalishlar",
      thematic: "Tematik yo'nalishlar",
      events: "Mahalliy tadbirlar",
      other: "Boshqa"
    };
    return category ? categories[category] || category : "Boshqa";
  };

  const groupedDestinations = destinations.reduce((acc, dest) => {
    const cat = dest.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(dest);
    return acc;
  }, {} as Record<string, Destination[]>);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Xatolik", description: "Rasm hajmi 5MB dan kichik bo'lishi kerak", variant: "destructive" });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({ title: "Xatolik", description: "Faqat rasm fayllarini yuklash mumkin", variant: "destructive" });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `destinations/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('tour-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('tour-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      toast({ title: "Muvaffaqiyat", description: "Rasm yuklandi" });
    } catch (error: any) {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTranslating(true);

    try {
      const { data: nameTranslations, error: nameError } = await supabase.functions.invoke('translate', {
        body: { 
          text: formData.name_en,
          targetLanguages: ['Uzbek', 'Russian', 'German']
        }
      });

      if (nameError) throw nameError;

      let descTranslations = { Uzbek: '', Russian: '', German: '' };
      if (formData.description_en) {
        const { data: descData, error: descError } = await supabase.functions.invoke('translate', {
          body: { 
            text: formData.description_en,
            targetLanguages: ['Uzbek', 'Russian', 'German']
          }
        });
        if (descError) throw descError;
        descTranslations = descData.translations;
      }

      const dataToSave = {
        name_en: formData.name_en,
        name_uz: nameTranslations.translations.Uzbek,
        name_ru: nameTranslations.translations.Russian,
        name_de: nameTranslations.translations.German,
        description_en: formData.description_en || null,
        description_uz: descTranslations.Uzbek || null,
        description_ru: descTranslations.Russian || null,
        description_de: descTranslations.German || null,
        image_url: formData.image_url || null,
        country: formData.country,
        category: formData.category || null,
      };
      
      if (editingDestination) {
        const { error } = await supabase
          .from("destinations")
          .update(dataToSave)
          .eq("id", editingDestination.id);
        
        if (error) {
          toast({ title: "Xatolik", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Muvaffaqiyat", description: "Manzil yangilandi" });
          fetchDestinations();
          handleClose();
        }
      } else {
        const { error } = await supabase.from("destinations").insert([dataToSave]);
        
        if (error) {
          toast({ title: "Xatolik", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Muvaffaqiyat", description: "Manzil qo'shildi" });
          fetchDestinations();
          handleClose();
        }
      }
    } catch (error: any) {
      toast({ title: "Xatolik", description: error.message || "Tarjima xatosi", variant: "destructive" });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleEdit = (destination: Destination) => {
    setEditingDestination(destination);
    setFormData({
      name_en: destination.name_en,
      description_en: destination.description_en || "",
      image_url: destination.image_url || "",
      country: destination.country,
      category: destination.category || "",
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    
    const { error } = await supabase.from("destinations").delete().eq("id", id);
    
    if (error) {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Muvaffaqiyat", description: "Manzil o'chirildi" });
      fetchDestinations();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingDestination(null);
    setFormData({
      name_en: "",
      description_en: "",
      image_url: "",
      country: "",
      category: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Kategoriyalar</h1>
          <p className="text-muted-foreground">Kategoriyalarni boshqarish</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingDestination(null); setFormData({ name_en: "", description_en: "", image_url: "", country: "", category: "" }); }}>
              <Plus className="h-4 w-4 mr-2" />
              Yangi qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDestination ? "Manzilni tahrirlash" : "Yangi manzil"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nomi (Inglizcha)</Label>
                <Input value={formData.name_en} onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} required placeholder="Manzil nomini kiriting" />
                <p className="text-sm text-muted-foreground">Boshqa tillarga avtomatik tarjima qilinadi</p>
              </div>
              
              <div className="space-y-2">
                <Label>Mamlakat</Label>
                <Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} required />
              </div>

              <div className="space-y-2">
                <Label>Kategoriya</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regions">Viloyatlar bo'yicha</SelectItem>
                    <SelectItem value="cities">Shaharlar bo'yicha</SelectItem>
                    <SelectItem value="nature">Tabiiy yo'nalishlar</SelectItem>
                    <SelectItem value="cultural">Madaniy yo'nalishlar</SelectItem>
                    <SelectItem value="eco_tourism">Eko-turizm</SelectItem>
                    <SelectItem value="health_spa">Sog'lomlashtirish va SPA</SelectItem>
                    <SelectItem value="seasonal">Mavsumiy yo'nalishlar</SelectItem>
                    <SelectItem value="thematic">Tematik yo'nalishlar</SelectItem>
                    <SelectItem value="events">Mahalliy tadbirlar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Rasm yuklash</Label>
                <div className="flex items-center gap-4">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="cursor-pointer"
                  />
                  {isUploading && <span className="text-sm text-muted-foreground">Yuklanmoqda...</span>}
                </div>
                {formData.image_url && (
                  <div className="mt-2">
                    <img src={formData.image_url} alt="Preview" className="h-32 w-auto rounded-lg object-cover border" />
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Label className="text-sm text-muted-foreground">yoki URL kiriting:</Label>
                  <Input 
                    value={formData.image_url} 
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tavsif (Inglizcha)</Label>
                <Textarea value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} rows={3} placeholder="Manzil tavsifini kiriting" />
                <p className="text-sm text-muted-foreground">Boshqa tillarga avtomatik tarjima qilinadi</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>Bekor qilish</Button>
                <Button type="submit" disabled={isTranslating}>{isTranslating ? "Tarjima qilinmoqda..." : editingDestination ? "Yangilash" : "Qo'shish"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Barcha manzillar ({destinations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {destinations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Hech qanday manzil topilmadi</p>
          ) : (
            <Accordion type="multiple" className="w-full space-y-4" defaultValue={Object.keys(groupedDestinations)}>
              {Object.entries(groupedDestinations).map(([category, categoryDestinations]) => (
                <AccordionItem key={category} value={category} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span className="text-lg font-semibold">{getCategoryName(category)}</span>
                      <span className="text-sm text-muted-foreground">
                        {categoryDestinations.length} manzil
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      {categoryDestinations.map((destination) => {
                        const destinationTours = getToursForDestination(destination.id);
                        return (
                          <Card key={destination.id} className="border-l-4 border-l-primary">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex gap-4 flex-1">
                                  {destination.image_url ? (
                                    <img 
                                      src={destination.image_url} 
                                      alt={destination.name_en}
                                      className="h-20 w-32 object-cover rounded border"
                                    />
                                  ) : (
                                    <div className="h-20 w-32 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground">
                                      Rasm yo'q
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{destination.name_en}</h3>
                                    <p className="text-sm text-muted-foreground">{destination.name_uz}</p>
                                    <p className="text-sm mt-1">
                                      <span className="font-medium">Mamlakat:</span> {destination.country}
                                    </p>
                                    {destinationTours.length > 0 && (
                                      <p className="text-sm text-primary mt-1">
                                        {destinationTours.length} ta tur
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleEdit(destination)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => handleDelete(destination.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            {destinationTours.length > 0 && (
                              <CardContent className="pt-0">
                                <div className="border-t pt-3">
                                  <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Turlar:</h4>
                                  <div className="space-y-2">
                                    {destinationTours.map((tour) => (
                                      <div key={tour.id} className="flex items-center justify-between bg-muted/50 p-3 rounded">
                                        <div>
                                          <p className="font-medium text-sm">{tour.title_en}</p>
                                          <p className="text-xs text-muted-foreground">{tour.title_uz}</p>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-semibold text-primary">${tour.price}</p>
                                          <p className="text-xs text-muted-foreground">{tour.duration} kun</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </CardContent>
                            )}
                          </Card>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Categories;
