import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import ScrollToTop from "@/components/ScrollToTop";
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
import Hotels from "./pages/Hotels";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminDestinations from "./pages/admin/Destinations";
import AdminTours from "./pages/admin/Tours";
import AdminCategories from "./pages/admin/Categories";
import AdminBookings from "./pages/admin/Bookings";
import AdminReviews from "./pages/admin/Reviews";
import AdminHotels from "./pages/admin/Hotels";
import AdminMenuItems from "./pages/admin/MenuItems";
import AdminAbout from "./pages/admin/About";
import AdminHomepage from "./pages/admin/Homepage";
import AdminFooter from "./pages/admin/Footer";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/tours/:id" element={<TourDetails />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/tours" element={<Tours />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/about" element={<About />} />
                <Route path="/hotels" element={<Hotels />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="homepage" element={<AdminHomepage />} />
                  <Route path="destinations" element={<AdminDestinations />} />
                  <Route path="tours" element={<AdminTours />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="bookings" element={<AdminBookings />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="hotels" element={<AdminHotels />} />
                  <Route path="menu-items" element={<AdminMenuItems />} />
                  <Route path="about" element={<AdminAbout />} />
                  <Route path="footer" element={<AdminFooter />} />
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
  </HelmetProvider>
);

export default App;
