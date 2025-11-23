import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Tour = {
  id: string;
  title_en: string;
  title_uz: string;
  title_ru: string;
  title_de: string;
  description_en: string | null;
  description_uz: string | null;
  description_ru: string | null;
  description_de: string | null;
  price: number;
  duration: string;
  image_url: string | null;
  rating: number;
  reviews_count: number;
  is_bestseller: boolean;
  category_id: string | null;
  destination_id: string | null;
};

type Category = { id: string; name_en: string; };
type Destination = { id: string; name_en: string; };

const Tours = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [open, setOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [formData, setFormData] = useState({
    title_en: "",
    description_en: "",
    price: "",
    duration: "",
    image_url: "",
    rating: "0",
    reviews_count: "0",
    is_bestseller: false,
    category_id: "",
    destination_id: "",
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTours();
    fetchCategories();
    fetchDestinations();
  }, []);

  const fetchTours = async () => {
    const { data, error } = await supabase.from("tours").select("*").order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    } else {
      setTours(data || []);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("id, name_en");
    setCategories(data || []);
  };

  const fetchDestinations = async () => {
    const { data } = await supabase.from("destinations").select("id, name_en");
    setDestinations(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTranslating(true);

    try {
      const { data: titleTranslations, error: titleError } = await supabase.functions.invoke('translate', {
        body: { 
          text: formData.title_en,
          targetLanguages: ['Uzbek', 'Russian', 'German']
        }
      });

      if (titleError) throw titleError;

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

      const tourData = {
        title_en: formData.title_en,
        title_uz: titleTranslations.translations.Uzbek,
        title_ru: titleTranslations.translations.Russian,
        title_de: titleTranslations.translations.German,
        description_en: formData.description_en || null,
        description_uz: descTranslations.Uzbek || null,
        description_ru: descTranslations.Russian || null,
        description_de: descTranslations.German || null,
        price: parseFloat(formData.price),
        duration: formData.duration,
        image_url: formData.image_url || null,
        rating: parseFloat(formData.rating),
        reviews_count: parseInt(formData.reviews_count),
        is_bestseller: formData.is_bestseller,
        category_id: formData.category_id || null,
        destination_id: formData.destination_id || null,
      };

      if (editingTour) {
        const { error } = await supabase
          .from("tours")
          .update(tourData)
          .eq("id", editingTour.id);
        
        if (error) {
          toast({ title: "Xatolik", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Muvaffaqiyat", description: "Tur yangilandi" });
          fetchTours();
          handleClose();
        }
      } else {
        const { error } = await supabase.from("tours").insert([tourData]);
        
        if (error) {
          toast({ title: "Xatolik", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Muvaffaqiyat", description: "Tur qo'shildi" });
          fetchTours();
          handleClose();
        }
      }
    } catch (error: any) {
      toast({ title: "Xatolik", description: error.message || "Tarjima xatosi", variant: "destructive" });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleEdit = (tour: Tour) => {
    setEditingTour(tour);
    setFormData({
      title_en: tour.title_en,
      description_en: tour.description_en || "",
      price: tour.price.toString(),
      duration: tour.duration,
      image_url: tour.image_url || "",
      rating: tour.rating.toString(),
      reviews_count: tour.reviews_count.toString(),
      is_bestseller: tour.is_bestseller,
      category_id: tour.category_id || "",
      destination_id: tour.destination_id || "",
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    
    const { error } = await supabase.from("tours").delete().eq("id", id);
    
    if (error) {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Muvaffaqiyat", description: "Tur o'chirildi" });
      fetchTours();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTour(null);
    setFormData({
      title_en: "",
      description_en: "",
      price: "",
      duration: "",
      image_url: "",
      rating: "0",
      reviews_count: "0",
      is_bestseller: false,
      category_id: "",
      destination_id: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Turlar</h1>
          <p className="text-muted-foreground">Turlarni boshqarish</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingTour(null); handleClose(); }}>
              <Plus className="h-4 w-4 mr-2" />
              Yangi qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTour ? "Turni tahrirlash" : "Yangi tur"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nomi (Inglizcha)</Label>
                <Input value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} required placeholder="Tur nomini kiriting" />
                <p className="text-sm text-muted-foreground">Boshqa tillarga avtomatik tarjima qilinadi</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Narx ($)</Label>
                  <Input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Davomiyligi</Label>
                  <Input value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="2 hours" required />
                </div>
                <div className="space-y-2">
                  <Label>Reyting (0-5)</Label>
                  <Input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kategoriya</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Kategoriya tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name_en}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Manzil</Label>
                  <Select value={formData.destination_id} onValueChange={(value) => setFormData({ ...formData, destination_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Manzil tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations.map((dest) => (
                        <SelectItem key={dest.id} value={dest.id}>{dest.name_en}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Rasm URL</Label>
                <Input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="bestseller" 
                  checked={formData.is_bestseller}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_bestseller: checked as boolean })}
                />
                <Label htmlFor="bestseller" className="cursor-pointer">Bestseller</Label>
              </div>

              <div className="space-y-2">
                <Label>Tavsif (Inglizcha)</Label>
                <Textarea value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} rows={3} placeholder="Tur tavsifini kiriting" />
                <p className="text-sm text-muted-foreground">Boshqa tillarga avtomatik tarjima qilinadi</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>Bekor qilish</Button>
                <Button type="submit" disabled={isTranslating}>{isTranslating ? "Tarjima qilinmoqda..." : editingTour ? "Yangilash" : "Qo'shish"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Barcha turlar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Inglizcha</TableHead>
                <TableHead>O'zbekcha</TableHead>
                <TableHead>Narx</TableHead>
                <TableHead>Davomiyligi</TableHead>
                <TableHead>Reyting</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tours.map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell>{tour.title_en}</TableCell>
                  <TableCell>{tour.title_uz}</TableCell>
                  <TableCell>${tour.price}</TableCell>
                  <TableCell>{tour.duration}</TableCell>
                  <TableCell>{tour.rating} ⭐</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(tour)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(tour.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tours;
