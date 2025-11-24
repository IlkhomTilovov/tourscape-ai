import { Link } from "react-router-dom";
import { Star, Clock, MapPin, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";

interface TourCardProps {
  id: string;
  image: string;
  title: string;
  location: string;
  duration: string;
  rating: number;
  reviewCount: number;
  price: number;
  category: string;
  bestseller?: boolean;
}

const TourCard = ({
  id,
  image,
  title,
  location,
  duration,
  rating,
  reviewCount,
  price,
  category,
  bestseller,
}: TourCardProps) => {
  const { t } = useLanguage();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id,
      title,
      price,
      duration,
      image_url: image,
    });
  };
  
  return (
    <Link to={`/tour/${id}`}>
      <div className="card-elevated rounded-xl overflow-hidden bg-card group cursor-pointer">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {bestseller && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
              {t("bestseller")}
            </Badge>
          )}
          <Badge className="absolute top-3 right-3 bg-background/90 text-foreground">
            {category}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-lg line-clamp-2 text-card-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Location & Duration */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-sm">{rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({reviewCount} {t("reviews")})
            </span>
          </div>

          {/* Price */}
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <span className="text-sm text-muted-foreground">{t("from")} </span>
                <span className="text-2xl font-bold text-foreground">
                  ${price}
                </span>
                <span className="text-sm text-muted-foreground"> {t("perPerson")}</span>
              </div>
              <Button 
                size="icon" 
                variant="secondary"
                onClick={handleAddToCart}
                className="shrink-0"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;
