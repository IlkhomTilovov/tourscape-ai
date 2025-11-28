import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, Phone, Calendar, User, CreditCard } from "lucide-react";

interface Booking {
  id: string;
  tour_id: string;
  booking_date: string;
  booking_time: string | null;
  adults: number;
  total_price: number;
  payment_status: string;
  payment_method: string | null;
  user_email: string | null;
  user_phone: string | null;
  created_at: string;
  tours: {
    title_en: string;
    title_uz: string;
  } | null;
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          tours (
            title_en,
            title_uz
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Xatolik",
        description: "Buyurtmalarni yuklashda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ payment_status: newStatus })
        .eq("id", bookingId);

      if (error) throw error;

      setBookings(
        bookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, payment_status: newStatus }
            : booking
        )
      );

      toast({
        title: "Muvaffaqiyatli",
        description: "To'lov statusi o'zgartirildi",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Xatolik",
        description: "Statusni o'zgartirishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      completed: "default",
      cancelled: "destructive",
    };

    const labels: Record<string, string> = {
      pending: "Kutilmoqda",
      completed: "Yakunlangan",
      cancelled: "Bekor qilingan",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Buyurtmalar</h1>
        <p className="text-muted-foreground">
          Barcha buyurtmalarni boshqarish va kuzatish
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tur nomi</TableHead>
              <TableHead>Mijoz</TableHead>
              <TableHead>Sana</TableHead>
              <TableHead>Odamlar soni</TableHead>
              <TableHead>Narx</TableHead>
              <TableHead>To'lov usuli</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Buyurtmalar mavjud emas
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {booking.tours?.title_uz || booking.tours?.title_en || "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {booking.user_email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`mailto:${booking.user_email}`}
                            className="hover:underline"
                          >
                            {booking.user_email}
                          </a>
                        </div>
                      )}
                      {booking.user_phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`tel:${booking.user_phone}`}
                            className="hover:underline"
                          >
                            {booking.user_phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(booking.booking_date).toLocaleDateString("uz-UZ")}
                        {booking.booking_time && ` - ${booking.booking_time}`}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.adults}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">
                        ${booking.total_price.toLocaleString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {booking.payment_method || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(booking.payment_status)}</TableCell>
                  <TableCell>
                    <Select
                      value={booking.payment_status}
                      onValueChange={(value) =>
                        handleStatusChange(booking.id, value)
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Kutilmoqda</SelectItem>
                        <SelectItem value="completed">Yakunlangan</SelectItem>
                        <SelectItem value="cancelled">Bekor qilingan</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminBookings;
