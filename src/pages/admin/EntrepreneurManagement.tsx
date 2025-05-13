
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { entrepreneurService, Entrepreneur } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';

const EntrepreneurManagement = () => {
  const { toast } = useToast();
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // New entrepreneur form state
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    category: '',
    description: '',
    contactInfo: '',
    joinDate: new Date().toISOString().split('T')[0],
  });
  
  useEffect(() => {
    fetchEntrepreneurs();
  }, []);
  
  const fetchEntrepreneurs = async () => {
    setLoading(true);
    try {
      const data = await entrepreneurService.getAll();
      setEntrepreneurs(data);
    } catch (error) {
      console.error('Error fetching entrepreneurs:', error);
      toast({
        title: "Xatolik",
        description: "Tadbirkorlarni yuklab bo'lmadi",
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
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await entrepreneurService.create(formData);
      toast({
        title: "Muvaffaqiyatli",
        description: "Yangi tadbirkor qo'shildi",
      });
      setIsAddDialogOpen(false);
      fetchEntrepreneurs();
      
      // Reset form
      setFormData({
        name: '',
        businessName: '',
        category: '',
        description: '',
        contactInfo: '',
        joinDate: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Tadbirkorni qo'shishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tadbirkorlar ro'yxati</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-mahalla-primary hover:bg-mahalla-dark">Yangi tadbirkor qo'shish</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Yangi tadbirkor qo'shish</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tadbirkor ismi</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessName">Biznes nomi</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Faoliyat sohasi</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Biznes haqida</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactInfo">Aloqa ma'lumotlari</Label>
                  <Input
                    id="contactInfo"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleInputChange}
                    required
                  />
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
                <TableHead>Biznes nomi</TableHead>
                <TableHead>Tadbirkor</TableHead>
                <TableHead>Faoliyat sohasi</TableHead>
                <TableHead>Aloqa ma'lumotlari</TableHead>
                <TableHead>Qo'shilgan sana</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entrepreneurs.length > 0 ? (
                entrepreneurs.map(entrepreneur => (
                  <TableRow key={entrepreneur.id}>
                    <TableCell className="font-medium">{entrepreneur.businessName}</TableCell>
                    <TableCell>{entrepreneur.name}</TableCell>
                    <TableCell>{entrepreneur.category}</TableCell>
                    <TableCell>{entrepreneur.contactInfo}</TableCell>
                    <TableCell>{formatDate(entrepreneur.joinDate)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Tadbirkorlar mavjud emas
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

export default EntrepreneurManagement;
