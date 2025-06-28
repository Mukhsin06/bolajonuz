import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  UserCheck, 
  UserX, 
  AlertCircle,
  Baby,
  Search,
  Filter,
  FileText,
  Minus
} from 'lucide-react';
import { StorageManager } from '../utils/storage';
import { TelegramBot } from '../utils/telegram';
import { format } from 'date-fns';
import type { Child, Attendance as AttendanceType, Payment } from '../types';

const Attendance: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [attendance, setAttendance] = useState<AttendanceType[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [showSpravkaModal, setShowSpravkaModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedChildren = StorageManager.load<Child[]>('children', []);
    const savedAttendance = StorageManager.load<AttendanceType[]>('attendance', []);
    const savedPayments = StorageManager.load<Payment[]>('payments', []);
    setChildren(savedChildren.filter(c => c.isActive));
    setAttendance(savedAttendance);
    setPayments(savedPayments);
  };

  const saveAttendance = (updatedAttendance: AttendanceType[]) => {
    StorageManager.save('attendance', updatedAttendance);
    setAttendance(updatedAttendance);
  };

  const savePayments = (updatedPayments: Payment[]) => {
    StorageManager.save('payments', updatedPayments);
    setPayments(updatedPayments);
  };

  const groups = ['1-2 yosh', '2-3 yosh', '3-4 yosh', '4-5 yosh', '5-6 yosh'];

  const filteredChildren = children.filter(child => {
    const matchesSearch = child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         child.surname.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === '' || child.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const getTodayAttendance = (childId: string) => {
    return attendance.find(a => a.childId === childId && a.date === selectedDate);
  };

  const markAttendance = async (childId: string, status: 'present' | 'absent' | 'late' | 'sick', time?: string) => {
    const existingAttendance = getTodayAttendance(childId);
    const child = children.find(c => c.id === childId);
    
    if (existingAttendance) {
      // Update existing attendance
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
      // Create new attendance record
      const newAttendance: AttendanceType = {
        id: Date.now().toString(),
        childId,
        date: selectedDate,
        status,
        checkIn: status === 'present' ? (time || format(new Date(), 'HH:mm')) : undefined,
        notes: ''
      };
      saveAttendance([...attendance, newAttendance]);
    }

    // Send Telegram notification for absence
    if (status === 'absent' && child) {
      await TelegramBot.sendAbsenceNotification(
        `${child.name} ${child.surname}`,
        child.parentName,
        format(new Date(selectedDate), 'dd.MM.yyyy')
      );
    }
  };

  const markCheckOut = (childId: string) => {
    const existingAttendance = getTodayAttendance(childId);
    if (existingAttendance && existingAttendance.status === 'present') {
      const updatedAttendance = attendance.map(a =>
        a.id === existingAttendance.id
          ? { ...a, checkOut: format(new Date(), 'HH:mm') }
          : a
      );
      saveAttendance(updatedAttendance);
    }
  };

  const handleSpravka = (child: Child) => {
    setSelectedChild(child);
    setShowSpravkaModal(true);
  };

  const processSpravka = () => {
    if (!selectedChild) return;

    const currentMonth = format(new Date(selectedDate), 'yyyy-MM');
    
    // Find and remove the monthly payment for this child for the current month
    const childPayments = payments.filter(p => 
      p.childId === selectedChild.id && 
      p.month === currentMonth
    );

    if (childPayments.length > 0) {
      // Remove the payment
      const updatedPayments = payments.filter(p => 
        !(p.childId === selectedChild.id && p.month === currentMonth)
      );
      savePayments(updatedPayments);

      // Mark as absent with spravka note
      const existingAttendance = getTodayAttendance(selectedChild.id);
      if (existingAttendance) {
        const updatedAttendance = attendance.map(a =>
          a.id === existingAttendance.id
            ? { ...a, status: 'absent' as const, notes: 'Spravka bilan' }
            : a
        );
        saveAttendance(updatedAttendance);
      } else {
        const newAttendance: AttendanceType = {
          id: Date.now().toString(),
          childId: selectedChild.id,
          date: selectedDate,
          status: 'absent',
          notes: 'Spravka bilan'
        };
        saveAttendance([...attendance, newAttendance]);
      }

      alert(`${selectedChild.name} ${selectedChild.surname} uchun spravka qabul qilindi va oylik to'lov (${childPayments[0]?.amount.toLocaleString()} so'm) olib tashlandi.`);
    } else {
      alert(`${selectedChild.name} ${selectedChild.surname} uchun ${currentMonth} oyida to'lov topilmadi.`);
    }

    setShowSpravkaModal(false);
    setSelectedChild(null);
    loadData(); // Refresh data
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
    total: filteredChildren.length,
    present: filteredChildren.filter(child => getTodayAttendance(child.id)?.status === 'present').length,
    absent: filteredChildren.filter(child => getTodayAttendance(child.id)?.status === 'absent').length,
    late: filteredChildren.filter(child => getTodayAttendance(child.id)?.status === 'late').length,
    notMarked: filteredChildren.filter(child => !getTodayAttendance(child.id)).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Davomat</h1>
          <p className="text-gray-600 mt-1">Bolalar davomati va vaqt belgilash</p>
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
            <Baby className="h-8 w-8 text-blue-600 mr-3" />
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

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Ism yoki familiya bo'yicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Barcha guruhlar</option>
              {groups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bola
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guruh
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
              {filteredChildren.map((child) => {
                const attendanceRecord = getTodayAttendance(child.id);
                return (
                  <tr key={child.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <Baby className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {child.name} {child.surname}
                          </div>
                          <div className="text-sm text-gray-500">{child.age} yosh</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {child.group}
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
                          onClick={() => markAttendance(child.id, 'present')}
                          className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-lg transition-colors text-xs"
                        >
                          Kelgan
                        </button>
                        <button
                          onClick={() => markAttendance(child.id, 'absent')}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors text-xs"
                        >
                          Kelmagan
                        </button>
                        <button
                          onClick={() => markAttendance(child.id, 'late')}
                          className="text-yellow-600 hover:text-yellow-900 bg-yellow-50 hover:bg-yellow-100 px-3 py-1 rounded-lg transition-colors text-xs"
                        >
                          Kech
                        </button>
                        <button
                          onClick={() => handleSpravka(child)}
                          className="text-purple-600 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-lg transition-colors text-xs flex items-center"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Spravka
                        </button>
                        {attendanceRecord?.status === 'present' && !attendanceRecord.checkOut && (
                          <button
                            onClick={() => markCheckOut(child.id)}
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

      {filteredChildren.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Hech qanday bola topilmadi</p>
        </div>
      )}

      {/* Spravka Modal */}
      {showSpravkaModal && selectedChild && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Spravka tasdiqlash</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                <strong>{selectedChild.name} {selectedChild.surname}</strong> uchun spravka qabul qilasizmi?
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Bu amal quyidagilarni amalga oshiradi:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li className="flex items-center">
                  <Minus className="h-4 w-4 text-red-500 mr-2" />
                  Bolani "Kelmagan (Spravka bilan)" deb belgilaydi
                </li>
                <li className="flex items-center">
                  <Minus className="h-4 w-4 text-red-500 mr-2" />
                  {format(new Date(selectedDate), 'yyyy-MM')} oyining to'lovini olib tashlaydi
                </li>
              </ul>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Diqqat:</strong> Bu amal qaytarib bo'lmaydi!
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSpravkaModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={processSpravka}
                className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors"
              >
                Spravka qabul qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;