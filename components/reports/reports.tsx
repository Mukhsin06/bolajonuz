'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar,
  BarChart3,
  Users,
  Award,
  TrendingUp,
  Filter
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  type: 'academic' | 'attendance' | 'financial' | 'general';
  period: string;
  createdDate: string;
  status: 'ready' | 'generating' | 'scheduled';
  size: string;
}

export function Reports() {
  const [selectedType, setSelectedType] = useState('all');
  const [reports] = useState<Report[]>([
    {
      id: '1',
      title: 'Oylik akademik hisobot',
      type: 'academic',
      period: 'Yanvar 2024',
      createdDate: '2024-01-31',
      status: 'ready',
      size: '2.4 MB'
    },
    {
      id: '2',
      title: 'O\'quvchilar davomat hisoboti',
      type: 'attendance',
      period: 'Yanvar 2024',
      createdDate: '2024-01-30',
      status: 'ready',
      size: '1.8 MB'
    },
    {
      id: '3',
      title: 'Moliyaviy hisobot',
      type: 'financial',
      period: 'Q4 2023',
      createdDate: '2024-01-15',
      status: 'ready',
      size: '3.2 MB'
    },
    {
      id: '4',
      title: 'Yillik umumiy hisobot',
      type: 'general',
      period: '2023 yil',
      createdDate: '2024-01-10',
      status: 'generating',
      size: '-'
    }
  ]);

  const reportTypes = [
    { value: 'all', label: 'Barcha hisobotlar' },
    { value: 'academic', label: 'Akademik' },
    { value: 'attendance', label: 'Davomat' },
    { value: 'financial', label: 'Moliyaviy' },
    { value: 'general', label: 'Umumiy' }
  ];

  const filteredReports = reports.filter(report => 
    selectedType === 'all' || report.type === selectedType
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'academic': return <Award className="w-4 h-4" />;
      case 'attendance': return <Users className="w-4 h-4" />;
      case 'financial': return <TrendingUp className="w-4 h-4" />;
      case 'general': return <BarChart3 className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      academic: 'bg-blue-100 text-blue-800',
      attendance: 'bg-green-100 text-green-800',
      financial: 'bg-yellow-100 text-yellow-800',
      general: 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-800">Tayyor</Badge>;
      case 'generating':
        return <Badge className="bg-yellow-100 text-yellow-800">Yaratilmoqda</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Rejalashtirilgan</Badge>;
      default:
        return <Badge variant="secondary">Noma'lum</Badge>;
    }
  };

  const quickReports = [
    {
      title: 'Bugungi davomat',
      description: 'Bugungi kun uchun davomat hisoboti',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Haftalik baholar',
      description: 'Oxirgi hafta qo\'yilgan baholar',
      icon: Award,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Oylik statistika',
      description: 'Joriy oy bo\'yicha to\'liq statistika',
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'O\'qituvchilar hisoboti',
      description: 'O\'qituvchilar faoliyati hisoboti',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hisobotlar</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Maktab faoliyati bo'yicha hisobotlar</p>
        </div>
        <Button className="bg-indigo-500 hover:bg-indigo-600">
          <FileText className="w-4 h-4 mr-2" />
          Yangi hisobot
        </Button>
      </div>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickReports.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.title} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${report.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{report.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{report.description}</p>
                    <Button size="sm" className="mt-3" variant="outline">
                      <Download className="w-3 h-3 mr-1" />
                      Yuklab olish
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Hisobotlar ro'yxati</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    {getTypeIcon(report.type)}
                    <span className="text-white">
                      {getTypeIcon(report.type)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">{report.title}</h3>
                      <Badge className={getTypeBadge(report.type)}>
                        {reportTypes.find(t => t.value === report.type)?.label}
                      </Badge>
                      {getStatusBadge(report.status)}
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{report.period}</span>
                      </div>
                      <span>Yaratilgan: {report.createdDate}</span>
                      {report.size !== '-' && <span>Hajmi: {report.size}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {report.status === 'ready' && (
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Yuklab olish
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Hisobot shablonlari</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Oylik akademik hisobot', description: 'O\'quvchilar baholar va natijalar' },
              { name: 'Davomat hisoboti', description: 'O\'quvchilar davomat statistikasi' },
              { name: 'O\'qituvchilar hisoboti', description: 'O\'qituvchilar faoliyati va yuklami' },
              { name: 'Moliyaviy hisobot', description: 'Maktab moliyaviy holati' },
              { name: 'Sinf hisoboti', description: 'Sinf bo\'yicha batafsil ma\'lumot' },
              { name: 'Fan hisoboti', description: 'Fan bo\'yicha natijalar tahlili' }
            ].map((template) => (
              <div key={template.name} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <h3 className="font-medium text-gray-900 dark:text-white">{template.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{template.description}</p>
                <Button size="sm" className="mt-3" variant="outline">
                  Yaratish
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}