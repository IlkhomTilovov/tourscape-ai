import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Star,
  Clock,
  MapPin,
  Calendar,
  Users,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
} from "lucide-react";

const TourDetails = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    guest_name: "",
    rating: 5,
    comment: "",
  });

  const images = [
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=1600&q=80",
  ];

  const tour = {
    title: "Eiffel Tower: Summit Access with Guided Tour",
    location: "Paris, France",
    rating: 4.8,
    reviewCount: 12453,
    duration: "2 hours",
    category: "Landmarks & Monuments",
    price: 89,
    bestseller: true,
  };

  const includes = [
    "Skip-the-line ticket",
    "Expert guide",
    "Summit access",
    "Audio guide",
  ];

  const notIncludes = ["Hotel pickup", "Food & drinks", "Gratuities"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Fetch reviews
  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id]);

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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewForm.guest_name.trim() || !reviewForm.comment.trim()) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("reviews").insert({
      tour_id: id,
      guest_name: reviewForm.guest_name.trim(),
      rating: reviewForm.rating,
      comment: reviewForm.comment.trim(),
    });

    if (error) {
      toast.error("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring");
      console.error("Error submitting review:", error);
    } else {
      toast.success("Izoh muvaffaqiyatli qo'shildi!");
      setReviewForm({ guest_name: "", rating: 5, comment: "" });
      fetchReviews();
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-4">
          Home / Paris / {tour.category}
        </div>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              {tour.bestseller && (
                <Badge className="mb-2 bg-accent text-accent-foreground">
                  Bestseller
                </Badge>
              )}
              <h1 className="text-4xl font-bold mb-2">{tour.title}</h1>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-foreground">
                    {tour.rating}
                  </span>
                  <span>({tour.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-5 w-5" />
                  <span>{tour.location}</span>
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
                alt={tour.title}
                className="w-full h-full object-cover"
              />
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
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">About this experience</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Experience the magic of the Eiffel Tower with skip-the-line access
                    and an expert guide. Learn about the history of this iconic landmark
                    as you ascend to the summit for breathtaking panoramic views of Paris.
                    This comprehensive tour includes access to all levels, including the
                    exclusive summit where you can see the entire city spread out below.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      What's included
                    </h3>
                    <ul className="space-y-2">
                      {includes.map((item) => (
                        <li key={item} className="flex items-start">
                          <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <X className="h-5 w-5 text-red-600 mr-2" />
                      Not included
                    </h3>
                    <ul className="space-y-2">
                      {notIncludes.map((item) => (
                        <li key={item} className="flex items-start">
                          <X className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Important information
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Please arrive 15 minutes before departure</li>
                    <li>• Comfortable walking shoes recommended</li>
                    <li>• Not wheelchair accessible</li>
                    <li>• Free cancellation up to 24 hours before</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="itinerary" className="mt-6">
                <h2 className="text-2xl font-bold mb-6">Detailed itinerary</h2>
                <div className="space-y-6">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center text-white font-semibold">
                          {step}
                        </div>
                        {step < 3 && (
                          <div className="w-0.5 h-full bg-border mt-2" />
                        )}
                      </div>
                      <div className="pb-8">
                        <h3 className="text-lg font-semibold mb-2">
                          Step {step}
                        </h3>
                        <p className="text-muted-foreground">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                          Sed do eiusmod tempor incididunt ut labore et dolore magna
                          aliqua.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <h2 className="text-2xl font-bold mb-6">Customer reviews</h2>
                
                {/* Review Form */}
                <div className="bg-card border border-border rounded-xl p-6 mb-8">
                  <h3 className="text-xl font-semibold mb-4">Izoh qoldiring</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Ismingiz
                      </label>
                      <Input
                        value={reviewForm.guest_name}
                        onChange={(e) =>
                          setReviewForm({ ...reviewForm, guest_name: e.target.value })
                        }
                        placeholder="Ismingizni kiriting"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Reyting
                      </label>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setReviewForm({ ...reviewForm, rating: star })
                            }
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-8 w-8 ${
                                star <= reviewForm.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Izoh
                      </label>
                      <Textarea
                        value={reviewForm.comment}
                        onChange={(e) =>
                          setReviewForm({ ...reviewForm, comment: e.target.value })
                        }
                        placeholder="Tajribangiz haqida yozing..."
                        rows={4}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full hero-gradient text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Yuborilmoqda..." : "Izoh yuborish"}
                    </Button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-card border border-border rounded-xl p-6"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">
                              {review.guest_name}
                            </h4>
                            <div className="flex items-center space-x-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString("uz-UZ", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Hozircha izohlar yo'q. Birinchi bo'lib izoh qoldiring!
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="location" className="mt-6">
                <h2 className="text-2xl font-bold mb-6">Meeting point</h2>
                <div className="bg-muted rounded-xl h-96 flex items-center justify-center">
                  <p className="text-muted-foreground">Map will be displayed here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline mb-2">
                  <span className="text-sm text-muted-foreground">From </span>
                  <span className="text-4xl font-bold ml-2">${tour.price}</span>
                  <span className="text-muted-foreground ml-1">/person</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Select date
                  </Label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    <Users className="h-4 w-4 inline mr-2" />
                    Number of travelers
                  </Label>
                  <input
                    type="number"
                    min="1"
                    defaultValue="2"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    <Clock className="h-4 w-4 inline mr-2" />
                    Select time
                  </Label>
                  <select className="w-full px-4 py-3 rounded-lg border border-input bg-background">
                    <option>10:00 AM</option>
                    <option>2:00 PM</option>
                    <option>6:00 PM</option>
                  </select>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full hero-gradient text-white mb-4"
              >
                Book now
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Free cancellation up to 24 hours before
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <label className={className}>{children}</label>
);

export default TourDetails;
