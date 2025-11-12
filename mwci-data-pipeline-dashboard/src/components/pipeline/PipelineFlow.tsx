import { Database, ArrowRight, GitBranch, Box, FileSpreadsheet, Activity } from 'lucide-react';

const PipelineFlow = () => {
  const nodes = [
    { id: 'sap', label: 'SAP ECC', icon: Database, color: 'bg-blue-500', metric: '2.3M records' },
    { id: 'replication', label: 'Replication', icon: Activity, color: 'bg-green-500', metric: '3.2s lag' },
    { id: 'sql', label: 'SQL Server', icon: Database, color: 'bg-purple-500', metric: '2.3M records' },
    { id: 'ssis', label: 'SSIS', icon: GitBranch, color: 'bg-orange-500', metric: '3/12 running' },
    { id: 'ssas', label: 'SSAS', icon: Box, color: 'bg-pink-500', metric: '2.4 GB' },
    { id: 'excel', label: 'Excel', icon: FileSpreadsheet, color: 'bg-green-600', metric: '47 users' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Data Pipeline Overview
      </h2>

      <div className="flex items-center justify-between flex-wrap gap-4">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <div key={node.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`${node.color} w-24 h-24 rounded-xl flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform cursor-pointer`}
                >
                  <Icon className="w-10 h-10" />
                </div>
                <div className="mt-3 text-center">
                  <p className="font-semibold text-gray-900 dark:text-white">{node.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{node.metric}</p>
                </div>
                <div className="mt-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Healthy
                </div>
              </div>

              {index < nodes.length - 1 && (
                <div className="mx-4 text-gray-400">
                  <ArrowRight className="w-8 h-8" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-900">
              RPO Status
            </span>
            <span className="text-xs text-green-700">Within target</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-green-900">15 min</div>
          <div className="mt-1 text-xs text-green-600">Target: 15 minutes</div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              RTO Capability
            </span>
            <span className="text-xs text-blue-700">Ready</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-900">2.5 hrs</div>
          <div className="mt-1 text-xs text-blue-600">Target: 4 hours</div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-purple-900">
              System Health
            </span>
            <span className="text-xs text-purple-700">Excellent</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-purple-900">96%</div>
          <div className="mt-1 text-xs text-purple-600">All systems operational</div>
        </div>
      </div>
    </div>
  );
};

export default PipelineFlow;
