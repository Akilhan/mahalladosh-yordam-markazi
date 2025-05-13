
// Types for our data models
export interface Course {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  slots: number;
  enrolledCount: number;
  imageUrl: string;
}

export interface Entrepreneur {
  id: string;
  name: string;
  businessName: string;
  category: string;
  description: string;
  contactInfo: string;
  joinDate: string;
}

export interface UnemployedPerson {
  id: string;
  name: string;
  age: number;
  skills: string[];
  education: string;
  contactInfo: string;
  registrationDate: string;
  status: 'active' | 'employed' | 'in-training';
}

// Mock data
export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Web dasturlash asoslari',
    description: 'HTML, CSS va JavaScript asoslari bo\'yicha amaliy kurs',
    startDate: '2023-06-15',
    endDate: '2023-08-15',
    location: 'Mahalla markazi',
    slots: 20,
    enrolledCount: 12,
    imageUrl: 'https://placehold.co/600x400?text=Web+Dasturlash',
  },
  {
    id: '2',
    title: 'Tikuvchilik va dizayn',
    description: 'Kiyim tikish va dizayn qilish bo\'yicha asosiy bilimlar',
    startDate: '2023-06-20',
    endDate: '2023-07-25',
    location: 'Hunarmand ustaxonasi',
    slots: 15,
    enrolledCount: 8,
    imageUrl: 'https://placehold.co/600x400?text=Tikuvchilik',
  },
  {
    id: '3',
    title: 'Pazandachilik san\'ati',
    description: 'Milliy va zamonaviy taomlarni tayyorlash',
    startDate: '2023-07-01',
    endDate: '2023-08-01',
    location: 'Mahalla oshxonasi',
    slots: 12,
    enrolledCount: 10,
    imageUrl: 'https://placehold.co/600x400?text=Pazandachilik',
  },
];

export const mockEntrepreneurs: Entrepreneur[] = [
  {
    id: '1',
    name: 'Aziz Rahimov',
    businessName: 'AR Digital Solutions',
    category: 'IT xizmatlari',
    description: 'Kichik bizneslar uchun web saytlar va mobil ilovalar yaratish',
    contactInfo: '+998 90 123 4567',
    joinDate: '2022-10-15',
  },
  {
    id: '2',
    name: 'Nilufar Karimova',
    businessName: 'Nil Fashion',
    category: 'Tikuvchilik',
    description: 'Milliy va zamonaviy liboslarni tikish va sotish',
    contactInfo: '+998 91 234 5678',
    joinDate: '2021-08-20',
  },
];

export const mockUnemployed: UnemployedPerson[] = [
  {
    id: '1',
    name: 'Jasur Toshpulatov',
    age: 24,
    skills: ['Kompyuter savodxonligi', 'Ingliz tili'],
    education: 'Oliy ma\'lumot, Iqtisodiyot',
    contactInfo: '+998 93 345 6789',
    registrationDate: '2023-03-10',
    status: 'in-training',
  },
  {
    id: '2',
    name: 'Malika Sharipova',
    age: 32,
    skills: ['Tikuvchilik', 'Sotuvchilik'],
    education: 'O\'rta maxsus',
    contactInfo: '+998 94 456 7890',
    registrationDate: '2023-02-15',
    status: 'active',
  },
  {
    id: '3',
    name: 'Bekzod Yuldashev',
    age: 28,
    skills: ['Haydovchilik', 'Qurilish ishlari'],
    education: 'O\'rta maxsus',
    contactInfo: '+998 95 567 8901',
    registrationDate: '2023-01-20',
    status: 'employed',
  },
];

// Helper function to simulate API calls
export const fetchData = <T>(data: T[], delay = 500): Promise<T[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...data]), delay);
  });
};

// CRUD operations for courses
export const courseService = {
  getAll: () => fetchData(mockCourses),
  
  getById: (id: string) => {
    return fetchData([mockCourses.find(c => c.id === id)].filter(Boolean) as Course[])
      .then(courses => courses[0]);
  },
  
  create: (course: Omit<Course, 'id'>) => {
    const newCourse = { ...course, id: String(mockCourses.length + 1) };
    mockCourses.push(newCourse as Course);
    return fetchData([newCourse] as Course[]).then(courses => courses[0]);
  },
  
  update: (id: string, updates: Partial<Course>) => {
    const index = mockCourses.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCourses[index] = { ...mockCourses[index], ...updates };
      return fetchData([mockCourses[index]] as Course[]).then(courses => courses[0]);
    }
    return Promise.reject(new Error('Course not found'));
  },
  
  delete: (id: string) => {
    const index = mockCourses.findIndex(c => c.id === id);
    if (index !== -1) {
      const deleted = mockCourses.splice(index, 1)[0];
      return fetchData([deleted] as Course[]).then(() => true);
    }
    return Promise.reject(new Error('Course not found'));
  },

  enroll: (courseId: string, userId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    if (!course) {
      return Promise.reject(new Error('Course not found'));
    }
    
    if (course.enrolledCount >= course.slots) {
      return Promise.reject(new Error('No available slots'));
    }
    
    course.enrolledCount += 1;
    return fetchData([course] as Course[]).then(courses => courses[0]);
  }
};

// Similar services can be implemented for entrepreneurs and unemployed persons
export const entrepreneurService = {
  getAll: () => fetchData(mockEntrepreneurs),
  getById: (id: string) => {
    return fetchData([mockEntrepreneurs.find(e => e.id === id)].filter(Boolean) as Entrepreneur[])
      .then(entrepreneurs => entrepreneurs[0]);
  },
  create: (entrepreneur: Omit<Entrepreneur, 'id'>) => {
    const newEntrepreneur = { ...entrepreneur, id: String(mockEntrepreneurs.length + 1) };
    mockEntrepreneurs.push(newEntrepreneur as Entrepreneur);
    return fetchData([newEntrepreneur] as Entrepreneur[]).then(entrepreneurs => entrepreneurs[0]);
  },
  // Additional methods can be implemented as needed
};

export const unemployedService = {
  getAll: () => fetchData(mockUnemployed),
  getById: (id: string) => {
    return fetchData([mockUnemployed.find(u => u.id === id)].filter(Boolean) as UnemployedPerson[])
      .then(unemployed => unemployed[0]);
  },
  updateStatus: (id: string, status: UnemployedPerson['status']) => {
    const person = mockUnemployed.find(u => u.id === id);
    if (person) {
      person.status = status;
      return fetchData([person] as UnemployedPerson[]).then(people => people[0]);
    }
    return Promise.reject(new Error('Person not found'));
  },
  // Additional methods can be implemented as needed
};
