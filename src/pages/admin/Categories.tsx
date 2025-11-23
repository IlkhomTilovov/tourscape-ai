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
    name_uz: "",
    name_ru: "",
    name_de: "",
    icon: "",
  });
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
    
    if (editingCategory) {
      const { error } = await supabase
        .from("categories")
        .update(formData)
        .eq("id", editingCategory.id);
      
      if (error) {
        toast({ title: "Xatolik", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Muvaffaqiyat", description: "Kategoriya yangilandi" });
        fetchCategories();
        handleClose();
      }
    } else {
      const { error } = await supabase.from("categories").insert([formData]);
      
      if (error) {
        toast({ title: "Xatolik", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Muvaffaqiyat", description: "Kategoriya qo'shildi" });
        fetchCategories();
        handleClose();
      }
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name_en: category.name_en,
      name_uz: category.name_uz,
      name_ru: category.name_ru,
      name_de: category.name_de,
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
    setFormData({ name_en: "", name_uz: "", name_ru: "", name_de: "", icon: "" });
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
            <Button onClick={() => { setEditingCategory(null); setFormData({ name_en: "", name_uz: "", name_ru: "", name_de: "", icon: "" }); }}>
              <Plus className="h-4 w-4 mr-2" />
              Yangi qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name_en">Inglizcha nomi</Label>
                  <Input
                    id="name_en"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_uz">O'zbekcha nomi</Label>
                  <Input
                    id="name_uz"
                    value={formData.name_uz}
                    onChange={(e) => setFormData({ ...formData, name_uz: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_ru">Ruscha nomi</Label>
                  <Input
                    id="name_ru"
                    value={formData.name_ru}
                    onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_de">Nemischa nomi</Label>
                  <Input
                    id="name_de"
                    value={formData.name_de}
                    onChange={(e) => setFormData({ ...formData, name_de: e.target.value })}
                    required
                  />
                </div>
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
                <Button type="submit">
                  {editingCategory ? "Yangilash" : "Qo'shish"}
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
