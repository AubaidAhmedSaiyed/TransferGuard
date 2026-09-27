import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  industry: string;
  currency: string;
  approvalModel: 'dual_threshold' | 'universal_dual' | 'single_callback';
  dualControlThreshold: number;
  callbackThreshold: number;
  requireBeneficiaryLock: boolean;
  trustedApprovers: {
    name: string;
    email: string;
    role: string;
  }[];
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  org: Organization | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, orgName?: string) => Promise<boolean>;
  demoLogin: () => Promise<boolean>;
  completeOnboarding: (orgData: Partial<Organization>) => void;
  updateOrg: (orgData: Partial<Organization>) => void;
  logout: () => void;
}

const DEFAULT_ORG: Organization = {
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

const DEFAULT_USER: User = {
  id: 'usr-sarah-lin',
  name: 'Sarah Lin',
  email: 's.lin@acmeglobal.com',
  role: 'Head of Treasury Operations'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('tg_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [org, setOrg] = useState<Organization | null>(() => {
    try {
      const saved = localStorage.getItem('tg_org');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    try {
      return localStorage.getItem('tg_onboarded') === 'true';
    } catch {
      return false;
    }
  });

  const isAuthenticated = !!user;

  useEffect(() => {
    if (user) {
      localStorage.setItem('tg_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tg_user');
    }
  }, [user]);

  useEffect(() => {
    if (org) {
      localStorage.setItem('tg_org', JSON.stringify(org));
    } else {
      localStorage.removeItem('tg_org');
    }
  }, [org]);

  useEffect(() => {
    localStorage.setItem('tg_onboarded', isOnboarded ? 'true' : 'false');
  }, [isOnboarded]);

  const login = async (email: string): Promise<boolean> => {
    const loggedUser: User = {
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

  const signup = async (name: string, email: string, orgName?: string): Promise<boolean> => {
    const newUser: User = {
      id: 'usr-' + Math.random().toString(36).substring(2, 8),
      name,
      email,
      role: 'Lead Approver'
    };
    const newOrg: Organization = {
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

  const demoLogin = async (): Promise<boolean> => {
    setUser(DEFAULT_USER);
    setOrg(DEFAULT_ORG);
    setIsOnboarded(true);
    return true;
  };

  const completeOnboarding = (orgData: Partial<Organization>) => {
    if (org) {
      const updated = { ...org, ...orgData };
      setOrg(updated);
    } else {
      setOrg({ ...DEFAULT_ORG, ...orgData });
    }
    setIsOnboarded(true);
  };

  const updateOrg = (orgData: Partial<Organization>) => {
    if (org) {
      setOrg({ ...org, ...orgData });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tg_user');
  };

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
