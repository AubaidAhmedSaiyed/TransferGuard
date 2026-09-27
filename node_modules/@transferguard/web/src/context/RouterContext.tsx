import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppRoute = 
  | '/'
  | '/login'
  | '/signup'
  | '/onboarding'
  | '/app'
  | '/app/transfers'
  | '/app/transfers/new'
  | '/app/approvals'
  | '/app/policies'
  | '/app/evidence'
  | '/app/audit'
  | '/app/settings';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    if (to !== path) {
      window.history.pushState({}, '', to);
      setPath(to);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Helper to extract params, e.g. for /app/transfers/:id
  const params: Record<string, string> = {};
  if (path.startsWith('/app/transfers/') && path !== '/app/transfers/new') {
    const id = path.replace('/app/transfers/', '');
    if (id) {
      params.id = id;
    }
  }

  return (
    <RouterContext.Provider value={{ path, navigate, params }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
