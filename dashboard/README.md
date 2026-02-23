## Update #4

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
      /RangeSlider.tsx - Slider component to assist with Date Range Filter
    /lib
      parseData.ts - Logic for parsing data for both charts
      types.ts - store for all the types used in project
      GlobalContext.tsx - global state management for filters on dashboard
      GlobalProvider.tsx - wrapper of GlobalContext.tsx. Think of it as like a vehicle which provides state variables to each component in /src/components.
```

Architecture Decisions 
 - This update invloved adding more UI components like sliders and buttons for the filters. Not much architectural changes here. 
 - For my next update I do plan to work on optimization. I think at this point I have a working dashboard with two charts that can display metrics like Average Efficiency and Cumulative Totals, now I'm working on error handling, and optimization methods as I continue to test and develop the dashboard.


 

