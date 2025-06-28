'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Plus, 
  Clock,
  MapPin,
  Users,
  BookOpen
} from 'lucide-react';

interface ScheduleItem {
  id: string;
  subject: string;
  teacher: string;
  class: string;
  room: string;
  time: string;
  day: string;
  duration: number;
}

export function Schedule() {
  const [selectedClass, setSelectedClass] = useState('9A');
  const [selectedDay, setSelectedDay] = useState('Dushanba');
  
  const [schedule] = useState<ScheduleItem[]>([
    {
      id: '1',
      subject: 'Matematika',
      teacher: 'Nodira Karimova',
      class: '9A',
      room: '201',
      time: '08:00',
      day: 'Dushanba',
      duration: 45
    },
    {
      id: '2',
      subject: 'O\'zbek tili',
      teacher: 'Gulnora Toshmatova',
      class: '9A',
      room: '105',
      time: '08:50',
      day: 'Dushanba',
      duration: 45
    },
    {
      id: '3',
      subject: 'Fizika',
      teacher: 'Aziz Rahmonov',
      class: '9A',
      room: '301',
      time: '09:50',
      day: 'Dushanba',
      duration: 45
    },
    {
      id: '4',
      subject: 'Ingliz tili',
      teacher: 'Malika Yusupova',
      class: '9A',
      room: '102',
      time: '10:40',
      day: 'Dushanba',
      duration: 45
    },
    {
      id: '5',
      subject: 'Tarix',
      teacher: 'Bobur Aliyev',
      class: '9A',
      room: '203',
      time: '11:40',
      day: 'Dushanba',
      duration: 45
    }
  ]);

  const days = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
  const classes = ['8A', '8B', '9A', '9B', '10A', '10B', '11A', '11B'];
  const timeSlots = [
    '08:00 - 08:45',
    '08:50 - 09:35',
    '09:50 - 10:35',
    '10:40 - 11:25',
    '11:40 - 12:25',
    '12:30 - 13:15'
  ];

  const filteredSchedule = schedule.filter(item => 
    item.class === selectedClass && item.day === selectedDay
  );

  const getSubjectColor = (subject: string) => {
    const colors = {
      'Matematika': 'bg-blue-100 text-blue-800',
      'Fizika': 'bg-green-100 text-green-800',
      'Kimyo': 'bg-yellow-100 text-yellow-800',
      'Biologiya': 'bg-purple-100 text-purple-800',
      'O\'zbek tili': 'bg-red-100 text-red-800',
      'Ingliz tili': 'bg-indigo-100 text-indigo-800',
      'Tarix': 'bg-orange-100 text-orange-800',
      'Geografiya': 'bg-teal-100 text-teal-800'
    };
    return colors[subject as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dars jadvali</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Sinflar va o'qituvchilar uchun dars jadvali</p>
        </div>
        <Button className="bg-indigo-500 hover:bg-indigo-600">
          <Plus className="w-4 h-4 mr-2" />
          Yangi dars
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Sinf</label>
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Kun</label>
              <select 
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>{selectedDay} - {selectedClass} sinf</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSchedule.length > 0 ? (
                filteredSchedule.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{item.subject}</h3>
                        <Badge className={getSubjectColor(item.subject)}>
                          {item.subject}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>Xona {item.room}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{item.teacher}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Bu kun uchun darslar mavjud emas</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card>
          <CardHeader>
            <CardTitle>Dars vaqtlari</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {timeSlots.map((slot, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-medium text-sm">{index + 1}</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{slot}</span>
                  </div>
                  <Badge variant="outline">45 daqiqa</Badge>
                </div>
              ))}
              
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Tanaffuslar</h3>
                <div className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>09:35 - 09:50 (15 daqiqa)</p>
                  <p>11:25 - 11:40 (15 daqiqa)</p>
                  <p>12:25 - 12:30 (5 daqiqa)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Haftalik jadval - {selectedClass} sinf</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-3 bg-gray-50 dark:bg-gray-800 text-left font-medium">Vaqt</th>
                  {days.map(day => (
                    <th key={day} className="border p-3 bg-gray-50 dark:bg-gray-800 text-left font-medium">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, index) => (
                  <tr key={index}>
                    <td className="border p-3 font-medium bg-gray-50 dark:bg-gray-800">{slot}</td>
                    {days.map(day => {
                      const lesson = schedule.find(s => 
                        s.class === selectedClass && 
                        s.day === day && 
                        s.time === slot.split(' - ')[0]
                      );
                      return (
                        <td key={day} className="border p-3">
                          {lesson ? (
                            <div className="space-y-1">
                              <div className="font-medium text-sm">{lesson.subject}</div>
                              <div className="text-xs text-gray-500">Xona {lesson.room}</div>
                              <div className="text-xs text-gray-500">{lesson.teacher}</div>
                            </div>
                          ) : (
                            <div className="text-gray-400 text-sm">-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}