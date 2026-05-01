import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/services/api";

type UserRole = "user" | "partner" | "admin";

type User = {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  is_staff: boolean;
  is_superuser: boolean;
};

type RegisterPayload = {
  username: string;
  password: string;
  email: string;
  full_name: string;
  phone: string;
  role: "user" | "partner";
  business_name?: string;
  activity_type?: string;
  description?: string;
  address?: string;
  region_id?: number;
  latitude?: number;
  longitude?: number;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = async () => {
    try {
      const response = await api.get("/auth/me/");
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post("/auth/login/", {
        username,
        password,
      });

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      setUser(response.data.user);
      return true;
    } catch (error) {
      return false;
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const response = await api.post("/auth/register/", payload);

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      setUser(response.data.user);
      return { success: true };
    } catch (error: any) {
      let message = "Erreur lors de l'inscription.";
      
      // Try to extract error message from various DRF response formats
      if (error?.response?.data) {
        const data = error.response.data;
        
        // Check for direct error/detail properties
        if (data.error) {
          message = typeof data.error === 'string' ? data.error : data.error[0];
        } else if (data.detail) {
          message = typeof data.detail === 'string' ? data.detail : data.detail[0];
        } else {
          // Check for field validation errors
          const errors = Object.entries(data).find(([_, value]: any) => {
            return Array.isArray(value) && value.length > 0;
          });
          if (errors) {
            const [field, messages] = errors;
            const errorMsg = Array.isArray(messages) ? messages[0] : messages;
            message = `${field}: ${errorMsg}`;
          }
        }
      }
      
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem("refresh_token");

      if (refresh) {
        await api.post("/auth/logout/", { refresh });
      }
    } catch (error) {
      console.error("Erreur logout", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");

      if (token) {
        await refreshMe();
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshMe,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};