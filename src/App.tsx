import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import TourDetails from "./pages/TourDetails";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Tours from "./pages/Tours";
import Categories from "./pages/Categories";
import Destinations from "./pages/Destinations";
import About from "./pages/About";
import Flights from "./pages/Flights";
import Hotels from "./pages/Hotels";
import Visas from "./pages/Visas";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminDestinations from "./pages/admin/Destinations";
import AdminTours from "./pages/admin/Tours";
import AdminCategories from "./pages/admin/Categories";
import AdminFlights from "./pages/admin/Flights";
import AdminHotels from "./pages/admin/Hotels";
import AdminVisas from "./pages/admin/Visas";
import AdminMenuItems from "./pages/admin/MenuItems";
import AdminAbout from "./pages/admin/About";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <CartProvider>
            <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/tour/:id" element={<TourDetails />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/tours" element={<Tours />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/about" element={<About />} />
              <Route path="/flights" element={<Flights />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/visas" element={<Visas />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="destinations" element={<AdminDestinations />} />
                <Route path="tours" element={<AdminTours />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="flights" element={<AdminFlights />} />
                <Route path="hotels" element={<AdminHotels />} />
                <Route path="visas" element={<AdminVisas />} />
                <Route path="menu-items" element={<AdminMenuItems />} />
                <Route path="about" element={<AdminAbout />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </LanguageProvider>
      </AuthProvider>
  </QueryClientProvider>
);

export default App;
