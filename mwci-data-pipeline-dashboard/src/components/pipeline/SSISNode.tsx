import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Activity,
  AlertCircle,
  BarChart3,
  Settings,
} from 'lucide-react';
import SSISTransformViewer from './SSISTransformViewer';

interface Transformation {
  type: 'DataConversion' | 'DerivedColumn' | 'Lookup' | 'Aggregate' | 'Sort' | 'Merge' | 'ConditionalSplit';
  name: string;
  inputColumns: string[];
  outputColumns: string[];
  logic: string;
}

interface SSISPackage {
  packageName: string;
  source: string;
  destination: string;
  transformations: Transformation[];
  schedule: string;
  lastRun: Date;
  status: 'Success' | 'Running' | 'Failed';
  duration: string;
  rowsProcessed: number;
}

interface SSISExecution {
  executionId: string;
  packageName: string;
  startTime: Date;
  endTime?: Date;
  status: 'Running' | 'Success' | 'Failed' | 'Stopped';
  rowsRead: number;
  rowsWritten: number;
  rowsError: number;
  currentPhase: string;
  progress: number;
  messages: string[];
}

const SSISNode = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showExecutionDetails, setShowExecutionDetails] = useState(false);

  // SSIS Packages
  const ssisPackages: SSISPackage[] = [
    {
      packageName: 'Material Master ETL',
      source: 'dbo.SAP_Materials',
      destination: 'dbo.DW_Materials',
      schedule: 'Daily at 02:00 AM',
      lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'Success',
      duration: '3m 24s',
      rowsProcessed: 500,
      transformations: [
        {
          type: 'DataConversion',
          name: 'Convert SAP Date Formats',
          inputColumns: ['created_at', 'modified_at'],
          outputColumns: ['created_datetime', 'modified_datetime'],
          logic: 'Convert SAP YYYYMMDD format to SQL Server DATETIME',
        },
        {
          type: 'DerivedColumn',
          name: 'Calculate Reorder Points',
          inputColumns: ['min_stock', 'avg_daily_usage', 'lead_time_days'],
          outputColumns: ['reorder_point'],
          logic: 'reorder_point = min_stock + (avg_daily_usage * lead_time_days)',
        },
        {
          type: 'Lookup',
          name: 'Enrich Material Groups',
          inputColumns: ['matkl'],
          outputColumns: ['material_group_desc'],
          logic: 'Lookup material group descriptions from reference table',
        },
        {
          type: 'ConditionalSplit',
          name: 'Split Active/Obsolete',
          inputColumns: ['material_status'],
          outputColumns: ['active_materials', 'obsolete_materials'],
          logic: 'IF material_status = "Active" THEN active_materials ELSE obsolete_materials',
        },
      ],
    },
    {
      packageName: 'Purchase Order Analysis ETL',
      source: 'dbo.SAP_PurchaseOrders, dbo.SAP_Vendors',
      destination: 'dbo.DW_PurchaseAnalysis',
      schedule: 'Every 6 hours',
      lastRun: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      status: 'Success',
      duration: '5m 12s',
      rowsProcessed: 1200,
      transformations: [
        {
          type: 'Merge',
          name: 'Join PO with Vendors',
          inputColumns: ['ebeln', 'lifnr', 'netwr'],
          outputColumns: ['po_with_vendor_info'],
          logic: 'INNER JOIN dbo.SAP_Vendors ON lifnr = vendor_id',
        },
        {
          type: 'Aggregate',
          name: 'Monthly Spend by Supplier',
          inputColumns: ['vendor_name', 'netwr', 'bedat'],
          outputColumns: ['monthly_spend'],
          logic: 'GROUP BY vendor_name, MONTH(bedat) SUM(netwr)',
        },
        {
          type: 'DerivedColumn',
          name: 'Calculate PO Aging',
          inputColumns: ['bedat', 'current_date'],
          outputColumns: ['po_age_days'],
          logic: 'po_age_days = DATEDIFF(day, bedat, GETDATE())',
        },
        {
          type: 'Sort',
          name: 'Sort by PO Date',
          inputColumns: ['bedat'],
          outputColumns: ['sorted_results'],
          logic: 'ORDER BY bedat DESC',
        },
      ],
    },
    {
      packageName: 'Inventory Movement ETL',
      source: 'dbo.SAP_MaterialMovements, dbo.SAP_Plants',
      destination: 'dbo.DW_InventoryFacts',
      schedule: 'Hourly',
      lastRun: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      status: 'Running',
      duration: '2m 45s (running)',
      rowsProcessed: 6234,
      transformations: [
        {
          type: 'Lookup',
          name: 'Add Plant Descriptions',
          inputColumns: ['werks'],
          outputColumns: ['plant_name', 'plant_location'],
          logic: 'Lookup plant details from dbo.SAP_Plants',
        },
        {
          type: 'Aggregate',
          name: 'Sum Movements by Material',
          inputColumns: ['matnr', 'quantity', 'werks'],
          outputColumns: ['total_movement_qty'],
          logic: 'GROUP BY matnr, werks SUM(quantity)',
        },
        {
          type: 'DerivedColumn',
          name: 'Calculate Stock Velocity',
          inputColumns: ['total_movement_qty', 'current_stock'],
          outputColumns: ['stock_velocity'],
          logic: 'stock_velocity = total_movement_qty / current_stock * 100',
        },
        {
          type: 'DataConversion',
          name: 'Standardize Units',
          inputColumns: ['meins'],
          outputColumns: ['standard_unit'],
          logic: 'Convert all measurement units to base units (KG, L, EA)',
        },
      ],
    },
  ];

  // Current executions
  const currentExecutions: SSISExecution[] = [
    {
      executionId: 'EXEC-2025-11-12-001',
      packageName: 'Inventory Movement ETL',
      startTime: new Date(Date.now() - 10 * 60 * 1000),
      status: 'Running',
      rowsRead: 6234,
      rowsWritten: 5890,
      rowsError: 12,
      currentPhase: 'Calculate Stock Velocity',
      progress: 67,
      messages: [
        'Started execution at 8:35 PM',
        'Source connection established',
        'Reading data from SAP_MaterialMovements',
        'Transformation: Add Plant Descriptions completed (6234 rows)',
        'Transformation: Sum Movements by Material in progress...',
      ],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Running':
        return <Activity className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'Failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'Running':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      case 'Failed':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const getTransformationIcon = (type: string) => {
    switch (type) {
      case 'DataConversion':
        return '🔄';
      case 'DerivedColumn':
        return '🧮';
      case 'Lookup':
        return '🔍';
      case 'Aggregate':
        return '📊';
      case 'Sort':
        return '↕️';
      case 'Merge':
        return '🔀';
      case 'ConditionalSplit':
        return '🔀';
      default:
        return '⚙️';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            SSIS ETL Packages
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            SQL Server Integration Services data transformation pipelines
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExecutionDetails(!showExecutionDetails)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all"
          >
            <BarChart3 className="w-4 h-4" />
            {showExecutionDetails ? 'Hide' : 'Show'} Execution Monitor
          </button>
        </div>
      </div>

      {/* Execution Monitor */}
      <AnimatePresence>
        {showExecutionDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-2 border-purple-200 dark:border-purple-800"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Real-time Execution Monitor
            </h3>

            {currentExecutions.map((execution) => (
              <div key={execution.executionId} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{execution.packageName}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Execution ID: {execution.executionId}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500 animate-pulse" />
                    <span className="font-semibold text-blue-600">{execution.status}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {execution.currentPhase}
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {execution.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full flex items-center justify-end pr-2"
                      initial={{ width: 0 }}
                      animate={{ width: `${execution.progress}%` }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="text-xs text-white font-semibold">{execution.progress}%</span>
                    </motion.div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400">Rows Read</div>
                    <div className="text-xl font-bold text-blue-600">{execution.rowsRead.toLocaleString()}</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400">Rows Written</div>
                    <div className="text-xl font-bold text-green-600">{execution.rowsWritten.toLocaleString()}</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400">Errors</div>
                    <div className="text-xl font-bold text-red-600">{execution.rowsError}</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400">Throughput</div>
                    <div className="text-xl font-bold text-purple-600">
                      {Math.floor(execution.rowsWritten / 10)} rows/s
                    </div>
                  </div>
                </div>

                {/* Messages Log */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Execution Log</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {execution.messages.map((message, idx) => (
                      <div key={idx} className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                        <span className="text-gray-500 dark:text-gray-500">[{idx + 1}]</span> {message}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SSIS Packages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {ssisPackages.map((pkg, index) => (
          <motion.div
            key={pkg.packageName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedPackage(selectedPackage === pkg.packageName ? null : pkg.packageName)}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-xl ${
              selectedPackage === pkg.packageName
                ? 'ring-2 ring-purple-500 shadow-lg'
                : ''
            } ${getStatusColor(pkg.status)}`}
          >
            {/* Package Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <GitBranch className="w-8 h-8 text-purple-600" />
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{pkg.packageName}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{pkg.schedule}</p>
                </div>
              </div>
              {getStatusIcon(pkg.status)}
            </div>

            {/* Source/Destination */}
            <div className="space-y-2 mb-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Source:</span>
                <div className="font-mono text-xs text-gray-900 dark:text-white mt-1 bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  {pkg.source}
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Destination:</span>
                <div className="font-mono text-xs text-gray-900 dark:text-white mt-1 bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  {pkg.destination}
                </div>
              </div>
            </div>

            {/* Transformations Count */}
            <div className="flex items-center justify-between mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Transformations</span>
              <span className="font-bold text-purple-600">{pkg.transformations.length}</span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Last Run</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatTimeAgo(pkg.lastRun)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Duration</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{pkg.duration}</div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-gray-600 dark:text-gray-400">Rows Processed</div>
                <div className="text-lg font-bold text-purple-600">{pkg.rowsProcessed.toLocaleString()}</div>
              </div>
            </div>

            {/* View Details Button */}
            <button className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2">
              <Settings className="w-4 h-4" />
              View Transformation Flow
            </button>
          </motion.div>
        ))}
      </div>

      {/* Transformation Flow Viewer */}
      <AnimatePresence>
        {selectedPackage && (
          <SSISTransformViewer
            package={ssisPackages.find((p) => p.packageName === selectedPackage)!}
            onClose={() => setSelectedPackage(null)}
            getTransformationIcon={getTransformationIcon}
          />
        )}
      </AnimatePresence>

      {/* Summary Stats */}
      <div className="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">SSIS Pipeline Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-purple-600">{ssisPackages.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Packages</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">
              {ssisPackages.filter((p) => p.status === 'Success').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Successful</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">
              {ssisPackages.filter((p) => p.status === 'Running').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Running</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600">
              {ssisPackages.reduce((sum, p) => sum + p.rowsProcessed, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Rows</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSISNode;
