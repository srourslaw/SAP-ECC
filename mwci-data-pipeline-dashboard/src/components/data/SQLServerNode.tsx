import { useState } from 'react';
import {
  Database,
  Table,
  Activity,
  HardDrive,
  Users,
  Clock,
  TrendingUp,
  Search,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import SQLQueryViewer from './SQLQueryViewer';

interface TableSchema {
  tableName: string;
  schema: string;
  rowCount: number;
  sizeMB: number;
  columns: {
    name: string;
    dataType: string;
    nullable: boolean;
    isPrimaryKey: boolean;
    isForeignKey: boolean;
  }[];
  indexes: {
    name: string;
    type: 'Clustered' | 'Non-Clustered';
    columns: string[];
  }[];
}

interface DatabaseMetrics {
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
  avgQueryDuration: number;
  slowestQuery: string;
  totalSize: number;
}

const SQLServerNode = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [showQueryViewer, setShowQueryViewer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Simulated SQL Server tables with schemas
  const tables: TableSchema[] = [
    {
      tableName: 'SAP_Materials',
      schema: 'dbo',
      rowCount: 500,
      sizeMB: 45.2,
      columns: [
        { name: 'matnr', dataType: 'VARCHAR(18)', nullable: false, isPrimaryKey: true, isForeignKey: false },
        { name: 'maktx', dataType: 'VARCHAR(100)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'mtart', dataType: 'VARCHAR(10)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'matkl', dataType: 'VARCHAR(10)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'meins', dataType: 'VARCHAR(3)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'labst', dataType: 'DECIMAL(13,3)', nullable: true, isPrimaryKey: false, isForeignKey: false },
        { name: 'werks', dataType: 'VARCHAR(4)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'price', dataType: 'DECIMAL(15,2)', nullable: true, isPrimaryKey: false, isForeignKey: false },
        { name: 'created_at', dataType: 'DATETIME', nullable: false, isPrimaryKey: false, isForeignKey: false },
      ],
      indexes: [
        { name: 'PK_SAP_Materials', type: 'Clustered', columns: ['matnr'] },
        { name: 'IDX_Materials_Plant', type: 'Non-Clustered', columns: ['werks'] },
        { name: 'IDX_Materials_Type', type: 'Non-Clustered', columns: ['mtart'] },
      ],
    },
    {
      tableName: 'SAP_PurchaseOrders',
      schema: 'dbo',
      rowCount: 1200,
      sizeMB: 78.5,
      columns: [
        { name: 'ebeln', dataType: 'VARCHAR(10)', nullable: false, isPrimaryKey: true, isForeignKey: false },
        { name: 'lifnr', dataType: 'VARCHAR(10)', nullable: false, isPrimaryKey: false, isForeignKey: true },
        { name: 'bedat', dataType: 'DATE', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'netwr', dataType: 'DECIMAL(15,2)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'waers', dataType: 'VARCHAR(5)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'status', dataType: 'VARCHAR(20)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'ekorg', dataType: 'VARCHAR(4)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'created_at', dataType: 'DATETIME', nullable: false, isPrimaryKey: false, isForeignKey: false },
      ],
      indexes: [
        { name: 'PK_SAP_PurchaseOrders', type: 'Clustered', columns: ['ebeln'] },
        { name: 'FK_PO_Vendor', type: 'Non-Clustered', columns: ['lifnr'] },
        { name: 'IDX_PO_Date', type: 'Non-Clustered', columns: ['bedat'] },
        { name: 'IDX_PO_Status', type: 'Non-Clustered', columns: ['status'] },
      ],
    },
    {
      tableName: 'SAP_Vendors',
      schema: 'dbo',
      rowCount: 23,
      sizeMB: 2.1,
      columns: [
        { name: 'lifnr', dataType: 'VARCHAR(10)', nullable: false, isPrimaryKey: true, isForeignKey: false },
        { name: 'name1', dataType: 'VARCHAR(100)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'land1', dataType: 'VARCHAR(3)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'ort01', dataType: 'VARCHAR(50)', nullable: true, isPrimaryKey: false, isForeignKey: false },
        { name: 'zterm', dataType: 'VARCHAR(10)', nullable: true, isPrimaryKey: false, isForeignKey: false },
        { name: 'ktokk', dataType: 'VARCHAR(10)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'created_at', dataType: 'DATETIME', nullable: false, isPrimaryKey: false, isForeignKey: false },
      ],
      indexes: [
        { name: 'PK_SAP_Vendors', type: 'Clustered', columns: ['lifnr'] },
        { name: 'IDX_Vendors_Country', type: 'Non-Clustered', columns: ['land1'] },
      ],
    },
    {
      tableName: 'SAP_Inventory',
      schema: 'dbo',
      rowCount: 850,
      sizeMB: 32.4,
      columns: [
        { name: 'id', dataType: 'INT', nullable: false, isPrimaryKey: true, isForeignKey: false },
        { name: 'matnr', dataType: 'VARCHAR(18)', nullable: false, isPrimaryKey: false, isForeignKey: true },
        { name: 'werks', dataType: 'VARCHAR(4)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'lgort', dataType: 'VARCHAR(4)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'labst', dataType: 'DECIMAL(13,3)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'meins', dataType: 'VARCHAR(3)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'last_updated', dataType: 'DATETIME', nullable: false, isPrimaryKey: false, isForeignKey: false },
      ],
      indexes: [
        { name: 'PK_SAP_Inventory', type: 'Clustered', columns: ['id'] },
        { name: 'FK_Inventory_Material', type: 'Non-Clustered', columns: ['matnr'] },
        { name: 'IDX_Inventory_Plant', type: 'Non-Clustered', columns: ['werks'] },
      ],
    },
    {
      tableName: 'SAP_Transactions',
      schema: 'dbo',
      rowCount: 15234,
      sizeMB: 234.7,
      columns: [
        { name: 'transaction_id', dataType: 'BIGINT', nullable: false, isPrimaryKey: true, isForeignKey: false },
        { name: 'mblnr', dataType: 'VARCHAR(10)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'matnr', dataType: 'VARCHAR(18)', nullable: false, isPrimaryKey: false, isForeignKey: true },
        { name: 'bwart', dataType: 'VARCHAR(3)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'menge', dataType: 'DECIMAL(13,3)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'werks', dataType: 'VARCHAR(4)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'budat', dataType: 'DATE', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'created_at', dataType: 'DATETIME', nullable: false, isPrimaryKey: false, isForeignKey: false },
      ],
      indexes: [
        { name: 'PK_SAP_Transactions', type: 'Clustered', columns: ['transaction_id'] },
        { name: 'FK_Trans_Material', type: 'Non-Clustered', columns: ['matnr'] },
        { name: 'IDX_Trans_Date', type: 'Non-Clustered', columns: ['budat'] },
      ],
    },
    {
      tableName: 'SAP_MaterialMovements',
      schema: 'dbo',
      rowCount: 8945,
      sizeMB: 156.8,
      columns: [
        { name: 'movement_id', dataType: 'BIGINT', nullable: false, isPrimaryKey: true, isForeignKey: false },
        { name: 'matnr', dataType: 'VARCHAR(18)', nullable: false, isPrimaryKey: false, isForeignKey: true },
        { name: 'werks', dataType: 'VARCHAR(4)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'movement_type', dataType: 'VARCHAR(3)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'quantity', dataType: 'DECIMAL(13,3)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'movement_date', dataType: 'DATE', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'created_at', dataType: 'DATETIME', nullable: false, isPrimaryKey: false, isForeignKey: false },
      ],
      indexes: [
        { name: 'PK_SAP_MaterialMovements', type: 'Clustered', columns: ['movement_id'] },
        { name: 'FK_Movement_Material', type: 'Non-Clustered', columns: ['matnr'] },
        { name: 'IDX_Movement_Date', type: 'Non-Clustered', columns: ['movement_date'] },
      ],
    },
    {
      tableName: 'SAP_Invoices',
      schema: 'dbo',
      rowCount: 987,
      sizeMB: 42.3,
      columns: [
        { name: 'belnr', dataType: 'VARCHAR(10)', nullable: false, isPrimaryKey: true, isForeignKey: false },
        { name: 'lifnr', dataType: 'VARCHAR(10)', nullable: false, isPrimaryKey: false, isForeignKey: true },
        { name: 'bldat', dataType: 'DATE', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'wrbtr', dataType: 'DECIMAL(15,2)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'waers', dataType: 'VARCHAR(5)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'payment_status', dataType: 'VARCHAR(20)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'created_at', dataType: 'DATETIME', nullable: false, isPrimaryKey: false, isForeignKey: false },
      ],
      indexes: [
        { name: 'PK_SAP_Invoices', type: 'Clustered', columns: ['belnr'] },
        { name: 'FK_Invoice_Vendor', type: 'Non-Clustered', columns: ['lifnr'] },
        { name: 'IDX_Invoice_Date', type: 'Non-Clustered', columns: ['bldat'] },
      ],
    },
    {
      tableName: 'SAP_Plants',
      schema: 'dbo',
      rowCount: 4,
      sizeMB: 0.5,
      columns: [
        { name: 'werks', dataType: 'VARCHAR(4)', nullable: false, isPrimaryKey: true, isForeignKey: false },
        { name: 'name1', dataType: 'VARCHAR(100)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'city', dataType: 'VARCHAR(50)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'country', dataType: 'VARCHAR(3)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'active', dataType: 'BIT', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'created_at', dataType: 'DATETIME', nullable: false, isPrimaryKey: false, isForeignKey: false },
      ],
      indexes: [
        { name: 'PK_SAP_Plants', type: 'Clustered', columns: ['werks'] },
      ],
    },
  ];

  // Database metrics
  const metrics: DatabaseMetrics = {
    cpuUsage: 35,
    memoryUsage: 62,
    activeConnections: 14,
    avgQueryDuration: 245,
    slowestQuery: 'SELECT * FROM SAP_Transactions WHERE...',
    totalSize: 592.5,
  };

  const filteredTables = tables.filter((table) =>
    table.tableName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRows = tables.reduce((sum, table) => sum + table.rowCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            SQL Server Database Viewer
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Replicated SAP ECC data with query capabilities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Connected</span>
          </div>
          <button
            onClick={() => setShowQueryViewer(!showQueryViewer)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
          >
            <Database className="w-4 h-4" />
            {showQueryViewer ? 'Hide Query Editor' : 'Open Query Editor'}
          </button>
        </div>
      </div>

      {/* Database Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="card bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              LIVE
            </span>
          </div>
          <div className="text-sm text-blue-800 dark:text-blue-300">CPU Usage</div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{metrics.cpuUsage}%</div>
        </div>

        <div className="card bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-2">
            <HardDrive className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
              MEMORY
            </span>
          </div>
          <div className="text-sm text-purple-800 dark:text-purple-300">Memory</div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{metrics.memoryUsage}%</div>
        </div>

        <div className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-green-600" />
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
              ACTIVE
            </span>
          </div>
          <div className="text-sm text-green-800 dark:text-green-300">Connections</div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">{metrics.activeConnections}</div>
        </div>

        <div className="card bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
              AVG
            </span>
          </div>
          <div className="text-sm text-orange-800 dark:text-orange-300">Query Time</div>
          <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{metrics.avgQueryDuration}ms</div>
        </div>

        <div className="card bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center justify-between mb-2">
            <Table className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
              TOTAL
            </span>
          </div>
          <div className="text-sm text-indigo-800 dark:text-indigo-300">Tables</div>
          <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{tables.length}</div>
        </div>

        <div className="card bg-pink-50 dark:bg-pink-900/20 border-2 border-pink-200 dark:border-pink-800">
          <div className="flex items-center justify-between mb-2">
            <HardDrive className="w-5 h-5 text-pink-600" />
            <span className="text-xs font-semibold text-pink-600 bg-pink-100 px-2 py-1 rounded-full">
              SIZE
            </span>
          </div>
          <div className="text-sm text-pink-800 dark:text-pink-300">Database</div>
          <div className="text-2xl font-bold text-pink-900 dark:text-pink-100">{metrics.totalSize} MB</div>
        </div>
      </div>

      {/* SQL Query Viewer */}
      {showQueryViewer && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <SQLQueryViewer tables={tables} />
        </motion.div>
      )}

      {/* Table List with Search */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Database Tables</h3>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tables..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTables.map((table, index) => (
            <motion.div
              key={table.tableName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedTable(selectedTable === table.tableName ? null : table.tableName)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                selectedTable === table.tableName
                  ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/30 dark:border-blue-500'
                  : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <Table className={`w-6 h-6 ${selectedTable === table.tableName ? 'text-blue-600' : 'text-gray-600'}`} />
                <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                  {table.schema}
                </span>
              </div>

              <h4 className="font-bold text-gray-900 dark:text-white mb-2">{table.tableName}</h4>

              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Rows:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {table.rowCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{table.sizeMB} MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Columns:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{table.columns.length}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Table Schema Details */}
      {selectedTable && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          {(() => {
            const table = tables.find((t) => t.tableName === selectedTable)!;
            return (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {table.schema}.{table.tableName} - Schema
                  </h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg font-medium transition-all">
                    <Download className="w-4 h-4" />
                    Export Schema
                  </button>
                </div>

                {/* Columns */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Columns</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Column Name
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Data Type
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Nullable
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Keys
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {table.columns.map((column, idx) => (
                          <tr key={idx} className="border-t border-gray-200 dark:border-gray-700">
                            <td className="px-4 py-3 font-mono text-sm text-gray-900 dark:text-white">
                              {column.name}
                            </td>
                            <td className="px-4 py-3 font-mono text-sm text-blue-600 dark:text-blue-400">
                              {column.dataType}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                              {column.nullable ? 'YES' : 'NO'}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {column.isPrimaryKey && (
                                <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold mr-1">
                                  PK
                                </span>
                              )}
                              {column.isForeignKey && (
                                <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold">
                                  FK
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Indexes */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Indexes</h4>
                  <div className="space-y-3">
                    {table.indexes.map((index, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono font-bold text-gray-900 dark:text-white">{index.name}</span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              index.type === 'Clustered'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {index.type}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Columns: <span className="font-mono">{index.columns.join(', ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
        </motion.div>
      )}

      {/* Quick Stats */}
      <div className="card bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Database Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">{totalRows.toLocaleString()}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Rows</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">{tables.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Tables</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">{metrics.totalSize} MB</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Size</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600">{metrics.avgQueryDuration}ms</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Avg Query Time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SQLServerNode;
