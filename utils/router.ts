import { useState, useEffect } from 'react';

export type ViewState = 'home' | 'profile' | 'products' | 'whyus';

export const useRouter = () => {
  const getRoute = (): ViewState => {
    const path = window.location.pathname.replace('/', '');
    // Check if the path matches a valid view, otherwise default to home
    if (['home', 'profile', 'products', 'whyus'].includes(path)) {
      return path as ViewState;
    }
    return 'home';
  };

  const [route, setRoute] = useState<ViewState>(getRoute());

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(getRoute());
    };

    // Listen to browser back/forward buttons
    window.addEventListener('popstate', handleRouteChange);
    
    // Listen to custom pushstate event for internal navigation
    window.addEventListener('pushstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('pushstate', handleRouteChange);
    };
  }, []);

  const navigate = (view: ViewState) => {
    window.history.pushState({}, '', `/${view}`);
    // Dispatch a custom event so the hook detects the change
    window.dispatchEvent(new Event('pushstate'));
    window.scrollTo(0, 0);
  };

  return { route, navigate };
};