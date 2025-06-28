'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Clock,
  Users
} from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  hoursPerWeek: number;
  teacherCount: number;
  studentCount: number;
  grade: string[];
  status: 'active' | 'inactive';
}

export function Subjects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([
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
    },
    {
      id: '3',
      name: 'O\'zbek tili',
      code: 'UZB',
      description: 'Ona tili va adabiyot',
      hoursPerWeek: 5,
      teacherCount: 4,
      studentCount: 150,
      grade: ['8', '9', '10', '11'],
      status: 'active'
    },
    {
      id: '4',
      name: 'Ingliz tili',
      code: 'ENG',
      description: 'Chet tili va grammatika',
      hoursPerWeek: 3,
      teacherCount: 3,
      studentCount: 150,
      grade: ['8', '9', '10', '11'],
      status: 'active'
    }
  ]);

  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    description: '',
    hoursPerWeek: 0,
    grade: [] as string[]
  });

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subjectStats = {
    total: subjects.length,
    active: subjects.filter(s => s.status === 'active').length,
    totalHours: subjects.reduce((sum, s) => sum + s.hoursPerWeek, 0),
    totalStudents: subjects.reduce((sum, s) => sum + s.studentCount, 0)
  };

  const handleAddSubject = () => {
    const subject: Subject = {
      id: Date.now().toString(),
      ...newSubject,
      teacherCount: 0,
      studentCount: 0,
      status: 'active'
    };
    setSubjects([...subjects, subject]);
    setNewSubject({
      name: '',
      code: '',
      description: '',
      hoursPerWeek: 0,
      grade: []
    });
    setShowAddModal(false);
  };

  const handleGradeChange = (grade: string, checked: boolean) => {
    if (checked) {
      setNewSubject({...newSubject, grade: [...newSubject.grade, grade]});
    } else {
      setNewSubject({...newSubject, grade: newSubject.grade.filter(g => g !== grade)});
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Fanlar</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Maktab fanlarini boshqarish</p>
        </div>
        <Button 
          className="bg-purple-500 hover:bg-purple-600"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Yangi fan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Jami fanlar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{subjectStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Faol fanlar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{subjectStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Haftalik soatlar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{subjectStats.totalHours}</p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Jami o'quvchilar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{subjectStats.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Fan qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <Badge variant="outline">{subject.code}</Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{subject.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Haftalik soat:</span>
                  <Badge className="bg-blue-100 text-blue-800">{subject.hoursPerWeek} soat</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">O'qituvchilar:</span>
                  <span className="text-sm font-medium">{subject.teacherCount} ta</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">O'quvchilar:</span>
                  <span className="text-sm font-medium">{subject.studentCount} ta</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Sinflar:</span>
                  <div className="flex space-x-1">
                    {subject.grade.map(grade => (
                      <Badge key={grade} variant="secondary" className="text-xs">
                        {grade}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Yangi fan qo'shish</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Fan nomi</label>
                <Input
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                  placeholder="Fan nomini kiriting"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Fan kodi</label>
                <Input
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                  placeholder="MATH, PHYS, ..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Tavsif</label>
                <Input
                  value={newSubject.description}
                  onChange={(e) => setNewSubject({...newSubject, description: e.target.value})}
                  placeholder="Fan haqida qisqacha"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Haftalik soat</label>
                <Input
                  type="number"
                  value={newSubject.hoursPerWeek}
                  onChange={(e) => setNewSubject({...newSubject, hoursPerWeek: Number(e.target.value)})}
                  placeholder="Haftalik soat soni"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Sinflar</label>
                <div className="grid grid-cols-4 gap-2">
                  {['8', '9', '10', '11'].map(grade => (
                    <label key={grade} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newSubject.grade.includes(grade)}
                        onChange={(e) => handleGradeChange(grade, e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm dark:text-gray-300">{grade}-sinf</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Bekor qilish
              </Button>
              <Button onClick={handleAddSubject} className="bg-purple-500 hover:bg-purple-600">
                Qo'shish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}