import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface DashboardProps {
  children: React.ReactNode;
}

const Dashboard = ({ children }: DashboardProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />

        <main className={`flex-1 p-6 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
