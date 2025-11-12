import { useState } from 'react';
import { Play, Copy, Download, Clock, CheckCircle, AlertCircle, Database } from 'lucide-react';
import { motion } from 'framer-motion';

interface TableSchema {
  tableName: string;
  schema: string;
  rowCount: number;
  sizeMB: number;
}

interface SQLQueryViewerProps {
  tables: TableSchema[];
}

interface QueryResult {
  columns: string[];
  rows: any[][];
  executionTime: number;
  rowCount: number;
}

const SQLQueryViewer = ({ tables }: SQLQueryViewerProps) => {
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-built query templates
  const queryTemplates = [
    {
      name: 'Top 10 Suppliers by Spend',
      description: 'List suppliers with highest purchase volume',
      query: `SELECT
  v.name1 AS Supplier,
  v.land1 AS Country,
  COUNT(po.ebeln) AS OrderCount,
  SUM(po.netwr) AS TotalSpend,
  v.zterm AS PaymentTerms
FROM dbo.SAP_PurchaseOrders po
JOIN dbo.SAP_Vendors v ON po.lifnr = v.lifnr
GROUP BY v.name1, v.land1, v.zterm
ORDER BY TotalSpend DESC
LIMIT 10;`,
    },
    {
      name: 'Low Stock Alert',
      description: 'Materials below minimum stock level',
      query: `SELECT
  m.matnr AS MaterialNumber,
  m.maktx AS MaterialDescription,
  m.labst AS CurrentStock,
  m.werks AS Plant,
  m.meins AS Unit
FROM dbo.SAP_Materials m
WHERE m.labst < 100
ORDER BY m.labst ASC;`,
    },
    {
      name: 'Monthly Purchase Trend',
      description: 'Purchase order volume and value by month',
      query: `SELECT
  YEAR(po.bedat) AS Year,
  MONTH(po.bedat) AS Month,
  COUNT(*) AS OrderCount,
  SUM(po.netwr) AS TotalValue,
  AVG(po.netwr) AS AvgOrderValue
FROM dbo.SAP_PurchaseOrders po
WHERE po.bedat >= '2024-01-01'
GROUP BY YEAR(po.bedat), MONTH(po.bedat)
ORDER BY Year DESC, Month DESC;`,
    },
    {
      name: 'Pending Invoices',
      description: 'Invoices awaiting payment',
      query: `SELECT
  i.belnr AS InvoiceNumber,
  v.name1 AS Vendor,
  i.bldat AS InvoiceDate,
  i.wrbtr AS Amount,
  i.waers AS Currency,
  i.payment_status AS Status
FROM dbo.SAP_Invoices i
JOIN dbo.SAP_Vendors v ON i.lifnr = v.lifnr
WHERE i.payment_status = 'Pending'
ORDER BY i.bldat DESC;`,
    },
    {
      name: 'Material Consumption Analysis',
      description: 'Most consumed materials this month',
      query: `SELECT
  m.matnr AS MaterialNumber,
  m.maktx AS MaterialDescription,
  COUNT(t.transaction_id) AS TransactionCount,
  SUM(t.menge) AS TotalQuantity,
  m.meins AS Unit
FROM dbo.SAP_Transactions t
JOIN dbo.SAP_Materials m ON t.matnr = m.matnr
WHERE t.budat >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY m.matnr, m.maktx, m.meins
ORDER BY TotalQuantity DESC
LIMIT 20;`,
    },
    {
      name: 'Plant Inventory Summary',
      description: 'Stock levels across all plants',
      query: `SELECT
  p.werks AS Plant,
  p.name1 AS PlantName,
  COUNT(DISTINCT i.matnr) AS UniqueM aterials,
  SUM(i.labst) AS TotalStock
FROM dbo.SAP_Inventory i
JOIN dbo.SAP_Plants p ON i.werks = p.werks
GROUP BY p.werks, p.name1
ORDER BY TotalStock DESC;`,
    },
  ];

  // Simulate query execution
  const executeQuery = () => {
    if (!query.trim()) {
      setError('Please enter a SQL query');
      return;
    }

    setIsExecuting(true);
    setError(null);
    setQueryResult(null);

    // Simulate query execution delay
    setTimeout(() => {
      try {
        // Generate mock results based on query
        const result = generateMockResult(query);
        setQueryResult(result);
        setIsExecuting(false);
      } catch (err) {
        setError('Query execution failed: ' + (err as Error).message);
        setIsExecuting(false);
      }
    }, 1000 + Math.random() * 1000);
  };

  const generateMockResult = (queryStr: string): QueryResult => {
    // Simple mock result generation
    const lowerQuery = queryStr.toLowerCase();

    if (lowerQuery.includes('sap_vendors') || lowerQuery.includes('supplier')) {
      return {
        columns: ['Supplier', 'Country', 'OrderCount', 'TotalSpend', 'PaymentTerms'],
        rows: [
          ['Manila Pipe Corporation', 'PH', 145, 12458900, 'Net 30'],
          ['PH Water Solutions Inc', 'PH', 132, 9834500, 'Net 45'],
          ['Singapore Water Tech Pte Ltd', 'SG', 98, 8765400, '2% 10 Net 30'],
          ['Shanghai Pipe Industries Co Ltd', 'CN', 87, 7234100, 'Net 60'],
          ['Tokyo Precision Engineering', 'JP', 76, 6543200, 'Net 30'],
          ['Asian Valve Supplies', 'SG', 65, 5432100, 'Net 45'],
          ['German Precision Pumps GmbH', 'DE', 54, 4567800, 'Net 30'],
          ['Metro Manila Supply Corp', 'PH', 48, 3987600, 'Net 30'],
          ['Beijing Waterworks Ltd', 'CN', 43, 3456700, 'Net 60'],
          ['American Water Systems Inc', 'US', 39, 2987500, 'Net 30'],
        ],
        executionTime: Math.floor(Math.random() * 500 + 100),
        rowCount: 10,
      };
    } else if (lowerQuery.includes('low stock') || lowerQuery.includes('labst < ')) {
      return {
        columns: ['MaterialNumber', 'MaterialDescription', 'CurrentStock', 'Plant', 'Unit'],
        rows: [
          ['MAT-CHM-001', 'Chlorine Gas 50kg Cylinder', 12, 'P001', 'EA'],
          ['MAT-SAF-004', 'Safety Helmet Type A', 23, 'P002', 'EA'],
          ['MAT-VAL-012', 'Gate Valve 100mm', 34, 'P001', 'EA'],
          ['MAT-PMP-003', 'Submersible Pump 5HP', 45, 'P003', 'EA'],
          ['MAT-MTR-008', 'Smart Water Meter 20mm', 56, 'P002', 'EA'],
          ['MAT-PIP-015', 'HDPE Pipe 250mm', 67, 'P004', 'MTR'],
          ['MAT-CHM-007', 'Caustic Soda 25kg', 78, 'P001', 'EA'],
          ['MAT-EQP-010', 'Pressure Gauge 0-10 bar', 89, 'P002', 'EA'],
        ],
        executionTime: Math.floor(Math.random() * 300 + 80),
        rowCount: 8,
      };
    } else if (lowerQuery.includes('monthly') || lowerQuery.includes('month')) {
      return {
        columns: ['Year', 'Month', 'OrderCount', 'TotalValue', 'AvgOrderValue'],
        rows: [
          [2025, 11, 87, 8765432, 100751],
          [2025, 10, 92, 9234567, 100376],
          [2025, 9, 85, 8456789, 99491],
          [2025, 8, 78, 7654321, 98132],
          [2025, 7, 95, 9876543, 103963],
          [2025, 6, 88, 8543210, 97082],
          [2025, 5, 91, 9123456, 100258],
          [2025, 4, 82, 7987654, 97411],
          [2025, 3, 86, 8321098, 96757],
          [2025, 2, 79, 7654320, 96889],
          [2025, 1, 93, 9234560, 99285],
          [2024, 12, 105, 10345678, 98530],
        ],
        executionTime: Math.floor(Math.random() * 400 + 120),
        rowCount: 12,
      };
    } else if (lowerQuery.includes('invoice') || lowerQuery.includes('pending')) {
      return {
        columns: ['InvoiceNumber', 'Vendor', 'InvoiceDate', 'Amount', 'Currency', 'Status'],
        rows: [
          ['INV-2025-001', 'Manila Pipe Corporation', '2025-11-10', 456789, 'PHP', 'Pending'],
          ['INV-2025-002', 'Singapore Water Tech', '2025-11-09', 345678, 'PHP', 'Pending'],
          ['INV-2025-003', 'Tokyo Precision Engineering', '2025-11-08', 678901, 'PHP', 'Pending'],
          ['INV-2025-004', 'PH Water Solutions', '2025-11-07', 234567, 'PHP', 'Pending'],
          ['INV-2025-005', 'Asian Valve Supplies', '2025-11-06', 456123, 'PHP', 'Pending'],
        ],
        executionTime: Math.floor(Math.random() * 250 + 90),
        rowCount: 5,
      };
    } else if (lowerQuery.includes('plant') || lowerQuery.includes('inventory')) {
      return {
        columns: ['Plant', 'PlantName', 'UniqueMaterials', 'TotalStock'],
        rows: [
          ['P001', 'North Manila Water Treatment Plant', 125, 15678],
          ['P002', 'South Manila Distribution Center', 108, 12456],
          ['P003', 'East Manila Pumping Station', 92, 9834],
          ['P004', 'Rizal Regional Facility', 87, 8765],
        ],
        executionTime: Math.floor(Math.random() * 200 + 70),
        rowCount: 4,
      };
    } else {
      // Generic result for other queries
      return {
        columns: ['Column1', 'Column2', 'Column3'],
        rows: [
          ['Sample', 'Data', '123'],
          ['Row', 'Values', '456'],
          ['Test', 'Results', '789'],
        ],
        executionTime: Math.floor(Math.random() * 300 + 100),
        rowCount: 3,
      };
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(query);
  };

  const exportToCSV = () => {
    if (!queryResult) return;

    const csv = [
      queryResult.columns.join(','),
      ...queryResult.rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query-results.csv';
    a.click();
  };

  return (
    <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200 dark:border-indigo-800">
      <div className="flex items-center gap-2 mb-6">
        <Database className="w-6 h-6 text-indigo-600" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">SQL Query Editor</h3>
      </div>

      {/* Query Templates */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Quick Templates:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {queryTemplates.map((template, index) => (
            <button
              key={index}
              onClick={() => setQuery(template.query)}
              className="text-left p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all"
            >
              <div className="font-medium text-sm text-gray-900 dark:text-white mb-1">{template.name}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{template.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Query Editor */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">SQL Query:</label>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
        </div>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your SQL query here..."
          className="w-full h-48 p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-lg border-2 border-gray-700 focus:border-indigo-500 outline-none resize-none"
          style={{ fontFamily: 'Monaco, Menlo, Courier New, monospace' }}
        />
      </div>

      {/* Execute Button */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={executeQuery}
          disabled={isExecuting}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            isExecuting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {isExecuting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Executing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Execute Query
            </>
          )}
        </button>

        {queryResult && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Executed in {queryResult.executionTime}ms</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 mb-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-red-900 dark:text-red-200">Query Error</div>
            <div className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</div>
          </div>
        </motion.div>
      )}

      {/* Query Results */}
      {queryResult && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-900 dark:text-white">
                {queryResult.rowCount} rows returned
              </span>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  {queryResult.columns.map((column, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-600"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queryResult.rows.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {typeof cell === 'number' ? cell.toLocaleString() : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Execution Stats */}
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-600 dark:text-gray-400">Execution Time</div>
                <div className="font-bold text-gray-900 dark:text-white">{queryResult.executionTime}ms</div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400">Rows Returned</div>
                <div className="font-bold text-gray-900 dark:text-white">{queryResult.rowCount}</div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400">Columns</div>
                <div className="font-bold text-gray-900 dark:text-white">{queryResult.columns.length}</div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400">Status</div>
                <div className="font-bold text-green-600">Success</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SQLQueryViewer;
