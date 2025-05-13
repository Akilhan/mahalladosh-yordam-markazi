
import React from 'react';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-mahalla-dark text-white py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Mahalla Yordam Markazi</h3>
              <p className="text-sm">
                Mahallada ishsizlik va tadbirkorlikni qo'llab-quvvatlash uchun xizmat ko'rsatuvchi platforma.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Aloqa</h3>
              <p className="text-sm mb-2">Manzil: Navoiy ko'chasi 36-uy</p>
              <p className="text-sm mb-2">Telefon: +998 71 123 4567</p>
              <p className="text-sm">Email: info@mahalladosh.uz</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Foydali havolalar</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-mahalla-accent transition-colors">Kurslar</a></li>
                <li><a href="#" className="hover:text-mahalla-accent transition-colors">Tadbirkorlar</a></li>
                <li><a href="#" className="hover:text-mahalla-accent transition-colors">Ishsizlikni ro'yxatga olish</a></li>
                <li><a href="#" className="hover:text-mahalla-accent transition-colors">Yordam</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-6 pt-6 text-center text-sm">
            &copy; {new Date().getFullYear()} Mahalla Yordam Markazi. Barcha huquqlar himoyalangan.
          </div>
        </div>
      </footer>
    </div>
  );
};
