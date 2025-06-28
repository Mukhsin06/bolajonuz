import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  User, 
  Phone, 
  Calendar,
  MapPin,
  UserCheck,
  UserX,
  Clock,
  AlertCircle
} from 'lucide-react';
import { StorageManager } from '../utils/storage';
import { AuthManager } from '../utils/auth';
import { format } from 'date-fns';
import type { User as UserType, TeacherAttendance } from '../types';

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<UserType[]>([]);
  const [attendance, setAttendance] = useState<TeacherAttendance[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<UserType | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allUsers = AuthManager.getAllUsers();
    const teacherUsers = allUsers.filter(u => u.role === 'teacher' && u.isActive);
    const savedAttendance = StorageManager.load<TeacherAttendance[]>('teacherAttendance', []);
    setTeachers(teacherUsers);
    setAttendance(savedAttendance);
  };

  const saveAttendance = (updatedAttendance: TeacherAttendance[]) => {
    StorageManager.save('teacherAttendance', updatedAttendance);
    setAttendance(updatedAttendance);
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTodayAttendance = (teacherId: string) => {
    return attendance.find(a => a.teacherId === teacherId && a.date === selectedDate);
  };

  const markAttendance = (teacherId: string, status: 'present' | 'absent' | 'late' | 'sick', time?: string) => {
    const existingAttendance = getTodayAttendance(teacherId);
    
    if (existingAttendance) {
      const updatedAttendance = attendance.map(a =>
        a.id === existingAttendance.id
          ? {
              ...a,
              status,
              checkIn: status === 'present' ? (time || format(new Date(), 'HH:mm')) : undefined,
              checkOut: a.checkOut
            }
          : a
      );
      saveAttendance(updatedAttendance);
    } else {
      const newAttendance: TeacherAttendance = {
        id: Date.now().toString(),
        teacherId,
        date: selectedDate,
        status,
        checkIn: status === 'present' ? (time || format(new Date(), 'HH:mm')) : undefined,
        notes: ''
      };
      saveAttendance([...attendance, newAttendance]);
    }
  };

  const markCheckOut = (teacherId: string) => {
    const existingAttendance = getTodayAttendance(teacherId);
    if (existingAttendance && existingAttendance.status === 'present') {
      const updatedAttendance = attendance.map(a =>
        a.id === existingAttendance.id
          ? { ...a, checkOut: format(new Date(), 'HH:mm') }
          : a
      );
      saveAttendance(updatedAttendance);
    }
  };

  const handleSpravka = (teacher: UserType) => {
    const existingAttendance = getTodayAttendance(teacher.id);
    if (existingAttendance) {
      const updatedAttendance = attendance.map(a =>
        a.id === existingAttendance.id
          ? { ...a, status: 'absent' as const, notes: 'Spravka bilan' }
          : a
      );
      saveAttendance(updatedAttendance);
    } else {
      const newAttendance: TeacherAttendance = {
        id: Date.now().toString(),
        teacherId: teacher.id,
        date: selectedDate,
        status: 'absent',
        notes: 'Spravka bilan'
      };
      saveAttendance([...attendance, newAttendance]);
    }
    alert(`${teacher.name} uchun spravka qabul qilindi.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'sick': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return 'Kelgan';
      case 'absent': return 'Kelmagan';
      case 'late': return 'Kech kelgan';
      case 'sick': return 'Kasal';
      default: return 'Noma\'lum';
    }
  };

  const todayStats = {
    total: filteredTeachers.length,
    present: filteredTeachers.filter(teacher => getTodayAttendance(teacher.id)?.status === 'present').length,
    absent: filteredTeachers.filter(teacher => getTodayAttendance(teacher.id)?.status === 'absent').length,
    late: filteredTeachers.filter(teacher => getTodayAttendance(teacher.id)?.status === 'late').length,
    notMarked: filteredTeachers.filter(teacher => !getTodayAttendance(teacher.id)).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">O'qituvchilar davomati</h1>
          <p className="text-gray-600 mt-1">O'qituvchilar davomati va vaqt belgilash</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center">
            <User className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Jami</p>
              <p className="text-xl font-bold text-gray-900">{todayStats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Kelgan</p>
              <p className="text-xl font-bold text-green-900">{todayStats.present}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center">
            <UserX className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Kelmagan</p>
              <p className="text-xl font-bold text-red-900">{todayStats.absent}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Kech</p>
              <p className="text-xl font-bold text-yellow-900">{todayStats.late}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-gray-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Belgilanmagan</p>
              <p className="text-xl font-bold text-gray-900">{todayStats.notMarked}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="O'qituvchi ismi bo'yicha qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Teachers Attendance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  O'qituvchi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kelish vaqti
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ketish vaqti
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeachers.map((teacher) => {
                const attendanceRecord = getTodayAttendance(teacher.id);
                return (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {teacher.name}
                          </div>
                          <div className="text-sm text-gray-500">@{teacher.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {attendanceRecord ? (
                        <div className="flex flex-col">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(attendanceRecord.status)}`}>
                            {getStatusText(attendanceRecord.status)}
                          </span>
                          {attendanceRecord.notes && (
                            <span className="text-xs text-blue-600 mt-1">{attendanceRecord.notes}</span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          Belgilanmagan
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {attendanceRecord?.checkIn || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {attendanceRecord?.checkOut || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => markAttendance(teacher.id, 'present')}
                          className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-lg transition-colors text-xs"
                        >
                          Kelgan
                        </button>
                        <button
                          onClick={() => markAttendance(teacher.id, 'absent')}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors text-xs"
                        >
                          Kelmagan
                        </button>
                        <button
                          onClick={() => markAttendance(teacher.id, 'late')}
                          className="text-yellow-600 hover:text-yellow-900 bg-yellow-50 hover:bg-yellow-100 px-3 py-1 rounded-lg transition-colors text-xs"
                        >
                          Kech
                        </button>
                        <button
                          onClick={() => handleSpravka(teacher)}
                          className="text-purple-600 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-lg transition-colors text-xs"
                        >
                          Spravka
                        </button>
                        {attendanceRecord?.status === 'present' && !attendanceRecord.checkOut && (
                          <button
                            onClick={() => markCheckOut(teacher.id)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors text-xs"
                          >
                            Ketdi
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTeachers.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Hech qanday o'qituvchi topilmadi</p>
        </div>
      )}
    </div>
  );
};

export default Teachers;