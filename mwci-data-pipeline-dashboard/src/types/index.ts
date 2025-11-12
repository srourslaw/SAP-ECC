// SAP ECC Types
export interface SAPMaterial {
  matnr: string; // Material number
  maktx: string; // Material description
  mtart: string; // Material type
  meins: string; // Base unit of measure
  matkl: string; // Material group
  werks: string; // Plant
  labst: number; // Stock quantity
  price: number; // Price
  currency: string;
}

export interface SAPPurchaseOrder {
  ebeln: string; // PO number
  lifnr: string; // Vendor number
  bedat: Date; // PO date
  ebelp: string; // PO item
  matnr: string; // Material
  menge: number; // Quantity
  netpr: number; // Net price
  status: string; // PO status
}

export interface SAPVendor {
  lifnr: string; // Vendor number
  name1: string; // Vendor name
  land1: string; // Country
  regio: string; // Region
  ort01: string; // City
}

// Replication Types
export interface ReplicationStatus {
  isActive: boolean;
  lag: number; // milliseconds
  transactionsPerSecond: number;
  dataVolume: string;
  status: 'Healthy' | 'Warning' | 'Critical';
  lastUpdated: Date;
}

export interface BackupStatus {
  type: 'Full' | 'Differential' | 'Transaction Log';
  lastBackup: Date;
  nextScheduled: Date;
  size: string;
  duration: string;
  status: 'Success' | 'Running' | 'Failed';
  location: string;
}

// SSIS Types
export interface SSISPackage {
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

export interface Transformation {
  type: 'DataConversion' | 'DerivedColumn' | 'Lookup' |
        'Aggregate' | 'Sort' | 'Merge' | 'ConditionalSplit';
  name: string;
  inputColumns: string[];
  outputColumns: string[];
  logic: string;
}

// SSAS Types
export interface SSASCube {
  cubeName: string;
  dimensions: Dimension[];
  measureGroups: MeasureGroup[];
  calculations: DAXCalculation[];
  partitions: Partition[];
  lastProcessed: Date;
  status: 'Processed' | 'Processing' | 'Unprocessed';
}

export interface Dimension {
  name: string;
  attributes: Attribute[];
  hierarchies: Hierarchy[];
  type: 'Time' | 'Geography' | 'Product' | 'Supplier' | 'Regular';
}

export interface Attribute {
  name: string;
  dataType: string;
  memberCount: number;
}

export interface Hierarchy {
  name: string;
  levels: string[];
}

export interface MeasureGroup {
  name: string;
  measures: Measure[];
  factTable: string;
  aggregationType: 'Sum' | 'Count' | 'Avg' | 'Min' | 'Max';
}

export interface Measure {
  name: string;
  format: string;
  aggregation: string;
}

export interface DAXCalculation {
  name: string;
  formula: string;
  description: string;
}

export interface Partition {
  name: string;
  size: string;
  rowCount: number;
}

// Excel Types
export interface PivotTableConfig {
  name: string;
  dataSource: string;
  rows: string[];
  columns: string[];
  values: ValueField[];
  filters: FilterField[];
}

export interface ValueField {
  field: string;
  aggregation: 'Sum' | 'Average' | 'Count' | 'Min' | 'Max';
  format: 'Currency' | 'Number' | 'Percentage';
  showAs?: 'Value' | '% of Total' | '% of Column' | 'Running Total';
}

export interface FilterField {
  field: string;
  selectedValues: string[];
}

// Dashboard Types
export interface MetricCard {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
  trend?: string;
  icon?: string;
}

export interface Alert {
  id: string;
  severity: 'Critical' | 'Warning' | 'Info';
  component: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}
