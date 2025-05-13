
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";

// Define user types
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Mock user data
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin' as UserRole,
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user' as UserRole,
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Check for stored user on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('mahallaUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Store user in localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('mahallaUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('mahallaUser');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      // Remove password from user data before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}!`
      });
      return;
    }
    
    throw new Error('Invalid email or password');
  };
  
  const register = async (name: string, email: string, password: string) => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if email already exists
    if (MOCK_USERS.some(u => u.email === email)) {
      throw new Error('Email already registered');
    }
    
    // In a real app, you would create a user in your database
    // For now, we'll just simulate a successful registration
    const newUser = {
      id: `${MOCK_USERS.length + 1}`,
      name,
      email,
      role: 'user' as UserRole,
    };
    
    setUser(newUser);
    toast({
      title: "Registration successful",
      description: `Welcome, ${name}!`
    });
  };
  
  const logout = () => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin' 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
