'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Award, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

export function Dashboard() {
  const stats = [
    {
      title: 'Jami o\'quvchilar',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'O\'qituvchilar',
      value: '89',
      change: '+3%',
      changeType: 'positive',
      icon: GraduationCap,
    },
    {
      title: 'Fanlar soni',
      value: '15',
      change: '+1',
      changeType: 'positive',
      icon: BookOpen,
    },
    {
      title: 'O\'rtacha baho',
      value: '4.2',
      change: '+0.3',
      changeType: 'positive',
      icon: Award,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'success',
      title: 'Yangi o\'quvchi qo\'shildi',
      description: 'Aliyev Sardor 9-A sinfga qo\'shildi',
      time: '2 daqiqa oldin',
    },
    {
      id: 2,
      type: 'info',
      title: 'Dars jadvali yangilandi',
      description: 'Matematika fanidan yangi dars qo\'shildi',
      time: '15 daqiqa oldin',
    },
    {
      id: 3,
      type: 'warning',
      title: 'Baho kiritilmagan',
      description: '7-B sinf fizika fanidan baholar kiritilmagan',
      time: '1 soat oldin',
    },
    {
      id: 4,
      type: 'success',
      title: 'Hisobot tayyor',
      description: 'Oylik hisobot muvaffaqiyatli yaratildi',
      time: '2 soat oldin',
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bosh sahifa</h1>
        <p className="text-gray-600 mt-2">Maktab faoliyatini kuzatish va boshqarish</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className={`text-sm mt-1 ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change} o'tgan oydan
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>So'nggi faoliyat</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {activity.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {activity.type === 'info' && <TrendingUp className="w-4 h-4 text-blue-500" />}
                  {activity.type === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Tezkor amallar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full p-4 text-left bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all">
              <h3 className="font-semibold">Yangi o'quvchi qo'shish</h3>
              <p className="text-sm opacity-90">Maktabga yangi o'quvchi ro'yxatdan o'tkazish</p>
            </button>
            <button className="w-full p-4 text-left bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all">
              <h3 className="font-semibold">Baho kiritish</h3>
              <p className="text-sm opacity-90">O'quvchilarga baholar qo'yish</p>
            </button>
            <button className="w-full p-4 text-left bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all">
              <h3 className="font-semibold">Hisobot yaratish</h3>
              <p className="text-sm opacity-90">Oylik yoki yillik hisobot tayyorlash</p>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}