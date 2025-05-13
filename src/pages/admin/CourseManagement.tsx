
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { courseService, Course } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';

const CourseManagement = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // New course form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    slots: 20,
    enrolledCount: 0,
    imageUrl: 'https://placehold.co/600x400?text=New+Course',
  });
  
  useEffect(() => {
    fetchCourses();
  }, []);
  
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await courseService.getAll();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Xatolik",
        description: "Kurslarni yuklab bo'lmadi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'slots' ? parseInt(value) || 0 : value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await courseService.create(formData);
      toast({
        title: "Muvaffaqiyatli",
        description: "Yangi kurs qo'shildi",
      });
      setIsAddDialogOpen(false);
      fetchCourses();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        slots: 20,
        enrolledCount: 0,
        imageUrl: 'https://placehold.co/600x400?text=New+Course',
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Kursni qo'shishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteCourse = async (id: string) => {
    if (window.confirm("Haqiqatan ham bu kursni o'chirishni xohlaysizmi?")) {
      try {
        await courseService.delete(id);
        toast({
          title: "Muvaffaqiyatli",
          description: "Kurs o'chirildi",
        });
        fetchCourses();
      } catch (error) {
        toast({
          title: "Xatolik",
          description: "Kursni o'chirishda xatolik yuz berdi",
          variant: "destructive",
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Kurslar ro'yxati</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-mahalla-primary hover:bg-mahalla-dark">Yangi kurs qo'shish</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Yangi kurs qo'shish</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Kurs nomi</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Kurs haqida</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Boshlanish sanasi</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Tugash sanasi</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Joylashuv</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="slots">O'rinlar soni</Label>
                    <Input
                      id="slots"
                      name="slots"
                      type="number"
                      min="1"
                      value={formData.slots}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Bekor qilish
                </Button>
                <Button type="submit" className="bg-mahalla-primary hover:bg-mahalla-dark">
                  Saqlash
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <p>Yuklanmoqda...</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kurs nomi</TableHead>
                <TableHead>Boshlanish sanasi</TableHead>
                <TableHead>Tugash sanasi</TableHead>
                <TableHead>Joylashuv</TableHead>
                <TableHead className="text-right">O'rinlar</TableHead>
                <TableHead className="text-right">Ro'yxatdan o'tganlar</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length > 0 ? (
                courses.map(course => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>{formatDate(course.startDate)}</TableCell>
                    <TableCell>{formatDate(course.endDate)}</TableCell>
                    <TableCell>{course.location}</TableCell>
                    <TableCell className="text-right">{course.slots}</TableCell>
                    <TableCell className="text-right">{course.enrolledCount}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        O'chirish
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Kurslar mavjud emas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
