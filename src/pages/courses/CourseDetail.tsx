
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { courseService, Course } from '@/services/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      
      try {
        const data = await courseService.getById(id);
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course:', error);
        toast({
          title: "Xatolik",
          description: "Kurs ma'lumotlarini yuklab bo'lmadi",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, toast]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('uz-UZ', options);
  };

  const getSlotsAvailable = (course: Course) => {
    const available = course.slots - course.enrolledCount;
    return available > 0 ? available : 0;
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Ro'yxatdan o'ting",
        description: "Kursga yozilish uchun avval tizimga kiring",
        variant: "default",
      });
      navigate('/login');
      return;
    }
    
    if (!course || !user) return;
    
    setEnrolling(true);
    
    try {
      const updatedCourse = await courseService.enroll(course.id, user.id);
      setCourse(updatedCourse);
      toast({
        title: "Muvaffaqiyatli",
        description: "Siz kursga yozildingiz",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: error instanceof Error ? error.message : "Kursga yozilishda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <p>Yuklanmoqda...</p>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Kurs topilmadi</h1>
            <Button onClick={() => navigate('/courses')}>Barcha kurslarga qaytish</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const isAvailable = getSlotsAvailable(course) > 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/courses')}
          className="mb-4"
        >
          ← Barcha kurslarga qaytish
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-lg overflow-hidden mb-6">
              <img 
                src={course.imageUrl} 
                alt={course.title} 
                className="w-full h-64 object-cover"
              />
            </div>
            
            <h1 className="text-3xl font-bold mb-4 text-mahalla-dark">{course.title}</h1>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3 text-mahalla-primary">Kurs haqida</h2>
              <p className="text-gray-700 mb-4">{course.description}</p>
              <p className="text-gray-700">
                Bu kurs sizga asosiy bilimlarni beradi va amaliy ko'nikmalarni rivojlantiradi.
                Kursni muvaffaqiyatli yakunlagandan so'ng, sertifikat olasiz va ish topishda yordam beriladi.
              </p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3 text-mahalla-primary">Kurs dasturi</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Asosiy tushunchalar va nazariya</li>
                <li>Amaliy ko'nikmalar</li>
                <li>Real loyihalar ustida ishlash</li>
                <li>Mustaqil amaliyot</li>
                <li>Yakuniy imtihon</li>
              </ul>
            </div>
          </div>
          
          <div>
            <Card className="sticky top-8">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Kurs ma'lumotlari</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Boshlanish sanasi</p>
                        <p className="font-medium">{formatDate(course.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tugash sanasi</p>
                        <p className="font-medium">{formatDate(course.endDate)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Joylashuv</p>
                        <p className="font-medium">{course.location}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Bo'sh o'rinlar</p>
                        <p className="font-medium">
                          <Badge variant={isAvailable ? "outline" : "destructive"}>
                            {isAvailable ? getSlotsAvailable(course) : 'To\'lgan'}
                          </Badge>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-mahalla-primary hover:bg-mahalla-dark"
                    disabled={!isAvailable || enrolling}
                    onClick={handleEnroll}
                  >
                    {enrolling ? "Kuting..." : isAvailable ? "Kursga yozilish" : "Kurs to'lgan"}
                  </Button>
                  
                  <div className="text-sm text-gray-500">
                    <p>Kursga yozilish uchun avval ro'yxatdan o'ting. Kurs bepul, lekin o'rinlar cheklangan.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseDetail;
