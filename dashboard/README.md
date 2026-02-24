## Update #5

Project Structure 

```bash
/dashboard
  /src
    /app
      layout.tsx         # Root layout wrapper
      page.tsx           # Main dashboard page (data fetching + orchestration)

    /components
      LineChartUI.tsx    # Data transformation logic for line chart
      linechart.tsx      # Presentational line chart (View Model)
      BarChartUI.tsx     # Data transformation logic for bar chart
      barchart.tsx       # Presentational bar chart (View Model)
      RangeSlider.tsx    # Date range filtering component
      ButtonUI.tsx       # Dynamic selector component
      NavBar.tsx         # Top navigation bar

    /lib
      parseData.ts       # Data parsing and transformation utilities
      types.ts           # Shared TypeScript types
      GlobalContext.tsx  # React context definition
      GlobalProvider.tsx # Context provider for global dashboard state
```

Architecture Decisions and Updates:
 - This update involves improving data collection and processing under "production" settings. For my data fetching in `/src/app/page.tsx` ideally I would have a `/src/app/api/dashboard/routes.ts` server file which would fetch my data from a database and handle any errors. However in this take-home for simplicity, I implemeted my fetch in the frontend component with a `useEffect` and handled errors either produced from data fetching or processing the data for my charts.
 - In LineChartsUI.tsx and BarChartsUI.tsx I'm now using `useMemo` to cache the `dataForChart` prevent constant re-processing.
 - The ButtonUI.tsx component now accepts an `itemList` prop to dynamically create the range sliders. Before I fixed the itemList as a DATES array.
 - linechart.tsx and barchart.tsx now have tooltips so the user can hover over a point or a bar and see the values associated with that entity. Also I added `containerRef` to these charts to manage the size and space.
 - NavBar.tsx implemented for aesthetic reasons.



 

