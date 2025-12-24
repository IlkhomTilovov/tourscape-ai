import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AdminAbout = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mission: "",
    vision: "",
    contact_email: "",
    contact_phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const { data, error } = await supabase
        .from("about")
        .select("*")
        .eq("id", "main")
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error("About fetch error:", error);
        throw error;
      }
      
      console.log("About data loaded:", data ? "exists with id: " + data.id : "not found");
      
      if (data) {
        setExistingId(data.id);
        setFormData({
          title: data.title || "",
          description: data.description || "",
          mission: data.mission || "",
          vision: data.vision || "",
          contact_email: data.contact_email || "",
          contact_phone: data.contact_phone || "",
          address: data.address || "",
        });
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (existingId) {
        // Update existing record
        const { error } = await supabase
          .from("about")
          .update(formData)
          .eq("id", existingId);
        if (error) throw error;
      } else {
        // Insert new record with 'main' as default id
        const { error } = await supabase
          .from("about")
          .insert([{ ...formData, id: "main" }]);
        if (error) throw error;
        setExistingId("main");
      }
      
      toast.success("Ma'lumot yangilandi");
    } catch (error) {
      console.error("Error saving about data:", error);
      toast.error("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">About Ma'lumotlari</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="space-y-2">
          <Label htmlFor="title">Sarlavha</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Ta'rif</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={5}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mission">Missiya</Label>
          <Textarea
            id="mission"
            value={formData.mission}
            onChange={(e) =>
              setFormData({ ...formData, mission: e.target.value })
            }
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vision">Vizion</Label>
          <Textarea
            id="vision"
            value={formData.vision}
            onChange={(e) =>
              setFormData({ ...formData, vision: e.target.value })
            }
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact_email">Email</Label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e) =>
                setFormData({ ...formData, contact_email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_phone">Telefon</Label>
            <Input
              id="contact_phone"
              value={formData.contact_phone}
              onChange={(e) =>
                setFormData({ ...formData, contact_phone: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Manzil</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </form>
    </div>
  );
};

export default AdminAbout;
