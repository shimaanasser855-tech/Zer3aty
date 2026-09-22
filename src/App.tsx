import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nProvider } from '@/contexts/I18nContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { ToastProvider } from '@/contexts/ToastContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Plants from '@/pages/Plants';
import PlantDetails from '@/pages/PlantDetails';
import HomeGardening from '@/pages/HomeGardening';
import SchoolGardening from '@/pages/SchoolGardening';
import NaturalFarming from '@/pages/NaturalFarming';
import Fertilizers from '@/pages/Fertilizers';
import PestManagement from '@/pages/PestManagement';
import SmartAgriculture from '@/pages/SmartAgriculture';
import InnovationLab from '@/pages/InnovationLab';
import AIDoctor from '@/pages/AIDoctor';
import Academy from '@/pages/Academy';
import CourseDetails from '@/pages/CourseDetails';
import Articles from '@/pages/Articles';
import ArticleDetails from '@/pages/ArticleDetails';
import Store from '@/pages/Store';
import ProductDetails from '@/pages/ProductDetails';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Wishlist from '@/pages/Wishlist';
import Contact from '@/pages/Contact';
import FAQ from '@/pages/FAQ';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Search from '@/pages/Search';
import NotFound from '@/pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ToastProvider>
                <ScrollToTop />
                <div className="min-h-screen flex flex-col bg-[#fafaf7]">
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/plants" element={<Plants />} />
                      <Route path="/plants/:slug" element={<PlantDetails />} />
                      <Route path="/home-gardening" element={<HomeGardening />} />
                      <Route path="/school-gardening" element={<SchoolGardening />} />
                      <Route path="/natural-farming" element={<NaturalFarming />} />
                      <Route path="/fertilizers" element={<Fertilizers />} />
                      <Route path="/pest-management" element={<PestManagement />} />
                      <Route path="/smart-agriculture" element={<SmartAgriculture />} />
                      <Route path="/innovation-lab" element={<InnovationLab />} />
                      <Route path="/ai-doctor" element={<AIDoctor />} />
                      <Route path="/academy" element={<Academy />} />
                      <Route path="/academy/:slug" element={<CourseDetails />} />
                      <Route path="/articles" element={<Articles />} />
                      <Route path="/articles/:slug" element={<ArticleDetails />} />
                      <Route path="/store" element={<Store />} />
                      <Route path="/store/:slug" element={<ProductDetails />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/search" element={<Search />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </I18nProvider>
    </BrowserRouter>
  );
}
