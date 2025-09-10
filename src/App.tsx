
import { Switch, Route, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Components
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TermsModal from '@/components/TermsModal';
import PrivacyModal from '@/components/PrivacyModal';
import SuspensionBlocker from '@/components/SuspensionBlocker';

// Pages
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import Admin from "@/pages/Admin";
import Auth from "@/pages/Auth";
import Orders from "@/pages/Orders";
import ProfileSafe from "@/pages/ProfileSafe";
import Cart from "@/pages/Cart";
import Creator from "@/pages/Creator";
import Favorites from "@/pages/Favorites";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import CompleteProfile from "@/pages/CompleteProfile";
import AdminSupport from "@/pages/AdminSupport";
import AdminSettings from "@/pages/AdminSettings";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/useAuth";
import { SpeedInsights } from '@vercel/speed-insights/react';

function Router() {
  const [location, setLocation] = useLocation();
  const { user, needsProfileSetup, loading, setShowAuthModal, setShowProfileModal, showProfileModal } = useAuth();

  // Scroll para o topo quando a rota mudar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Auto-mostrar modal de profile quando necessário
  useEffect(() => {
    if (!loading && user && needsProfileSetup) {
      console.log('🔄 Mostrando modal de complete-profile - needsProfileSetup:', needsProfileSetup);
      setShowProfileModal(true);
    }
  }, [user, needsProfileSetup, loading, setShowProfileModal]);

  // Auto-mostrar modal de auth para usuários não logados tentando acessar páginas protegidas
  useEffect(() => {
    const protectedRoutes = ['/orders', '/profile', '/cart', '/admin', '/favorites'];
    if (!loading && !user && protectedRoutes.includes(location)) {
      console.log('🔐 Usuário não logado tentando acessar página protegida:', location);
      setShowAuthModal(true);
      setLocation('/'); // Redirecionar para home
    }
  }, [user, loading, location, setShowAuthModal, setLocation]);

  // Render loading state without early return to maintain hook order
  const isLoading = loading;

  return (
    <div className="min-h-screen flex flex-col max-w-7xl mx-auto w-full">
      {isLoading ? (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          <Header />
          <main className="flex-1 container mx-auto px-4 w-full">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/catalog" component={Home} />
              <Route path="/product/:id" component={ProductDetail} />
              <Route path="/admin" component={Admin} />
              <Route path="/admin/support" component={AdminSupport} />
              <Route path="/admin/settings" component={AdminSettings} />
              <Route path="/orders" component={Orders} />
              <Route path="/profile" component={ProfileSafe} />
              <Route path="/cart" component={Cart} />
              <Route path="/creator/:id" component={Creator} />
              <Route path="/favorites" component={Favorites} />
              <Route path="/privacy-policy" component={PrivacyPolicy} />
              <Route path="/terms-of-service" component={TermsOfService} />
              <Route path="/about" component={About} />
              <Route path="/contact" component={Contact} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

function AppContent() {
  const { showAuthModal, setShowAuthModal, showProfileModal, setShowProfileModal, user, loading, needsProfileSetup, suspensionData, logout, isSuspendedOrBanned } = useAuth();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Escutar eventos customizados para abrir os modais
  useEffect(() => {
    const handleShowTerms = () => {
      console.log('🔥 Evento show-terms-modal recebido!');
      setShowTermsModal(true);
    };
    const handleShowPrivacy = () => {
      console.log('🔥 Evento show-privacy-modal recebido!');
      setShowPrivacyModal(true);
    };

    window.addEventListener('show-terms-modal', handleShowTerms as EventListener);
    window.addEventListener('show-privacy-modal', handleShowPrivacy as EventListener);

    return () => {
      window.removeEventListener('show-terms-modal', handleShowTerms as EventListener);
      window.removeEventListener('show-privacy-modal', handleShowPrivacy as EventListener);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show suspension blocker if user is suspended or banned
  if (user && isSuspendedOrBanned() && suspensionData) {
    return (
      <SuspensionBlocker
        suspensionType={suspensionData.type}
        reason={suspensionData.reason}
        expiresAt={suspensionData.expiresAt}
        onLogout={logout}
      />
    );
  }

  // Show complete profile modal if user needs to set up profile (only if modal is not shown)
  if (user && needsProfileSetup === true && !showProfileModal) {
    console.log('🔄 Usuário precisa completar perfil');
    return <CompleteProfile />;
  }

  return (
    <TooltipProvider>
      <Router />

      {/* Modal fullscreen de autenticação */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[9999] bg-background">
          <Auth />
        </div>
      )}

      {/* Modal fullscreen de completar perfil */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[9999] bg-background">
          <CompleteProfile />
        </div>
      )}

      <Toaster />
      <SpeedInsights />

      {/* Modais dos Termos e Política - Always render */}
      <TermsModal open={showTermsModal} onOpenChange={setShowTermsModal} />
      <PrivacyModal open={showPrivacyModal} onOpenChange={setShowPrivacyModal} />
    </TooltipProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
