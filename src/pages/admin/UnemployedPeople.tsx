
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { unemployedService, UnemployedPerson } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';

const statusColors = {
  'active': 'bg-yellow-500',
  'employed': 'bg-green-500',
  'in-training': 'bg-blue-500',
};

const statusLabels = {
  'active': 'Ishsiz',
  'employed': 'Ishga joylashgan',
  'in-training': 'O\'qishda',
};

const UnemployedPeople = () => {
  const { toast } = useToast();
  const [people, setPeople] = useState<UnemployedPerson[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchPeople();
  }, []);
  
  const fetchPeople = async () => {
    setLoading(true);
    try {
      const data = await unemployedService.getAll();
      setPeople(data);
    } catch (error) {
      console.error('Error fetching unemployed people:', error);
      toast({
        title: "Xatolik",
        description: "Ma'lumotlarni yuklab bo'lmadi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (personId: string, newStatus: UnemployedPerson['status']) => {
    try {
      await unemployedService.updateStatus(personId, newStatus);
      
      // Update local state
      setPeople(prev => prev.map(person => 
        person.id === personId ? { ...person, status: newStatus } : person
      ));
      
      toast({
        title: "Muvaffaqiyatli",
        description: "Status yangilandi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Statusni yangilashda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Ishsizlar ro'yxati</h2>
      
      {loading ? (
        <div className="text-center py-8">
          <p>Yuklanmoqda...</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ism-sharif</TableHead>
                <TableHead>Yosh</TableHead>
                <TableHead>Ko'nikmalar</TableHead>
                <TableHead>Ma'lumoti</TableHead>
                <TableHead>Ro'yxatga olingan sana</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Statusni o'zgartirish</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {people.length > 0 ? (
                people.map(person => (
                  <TableRow key={person.id}>
                    <TableCell className="font-medium">{person.name}</TableCell>
                    <TableCell>{person.age}</TableCell>
                    <TableCell>
                      {person.skills.map((skill, i) => (
                        <span key={i} className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs mr-1 mb-1">
                          {skill}
                        </span>
                      ))}
                    </TableCell>
                    <TableCell>{person.education}</TableCell>
                    <TableCell>{formatDate(person.registrationDate)}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[person.status]}>
                        {statusLabels[person.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={person.status}
                        onValueChange={(value) => handleStatusChange(person.id, value as UnemployedPerson['status'])}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Ishsiz</SelectItem>
                          <SelectItem value="employed">Ishga joylashgan</SelectItem>
                          <SelectItem value="in-training">O'qishda</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Ishsizlar ro'yxatga olinmagan
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

export default UnemployedPeople;
