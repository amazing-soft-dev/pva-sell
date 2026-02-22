import React, { useState, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AppProvider } from './contexts/AppContext';
import { useRouter, ViewState } from './utils/router';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { ChatBot } from './components/ChatBot';

// Lazy load views
const HomeView = React.lazy(() => import('./views/HomeView').then(module => ({ default: module.HomeView })));
const ProductsView = React.lazy(() => import('./views/ProductsView').then(module => ({ default: module.ProductsView })));
const WhyUsView = React.lazy(() => import('./views/WhyUsView').then(module => ({ default: module.WhyUsView })));
const ProfileView = React.lazy(() => import('./views/ProfileView').then(module => ({ default: module.ProfileView })));
const AdminView = React.lazy(() => import('./views/AdminView').then(module => ({ default: module.AdminView })));

const LoadingFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
  </div>
);

const App = () => {
  const { route, navigate } = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
        <Navbar 
          currentView={route} 
          onNavigate={navigate} 
          onOpenAuth={() => setAuthOpen(true)} 
          onOpenCart={() => setCartOpen(true)} 
        />
        <main className="grow">
          <Suspense fallback={<LoadingFallback />}>
            {route === 'home' && <HomeView onNavigate={navigate} />}
            {route === 'products' && <ProductsView />}
            {route === 'whyus' && <WhyUsView />}
            {route === 'profile' && <ProfileView />}
            {route === 'admin' && <AdminView />}
          </Suspense>
        </main>
        <Footer onNavigate={navigate} />
        <ChatBot />
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </AppProvider>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}