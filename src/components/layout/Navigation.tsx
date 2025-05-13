
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  User, 
  LogIn, 
  LogOut, 
  Menu,
  X,
  Book,
  Users,
  Database,
  Settings 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const Navigation = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-mahalla-primary text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo and title */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">Mahalla Yordam Markazi</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-mahalla-dark"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          <Link to="/courses" className="hover:text-mahalla-accent transition-colors">
            Kurslar
          </Link>
          <Link to="/entrepreneurs" className="hover:text-mahalla-accent transition-colors">
            Tadbirkorlar
          </Link>
          {isAdmin && (
            <Link to="/admin" className="hover:text-mahalla-accent transition-colors">
              Admin Panel
            </Link>
          )}
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="hover:text-mahalla-accent transition-colors flex items-center">
                <User size={18} className="mr-1" />
                {user?.name.split(' ')[0]}
              </Link>
              <Button 
                variant="ghost" 
                onClick={logout} 
                className="text-white hover:bg-mahalla-dark hover:text-white"
              >
                <LogOut size={18} className="mr-1" />
                Chiqish
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-mahalla-primary">
                  <LogIn size={18} className="mr-1" />
                  Kirish
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="md:hidden p-4 bg-mahalla-dark">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/courses" 
              className="hover:text-mahalla-accent transition-colors flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <Book size={18} className="mr-2" />
              Kurslar
            </Link>
            <Link 
              to="/entrepreneurs" 
              className="hover:text-mahalla-accent transition-colors flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <Users size={18} className="mr-2" />
              Tadbirkorlar
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="hover:text-mahalla-accent transition-colors flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <Settings size={18} className="mr-2" />
                Admin Panel
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  className="hover:text-mahalla-accent transition-colors flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={18} className="mr-2" />
                  Profil
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }} 
                  className="flex items-center text-white hover:text-mahalla-accent transition-colors"
                >
                  <LogOut size={18} className="mr-2" />
                  Chiqish
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="hover:text-mahalla-accent transition-colors flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn size={18} className="mr-2" />
                  Kirish
                </Link>
                <Link 
                  to="/register" 
                  className="hover:text-mahalla-accent transition-colors flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={18} className="mr-2" />
                  Ro'yxatdan o'tish
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
