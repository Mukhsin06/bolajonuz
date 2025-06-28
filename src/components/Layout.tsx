import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  CreditCard, 
  Settings, 
  LogOut,
  Baby,
  Menu,
  X,
  GraduationCap,
  Moon,
  Sun
} from 'lucide-react';
import { AuthManager } from '../utils/auth';
import { StorageManager } from '../utils/storage';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(
    StorageManager.load('darkMode', false)
  );
  const currentUser = AuthManager.getCurrentUser();

  const handleLogout = () => {
    AuthManager.logout();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    StorageManager.save('darkMode', newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const navigation = [
    { name: 'Bosh sahifa', href: '/', icon: Home },
    { name: 'Bolalar', href: '/children', icon: Users },
    { name: 'Davomat', href: '/attendance', icon: Calendar },
    { name: 'O\'qituvchilar', href: '/teachers', icon: GraduationCap },
    { name: 'To\'lovlar', href: '/payments', icon: CreditCard },
    { name: 'Sozlamalar', href: '/settings', icon: Settings },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`p-2 rounded-md shadow-md transition-colors ${
            darkMode 
              ? 'bg-gray-800 text-gray-300 hover:text-white' 
              : 'bg-white text-gray-600 hover:text-gray-900'
          }`}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 shadow-lg transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <Baby className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Bog'cha SRM
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Boshqaruv tizimi
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? darkMode
                        ? 'bg-blue-900 text-blue-100 border-r-2 border-blue-400'
                        : 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Dark mode toggle */}
          <div className={`px-4 py-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={toggleDarkMode}
              className={`flex items-center w-full px-4 py-2 text-sm rounded-lg transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {darkMode ? <Sun className="mr-3 h-4 w-4" /> : <Moon className="mr-3 h-4 w-4" />}
              {darkMode ? 'Yorug\' rejim' : 'Qorong\'u rejim'}
            </button>
          </div>

          {/* User info and logout */}
          <div className={`border-t p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {currentUser?.name.charAt(0)}
                </span>
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {currentUser?.name}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {currentUser?.role === 'admin' ? 'Administrator' : 'O\'qituvchi'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-4 py-2 text-sm rounded-lg transition-colors ${
                darkMode 
                  ? 'text-red-400 hover:bg-red-900/20' 
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Chiqish
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        <main className={`p-4 lg:p-8 ${darkMode ? 'text-white' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;