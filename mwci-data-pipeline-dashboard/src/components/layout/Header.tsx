import { Menu, Bell, Settings, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md h-16 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              MWCI Data Pipeline
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Real-time Monitoring Dashboard
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600 dark:text-gray-300 hidden md:block">
          <span className="font-semibold">Environment:</span>
          <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md text-xs">
            PRODUCTION
          </span>
        </div>

        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Settings className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">HS</span>
          </div>
          <span className="text-sm font-medium hidden md:block">Hussein Srour</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
