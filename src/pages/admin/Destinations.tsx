import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  country: string;
  image_url: string | null;
  category_id: string | null;
};

type Category = {
  id: string;
  name_en: string;
};

const Destinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [formData, setFormData] = useState({
    name_en: "",
    country: "",
    image_url: "",
    category_id: "",
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDestinations();
    fetchCategories();

    // Real-time updates for destinations
    const destinationsChannel = supabase
      .channel('admin-destinations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'destinations' },
        () => fetchDestinations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(destinationsChannel);
    };
  }, []);

  const fetchDestinations = async () => {
    const { data, error, count } = await supabase
      .from("destinations")
      .select("*", { count: 'exact' })
      .order("name_en", { ascending: true });
    
    if (error) {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
      console.error("Destinations fetch error:", error);
    } else {
      setDestinations(data || []);
      console.log(`Loaded ${data?.length} destinations (total: ${count})`);
    }
  };

  const fetchCategories = async () => {
    const { data, error, count } = await supabase
      .from("categories")
      .select("id, name_en", { count: 'exact' })
      .order("name_en", { ascending: true });
    
    if (error) {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
      console.error("Categories fetch error:", error);
    } else {
      setCategories(data || []);
      console.log(`Loaded ${data?.length} categories (total: ${count})`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTranslating(true);

    try {
      const { data: translations, error: translationError } = await supabase.functions.invoke('translate', {
        body: { 
          text: formData.name_en,
          targetLanguages: ['Uzbek', 'Russian', 'German']
        }
      });

      if (translationError) throw translationError;

      const dataToSave = {
        name_en: formData.name_en,
        name_uz: translations.translations.Uzbek,
        name_ru: translations.translations.Russian,
        name_de: translations.translations.German,
        country: formData.country,
        image_url: formData.image_url || null,
        category_id: formData.category_id || null,
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
      country: destination.country,
      image_url: destination.image_url || "",
      category_id: destination.category_id || "",
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
      country: "",
      image_url: "",
      category_id: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manzillar</h1>
          <p className="text-muted-foreground">
            {destinations.length} ta manzil
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingDestination(null); setFormData({ name_en: "", country: "", image_url: "", category_id: "" }); }}>
              <Plus className="h-4 w-4 mr-2" />
              Yangi manzil
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingDestination ? "Manzilni tahrirlash" : "Yangi manzil"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nomi (Inglizcha)</Label>
                <Input 
                  value={formData.name_en} 
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} 
                  required 
                  placeholder="Manzil nomini kiriting" 
                />
                <p className="text-sm text-muted-foreground">Boshqa tillarga avtomatik tarjima qilinadi</p>
              </div>

              <div className="space-y-2">
                <Label>Mamlakat</Label>
                <Input 
                  value={formData.country} 
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })} 
                  required 
                  placeholder="Mamlakat nomini kiriting" 
                />
              </div>

              <div className="space-y-2">
                <Label>Kategoriya</Label>
                <Select 
                  value={formData.category_id} 
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategoriya tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Rasm URL</Label>
                <Input 
                  value={formData.image_url} 
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg" 
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Bekor qilish
                </Button>
                <Button type="submit" disabled={isTranslating}>
                  {isTranslating ? "Tarjima qilinmoqda..." : editingDestination ? "Yangilash" : "Qo'shish"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Barcha manzillar</CardTitle>
        </CardHeader>
        <CardContent>
          {destinations.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Manzillar topilmadi</p>
          ) : (
            <div className="space-y-4">
              {destinations.map((destination) => (
                <div key={destination.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {destination.image_url && (
                          <img 
                            src={destination.image_url} 
                            alt={destination.name_en}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-lg">{destination.name_en}</h3>
                          <p className="text-sm text-muted-foreground">{destination.country}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">O'zbekcha:</span> {destination.name_uz}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Ruscha:</span> {destination.name_ru}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Nemischa:</span> {destination.name_de}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Kategoriya:</span> {destination.category_id || "-"}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(destination)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(destination.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Destinations;
