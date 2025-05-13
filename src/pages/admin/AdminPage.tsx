
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import CourseManagement from './CourseManagement';
import UnemployedPeople from './UnemployedPeople';
import EntrepreneurManagement from './EntrepreneurManagement';

const AdminPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("courses");

  // Redirect if not authenticated or not an admin
  React.useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-mahalla-dark">Admin Panel</h1>
        
        <Tabs defaultValue="courses" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">Kurslar</TabsTrigger>
            <TabsTrigger value="entrepreneurs">Tadbirkorlar</TabsTrigger>
            <TabsTrigger value="unemployed">Ishsizlar</TabsTrigger>
          </TabsList>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{activeTab === "courses" 
                ? "Kurslarni boshqarish" 
                : activeTab === "entrepreneurs" 
                  ? "Tadbirkorlarni boshqarish" 
                  : "Ishsizlarni boshqarish"
              }</CardTitle>
            </CardHeader>
            <CardContent>
              <TabsContent value="courses">
                <CourseManagement />
              </TabsContent>
              
              <TabsContent value="entrepreneurs">
                <EntrepreneurManagement />
              </TabsContent>
              
              <TabsContent value="unemployed">
                <UnemployedPeople />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPage;
