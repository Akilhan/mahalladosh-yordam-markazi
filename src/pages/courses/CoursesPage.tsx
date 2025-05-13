
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface Course {
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

const CoursesPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('start_date', { ascending: true });

        if (error) {
          throw error;
        }

        setCourses(data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Sana ko\'rsatilmagan';
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-mahalla-dark">Bizning kurslarimiz</h1>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-xl">Yuklanmoqda...</p>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden h-full flex flex-col">
                <div className="h-48 bg-gray-100">
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
                <CardContent className="p-5 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold mb-2">{course.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="mt-auto space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                        {course.location}
                      </span>
                      <span className="text-xs bg-green-100 text-green-800 rounded-full px-2 py-1">
                        {formatDate(course.start_date)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {course.slots - course.enrolled_count} / {course.slots} joylar
                      </span>
                      <Button 
                        onClick={() => navigate(`/courses/${course.id}`)}
                        className="bg-mahalla-primary hover:bg-mahalla-dark"
                      >
                        Batafsil
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xl text-gray-500">Hozircha kurslar yo'q</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CoursesPage;
