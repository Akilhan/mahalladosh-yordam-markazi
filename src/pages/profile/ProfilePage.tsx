
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { User } from 'lucide-react';

const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-mahalla-dark">Profil</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User info card */}
          <Card>
            <CardHeader>
              <CardTitle>Shaxsiy ma'lumotlar</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarFallback className="bg-mahalla-primary text-white text-2xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
              <p className="text-gray-600 mb-4">{user.email}</p>
              
              <div className="w-full flex flex-col space-y-4 mt-4">
                <Button variant="outline" onClick={() => navigate('/courses')}>
                  Kurslarni ko'rish
                </Button>
                <Button variant="destructive" onClick={logout}>
                  Tizimdan chiqish
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Main content area */}
          <div className="md:col-span-2">
            <Tabs defaultValue="enrollments">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="enrollments">Kurslarim</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
              </TabsList>
              
              {/* Enrollments tab */}
              <TabsContent value="enrollments">
                <Card>
                  <CardHeader>
                    <CardTitle>Ro'yxatdan o'tgan kurslaringiz</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <User className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium">Hozircha kurslar yo'q</h3>
                      <p className="mt-2 text-sm">
                        Siz hali hech qanday kursga yozilmagansiz.
                      </p>
                      <Button 
                        onClick={() => navigate('/courses')} 
                        className="mt-4 bg-mahalla-primary hover:bg-mahalla-dark"
                      >
                        Kurslarni ko'rish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Status tab */}
              <TabsContent value="status">
                <Card>
                  <CardHeader>
                    <CardTitle>Sizning statusingiz</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                        <h3 className="font-medium text-yellow-800">Ishsizlik statusi</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          Siz hali ishsiz sifatida ro'yxatga olinmagansiz. Ro'yxatga olish uchun quyidagi formani to'ldiring.
                        </p>
                        <Button 
                          className="mt-3 bg-yellow-600 hover:bg-yellow-700"
                        >
                          Ishsiz sifatida ro'yxatga olish
                        </Button>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <h3 className="font-medium text-blue-800">Tadbirkorlik statusi</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          Tadbirkor sifatida ro'yxatdan o'ting va bizning qo'llab-quvvatlash dasturlarimizdan foydalaning.
                        </p>
                        <Button 
                          className="mt-3 bg-blue-600 hover:bg-blue-700"
                        >
                          Tadbirkor sifatida ro'yxatdan o'tish
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
