'use client';

import { cn } from '@/lib/utils';
import { 
  Home, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Award, 
  BarChart3, 
  Calendar,
  FileText,
  Settings,
  ChevronDown,
  UserCog
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: 'admin' | 'teacher' | 'student';
}

export function Sidebar({ activeTab, setActiveTab, userRole }: SidebarProps) {
  const [schoolOpen, setSchoolOpen] = useState(false);

  const navigation = [
    { id: 'dashboard', name: 'Bosh sahifa', icon: Home, roles: ['admin', 'teacher'] },
    { id: 'students', name: 'O\'quvchilar', icon: Users, roles: ['admin', 'teacher'] },
    { id: 'teachers', name: 'O\'qituvchilar', icon: GraduationCap, roles: ['admin'] },
    { id: 'subjects', name: 'Fanlar', icon: BookOpen, roles: ['admin', 'teacher'] },
    { id: 'grades', name: 'Baholar', icon: Award, roles: ['admin', 'teacher'] },
    { id: 'statistics', name: 'Statistika', icon: BarChart3, roles: ['admin', 'teacher'] },
    { id: 'schedule', name: 'Dars jadvali', icon: Calendar, roles: ['admin', 'teacher'] },
    { id: 'reports', name: 'Hisobotlar', icon: FileText, roles: ['admin', 'teacher'] },
    { id: 'student-management', name: 'Login boshqaruvi', icon: UserCog, roles: ['admin'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ta'lim Tizimi</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">1-son maktab</p>
          </div>
        </div>
      </div>

      {/* School Selector */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setSchoolOpen(!schoolOpen)}
          className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">M</span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Maktab boshqaruvi</span>
          </div>
          <ChevronDown className={cn(
            "w-4 h-4 text-gray-400 transition-transform",
            schoolOpen && "rotate-180"
          )} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2.5 text-left rounded-lg transition-all duration-200",
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <Icon className={cn(
                "w-5 h-5",
                isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
              )} />
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full flex items-center space-x-3 px-3 py-2.5 text-left rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium">Sozlamalar</span>
        </button>
      </div>
    </div>
  );
}