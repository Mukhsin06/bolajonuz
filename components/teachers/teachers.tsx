'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  UserPlus, 
  Search, 
  Filter, 
  Phone,
  Mail,
  Calendar,
  Edit,
  Trash2,
  Eye,
  BookOpen
} from 'lucide-react';

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  subject: string;
  experience: number;
  phone: string;
  email: string;
  birthDate: string;
  address: string;
  education: string;
  salary: number;
  status: 'active' | 'inactive';
  classes: string[];
}

export function Teachers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([
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
    },
    {
      id: '3',
      firstName: 'Gulnora',
      lastName: 'Toshmatova',
      subject: 'O\'zbek tili',
      experience: 20,
      phone: '+998901234569',
      email: 'gulnora@school.uz',
      birthDate: '1980-12-10',
      address: 'Toshkent sh., Chilonzor t.',
      education: 'TDPU, Filologiya',
      salary: 8500000,
      status: 'active',
      classes: ['8A', '8B', '9A']
    }
  ]);

  const [newTeacher, setNewTeacher] = useState({
    firstName: '',
    lastName: '',
    subject: '',
    experience: 0,
    phone: '',
    email: '',
    birthDate: '',
    address: '',
    education: '',
    salary: 0
  });

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === 'all' || teacher.subject === selectedSubject;
    
    return matchesSearch && matchesSubject;
  });

  const teacherStats = {
    total: teachers.length,
    active: teachers.filter(t => t.status === 'active').length,
    averageExperience: teachers.reduce((sum, t) => sum + t.experience, 0) / teachers.length,
    averageSalary: teachers.reduce((sum, t) => sum + t.salary, 0) / teachers.length
  };

  const subjects = ['Matematika', 'Fizika', 'Kimyo', 'Biologiya', 'O\'zbek tili', 'Ingliz tili', 'Tarix', 'Geografiya'];

  const handleAddTeacher = () => {
    const teacher: Teacher = {
      id: Date.now().toString(),
      ...newTeacher,
      status: 'active',
      classes: []
    };
    setTeachers([...teachers, teacher]);
    setNewTeacher({
      firstName: '',
      lastName: '',
      subject: '',
      experience: 0,
      phone: '',
      email: '',
      birthDate: '',
      address: '',
      education: '',
      salary: 0
    });
    setShowAddModal(false);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">O'qituvchilar</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Maktab o'qituvchilarini boshqarish</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtr
          </Button>
          <Button 
            className="bg-green-500 hover:bg-green-600"
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Yangi o'qituvchi
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Jami o'qituvchilar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{teacherStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Faol o'qituvchilar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{teacherStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">O'rtacha tajriba</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{teacherStats.averageExperience.toFixed(1)} yil</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">O'rtacha maosh</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{(teacherStats.averageSalary / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">O'qituvchilar ro'yxati</TabsTrigger>
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
                    placeholder="O'qituvchi qidirish..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">Barcha fanlar</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Teachers List */}
          <Card>
            <CardHeader>
              <CardTitle>O'qituvchilar ro'yxati</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTeachers.map((teacher) => (
                  <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {teacher.firstName[0]}{teacher.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {teacher.firstName} {teacher.lastName}
                          </h3>
                          <Badge className="bg-blue-100 text-blue-800">
                            {teacher.subject}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{teacher.experience} yil tajriba</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Phone className="w-3 h-3" />
                            <span>{teacher.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="w-3 h-3" />
                            <span>{teacher.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>Sinflar: {teacher.classes.join(', ')}</span>
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
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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
                <CardTitle>Fan bo'yicha taqsimot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjects.map((subject) => {
                    const count = teachers.filter(t => t.subject === subject).length;
                    const percentage = teachers.length > 0 ? (count / teachers.length) * 100 : 0;
                    return (
                      <div key={subject} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{subject}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-500">{count} o'qituvchi</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
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
                <CardTitle>Tajriba bo'yicha taqsimot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { range: '0-5', label: 'Yangi', color: 'bg-blue-500' },
                    { range: '6-10', label: 'Tajribali', color: 'bg-green-500' },
                    { range: '11-15', label: 'Katta tajriba', color: 'bg-yellow-500' },
                    { range: '16+', label: 'Veteran', color: 'bg-purple-500' }
                  ].map((exp) => {
                    let count = 0;
                    if (exp.range === '0-5') count = teachers.filter(t => t.experience <= 5).length;
                    else if (exp.range === '6-10') count = teachers.filter(t => t.experience >= 6 && t.experience <= 10).length;
                    else if (exp.range === '11-15') count = teachers.filter(t => t.experience >= 11 && t.experience <= 15).length;
                    else count = teachers.filter(t => t.experience >= 16).length;
                    
                    const percentage = teachers.length > 0 ? (count / teachers.length) * 100 : 0;
                    return (
                      <div key={exp.range} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{exp.label}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-500">{count} o'qituvchi</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${exp.color} h-2 rounded-full`}
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

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Yangi o'qituvchi qo'shish</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Ism</label>
                <Input
                  value={newTeacher.firstName}
                  onChange={(e) => setNewTeacher({...newTeacher, firstName: e.target.value})}
                  placeholder="Ism kiriting"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Familiya</label>
                <Input
                  value={newTeacher.lastName}
                  onChange={(e) => setNewTeacher({...newTeacher, lastName: e.target.value})}
                  placeholder="Familiya kiriting"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Fan</label>
                <select 
                  value={newTeacher.subject}
                  onChange={(e) => setNewTeacher({...newTeacher, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Fanni tanlang</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Tajriba (yil)</label>
                <Input
                  type="number"
                  value={newTeacher.experience}
                  onChange={(e) => setNewTeacher({...newTeacher, experience: Number(e.target.value)})}
                  placeholder="Tajriba yillari"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Telefon</label>
                <Input
                  value={newTeacher.phone}
                  onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})}
                  placeholder="+998901234567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email</label>
                <Input
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                  placeholder="email@school.uz"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Tug'ilgan sana</label>
                <Input
                  type="date"
                  value={newTeacher.birthDate}
                  onChange={(e) => setNewTeacher({...newTeacher, birthDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Ma'lumot</label>
                <Input
                  value={newTeacher.education}
                  onChange={(e) => setNewTeacher({...newTeacher, education: e.target.value})}
                  placeholder="TDPU, Matematika"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Manzil</label>
                <Input
                  value={newTeacher.address}
                  onChange={(e) => setNewTeacher({...newTeacher, address: e.target.value})}
                  placeholder="To'liq manzil"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Maosh (so'm)</label>
                <Input
                  type="number"
                  value={newTeacher.salary}
                  onChange={(e) => setNewTeacher({...newTeacher, salary: Number(e.target.value)})}
                  placeholder="8000000"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Bekor qilish
              </Button>
              <Button onClick={handleAddTeacher} className="bg-green-500 hover:bg-green-600">
                Qo'shish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}