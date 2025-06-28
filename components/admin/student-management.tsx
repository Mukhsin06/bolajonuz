'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DataStorage, STORAGE_KEYS } from '@/lib/storage';
import { 
  UserPlus, 
  Search, 
  Key,
  Eye,
  EyeOff,
  Copy,
  RefreshCw
} from 'lucide-react';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  class: string;
  phone: string;
  email: string;
  birthDate: string;
  address: string;
  parentName: string;
  parentPhone: string;
  averageGrade: number;
  status: 'active' | 'inactive';
  username?: string;
  password?: string;
}

export function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storage = DataStorage.getInstance();
    const savedStudents = storage.load(STORAGE_KEYS.STUDENTS, []);
    setStudents(savedStudents);
  }, []);

  const saveStudents = (updatedStudents: Student[]) => {
    const storage = DataStorage.getInstance();
    storage.save(STORAGE_KEYS.STUDENTS, updatedStudents);
    setStudents(updatedStudents);
  };

  const generateCredentials = (student: Student) => {
    const username = `${student.firstName.toLowerCase()}${student.lastName.toLowerCase()}${student.id}`;
    const password = `${student.firstName.toLowerCase()}123`;
    return { username, password };
  };

  const assignCredentials = (studentId: string) => {
    const updatedStudents = students.map(student => {
      if (student.id === studentId) {
        const credentials = generateCredentials(student);
        return { ...student, ...credentials };
      }
      return student;
    });
    saveStudents(updatedStudents);
  };

  const regeneratePassword = (studentId: string) => {
    const updatedStudents = students.map(student => {
      if (student.id === studentId) {
        const newPassword = `${student.firstName.toLowerCase()}${Math.floor(Math.random() * 1000)}`;
        return { ...student, password: newPassword };
      }
      return student;
    });
    saveStudents(updatedStudents);
  };

  const togglePasswordVisibility = (studentId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">O'quvchilar boshqaruvi</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">O'quvchilarga login va parol berish</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="O'quvchi qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>O'quvchilar ro'yxati va login ma'lumotlari</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {student.firstName[0]}{student.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {student.grade}-{student.class} sinf • {student.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {student.username && student.password ? (
                      <Badge className="bg-green-100 text-green-800">
                        Login berilgan
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Login berilmagan
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Login credentials section */}
                {student.username && student.password ? (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Login ma'lumotlari:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                          Foydalanuvchi nomi:
                        </label>
                        <div className="flex items-center space-x-2">
                          <Input 
                            value={student.username} 
                            readOnly 
                            className="bg-white dark:bg-gray-600"
                          />
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => copyToClipboard(student.username)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                          Parol:
                        </label>
                        <div className="flex items-center space-x-2">
                          <Input 
                            type={showPasswords[student.id] ? 'text' : 'password'}
                            value={student.password} 
                            readOnly 
                            className="bg-white dark:bg-gray-600"
                          />
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => togglePasswordVisibility(student.id)}
                          >
                            {showPasswords[student.id] ? 
                              <EyeOff className="w-4 h-4" /> : 
                              <Eye className="w-4 h-4" />
                            }
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => copyToClipboard(student.password)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => regeneratePassword(student.id)}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Yangi parol
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4">
                    <Button 
                      onClick={() => assignCredentials(student.id)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Login va parol berish
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}