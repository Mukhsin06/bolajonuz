'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Award,
  Calendar,
  BarChart3,
  PieChart
} from 'lucide-react';

export function Statistics() {
  const overallStats = {
    totalStudents: 1247,
    totalTeachers: 89,
    totalSubjects: 15,
    averageGrade: 4.2,
    attendanceRate: 94.5,
    graduationRate: 98.2
  };

  const gradeDistribution = [
    { grade: '8-sinf', students: 312, percentage: 25 },
    { grade: '9-sinf', students: 298, percentage: 24 },
    { grade: '10-sinf', students: 334, percentage: 27 },
    { grade: '11-sinf', students: 303, percentage: 24 }
  ];

  const subjectPerformance = [
    { subject: 'Matematika', average: 4.3, students: 1247 },
    { subject: 'O\'zbek tili', average: 4.5, students: 1247 },
    { subject: 'Ingliz tili', average: 4.1, students: 1247 },
    { subject: 'Fizika', average: 4.0, students: 890 },
    { subject: 'Kimyo', average: 4.2, students: 890 },
    { subject: 'Biologiya', average: 4.4, students: 890 }
  ];

  const monthlyTrends = [
    { month: 'Sentyabr', students: 1200, attendance: 96.2, avgGrade: 4.1 },
    { month: 'Oktyabr', students: 1220, attendance: 95.8, avgGrade: 4.2 },
    { month: 'Noyabr', students: 1235, attendance: 94.5, avgGrade: 4.2 },
    { month: 'Dekabr', students: 1240, attendance: 93.2, avgGrade: 4.3 },
    { month: 'Yanvar', students: 1247, attendance: 94.5, avgGrade: 4.2 }
  ];

  const teacherStats = [
    { category: 'Tajriba 0-5 yil', count: 25, percentage: 28 },
    { category: 'Tajriba 6-15 yil', count: 42, percentage: 47 },
    { category: 'Tajriba 16+ yil', count: 22, percentage: 25 }
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Statistika</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Maktab faoliyati bo'yicha to'liq tahlil</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">O'quvchilar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{overallStats.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">O'qituvchilar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{overallStats.totalTeachers}</p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Fanlar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{overallStats.totalSubjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-3 rounded-full">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">O'rtacha baho</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{overallStats.averageGrade}</p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Davomat</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{overallStats.attendanceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Bitiruvchilar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{overallStats.graduationRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="students">O'quvchilar</TabsTrigger>
          <TabsTrigger value="teachers">O'qituvchilar</TabsTrigger>
          <TabsTrigger value="subjects">Fanlar</TabsTrigger>
          <TabsTrigger value="trends">Tendensiyalar</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grade Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5" />
                  <span>Sinf bo'yicha taqsimot</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gradeDistribution.map((grade) => (
                    <div key={grade.grade} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span className="font-medium text-gray-900 dark:text-white">{grade.grade}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">{grade.students} o'quvchi</span>
                        <Badge variant="secondary">{grade.percentage}%</Badge>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${grade.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance by Grade */}
            <Card>
              <CardHeader>
                <CardTitle>Sinf bo'yicha natijalar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gradeDistribution.map((grade) => {
                    const avgGrade = 4.0 + Math.random() * 0.8; // Simulated data
                    return (
                      <div key={grade.grade} className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">{grade.grade}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-500">O'rtacha: {avgGrade.toFixed(1)}</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(avgGrade / 5) * 100}%` }}
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

        <TabsContent value="teachers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Teacher Experience */}
            <Card>
              <CardHeader>
                <CardTitle>O'qituvchilar tajribasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teacherStats.map((stat) => (
                    <div key={stat.category} className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">{stat.category}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">{stat.count} o'qituvchi</span>
                        <Badge variant="secondary">{stat.percentage}%</Badge>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${stat.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Teacher Load */}
            <Card>
              <CardHeader>
                <CardTitle>O'qituvchilar yuklami</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Matematika', 'Fizika', 'Kimyo', 'Biologiya'].map((subject) => {
                    const load = 15 + Math.random() * 10; // Simulated data
                    return (
                      <div key={subject} className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">{subject}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-500">{load.toFixed(0)} soat/hafta</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full"
                              style={{ width: `${(load / 25) * 100}%` }}
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

        <TabsContent value="subjects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fanlar bo'yicha natijalar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectPerformance.map((subject) => (
                  <div key={subject.subject} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{subject.subject}</h3>
                        <p className="text-sm text-gray-500">{subject.students} o'quvchi</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">{subject.average}</p>
                        <p className="text-sm text-gray-500">O'rtacha baho</p>
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${(subject.average / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Oylik tendensiyalar</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {monthlyTrends.map((trend) => (
                  <div key={trend.month} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">{trend.month}</h3>
                      <Badge variant="outline">{trend.students} o'quvchi</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-500">Davomat</span>
                          <span className="text-sm font-medium">{trend.attendance}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${trend.attendance}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-500">O'rtacha baho</span>
                          <span className="text-sm font-medium">{trend.avgGrade}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(trend.avgGrade / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}