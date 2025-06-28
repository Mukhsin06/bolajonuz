'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataStorage, STORAGE_KEYS } from '@/lib/storage';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Phone,
  Mail,
  Calendar,
  Edit,
  Trash2,
  Eye
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
}

export function Students() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [mounted, setMounted] = useState(false);

  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    grade: '',
    class: '',
    phone: '',
    email: '',
    birthDate: '',
    address: '',
    parentName: '',
    parentPhone: ''
  });

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

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
    
    return matchesSearch && matchesGrade;
  });

  const getGradeBadge = (grade: number) => {
    if (grade >= 4.5) return 'bg-green-100 text-green-800';
    if (grade >= 4.0) return 'bg-blue-100 text-blue-800';
    if (grade >= 3.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const gradeStats = {
    total: students.length,
    active: students.filter(s => s.status === 'active').length,
    averageGrade: students.length > 0 ? students.reduce((sum, s) => sum + s.averageGrade, 0) / students.length : 0,
    excellent: students.filter(s => s.averageGrade >= 4.5).length
  };

  const handleAddStudent = () => {
    const student: Student = {
      id: Date.now().toString(),
      ...newStudent,
      averageGrade: 0,
      status: 'active'
    };
    const updatedStudents = [...students, student];
    saveStudents(updatedStudents);
    
    setNewStudent({
      firstName: '',
      lastName: '',
      grade: '',
      class: '',
      phone: '',
      email: '',
      birthDate: '',
      address: '',
      parentName: '',
      parentPhone: ''
    });
    setShowAddModal(false);
  };

  const handleDeleteStudent = (id: string) => {
    const updatedStudents = students.filter(s => s.id !== id);
    saveStudents(updatedStudents);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">O'quvchilar</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Maktab o'quvchilarini boshqarish</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtr
          </Button>
          <Button 
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Yangi o'quvchi
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Jami o'quvchilar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{gradeStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Faol o'quvchilar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{gradeStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">O'rtacha baho</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{gradeStats.averageGrade.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">A'lo baholi</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{gradeStats.excellent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">O'quvchilar ro'yxati</TabsTrigger>
          <TabsTrigger value="analytics">Tahlil</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="O'quvchi qidirish..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select 
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">Barcha sinflar</option>
                  <option value="8">8-sinf</option>
                  <option value="9">9-sinf</option>
                  <option value="10">10-sinf</option>
                  <option value="11">11-sinf</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Students List */}
          <Card>
            <CardHeader>
              <CardTitle>O'quvchilar ro'yxati</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {student.firstName} {student.lastName}
                          </h3>
                          <Badge className={getGradeBadge(student.averageGrade)}>
                            {student.averageGrade.toFixed(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{student.grade}-{student.class} sinf</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Phone className="w-3 h-3" />
                            <span>{student.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="w-3 h-3" />
                            <span>{student.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sinf bo'yicha taqsimot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['8', '9', '10', '11'].map((grade) => {
                    const count = students.filter(s => s.grade === grade).length;
                    const percentage = students.length > 0 ? (count / students.length) * 100 : 0;
                    return (
                      <div key={grade} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{grade}-sinf</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-500">{count} o'quvchi</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Baho taqsimoti</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { range: '4.5-5.0', label: 'A\'lo', color: 'bg-green-500' },
                    { range: '4.0-4.4', label: 'Yaxshi', color: 'bg-blue-500' },
                    { range: '3.5-3.9', label: 'Qoniqarli', color: 'bg-yellow-500' },
                    { range: '3.0-3.4', label: 'Qoniqarsiz', color: 'bg-red-500' }
                  ].map((grade) => {
                    const [min, max] = grade.range.split('-').map(Number);
                    const count = students.filter(s => s.averageGrade >= min && s.averageGrade <= max).length;
                    const percentage = students.length > 0 ? (count / students.length) * 100 : 0;
                    return (
                      <div key={grade.range} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{grade.label}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-500">{count} o'quvchi</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${grade.color} h-2 rounded-full`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Yangi o'quvchi qo'shish</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Ism</label>
                <Input
                  value={newStudent.firstName}
                  onChange={(e) => setNewStudent({...newStudent, firstName: e.target.value})}
                  placeholder="Ism kiriting"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Familiya</label>
                <Input
                  value={newStudent.lastName}
                  onChange={(e) => setNewStudent({...newStudent, lastName: e.target.value})}
                  placeholder="Familiya kiriting"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Sinf</label>
                <select 
                  value={newStudent.grade}
                  onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Sinfni tanlang</option>
                  <option value="8">8-sinf</option>
                  <option value="9">9-sinf</option>
                  <option value="10">10-sinf</option>
                  <option value="11">11-sinf</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Guruh</label>
                <select 
                  value={newStudent.class}
                  onChange={(e) => setNewStudent({...newStudent, class: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Guruhni tanlang</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Telefon</label>
                <Input
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                  placeholder="+998901234567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email</label>
                <Input
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Tug'ilgan sana</label>
                <Input
                  type="date"
                  value={newStudent.birthDate}
                  onChange={(e) => setNewStudent({...newStudent, birthDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Ota-ona ismi</label>
                <Input
                  value={newStudent.parentName}
                  onChange={(e) => setNewStudent({...newStudent, parentName: e.target.value})}
                  placeholder="Ota-ona ismi"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Manzil</label>
                <Input
                  value={newStudent.address}
                  onChange={(e) => setNewStudent({...newStudent, address: e.target.value})}
                  placeholder="To'liq manzil"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Ota-ona telefoni</label>
                <Input
                  value={newStudent.parentPhone}
                  onChange={(e) => setNewStudent({...newStudent, parentPhone: e.target.value})}
                  placeholder="+998901234567"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Bekor qilish
              </Button>
              <Button onClick={handleAddStudent} className="bg-blue-500 hover:bg-blue-600">
                Qo'shish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}