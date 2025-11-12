# Claude Code Prompts: SAP ECC to Excel Pipeline Dashboard for MWCI

## Project Context
Company: MWCI (Manila Water Company Inc.)
Objective: Build a comprehensive React dashboard that visualizes the complete data flow from SAP ECC through SQL Server, SSIS, SSAS, to Excel reporting with real-time monitoring of RTO/RPO metrics.

---

## PROMPT 1: Project Setup and Architecture

Create a new React project with the following specifications:

**Project Name:** mwci-data-pipeline-dashboard

**Tech Stack:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Recharts for data visualizations
- Framer Motion for animations
- Lucide React for icons
- React Flow for pipeline visualization

**Project Structure:**
```
src/
├── components/
│   ├── pipeline/
│   │   ├── SAPECCNode.tsx
│   │   ├── ReplicationLayer.tsx
│   │   ├── SQLServerNode.tsx
│   │   ├── SSISNode.tsx
│   │   ├── SSASNode.tsx
│   │   ├── ExcelNode.tsx
│   │   └── PipelineFlow.tsx
│   ├── monitoring/
│   │   ├── RTOMonitor.tsx
│   │   ├── RPOMonitor.tsx
│   │   └── BackupStatus.tsx
│   ├── data/
│   │   ├── SAPDataViewer.tsx
│   │   ├── SQLQueryViewer.tsx
│   │   ├── SSISTransformViewer.tsx
│   │   ├── CubeViewer.tsx
│   │   └── PivotTableViewer.tsx
│   └── layout/
│       ├── Dashboard.tsx
│       ├── Header.tsx
│       └── Sidebar.tsx
├── data/
│   ├── sapEccDummyData.ts
│   ├── sqlServerData.ts
│   ├── ssisTransformations.ts
│   ├── ssasCubeData.ts
│   └── excelPivotData.ts
├── types/
│   └── index.ts
└── utils/
    ├── dataGenerators.ts
    └── pipelineHelpers.ts
```

**Key Requirements:**
1. Set up responsive layout with dark mode support
2. Create type definitions for all data structures
3. Initialize basic routing if needed
4. Set up proper folder structure as outlined above

Create the initial project with all dependencies installed and basic structure ready.

---

## PROMPT 2: Create Comprehensive SAP ECC Dummy Data

Create a realistic dummy data generator that mimics SAP ECC (Enterprise Central Component) structure for a water utility company (MWCI).

**Requirements:**

**1. Core SAP ECC Tables to Simulate:**
- MARA (Material Master)
- MARC (Plant Data for Material)
- EKKO (Purchasing Document Header)
- EKPO (Purchasing Document Item)
- EBAN (Purchase Requisition)
- MSEG (Material Document Segment)
- MKPF (Material Document Header)
- RBKP (Vendor Invoice Header)
- LFA1 (Vendor Master)
- T001 (Company Codes)
- T001W (Plants/Warehouses)

**2. Data Characteristics:**
- Generate at least 500 material records (pipes, valves, chemicals, meters, equipment)
- 100+ vendors (local and international suppliers)
- 1000+ purchase orders spanning 2024-2025
- Transaction data with realistic timestamps
- Multiple plants: North Manila, South Manila, East Manila, Rizal
- Material types: ROH (Raw materials), HALB (Semi-finished), FERT (Finished products)

**3. Realistic Water Utility Data:**
- Water meters (different models and sizes)
- PVC pipes (various diameters: 50mm-500mm)
- Valves (gate, check, butterfly)
- Chemicals (chlorine, lime, coagulants)
- Pumps and motors
- Testing equipment
- Safety equipment

**4. Create the following in `data/sapEccDummyData.ts`:**
```typescript
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

// Generate functions
export const generateSAPMaterials = (): SAPMaterial[];
export const generateSAPPurchaseOrders = (): SAPPurchaseOrder[];
export const generateSAPVendors = (): SAPVendor[];
export const generateSAPTransactions = (): any[]; // Real-time transaction log
```

**5. Add realistic business logic:**
- Peak purchasing periods (June-August for rainy season prep)
- Emergency orders flagged
- Vendor performance ratings
- Stock levels with min/max thresholds
- Price variations over time

Include comprehensive JSDoc comments explaining each field and its purpose in the SAP ECC context.

---

## PROMPT 3: Build Replication Visualization with RTO/RPO Monitoring

Create an animated, real-time visualization of data replication from SAP ECC to SQL Server with RTO/RPO monitoring.

**Component: `ReplicationLayer.tsx`**

**Requirements:**

**1. Visual Representation:**
- Animated data packets flowing from SAP ECC to SQL Server
- Show replication lag in milliseconds
- Display data volume being transferred
- Color-coded status: Green (healthy), Yellow (warning), Red (critical)
- Particle effects for active replication

**2. RTO (Recovery Time Objective) Monitor:**
- Target RTO: 4 hours
- Current RTO capability display
- Historical RTO achievement chart (last 30 days)
- RTO breach alerts
- Show: "Last successful recovery test: X days ago"

**3. RPO (Recovery Point Objective) Monitor:**
- Target RPO: 15 minutes
- Current RPO: Real-time lag display
- Data loss window indicator
- Transaction commit timestamp vs backup timestamp
- Show: "Last transaction replicated: X seconds ago"

**4. Backup Status Dashboard:**
```typescript
interface BackupStatus {
  type: 'Full' | 'Differential' | 'Transaction Log';
  lastBackup: Date;
  nextScheduled: Date;
  size: string;
  duration: string;
  status: 'Success' | 'Running' | 'Failed';
  location: string;
}
```

**5. Replication Metrics:**
- Transactions/second
- Replication latency graph (line chart)
- Data volume transferred (MB/GB per hour)
- Queue depth
- Failed replication attempts
- Network throughput

**6. Interactive Features:**
- Click on replication stream to see detailed transaction
- Pause/Resume replication simulation
- Trigger manual backup simulation
- View replication error logs

**7. Animations:**
- Use Framer Motion for smooth transitions
- Pulsing indicators for active replication
- Loading skeleton states
- Count-up animations for metrics

Make this component visually stunning with gradients, shadows, and professional styling. Add tooltips explaining RTO/RPO concepts for stakeholders.

---

## PROMPT 4: SQL Server Database Simulation with MySQL Viewer

Create a comprehensive SQL Server database viewer that shows the replicated data with query capabilities.

**Component: `SQLServerNode.tsx` and `SQLQueryViewer.tsx`**

**Requirements:**

**1. Database Structure Visualization:**
- Show all replicated tables from SAP ECC
- Display table schemas with column names, data types, and indexes
- Row counts per table (updating in real-time)
- Database size metrics
- Connection status indicator

**2. Simulated Tables in SQL Server:**
```typescript
// Create these tables with dummy data
const sqlServerTables = [
  'dbo.SAP_Materials',
  'dbo.SAP_PurchaseOrders', 
  'dbo.SAP_Vendors',
  'dbo.SAP_Inventory',
  'dbo.SAP_Transactions',
  'dbo.SAP_MaterialMovements',
  'dbo.SAP_Invoices',
  'dbo.SAP_Plants'
];
```

**3. MySQL Viewer Interface:**
- Monaco Editor or CodeMirror for SQL query input
- Syntax highlighting for T-SQL
- Pre-built query templates:
  - "Show all purchase orders this month"
  - "List top 10 suppliers by spend"
  - "View inventory levels below minimum"
  - "Show pending invoices"
  - "Material consumption analysis"

**4. Query Results Display:**
- Tabular data grid with:
  - Sortable columns
  - Filterable columns
  - Exportable to CSV
  - Pagination for large results
  - Row highlighting
- Show query execution time
- Display number of rows returned
- Show execution plan (simplified visualization)

**5. Sample Queries to Include:**
```sql
-- Top Suppliers by Purchase Volume
SELECT v.name1, COUNT(po.ebeln) as order_count, 
       SUM(po.netpr * po.menge) as total_spend
FROM dbo.SAP_PurchaseOrders po
JOIN dbo.SAP_Vendors v ON po.lifnr = v.lifnr
GROUP BY v.name1
ORDER BY total_spend DESC;

-- Low Stock Alert
SELECT m.maktx, m.labst, m.werks
FROM dbo.SAP_Materials m
WHERE m.labst < 100
ORDER BY m.labst;

-- Monthly Purchase Trend
SELECT DATE_TRUNC('month', po.bedat) as month,
       COUNT(*) as po_count,
       SUM(po.netpr * po.menge) as total_value
FROM dbo.SAP_PurchaseOrders po
GROUP BY DATE_TRUNC('month', po.bedat)
ORDER BY month DESC;
```

**6. Database Metrics Dashboard:**
- CPU usage graph
- Memory utilization
- Active connections
- Query performance stats (avg duration, slowest queries)
- Table sizes and growth trends
- Index usage statistics

**7. Visual Enhancements:**
- Schema diagram showing table relationships
- Entity-relationship diagram (ERD)
- Data flow indicators
- Real-time query activity log
- Beautiful syntax highlighting with dark theme

Add comprehensive error handling and loading states. Include educational tooltips explaining SQL Server concepts.

---

## PROMPT 5: SSIS ETL Process Visualization

Create an interactive visualization of SSIS (SQL Server Integration Services) ETL operations showing data transformation flow.

**Component: `SSISNode.tsx` and `SSISTransformViewer.tsx`**

**Requirements:**

**1. SSIS Package Visualization:**
Create a visual representation of SSIS packages using React Flow or custom SVG:

```typescript
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

interface Transformation {
  type: 'DataConversion' | 'DerivedColumn' | 'Lookup' | 
        'Aggregate' | 'Sort' | 'Merge' | 'ConditionalSplit';
  name: string;
  inputColumns: string[];
  outputColumns: string[];
  logic: string;
}
```

**2. Sample SSIS Packages to Visualize:**

**Package 1: "Material Master ETL"**
- Extract from: dbo.SAP_Materials
- Transformations:
  - Data Conversion: Convert SAP date formats to SQL datetime
  - Derived Column: Calculate reorder points (min stock + lead time demand)
  - Lookup: Enrich with material group descriptions
  - Conditional Split: Separate active vs obsolete materials
- Load to: dbo.DW_Materials (data warehouse)

**Package 2: "Purchase Order Analysis ETL"**
- Extract from: dbo.SAP_PurchaseOrders, dbo.SAP_Vendors
- Transformations:
  - Merge: Join PO with vendor data
  - Aggregate: Calculate monthly spend by supplier
  - Derived Column: Calculate PO aging (days since creation)
  - Sort: Order by PO date descending
- Load to: dbo.DW_PurchaseAnalysis

**Package 3: "Inventory Movement ETL"**
- Extract from: dbo.SAP_MaterialMovements, dbo.SAP_Plants
- Transformations:
  - Lookup: Add plant descriptions
  - Aggregate: Sum movements by material and plant
  - Derived Column: Calculate stock velocity
  - Data Conversion: Standardize measurement units
- Load to: dbo.DW_InventoryFacts

**3. Visual Flow Diagram:**
- Source node (SQL Server icon)
- Transformation boxes with icons:
  - 🔄 for data conversion
  - 🧮 for derived columns
  - 🔍 for lookups
  - 📊 for aggregations
  - ↕️ for sorting
  - 🔀 for conditional splits
- Destination node (Data Warehouse icon)
- Animated data flow lines
- Row count indicators on each connection

**4. Transformation Details Panel:**
When clicking on a transformation, show:
- Transformation type and purpose
- Input schema
- Transformation logic (pseudo-code or actual formula)
- Output schema
- Sample input/output data comparison (before/after)
- Performance metrics (rows/second)

**5. SSIS Execution Monitor:**
```typescript
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
  progress: number; // 0-100
  messages: SSISMessage[];
}
```

**6. Real-time Execution Dashboard:**
- Progress bars for running packages
- Throughput metrics (rows/second)
- Error log viewer
- Data quality checks results
- Transformation statistics
- Memory and CPU usage per package

**7. Sample Transformation Logic to Display:**

```sql
-- Derived Column: Calculate Reorder Point
Reorder_Point = (Min_Stock_Level) + (Avg_Daily_Usage * Lead_Time_Days)

-- Conditional Split: Material Classification
CASE 
  WHEN Stock_Value > 1000000 THEN 'A-Class'
  WHEN Stock_Value > 100000 THEN 'B-Class'
  ELSE 'C-Class'
END

-- Lookup: Vendor Performance Score
SELECT vendor_score FROM dbo.VendorMetrics 
WHERE vendor_id = ?
```

**8. Interactive Features:**
- Play/Pause package execution animation
- Step through transformations one by one
- View detailed logs
- Compare input vs output data side-by-side
- Export transformation documentation

Make the SSIS visualization intuitive for non-technical stakeholders while maintaining technical accuracy. Use color coding for different transformation types and animated data flows.

---

## PROMPT 6: SSAS Cube Structure and DAX Visualization

Create a comprehensive visualization of the SSAS (SQL Server Analysis Services) cube with dimensional model and DAX calculations.

**Component: `SSASNode.tsx` and `CubeViewer.tsx`**

**Requirements:**

**1. Cube Architecture Visualization:**

Create a 3D-inspired cube visualization showing:

```typescript
interface SSASCube {
  cubeName: string;
  dimensions: Dimension[];
  measureGroups: MeasureGroup[];
  calculations: DAXCalculation[];
  partitions: Partition[];
  lastProcessed: Date;
  status: 'Processed' | 'Processing' | 'Unprocessed';
}

interface Dimension {
  name: string;
  attributes: Attribute[];
  hierarchies: Hierarchy[];
  type: 'Time' | 'Geography' | 'Product' | 'Supplier' | 'Regular';
}

interface MeasureGroup {
  name: string;
  measures: Measure[];
  factTable: string;
  aggregationType: 'Sum' | 'Count' | 'Avg' | 'Min' | 'Max';
}
```

**2. Define the MWCI Purchase Analysis Cube:**

**Dimensions:**

**Time Dimension:**
- Hierarchy: Year → Quarter → Month → Week → Day
- Attributes: Year, Quarter, Month, MonthName, Week, Day, DayOfWeek, IsWeekend, FiscalYear
- Members: 2024-2025 with full calendar

**Supplier Dimension:**
- Hierarchy: Country → Region → City → Supplier
- Attributes: SupplierID, SupplierName, SupplierType, Country, Rating, PaymentTerms
- Members: 100+ suppliers across Philippines, Singapore, China, Japan, USA

**Material Dimension:**
- Hierarchy: MaterialGroup → MaterialType → Material
- Attributes: MaterialID, MaterialName, Category, UnitOfMeasure, MaterialGroup
- Members: Pipes → PVC Pipes → 100mm PVC Pipe

**Plant Dimension:**
- Attributes: PlantID, PlantName, Region, Capacity, Manager
- Members: North Manila, South Manila, East Manila, Rizal plants

**Region Dimension:**
- Hierarchy: Country → Area → Plant
- Members: Metro Manila areas

**3. Measures (Fact Table):**

```typescript
const measures = [
  {
    name: 'Total Purchase Amount',
    formula: 'SUM(PurchaseAmount)',
    format: 'Currency',
    aggregation: 'Sum'
  },
  {
    name: 'Order Count',
    formula: 'COUNT(OrderID)',
    format: 'Number',
    aggregation: 'Count'
  },
  {
    name: 'Average Order Value',
    formula: 'DIVIDE(SUM(PurchaseAmount), COUNT(OrderID))',
    format: 'Currency',
    aggregation: 'Calculated'
  },
  {
    name: 'Quantity Ordered',
    formula: 'SUM(Quantity)',
    format: 'Number',
    aggregation: 'Sum'
  }
];
```

**4. DAX Calculations to Display:**

```dax
-- Year over Year Growth
YoY_Growth = 
VAR CurrentYear = SUM(Fact[PurchaseAmount])
VAR PreviousYear = CALCULATE(
    SUM(Fact[PurchaseAmount]),
    DATEADD(Dim_Time[Date], -1, YEAR)
)
RETURN DIVIDE(CurrentYear - PreviousYear, PreviousYear)

-- Top 10 Suppliers by Spend
Top_10_Suppliers = 
CALCULATE(
    SUM(Fact[PurchaseAmount]),
    TOPN(10, ALL(Dim_Supplier), [Total Purchase Amount], DESC)
)

-- Running Total
Running_Total = 
CALCULATE(
    SUM(Fact[PurchaseAmount]),
    FILTER(
        ALL(Dim_Time[Date]),
        Dim_Time[Date] <= MAX(Dim_Time[Date])
    )
)

-- Supplier Concentration (Pareto)
Supplier_Concentration = 
VAR TotalSpend = CALCULATE(SUM(Fact[PurchaseAmount]), ALL(Dim_Supplier))
VAR CurrentSpend = SUM(Fact[PurchaseAmount])
RETURN DIVIDE(CurrentSpend, TotalSpend)

-- Stock Coverage Days
Stock_Coverage_Days = 
DIVIDE(
    SUM(Inventory[CurrentStock]),
    AVERAGEX(
        DATESINPERIOD(Dim_Time[Date], MAX(Dim_Time[Date]), -30, DAY),
        [Daily_Consumption]
    )
)
```

**5. Cube Browser Interface:**

Create an interactive MDX/DAX query browser:
- Drag-and-drop dimension members to rows/columns
- Select measures to display
- Apply filters (slicers)
- Show resulting data in pivot-style table
- Display generated MDX query
- Show query execution statistics

**6. Dimensional Hierarchy Visualizer:**

Visual tree representation:
```
📅 Time
  └─ 2025
      ├─ Q1
      │   ├─ January
      │   │   └─ Week 1-4
      │   ├─ February
      │   └─ March
      └─ Q2...

🏢 Supplier
  └─ Philippines
      ├─ Metro Manila
      │   ├─ Makati
      │   │   └─ ABC Supplies Inc.
      │   └─ Quezon City
      └─ Calabarzon...
```

**7. Cube Metrics Dashboard:**
- Cube size (MB/GB)
- Dimension cardinality (number of members)
- Aggregation count
- Processing time history
- Query performance stats
- Most frequently used dimensions
- Calculation complexity score

**8. Sample Analytical Queries:**

Show pre-built analytical scenarios:
- "Which suppliers account for 80% of spend?" (Pareto analysis)
- "Seasonal purchasing patterns by material type"
- "Plant-wise procurement efficiency"
- "Lead time analysis by supplier region"
- "Price variance trends over time"

**9. Interactive Features:**
- 3D cube rotation animation
- Click dimensions to drill down
- Highlight measure relationships
- Show aggregation paths
- Display calculation dependencies
- Export cube metadata

**10. Educational Tooltips:**
- Explain what SSAS does
- Differentiate between dimensions and measures
- Explain DAX vs MDX
- Star schema vs Snowflake schema diagram
- OLAP vs OLTP comparison

Use beautiful gradients, glassmorphism effects, and smooth animations. Make the cube feel interactive and three-dimensional even in 2D visualization.

---

## PROMPT 7: Excel Pivot Table Simulation

Create a realistic Excel-like interface showing how business users consume the SSAS cube data through pivot tables.

**Component: `ExcelNode.tsx` and `PivotTableViewer.tsx`**

**Requirements:**

**1. Excel Interface Design:**
- Replicate Excel's look and feel with ribbon interface
- Grid layout with column letters (A, B, C...) and row numbers
- Formula bar
- Sheet tabs at bottom
- Excel-green color scheme accents

**2. Pivot Table Builder:**

```typescript
interface PivotTableConfig {
  name: string;
  dataSource: 'SSAS Cube - Purchase Analysis';
  rows: string[]; // Dimension fields
  columns: string[]; // Dimension fields
  values: ValueField[]; // Measures
  filters: FilterField[]; // Slicers
}

interface ValueField {
  field: string;
  aggregation: 'Sum' | 'Average' | 'Count' | 'Min' | 'Max';
  format: 'Currency' | 'Number' | 'Percentage';
  showAs?: 'Value' | '% of Total' | '% of Column' | 'Running Total';
}
```

**3. Sample Pivot Tables to Build:**

**Pivot Table 1: "Supplier Spend Analysis"**
- Rows: Supplier Name
- Columns: Month (Jan, Feb, Mar...)
- Values: Total Purchase Amount (Sum)
- Filters: Material Group, Region
- Show: Conditional formatting (heatmap)
- Include: Subtotals and Grand Total

**Pivot Table 2: "Material Purchase by Time"**
- Rows: Material Group → Material Type → Material Name
- Columns: Quarter → Month
- Values: 
  - Quantity Ordered (Sum)
  - Total Purchase Amount (Sum)
  - Average Price (Average)
- Filters: Plant, Supplier Rating

**Pivot Table 3: "Regional Procurement Dashboard"**
- Rows: Region → Plant
- Columns: Year → Quarter
- Values:
  - Order Count (Count)
  - Total Spend (Sum)
  - YoY Growth % (Calculated)
- Filters: Supplier Country

**4. Pivot Table Field List Panel:**
Create a draggable field list sidebar:
- "Choose fields to add to report"
- Sections:
  - 📋 Filters (drag here)
  - 📊 Columns (drag here)
  - 📁 Rows (drag here)
  - 🔢 Values (drag here)
- Available fields organized by dimension:
  - ⏰ Time Dimension
  - 🏢 Supplier Dimension
  - 📦 Material Dimension
  - 🏭 Plant Dimension
  - 📏 Measures

**5. Interactive Features:**
- Drag and drop fields between areas
- Right-click for field settings
- Expand/collapse row groups
- Sort by clicking column headers
- Double-click to drill through to detail
- Filter dropdown on each dimension
- Slicer panels for visual filtering

**6. Slicers (Visual Filters):**

Create visual slicer components:
```typescript
// Timeline Slicer for dates
<TimelineSlicer 
  dimension="Time"
  selectedRange={['2025-01', '2025-06']}
/>

// Button Slicer for categories
<ButtonSlicer
  dimension="Supplier Rating"
  options={['A', 'B', 'C', 'D']}
  multiSelect={true}
/>

// Dropdown Slicer
<DropdownSlicer
  dimension="Material Group"
  options={materialGroups}
/>
```

**7. Conditional Formatting:**
- Color scales (red to green)
- Data bars in cells
- Icon sets (arrows, traffic lights)
- Top 10 highlighting
- Above/below average formatting

**8. Charts Connected to Pivot:**
Display these charts that update with pivot selections:
- Column chart: Monthly spend trend
- Pie chart: Spend by supplier (top 10)
- Line chart: YoY comparison
- Waterfall chart: Variance analysis
- Combo chart: Quantity vs Amount

**9. Pivot Table Calculations:**

Show calculated fields/items:
```excel
// Calculated Field: Spend per Order
= 'Total Purchase Amount' / 'Order Count'

// Calculated Field: Above Average
= IF('Total Purchase Amount' > AVERAGE('Total Purchase Amount'), "Yes", "No")

// Show Values As
- % of Parent Row Total
- % of Grand Total
- Difference from Previous Month
- Running Total in Month
```

**10. Sample Data in Pivot:**

Generate realistic pivot table output:
```
                    Jan 2025    Feb 2025    Mar 2025    Grand Total
ABC Supplies Inc.   ₱2,450,000  ₱1,890,000  ₱3,120,000  ₱7,460,000
XYZ Corporation     ₱1,780,000  ₱2,340,000  ₱1,950,000  ₱6,070,000
Global Parts Ltd.   ₱980,000    ₱1,450,000  ₱2,100,000  ₱4,530,000
...
Grand Total         ₱45,780,000 ₱52,340,000 ₱48,920,000 ₱147,040,000
```

**11. Export Options:**
- Export to PDF
- Export to CSV
- Copy formatted table
- Email as Excel file
- Publish to SharePoint

**12. Refresh Data Button:**
Show animation of data refreshing from cube:
- "Connecting to SSAS cube..."
- "Retrieving data..."
- "Applying filters..."
- "Rendering pivot table..."
- "Done! Last refreshed: [timestamp]"

**13. Performance Indicators:**
- Query execution time
- Rows retrieved
- Data freshness indicator
- Cache status

Make the Excel interface feel authentic with proper grid styling, hover effects, and Excel-style tooltips. Add keyboard shortcuts display (Ctrl+C, Ctrl+V, etc.).

---

## PROMPT 8: Main Dashboard Integration

Create the main dashboard that brings all components together into a cohesive, stunning visualization.

**Component: `Dashboard.tsx`**

**Requirements:**

**1. Dashboard Layout:**

Create a professional layout with these sections:

```
┌─────────────────────────────────────────────────────┐
│  Header: MWCI Data Pipeline - Real-time Monitoring  │
├──────────────┬──────────────────────────────────────┤
│   Sidebar    │                                       │
│   - Overview │   Main Content Area                  │
│   - Pipeline │   (Dynamic based on selection)       │
│   - Monitor  │                                       │
│   - Data     │                                       │
│   - Reports  │                                       │
│              │                                       │
└──────────────┴──────────────────────────────────────┘
```

**2. Pipeline Overview (Default View):**

Create a horizontal flow diagram:
```
[SAP ECC] ──→ [Replication] ──→ [SQL Server] ──→ [SSIS] ──→ [SSAS] ──→ [Excel]
```

Each node shows:
- Component name and icon
- Status indicator (green/yellow/red)
- Key metric (e.g., "2.3M records" for SAP ECC)
- Last updated timestamp
- Click to expand details

**3. Real-time Metrics Banner:**

Top banner showing live metrics:
```typescript
<MetricsBanner>
  <Metric 
    label="Replication Lag" 
    value="3.2s" 
    status="good"
    icon={<Clock />}
  />
  <Metric 
    label="RPO Status" 
    value="Within target" 
    status="good"
    icon={<Shield />}
  />
  <Metric 
    label="RTO Capability" 
    value="2.5 hrs" 
    status="good"
    icon={<Timer />}
  />
  <Metric 
    label="SSIS Packages Running" 
    value="3/12" 
    status="good"
    icon={<Workflow />}
  />
  <Metric 
    label="Cube Last Processed" 
    value="5 min ago" 
    status="good"
    icon={<Cube />}
  />
  <Metric 
    label="Active Excel Users" 
    value="47" 
    status="good"
    icon={<Users />}
  />
</MetricsBanner>
```

**4. Interactive Pipeline Flow:**

Use React Flow to create interactive pipeline:
- Nodes for each component
- Animated edges showing data flow
- Click node to open detailed view
- Real-time data volume indicators on edges
- Health status colors on nodes
- Mini charts on nodes showing trends

**5. Component Detail Panels:**

Sliding drawer from the right when clicking a node:
- Full component visualization
- Detailed metrics
- Configuration info
- Recent activity log
- Quick actions (refresh, configure, export)

**6. Navigation Sidebar:**

**Overview Tab:**
- Executive summary dashboard
- Key metrics cards
- Recent alerts
- System health score

**Pipeline Tab:**
- Full pipeline visualization
- Component dependency graph
- Data lineage diagram

**Monitor Tab:**
- RTO/RPO monitoring
- Backup status
- Replication metrics
- Performance graphs
- Alert history

**Data Tab:**
- SAP ECC data viewer
- SQL Server query interface
- SSIS transformation logs
- Cube browser
- Data quality dashboard

**Reports Tab:**
- Pivot table examples
- Pre-built reports
- Analytics dashboards
- Export options

**7. Executive Dashboard View:**

Create a high-level summary for executives:

```typescript
<ExecutiveDashboard>
  {/* KPI Cards */}
  <KPICard title="Daily Purchase Orders" value="234" trend="+12%" />
  <KPICard title="Total Spend (MTD)" value="₱45.2M" trend="+8%" />
  <KPICard title="Active Suppliers" value="87" trend="-2" />
  <KPICard title="Stock Availability" value="94.5%" trend="+1.2%" />
  
  {/* Charts */}
  <Chart title="Monthly Purchase Trend" type="line" />
  <Chart title="Top 10 Suppliers" type="bar" />
  <Chart title="Spend by Category" type="donut" />
  <Chart title="Regional Distribution" type="map" />
  
  {/* System Health */}
  <SystemHealthCard 
    overallScore={96}
    components={[
      { name: 'SAP ECC', status: 'Healthy' },
      { name: 'Replication', status: 'Healthy' },
      { name: 'SQL Server', status: 'Warning' },
      { name: 'SSIS', status: 'Healthy' },
      { name: 'SSAS', status: 'Healthy' },
      { name: 'Excel Services', status: 'Healthy' }
    ]}
  />
</ExecutiveDashboard>
```

**8. Technical Dashboard View:**

For IT teams:
- Server resource utilization
- Query performance metrics
- ETL job statuses
- Error logs viewer
- Database connections monitor
- Cache hit ratios
- Network throughput

**9. Data Lineage Visualization:**

Show data journey from source to report:
```
Material "PVC Pipe 100mm" in SAP ECC (MARA table)
  ↓ Replicated at 10:45:23
SQL Server (dbo.SAP_Materials)
  ↓ Transformed by "Material Master ETL" at 11:00:00
Data Warehouse (dbo.DW_Materials)
  ↓ Processed into cube at 11:15:00
SSAS Cube (Material Dimension)
  ↓ Queried by pivot table at 11:30:15
Excel Report "Material Purchase Analysis"
```

**10. Alerts and Notifications Center:**

Dropdown panel showing:
```typescript
interface Alert {
  id: string;
  severity: 'Critical' | 'Warning' | 'Info';
  component: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  actions: Action[];
}

// Sample alerts
[
  {
    severity: 'Warning',
    component: 'SQL Server',
    message: 'Disk space below 20% on data drive',
    timestamp: new Date(),
    acknowledged: false
  },
  {
    severity: 'Info',
    component: 'SSIS',
    message: 'Package "Inventory ETL" completed successfully',
    timestamp: new Date(),
    acknowledged: true
  }
]
```

**11. Theme Toggle:**
- Light mode
- Dark mode
- Auto (system preference)
- Custom MWCI brand colors

**12. Header Components:**
- Company logo (MWCI)
- Dashboard title
- Environment indicator (PROD/TEST)
- User profile menu
- Notifications bell
- Settings gear
- Help button
- Time display with timezone

**13. Responsive Design:**
- Desktop: Full layout with sidebar
- Tablet: Collapsible sidebar
- Mobile: Bottom navigation, stacked components

**14. Loading States:**
- Skeleton loaders for all components
- Smooth transitions
- Progressive data loading
- Optimistic updates

**15. Error Handling:**
- Error boundaries
- Fallback UI
- Retry mechanisms
- User-friendly error messages

Make the dashboard feel premium with:
- Smooth animations (Framer Motion)
- Glass morphism effects
- Subtle shadows and gradients
- Professional color palette
- Consistent spacing and typography
- Accessibility features (ARIA labels, keyboard navigation)

---

## PROMPT 9: Add Interactivity and Real-time Simulation

Add dynamic, real-time simulation features to make the dashboard feel alive.

**Requirements:**

**1. Real-time Data Simulation:**

Create a simulation engine that updates data every few seconds:

```typescript
class PipelineSimulator {
  // Simulate SAP ECC transactions
  generateSAPTransaction(): Transaction {
    // Create random PO, material movement, or invoice
  }
  
  // Simulate replication lag
  updateReplicationMetrics(): ReplicationStatus {
    // Random lag between 1-10 seconds
    // Occasional spike to show variability
  }
  
  // Simulate SSIS package execution
  runSSISPackage(packageName: string): ExecutionStatus {
    // Progress from 0-100%
    // Random duration 30s - 3min
  }
  
  // Simulate cube processing
  processCube(): ProcessingStatus {
    // Incremental vs full processing
    // Update row counts
  }
  
  // Simulate Excel refreshes
  refreshExcelReport(): RefreshStatus {
    // User initiated refresh
    // Show query execution
  }
}
```

**2. Animated Data Flow:**

Create flowing particles/dots along pipeline edges:
- Use Canvas or SVG for smooth animation
- Different colors for different data types:
  - Blue: Purchase orders
  - Green: Material movements
  - Yellow: Invoices
  - Purple: Master data
- Speed indicates volume
- Pulse effect on high activity

**3. Live Metrics Counters:**

Implement count-up animations for all metrics:
- Transaction count incrementing
- Data volume ticking up
- Order amounts accumulating
- Use smooth easing functions

**4. Time-series Charts:**

Add real-time updating charts:
- Replication lag line chart (last 5 minutes)
- Transactions per second bar chart
- SSIS throughput area chart
- Cube query performance scatter plot
- All charts scroll and update live

**5. Status Change Animations:**

Animate status transitions:
- Green → Yellow: Pulse effect
- Yellow → Red: Urgent pulsing + sound alert
- Red → Green: Celebration micro-interaction
- Show toast notifications for status changes

**6. Interactive Drill-downs:**

Enable users to click anywhere:
- Click on transaction → Show full detail modal
- Click on supplier → Show supplier profile
- Click on material → Show material master
- Click on chart point → Show data point detail
- Click on metric → Show historical trend

**7. Playback Controls:**

Add timeline scrubber:
```typescript
<PlaybackControls>
  <PlayButton /> // Play/Pause simulation
  <SpeedControl options={['0.5x', '1x', '2x', '5x']} />
  <TimelineSlider 
    min={startOfDay} 
    max={now} 
    value={currentTime}
  />
  <JumpToTime options={['9 AM', '12 PM', '3 PM', '6 PM']} />
</PlaybackControls>
```

**8. Scenario Simulation:**

Add scenario buttons:
- "Normal Operations" (baseline)
- "High Load" (peak hours)
- "Replication Failure" (simulate failure)
- "Backup Running" (heavy backup activity)
- "Cube Processing" (SSAS processing impact)
- "Network Issue" (increased latency)

**9. Event Log Viewer:**

Real-time scrolling log:
```
[10:45:23.456] SAP ECC: Purchase Order 5500012345 created by user PSMITH
[10:45:24.123] Replication: Transaction replicated in 2.3s
[10:45:26.789] SQL Server: Record inserted into dbo.SAP_PurchaseOrders
[10:45:30.012] SSIS: Package "PO Analysis ETL" triggered
[10:45:45.678] SSIS: Package completed successfully (1,234 rows processed)
[10:46:00.234] SSAS: Incremental processing started
[10:46:15.890] SSAS: 1,234 new records added to cube
[10:46:20.456] Excel: User JDOE@mwci.com.ph refreshed pivot table
```

**10. Comparative Views:**

Add comparison features:
- Compare Today vs Yesterday
- Compare This Month vs Last Month
- Compare Performance across Environments
- Show differences with color coding

**11. Predictive Indicators:**

Add ML-style predictions:
- "Based on current rate, backup will complete in 23 minutes"
- "Estimated cube processing time: 45 seconds"
- "RPO breach predicted in 8 minutes if lag continues"
- "Next SSIS package scheduled in 12 minutes"

**12. Health Score Algorithm:**

Calculate and display overall system health:
```typescript
function calculateHealthScore(): number {
  const weights = {
    replicationLag: 0.25,
    rpoCompliance: 0.20,
    rtoCapability: 0.15,
    ssisSuccessRate: 0.15,
    cubePerformance: 0.15,
    excelAvailability: 0.10
  };
  
  // Score each component 0-100
  // Weighted average
  // Return overall score
}
```

Show score prominently with radial progress indicator.

**13. Keyboard Shortcuts:**

Implement shortcuts:
- `Space`: Play/Pause
- `R`: Refresh all data
- `1-6`: Jump to component (SAP, Replication, SQL, SSIS, SSAS, Excel)
- `T`: Toggle theme
- `F`: Enter fullscreen
- `?`: Show help overlay

**14. Export and Share:**

Add export features:
- Export current dashboard as PDF
- Export metrics as CSV
- Copy shareable link with current state
- Schedule email reports
- Generate presentation slides

**15. Animations Library:**

Use these animation patterns consistently:
- Fade in/out for modal/drawer open/close
- Slide in from right for detail panels
- Scale up for metric value changes
- Ripple effect for button clicks
- Skeleton shimmer for loading
- Confetti for successful operations

**16. Sound Effects (Optional):**

Subtle audio feedback:
- Soft click on navigation
- Alert chime for warnings
- Success ding for completed jobs
- Ambient background sound for "data flowing"
- Mute toggle in settings

Make everything feel responsive and alive. Every interaction should have visual feedback. The dashboard should feel like monitoring a living system.

---

## PROMPT 10: Polish, Documentation, and Presentation Mode

Final touches to make the dashboard production-ready and presentation-worthy.

**Requirements:**

**1. Presentation Mode:**

Create a special mode for client demos:
```typescript
<PresentationMode>
  {/* Features */}
  - Auto-advance through pipeline steps every 10 seconds
  - Highlight current component with spotlight effect
  - Narration text overlay explaining each step
  - Hide technical details, show business value
  - Smooth camera-like transitions between views
  - Auto-generate insights commentary
  - Full-screen mode without UI clutter
</PresentationMode>
```

**2. Guided Tour:**

Implement an onboarding tour:
```typescript
const tourSteps = [
  {
    target: '#sap-ecc-node',
    title: 'SAP ECC Source System',
    content: 'MWCI\'s purchase data originates here with 2.3M+ records...',
    position: 'bottom'
  },
  {
    target: '#replication-layer',
    title: 'Real-time Replication',
    content: 'Data replicates continuously with RPO target of 15 minutes...',
    position: 'bottom'
  },
  // ... for each component
];
```

**3. Educational Overlays:**

Add info buttons with detailed explanations:
- "What is RPO?" → Modal with definition, formula, examples
- "How does SSAS work?" → Animated explainer
- "Why use SSIS?" → Benefits and alternatives
- "Understanding DAX" → Tutorial with examples

**4. Comparison Table:**

Add a comparison view:
```typescript
<ComparisonTable>
  <thead>
    <tr>
      <th>Component</th>
      <th>Purpose</th>
      <th>Technology</th>
      <th>Data Volume</th>
      <th>Latency</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>SAP ECC</td>
      <td>Source System</td>
      <td>SAP ABAP</td>
      <td>2.3M records</td>
      <td>Real-time</td>
    </tr>
    <tr>
      <td>SQL Server</td>
      <td>Replica DB</td>
      <td>Microsoft SQL</td>
      <td>2.3M records</td>
      <td>3-5 seconds</td>
    </tr>
    // ... etc
  </tbody>
</ComparisonTable>
```

**5. Architecture Diagram:**

Create a technical architecture view:
- Network diagram showing servers
- Technology stack logos
- Data flow with protocols
- Security layers
- Backup infrastructure
- Disaster recovery setup

**6. ROI Calculator:**

Add a business value section:
```typescript
<ROICalculator>
  <Input label="Manual report hours/week (before)" value={40} />
  <Input label="Automated report hours/week (after)" value={2} />
  <Input label="Average hourly cost" value={500} />
  
  <Output>
    <Metric label="Hours saved per week" value={38} />
    <Metric label="Cost savings per week" value="₱19,000" />
    <Metric label="Annual savings" value="₱988,000" />
    <Metric label="ROI" value="450%" />
  </Output>
</ROICalculator>
```

**7. Before/After Comparison:**

Show old vs new process:
```
BEFORE (Manual Process):
[SAP] → Export CSV → Email → Manual consolidation → Excel → Email report
Timeline: 2-3 days
Accuracy: 85%
Effort: 40 hours/week

AFTER (Automated Pipeline):
[SAP] → Replication → SQL → SSIS → SSAS → Excel
Timeline: Real-time
Accuracy: 99.9%
Effort: 2 hours/week
```

**8. Testimonials Section:**

Add user quotes:
```typescript
<Testimonials>
  <Quote 
    author="Maria Santos - Procurement Manager"
    text="The dashboard gives us real-time visibility into our purchasing operations. We can now make data-driven decisions within minutes instead of days."
    avatar="/avatars/maria.jpg"
  />
  <Quote 
    author="John Cruz - IT Director"
    text="The automated ETL pipeline reduced our manual reporting effort by 95% and improved data accuracy significantly."
    avatar="/avatars/john.jpg"
  />
</Testimonials>
```

**9. Help Documentation:**

Create comprehensive help:
- FAQ section
- Video tutorials (placeholder)
- Glossary of terms
- Troubleshooting guide
- Contact support form
- Feature request submission

**10. Settings Panel:**

Add customization options:
```typescript
<Settings>
  <Section title="Display">
    <Toggle label="Dark Mode" />
    <Toggle label="Animations" />
    <Toggle label="Sound Effects" />
    <Slider label="Animation Speed" min={0.5} max={2} />
  </Section>
  
  <Section title="Data">
    <Input label="Refresh Interval (seconds)" value={5} />
    <Toggle label="Real-time Updates" />
    <Select label="Date Range" options={['Today', 'Week', 'Month']} />
  </Section>
  
  <Section title="Notifications">
    <Toggle label="Desktop Notifications" />
    <Toggle label="Email Alerts" />
    <MultiSelect label="Alert Types" options={alertTypes} />
  </Section>
</Settings>
```

**11. Performance Optimization:**

Implement:
- Lazy loading for components
- Virtual scrolling for large tables
- Memoization for expensive calculations
- Web Workers for data processing
- Service Worker for offline capability
- Code splitting by route

**12. Accessibility Improvements:**

Ensure WCAG compliance:
- All images have alt text
- Proper ARIA labels
- Keyboard navigation for all features
- Screen reader friendly
- High contrast mode option
- Font size adjustment
- Focus indicators
- Skip navigation links

**13. Error Boundaries:**

Graceful error handling:
```typescript
<ErrorBoundary
  fallback={
    <ErrorState
      title="Oops! Something went wrong"
      message="The dashboard encountered an error. Please refresh or contact support."
      actions={[
        <Button onClick={reload}>Refresh Dashboard</Button>,
        <Button onClick={contactSupport}>Contact Support</Button>
      ]}
    />
  }
>
  {children}
</ErrorBoundary>
```

**14. Loading Performance:**

Optimize initial load:
- Show splash screen with company logo
- Progressive rendering
- Preload critical resources
- Compress assets
- Use CDN for libraries
- Implement caching strategy

**15. Print Stylesheet:**

Add print-friendly CSS:
- Remove navigation
- Simplify colors for B&W printing
- Page break optimization
- Include timestamp on print
- Compact layout

**16. Documentation Generation:**

Auto-generate docs:
```typescript
// Component documentation
<Documentation>
  <ComponentDoc name="SSASNode">
    <Description>
      Visualizes the SSAS cube structure with dimensions and measures
    </Description>
    <Props>
      <Prop name="cubeData" type="SSASCube" required />
      <Prop name="onDrilldown" type="function" />
    </Props>
    <Example>
      {/* Code example */}
    </Example>
  </ComponentDoc>
</Documentation>
```

**17. Deployment Checklist:**

Create pre-deployment checks:
- [ ] All API endpoints working
- [ ] All charts rendering correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)
- [ ] Performance audit passed (Lighthouse score > 90)
- [ ] Accessibility audit passed
- [ ] Security headers configured
- [ ] Analytics tracking implemented
- [ ] Error tracking configured (Sentry)
- [ ] Environment variables set

**18. Final Polish:**

- Consistent spacing using design tokens
- Beautiful color palette with brand colors
- Professional typography
- Micro-interactions on all buttons
- Smooth page transitions
- Loading skeletons for all async content
- Empty states for all lists
- Success/error toast notifications
- Confirmation dialogs for destructive actions
- Form validation with helpful error messages

**19. Demo Data Reset:**

Add reset button for demos:
```typescript
<DemoControls>
  <Button onClick={resetToMorning}>
    Reset to 9:00 AM
  </Button>
  <Button onClick={simulatePeakHours}>
    Simulate Peak Hours
  </Button>
  <Button onClick={triggerAlert}>
    Test Alert System
  </Button>
  <Button onClick={showSuccess}>
    Show Success Scenario
  </Button>
</DemoControls>
```

**20. README Documentation:**

Create comprehensive README.md with:
- Project overview
- Features list
- Tech stack
- Installation instructions
- Environment setup
- Running locally
- Building for production
- Deployment guide
- Architecture overview
- Component documentation
- API documentation (if applicable)
- Troubleshooting
- Contributing guidelines
- License

---

## Additional Requirements

**Color Palette Suggestion:**
- Primary: MWCI Blue (#0066CC)
- Secondary: Water Blue (#00A3E0)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)
- Neutral: Gray scale
- Backgrounds: White/Dark mode variants

**Typography:**
- Headings: Inter or Montserrat
- Body: Inter or System UI
- Code: JetBrains Mono

**Icons:**
- Use Lucide React icons consistently
- Custom icons for SAP, SQL, SSIS, SSAS if needed

**Charts:**
- Use Recharts for all visualizations
- Consistent color scheme across charts
- Proper legends and axis labels
- Responsive sizing
- Export capability (PNG/SVG)

**Best Practices:**
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Component composition over inheritance
- Custom hooks for reusable logic
- Context API for global state
- React Query for data fetching (if needed)
- Proper error boundaries
- Loading states everywhere
- Optimistic UI updates

---

## Final Notes

These prompts are designed to be executed sequentially in Claude Code. Each prompt builds upon the previous one. The final result should be a stunning, interactive, educational dashboard that effectively demonstrates the complete SAP ECC to Excel reporting pipeline.

The dashboard should be impressive enough to:
1. Win client confidence in your technical expertise
2. Clearly explain complex data architecture concepts
3. Demonstrate ROI and business value
4. Serve as a sales/demo tool
5. Be used for training purposes
6. Scale to show real client data in the future

Good luck with your build! 🚀
