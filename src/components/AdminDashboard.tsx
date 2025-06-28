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
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { StorageManager } from '@/utils/storage';
import { AuthManager } from '@/utils/auth';
import { format } from 'date-fns';
import type { Child, Attendance, Payment, DashboardStats, TeacherAttendance, User } from '@/types';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalChildren: 0,
    presentToday: 0,
    absentToday: 0,
    monthlyIncome: 0,
    totalGroups: 0
  });
  const [recentAbsences, setRecentAbsences] = useState<Array<{ child: Child; date: string }>>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<User | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const children = StorageManager.load<Child[]>('children', []);
    const attendance = StorageManager.load<Attendance[]>('attendance', []);
    const teacherAttendance = StorageManager.load<TeacherAttendance[]>('teacherAttendance', []);
    const payments = StorageManager.load<Payment[]>('payments', []);
    const allUsers = AuthManager.getAllUsers();
    
    const today = format(new Date(), 'yyyy-MM-dd');
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Calculate stats
    const activeChildren = children.filter(c => c.isActive);
    const todayAttendance = attendance.filter(a => a.date === today);
    const presentToday = todayAttendance.filter(a => a.status === 'present').length;
    const absentToday = todayAttendance.filter(a => a.status === 'absent').length;
    
    const monthlyIncome = payments
      .filter(p => new Date(p.date).getMonth() === currentMonth && new Date(p.date).getFullYear() === currentYear)
      .reduce((sum, p) => sum + p.amount, 0);

    const groups = [...new Set(activeChildren.map(c => c.group))];

    // Recent absences
    const recentAbsent = attendance
      .filter(a => a.status === 'absent')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(a => ({
        child: activeChildren.find(c => c.id === a.childId)!,
        date: a.date
      }))
      .filter(item => item.child);

    const teacherUsers = allUsers.filter(u => u.role === 'teacher' && u.isActive);

    setStats({
      totalChildren: activeChildren.length,
      presentToday,
      absentToday,
      monthlyIncome,
      totalGroups: groups.length
    });

    setRecentAbsences(recentAbsent);
    setTeachers(teacherUsers);
  };

  const handleAddTeacher = (teacherData: any) => {
    const newTeacher = {
      ...teacherData,
      id: Date.now().toString(),
      role: 'teacher',
      isActive: true,
      teacherCode: AuthManager.generateTeacherCode()
    };
    
    AuthManager.addUser(newTeacher);
    loadDashboardData();
    setShowTeacherModal(false);
  };

  const handleEditTeacher = (teacherData: any) => {
    if (editingTeacher) {
      AuthManager.updateUser(editingTeacher.id, teacherData);
      loadDashboardData();
      setEditingTeacher(null);
    }
  };

  const handleDeleteTeacher = (teacherId: string) => {
    if (confirm('Rostdan ham bu o\'qituvchini o\'chirmoqchimisiz?')) {
      AuthManager.updateUser(teacherId, { isActive: false });
      loadDashboardData();
    }
  };

  const TeacherForm: React.FC<{
    teacher?: User;
    onSubmit: (data: any) => void;
    onCancel: () => void;
  }> = ({ teacher, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
      name: teacher?.name || '',
      username: teacher?.username || '',
      password: '',
      assignedGroups: teacher?.assignedGroups || []
    });

    const groups = ['1-2 yosh', '2-3 yosh', '3-4 yosh', '4-5 yosh', '5-6 yosh'];

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    const toggleGroup = (group: string) => {
      const newGroups = formData.assignedGroups.includes(group)
        ? formData.assignedGroups.filter(g => g !== group)
        : [...formData.assignedGroups, group];
      setFormData({ ...formData, assignedGroups: newGroups });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {teacher ? 'O\'qituvchini tahrirlash' : 'Yangi o\'qituvchi qo\'shish'}
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                To'liq ism *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Foydalanuvchi nomi *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Parol {teacher ? '(bo\'sh qoldiring o\'zgartirilmasin)' : '*'}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required={!teacher}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tayinlangan guruhlar
              </label>
              <div className="space-y-2">
                {groups.map(group => (
                  <label key={group} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.assignedGroups.includes(group)}
                      onChange={() => toggleGroup(group)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{group}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                {teacher ? 'Saqlash' : 'Qo\'shish'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
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
            Administrator paneli
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Bugungi holat va statistika
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Bugun: {format(new Date(), 'dd.MM.yyyy')}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Jami bolalar"
          value={stats.totalChildren}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          title="Bugun kelganlar"
          value={stats.presentToday}
          icon={<UserCheck className="h-6 w-6 text-green-600" />}
          color="bg-green-50"
        />
        <StatCard
          title="Bugun kelmaganlar"
          value={stats.absentToday}
          icon={<UserX className="h-6 w-6 text-red-600" />}
          color="bg-red-50"
        />
        <StatCard
          title="Oylik daromad"
          value={`${stats.monthlyIncome.toLocaleString()} so'm`}
          icon={<DollarSign className="h-6 w-6 text-purple-600" />}
          color="bg-purple-50"
        />
      </div>

      {/* Teachers Management */}
      <div className="rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            O'qituvchilar boshqaruvi
          </h3>
          <button
            onClick={() => setShowTeacherModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yangi o'qituvchi
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-3">
                    <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {teacher.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {teacher.teacherCode}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingTeacher(teacher)}
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTeacher(teacher.id)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {teacher.assignedGroups?.map((group, index) => (
                  <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {group}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Absences */}
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

        {/* Quick Actions */}
        <div className="rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Tezkor amallar
          </h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 rounded-lg transition-colors bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-900 dark:text-blue-300">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-3" />
                <span className="font-medium">Bugungi davomat</span>
              </div>
              <span>→</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-lg transition-colors bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-900 dark:text-green-300">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 mr-3" />
                <span className="font-medium">To'lov qo'shish</span>
              </div>
              <span>→</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-lg transition-colors bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-900 dark:text-purple-300">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-3" />
                <span className="font-medium">Yangi bola qo'shish</span>
              </div>
              <span>→</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-lg transition-colors bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-900 dark:text-orange-300">
              <div className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-3" />
                <span className="font-medium">O'qituvchilar davomati</span>
              </div>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Teacher Modals */}
      {showTeacherModal && (
        <TeacherForm
          onSubmit={handleAddTeacher}
          onCancel={() => setShowTeacherModal(false)}
        />
      )}

      {editingTeacher && (
        <TeacherForm
          teacher={editingTeacher}
          onSubmit={handleEditTeacher}
          onCancel={() => setEditingTeacher(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;