
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { Book, Users, Database } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-mahalla-light to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-mahalla-dark">Mahalla Yordam Markazi</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-700">
            Mahallada ishsizlikni kamaytirish, kasb-hunar o'rgatish va tadbirkorlikni qo'llab-quvvatlash platformasi
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/courses">
              <Button size="lg" className="bg-mahalla-primary hover:bg-mahalla-dark">
                Kurslarni ko'rish
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-mahalla-primary text-mahalla-primary hover:bg-mahalla-light">
                  Ro'yxatdan o'tish
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-mahalla-primary">Bizning xizmatlarimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-lg border-t-4 border-t-mahalla-primary">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-mahalla-light p-4 rounded-full mb-4">
                    <Book className="h-10 w-10 text-mahalla-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Kasb-hunar o'rgatish</h3>
                  <p className="text-gray-700 mb-4">
                    Zamonaviy kasblarni o'rgatish orqali aholining bilim va ko'nikmalarini oshirish
                  </p>
                  <Link to="/courses" className="text-mahalla-primary hover:text-mahalla-dark font-medium">
                    Kurslar haqida
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-t-4 border-t-mahalla-secondary">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-50 p-4 rounded-full mb-4">
                    <Users className="h-10 w-10 text-mahalla-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Tadbirkorlik qo'llab-quvvatlash</h3>
                  <p className="text-gray-700 mb-4">
                    Mahalliy tadbirkorlarni qo'llab-quvvatlash va yangi bizneslarni rivojlantirish
                  </p>
                  <Link to="/entrepreneurs" className="text-mahalla-secondary hover:text-blue-700 font-medium">
                    Tadbirkorlar haqida
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-t-4 border-t-mahalla-accent">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-yellow-50 p-4 rounded-full mb-4">
                    <Database className="h-10 w-10 text-mahalla-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ishsizlarni ro'yxatga olish</h3>
                  <p className="text-gray-700 mb-4">
                    Ishsizlarni ro'yxatga olish va ularni ish bilan ta'minlashga ko'maklashish
                  </p>
                  <Link to={isAuthenticated ? "/profile" : "/login"} className="text-mahalla-accent hover:text-yellow-600 font-medium">
                    {isAuthenticated ? "Profil sahifasi" : "Ro'yxatdan o'tish"}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-16 bg-mahalla-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-mahalla-dark">Bizning natijalarimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-mahalla-primary mb-2">15+</div>
              <p className="text-gray-700">Kasbiy kurslar</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-mahalla-secondary mb-2">200+</div>
              <p className="text-gray-700">Bitiruvchilar</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-mahalla-accent mb-2">50+</div>
              <p className="text-gray-700">Tadbirkorlar</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-mahalla-dark mb-2">85%</div>
              <p className="text-gray-700">Ish topish ko'rsatkichi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-mahalla-dark">Bugun birinchi qadamni tashlang</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-700">
            Bizning kurslarimizga yoziling yoki mahalliy tadbirkorlarni qo'llab-quvvatlash dasturimizga qo'shiling
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {!isAuthenticated ? (
              <Link to="/register">
                <Button size="lg" className="bg-mahalla-primary hover:bg-mahalla-dark">
                  Hozir boshlang
                </Button>
              </Link>
            ) : (
              <Link to="/courses">
                <Button size="lg" className="bg-mahalla-primary hover:bg-mahalla-dark">
                  Kurslarni ko'rish
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
