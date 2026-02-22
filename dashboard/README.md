## Update #3

Project Structure 

```bash
/dashboard - the next project
  /src- 
    /app
      layout.tsx - wrapper for my main page
      page.tsx - main page where the final UI will be. Right now it only has the components were  built so far
    /components - UI components like charts, or graphs etc
      /LineChartUI.tsx - Data processing for the linechart.tsx
      /linechart.tsx - View Model to display chart
      /BarChartUI.tsx - Data processing for the barchart.tsx
      /barchart.tsx - View Model to display chart
    /lib
      parseData.ts - Logic for parsing data for both charts
      types.ts - store for all the types used in project
      GlobalContext.tsx - global state management for filters on dashboard
      GlobalProvider.tsx - wrapper of GlobalContext.tsx. Think of it as like a vehicle which provides state variables to each component in /src/components.
```

Architecture Decisions 
 - Decoupled the Data Processing and Data Vizualisation mainly for modularity. Components like linechart.tsx and barchart.tsx can be reused for other parts of. the dashboard if necessary and they would be independent of the data provided. LineChartUI and BarChartUI are responsible for shaping the data in a format acceptable by the respective view models.
 - Implemented a Context Provider for global state management, so that each of my ChartProcessing components (LineChartUI, BarChartUI) can process the data into chart-ready data structures. 
 - Added types.ts for a store of all my types and interfaces used.


 

