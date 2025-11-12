import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cube, TrendingUp, BarChart3, Layers, ChevronRight, ChevronDown, Database, Calculator, Target } from 'lucide-react';

interface Hierarchy {
  name: string;
  levels: string[];
}

interface Dimension {
  name: string;
  icon: string;
  color: string;
  hierarchies: Hierarchy[];
  attributeCount: number;
}

interface Measure {
  name: string;
  aggregation: 'SUM' | 'COUNT' | 'AVG' | 'MIN' | 'MAX';
  format: string;
  description: string;
}

interface MeasureGroup {
  name: string;
  icon: string;
  color: string;
  measures: Measure[];
  factTable: string;
}

interface CubeStructure {
  name: string;
  description: string;
  dimensions: Dimension[];
  measureGroups: MeasureGroup[];
  lastProcessed: Date;
  size: string;
  partitions: number;
}

const SSASCube = () => {
  const [selectedDimension, setSelectedDimension] = useState<Dimension | null>(null);
  const [selectedMeasureGroup, setSelectedMeasureGroup] = useState<MeasureGroup | null>(null);
  const [expandedHierarchies, setExpandedHierarchies] = useState<Set<string>>(new Set());

  // MWCI SAP Analytics Cube Structure
  const cube: CubeStructure = {
    name: 'MWCI_SAP_Analytics',
    description: 'Enterprise Analytics Cube for SAP ECC Data',
    lastProcessed: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    size: '2.4 GB',
    partitions: 12,
    dimensions: [
      {
        name: 'Time',
        icon: '📅',
        color: 'blue',
        attributeCount: 8,
        hierarchies: [
          {
            name: 'Calendar',
            levels: ['Year', 'Quarter', 'Month', 'Week', 'Day']
          },
          {
            name: 'Fiscal',
            levels: ['Fiscal Year', 'Fiscal Quarter', 'Fiscal Month']
          }
        ]
      },
      {
        name: 'Material',
        icon: '📦',
        color: 'green',
        attributeCount: 12,
        hierarchies: [
          {
            name: 'Product Hierarchy',
            levels: ['Material Group', 'Material Type', 'Material', 'Material Description']
          },
          {
            name: 'Valuation',
            levels: ['Valuation Class', 'Material']
          }
        ]
      },
      {
        name: 'Vendor',
        icon: '🏢',
        color: 'purple',
        attributeCount: 10,
        hierarchies: [
          {
            name: 'Vendor Geography',
            levels: ['Country', 'Region', 'City', 'Vendor']
          },
          {
            name: 'Vendor Category',
            levels: ['Vendor Group', 'Vendor Type', 'Vendor']
          }
        ]
      },
      {
        name: 'Plant',
        icon: '🏭',
        color: 'orange',
        attributeCount: 7,
        hierarchies: [
          {
            name: 'Plant Hierarchy',
            levels: ['Company Code', 'Plant', 'Storage Location']
          }
        ]
      },
      {
        name: 'Purchase Organization',
        icon: '🛒',
        color: 'indigo',
        attributeCount: 5,
        hierarchies: [
          {
            name: 'Purchasing Structure',
            levels: ['Purchase Organization', 'Purchase Group']
          }
        ]
      }
    ],
    measureGroups: [
      {
        name: 'Purchase Orders',
        icon: '📋',
        color: 'blue',
        factTable: 'Fact_PurchaseOrders',
        measures: [
          { name: 'Order Count', aggregation: 'COUNT', format: '#,##0', description: 'Total number of purchase orders' },
          { name: 'Order Value', aggregation: 'SUM', format: '$#,##0.00', description: 'Total purchase order value' },
          { name: 'Average Order Value', aggregation: 'AVG', format: '$#,##0.00', description: 'Average value per order' },
          { name: 'Line Item Count', aggregation: 'SUM', format: '#,##0', description: 'Total number of line items' }
        ]
      },
      {
        name: 'Inventory',
        icon: '📊',
        color: 'green',
        factTable: 'Fact_Inventory',
        measures: [
          { name: 'Quantity on Hand', aggregation: 'SUM', format: '#,##0', description: 'Current inventory quantity' },
          { name: 'Inventory Value', aggregation: 'SUM', format: '$#,##0.00', description: 'Total inventory value' },
          { name: 'Reorder Point', aggregation: 'SUM', format: '#,##0', description: 'Minimum stock level' },
          { name: 'Stock Turnover', aggregation: 'AVG', format: '#,##0.00', description: 'Inventory turnover ratio' }
        ]
      },
      {
        name: 'Material Movements',
        icon: '🔄',
        color: 'purple',
        factTable: 'Fact_MaterialMovements',
        measures: [
          { name: 'Movement Quantity', aggregation: 'SUM', format: '#,##0', description: 'Total quantity moved' },
          { name: 'Movement Count', aggregation: 'COUNT', format: '#,##0', description: 'Number of movements' },
          { name: 'Movement Value', aggregation: 'SUM', format: '$#,##0.00', description: 'Total value of movements' }
        ]
      },
      {
        name: 'Invoices',
        icon: '💰',
        color: 'orange',
        factTable: 'Fact_Invoices',
        measures: [
          { name: 'Invoice Amount', aggregation: 'SUM', format: '$#,##0.00', description: 'Total invoice amount' },
          { name: 'Invoice Count', aggregation: 'COUNT', format: '#,##0', description: 'Number of invoices' },
          { name: 'Average Invoice', aggregation: 'AVG', format: '$#,##0.00', description: 'Average invoice amount' },
          { name: 'Tax Amount', aggregation: 'SUM', format: '$#,##0.00', description: 'Total tax collected' }
        ]
      }
    ]
  };

  const toggleHierarchy = (hierarchyName: string) => {
    const newExpanded = new Set(expandedHierarchies);
    if (newExpanded.has(hierarchyName)) {
      newExpanded.delete(hierarchyName);
    } else {
      newExpanded.add(hierarchyName);
    }
    setExpandedHierarchies(newExpanded);
  };

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string; border: string; text: string; badge: string } } = {
      blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-300 dark:border-blue-700', text: 'text-blue-700 dark:text-blue-300', badge: 'bg-blue-500' },
      green: { bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-300 dark:border-green-700', text: 'text-green-700 dark:text-green-300', badge: 'bg-green-500' },
      purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', border: 'border-purple-300 dark:border-purple-700', text: 'text-purple-700 dark:text-purple-300', badge: 'bg-purple-500' },
      orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-orange-300 dark:border-orange-700', text: 'text-orange-700 dark:text-orange-300', badge: 'bg-orange-500' },
      indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', border: 'border-indigo-300 dark:border-indigo-700', text: 'text-indigo-700 dark:text-indigo-300', badge: 'bg-indigo-500' }
    };
    return colorMap[color] || colorMap.blue;
  };

  const getAggregationIcon = (agg: string) => {
    switch (agg) {
      case 'SUM': return '∑';
      case 'COUNT': return '#';
      case 'AVG': return 'μ';
      case 'MIN': return '↓';
      case 'MAX': return '↑';
      default: return '∑';
    }
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
              <Cube className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                SSAS Cube Structure
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {cube.name} - {cube.description}
              </p>
            </div>
          </div>
        </div>
        <div className="text-left md:text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Last Processed</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {timeAgo(cube.lastProcessed)}
          </p>
        </div>
      </div>

      {/* Cube Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Dimensions</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">{cube.dimensions.length}</p>
            </div>
            <Layers className="w-10 h-10 text-blue-500 opacity-50" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-200 dark:border-green-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">Measure Groups</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-1">{cube.measureGroups.length}</p>
            </div>
            <BarChart3 className="w-10 h-10 text-green-500 opacity-50" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-2 border-purple-200 dark:border-purple-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Cube Size</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-1">{cube.size}</p>
            </div>
            <Database className="w-10 h-10 text-purple-500 opacity-50" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-2 border-orange-200 dark:border-orange-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">Partitions</p>
              <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mt-1">{cube.partitions}</p>
            </div>
            <Target className="w-10 h-10 text-orange-500 opacity-50" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dimensions Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dimensions</h2>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded">
              {cube.dimensions.length}
            </span>
          </div>

          <div className="space-y-3">
            {cube.dimensions.map((dimension, index) => {
              const colors = getColorClasses(dimension.color);
              return (
                <motion.div
                  key={dimension.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedDimension(dimension)}
                  className={`card border-2 cursor-pointer transition-all hover:shadow-lg ${colors.bg} ${colors.border} ${
                    selectedDimension?.name === dimension.name ? 'ring-4 ring-purple-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{dimension.icon}</span>
                      <div>
                        <h3 className={`text-lg font-bold ${colors.text}`}>{dimension.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {dimension.hierarchies.length} {dimension.hierarchies.length === 1 ? 'hierarchy' : 'hierarchies'}, {dimension.attributeCount} attributes
                        </p>
                      </div>
                    </div>
                    <div className={`${colors.badge} text-white px-2 py-1 rounded text-xs font-bold`}>
                      {dimension.hierarchies.length}H
                    </div>
                  </div>

                  {/* Hierarchies */}
                  <div className="space-y-2">
                    {dimension.hierarchies.map((hierarchy) => {
                      const isExpanded = expandedHierarchies.has(`${dimension.name}-${hierarchy.name}`);
                      return (
                        <div key={hierarchy.name} className="bg-white dark:bg-gray-800 rounded p-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleHierarchy(`${dimension.name}-${hierarchy.name}`);
                            }}
                            className="flex items-center justify-between w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded p-1 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                              )}
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">{hierarchy.name}</span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {hierarchy.levels.length} levels
                            </span>
                          </button>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              className="ml-6 mt-2 space-y-1"
                            >
                              {hierarchy.levels.map((level, idx) => (
                                <div key={level} className="flex items-center gap-2 text-xs">
                                  <div className={`w-6 h-6 rounded flex items-center justify-center ${colors.bg} ${colors.text} font-bold`}>
                                    {idx + 1}
                                  </div>
                                  <span className="text-gray-700 dark:text-gray-300">{level}</span>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Measure Groups Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Measure Groups</h2>
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold rounded">
              {cube.measureGroups.length}
            </span>
          </div>

          <div className="space-y-3">
            {cube.measureGroups.map((group, index) => {
              const colors = getColorClasses(group.color);
              return (
                <motion.div
                  key={group.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedMeasureGroup(group)}
                  className={`card border-2 cursor-pointer transition-all hover:shadow-lg ${colors.bg} ${colors.border} ${
                    selectedMeasureGroup?.name === group.name ? 'ring-4 ring-purple-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{group.icon}</span>
                      <div>
                        <h3 className={`text-lg font-bold ${colors.text}`}>{group.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                          {group.factTable}
                        </p>
                      </div>
                    </div>
                    <div className={`${colors.badge} text-white px-2 py-1 rounded text-xs font-bold`}>
                      {group.measures.length}M
                    </div>
                  </div>

                  {/* Measures */}
                  <div className="space-y-2">
                    {group.measures.map((measure) => (
                      <div key={measure.name} className="bg-white dark:bg-gray-800 rounded p-3">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded ${colors.badge} text-white flex items-center justify-center text-xs font-bold`}>
                              {getAggregationIcon(measure.aggregation)}
                            </div>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{measure.name}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 ${colors.bg} ${colors.text} rounded font-mono`}>
                            {measure.aggregation}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 ml-8">{measure.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 ml-8 mt-1 font-mono">
                          Format: {measure.format}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cube Relationships Info */}
      <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200 dark:border-indigo-800">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-200 mb-2">Cube Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Query Performance</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">0.3s</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Average query time</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Processing Time</p>
                <p className="text-2xl font-bold text-green-600 mt-1">12m</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Last full process</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Aggregations</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">1,247</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Precomputed aggregations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSASCube;
