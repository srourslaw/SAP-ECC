import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Database, ArrowRight, TrendingUp, Info } from 'lucide-react';

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

interface SSISTransformViewerProps {
  package: SSISPackage;
  onClose: () => void;
  getTransformationIcon: (type: string) => string;
}

const SSISTransformViewer = ({ package: pkg, onClose, getTransformationIcon }: SSISTransformViewerProps) => {
  const [selectedTransform, setSelectedTransform] = useState<Transformation | null>(null);

  const getTransformColor = (type: string) => {
    switch (type) {
      case 'DataConversion':
        return 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700';
      case 'DerivedColumn':
        return 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700';
      case 'Lookup':
        return 'bg-purple-100 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700';
      case 'Aggregate':
        return 'bg-orange-100 border-orange-300 dark:bg-orange-900/30 dark:border-orange-700';
      case 'Sort':
        return 'bg-pink-100 border-pink-300 dark:bg-pink-900/30 dark:border-pink-700';
      case 'Merge':
        return 'bg-indigo-100 border-indigo-300 dark:bg-indigo-900/30 dark:border-indigo-700';
      case 'ConditionalSplit':
        return 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700';
      default:
        return 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600';
    }
  };

  // Calculate row counts through pipeline (simulated)
  const calculateRowCounts = () => {
    let currentRows = pkg.rowsProcessed;
    return pkg.transformations.map((transform) => {
      // Simulate row count changes based on transformation type
      if (transform.type === 'ConditionalSplit') {
        currentRows = Math.floor(currentRows * 0.7); // Split reduces rows in main path
      } else if (transform.type === 'Aggregate') {
        currentRows = Math.floor(currentRows * 0.3); // Aggregation reduces rows significantly
      } else if (transform.type === 'Merge') {
        currentRows = Math.floor(currentRows * 1.2); // Merge increases rows
      } else {
        currentRows = Math.floor(currentRows * 0.98); // Small loss for quality/errors
      }
      return currentRows;
    });
  };

  const rowCounts = calculateRowCounts();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl max-w-6xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-xl flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold">{pkg.packageName}</h2>
            <p className="text-purple-100 mt-1">Transformation Flow Diagram</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Flow Diagram */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Data Flow Pipeline</h3>

            <div className="space-y-4">
              {/* Source Node */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center"
              >
                <div className="flex-shrink-0">
                  <div className="w-48 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <Database className="w-8 h-8" />
                      <div>
                        <div className="font-bold">Source</div>
                        <div className="text-xs text-blue-100 mt-1 font-mono">{pkg.source}</div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm font-semibold">
                      {pkg.rowsProcessed.toLocaleString()} rows
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-gray-400" />
                </div>
              </motion.div>

              {/* Transformation Nodes */}
              {pkg.transformations.map((transform, index) => (
                <div key={index}>
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: (index + 1) * 0.1 }}
                    className="flex items-center"
                  >
                    <div className="flex-shrink-0">
                      <div
                        onClick={() => setSelectedTransform(transform)}
                        className={`w-48 border-2 rounded-lg p-4 shadow-lg cursor-pointer hover:shadow-xl transition-all ${getTransformColor(
                          transform.type
                        )} ${selectedTransform === transform ? 'ring-2 ring-purple-500' : ''}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{getTransformationIcon(transform.type)}</span>
                          <div className="flex-1">
                            <div className="font-bold text-sm text-gray-900 dark:text-white">{transform.type}</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                          {transform.name}
                        </div>
                        <div className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                          {rowCounts[index].toLocaleString()} rows
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center px-4">
                      <ArrowRight className="w-8 h-8 text-gray-400" />
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {rowCounts[index].toLocaleString()} rows
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}

              {/* Destination Node */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: (pkg.transformations.length + 1) * 0.1 }}
                className="flex items-center"
              >
                <div className="flex-shrink-0">
                  <div className="w-48 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <Database className="w-8 h-8" />
                      <div>
                        <div className="font-bold">Destination</div>
                        <div className="text-xs text-green-100 mt-1 font-mono">{pkg.destination}</div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm font-semibold">
                      {rowCounts[rowCounts.length - 1].toLocaleString()} rows loaded
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Transformation Details Panel */}
          {selectedTransform && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-2 border-purple-200 dark:border-purple-800"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{getTransformationIcon(selectedTransform.type)}</span>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">{selectedTransform.name}</h4>
                    <p className="text-sm text-purple-600 font-semibold">{selectedTransform.type}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTransform(null)}
                  className="p-2 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Schema */}
                <div>
                  <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Input Columns
                  </h5>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                      {selectedTransform.inputColumns.map((col, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm font-mono text-gray-700 dark:text-gray-300"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          {col}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Output Schema */}
                <div>
                  <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    Output Columns
                  </h5>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                      {selectedTransform.outputColumns.map((col, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm font-mono text-gray-700 dark:text-gray-300"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {col}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transformation Logic */}
              <div className="mt-6">
                <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-purple-600" />
                  Transformation Logic
                </h5>
                <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
                  {selectedTransform.logic}
                </div>
              </div>

              {/* Sample Data Comparison */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h6 className="text-xs font-bold text-blue-900 dark:text-blue-200 mb-2">Before Transformation</h6>
                  <div className="text-xs font-mono text-gray-700 dark:text-gray-300 space-y-1">
                    <div>Row 1: {selectedTransform.inputColumns.join(', ')}</div>
                    <div className="text-blue-600">Sample input data...</div>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h6 className="text-xs font-bold text-green-900 dark:text-green-200 mb-2">After Transformation</h6>
                  <div className="text-xs font-mono text-gray-700 dark:text-gray-300 space-y-1">
                    <div>Row 1: {selectedTransform.outputColumns.join(', ')}</div>
                    <div className="text-green-600">Transformed output data...</div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h6 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Performance Metrics</h6>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.floor(Math.random() * 5000 + 1000)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Rows/Second</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.floor(Math.random() * 500 + 100)}ms
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Avg Processing</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">99.{Math.floor(Math.random() * 9 + 1)}%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Success Rate</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Instructions */}
          {!selectedTransform && (
            <div className="card bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-1">Interactive Flow Diagram</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Click on any transformation box to view detailed input/output schemas, transformation logic, and
                    performance metrics. The flow shows data volume changes at each step.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SSISTransformViewer;
