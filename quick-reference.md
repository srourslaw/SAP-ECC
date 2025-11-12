# Quick Reference Cheat Sheet

## Prompt Execution Order

```
┌─────────────────────────────────────────────────────┐
│  PHASE 1: FOUNDATION                                │
├─────────────────────────────────────────────────────┤
│  ✓ Prompt 1: Project Setup (15 min)                │
│  ✓ Prompt 2: SAP ECC Data (30 min)                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  PHASE 2: PIPELINE COMPONENTS                       │
├─────────────────────────────────────────────────────┤
│  ✓ Prompt 3: Replication + RTO/RPO (45 min)        │
│  ✓ Prompt 4: SQL Server + Queries (40 min)         │
│  ✓ Prompt 5: SSIS ETL (45 min)                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  PHASE 3: ANALYTICS                                 │
├─────────────────────────────────────────────────────┤
│  ✓ Prompt 6: SSAS Cube (50 min)                    │
│  ✓ Prompt 7: Excel Pivots (40 min)                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  PHASE 4: INTEGRATION & POLISH                      │
├─────────────────────────────────────────────────────┤
│  ✓ Prompt 8: Dashboard Assembly (60 min)           │
│  ✓ Prompt 9: Interactivity (50 min)                │
│  ✓ Prompt 10: Final Polish (40 min)                │
└─────────────────────────────────────────────────────┘
```

## Key Components Overview

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| **SAP ECC** | Source system | 2.3M records, realistic water utility data |
| **Replication** | Data sync | RTO/RPO monitoring, animated flow |
| **SQL Server** | Replica DB | Query viewer, table browser |
| **SSIS** | ETL layer | Transform visualizations, package monitor |
| **SSAS** | OLAP cube | Dimensions, measures, DAX formulas |
| **Excel** | End-user tool | Pivot tables, slicers, charts |

## Technical Stack

```typescript
// Core
React 18 + TypeScript
Tailwind CSS

// Visualization
Recharts          // Charts
React Flow        // Pipeline diagram
Framer Motion     // Animations

// Icons & UI
Lucide React      // Icons
```

## Key Concepts to Visualize

### RTO (Recovery Time Objective)
- **Target**: 4 hours
- **Show**: Time to restore after failure
- **Visual**: Timeline with target marker

### RPO (Recovery Point Objective)
- **Target**: 15 minutes
- **Show**: Maximum acceptable data loss
- **Visual**: Lag indicator with threshold

### SSIS Transformations
- Data Conversion (🔄)
- Derived Column (🧮)
- Lookup (🔍)
- Aggregate (📊)
- Conditional Split (🔀)

### SSAS Dimensions
- Time (Year → Quarter → Month)
- Supplier (Country → Region → City)
- Material (Group → Type → Item)
- Plant (Region → Plant)

### DAX Examples
```dax
YoY_Growth = 
DIVIDE(
  [Current Year] - [Previous Year],
  [Previous Year]
)

Running_Total = 
CALCULATE(
  SUM(Fact[Amount]),
  FILTER(
    ALL(Dim_Time),
    Dim_Time[Date] <= MAX(Dim_Time[Date])
  )
)
```

## Color Scheme

```css
/* MWCI Brand Colors */
--primary: #0066CC;      /* MWCI Blue */
--secondary: #00A3E0;    /* Water Blue */
--success: #10B981;      /* Green */
--warning: #F59E0B;      /* Yellow */
--error: #EF4444;        /* Red */

/* Status Colors */
--healthy: #10B981;
--warning: #F59E0B;
--critical: #EF4444;
--offline: #6B7280;
```

## Data Flow Sequence

```
SAP ECC 
  ↓ (2-5 sec replication)
SQL Server
  ↓ (SSIS runs every 15 min)
Data Warehouse
  ↓ (Cube processes every hour)
SSAS Cube
  ↓ (User refreshes)
Excel Pivot Table
```

## Essential Metrics to Display

### Replication Layer
- Transactions/second: ~150
- Replication lag: 3.2s
- RPO status: Within target
- RTO capability: 2.5 hrs
- Last backup: 2 hrs ago

### SSIS Layer
- Packages running: 3/12
- Rows processed: 45,234
- Success rate: 99.2%
- Avg duration: 3.5 min

### SSAS Layer
- Cube size: 2.4 GB
- Last processed: 5 min ago
- Query performance: 0.3s avg
- Active queries: 12

### Excel Layer
- Active users: 47
- Reports refreshed: 234/day
- Avg refresh time: 2.1s

## Sample SAP Data Structure

```typescript
// Material (MARA)
{
  matnr: "MAT000123",
  maktx: "PVC Pipe 100mm",
  mtart: "ROH",          // Raw material
  meins: "EA",           // Each
  werks: "1000",         // North Manila
  labst: 5420,           // Stock
  price: 450.00
}

// Purchase Order (EKKO)
{
  ebeln: "5500012345",
  lifnr: "V000123",      // Vendor
  bedat: "2025-11-12",   // PO date
  matnr: "MAT000123",
  menge: 500,            // Quantity
  netpr: 450.00,         // Price
  status: "Released"
}
```

## Testing Checklist

### After Each Prompt
- [ ] Component renders without errors
- [ ] Data displays correctly
- [ ] Animations are smooth (60fps)
- [ ] Responsive on mobile
- [ ] No console warnings
- [ ] Proper TypeScript types

### Final Testing
- [ ] All navigation works
- [ ] All metrics update
- [ ] Presentation mode works
- [ ] Can export data
- [ ] Help docs accessible
- [ ] Loading states show
- [ ] Error handling works
- [ ] Keyboard shortcuts work

## Common Claude Code Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

## Quick Fixes

### Component not rendering?
```
"Add error boundary around [ComponentName] and show 
fallback UI if it fails"
```

### Animation too slow/fast?
```
"Adjust animation duration in [ComponentName] to 
[X] seconds with ease-in-out timing"
```

### Data not updating?
```
"Check that useEffect dependencies include [variable]. 
Add console.logs to debug data flow"
```

### Styling issues?
```
"Fix responsive layout in [ComponentName] using 
Tailwind breakpoints: sm, md, lg, xl"
```

## Key Files Structure

```
src/
├── components/
│   ├── pipeline/
│   │   ├── SAPECCNode.tsx        ← Prompt 2
│   │   ├── ReplicationLayer.tsx   ← Prompt 3
│   │   ├── SQLServerNode.tsx      ← Prompt 4
│   │   ├── SSISNode.tsx           ← Prompt 5
│   │   ├── SSASNode.tsx           ← Prompt 6
│   │   └── ExcelNode.tsx          ← Prompt 7
│   └── layout/
│       └── Dashboard.tsx          ← Prompt 8
├── data/
│   └── sapEccDummyData.ts         ← Prompt 2
└── utils/
    └── pipelineHelpers.ts         ← Prompt 9
```

## Presentation Flow

1. **Start** → Executive Dashboard
2. **Show** → Real-time metrics banner
3. **Click** → Pipeline overview
4. **Walk through** → Each component (SAP → Excel)
5. **Demonstrate** → RTO/RPO monitoring
6. **Show** → Query execution
7. **Display** → SSIS transformations
8. **Browse** → SSAS cube
9. **Interact** → Excel pivot tables
10. **Close** → ROI calculator

## Pro Tips

### Make it Stunning
- Use gradients liberally
- Add glassmorphism effects
- Smooth animations (Framer Motion)
- Micro-interactions everywhere
- Professional typography

### Make it Clear
- Tooltips on hover
- Help text for technical terms
- Visual indicators for status
- Color-coded components
- Clear labels and legends

### Make it Fast
- Lazy load components
- Memoize expensive calculations
- Virtual scrolling for tables
- Debounce user inputs
- Optimize images

### Make it Impressive
- Animated data flow
- Real-time updates
- 3D-inspired visualizations
- Smooth transitions
- Professional polish

## Success Criteria

✅ Client can understand the pipeline in < 5 minutes
✅ Technical team can drill into details
✅ Executives see business value clearly
✅ Runs smoothly on client's laptop
✅ Looks professional and polished
✅ Demonstrates your technical expertise

---

**Target**: A dashboard so impressive that clients immediately understand 
the value of your data architecture solution!
