import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Activity,
  Clock,
  HardDrive,
  Pause,
  Play,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Server,
  Zap,
} from 'lucide-react';
import { Line } from 'recharts';

interface BackupStatus {
  type: 'Full' | 'Differential' | 'Transaction Log';
  lastBackup: Date;
  nextScheduled: Date;
  size: string;
  duration: string;
  status: 'Success' | 'Running' | 'Failed';
  location: string;
}

interface ReplicationMetrics {
  transactionsPerSecond: number;
  latencyMs: number;
  dataVolumeGB: number;
  queueDepth: number;
  failedAttempts: number;
  networkThroughputMbps: number;
}

const ReplicationLayer = () => {
  const [isReplicating, setIsReplicating] = useState(true);
  const [currentRPO, setCurrentRPO] = useState(3.2); // seconds
  const [currentRTO, setCurrentRTO] = useState(2.5); // hours
  const [lastTransaction, setLastTransaction] = useState(2); // seconds ago
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [selectedPacket, setSelectedPacket] = useState<number | null>(null);

  // Replication metrics state
  const [metrics, setMetrics] = useState<ReplicationMetrics>({
    transactionsPerSecond: 1247,
    latencyMs: 3200,
    dataVolumeGB: 2.3,
    queueDepth: 42,
    failedAttempts: 0,
    networkThroughputMbps: 125,
  });

  // Backup statuses
  const backupStatuses: BackupStatus[] = [
    {
      type: 'Full',
      lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000),
      nextScheduled: new Date(Date.now() + 3 * 60 * 60 * 1000),
      size: '45.2 GB',
      duration: '2h 15m',
      status: 'Success',
      location: 'Azure Backup Vault - Manila',
    },
    {
      type: 'Differential',
      lastBackup: new Date(Date.now() - 6 * 60 * 60 * 1000),
      nextScheduled: new Date(Date.now() + 6 * 60 * 60 * 1000),
      size: '8.7 GB',
      duration: '28m',
      status: 'Success',
      location: 'Azure Backup Vault - Manila',
    },
    {
      type: 'Transaction Log',
      lastBackup: new Date(Date.now() - 15 * 60 * 1000),
      nextScheduled: new Date(Date.now() + 15 * 60 * 1000),
      size: '1.2 GB',
      duration: '3m',
      status: 'Running',
      location: 'Azure Backup Vault - Manila',
    },
  ];

  // Historical latency data for chart
  const [latencyHistory, setLatencyHistory] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      latency: Math.random() * 5000 + 2000,
    }))
  );

  // Simulate real-time metrics updates
  useEffect(() => {
    if (!isReplicating) return;

    const interval = setInterval(() => {
      setMetrics((prev) => ({
        transactionsPerSecond: Math.floor(Math.random() * 500 + 1000),
        latencyMs: Math.floor(Math.random() * 2000 + 2000),
        dataVolumeGB: parseFloat((Math.random() * 1 + 2).toFixed(2)),
        queueDepth: Math.floor(Math.random() * 30 + 30),
        failedAttempts: prev.failedAttempts + (Math.random() > 0.95 ? 1 : 0),
        networkThroughputMbps: Math.floor(Math.random() * 50 + 100),
      }));

      setCurrentRPO(parseFloat((Math.random() * 2 + 2).toFixed(1)));
      setLastTransaction(Math.floor(Math.random() * 5 + 1));
    }, 2000);

    return () => clearInterval(interval);
  }, [isReplicating]);

  // Animated data packets
  const DataPacket = ({ index, delay }: { index: number; delay: number }) => (
    <motion.div
      initial={{ x: 0, opacity: 0 }}
      animate={{
        x: isReplicating ? 600 : 0,
        opacity: isReplicating ? [0, 1, 1, 0] : 0,
      }}
      transition={{
        duration: 3,
        delay: delay,
        repeat: isReplicating ? Infinity : 0,
        repeatDelay: 1,
      }}
      onClick={() => {
        setSelectedPacket(index);
        setShowDetailedView(true);
      }}
      className="absolute cursor-pointer"
      style={{ top: `${20 + (index % 3) * 30}px` }}
    >
      <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 animate-pulse" />
    </motion.div>
  );

  const getStatusColor = (latencyMs: number) => {
    if (latencyMs < 5000) return 'text-green-500';
    if (latencyMs < 10000) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusBg = (latencyMs: number) => {
    if (latencyMs < 5000) return 'bg-green-50 border-green-200';
    if (latencyMs < 10000) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const formatTimeUntil = (date: Date) => {
    const seconds = Math.floor((date.getTime() - Date.now()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const triggerManualBackup = () => {
    alert('Manual backup triggered! This would initiate a full backup process.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Replication & Disaster Recovery
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time monitoring of SAP ECC to SQL Server data replication
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsReplicating(!isReplicating)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isReplicating
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isReplicating ? (
              <>
                <Pause className="w-4 h-4" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Resume
              </>
            )}
          </button>
          <button
            onClick={triggerManualBackup}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Manual Backup
          </button>
        </div>
      </div>

      {/* Replication Flow Visualization */}
      <div className={`card ${getStatusBg(metrics.latencyMs)}`}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Data Replication Flow
        </h3>

        <div className="relative flex items-center justify-between py-8">
          {/* SAP ECC Source */}
          <motion.div
            className="flex flex-col items-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl relative">
              <Database className="w-16 h-16 text-white" />
              {isReplicating && (
                <motion.div
                  className="absolute inset-0 rounded-2xl border-4 border-blue-300"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
            <p className="mt-3 font-bold text-gray-900 dark:text-white">SAP ECC</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Source System</p>
            <div className="mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              {metrics.transactionsPerSecond.toLocaleString()} TPS
            </div>
          </motion.div>

          {/* Animated Data Stream */}
          <div className="flex-1 relative h-24 mx-8">
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-700 rounded-full transform -translate-y-1/2" />
            <div
              className={`absolute top-1/2 left-0 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transform -translate-y-1/2 transition-all duration-1000 ${
                isReplicating ? 'animate-pulse' : ''
              }`}
              style={{ width: '100%' }}
            />
            {isReplicating && (
              <>
                {[0, 1, 2, 3, 4].map((i) => (
                  <DataPacket key={i} index={i} delay={i * 0.6} />
                ))}
              </>
            )}
          </div>

          {/* SQL Server Target */}
          <motion.div
            className="flex flex-col items-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl relative">
              <Server className="w-16 h-16 text-white" />
              {isReplicating && (
                <motion.div
                  className="absolute inset-0 rounded-2xl border-4 border-purple-300"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
              )}
            </div>
            <p className="mt-3 font-bold text-gray-900 dark:text-white">SQL Server</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Target Database</p>
            <div className="mt-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
              {metrics.dataVolumeGB} GB
            </div>
          </motion.div>
        </div>

        {/* Replication Status */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Zap className={`w-5 h-5 ${getStatusColor(metrics.latencyMs)}`} />
            <span className="text-gray-700 dark:text-gray-300">
              Latency: <span className="font-bold">{metrics.latencyMs.toLocaleString()} ms</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <span className="text-gray-700 dark:text-gray-300">
              Queue: <span className="font-bold">{metrics.queueDepth}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-gray-700 dark:text-gray-300">
              Network: <span className="font-bold">{metrics.networkThroughputMbps} Mbps</span>
            </span>
          </div>
        </div>
      </div>

      {/* RTO & RPO Monitors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RPO Monitor */}
        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-green-900 dark:text-green-200">
              RPO (Recovery Point Objective)
            </h3>
            <Clock className="w-6 h-6 text-green-600" />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm text-green-800 dark:text-green-300">Target RPO</span>
                <span className="text-3xl font-bold text-green-900 dark:text-green-100">
                  15 min
                </span>
              </div>
              <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current RPO
                </span>
                <span className={`text-2xl font-bold ${getStatusColor(currentRPO * 1000)}`}>
                  {currentRPO}s
                </span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Data loss window: &lt; 15 minutes
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Transaction Replicated
                </span>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {lastTransaction} seconds ago
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Transaction ID: TRX-{Date.now().toString().slice(-8)}
              </div>
            </div>

            <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 text-xs text-green-800 dark:text-green-200">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>RPO Status: COMPLIANT</strong>
                  <p className="mt-1 opacity-80">
                    Replication lag is well within acceptable parameters. No data loss risk
                    detected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RTO Monitor */}
        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200">
              RTO (Recovery Time Objective)
            </h3>
            <Activity className="w-6 h-6 text-blue-600" />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm text-blue-800 dark:text-blue-300">Target RTO</span>
                <span className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  4 hours
                </span>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current RTO Capability
                </span>
                <span className="text-2xl font-bold text-green-500">{currentRTO}h</span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Estimated time to restore full operations
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Recovery Test
                </span>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">12 days ago</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Next test scheduled: 18 days from now
              </div>
            </div>

            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 text-xs text-blue-800 dark:text-blue-200">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>RTO Status: EXCELLENT</strong>
                  <p className="mt-1 opacity-80">
                    Recovery capability exceeds target by 1.5 hours. All backup systems
                    operational.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backup Status Dashboard */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Backup Status</h3>
          <HardDrive className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </div>

        <div className="space-y-4">
          {backupStatuses.map((backup, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-2 ${
                backup.status === 'Success'
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                  : backup.status === 'Running'
                  ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                  : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`font-bold ${
                        backup.status === 'Success'
                          ? 'text-green-900 dark:text-green-100'
                          : backup.status === 'Running'
                          ? 'text-blue-900 dark:text-blue-100'
                          : 'text-red-900 dark:text-red-100'
                      }`}
                    >
                      {backup.type}
                    </span>
                    {backup.status === 'Success' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {backup.status === 'Running' && (
                      <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                    )}
                    {backup.status === 'Failed' && (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs">Last Backup</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatTimeAgo(backup.lastBackup)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs">Next Scheduled</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatTimeUntil(backup.nextScheduled)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs">Size</div>
                      <div className="font-medium text-gray-900 dark:text-white">{backup.size}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs">Duration</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {backup.duration}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Database className="w-3 h-3" />
                    {backup.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Replication Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="card bg-blue-50 dark:bg-blue-900/20">
          <div className="text-sm text-blue-800 dark:text-blue-300 mb-1">Transactions/Sec</div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {metrics.transactionsPerSecond.toLocaleString()}
          </div>
        </div>

        <div className="card bg-purple-50 dark:bg-purple-900/20">
          <div className="text-sm text-purple-800 dark:text-purple-300 mb-1">Latency</div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {metrics.latencyMs.toLocaleString()}ms
          </div>
        </div>

        <div className="card bg-green-50 dark:bg-green-900/20">
          <div className="text-sm text-green-800 dark:text-green-300 mb-1">Data Volume</div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {metrics.dataVolumeGB} GB
          </div>
        </div>

        <div className="card bg-orange-50 dark:bg-orange-900/20">
          <div className="text-sm text-orange-800 dark:text-orange-300 mb-1">Queue Depth</div>
          <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
            {metrics.queueDepth}
          </div>
        </div>

        <div className="card bg-red-50 dark:bg-red-900/20">
          <div className="text-sm text-red-800 dark:text-red-300 mb-1">Failed Attempts</div>
          <div className="text-2xl font-bold text-red-900 dark:text-red-100">
            {metrics.failedAttempts}
          </div>
        </div>

        <div className="card bg-indigo-50 dark:bg-indigo-900/20">
          <div className="text-sm text-indigo-800 dark:text-indigo-300 mb-1">Network</div>
          <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
            {metrics.networkThroughputMbps} Mbps
          </div>
        </div>
      </div>

      {/* Detailed Packet View Modal */}
      <AnimatePresence>
        {showDetailedView && selectedPacket !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailedView(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Transaction Details - Packet #{selectedPacket}
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    TRX-{Date.now().toString().slice(-8) + selectedPacket}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Table:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    SAP_PurchaseOrders
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Operation:</span>
                  <span className="font-medium text-blue-600">INSERT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Rows Affected:</span>
                  <span className="font-medium text-gray-900 dark:text-white">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Commit Timestamp:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {new Date().toISOString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Replication Lag:</span>
                  <span className="font-medium text-green-600">{currentRPO}s</span>
                </div>
              </div>

              <button
                onClick={() => setShowDetailedView(false)}
                className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReplicationLayer;
