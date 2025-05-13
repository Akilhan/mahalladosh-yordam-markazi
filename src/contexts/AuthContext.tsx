
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from '@supabase/supabase-js';

// Define user types
export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Set up the authentication listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          try {
            // Get user profile from the profiles table
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .single();
            
            if (error) {
              console.error('Error fetching user profile:', error);
              setUser(null);
            } else if (data) {
              setUser({
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.email.includes('admin') ? 'admin' : 'user'
              });
            }
          } catch (error) {
            console.error('Error in auth state change:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    );
    
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        if (currentSession?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();
            
          if (data) {
            setUser({
              id: data.id,
              name: data.name, 
              email: data.email,
              role: data.email.includes('admin') ? 'admin' : 'user'
            });
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Login muvaffaqiyatli",
        description: `Xush kelibsiz!`
      });
      
      return;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login xatoligi');
    }
  };
  
  const register = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Ro'yxatdan o'tish muvaffaqiyatli",
        description: `Xush kelibsiz, ${name}!`
      });
      
      return;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Ro\'yxatdan o\'tish xatoligi');
    }
  };
  
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      
      toast({
        title: "Tizimdan chiqildi",
        description: "Siz muvaffaqiyatli tizimdan chiqdingiz"
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'Tizimdan chiqish xatoligi');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      session 
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
