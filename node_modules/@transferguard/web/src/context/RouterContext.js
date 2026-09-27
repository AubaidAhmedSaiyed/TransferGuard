import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
const RouterContext = createContext(undefined);
export const RouterProvider = ({ children }) => {
    const [path, setPath] = useState(() => {
        return window.location.pathname || '/';
    });
    useEffect(() => {
        const handlePopState = () => {
            setPath(window.location.pathname || '/');
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);
    const navigate = (to) => {
        if (to !== path) {
            window.history.pushState({}, '', to);
            setPath(to);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    // Helper to extract params, e.g. for /app/transfers/:id
    const params = {};
    if (path.startsWith('/app/transfers/') && path !== '/app/transfers/new') {
        const id = path.replace('/app/transfers/', '');
        if (id) {
            params.id = id;
        }
    }
    return (_jsx(RouterContext.Provider, { value: { path, navigate, params }, children: children }));
};
export const useRouter = () => {
    const context = useContext(RouterContext);
    if (!context) {
        throw new Error('useRouter must be used within a RouterProvider');
    }
    return context;
};
