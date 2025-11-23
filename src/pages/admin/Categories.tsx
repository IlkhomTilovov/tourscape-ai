import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
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
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*").order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    } else {
      setCategories(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTranslating(true);

    try {
      const { data: translationData, error: translationError } = await supabase.functions.invoke('translate', {
        body: { 
          text: formData.name_en,
          targetLanguages: ['Uzbek', 'Russian', 'German']
        }
      });

      if (translationError) throw translationError;

      const dataToSave = {
        name_en: formData.name_en,
        name_uz: translationData.translations.Uzbek,
        name_ru: translationData.translations.Russian,
        name_de: translationData.translations.German,
        icon: formData.icon,
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
    setFormData({ name_en: "", icon: "" });
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
            <Button onClick={() => { setEditingCategory(null); setFormData({ name_en: "", icon: "" }); }}>
              <Plus className="h-4 w-4 mr-2" />
              Yangi qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name_en">Nomi (Inglizcha)</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  required
                  placeholder="Kategoriya nomini kiriting"
                />
                <p className="text-sm text-muted-foreground">Boshqa tillarga avtomatik tarjima qilinadi</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Ikonka (lucide icon nomi)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="MapPin"
                />
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
          <CardTitle>Barcha kategoriyalar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Inglizcha</TableHead>
                <TableHead>O'zbekcha</TableHead>
                <TableHead>Ruscha</TableHead>
                <TableHead>Nemischa</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name_en}</TableCell>
                  <TableCell>{category.name_uz}</TableCell>
                  <TableCell>{category.name_ru}</TableCell>
                  <TableCell>{category.name_de}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(category.id)}>
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

export default Categories;
