import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type User, mockUsers } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'user' | 'partner') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('explore_tunisia_user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('explore_tunisia_user', JSON.stringify(user));
    else localStorage.removeItem('explore_tunisia_user');
  }, [user]);

  const login = async (email: string, _password: string) => {
    const found = mockUsers.find(u => u.email === email);
    if (found) { setUser(found); return true; }
    // Simulate: any email works as user
    const newUser: User = { id: `u_${Date.now()}`, name: email.split('@')[0], email, role: 'user' };
    setUser(newUser);
    return true;
  };

  const register = async (name: string, email: string, _password: string, role: 'user' | 'partner') => {
    const newUser: User = { id: `u_${Date.now()}`, name, email, role };
    setUser(newUser);
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
