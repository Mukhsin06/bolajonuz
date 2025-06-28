'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Award, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  BookOpen,
  Users
} from 'lucide-react';

interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  grade: number;
  date: string;
  quarter: number;
  type: 'daily' | 'control' | 'exam';
  teacherId: string;
  teacherName: string;
  class: string;
}

export function Grades() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [grades, setGrades] = useState<Grade[]>([
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
    },
    {
      id: '3',
      studentId: '3',
      studentName: 'Jasur Rahimov',
      subject: 'O\'zbek tili',
      grade: 4,
      date: '2024-01-18',
      quarter: 2,
      type: 'exam',
      teacherId: '3',
      teacherName: 'Gulnora Toshmatova',
      class: '8A'
    }
  ]);

  const [newGrade, setNewGrade] = useState({
    studentName: '',
    subject: '',
    grade: 5,
    type: 'daily' as 'daily' | 'control' | 'exam',
    class: ''
  });

  const filteredGrades = grades.filter(grade => {
    const matchesSearch = 
      grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === 'all' || grade.subject === selectedSubject;
    const matchesClass = selectedClass === 'all' || grade.class === selectedClass;
    
    return matchesSearch && matchesSubject && matchesClass;
  });

  const gradeStats = {
    total: grades.length,
    average: grades.reduce((sum, g) => sum + g.grade, 0) / grades.length,
    excellent: grades.filter(g => g.grade === 5).length,
    good: grades.filter(g => g.grade === 4).length
  };

  const subjects = ['Matematika', 'Fizika', 'Kimyo', 'Biologiya', 'O\'zbek tili', 'Ingliz tili'];
  const classes = ['8A', '8B', '9A', '9B', '10A', '10B', '11A', '11B'];

  const getGradeBadge = (grade: number) => {
    if (grade === 5) return 'bg-green-100 text-green-800';
    if (grade === 4) return 'bg-blue-100 text-blue-800';
    if (grade === 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'daily': return 'Kundalik';
      case 'control': return 'Nazorat';
      case 'exam': return 'Imtihon';
      default: return type;
    }
  };

  const handleAddGrade = () => {
    const grade: Grade = {
      id: Date.now().toString(),
      studentId: Date.now().toString(),
      ...newGrade,
      date: new Date().toISOString().split('T')[0],
      quarter: 2,
      teacherId: '1',
      teacherName: 'O\'qituvchi'
    };
    setGrades([...grades, grade]);
    setNewGrade({
      studentName: '',
      subject: '',
      grade: 5,
      type: 'daily',
      class: ''
    });
    setShowAddModal(false);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Baholar</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">O'quvchilar baholarini boshqarish</p>
        </div>
        <Button 
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Baho qo'yish
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-3 rounded-full">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Jami baholar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{gradeStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">O'rtacha baho</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{gradeStats.average.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">A'lo baholar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{gradeStats.excellent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Yaxshi baholar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{gradeStats.good}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Baholar ro'yxati</TabsTrigger>
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
                    placeholder="O'quvchi yoki fan qidirish..."
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
                <select 
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">Barcha sinflar</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Grades List */}
          <Card>
            <CardHeader>
              <CardTitle>Baholar ro'yxati</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredGrades.map((grade) => (
                  <div key={grade.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{grade.grade}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">{grade.studentName}</h3>
                          <Badge className={getGradeBadge(grade.grade)}>
                            {grade.grade}
                          </Badge>
                          <Badge variant="outline">{getTypeLabel(grade.type)}</Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{grade.subject} • {grade.class}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{grade.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{grade.teacherName}</span>
                          </div>
                        </div>
                      </div>
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
                <CardTitle>Fan bo'yicha o'rtacha baholar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjects.map((subject) => {
                    const subjectGrades = grades.filter(g => g.subject === subject);
                    const average = subjectGrades.length > 0 
                      ? subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length 
                      : 0;
                    return (
                      <div key={subject} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{subject}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-500">{average.toFixed(1)}</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-orange-500 h-2 rounded-full"
                              style={{ width: `${(average / 5) * 100}%` }}
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
                  {[5, 4, 3, 2].map((gradeValue) => {
                    const count = grades.filter(g => g.grade === gradeValue).length;
                    const percentage = grades.length > 0 ? (count / grades.length) * 100 : 0;
                    const colors = {
                      5: 'bg-green-500',
                      4: 'bg-blue-500',
                      3: 'bg-yellow-500',
                      2: 'bg-red-500'
                    };
                    return (
                      <div key={gradeValue} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{gradeValue} baho</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-500">{count} ta</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${colors[gradeValue as keyof typeof colors]} h-2 rounded-full`}
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

      {/* Add Grade Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Baho qo'yish</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">O'quvchi ismi</label>
                <Input
                  value={newGrade.studentName}
                  onChange={(e) => setNewGrade({...newGrade, studentName: e.target.value})}
                  placeholder="O'quvchi ismini kiriting"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Fan</label>
                <select 
                  value={newGrade.subject}
                  onChange={(e) => setNewGrade({...newGrade, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Fanni tanlang</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Sinf</label>
                <select 
                  value={newGrade.class}
                  onChange={(e) => setNewGrade({...newGrade, class: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Sinfni tanlang</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Baho turi</label>
                <select 
                  value={newGrade.type}
                  onChange={(e) => setNewGrade({...newGrade, type: e.target.value as 'daily' | 'control' | 'exam'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="daily">Kundalik</option>
                  <option value="control">Nazorat</option>
                  <option value="exam">Imtihon</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Baho</label>
                <select 
                  value={newGrade.grade}
                  onChange={(e) => setNewGrade({...newGrade, grade: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value={5}>5 - A'lo</option>
                  <option value={4}>4 - Yaxshi</option>
                  <option value={3}>3 - Qoniqarli</option>
                  <option value={2}>2 - Qoniqarsiz</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Bekor qilish
              </Button>
              <Button onClick={handleAddGrade} className="bg-orange-500 hover:bg-orange-600">
                Qo'shish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}