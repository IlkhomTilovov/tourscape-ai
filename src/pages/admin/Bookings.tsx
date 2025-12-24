import { useEffect, useState, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Loader2, 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  CreditCard, 
  MapPin, 
  Search, 
  Filter, 
  RefreshCw,
  Download,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Trash2
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

interface Booking {
  id: string;
  tour_id: string;
  booking_date: string;
  booking_time: string | null;
  adults: number;
  total_price: number;
  payment_status: string;
  payment_method: string | null;
  user_name: string | null;
  user_email: string | null;
  user_phone: string | null;
  pickup_address: string | null;
  created_at: string;
  tours: {
    title_en: string;
    title_uz: string;
  } | null;
}

type SortField = "created_at" | "booking_date" | "total_price" | "user_name";
type SortOrder = "asc" | "desc";

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const { toast } = useToast();

  const fetchBookings = async () => {
    setLoading(true);
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

  // Filter and sort bookings
  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (booking) =>
          booking.user_name?.toLowerCase().includes(query) ||
          booking.user_email?.toLowerCase().includes(query) ||
          booking.user_phone?.includes(query) ||
          booking.tours?.title_uz?.toLowerCase().includes(query) ||
          booking.tours?.title_en?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((booking) => booking.payment_status === statusFilter);
    }

    // Payment method filter
    if (paymentMethodFilter !== "all") {
      result = result.filter((booking) => booking.payment_method === paymentMethodFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      result = result.filter((booking) => {
        const bookingDate = new Date(booking.booking_date);
        bookingDate.setHours(0, 0, 0, 0);
        
        switch (dateFilter) {
          case "today":
            return bookingDate.getTime() === today.getTime();
          case "week":
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return bookingDate >= weekAgo;
          case "month":
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return bookingDate >= monthAgo;
          case "upcoming":
            return bookingDate >= today;
          default:
            return true;
        }
      });
    }

    // Sort
    result.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case "created_at":
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case "booking_date":
          aValue = new Date(a.booking_date).getTime();
          bValue = new Date(b.booking_date).getTime();
          break;
        case "total_price":
          aValue = a.total_price;
          bValue = b.total_price;
          break;
        case "user_name":
          aValue = a.user_name?.toLowerCase() || "";
          bValue = b.user_name?.toLowerCase() || "";
          break;
        default:
          return 0;
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    return result;
  }, [bookings, searchQuery, statusFilter, paymentMethodFilter, dateFilter, sortField, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.payment_status === "pending").length;
    const completed = bookings.filter((b) => b.payment_status === "completed").length;
    const cancelled = bookings.filter((b) => b.payment_status === "cancelled").length;
    const totalRevenue = bookings
      .filter((b) => b.payment_status === "completed")
      .reduce((sum, b) => sum + b.total_price, 0);

    return { total, pending, completed, cancelled, totalRevenue };
  }, [bookings]);

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

  const handleDelete = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", bookingId);

      if (error) throw error;

      setBookings(bookings.filter((booking) => booking.id !== bookingId));

      toast({
        title: "Muvaffaqiyatli",
        description: "Buyurtma o'chirildi",
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast({
        title: "Xatolik",
        description: "Buyurtmani o'chirishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const exportToCSV = () => {
    const headers = ["Tur", "Mijoz", "Email", "Telefon", "Sana", "Vaqt", "Odamlar", "Narx", "To'lov usuli", "Status", "Manzil"];
    const rows = filteredBookings.map((b) => [
      b.tours?.title_uz || b.tours?.title_en || "N/A",
      b.user_name || "",
      b.user_email || "",
      b.user_phone || "",
      b.booking_date,
      b.booking_time || "",
      b.adults,
      b.total_price,
      b.payment_method || "",
      b.payment_status,
      b.pickup_address || ""
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `buyurtmalar_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();

    toast({
      title: "Muvaffaqiyatli",
      description: "CSV fayl yuklab olindi",
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPaymentMethodFilter("all");
    setDateFilter("all");
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
      pending: { variant: "secondary", icon: <Clock className="h-3 w-3 mr-1" /> },
      completed: { variant: "default", icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      cancelled: { variant: "destructive", icon: <XCircle className="h-3 w-3 mr-1" /> },
    };

    const labels: Record<string, string> = {
      pending: "Kutilmoqda",
      completed: "Yakunlangan",
      cancelled: "Bekor qilingan",
    };

    const { variant, icon } = config[status] || { variant: "outline" as const, icon: null };

    return (
      <Badge variant={variant} className="flex items-center w-fit">
        {icon}
        {labels[status] || status}
      </Badge>
    );
  };

  const getPaymentMethodLabel = (method: string | null) => {
    const labels: Record<string, string> = {
      cash: "Naqd pul",
      mastercard: "MasterCard",
      visa: "Visa",
      other: "Boshqa",
      uzum: "Uzum",
    };

    return labels[method || ""] || method || "N/A";
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Buyurtmalar</h1>
          <p className="text-muted-foreground">
            Barcha buyurtmalarni boshqarish va kuzatish
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchBookings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Yangilash
          </Button>
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Jami</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" /> Kutilmoqda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <CheckCircle className="h-4 w-4" /> Yakunlangan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <XCircle className="h-4 w-4" /> Bekor qilingan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-4 w-4" /> Daromad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${stats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" /> Filtrlar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Qidirish (ism, email, telefon, tur)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha statuslar</SelectItem>
                <SelectItem value="pending">Kutilmoqda</SelectItem>
                <SelectItem value="completed">Yakunlangan</SelectItem>
                <SelectItem value="cancelled">Bekor qilingan</SelectItem>
              </SelectContent>
            </Select>

            {/* Payment Method Filter */}
            <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
              <SelectTrigger>
                <SelectValue placeholder="To'lov usuli" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha usullar</SelectItem>
                <SelectItem value="cash">Naqd pul</SelectItem>
                <SelectItem value="mastercard">MasterCard</SelectItem>
                <SelectItem value="visa">Visa</SelectItem>
                <SelectItem value="uzum">Uzum</SelectItem>
                <SelectItem value="other">Boshqa</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Sana" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha sanalar</SelectItem>
                <SelectItem value="today">Bugun</SelectItem>
                <SelectItem value="week">Oxirgi hafta</SelectItem>
                <SelectItem value="month">Oxirgi oy</SelectItem>
                <SelectItem value="upcoming">Kelayotgan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(searchQuery || statusFilter !== "all" || paymentMethodFilter !== "all" || dateFilter !== "all") && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">
                {filteredBookings.length} ta natija topildi
              </span>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Filtrlarni tozalash
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tur nomi</TableHead>
              <TableHead>Mijoz</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSort("booking_date")}
                  className="h-auto p-0 hover:bg-transparent"
                >
                  Sana
                  <ArrowUpDown className="h-4 w-4 ml-1" />
                </Button>
              </TableHead>
              <TableHead>Odamlar</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSort("total_price")}
                  className="h-auto p-0 hover:bg-transparent"
                >
                  Narx
                  <ArrowUpDown className="h-4 w-4 ml-1" />
                </Button>
              </TableHead>
              <TableHead>To'lov usuli</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-muted-foreground" />
                    <span className="text-muted-foreground">Buyurtmalar topilmadi</span>
                    {(searchQuery || statusFilter !== "all" || paymentMethodFilter !== "all" || dateFilter !== "all") && (
                      <Button variant="link" size="sm" onClick={clearFilters}>
                        Filtrlarni tozalash
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {booking.tours?.title_uz || booking.tours?.title_en || "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {booking.user_name && (
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="truncate max-w-[150px]">{booking.user_name}</span>
                        </div>
                      )}
                      {booking.user_email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <a
                            href={`mailto:${booking.user_email}`}
                            className="hover:underline truncate max-w-[150px]"
                          >
                            {booking.user_email}
                          </a>
                        </div>
                      )}
                      {booking.user_phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <a
                            href={`tel:${booking.user_phone}`}
                            className="hover:underline"
                          >
                            {booking.user_phone}
                          </a>
                        </div>
                      )}
                      {booking.pickup_address && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate max-w-[150px]">{booking.pickup_address}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <div>{format(new Date(booking.booking_date), "dd.MM.yyyy")}</div>
                        {booking.booking_time && (
                          <div className="text-muted-foreground">{booking.booking_time}</div>
                        )}
                      </div>
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
                    <Badge variant="outline">
                      {getPaymentMethodLabel(booking.payment_method)}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(booking.payment_status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        value={booking.payment_status}
                        onValueChange={(value) =>
                          handleStatusChange(booking.id, value)
                        }
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Kutilmoqda</SelectItem>
                          <SelectItem value="completed">Yakunlangan</SelectItem>
                          <SelectItem value="cancelled">Bekor qilingan</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" className="h-9 w-9">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Buyurtmani o'chirish</AlertDialogTitle>
                            <AlertDialogDescription>
                              Haqiqatan ham bu buyurtmani o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(booking.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              O'chirish
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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