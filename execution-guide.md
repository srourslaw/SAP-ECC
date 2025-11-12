# MWCI Dashboard - Execution Guide

## How to Use These Prompts with Claude Code

### Setup
1. Ensure you have Claude Code installed and authenticated with your $200/month Pro account
2. Create a new project directory: `mkdir mwci-pipeline-dashboard && cd mwci-pipeline-dashboard`
3. Open Claude Code in this directory

### Execution Strategy

#### Phase 1: Foundation (Prompts 1-2) - ~30 minutes
- **Prompt 1**: Sets up the entire project structure
  - Wait for completion before moving to next
  - Verify all dependencies are installed
  - Check that folder structure is created
  
- **Prompt 2**: Creates all dummy SAP data
  - This is crucial - all other components depend on this data
  - Review the generated data to ensure it looks realistic
  - Test data generators work correctly

#### Phase 2: Core Pipeline (Prompts 3-5) - ~2 hours
- **Prompt 3**: Replication & RTO/RPO monitoring
  - This is visually complex, may need refinement
  - Test animations work smoothly
  
- **Prompt 4**: SQL Server simulation
  - Verify query execution works
  - Check syntax highlighting
  
- **Prompt 5**: SSIS ETL visualization
  - Most technically complex component
  - Verify transformation logic displays correctly

#### Phase 3: Analytics Layer (Prompts 6-7) - ~1.5 hours
- **Prompt 6**: SSAS Cube structure
  - Test dimension hierarchies
  - Verify DAX formulas display correctly
  
- **Prompt 7**: Excel pivot tables
  - Most user-facing component
  - Ensure drag-drop works smoothly

#### Phase 4: Integration (Prompt 8) - ~1 hour
- **Prompt 8**: Main dashboard assembly
  - Brings everything together
  - Test navigation between components
  - Verify all metrics update correctly

#### Phase 5: Enhancement (Prompts 9-10) - ~1.5 hours
- **Prompt 9**: Add real-time interactivity
  - Test simulation engine
  - Verify animations don't impact performance
  
- **Prompt 10**: Final polish
  - Presentation mode is crucial for client demos
  - Test all documentation features

### Total Estimated Time: 6-7 hours

## Tips for Working with Claude Code

### 1. Iterative Approach
Don't try to do all prompts in one session. Do 2-3 prompts, test thoroughly, then continue.

### 2. Prompt Refinement
If Claude Code's output isn't quite right, follow up with:
- "The replication animation is too fast, can you slow it down?"
- "Add more spacing between the pipeline nodes"
- "Make the colors more vibrant and professional"

### 3. Testing After Each Prompt
After each prompt, run:
```bash
npm run dev
```
And verify:
- Component renders correctly
- No console errors
- Responsive on different screen sizes
- Animations are smooth

### 4. Component-Level Refinement
If a specific component needs work, ask Claude Code:
```
"Focus on the SSASNode component - make the 3D cube visualization 
more realistic with better shadows and lighting effects"
```

### 5. Data Validation
After Prompt 2, explicitly verify:
```
"Show me a sample of 10 materials from the generated SAP data 
and explain what each field means"
```

### 6. Performance Optimization
If dashboard feels slow after adding features:
```
"Optimize the real-time simulation - it's causing lag. 
Use React.memo and useMemo where appropriate"
```

## Common Issues and Solutions

### Issue: Too much data causing slowdown
**Solution**: 
```
"Reduce dummy data to 100 materials, 50 vendors, 200 POs 
but keep it looking realistic"
```

### Issue: Charts not rendering
**Solution**:
```
"Debug the Recharts implementation - verify all required 
props are passed and data format is correct"
```

### Issue: Animations janky
**Solution**:
```
"Use CSS transforms instead of changing position/size for animations. 
Add will-change property for better performance"
```

### Issue: Responsive layout broken
**Solution**:
```
"Fix responsive layout for mobile - stack components vertically 
and make pipeline flow vertical instead of horizontal"
```

## Checkpoint Validation

### After Prompt 2 - Data Generation ✓
- [ ] Can view SAP materials in console
- [ ] Purchase orders have realistic dates
- [ ] Vendors have proper names and locations
- [ ] Data relationships make sense (POs reference real materials/vendors)

### After Prompt 5 - Core Pipeline ✓
- [ ] Can see data flowing from SAP to Excel
- [ ] Each component is clickable
- [ ] Status indicators show green
- [ ] Metrics are updating

### After Prompt 8 - Dashboard Integration ✓
- [ ] All navigation works
- [ ] Can switch between views smoothly
- [ ] Sidebar toggles correctly
- [ ] Metrics banner displays all values

### After Prompt 10 - Final Polish ✓
- [ ] Presentation mode works
- [ ] Help documentation accessible
- [ ] No console errors
- [ ] Lighthouse score > 85
- [ ] Works in Chrome, Firefox, Safari

## Customization Points

### 1. Branding
After completion, customize:
```
"Replace all blue colors with MWCI's brand colors: 
Primary #0066CC, Secondary #00A3E0"
```

### 2. Company Logo
```
"Add MWCI logo to header - I'll provide the SVG"
```

### 3. Data Ranges
```
"Change date range to show 2024-2025 data instead of 2025 only"
```

### 4. Additional Metrics
```
"Add a new metric card showing 'Average Lead Time' calculated 
from PO date to delivery date"
```

## Presentation Tips

When presenting to clients:

1. **Start with Executive View** (Prompt 8)
   - Show high-level KPIs
   - Demonstrate business value

2. **Walk Through Pipeline** (Prompts 3-7)
   - Use presentation mode
   - Explain each component's purpose
   - Show real-time data flow

3. **Deep Dive on Request** (Prompts 4, 6, 7)
   - Show SQL querying capability
   - Demonstrate cube browsing
   - Show pivot table flexibility

4. **Highlight Technical Excellence** (Prompt 9)
   - Show RTO/RPO monitoring
   - Demonstrate real-time updates
   - Explain backup strategy

5. **Close with ROI** (Prompt 10)
   - Show before/after comparison
   - Present cost savings
   - Discuss implementation timeline

## Next Steps After Build

### 1. Real Data Integration
Once dummy data works, connect to actual systems:
```
"Replace dummy data generators with API calls to:
- SAP ECC via RFC/BAPI
- SQL Server via REST API
- SSAS via XMLA endpoint"
```

### 2. Authentication
Add security:
```
"Implement JWT authentication with role-based access. 
Show different views for: Admin, Manager, Analyst, Viewer"
```

### 3. Historical Data
Add time-travel capability:
```
"Allow users to select any date/time in the past and see 
what the dashboard looked like at that moment"
```

### 4. Alerts Configuration
Make alerts customizable:
```
"Add an admin panel where users can configure alert thresholds 
and notification preferences"
```

### 5. Export Reports
Scheduled reporting:
```
"Add ability to schedule daily/weekly email reports with 
PDF attachments of key dashboards"
```

## Resource Links

- **Recharts Docs**: https://recharts.org/
- **Framer Motion**: https://www.framer.com/motion/
- **React Flow**: https://reactflow.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **Lucide Icons**: https://lucide.dev/

## Support

If you run into issues:
1. Check console for errors
2. Verify Node.js version (should be 18+)
3. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
4. Ask Claude Code to debug specific issues

---

**Remember**: The goal is a stunning, client-ready dashboard that demonstrates 
your technical expertise and MWCI's sophisticated data architecture. Take your 
time with each prompt and don't hesitate to refine until it's perfect!

Good luck! 🚀💧
