'use client'

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  CreditCard, 
  TrendingUp,
  UserCheck,
  UserX,
  Baby,
  DollarSign,
  GraduationCap,
  Clock,
  BookOpen,
  Award
} from 'lucide-react';
import { StorageManager } from '@/utils/storage';
import { AuthManager } from '@/utils/auth';
import { format } from 'date-fns';
import type { Child, Attendance, Payment, TeacherStats, TeacherAttendance } from '@/types';

const TeacherDashboard: React.FC = () => {
  const [stats, setStats] = useState<TeacherStats>({
    myChildren: 0,
    myPresentToday: 0,
    myAbsentToday: 0,
    myMonthlyIncome: 0,
    myAttendanceRate: 0
  });
  const [myChildren, setMyChildren] = useState<Child[]>([]);
  const [recentAbsences, setRecentAbsences] = useState<Array<{ child: Child; date: string }>>([]);
  const [myAttendance, setMyAttendance] = useState<TeacherAttendance[]>([]);

  const currentUser = AuthManager.getCurrentUser();

  useEffect(() => {
    loadTeacherData();
  }, []);

  const loadTeacherData = () => {
    if (!currentUser || currentUser.role !== 'teacher') return;

    const children = StorageManager.load<Child[]>('children', []);
    const attendance = StorageManager.load<Attendance[]>('attendance', []);
    const teacherAttendance = StorageManager.load<TeacherAttendance[]>('teacherAttendance', []);
    const payments = StorageManager.load<Payment[]>('payments', []);
    
    const today = format(new Date(), 'yyyy-MM-dd');
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Filter children assigned to this teacher
    const teacherChildren = children.filter(c => 
      c.isActive && 
      currentUser.assignedGroups?.includes(c.group)
    );

    // Calculate teacher stats
    const todayAttendance = attendance.filter(a => 
      a.date === today && 
      teacherChildren.some(c => c.id === a.childId)
    );
    
    const presentToday = todayAttendance.filter(a => a.status === 'present').length;
    const absentToday = todayAttendance.filter(a => a.status === 'absent').length;
    
    const monthlyIncome = payments
      .filter(p => 
        new Date(p.date).getMonth() === currentMonth && 
        new Date(p.date).getFullYear() === currentYear &&
        teacherChildren.some(c => c.id === p.childId)
      )
      .reduce((sum, p) => sum + p.amount, 0);

    // Calculate teacher's own attendance rate
    const myAttendanceRecords = teacherAttendance.filter(a => a.teacherId === currentUser.id);
    const thisMonthAttendance = myAttendanceRecords.filter(a => 
      new Date(a.date).getMonth() === currentMonth &&
      new Date(a.date).getFullYear() === currentYear
    );
    const presentDays = thisMonthAttendance.filter(a => a.status === 'present').length;
    const attendanceRate = thisMonthAttendance.length > 0 ? (presentDays / thisMonthAttendance.length) * 100 : 0;

    // Recent absences from my children
    const recentAbsent = attendance
      .filter(a => 
        a.status === 'absent' && 
        teacherChildren.some(c => c.id === a.childId)
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(a => ({
        child: teacherChildren.find(c => c.id === a.childId)!,
        date: a.date
      }))
      .filter(item => item.child);

    setStats({
      myChildren: teacherChildren.length,
      myPresentToday: presentToday,
      myAbsentToday: absentToday,
      myMonthlyIncome: monthlyIncome,
      myAttendanceRate: attendanceRate
    });

    setMyChildren(teacherChildren);
    setRecentAbsences(recentAbsent);
    setMyAttendance(myAttendanceRecords);
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: string;
  }> = ({ title, value, icon, color, trend }) => (
    <div className="rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mening profilim
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Salom, {currentUser?.name}! (Kod: {currentUser?.teacherCode})
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Bugun: {format(new Date(), 'dd.MM.yyyy')}
          </p>
        </div>
      </div>

      {/* Teacher Info Card */}
      <div className="rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-4">
            <GraduationCap className="h-8 w-8 text-purple-600 dark:text-purple-300" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentUser?.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              O'qituvchi kodi: {currentUser?.teacherCode}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {currentUser?.assignedGroups?.map((group, index) => (
                <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {group}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Mening bolalarim"
          value={stats.myChildren}
          icon={<Baby className="h-6 w-6 text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          title="Bugun kelganlar"
          value={stats.myPresentToday}
          icon={<UserCheck className="h-6 w-6 text-green-600" />}
          color="bg-green-50"
        />
        <StatCard
          title="Bugun kelmaganlar"
          value={stats.myAbsentToday}
          icon={<UserX className="h-6 w-6 text-red-600" />}
          color="bg-red-50"
        />
        <StatCard
          title="Mening davomatim"
          value={`${stats.myAttendanceRate.toFixed(1)}%`}
          icon={<Award className="h-6 w-6 text-purple-600" />}
          color="bg-purple-50"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Children's Recent Absences */}
        <div className="rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              So'nggi kelmaganlar
            </h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentAbsences.length > 0 ? (
              recentAbsences.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-3">
                      <Baby className="h-5 w-5 text-red-600 dark:text-red-300" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.child.name} {item.child.surname}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.child.group} guruh
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(item.date), 'dd.MM')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                Hozircha kelmaganlar yo'q
              </p>
            )}
          </div>
        </div>

        {/* My Children List */}
        <div className="rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Mening bolalarim
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {myChildren.map((child) => (
              <div key={child.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                    <Baby className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {child.name} {child.surname}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {child.age} yosh
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {child.group}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Income */}
      <div className="rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Oylik daromad (mening guruhlarim)
          </h3>
          <DollarSign className="h-5 w-5 text-gray-400" />
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-green-600 mb-2">
            {stats.myMonthlyIncome.toLocaleString()} so'm
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {format(new Date(), 'MMMM yyyy')} oyi uchun
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;