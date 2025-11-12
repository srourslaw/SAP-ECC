import { useState, useEffect } from 'react';
import { Database, Package, Users, ShoppingCart } from 'lucide-react';
import {
  generateSAPMaterials,
  generateSAPVendors,
  generateSAPPurchaseOrders,
  getSAPDataSummary,
} from '../../data/sapEccDummyData';

const SAPDataViewer = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      const dataSummary = getSAPDataSummary();
      setSummary(dataSummary);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          SAP ECC Master Data
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive dummy data for MWCI water utility operations
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Database className="w-10 h-10 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              MARA
            </span>
          </div>
          <h3 className="text-sm font-medium text-blue-900 mb-1">Materials</h3>
          <p className="text-3xl font-bold text-blue-900">{summary.totalMaterials.toLocaleString()}</p>
          <div className="mt-3 text-xs text-blue-700">
            <div>ROH: {summary.materialsByType.ROH}</div>
            <div>FERT: {summary.materialsByType.FERT}</div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-10 h-10 text-green-600" />
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
              LFA1
            </span>
          </div>
          <h3 className="text-sm font-medium text-green-900 mb-1">Vendors</h3>
          <p className="text-3xl font-bold text-green-900">{summary.totalVendors.toLocaleString()}</p>
          <div className="mt-3 text-xs text-green-700">
            Local & International Suppliers
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <ShoppingCart className="w-10 h-10 text-purple-600" />
            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
              EKKO
            </span>
          </div>
          <h3 className="text-sm font-medium text-purple-900 mb-1">Purchase Orders</h3>
          <p className="text-3xl font-bold text-purple-900">{summary.totalPurchaseOrders.toLocaleString()}</p>
          <div className="mt-3 text-xs text-purple-700">
            2024-2025 Period
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-10 h-10 text-orange-600" />
            <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
              STATUS
            </span>
          </div>
          <h3 className="text-sm font-medium text-orange-900 mb-1">Delivered</h3>
          <p className="text-3xl font-bold text-orange-900">{summary.ordersByStatus.Delivered.toLocaleString()}</p>
          <div className="mt-3 text-xs text-orange-700">
            Active: {summary.ordersByStatus.Released + summary.ordersByStatus.InTransit}
          </div>
        </div>
      </div>

      {/* Material Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Material Categories
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Pipes & Fittings', code: 'PIP', count: '56', icon: '🔵' },
            { name: 'Valves', code: 'VAL', count: '40', icon: '🔴' },
            { name: 'Chemicals', code: 'CHM', count: '32', icon: '🧪' },
            { name: 'Water Meters', code: 'MTR', count: '32', icon: '⏱️' },
            { name: 'Pumps', code: 'PMP', count: '24', icon: '⚙️' },
            { name: 'Equipment', code: 'EQP', count: '32', icon: '🔧' },
            { name: 'Safety Gear', code: 'SAF', count: '28', icon: '🦺' },
            { name: 'Total Items', code: 'ALL', count: summary.totalMaterials, icon: '📦' },
          ].map((category) => (
            <div
              key={category.code}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                {category.name}
              </div>
              <div className="text-2xl font-bold text-primary">{category.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Status Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Purchase Order Status Distribution
        </h3>
        <div className="space-y-4">
          {[
            { status: 'Delivered', count: summary.ordersByStatus.Delivered, color: 'bg-green-500', percentage: 0 },
            { status: 'In Transit', count: summary.ordersByStatus.InTransit, color: 'bg-blue-500', percentage: 0 },
            { status: 'Released', count: summary.ordersByStatus.Released, color: 'bg-yellow-500', percentage: 0 },
            { status: 'Cancelled', count: summary.ordersByStatus.Cancelled, color: 'bg-red-500', percentage: 0 },
          ].map((item) => {
            item.percentage = (item.count / summary.totalPurchaseOrders) * 100;
            return (
              <div key={item.status}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.status}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {item.count} ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`${item.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Generation Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-2">
          📊 Data Generation Complete
        </h3>
        <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <p>✅ Generated {summary.totalMaterials} materials across 7 categories</p>
          <p>✅ Created {summary.totalVendors} vendor records (Local & International)</p>
          <p>✅ Produced {summary.totalPurchaseOrders} purchase orders (2024-2025)</p>
          <p>✅ Realistic pricing, stock levels, and seasonal patterns</p>
          <p>✅ Multi-plant distribution (North/South/East Manila, Rizal)</p>
        </div>
      </div>
    </div>
  );
};

export default SAPDataViewer;
