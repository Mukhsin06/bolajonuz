'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataStorage, STORAGE_KEYS } from '@/lib/storage';
import { 
  Award, 
  Calendar,
  BookOpen,
  TrendingUp,
  BarChart3
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

interface StudentGradesProps {
  studentId: string;
  studentName: string;
}

export function StudentGrades({ studentId, studentName }: StudentGradesProps) {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedQuarter, setSelectedQuarter] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storage = DataStorage.getInstance();
    const allGrades = storage.load(STORAGE_KEYS.GRADES, []);
    const studentGrades = allGrades.filter((grade: Grade) => grade.studentId === studentId);
    setGrades(studentGrades);
  }, [studentId]);

  if (!mounted) {
    return null;
  }

  const filteredGrades = grades.filter(grade => {
    const matchesSubject = selectedSubject === 'all' || grade.subject === selectedSubject;
    const matchesQuarter = selectedQuarter === 'all' || grade.quarter.toString() === selectedQuarter;
    return matchesSubject && matchesQuarter;
  });

  const subjects = [...new Set(grades.map(g => g.subject))];
  const quarters = [...new Set(grades.map(g => g.quarter))];

  const gradeStats = {
    total: grades.length,
    average: grades.length > 0 ? grades.reduce((sum, g) => sum + g.grade, 0) / grades.length : 0,
    excellent: grades.filter(g => g.grade === 5).length,
    good: grades.filter(g => g.grade === 4).length,
    satisfactory: grades.filter(g => g.grade === 3).length,
    unsatisfactory: grades.filter(g => g.grade === 2).length
  };

  const subjectAverages = subjects.map(subject => {
    const subjectGrades = grades.filter(g => g.subject === subject);
    const average = subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length;
    return { subject, average, count: subjectGrades.length };
  });

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

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mening baholarim</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">{studentName} - shaxsiy baho jadvali</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Award className="w-6 h-6 text-blue-600" />
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
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">O'rtacha</p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">A'lo (5)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{gradeStats.excellent}</p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Yaxshi (4)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{gradeStats.good}</p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Qoniqarli (3)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{gradeStats.satisfactory}</p>
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
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Fan</label>
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
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Chorak</label>
                  <select 
                    value={selectedQuarter}
                    onChange={(e) => setSelectedQuarter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    <option value="all">Barcha choraklar</option>
                    {quarters.map(quarter => (
                      <option key={quarter} value={quarter.toString()}>{quarter}-chorak</option>
                    ))}
                  </select>
                </div>
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
                {filteredGrades.length > 0 ? (
                  filteredGrades.map((grade) => (
                    <div key={grade.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{grade.grade}</span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900 dark:text-white">{grade.subject}</h3>
                            <Badge className={getGradeBadge(grade.grade)}>
                              {grade.grade}
                            </Badge>
                            <Badge variant="outline">{getTypeLabel(grade.type)}</Badge>
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{grade.date}</span>
                            </div>
                            <span>{grade.quarter}-chorak</span>
                            <span>O'qituvchi: {grade.teacherName}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Award className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Hozircha baholar mavjud emas</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subject Averages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Fan bo'yicha o'rtacha baholar</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjectAverages.map((item) => (
                    <div key={item.subject} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">{item.subject}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">{item.average.toFixed(1)}</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${(item.average / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Grade Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Baho taqsimoti</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { grade: 5, label: 'A\'lo', count: gradeStats.excellent, color: 'bg-green-500' },
                    { grade: 4, label: 'Yaxshi', count: gradeStats.good, color: 'bg-blue-500' },
                    { grade: 3, label: 'Qoniqarli', count: gradeStats.satisfactory, color: 'bg-yellow-500' },
                    { grade: 2, label: 'Qoniqarsiz', count: gradeStats.unsatisfactory, color: 'bg-red-500' }
                  ].map((item) => {
                    const percentage = gradeStats.total > 0 ? (item.count / gradeStats.total) * 100 : 0;
                    return (
                      <div key={item.grade} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.label}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-500">{item.count} ta</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${item.color} h-2 rounded-full`}
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
    </div>
  );
}