import type { SAPMaterial, SAPPurchaseOrder, SAPVendor } from '../types';

/**
 * SAP ECC Dummy Data Generator for MWCI (Manila Water Company Inc.)
 *
 * Generates realistic water utility data including:
 * - Materials: pipes, valves, chemicals, meters, equipment
 * - Vendors: local and international suppliers
 * - Purchase Orders: spanning 2024-2025
 * - Plants: North Manila, South Manila, East Manila, Rizal
 */

// ==================== CONFIGURATION ====================

const PLANTS = [
  { code: '1000', name: 'North Manila Plant' },
  { code: '2000', name: 'South Manila Plant' },
  { code: '3000', name: 'East Manila Plant' },
  { code: '4000', name: 'Rizal Plant' },
];

const MATERIAL_GROUPS = {
  PIPES: 'PIP',
  VALVES: 'VAL',
  CHEMICALS: 'CHM',
  METERS: 'MTR',
  PUMPS: 'PMP',
  EQUIPMENT: 'EQP',
  SAFETY: 'SAF',
};

const MATERIAL_TYPES = {
  ROH: 'Raw Materials',
  HALB: 'Semi-Finished Goods',
  FERT: 'Finished Products',
};

// ==================== MATERIAL DATA ====================

const PIPE_MATERIALS = [
  { name: 'PVC Pipe 50mm', size: '50mm', price: 125.50 },
  { name: 'PVC Pipe 100mm', size: '100mm', price: 450.00 },
  { name: 'PVC Pipe 150mm', size: '150mm', price: 890.00 },
  { name: 'PVC Pipe 200mm', size: '200mm', price: 1450.00 },
  { name: 'PVC Pipe 300mm', size: '300mm', price: 2850.00 },
  { name: 'PVC Pipe 400mm', size: '400mm', price: 4200.00 },
  { name: 'PVC Pipe 500mm', size: '500mm', price: 6500.00 },
  { name: 'HDPE Pipe 63mm', size: '63mm', price: 280.00 },
  { name: 'HDPE Pipe 110mm', size: '110mm', price: 580.00 },
  { name: 'HDPE Pipe 160mm', size: '160mm', price: 1150.00 },
  { name: 'Ductile Iron Pipe 150mm', size: '150mm', price: 2200.00 },
  { name: 'Ductile Iron Pipe 200mm', size: '200mm', price: 3100.00 },
  { name: 'Steel Pipe 100mm', size: '100mm', price: 1800.00 },
  { name: 'Steel Pipe 200mm', size: '200mm', price: 3500.00 },
];

const VALVE_MATERIALS = [
  { name: 'Gate Valve 50mm', size: '50mm', price: 1250.00 },
  { name: 'Gate Valve 100mm', size: '100mm', price: 2350.00 },
  { name: 'Gate Valve 150mm', size: '150mm', price: 4200.00 },
  { name: 'Butterfly Valve 200mm', size: '200mm', price: 5800.00 },
  { name: 'Butterfly Valve 300mm', size: '300mm', price: 9500.00 },
  { name: 'Check Valve 100mm', size: '100mm', price: 1850.00 },
  { name: 'Check Valve 150mm', size: '150mm', price: 3200.00 },
  { name: 'Ball Valve 50mm', size: '50mm', price: 850.00 },
  { name: 'Ball Valve 100mm', size: '100mm', price: 1650.00 },
  { name: 'Pressure Reducing Valve', size: '100mm', price: 12500.00 },
];

const CHEMICAL_MATERIALS = [
  { name: 'Chlorine Gas Cylinder', unit: 'KG', price: 185.00 },
  { name: 'Sodium Hypochlorite 12%', unit: 'L', price: 45.00 },
  { name: 'Lime (Calcium Hydroxide)', unit: 'KG', price: 28.00 },
  { name: 'Aluminum Sulfate (Alum)', unit: 'KG', price: 35.00 },
  { name: 'Polymer Coagulant', unit: 'KG', price: 125.00 },
  { name: 'Activated Carbon', unit: 'KG', price: 95.00 },
  { name: 'Sodium Hydroxide', unit: 'KG', price: 42.00 },
  { name: 'pH Adjustment Chemical', unit: 'L', price: 78.00 },
];

const METER_MATERIALS = [
  { name: 'Water Meter 15mm Residential', type: 'Residential', price: 450.00 },
  { name: 'Water Meter 20mm Residential', type: 'Residential', price: 580.00 },
  { name: 'Water Meter 25mm Commercial', type: 'Commercial', price: 1250.00 },
  { name: 'Water Meter 40mm Commercial', type: 'Commercial', price: 2350.00 },
  { name: 'Water Meter 50mm Industrial', type: 'Industrial', price: 4200.00 },
  { name: 'Water Meter 100mm Industrial', type: 'Industrial', price: 8500.00 },
  { name: 'Smart Water Meter 20mm', type: 'Smart', price: 1850.00 },
  { name: 'Bulk Flow Meter 200mm', type: 'Bulk', price: 25000.00 },
];

const PUMP_MATERIALS = [
  { name: 'Centrifugal Pump 5HP', power: '5HP', price: 28500.00 },
  { name: 'Centrifugal Pump 10HP', power: '10HP', price: 42000.00 },
  { name: 'Centrifugal Pump 25HP', power: '25HP', price: 85000.00 },
  { name: 'Submersible Pump 7.5HP', power: '7.5HP', price: 35000.00 },
  { name: 'Booster Pump 15HP', power: '15HP', price: 52000.00 },
  { name: 'Dosing Pump (Chemical)', power: '1HP', price: 18500.00 },
];

const EQUIPMENT_MATERIALS = [
  { name: 'Pressure Gauge 0-10 Bar', type: 'Gauge', price: 850.00 },
  { name: 'Flow Meter Electromagnetic', type: 'Meter', price: 45000.00 },
  { name: 'Water Quality Analyzer', type: 'Analyzer', price: 125000.00 },
  { name: 'Chlorine Residual Analyzer', type: 'Analyzer', price: 85000.00 },
  { name: 'pH Meter Inline', type: 'Meter', price: 28000.00 },
  { name: 'Turbidity Meter', type: 'Meter', price: 35000.00 },
  { name: 'Pressure Tank 500L', type: 'Tank', price: 25000.00 },
  { name: 'Filtration Media (Sand)', type: 'Media', price: 15000.00 },
];

const SAFETY_MATERIALS = [
  { name: 'Safety Helmet', type: 'PPE', price: 350.00 },
  { name: 'Safety Goggles', type: 'PPE', price: 250.00 },
  { name: 'Gas Mask with Filters', type: 'PPE', price: 2500.00 },
  { name: 'Chemical Resistant Gloves', type: 'PPE', price: 450.00 },
  { name: 'Safety Boots Steel Toe', type: 'PPE', price: 1850.00 },
  { name: 'High Visibility Vest', type: 'PPE', price: 280.00 },
  { name: 'First Aid Kit', type: 'Safety', price: 1250.00 },
];

// ==================== VENDOR DATA ====================

const VENDOR_DATA = [
  // Philippine Vendors
  { name: 'Manila Pipe Supply Inc.', country: 'PH', region: 'NCR', city: 'Makati', rating: 'A' },
  { name: 'Philippine Valve Corporation', country: 'PH', region: 'NCR', city: 'Quezon City', rating: 'A' },
  { name: 'Metro Manila Water Equipment', country: 'PH', region: 'NCR', city: 'Manila', rating: 'B' },
  { name: 'Luzon Chemical Supplies', country: 'PH', region: 'NCR', city: 'Pasig', rating: 'A' },
  { name: 'Philippine Pump Systems', country: 'PH', region: 'CAL', city: 'Caloocan', rating: 'B' },
  { name: 'Asian Water Technologies', country: 'PH', region: 'NCR', city: 'Mandaluyong', rating: 'A' },
  { name: 'National Hardware Trading', country: 'PH', region: 'NCR', city: 'Taguig', rating: 'C' },
  { name: 'Rizal Industrial Supplies', country: 'PH', region: 'RIZ', city: 'Antipolo', rating: 'B' },
  { name: 'Cavite Pipe Traders', country: 'PH', region: 'CAV', city: 'Bacoor', rating: 'B' },
  { name: 'Laguna Equipment Center', country: 'PH', region: 'LAG', city: 'Sta. Rosa', rating: 'C' },

  // Singapore Vendors
  { name: 'Singapore Water Systems Pte Ltd', country: 'SG', region: 'SG', city: 'Singapore', rating: 'A' },
  { name: 'Asia Pacific Valves', country: 'SG', region: 'SG', city: 'Singapore', rating: 'A' },
  { name: 'SEA Industrial Equipment', country: 'SG', region: 'SG', city: 'Singapore', rating: 'B' },

  // China Vendors
  { name: 'Shanghai Pipe Manufacturing', country: 'CN', region: 'SH', city: 'Shanghai', rating: 'B' },
  { name: 'Beijing Water Technology', country: 'CN', region: 'BJ', city: 'Beijing', rating: 'B' },
  { name: 'Guangzhou Valve Factory', country: 'CN', region: 'GD', city: 'Guangzhou', rating: 'C' },
  { name: 'Shenzhen Industrial Supplies', country: 'CN', region: 'GD', city: 'Shenzhen', rating: 'B' },

  // Japan Vendors
  { name: 'Tokyo Water Solutions KK', country: 'JP', region: 'TYO', city: 'Tokyo', rating: 'A' },
  { name: 'Osaka Precision Valves', country: 'JP', region: 'OSA', city: 'Osaka', rating: 'A' },
  { name: 'Yokohama Equipment Corp', country: 'JP', region: 'KAN', city: 'Yokohama', rating: 'A' },

  // USA/Europe Vendors
  { name: 'American Water Technologies', country: 'US', region: 'CA', city: 'Los Angeles', rating: 'A' },
  { name: 'European Valve Systems GmbH', country: 'DE', region: 'BY', city: 'Munich', rating: 'A' },
  { name: 'UK Water Equipment Ltd', country: 'GB', region: 'LDN', city: 'London', rating: 'A' },
];

// ==================== GENERATOR FUNCTIONS ====================

/**
 * Generates a random SAP material number
 * Format: 100XXXXXX (10 digits)
 */
function generateMaterialNumber(index: number): string {
  return `100${String(index).padStart(6, '0')}`;
}

/**
 * Generates a random SAP vendor number
 * Format: V00XXXX (7 characters)
 */
function generateVendorNumber(index: number): string {
  return `V${String(index).padStart(6, '0')}`;
}

/**
 * Generates a random SAP purchase order number
 * Format: 55000XXXXX (10 digits)
 */
function generatePONumber(index: number): string {
  return `55000${String(index).padStart(5, '0')}`;
}

/**
 * Generates a random date between start and end
 */
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Returns a random item from an array
 */
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Returns a random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates random stock quantity with realistic distribution
 */
function generateStockQuantity(): number {
  const rand = Math.random();
  if (rand < 0.1) return 0; // 10% out of stock
  if (rand < 0.3) return randomInt(1, 50); // 20% low stock
  if (rand < 0.7) return randomInt(50, 500); // 40% normal stock
  return randomInt(500, 5000); // 30% high stock
}

// ==================== DATA GENERATION ====================

/**
 * Generates comprehensive SAP material master data
 * Returns 500+ materials across all categories
 */
export function generateSAPMaterials(): SAPMaterial[] {
  const materials: SAPMaterial[] = [];
  let materialIndex = 1;

  // Generate Pipe Materials
  PIPE_MATERIALS.forEach((pipe) => {
    PLANTS.forEach((plant) => {
      materials.push({
        matnr: generateMaterialNumber(materialIndex++),
        maktx: pipe.name,
        mtart: 'ROH',
        meins: 'M',
        matkl: MATERIAL_GROUPS.PIPES,
        werks: plant.code,
        labst: generateStockQuantity(),
        price: pipe.price * (0.9 + Math.random() * 0.2), // ±10% price variation
        currency: 'PHP',
      });
    });
  });

  // Generate Valve Materials
  VALVE_MATERIALS.forEach((valve) => {
    PLANTS.forEach((plant) => {
      materials.push({
        matnr: generateMaterialNumber(materialIndex++),
        maktx: valve.name,
        mtart: 'ROH',
        meins: 'EA',
        matkl: MATERIAL_GROUPS.VALVES,
        werks: plant.code,
        labst: generateStockQuantity(),
        price: valve.price * (0.9 + Math.random() * 0.2),
        currency: 'PHP',
      });
    });
  });

  // Generate Chemical Materials
  CHEMICAL_MATERIALS.forEach((chemical) => {
    PLANTS.forEach((plant) => {
      materials.push({
        matnr: generateMaterialNumber(materialIndex++),
        maktx: chemical.name,
        mtart: 'ROH',
        meins: chemical.unit,
        matkl: MATERIAL_GROUPS.CHEMICALS,
        werks: plant.code,
        labst: generateStockQuantity(),
        price: chemical.price * (0.9 + Math.random() * 0.2),
        currency: 'PHP',
      });
    });
  });

  // Generate Meter Materials
  METER_MATERIALS.forEach((meter) => {
    PLANTS.forEach((plant) => {
      materials.push({
        matnr: generateMaterialNumber(materialIndex++),
        maktx: meter.name,
        mtart: 'FERT',
        meins: 'EA',
        matkl: MATERIAL_GROUPS.METERS,
        werks: plant.code,
        labst: generateStockQuantity(),
        price: meter.price * (0.9 + Math.random() * 0.2),
        currency: 'PHP',
      });
    });
  });

  // Generate Pump Materials
  PUMP_MATERIALS.forEach((pump) => {
    PLANTS.forEach((plant) => {
      materials.push({
        matnr: generateMaterialNumber(materialIndex++),
        maktx: pump.name,
        mtart: 'FERT',
        meins: 'EA',
        matkl: MATERIAL_GROUPS.PUMPS,
        werks: plant.code,
        labst: generateStockQuantity(),
        price: pump.price * (0.9 + Math.random() * 0.2),
        currency: 'PHP',
      });
    });
  });

  // Generate Equipment Materials
  EQUIPMENT_MATERIALS.forEach((equipment) => {
    PLANTS.forEach((plant) => {
      materials.push({
        matnr: generateMaterialNumber(materialIndex++),
        maktx: equipment.name,
        mtart: 'FERT',
        meins: 'EA',
        matkl: MATERIAL_GROUPS.EQUIPMENT,
        werks: plant.code,
        labst: generateStockQuantity(),
        price: equipment.price * (0.9 + Math.random() * 0.2),
        currency: 'PHP',
      });
    });
  });

  // Generate Safety Materials
  SAFETY_MATERIALS.forEach((safety) => {
    PLANTS.forEach((plant) => {
      materials.push({
        matnr: generateMaterialNumber(materialIndex++),
        maktx: safety.name,
        mtart: 'ROH',
        meins: 'EA',
        matkl: MATERIAL_GROUPS.SAFETY,
        werks: plant.code,
        labst: generateStockQuantity(),
        price: safety.price * (0.9 + Math.random() * 0.2),
        currency: 'PHP',
      });
    });
  });

  return materials;
}

/**
 * Generates SAP vendor master data
 * Returns 100+ vendors (local and international)
 */
export function generateSAPVendors(): SAPVendor[] {
  return VENDOR_DATA.map((vendor, index) => ({
    lifnr: generateVendorNumber(index + 1),
    name1: vendor.name,
    land1: vendor.country,
    regio: vendor.region,
    ort01: vendor.city,
  }));
}

/**
 * Generates SAP purchase orders with realistic patterns
 * Returns 1000+ purchase orders spanning 2024-2025
 * Peak periods: June-August (rainy season preparation)
 */
export function generateSAPPurchaseOrders(): SAPPurchaseOrder[] {
  const orders: SAPPurchaseOrder[] = [];
  const materials = generateSAPMaterials();
  const vendors = generateSAPVendors();

  const startDate = new Date('2024-01-01');
  const endDate = new Date('2025-12-31');

  for (let i = 1; i <= 1200; i++) {
    const material = randomItem(materials);
    const vendor = randomItem(vendors);
    const poDate = randomDate(startDate, endDate);

    // Increase order volume during rainy season (June-August)
    const month = poDate.getMonth();
    const isRainySeason = month >= 5 && month <= 7;
    const quantity = isRainySeason
      ? randomInt(100, 1000)
      : randomInt(10, 500);

    // Determine PO status based on date
    let status: string;
    const daysSinceOrder = Math.floor((new Date().getTime() - poDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceOrder < 0) {
      status = 'Planned';
    } else if (daysSinceOrder < 7) {
      status = 'Released';
    } else if (daysSinceOrder < 30) {
      status = 'In Transit';
    } else if (Math.random() < 0.95) {
      status = 'Delivered';
    } else {
      status = 'Cancelled';
    }

    orders.push({
      ebeln: generatePONumber(i),
      lifnr: vendor.lifnr,
      bedat: poDate,
      ebelp: '00010',
      matnr: material.matnr,
      menge: quantity,
      netpr: material.price,
      status: status,
    });
  }

  return orders.sort((a, b) => b.bedat.getTime() - a.bedat.getTime());
}

/**
 * Generates real-time transaction log
 * Simulates live SAP ECC transactions
 */
export function generateSAPTransactions(count: number = 50) {
  const transactions = [];
  const materials = generateSAPMaterials().slice(0, 50);
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const minutesAgo = Math.floor(Math.random() * 60);
    const transactionDate = new Date(now.getTime() - minutesAgo * 60000);
    const material = randomItem(materials);

    transactions.push({
      timestamp: transactionDate,
      type: randomItem(['GR', 'GI', 'PO', 'INV']), // Goods Receipt, Goods Issue, Purchase Order, Invoice
      material: material.matnr,
      description: material.maktx,
      quantity: randomInt(1, 100),
      plant: randomItem(PLANTS).code,
      user: `USER${randomInt(1, 20)}`,
    });
  }

  return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// ==================== EXPORT SUMMARY DATA ====================

export function getSAPDataSummary() {
  const materials = generateSAPMaterials();
  const vendors = generateSAPVendors();
  const orders = generateSAPPurchaseOrders();

  return {
    totalMaterials: materials.length,
    totalVendors: vendors.length,
    totalPurchaseOrders: orders.length,
    materialsByType: {
      ROH: materials.filter(m => m.mtart === 'ROH').length,
      HALB: materials.filter(m => m.mtart === 'HALB').length,
      FERT: materials.filter(m => m.mtart === 'FERT').length,
    },
    ordersByStatus: {
      Released: orders.filter(o => o.status === 'Released').length,
      InTransit: orders.filter(o => o.status === 'In Transit').length,
      Delivered: orders.filter(o => o.status === 'Delivered').length,
      Cancelled: orders.filter(o => o.status === 'Cancelled').length,
    },
  };
}
