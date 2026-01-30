import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './contexts/AppContext';
import { useRouter, ViewState } from './utils/router';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { ChatBot } from './components/ChatBot';

// Views
import { HomeView } from './views/HomeView';
import { ProductsView } from './views/ProductsView';
import { WhyUsView } from './views/WhyUsView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';

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
        <main className="flex-grow">
          {route === 'home' && <HomeView onNavigate={navigate} />}
          {route === 'products' && <ProductsView />}
          {route === 'whyus' && <WhyUsView />}
          {route === 'profile' && <ProfileView />}
          {route === 'admin' && <AdminView />}
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