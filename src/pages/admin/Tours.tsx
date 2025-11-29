import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye, X } from "lucide-react";
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

type ItineraryStop = {
  title: string;
  description: string;
  extra_fee: boolean;
};

type ItineraryData = {
  starting_location: string;
  stops: ItineraryStop[];
};

const Tours = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [open, setOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [formData, setFormData] = useState({
    title_en: "",
    description_en: "",
    overview_en: "",
    itinerary_en: "",
    important_info_en: "",
    location_en: "",
    included_en: "",
    not_included_en: "",
    price: "",
    duration: "",
    image_url: "",
    image_urls: [] as string[],
    rating: "0",
    reviews_count: "0",
    is_bestseller: false,
    category_id: "",
    destination_id: "",
  });
  const [itineraryData, setItineraryData] = useState<ItineraryData>({
    starting_location: "",
    stops: []
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTours();
    fetchCategories();
    fetchDestinations();
  }, []);

  const fetchTours = async () => {
    const { data, error, count } = await supabase
      .from("tours")
      .select("*", { count: 'exact' })
      .order("created_at", { ascending: false });
    
    if (error) {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
      console.error("Tours fetch error:", error);
    } else {
      setTours(data || []);
      console.log(`Loaded ${data?.length} tours (total: ${count})`);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({ title: "Xatolik", description: `${file.name}: Rasm hajmi 5MB dan kichik bo'lishi kerak`, variant: "destructive" });
          continue;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
          toast({ title: "Xatolik", description: `${file.name}: Faqat rasm fayllarini yuklash mumkin`, variant: "destructive" });
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `tours/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('tour-images')
          .upload(filePath, file);

        if (uploadError) {
          toast({ title: "Xatolik", description: `${file.name}: ${uploadError.message}`, variant: "destructive" });
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('tour-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      if (uploadedUrls.length > 0) {
        setFormData({ ...formData, image_urls: [...formData.image_urls, ...uploadedUrls] });
        toast({ title: "Muvaffaqiyat", description: `${uploadedUrls.length} ta rasm yuklandi` });
      }
    } catch (error: any) {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.image_urls.filter((_, i) => i !== index);
    setFormData({ ...formData, image_urls: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTranslating(true);

    try {
      // Convert itinerary data to JSON string
      const itineraryJson = JSON.stringify(itineraryData);
      
      // Translate all text fields
      const fieldsToTranslate = [
        { key: 'title', value: formData.title_en },
        { key: 'description', value: formData.description_en },
        { key: 'overview', value: formData.overview_en },
        { key: 'itinerary', value: itineraryJson },
        { key: 'important_info', value: formData.important_info_en },
        { key: 'location', value: formData.location_en },
        { key: 'included', value: formData.included_en },
        { key: 'not_included', value: formData.not_included_en },
      ];

      const translations: Record<string, any> = {};

      for (const field of fieldsToTranslate) {
        if (field.value) {
          const { data, error } = await supabase.functions.invoke('translate', {
            body: { 
              text: field.value,
              targetLanguages: ['Uzbek', 'Russian', 'German']
            }
          });
          if (error) throw error;
          translations[field.key] = data.translations;
        } else {
          translations[field.key] = { Uzbek: '', Russian: '', German: '' };
        }
      }

      const tourData = {
        title_en: formData.title_en,
        title_uz: translations.title.Uzbek,
        title_ru: translations.title.Russian,
        title_de: translations.title.German,
        description_en: formData.description_en || null,
        description_uz: translations.description.Uzbek || null,
        description_ru: translations.description.Russian || null,
        description_de: translations.description.German || null,
        overview_en: formData.overview_en || null,
        overview_uz: translations.overview.Uzbek || null,
        overview_ru: translations.overview.Russian || null,
        overview_de: translations.overview.German || null,
        itinerary_en: formData.itinerary_en || null,
        itinerary_uz: translations.itinerary.Uzbek || null,
        itinerary_ru: translations.itinerary.Russian || null,
        itinerary_de: translations.itinerary.German || null,
        important_info_en: formData.important_info_en || null,
        important_info_uz: translations.important_info.Uzbek || null,
        important_info_ru: translations.important_info.Russian || null,
        important_info_de: translations.important_info.German || null,
        location_en: formData.location_en || null,
        location_uz: translations.location.Uzbek || null,
        location_ru: translations.location.Russian || null,
        location_de: translations.location.German || null,
        included_en: formData.included_en || null,
        included_uz: translations.included.Uzbek || null,
        included_ru: translations.included.Russian || null,
        included_de: translations.included.German || null,
        not_included_en: formData.not_included_en || null,
        not_included_uz: translations.not_included.Uzbek || null,
        not_included_ru: translations.not_included.Russian || null,
        not_included_de: translations.not_included.German || null,
        price: parseFloat(formData.price),
        duration: formData.duration,
        image_url: formData.image_urls[0] || null,
        image_urls: formData.image_urls,
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

  const handleEdit = (tour: any) => {
    setEditingTour(tour);
    setFormData({
      title_en: tour.title_en,
      description_en: tour.description_en || "",
      overview_en: tour.overview_en || "",
      itinerary_en: tour.itinerary_en || "",
      important_info_en: tour.important_info_en || "",
      location_en: tour.location_en || "",
      included_en: tour.included_en || "",
      not_included_en: tour.not_included_en || "",
      price: tour.price.toString(),
      duration: tour.duration,
      image_url: tour.image_url || "",
      image_urls: tour.image_urls || [],
      rating: tour.rating.toString(),
      reviews_count: tour.reviews_count.toString(),
      is_bestseller: tour.is_bestseller,
      category_id: tour.category_id || "",
      destination_id: tour.destination_id || "",
    });
    
    // Parse itinerary JSON if exists
    if (tour.itinerary_en) {
      try {
        const parsed = JSON.parse(tour.itinerary_en);
        setItineraryData(parsed);
      } catch {
        setItineraryData({ starting_location: "", stops: [] });
      }
    } else {
      setItineraryData({ starting_location: "", stops: [] });
    }
    
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
      overview_en: "",
      itinerary_en: "",
      important_info_en: "",
      location_en: "",
      included_en: "",
      not_included_en: "",
      price: "",
      duration: "",
      image_url: "",
      image_urls: [],
      rating: "0",
      reviews_count: "0",
      is_bestseller: false,
      category_id: "",
      destination_id: "",
    });
    setItineraryData({ starting_location: "", stops: [] });
  };

  const addItineraryStop = () => {
    setItineraryData({
      ...itineraryData,
      stops: [...itineraryData.stops, { title: "", description: "", extra_fee: false }]
    });
  };

  const removeItineraryStop = (index: number) => {
    const newStops = itineraryData.stops.filter((_, i) => i !== index);
    setItineraryData({ ...itineraryData, stops: newStops });
  };

  const updateItineraryStop = (index: number, field: keyof ItineraryStop, value: any) => {
    const newStops = [...itineraryData.stops];
    newStops[index] = { ...newStops[index], [field]: value };
    setItineraryData({ ...itineraryData, stops: newStops });
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
                <Label>Rasmlar yuklash (Ko'p rasm tanlash mumkin)</Label>
                <div className="flex items-center gap-4">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    multiple
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="cursor-pointer"
                  />
                  {isUploading && <span className="text-sm text-muted-foreground">Yuklanmoqda...</span>}
                </div>
                {formData.image_urls.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {formData.image_urls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={url} 
                          alt={`Preview ${index + 1}`} 
                          className="h-32 w-full rounded-lg object-cover border" 
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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
              </div>

              <div className="space-y-2">
                <Label>Overview (Inglizcha)</Label>
                <Textarea value={formData.overview_en} onChange={(e) => setFormData({ ...formData, overview_en: e.target.value })} rows={4} placeholder="Tur haqida umumiy ma'lumot" />
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-semibold">Itinerary - Marshrutni rejasi</Label>
                
                <div className="space-y-2">
                  <Label>Boshlang'ich joylashuv (Starting location)</Label>
                  <Input 
                    value={itineraryData.starting_location} 
                    onChange={(e) => setItineraryData({ ...itineraryData, starting_location: e.target.value })}
                    placeholder="Amir Temur Mausoleum Gur-i Amir Complex"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>To'xtash joylari (Stops)</Label>
                    <Button type="button" size="sm" onClick={addItineraryStop}>
                      <Plus className="h-4 w-4 mr-1" />
                      To'xtash qo'shish
                    </Button>
                  </div>

                  {itineraryData.stops.map((stop, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="font-medium">To'xtash #{index + 1}</Label>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeItineraryStop(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm">Joylashuv / Nomi</Label>
                          <Input 
                            value={stop.title}
                            onChange={(e) => updateItineraryStop(index, 'title', e.target.value)}
                            placeholder="Amir Temur Mausoleum, Samarkand"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm">Tavsif</Label>
                          <Textarea 
                            value={stop.description}
                            onChange={(e) => updateItineraryStop(index, 'description', e.target.value)}
                            placeholder="Visit, Guided tour, Walk (100 minutes)"
                            rows={2}
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`extra-fee-${index}`}
                            checked={stop.extra_fee}
                            onCheckedChange={(checked) => updateItineraryStop(index, 'extra_fee', checked)}
                          />
                          <Label htmlFor={`extra-fee-${index}`} className="text-sm cursor-pointer">
                            Extra fee (Qo'shimcha to'lov)
                          </Label>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {itineraryData.stops.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                      To'xtash joylari mavjud emas. Yuqoridagi tugma orqali qo'shing.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Important Information - Muhim ma'lumot (Inglizcha)</Label>
                <Textarea value={formData.important_info_en} onChange={(e) => setFormData({ ...formData, important_info_en: e.target.value })} rows={4} placeholder="Please arrive 15 minutes before..." />
              </div>

              <div className="space-y-2">
                <Label>Location - Joylashuv (Inglizcha)</Label>
                <Textarea value={formData.location_en} onChange={(e) => setFormData({ ...formData, location_en: e.target.value })} rows={3} placeholder="Manzil va joylashuv ma'lumoti" />
              </div>

              <div className="space-y-2">
                <Label>Included - Nima kiritilgan (Inglizcha)</Label>
                <Textarea value={formData.included_en} onChange={(e) => setFormData({ ...formData, included_en: e.target.value })} rows={4} placeholder="Skip-the-line ticket\nExpert guide\nSummit access" />
              </div>

              <div className="space-y-2">
                <Label>Not Included - Nima kiritilmagan (Inglizcha)</Label>
                <Textarea value={formData.not_included_en} onChange={(e) => setFormData({ ...formData, not_included_en: e.target.value })} rows={4} placeholder="Hotel pickup\nFood & drinks\nGratuities" />
              </div>

              <p className="text-sm text-muted-foreground italic">Barcha maydonlar boshqa tillarga avtomatik tarjima qilinadi</p>

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
                <TableHead>Rasm</TableHead>
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
                  <TableCell>
                    {tour.image_url ? (
                      <img 
                        src={tour.image_url} 
                        alt={tour.title_en}
                        className="h-16 w-24 object-cover rounded border"
                      />
                    ) : (
                      <div className="h-16 w-24 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground">
                        Rasm yo'q
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{tour.title_en}</TableCell>
                  <TableCell>{tour.title_uz}</TableCell>
                  <TableCell>${tour.price}</TableCell>
                  <TableCell>{tour.duration}</TableCell>
                  <TableCell>{tour.rating} ⭐</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" asChild>
                        <Link to={`/tour/${tour.id}`} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
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
