import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  CreditCard, 
  TrendingUp,
  UserCheck,
  UserX,
  Baby,
  DollarSign
} from 'lucide-react';
import { StorageManager } from '../utils/storage';
import { format } from 'date-fns';
import type { Child, Attendance, Payment, DashboardStats } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalChildren: 0,
    presentToday: 0,
    absentToday: 0,
    monthlyIncome: 0,
    totalGroups: 0
  });
  const [recentAbsences, setRecentAbsences] = useState<Array<{ child: Child; date: string }>>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const children = StorageManager.load<Child[]>('children', []);
    const attendance = StorageManager.load<Attendance[]>('attendance', []);
    const payments = StorageManager.load<Payment[]>('payments', []);
    
    const today = format(new Date(), 'yyyy-MM-dd');
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Calculate stats
    const todayAttendance = attendance.filter(a => a.date === today);
    const presentToday = todayAttendance.filter(a => a.status === 'present').length;
    const absentToday = todayAttendance.filter(a => a.status === 'absent').length;
    
    const monthlyIncome = payments
      .filter(p => new Date(p.date).getMonth() === currentMonth && new Date(p.date).getFullYear() === currentYear)
      .reduce((sum, p) => sum + p.amount, 0);

    const groups = [...new Set(children.map(c => c.group))];

    // Recent absences
    const recentAbsent = attendance
      .filter(a => a.status === 'absent')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(a => ({
        child: children.find(c => c.id === a.childId)!,
        date: a.date
      }))
      .filter(item => item.child);

    setStats({
      totalChildren: children.filter(c => c.isActive).length,
      presentToday,
      absentToday,
      monthlyIncome,
      totalGroups: groups.length
    });

    setRecentAbsences(recentAbsent);
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: string;
  }> = ({ title, value, icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bosh sahifa</h1>
          <p className="text-gray-600 mt-1">Bugungi holat va statistika</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <p className="text-sm text-gray-500">
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Absences */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">So'nggi kelmaganlar</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentAbsences.length > 0 ? (
              recentAbsences.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      <Baby className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.child.name} {item.child.surname}</p>
                      <p className="text-sm text-gray-500">{item.child.group} guruh</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(new Date(item.date), 'dd.MM')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Hozircha kelmaganlar yo'q</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tezkor amallar</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                <span className="font-medium text-blue-900">Bugungi davomat</span>
              </div>
              <span className="text-blue-600">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-green-600 mr-3" />
                <span className="font-medium text-green-900">To'lov qo'shish</span>
              </div>
              <span className="text-green-600">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-purple-600 mr-3" />
                <span className="font-medium text-purple-900">Yangi bola qo'shish</span>
              </div>
              <span className="text-purple-600">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;