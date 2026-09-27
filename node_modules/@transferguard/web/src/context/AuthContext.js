import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
const DEFAULT_ORG = {
    id: 'org-acme-global',
    name: 'Acme Global Treasury Corp',
    domain: 'acmeglobal.com',
    industry: 'Enterprise Technology & Logistics',
    currency: 'USD',
    approvalModel: 'dual_threshold',
    dualControlThreshold: 100000,
    callbackThreshold: 50000,
    requireBeneficiaryLock: true,
    trustedApprovers: [
        { name: 'Sarah Lin', email: 's.lin@acmeglobal.com', role: 'Head of Treasury' },
        { name: 'Marcus Vance', email: 'm.vance@acmeglobal.com', role: 'Chief Financial Officer' }
    ],
    createdAt: new Date().toISOString()
};
const DEFAULT_USER = {
    id: 'usr-sarah-lin',
    name: 'Sarah Lin',
    email: 's.lin@acmeglobal.com',
    role: 'Head of Treasury Operations'
};
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('tg_user');
            return saved ? JSON.parse(saved) : null;
        }
        catch {
            return null;
        }
    });
    const [org, setOrg] = useState(() => {
        try {
            const saved = localStorage.getItem('tg_org');
            return saved ? JSON.parse(saved) : null;
        }
        catch {
            return null;
        }
    });
    const [isOnboarded, setIsOnboarded] = useState(() => {
        try {
            return localStorage.getItem('tg_onboarded') === 'true';
        }
        catch {
            return false;
        }
    });
    const isAuthenticated = !!user;
    useEffect(() => {
        if (user) {
            localStorage.setItem('tg_user', JSON.stringify(user));
        }
        else {
            localStorage.removeItem('tg_user');
        }
    }, [user]);
    useEffect(() => {
        if (org) {
            localStorage.setItem('tg_org', JSON.stringify(org));
        }
        else {
            localStorage.removeItem('tg_org');
        }
    }, [org]);
    useEffect(() => {
        localStorage.setItem('tg_onboarded', isOnboarded ? 'true' : 'false');
    }, [isOnboarded]);
    const login = async (email) => {
        const loggedUser = {
            id: 'usr-' + Math.random().toString(36).substring(2, 8),
            name: email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
            email,
            role: 'Treasury Officer'
        };
        setUser(loggedUser);
        if (!org) {
            setOrg(DEFAULT_ORG);
            setIsOnboarded(true);
        }
        return true;
    };
    const signup = async (name, email, orgName) => {
        const newUser = {
            id: 'usr-' + Math.random().toString(36).substring(2, 8),
            name,
            email,
            role: 'Lead Approver'
        };
        const newOrg = {
            id: 'org-' + Math.random().toString(36).substring(2, 8),
            name: orgName || 'New Treasury Organization',
            domain: email.split('@')[1] || 'company.com',
            industry: 'Corporate Treasury',
            currency: 'USD',
            approvalModel: 'dual_threshold',
            dualControlThreshold: 100000,
            callbackThreshold: 50000,
            requireBeneficiaryLock: true,
            trustedApprovers: [{ name, email, role: 'Lead Approver' }],
            createdAt: new Date().toISOString()
        };
        setUser(newUser);
        setOrg(newOrg);
        setIsOnboarded(false); // Directs to onboarding wizard!
        return true;
    };
    const demoLogin = async () => {
        setUser(DEFAULT_USER);
        setOrg(DEFAULT_ORG);
        setIsOnboarded(true);
        return true;
    };
    const completeOnboarding = (orgData) => {
        if (org) {
            const updated = { ...org, ...orgData };
            setOrg(updated);
        }
        else {
            setOrg({ ...DEFAULT_ORG, ...orgData });
        }
        setIsOnboarded(true);
    };
    const updateOrg = (orgData) => {
        if (org) {
            setOrg({ ...org, ...orgData });
        }
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem('tg_user');
    };
    return (_jsx(AuthContext.Provider, { value: {
            user,
            org,
            isAuthenticated,
            isOnboarded,
            login,
            signup,
            demoLogin,
            completeOnboarding,
            updateOrg,
            logout
        }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
