'use client';

import { useState, useEffect } from 'react';
import { Login } from '@/components/auth/login';
import { Sidebar } from '@/components/layout/sidebar';
import { Dashboard } from '@/components/dashboard/dashboard';
import { Students } from '@/components/students/students';
import { Teachers } from '@/components/teachers/teachers';
import { Subjects } from '@/components/subjects/subjects';
import { Grades } from '@/components/grades/grades';
import { Statistics } from '@/components/statistics/statistics';
import { Schedule } from '@/components/schedule/schedule';
import { Reports } from '@/components/reports/reports';
import { StudentGrades } from '@/components/grades/student-grades';
import { StudentManagement } from '@/components/admin/student-management';
import { DataStorage, STORAGE_KEYS, INITIAL_DATA } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storage = DataStorage.getInstance();
    
    // Foydalanuvchini yuklash
    const savedUser = storage.load(STORAGE_KEYS.USER, null);
    if (savedUser) {
      setUser(savedUser);
    }

    // Boshlang'ich ma'lumotlarni yuklash (agar mavjud bo'lmasa)
    const existingStudents = storage.load(STORAGE_KEYS.STUDENTS, []);
    if (existingStudents.length === 0) {
      storage.save(STORAGE_KEYS.STUDENTS, INITIAL_DATA.students);
      storage.save(STORAGE_KEYS.TEACHERS, INITIAL_DATA.teachers);
      storage.save(STORAGE_KEYS.SUBJECTS, INITIAL_DATA.subjects);
      storage.save(STORAGE_KEYS.GRADES, INITIAL_DATA.grades);
    }
  }, []);

  const handleLogin = (userData: any) => {
    const storage = DataStorage.getInstance();
    storage.save(STORAGE_KEYS.USER, userData);
    setUser(userData);
  };

  const handleLogout = () => {
    const storage = DataStorage.getInstance();
    storage.remove(STORAGE_KEYS.USER);
    setUser(null);
    setActiveTab('dashboard');
  };

  if (!mounted) {
    return null;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    // O'quvchi uchun faqat o'z baholarini ko'rsatish
    if (user.role === 'student') {
      return <StudentGrades studentId={user.id} studentName={user.name} />;
    }

    // Admin va o'qituvchi uchun barcha sahifalar
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <Students />;
      case 'teachers':
        return <Teachers />;
      case 'subjects':
        return <Subjects />;
      case 'grades':
        return <Grades />;
      case 'statistics':
        return <Statistics />;
      case 'schedule':
        return <Schedule />;
      case 'reports':
        return <Reports />;
      case 'student-management':
        return <StudentManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {user.role !== 'student' && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          userRole={user.role}
        />
      )}
      <main className={`flex-1 overflow-auto ${user.role === 'student' ? 'ml-0' : ''}`}>
        {/* User Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">{user.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.role === 'admin' ? 'Administrator' :
                   user.role === 'teacher' ? 'O\'qituvchi' : 'O\'quvchi'}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Chiqish</span>
            </Button>
          </div>
        </div>
        
        {renderContent()}
      </main>
    </div>
  );
}