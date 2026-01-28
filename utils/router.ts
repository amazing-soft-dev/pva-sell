import { useState, useEffect } from 'react';

export type ViewState = 'home' | 'profile' | 'products' | 'whyus';

export const useRouter = () => {
  const getRoute = (): ViewState => {
    const hash = window.location.hash.replace('#/', '');
    // Check if the hash matches a valid view, otherwise default to home
    if (['home', 'profile', 'products', 'whyus'].includes(hash)) {
      return hash as ViewState;
    }
    return 'home';
  };

  const [route, setRoute] = useState<ViewState>(getRoute());

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRoute());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (view: ViewState) => {
    window.location.hash = `/${view}`;
  };

  return { route, navigate };
};