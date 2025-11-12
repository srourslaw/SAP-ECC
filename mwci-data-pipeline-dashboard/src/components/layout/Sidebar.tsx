import { useState } from 'react';
import {
  LayoutDashboard,
  Workflow,
  Activity,
  Database,
  FileSpreadsheet,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'pipeline', label: 'Pipeline', icon: Workflow },
    { id: 'monitor', label: 'Monitor', icon: Activity },
    { id: 'data', label: 'Data', icon: Database },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
  ];

  if (!isOpen) return null;

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 shadow-lg z-40 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-8 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
          System Health
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Overall Score</span>
            <span className="font-bold text-success">96%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-success h-2 rounded-full" style={{ width: '96%' }}></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
