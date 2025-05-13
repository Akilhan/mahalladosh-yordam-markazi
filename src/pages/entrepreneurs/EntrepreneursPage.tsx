
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { entrepreneurService, Entrepreneur } from '@/services/mockData';
import { useAuth } from '@/contexts/AuthContext';

const EntrepreneursPage = () => {
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchEntrepreneurs = async () => {
      try {
        const data = await entrepreneurService.getAll();
        setEntrepreneurs(data);
      } catch (error) {
        console.error('Error fetching entrepreneurs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntrepreneurs();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('uz-UZ', options);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-mahalla-dark">Mahalliy tadbirkorlar</h1>
            <p className="text-gray-600 mt-2">Mahallada faoliyat yuritayotgan tadbirkorlar ro'yxati</p>
          </div>
          
          {isAuthenticated && (
            <Button className="mt-4 md:mt-0 bg-mahalla-primary hover:bg-mahalla-dark">
              Tadbirkor sifatida ro'yxatdan o'tish
            </Button>
          )}
        </div>
        
        <div className="bg-mahalla-light p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-3 text-mahalla-primary">Tadbirkorlik qo'llab-quvvatlash dasturi</h2>
          <p className="text-gray-700 mb-4">
            Mahalliy tadbirkorlarni qo'llab-quvvatlash va yangi bizneslarni rivojlantirish dasturimiz orqali 
            tadbirkorlarimiz o'z faoliyatini rivojlantirish, yangi mijozlar topish va jamiyatga foyda keltirish 
            imkoniyatiga ega bo'lishadi.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-semibold mb-2 text-mahalla-secondary">Bepul maslahatlar</h3>
              <p className="text-sm text-gray-600">Biznes yuritish, soliq va huquq masalalari bo'yicha bepul maslahatlar</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-semibold mb-2 text-mahalla-secondary">Marketing yordam</h3>
              <p className="text-sm text-gray-600">Biznesingizni targ'ib qilish va mahalliy miqyosda tanilishiga yordam</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-semibold mb-2 text-mahalla-secondary">Hamkorlik imkoniyatlari</h3>
              <p className="text-sm text-gray-600">Boshqa mahalliy tadbirkorlar bilan hamkorlik o'rnatish imkoniyati</p>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Yuklanmoqda...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {entrepreneurs.map(entrepreneur => (
              <Card key={entrepreneur.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-mahalla-light to-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{entrepreneur.businessName}</CardTitle>
                      <p className="text-sm text-gray-600">{entrepreneur.name}</p>
                    </div>
                    <Badge className="bg-mahalla-secondary">{entrepreneur.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-4">{entrepreneur.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-semibold">Aloqa:</p>
                      <p className="text-gray-600">{entrepreneur.contactInfo}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Qo'shilgan sana:</p>
                      <p className="text-gray-600">{formatDate(entrepreneur.joinDate)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {!loading && entrepreneurs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Hozirda tadbirkorlar ro'yxatga olinmagan.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EntrepreneursPage;
