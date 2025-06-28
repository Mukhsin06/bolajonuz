'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DataStorage, STORAGE_KEYS } from '@/lib/storage';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff,
  GraduationCap,
  Shield
} from 'lucide-react';

interface LoginProps {
  onLogin: (user: any) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Demo foydalanuvchilar
  const demoUsers = [
    {
      id: 'admin1',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      name: 'Administrator',
      email: 'admin@school.uz'
    },
    {
      id: 'teacher1',
      username: 'teacher',
      password: 'teacher123',
      role: 'teacher',
      name: 'Nodira Karimova',
      email: 'nodira@school.uz'
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      // Avval demo foydalanuvchilarni tekshirish
      let user = demoUsers.find(
        u => u.username === loginData.username && u.password === loginData.password
      );

      // Agar demo foydalanuvchi topilmasa, o'quvchilar ro'yxatidan qidirish
      if (!user) {
        const storage = DataStorage.getInstance();
        const students = storage.load(STORAGE_KEYS.STUDENTS, []);
        const student = students.find((s: any) => 
          s.username === loginData.username && s.password === loginData.password
        );
        
        if (student) {
          user = {
            id: student.id,
            username: student.username,
            password: student.password,
            role: 'student',
            name: `${student.firstName} ${student.lastName}`,
            email: student.email
          };
        }
      }

      if (user) {
        onLogin(user);
      } else {
        setError('Noto\'g\'ri foydalanuvchi nomi yoki parol');
      }
      setLoading(false);
    }, 1000);
  };

  const handleDemoLogin = (user: any) => {
    setLoginData({ username: user.username, password: user.password });
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ta'lim Tizimi</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Maktab boshqaruv tizimiga kirish</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">Tizimga kirish</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Foydalanuvchi nomi
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                    placeholder="Foydalanuvchi nomini kiriting"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Parol
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    placeholder="Parolni kiriting"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Kirish...' : 'Tizimga kirish'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-lg">Demo hisoblar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    user.role === 'admin' ? 'bg-red-100 text-red-600' :
                    user.role === 'teacher' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {user.role === 'admin' ? <Shield className="w-4 h-4" /> :
                     user.role === 'teacher' ? <GraduationCap className="w-4 h-4" /> :
                     <User className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.username}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    user.role === 'admin' ? 'destructive' :
                    user.role === 'teacher' ? 'default' : 'secondary'
                  }>
                    {user.role === 'admin' ? 'Admin' :
                     user.role === 'teacher' ? 'O\'qituvchi' : 'O\'quvchi'}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDemoLogin(user)}
                  >
                    Kirish
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2024 Ta'lim Tizimi. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </div>
  );
}