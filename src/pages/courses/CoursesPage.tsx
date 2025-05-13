
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { courseService, Course } from '@/services/mockData';

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getAll();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('uz-UZ', options);
  };

  const getSlotsAvailable = (course: Course) => {
    const available = course.slots - course.enrolledCount;
    return available > 0 ? available : 0;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-mahalla-dark">Kasb-hunar o'rgatish kurslari</h1>
        
        <div className="bg-mahalla-light p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-3 text-mahalla-primary">Kurslar haqida</h2>
          <p className="text-gray-700 mb-4">
            Bizning kurslarimiz orqali yangi kasb-hunarlarni o'rganing va o'z imkoniyatlaringizni kengaytiring. 
            Barcha kurslar malakali mutaxassislar tomonidan o'qitiladi va amaliy ko'nikmalarga yo'naltirilgan.
          </p>
          <p className="text-gray-700">
            Kurslarni bitirganingizdan so'ng sertifikat olasiz va ishga joylashishda ko'maklashamiz.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Yuklanmoqda...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <Card key={course.id} className="overflow-hidden flex flex-col h-full">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={course.imageUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <Badge 
                      variant={getSlotsAvailable(course) > 0 ? "outline" : "destructive"}
                      className={getSlotsAvailable(course) > 0 ? "border-green-500 text-green-600" : ""}
                    >
                      {getSlotsAvailable(course) > 0 
                        ? `${getSlotsAvailable(course)} o'rin mavjud` 
                        : "To'lgan"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-semibold">Boshlanish sanasi:</p>
                      <p className="text-gray-600">{formatDate(course.startDate)}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Tugash sanasi:</p>
                      <p className="text-gray-600">{formatDate(course.endDate)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-semibold">Joylashuv:</p>
                      <p className="text-gray-600">{course.location}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/courses/${course.id}`} className="w-full">
                    <Button 
                      variant="default"
                      className="w-full bg-mahalla-primary hover:bg-mahalla-dark"
                      disabled={getSlotsAvailable(course) === 0}
                    >
                      Batafsil ma'lumot
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        {!loading && courses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Hozirda kurslar mavjud emas.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CoursesPage;
