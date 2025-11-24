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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Flight {
  id: string;
  airline: string;
  from_city: string;
  to_city: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  available_seats: number;
  created_at: string;
}

const Flights = () => {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Flight | null>(null);
  const [formData, setFormData] = useState({
    airline: "",
    from_city: "",
    to_city: "",
    departure_time: "",
    arrival_time: "",
    price: 0,
    available_seats: 0,
  });

  const queryClient = useQueryClient();

  const { data: flights = [], isLoading } = useQuery({
    queryKey: ["flights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("flights" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Flight[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("flights" as any).insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flights"] });
      toast.success("Parvoz qo'shildi");
      handleClose();
    },
    onError: () => {
      toast.error("Xatolik yuz berdi");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from("flights" as any)
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flights"] });
      toast.success("Parvoz yangilandi");
      handleClose();
    },
    onError: () => {
      toast.error("Xatolik yuz berdi");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("flights" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flights"] });
      toast.success("Parvoz o'chirildi");
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

  const handleEdit = (item: Flight) => {
    setEditingItem(item);
    setFormData({
      airline: item.airline,
      from_city: item.from_city,
      to_city: item.to_city,
      departure_time: item.departure_time,
      arrival_time: item.arrival_time,
      price: item.price,
      available_seats: item.available_seats,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingItem(null);
    setFormData({
      airline: "",
      from_city: "",
      to_city: "",
      departure_time: "",
      arrival_time: "",
      price: 0,
      available_seats: 0,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Parvozlar</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Yangi parvoz
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Parvozni tahrirlash" : "Yangi parvoz"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="airline">Aviakompaniya</Label>
                <Input
                  id="airline"
                  value={formData.airline}
                  onChange={(e) =>
                    setFormData({ ...formData, airline: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from_city">Qayerdan</Label>
                  <Input
                    id="from_city"
                    value={formData.from_city}
                    onChange={(e) =>
                      setFormData({ ...formData, from_city: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to_city">Qayerga</Label>
                  <Input
                    id="to_city"
                    value={formData.to_city}
                    onChange={(e) =>
                      setFormData({ ...formData, to_city: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departure_time">Jo'nash vaqti</Label>
                  <Input
                    id="departure_time"
                    type="datetime-local"
                    value={formData.departure_time}
                    onChange={(e) =>
                      setFormData({ ...formData, departure_time: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrival_time">Yetib kelish vaqti</Label>
                  <Input
                    id="arrival_time"
                    type="datetime-local"
                    value={formData.arrival_time}
                    onChange={(e) =>
                      setFormData({ ...formData, arrival_time: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="available_seats">Mavjud o'rindiqlar</Label>
                  <Input
                    id="available_seats"
                    type="number"
                    value={formData.available_seats}
                    onChange={(e) =>
                      setFormData({ ...formData, available_seats: parseInt(e.target.value) })
                    }
                    required
                  />
                </div>
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
              <TableHead>Aviakompaniya</TableHead>
              <TableHead>Yo'nalish</TableHead>
              <TableHead>Jo'nash</TableHead>
              <TableHead>Kelish</TableHead>
              <TableHead>Narx</TableHead>
              <TableHead>O'rindiqlar</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flights.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.airline}</TableCell>
                <TableCell>{item.from_city} → {item.to_city}</TableCell>
                <TableCell>{new Date(item.departure_time).toLocaleString('uz-UZ')}</TableCell>
                <TableCell>{new Date(item.arrival_time).toLocaleString('uz-UZ')}</TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>{item.available_seats}</TableCell>
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

export default Flights;
