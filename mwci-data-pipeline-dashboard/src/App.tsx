import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import PipelineFlow from './components/pipeline/PipelineFlow';
import SAPDataViewer from './components/data/SAPDataViewer';
import { useState } from 'react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewContent />;
      case 'data':
        return <SAPDataViewer />;
      case 'pipeline':
      case 'monitor':
      case 'reports':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} View
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              This view will be available in upcoming prompts (3-10)
            </p>
          </div>
        );
      default:
        return <OverviewContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} activeTab={activeTab} onTabChange={setActiveTab} />

        <main className={`flex-1 p-6 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// Overview Content Component
function OverviewContent() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to MWCI Data Pipeline Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor your SAP ECC to Excel reporting pipeline in real-time
          </p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      <PipelineFlow />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            Daily Transactions
          </h3>
          <p className="text-3xl font-bold text-primary">15,234</p>
          <p className="text-sm text-success mt-1">+12% from yesterday</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            Purchase Orders
          </h3>
          <p className="text-3xl font-bold text-secondary">234</p>
          <p className="text-sm text-success mt-1">+8% this month</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            Active Suppliers
          </h3>
          <p className="text-3xl font-bold text-purple-600">87</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">-2 from last month</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            System Uptime
          </h3>
          <p className="text-3xl font-bold text-success">99.8%</p>
          <p className="text-sm text-success mt-1">30 days average</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Recent Activity
        </h2>
        <div className="space-y-3">
          {[
            { time: '2 min ago', event: 'SSIS Package "Purchase Order Analysis" completed successfully', type: 'success' },
            { time: '5 min ago', event: 'SSAS Cube processed: 1,234 new records added', type: 'info' },
            { time: '12 min ago', event: 'Backup completed: Transaction Log (2.3 GB)', type: 'success' },
            { time: '18 min ago', event: 'Excel report refreshed by 12 users', type: 'info' },
          ].map((activity, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0 gap-2">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  activity.type === 'success' ? 'bg-success' : 'bg-blue-500'
                }`}></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{activity.event}</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 sm:ml-4">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
