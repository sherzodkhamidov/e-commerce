import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../api/axios";
import { message } from "antd";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
  ) => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<void>;
  updatePassword: (
    current_password: string,
    password: string,
    password_confirmation: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/login", { email, password });
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(token);
      setUser(user);
      message.success("Logged in successfully");
    } catch (error: any) {
      message.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
  ) => {
    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
        password_confirmation,
      });
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(token);
      setUser(user);
      message.success("Registered successfully");
    } catch (error: any) {
      message.error(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };

  const updateProfile = async (name: string, email: string) => {
    try {
      const response = await api.put("/user/profile", { name, email });
      const updatedUser = response.data.user;

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      message.success("Profile updated");
    } catch (error: any) {
      message.error(error.response?.data?.message || "Update failed");
      throw error;
    }
  };

  const updatePassword = async (
    current_password: string,
    password: string,
    password_confirmation: string,
  ) => {
    try {
      await api.put("/user/password", {
        current_password,
        password,
        password_confirmation,
      });
      message.success("Password updated");
    } catch (error: any) {
      message.error(error.response?.data?.message || "Password update failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {
      // Ignore error if logout fails
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    message.info("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        updateProfile,
        updatePassword,
        logout,
        isAuthenticated: !!token && !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
