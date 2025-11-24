import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Visa {
  id: string;
  country: string;
  visa_type: string;
  duration: string;
  processing_time: string;
  price: number;
  requirements: string;
  created_at: string;
}

const Visas = () => {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Visa | null>(null);
  const [formData, setFormData] = useState({
    country: "",
    visa_type: "tourist",
    duration: "",
    processing_time: "",
    price: 0,
    requirements: "",
  });

  const queryClient = useQueryClient();

  const { data: visas = [], isLoading } = useQuery({
    queryKey: ["visas"],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from("visas" as any)
        .select("*", { count: 'exact' })
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Visas fetch error:", error);
        throw error;
      }
      console.log(`Loaded ${data?.length} visas (total: ${count})`);
      return data as unknown as Visa[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("visas" as any).insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visas"] });
      toast.success("Viza qo'shildi");
      handleClose();
    },
    onError: () => {
      toast.error("Xatolik yuz berdi");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from("visas" as any)
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visas"] });
      toast.success("Viza yangilandi");
      handleClose();
    },
    onError: () => {
      toast.error("Xatolik yuz berdi");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("visas" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visas"] });
      toast.success("Viza o'chirildi");
    },
    onError: () => {
      toast.error("Xatolik yuz berdi");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (item: Visa) => {
    setEditingItem(item);
    setFormData({
      country: item.country,
      visa_type: item.visa_type,
      duration: item.duration,
      processing_time: item.processing_time,
      price: item.price,
      requirements: item.requirements,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingItem(null);
    setFormData({
      country: "",
      visa_type: "tourist",
      duration: "",
      processing_time: "",
      price: 0,
      requirements: "",
    });
  };

  const getVisaTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      tourist: "Turistik",
      business: "Biznes",
      student: "Talaba",
      work: "Ish",
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Vizalar</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Yangi viza
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Vizani tahrirlash" : "Yangi viza"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country">Mamlakat</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visa_type">Viza turi</Label>
                <Select
                  value={formData.visa_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, visa_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tourist">Turistik</SelectItem>
                    <SelectItem value="business">Biznes</SelectItem>
                    <SelectItem value="student">Talaba</SelectItem>
                    <SelectItem value="work">Ish</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Muddati</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="30 kun"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="processing_time">Tayyorlanish vaqti</Label>
                  <Input
                    id="processing_time"
                    value={formData.processing_time}
                    onChange={(e) =>
                      setFormData({ ...formData, processing_time: e.target.value })
                    }
                    placeholder="5-7 kun"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Narxi</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Talablar</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) =>
                    setFormData({ ...formData, requirements: e.target.value })
                  }
                  rows={5}
                  placeholder="Pasport, foto, to'lov cheki..."
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Bekor qilish
                </Button>
                <Button type="submit">
                  {editingItem ? "Yangilash" : "Qo'shish"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p>Yuklanmoqda...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mamlakat</TableHead>
              <TableHead>Turi</TableHead>
              <TableHead>Muddati</TableHead>
              <TableHead>Tayyorlanish</TableHead>
              <TableHead>Narx</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visas.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.country}</TableCell>
                <TableCell>{getVisaTypeLabel(item.visa_type)}</TableCell>
                <TableCell>{item.duration}</TableCell>
                <TableCell>{item.processing_time}</TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm("Rostdan ham o'chirmoqchimisiz?")) {
                        deleteMutation.mutate(item.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Visas;
