import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { EnrollButton } from '@/components/courses/EnrollButton';
import { supabase } from '@/integrations/supabase/client';

interface CourseDetails {
  id: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  image_url: string | null;
  slots: number;
  enrolled_count: number;
}

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setCourse(data);
      } catch (err: any) {
        console.error('Error fetching course:', err);
        setError('Kurs ma\'lumotlarini yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Sana ko\'rsatilmagan';
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ');
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-xl">Yuklanmoqda...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !course) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-xl text-red-500">{error || 'Kurs topilmadi'}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Course image */}
          <div className="md:col-span-1">
            <div className="bg-gray-100 rounded-lg overflow-hidden h-64 md:h-auto">
              {course.image_url ? (
                <img 
                  src={course.image_url} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400">Rasm yo'q</span>
                </div>
              )}
            </div>
            
            <Card className="mt-4">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Manzil</h3>
                    <p className="mt-1">{course.location}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Boshlanish sanasi</h3>
                    <p className="mt-1">{formatDate(course.start_date)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tugash sanasi</h3>
                    <p className="mt-1">{formatDate(course.end_date)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Bo'sh joylar</h3>
                    <p className="mt-1">{course.slots - course.enrolled_count} / {course.slots}</p>
                  </div>
                  
                  <div className="pt-2">
                    <EnrollButton 
                      courseId={course.id} 
                      slots={course.slots} 
                      enrolledCount={course.enrolled_count} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Course details */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold text-mahalla-dark mb-6">{course.title}</h1>
            
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">Kurs haqida</h2>
              <p className="whitespace-pre-line">{course.description}</p>
            </div>
            
            {/* Additional course information could be added here */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseDetail;
