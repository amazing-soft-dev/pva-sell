import { useState, useEffect } from 'react';

export type ViewState = 'home' | 'profile' | 'products' | 'whyus';

export const useRouter = () => {
  const getRoute = (): ViewState => {
    const path = window.location.pathname.replace(/^\//, '');
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
    window.history.pushState(null, '', `/${view}`);
    setRoute(view);
  };

  return { route, navigate };
};