import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [travelers, setTravelers] = useState("2");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?location=${location}&date=${date}&travelers=${travelers}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 max-w-5xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location */}
        <div className="flex items-center space-x-3 p-3 rounded-lg border border-border focus-within:border-primary transition-colors">
          <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div className="flex-1">
            <label className="text-xs text-muted-foreground block">
              Where to?
            </label>
            <Input
              type="text"
              placeholder="City or attraction"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-0 p-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center space-x-3 p-3 rounded-lg border border-border focus-within:border-primary transition-colors">
          <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div className="flex-1">
            <label className="text-xs text-muted-foreground block">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-0 p-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* Travelers */}
        <div className="flex items-center space-x-3 p-3 rounded-lg border border-border focus-within:border-primary transition-colors">
          <Users className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div className="flex-1">
            <label className="text-xs text-muted-foreground block">
              Travelers
            </label>
            <Input
              type="number"
              min="1"
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
              className="border-0 p-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* Search Button */}
        <Button
          type="submit"
          size="lg"
          className="hero-gradient text-white h-auto py-4"
        >
          <Search className="h-5 w-5 mr-2" />
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
