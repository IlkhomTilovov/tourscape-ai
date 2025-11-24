import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import type { Language } from "@/lib/translations";
import {
  Star,
  Clock,
  MapPin,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  ArrowLeft,
  Loader2,
  Upload,
  ImageIcon,
  Trash2,
} from "lucide-react";

interface Tour {
  id: string;
  title_en: string;
  title_uz: string;
  title_ru: string;
  title_de: string;
  description_en: string | null;
  description_uz: string | null;
  description_ru: string | null;
  description_de: string | null;
  overview_en: string | null;
  overview_uz: string | null;
  overview_ru: string | null;
  overview_de: string | null;
  itinerary_en: string | null;
  itinerary_uz: string | null;
  itinerary_ru: string | null;
  itinerary_de: string | null;
  important_info_en: string | null;
  important_info_uz: string | null;
  important_info_ru: string | null;
  important_info_de: string | null;
  location_en: string | null;
  location_uz: string | null;
  location_ru: string | null;
  location_de: string | null;
  included_en: string | null;
  included_uz: string | null;
  included_ru: string | null;
  included_de: string | null;
  not_included_en: string | null;
  not_included_uz: string | null;
  not_included_ru: string | null;
  not_included_de: string | null;
  price: number;
  duration: string;
  rating: number | null;
  reviews_count: number | null;
  image_url: string | null;
  is_bestseller: boolean | null;
  category_id: string | null;
  destination_id: string | null;
  categories?: { name_uz: string; name_en: string; name_ru: string; name_de: string };
  destinations?: { name_uz: string; name_en: string; name_ru: string; name_de: string };
}

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isAdmin } = useAuth();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    guest_name: "",
    rating: 5,
    comment: "",
    images: [] as File[],
  });

  const images = tour?.image_url ? [tour.image_url] : [
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80"
  ];

  // Fetch tour data
  useEffect(() => {
    if (id) {
      fetchTour();
      fetchReviews();
    }
  }, [id]);

  const fetchTour = async () => {
    try {
      const { data, error } = await supabase
        .from("tours")
        .select("*, categories(*), destinations(*)")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast.error(
          language === "UZ" ? "Sayohat topilmadi" :
          language === "EN" ? "Tour not found" :
          language === "RU" ? "Тур не найден" :
          "Tour nicht gefunden"
        );
        navigate("/tours");
        return;
      }

      setTour(data);
    } catch (error) {
      console.error("Error fetching tour:", error);
      toast.error("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedText = (
    en: string | null,
    uz: string | null,
    ru: string | null,
    de: string | null
  ) => {
    const langMap: Record<Language, string | null> = {
      EN: en,
      UZ: uz,
      RU: ru,
      DE: de,
    };
    return langMap[language] || en || "";
  };

  const getCategoryName = () => {
    if (!tour?.categories) return "";
    return language === "UZ" ? tour.categories.name_uz :
           language === "EN" ? tour.categories.name_en :
           language === "RU" ? tour.categories.name_ru :
           tour.categories.name_de;
  };

  const getDestinationName = () => {
    if (!tour?.destinations) return "";
    return language === "UZ" ? tour.destinations.name_uz :
           language === "EN" ? tour.destinations.name_en :
           language === "RU" ? tour.destinations.name_ru :
           tour.destinations.name_de;
  };

  const includes = tour ? (getLocalizedText(
    tour.included_en,
    tour.included_uz,
    tour.included_ru,
    tour.included_de
  ) || "").split("\n").filter(Boolean) : [];

  const notIncludes = tour ? (getLocalizedText(
    tour.not_included_en,
    tour.not_included_uz,
    tour.not_included_ru,
    tour.not_included_de
  ) || "").split("\n").filter(Boolean) : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("tour_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
    } else {
      setReviews(data || []);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validImages = files.filter(file => file.type.startsWith('image/'));
    
    if (validImages.length + reviewForm.images.length > 5) {
      toast.error(language === "UZ" ? "Maksimal 5 ta rasm yuklash mumkin" : 
                  language === "EN" ? "Maximum 5 images allowed" :
                  language === "RU" ? "Максимум 5 изображений" :
                  "Maximal 5 Bilder erlaubt");
      return;
    }
    
    setReviewForm({ ...reviewForm, images: [...reviewForm.images, ...validImages] });
  };

  const removeImage = (index: number) => {
    const newImages = [...reviewForm.images];
    newImages.splice(index, 1);
    setReviewForm({ ...reviewForm, images: newImages });
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!isAdmin) return;

    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

      if (error) {
        toast.error(language === "UZ" ? "O'chirishda xatolik yuz berdi" :
                    language === "EN" ? "Error deleting review" :
                    language === "RU" ? "Ошибка при удалении отзыва" :
                    "Fehler beim Löschen der Bewertung");
        console.error("Error deleting review:", error);
      } else {
        toast.success(language === "UZ" ? "Izoh o'chirildi" :
                      language === "EN" ? "Review deleted" :
                      language === "RU" ? "Отзыв удален" :
                      "Bewertung gelöscht");
        fetchReviews();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(language === "UZ" ? "Xatolik yuz berdi" :
                  language === "EN" ? "An error occurred" :
                  language === "RU" ? "Произошла ошибка" :
                  "Ein Fehler ist aufgetreten");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewForm.guest_name.trim() || !reviewForm.comment.trim()) {
      toast.error(language === "UZ" ? "Iltimos, barcha maydonlarni to'ldiring" :
                  language === "EN" ? "Please fill in all fields" :
                  language === "RU" ? "Пожалуйста, заполните все поля" :
                  "Bitte füllen Sie alle Felder aus");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload images to storage
      const imageUrls: string[] = [];
      
      for (const image of reviewForm.images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('review-images')
          .upload(filePath, image);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('review-images')
          .getPublicUrl(filePath);

        imageUrls.push(publicUrl);
      }

      // Insert review with image URLs
      const { error } = await supabase.from("reviews").insert({
        tour_id: id,
        guest_name: reviewForm.guest_name.trim(),
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
        image_urls: imageUrls,
      });

      if (error) {
        toast.error(language === "UZ" ? "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring" :
                    language === "EN" ? "An error occurred. Please try again" :
                    language === "RU" ? "Произошла ошибка. Пожалуйста, попробуйте еще раз" :
                    "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut");
        console.error("Error submitting review:", error);
      } else {
        toast.success(language === "UZ" ? "Izoh muvaffaqiyatli qo'shildi!" :
                      language === "EN" ? "Review submitted successfully!" :
                      language === "RU" ? "Отзыв успешно добавлен!" :
                      "Bewertung erfolgreich hinzugefügt!");
        setReviewForm({ guest_name: "", rating: 5, comment: "", images: [] });
        fetchReviews();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(language === "UZ" ? "Xatolik yuz berdi" :
                  language === "EN" ? "An error occurred" :
                  language === "RU" ? "Произошла ошибка" :
                  "Ein Fehler ist aufgetreten");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {loading ? (
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === "UZ" ? "Orqaga" : language === "EN" ? "Back" : language === "RU" ? "Назад" : "Zurück"}
          </Button>
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      ) : !tour ? (
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {language === "UZ" ? "Sayohat topilmadi" :
             language === "EN" ? "Tour not found" :
             language === "RU" ? "Тур не найден" :
             "Tour nicht gefunden"}
          </h2>
          <Button onClick={() => navigate("/tours")}>
            {language === "UZ" ? "Sayohatlarga qaytish" :
             language === "EN" ? "Back to Tours" :
             language === "RU" ? "Вернуться к турам" :
             "Zurück zu Touren"}
          </Button>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === "UZ" ? "Orqaga" : language === "EN" ? "Back" : language === "RU" ? "Назад" : "Zurück"}
          </Button>

          {/* Breadcrumb */}
          <div className="text-sm text-muted-foreground mb-4">
            {language === "UZ" ? "Bosh sahifa" : language === "EN" ? "Home" : language === "RU" ? "Главная" : "Startseite"} / {getDestinationName()} / {getCategoryName()}
          </div>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
              <div>
                {tour.is_bestseller && (
                  <Badge className="mb-2 bg-accent text-accent-foreground">
                    {language === "UZ" ? "Eng mashhur" : language === "EN" ? "Bestseller" : language === "RU" ? "Бестселлер" : "Bestseller"}
                  </Badge>
                )}
                <h1 className="text-4xl font-bold mb-2">
                  {getLocalizedText(tour.title_en, tour.title_uz, tour.title_ru, tour.title_de)}
                </h1>
                <div className="flex items-center flex-wrap gap-4 text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-foreground">
                      {tour.rating || 0}
                    </span>
                    <span>({tour.reviews_count || 0} {language === "UZ" ? "sharh" : language === "EN" ? "reviews" : language === "RU" ? "отзывов" : "Bewertungen"})</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-5 w-5" />
                    <span>{getLocalizedText(tour.location_en, tour.location_uz, tour.location_ru, tour.location_de)}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="relative rounded-2xl overflow-hidden h-[500px] group">
                <img
                  src={images[currentImageIndex]}
                  alt={getLocalizedText(tour.title_en, tour.title_uz, tour.title_ru, tour.title_de)}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImageIndex(i)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i === currentImageIndex
                              ? "bg-white w-8"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="overview">
                    {language === "UZ" ? "Umumiy" : language === "EN" ? "Overview" : language === "RU" ? "Обзор" : "Überblick"}
                  </TabsTrigger>
                  <TabsTrigger value="itinerary">
                    {language === "UZ" ? "Marshrutni" : language === "EN" ? "Itinerary" : language === "RU" ? "Маршрут" : "Reiseplan"}
                  </TabsTrigger>
                  <TabsTrigger value="reviews">
                    {language === "UZ" ? "Sharhlar" : language === "EN" ? "Reviews" : language === "RU" ? "Отзывы" : "Bewertungen"}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      {language === "UZ" ? "Sayohat haqida" : language === "EN" ? "About this experience" : language === "RU" ? "Об этом туре" : "Über diese Erfahrung"}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {getLocalizedText(tour.overview_en, tour.overview_uz, tour.overview_ru, tour.overview_de) || 
                       getLocalizedText(tour.description_en, tour.description_uz, tour.description_ru, tour.description_de)}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {includes.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                          <Check className="h-5 w-5 text-green-600 mr-2" />
                          {language === "UZ" ? "Nima kiritilgan" : language === "EN" ? "What's included" : language === "RU" ? "Что включено" : "Was ist inbegriffen"}
                        </h3>
                        <ul className="space-y-2">
                          {includes.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {notIncludes.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                          <X className="h-5 w-5 text-red-600 mr-2" />
                          {language === "UZ" ? "Nima kiritilmagan" : language === "EN" ? "Not included" : language === "RU" ? "Не включено" : "Nicht inbegriffen"}
                        </h3>
                        <ul className="space-y-2">
                          {notIncludes.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <X className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {getLocalizedText(tour.important_info_en, tour.important_info_uz, tour.important_info_ru, tour.important_info_de) && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">
                        {language === "UZ" ? "Muhim ma'lumotlar" : language === "EN" ? "Important information" : language === "RU" ? "Важная информация" : "Wichtige Informationen"}
                      </h3>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {getLocalizedText(tour.important_info_en, tour.important_info_uz, tour.important_info_ru, tour.important_info_de)}
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="itinerary" className="mt-6">
                  <h2 className="text-2xl font-bold mb-6">
                    {language === "UZ" ? "Batafsil marshrutni" : language === "EN" ? "Itinerary" : language === "RU" ? "Подробный маршрут" : "Detaillierte Reiseroute"}
                  </h2>
                  {(() => {
                    const itineraryText = getLocalizedText(tour.itinerary_en, tour.itinerary_uz, tour.itinerary_ru, tour.itinerary_de);
                    
                    if (!itineraryText) {
                      return (
                        <div className="text-muted-foreground">
                          {language === "UZ" ? "Marshrutni ma'lumoti yo'q" : language === "EN" ? "No itinerary information available" : language === "RU" ? "Информация о маршруте недоступна" : "Keine Reiseverlaufsinformationen verfügbar"}
                        </div>
                      );
                    }

                    try {
                      const itineraryData = JSON.parse(itineraryText);
                      
                      return (
                        <div className="space-y-6">
                          {/* Starting Location */}
                          {itineraryData.starting_location && (
                            <div className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold flex-shrink-0">
                                  S
                                </div>
                                <div className="w-1 h-full bg-primary/30 mt-2" style={{ minHeight: '40px' }} />
                              </div>
                              <div className="flex-1 pb-6">
                                <div className="text-lg font-semibold mb-1">
                                  {language === "UZ" ? "Boshlang'ich joylashuv:" : language === "EN" ? "Starting location:" : language === "RU" ? "Начальная локация:" : "Startort:"}
                                </div>
                                <p className="text-foreground">{itineraryData.starting_location}</p>
                              </div>
                            </div>
                          )}

                          {/* Stops */}
                          {itineraryData.stops && itineraryData.stops.map((stop: any, index: number) => (
                            <div key={index} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-secondary border-2 border-primary flex items-center justify-center flex-shrink-0">
                                  <MapPin className="w-5 h-5" />
                                </div>
                                {index < itineraryData.stops.length - 1 && (
                                  <div className="w-1 h-full bg-primary/30 mt-2" style={{ minHeight: '40px' }} />
                                )}
                              </div>
                              <div className="flex-1 pb-6">
                                <h3 className="text-lg font-semibold mb-2">{stop.title}</h3>
                                <p className="text-foreground mb-2">{stop.description}</p>
                                {stop.extra_fee && (
                                  <Badge variant="outline" className="text-muted-foreground">
                                    {language === "UZ" ? "Qo'shimcha to'lov" : language === "EN" ? "Extra fee" : language === "RU" ? "Дополнительная плата" : "Zusätzliche Gebühr"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    } catch (error) {
                      // Fallback to plain text if JSON parsing fails
                      return (
                        <div className="text-muted-foreground whitespace-pre-line">
                          {itineraryText}
                        </div>
                      );
                    }
                  })()}
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <h2 className="text-2xl font-bold mb-6">
                    {language === "UZ" ? "Sharhlar" : language === "EN" ? "Reviews" : language === "RU" ? "Отзывы" : "Bewertungen"} ({reviews.length})
                  </h2>

                  {/* Review Form */}
                  <form onSubmit={handleSubmitReview} className="bg-muted/30 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4">
                      {language === "UZ" ? "Izoh qoldiring" : language === "EN" ? "Leave a review" : language === "RU" ? "Оставить отзыв" : "Bewertung hinterlassen"}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {language === "UZ" ? "Ismingiz" : language === "EN" ? "Your name" : language === "RU" ? "Ваше имя" : "Ihr Name"}
                        </label>
                        <Input
                          value={reviewForm.guest_name}
                          onChange={(e) => setReviewForm({ ...reviewForm, guest_name: e.target.value })}
                          placeholder={language === "UZ" ? "Ismingizni kiriting" : language === "EN" ? "Enter your name" : language === "RU" ? "Введите ваше имя" : "Geben Sie Ihren Namen ein"}
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {language === "UZ" ? "Reyting" : language === "EN" ? "Rating" : language === "RU" ? "Рейтинг" : "Bewertung"}
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() => setReviewForm({ ...reviewForm, rating })}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`h-6 w-6 ${
                                  rating <= reviewForm.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {language === "UZ" ? "Izohingiz" : language === "EN" ? "Your review" : language === "RU" ? "Ваш отзыв" : "Ihre Bewertung"}
                        </label>
                        <Textarea
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          placeholder={language === "UZ" ? "Tajribangizni ulashing..." : language === "EN" ? "Share your experience..." : language === "RU" ? "Поделитесь своим опытом..." : "Teilen Sie Ihre Erfahrung..."}
                          rows={4}
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {language === "UZ" ? "Rasmlar (ixtiyoriy)" : language === "EN" ? "Images (optional)" : language === "RU" ? "Изображения (опционально)" : "Bilder (optional)"}
                        </label>
                        <div className="space-y-3">
                          <label className="flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageChange}
                              className="hidden"
                              disabled={reviewForm.images.length >= 5}
                            />
                            <Upload className="h-5 w-5" />
                            <span className="text-sm">
                              {language === "UZ" ? "Rasm yuklash (maksimal 5 ta)" : 
                               language === "EN" ? "Upload images (max 5)" :
                               language === "RU" ? "Загрузить изображения (макс. 5)" :
                               "Bilder hochladen (max. 5)"}
                            </span>
                          </label>
                          
                          {reviewForm.images.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                              {reviewForm.images.map((image, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={URL.createObjectURL(image)}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {language === "UZ" ? "Yuklanmoqda..." : language === "EN" ? "Submitting..." : language === "RU" ? "Отправка..." : "Senden..."}
                          </>
                        ) : (
                          language === "UZ" ? "Izoh qoldirish" : language === "EN" ? "Submit Review" : language === "RU" ? "Отправить отзыв" : "Bewertung abgeben"
                        )}
                      </Button>
                    </div>
                  </form>

                  {/* Reviews List */}
                  <div className="space-y-6">
                    {reviews.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        {language === "UZ" ? "Hozircha sharhlar yo'q" : language === "EN" ? "No reviews yet" : language === "RU" ? "Пока нет отзывов" : "Noch keine Bewertungen"}
                      </p>
                    ) : (
                      reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold">{review.guest_name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(review.created_at).toLocaleDateString(
                                    language === "UZ" ? "uz-UZ" :
                                    language === "RU" ? "ru-RU" :
                                    language === "DE" ? "de-DE" :
                                    "en-US"
                                  )}
                                </span>
                              </div>
                            </div>
                            {isAdmin && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteReview(review.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <p className="text-muted-foreground mb-3">{review.comment}</p>
                          
                          {review.image_urls && review.image_urls.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3">
                              {review.image_urls.map((url: string, index: number) => (
                                <img
                                  key={index}
                                  src={url}
                                  alt={`Review image ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => window.open(url, '_blank')}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-2xl border shadow-lg p-6">
                <div className="mb-6">
                  <div className="text-sm text-muted-foreground mb-1">
                    {language === "UZ" ? "dan boshlab" : language === "EN" ? "From" : language === "RU" ? "От" : "Ab"}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary">
                      ${tour.price}
                    </span>
                    <span className="text-muted-foreground">
                      {language === "UZ" ? "/ kishi" : language === "EN" ? "/ person" : language === "RU" ? "/ человек" : "/ Person"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>{getLocalizedText(tour.location_en, tour.location_uz, tour.location_ru, tour.location_de)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full mb-3" 
                  size="lg"
                  onClick={() => navigate("/checkout", { 
                    state: { 
                      tourId: tour.id,
                      tourTitle: getLocalizedText(tour.title_en, tour.title_uz, tour.title_ru, tour.title_de),
                      price: tour.price,
                      duration: tour.duration,
                      location: getLocalizedText(tour.location_en, tour.location_uz, tour.location_ru, tour.location_de)
                    } 
                  })}
                >
                  {language === "UZ" ? "Hozir band qilish" : language === "EN" ? "Book Now" : language === "RU" ? "Забронировать сейчас" : "Jetzt buchen"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  {language === "UZ" ? "24 soat oldin bepul bekor qilish" : 
                   language === "EN" ? "Free cancellation up to 24 hours before" : 
                   language === "RU" ? "Бесплатная отмена за 24 часа" : 
                   "Kostenlose Stornierung bis 24 Stunden vorher"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default TourDetails;
