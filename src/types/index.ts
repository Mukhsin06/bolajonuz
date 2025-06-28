export interface Child {
  id: string;
  name: string;
  surname: string;
  birthDate: string;
  age: number;
  group: string;
  photo?: string;
  parentName: string;
  parentPhone: string;
  parentTelegram?: string;
  address: string;
  medicalInfo?: string;
  enrollmentDate: string;
  isActive: boolean;
  monthlyFee?: number; // Oylik to'lov miqdori
}

export interface Attendance {
  id: string;
  childId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'sick';
  notes?: string;
}

export interface TeacherAttendance {
  id: string;
  teacherId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'sick';
  notes?: string;
}

export interface Payment {
  id: string;
  childId: string;
  amount: number;
  date: string;
  month: string;
  year: number;
  paymentMethod: 'naqd' | 'karta' | 'bank';
  description?: string;
  receivedBy: string;
}

export interface PaymentReceipt {
  id: string;
  paymentId: string;
  childName: string;
  amount: number;
  date: string;
  month: string;
  receiptNumber: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'teacher';
  isActive: boolean;
}

export interface DashboardStats {
  totalChildren: number;
  presentToday: number;
  absentToday: number;
  monthlyIncome: number;
  totalGroups: number;
}

export interface AppSettings {
  darkMode: boolean;
  defaultMonthlyFee: number;
  autoGenerateReceipts: boolean;
  telegramNotifications: boolean;
}