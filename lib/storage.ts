'use client';

// LocalStorage yordamida ma'lumotlarni saqlash
export class DataStorage {
  private static instance: DataStorage;
  
  static getInstance(): DataStorage {
    if (!DataStorage.instance) {
      DataStorage.instance = new DataStorage();
    }
    return DataStorage.instance;
  }

  // Ma'lumotlarni saqlash
  save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Ma\'lumot saqlashda xatolik:', error);
    }
  }

  // Ma'lumotlarni olish
  load<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Ma\'lumot yuklashda xatolik:', error);
      return defaultValue;
    }
  }

  // Ma'lumotlarni o'chirish
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Ma\'lumot o\'chirishda xatolik:', error);
    }
  }

  // Barcha ma'lumotlarni tozalash
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Ma\'lumotlarni tozalashda xatolik:', error);
    }
  }
}

// Ma'lumotlar kalitlari
export const STORAGE_KEYS = {
  STUDENTS: 'education_students',
  TEACHERS: 'education_teachers',
  SUBJECTS: 'education_subjects',
  GRADES: 'education_grades',
  SCHEDULE: 'education_schedule',
  USER: 'education_user',
  THEME: 'education_theme'
};

// Boshlang'ich ma'lumotlar
export const INITIAL_DATA = {
  students: [
    {
      id: '1',
      firstName: 'Sardor',
      lastName: 'Aliyev',
      grade: '9',
      class: 'A',
      phone: '+998901234567',
      email: 'sardor@example.com',
      birthDate: '2008-05-15',
      address: 'Toshkent sh., Yunusobod t.',
      parentName: 'Aliyev Bobur',
      parentPhone: '+998901234568',
      averageGrade: 4.5,
      status: 'active'
    },
    {
      id: '2',
      firstName: 'Malika',
      lastName: 'Karimova',
      grade: '10',
      class: 'B',
      phone: '+998901234569',
      email: 'malika@example.com',
      birthDate: '2007-08-22',
      address: 'Toshkent sh., Mirzo Ulug\'bek t.',
      parentName: 'Karimova Dilnoza',
      parentPhone: '+998901234570',
      averageGrade: 4.8,
      status: 'active'
    }
  ],
  teachers: [
    {
      id: '1',
      firstName: 'Nodira',
      lastName: 'Karimova',
      subject: 'Matematika',
      experience: 15,
      phone: '+998901234567',
      email: 'nodira@school.uz',
      birthDate: '1985-03-15',
      address: 'Toshkent sh., Yunusobod t.',
      education: 'TDPU, Matematika',
      salary: 8000000,
      status: 'active',
      classes: ['9A', '9B', '10A']
    },
    {
      id: '2',
      firstName: 'Aziz',
      lastName: 'Rahmonov',
      subject: 'Fizika',
      experience: 12,
      phone: '+998901234568',
      email: 'aziz@school.uz',
      birthDate: '1988-07-22',
      address: 'Toshkent sh., Mirzo Ulug\'bek t.',
      education: 'TDPU, Fizika',
      salary: 7500000,
      status: 'active',
      classes: ['10A', '10B', '11A']
    }
  ],
  subjects: [
    {
      id: '1',
      name: 'Matematika',
      code: 'MATH',
      description: 'Algebra, geometriya va matematik tahlil',
      hoursPerWeek: 6,
      teacherCount: 3,
      studentCount: 120,
      grade: ['8', '9', '10', '11'],
      status: 'active'
    },
    {
      id: '2',
      name: 'Fizika',
      code: 'PHYS',
      description: 'Mexanika, termodinamika va elektr',
      hoursPerWeek: 4,
      teacherCount: 2,
      studentCount: 90,
      grade: ['9', '10', '11'],
      status: 'active'
    }
  ],
  grades: [
    {
      id: '1',
      studentId: '1',
      studentName: 'Sardor Aliyev',
      subject: 'Matematika',
      grade: 5,
      date: '2024-01-20',
      quarter: 2,
      type: 'daily',
      teacherId: '1',
      teacherName: 'Nodira Karimova',
      class: '9A'
    },
    {
      id: '2',
      studentId: '2',
      studentName: 'Malika Karimova',
      subject: 'Fizika',
      grade: 4,
      date: '2024-01-19',
      quarter: 2,
      type: 'control',
      teacherId: '2',
      teacherName: 'Aziz Rahmonov',
      class: '10B'
    }
  ]
};