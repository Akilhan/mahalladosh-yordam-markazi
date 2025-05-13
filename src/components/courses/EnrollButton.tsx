
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface EnrollButtonProps {
  courseId: string;
  slots: number;
  enrolledCount: number;
}

export const EnrollButton = ({ courseId, slots, enrolledCount }: EnrollButtonProps) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  
  const availableSlots = slots - enrolledCount;
  const isFull = availableSlots <= 0;

  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      if (!isAuthenticated || !user) {
        setChecking(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('enrollments')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .maybeSingle();

        if (error) {
          console.error('Error checking enrollment:', error);
        }

        setIsEnrolled(!!data);
      } catch (error) {
        console.error('Error in checkEnrollmentStatus:', error);
      } finally {
        setChecking(false);
      }
    };

    checkEnrollmentStatus();
  }, [courseId, user, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Kirish kerak',
        description: 'Kursga yozilish uchun tizimga kirishingiz kerak',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }

    if (isEnrolled) {
      toast({
        title: 'Allaqachon yozilgansiz',
        description: 'Siz allaqachon bu kursga yozilgansiz',
      });
      return;
    }

    if (isFull) {
      toast({
        title: 'Kurs to\'lgan',
        description: 'Afsuski, bu kurs uchun bo\'sh joylar qolmagan',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('enrollments')
        .insert([
          { user_id: user?.id, course_id: courseId }
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: 'Muvaffaqiyatli',
        description: 'Siz kursga muvaffaqiyatli yozildingiz!',
      });
      
      setIsEnrolled(true);
    } catch (error: any) {
      console.error('Enrollment error:', error);
      toast({
        title: 'Xatolik yuz berdi',
        description: error.message || 'Kursga yozilishda xatolik yuz berdi',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (checking) {
    return <Button disabled>Yuklanmoqda...</Button>;
  }

  return (
    <Button 
      onClick={handleEnroll}
      disabled={isLoading || isEnrolled || isFull}
      className={
        isEnrolled ? 'bg-green-600 hover:bg-green-700' : 
        isFull ? 'bg-gray-400 cursor-not-allowed' : 
        'bg-mahalla-primary hover:bg-mahalla-dark'
      }
    >
      {isLoading ? 'Yuklanmoqda...' : 
       isEnrolled ? 'Yozilgan' : 
       isFull ? 'Joylar yo\'q' : 
       'Kursga yozilish'}
    </Button>
  );
};
