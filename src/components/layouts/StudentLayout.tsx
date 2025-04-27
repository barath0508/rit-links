import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  User, Home, Bell, BookOpen, FolderPlus, Settings, 
  LogOut, ChevronRight, ChevronLeft, Menu, Library, Bot
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ChatbotButton from '../ui/ChatbotButton';

interface StudentLayoutProps {
  children: React.ReactNode;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout, userProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const navItems = [
    { path: '/student/profile', label: 'Profile', icon: <User size={20} /> },
    { path: '/student/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/student/notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { path: '/student/knowledge-base', label: 'My Knowledge Base', icon: <BookOpen size={20} /> },
    { path: '/student/projects', label: 'My Projects', icon: <FolderPlus size={20} /> },
    { path: '/student/skills', label: 'Add Skills and Project', icon: <FolderPlus size={20} /> },
    { path: '/student/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`bg-yellow-400 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } fixed h-full overflow-y-auto shadow-md z-10`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-yellow-500">
          <div className="flex items-center">
            <Library className="h-8 w-8 text-gray-800" />
            {sidebarOpen && (
              <div className="ml-2">
                <h1 className="text-lg font-bold">
                  RIT Links <span className="text-blue-600">In</span>
                </h1>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-full hover:bg-yellow-500 focus:outline-none"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        
        <nav className="mt-5 px-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${
                location.pathname === item.path ? 'active' : ''
              } ${!sidebarOpen ? 'justify-center' : ''} mb-2`}
            >
              {item.icon}
              {sidebarOpen && <span className="ml-4">{item.label}</span>}
            </Link>
          ))}
          
          <button
            onClick={handleLogout}
            className={`sidebar-link text-red-600 hover:bg-red-100 hover:text-red-800 ${
              !sidebarOpen ? 'justify-center' : ''
            } mt-4`}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-4">Logout</span>}
          </button>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-20'
      }`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <button 
              className="md:hidden mr-4 p-2 rounded-md hover:bg-gray-100"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">RIT Links In</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <ChatbotButton />
            <div className="relative">
              <img
                src={userProfile?.photoURL || `https://ui-avatars.com/api/?name=${userProfile?.name || 'User'}&background=random`}
                alt="Profile"
                className="h-10 w-10 rounded-full cursor-pointer"
              />
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="overflow-auto h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;