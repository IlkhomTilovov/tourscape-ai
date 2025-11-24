import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Category = {
  id: string;
  name_en: string;
  name_uz: string;
  name_ru: string;
  name_de: string;
  icon: string | null;
};

type Tour = {
  id: string;
  title_en: string;
  title_uz: string;
  title_ru: string;
  title_de: string;
  duration: string;
  price: number;
  category_id: string | null;
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name_en: "",
    icon: "",
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    fetchTours();

    // Real-time updates for categories
    const categoriesChannel = supabase
      .channel('admin-categories-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        () => fetchCategories()
      )
      .subscribe();

    // Real-time updates for tours
    const toursChannel = supabase
      .channel('admin-tours-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tours' },
        () => fetchTours()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(categoriesChannel);
      supabase.removeChannel(toursChannel);
    };
  }, []);

  const fetchCategories = async () => {
    const { data, error, count } = await supabase
      .from("categories")
      .select("*", { count: 'exact' })
      .order("name_en", { ascending: true });
    
    if (error) {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
      console.error("Categories fetch error:", error);
    } else {
      setCategories(data || []);
      console.log(`Loaded ${data?.length} categories (total: ${count})`);
    }
  };

  const fetchTours = async () => {
    const { data, error } = await supabase
      .from("tours")
      .select("id, title_en, title_uz, title_ru, title_de, duration, price, category_id")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    } else {
      setTours(data || []);
    }
  };

  const getToursByCategory = (categoryId: string) => {
    return tours.filter(tour => tour.category_id === categoryId);
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
        icon: formData.icon || null,
      };
      
      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update(dataToSave)
          .eq("id", editingCategory.id);
        
        if (error) {
          toast({ title: "Xatolik", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Muvaffaqiyat", description: "Kategoriya yangilandi" });
          fetchCategories();
          handleClose();
        }
      } else {
        const { error } = await supabase.from("categories").insert([dataToSave]);
        
        if (error) {
          toast({ title: "Xatolik", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Muvaffaqiyat", description: "Kategoriya qo'shildi" });
          fetchCategories();
          handleClose();
        }
      }
    } catch (error: any) {
      toast({ title: "Xatolik", description: error.message || "Tarjima xatosi", variant: "destructive" });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name_en: category.name_en,
      icon: category.icon || "",
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    
    const { error } = await supabase.from("categories").delete().eq("id", id);
    
    if (error) {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Muvaffaqiyat", description: "Kategoriya o'chirildi" });
      fetchCategories();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(null);
    setFormData({
      name_en: "",
      icon: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Kategoriyalar va Turlar</h1>
          <p className="text-muted-foreground">
            {categories.length} ta kategoriya, {tours.length} ta tur
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingCategory(null); setFormData({ name_en: "", icon: "" }); }}>
              <Plus className="h-4 w-4 mr-2" />
              Yangi kategoriya
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nomi (Inglizcha)</Label>
                <Input 
                  value={formData.name_en} 
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} 
                  required 
                  placeholder="Kategoriya nomini kiriting" 
                />
                <p className="text-sm text-muted-foreground">Boshqa tillarga avtomatik tarjima qilinadi</p>
              </div>
              
              <div className="space-y-2">
                <Label>Icon (Lucide icon nomi)</Label>
                <Input 
                  value={formData.icon} 
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Compass, Map, Mountain..." 
                />
                <p className="text-sm text-muted-foreground">
                  Lucide icon nomlaridan foydalaning (masalan: Compass, Map, Mountain)
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Bekor qilish
                </Button>
                <Button type="submit" disabled={isTranslating}>
                  {isTranslating ? "Tarjima qilinmoqda..." : editingCategory ? "Yangilash" : "Qo'shish"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kategoriyalar va ularga tegishli turlar</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Kategoriyalar topilmadi</p>
          ) : (
            <Accordion type="multiple" defaultValue={categories.map(c => c.id)} className="space-y-2">
              {categories.map((category) => {
                const categoryTours = getToursByCategory(category.id);
                return (
                  <AccordionItem key={category.id} value={category.id} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-3">
                          <div className="font-semibold">{category.name_en}</div>
                          <div className="text-sm text-muted-foreground">
                            ({categoryTours.length} ta tur)
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(category);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(category.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">O'zbekcha:</span> {category.name_uz}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Ruscha:</span> {category.name_ru}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Nemischa:</span> {category.name_de}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Icon:</span> {category.icon || "-"}
                          </div>
                        </div>

                        {categoryTours.length > 0 ? (
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground uppercase">Turlar:</h4>
                            <div className="space-y-2">
                              {categoryTours.map((tour) => (
                                <div 
                                  key={tour.id} 
                                  className="bg-muted/50 p-3 rounded-lg space-y-1"
                                >
                                  <div className="font-medium">{tour.title_en}</div>
                                  <div className="text-sm text-muted-foreground">
                                    Davomiyligi: {tour.duration} • Narxi: ${tour.price}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            Bu kategoriyada turlar yo'q
                          </p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Categories;
