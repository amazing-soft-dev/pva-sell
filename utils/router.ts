import { useState, useEffect } from 'react';

export type ViewState = 'home' | 'profile' | 'products' | 'whyus';

export const useRouter = () => {
  // Get the base URL safely. Vite replaces import.meta.env.BASE_URL at build time.
  // We use optional chaining and a fallback in case the replacement doesn't happen or env is undefined.
  const baseUrl = (import.meta as any).env?.BASE_URL || '/pva-sell/';

  const getRoute = (): ViewState => {
    let path = window.location.pathname;
    
    // Remove the base URL from the beginning of the path if present
    if (path.startsWith(baseUrl)) {
      path = path.slice(baseUrl.length);
    } else if (path.startsWith('/')) {
      // Fallback for cases where baseUrl might not be strictly followed in dev
      // Clean up leading slash
       path = path.slice(1);
    }
    
    // Remove any remaining leading slash
    path = path.replace(/^\//, '');

    // Check if the path matches a valid view, otherwise default to home
    if (['home', 'profile', 'products', 'whyus'].includes(path)) {
      return path as ViewState;
    }
    return 'home';
  };

  const [route, setRoute] = useState<ViewState>(getRoute());

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getRoute());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (view: ViewState) => {
    // If navigating to home, we use the root path of the base
    const pathSuffix = view === 'home' ? '' : view;
    // Construct the full URL including the base path
    const url = `${baseUrl}${pathSuffix}`;
    
    window.history.pushState(null, '', url);
    setRoute(view);
  };

  return { route, navigate };
};