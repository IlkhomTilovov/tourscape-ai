import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
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
};

const Destinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [open, setOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [formData, setFormData] = useState({
    name_en: "",
    name_uz: "",
    name_ru: "",
    name_de: "",
    description_en: "",
    description_uz: "",
    description_ru: "",
    description_de: "",
    image_url: "",
    country: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    const { data, error } = await supabase.from("destinations").select("*").order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    } else {
      setDestinations(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDestination) {
      const { error } = await supabase
        .from("destinations")
        .update(formData)
        .eq("id", editingDestination.id);
      
      if (error) {
        toast({ title: "Xatolik", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Muvaffaqiyat", description: "Manzil yangilandi" });
        fetchDestinations();
        handleClose();
      }
    } else {
      const { error } = await supabase.from("destinations").insert([formData]);
      
      if (error) {
        toast({ title: "Xatolik", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Muvaffaqiyat", description: "Manzil qo'shildi" });
        fetchDestinations();
        handleClose();
      }
    }
  };

  const handleEdit = (destination: Destination) => {
    setEditingDestination(destination);
    setFormData({
      name_en: destination.name_en,
      name_uz: destination.name_uz,
      name_ru: destination.name_ru,
      name_de: destination.name_de,
      description_en: destination.description_en || "",
      description_uz: destination.description_uz || "",
      description_ru: destination.description_ru || "",
      description_de: destination.description_de || "",
      image_url: destination.image_url || "",
      country: destination.country,
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
      name_uz: "",
      name_ru: "",
      name_de: "",
      description_en: "",
      description_uz: "",
      description_ru: "",
      description_de: "",
      image_url: "",
      country: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manzillar</h1>
          <p className="text-muted-foreground">Manzillarni boshqarish</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingDestination(null); setFormData({ name_en: "", name_uz: "", name_ru: "", name_de: "", description_en: "", description_uz: "", description_ru: "", description_de: "", image_url: "", country: "" }); }}>
              <Plus className="h-4 w-4 mr-2" />
              Yangi qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDestination ? "Manzilni tahrirlash" : "Yangi manzil"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Inglizcha nomi</Label>
                  <Input value={formData.name_en} onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>O'zbekcha nomi</Label>
                  <Input value={formData.name_uz} onChange={(e) => setFormData({ ...formData, name_uz: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Ruscha nomi</Label>
                  <Input value={formData.name_ru} onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Nemischa nomi</Label>
                  <Input value={formData.name_de} onChange={(e) => setFormData({ ...formData, name_de: e.target.value })} required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Mamlakat</Label>
                <Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} required />
              </div>

              <div className="space-y-2">
                <Label>Rasm URL</Label>
                <Input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Inglizcha tavsif</Label>
                  <Textarea value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>O'zbekcha tavsif</Label>
                  <Textarea value={formData.description_uz} onChange={(e) => setFormData({ ...formData, description_uz: e.target.value })} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Ruscha tavsif</Label>
                  <Textarea value={formData.description_ru} onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Nemischa tavsif</Label>
                  <Textarea value={formData.description_de} onChange={(e) => setFormData({ ...formData, description_de: e.target.value })} rows={3} />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>Bekor qilish</Button>
                <Button type="submit">{editingDestination ? "Yangilash" : "Qo'shish"}</Button>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Inglizcha</TableHead>
                <TableHead>O'zbekcha</TableHead>
                <TableHead>Mamlakat</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {destinations.map((destination) => (
                <TableRow key={destination.id}>
                  <TableCell>{destination.name_en}</TableCell>
                  <TableCell>{destination.name_uz}</TableCell>
                  <TableCell>{destination.country}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(destination)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(destination.id)}>
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

export default Destinations;
