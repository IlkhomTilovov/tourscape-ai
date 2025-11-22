import { Link } from "react-router-dom";

interface DestinationCardProps {
  name: string;
  country: string;
  image: string;
  tourCount: number;
  slug: string;
}

const DestinationCard = ({
  name,
  country,
  image,
  tourCount,
  slug,
}: DestinationCardProps) => {
  return (
    <Link to={`/destination/${slug}`}>
      <div className="card-elevated rounded-xl overflow-hidden bg-card group cursor-pointer">
        <div className="relative h-64 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-1">{name}</h3>
            <p className="text-sm text-white/90 mb-2">{country}</p>
            <p className="text-sm text-white/80">{tourCount} experiences</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;
