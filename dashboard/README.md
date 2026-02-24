## Final Submission

# Problem
  Provided a series of timestamped data from tank operation cycles, design a small analytics dashboard. Each record represents one tank cycle and includes start/end time, tank name, resource usage (time, water, energy), and estimated savings. The dashboard must show meaningful KPIs, visualize trends, and let users filter insights by time range and tank.

# Solution 
  I built a Next.js + D3 dashboard that parses and aggregates the raw cycle data into daily, tank-level metrics. The UI displays high-level KPIs and includes interactive line/bar charts to show efficiency and savings over time. Users can filter results by custom date range and selected tanks via shared global state, and the charts update instantly to reflect the chosen metric and filters.

# How to run my code
```bash 

python -m venv myvenv
source myvenv/bin/activate

# Navigate to the project directory
cd dashboard

# Install dependencies
npm install

# Start development server
npm run dev

```


# Project Structure 

```bash
/dashboard
  /src
    /app
      layout.tsx         # Root layout wrapper
      page.tsx           # Main dashboard page (data fetching + routing)

    /components
      LineChartUI.tsx    # Data transformation logic for line chart
      BarChartUI.tsx     # Data transformation logic for bar chart
      ButtonUI.tsx       # Dynamic selector component
      /ui
        RangeSlider.tsx    # Date range filtering component
        NavBar.tsx         # Top navigation bar
        StatusMessage.tsx  # Modal for Error Messages
      /charts
        linechart.tsx      # Presentational line chart (View Model)
        barchart.tsx       # Presentational bar chart (View Model)
      
    /lib
      parseData.ts       # Data parsing and transformation utilities
      types.ts           # Shared TypeScript types
      GlobalContext.tsx  # React context definition
      GlobalProvider.tsx # Context provider for global dashboard state
```
# Description of the Two Graphs
1. Line-graph showing Metric Efficiency over the period of days. I calculated efficiency as:
  `total<metric_type>Saved * 100 / (total<metric_type>Saved + total<metric_type>` and I chose this index because it normalizes performance and makes it easier to compare how Laminar's tech has brought about improvements over time.
2. Stacked Bar-Graph showing Cumulative Metric Usage for each tank. Here I show the 'Cumulative Amount of Metric Saved' stacked ontop Cumulative Amount of Metric Used' for comparision. This is intended to be a secondary to the line-graph highlighting which tanks consume the most and how much of that is offet by savings.

NOTE: These graphs show info WITHIN the specific time-period set in the 'Tank Controls'. 

# Technical and Architecture Choices: 

- Atomic Modular Desgin: I used atomic, modular desgin where smaller UI components are composed to build larger "organsims". Notably my `src/app/page.tsx` is made up of
modular components like the `LineChartUI.tsx`, `BarChartUI.tsx` and so on. Ideally this helps with reusability and better adaptability to screen-size changes. Additionally, my `ButtonUI.tsx` component follows this design pattern.

- Decoupling Data Processing from Vizualization: A key architectural decision was separating data transformation logic from rendering logic. For example `LineChartUI.tsx`(data-model) handles filtering, shaping and validating the data while `linegraph.tsx`(view-model) is purely for using the data to render the charts via D3. This separation makes it easier to scale to other dashboards as you can simply reuse the `linegraph.tsx` chart with different data models.Each layer is independent of each other which makes it better for testing as well. The same applies for `BarChartUI.tsx` and `barchart.tsx`

- Centralized State with Context Store: Since both chart components depended on shared filters (dateRange, currTanks, currMetric) I decided to make the filters the state variables and share these state variables 
through a context store. The `/src/lib/GlobalStore.tsx` defined the structure and housed all of my state variables and their setters, while `/src/lib/Globalprovder.tsx` broadcasted them to each of my different components. Once
the user changed a state variable this changed can be easily reflected in any component within the Context Provider.

- Data Processing Pipeline: The Pipeline is as follows:

```bash
Fetch Data
  → Aggregate by Day
  → Convert to Line/Bar Chart Data Structures
  → Filter Based on Global State 
  → Shape filtered data for graphs
  → Render Visualization
```
I chose this pipeline for consistency across different chart types. It might have costed me extra processing time especially since sometimes I had to extract groups (like tanks, or uniqueDates) and reshape the data, but I think for now this is a fair tradeoff for consistency. 

- Next.js + D3 codebase: I chose Next.js with AppRouter just for a simple codebase, and D3 to make flexible custom charts. 


# What would I do differently: 
- Move Data Fetching into Server Layer: 
Currently, data fetching occurs on my frontend because the dataset lives in `/example.json`. If I had more time I would move this logic to a server route like `src/app/api/dashboard/route.ts`. Here I would fetch from database -> handle errors -> process data -> implement any caching or pagination for large amounts of data. 

- Introduce Caching or Interval Fetching : As more data comes I would scale by using a ReactQuery caching mechanism to store data previously calculated instead of re-processing them.

- Adjust for inconsistent Date data: Right now my data only works for the format YYYY-MM-DD. Ideally I would have a better data cleaning step to standardize dates and metrics (if they come in different units). This would all be done before reaching the data-models.

- Duplicate D3 Elements : Both of my charts have duplicate elements, so I would pull those elements into a shared library reducing the copy-paste code from the charts.

- Unit Testing Data Pipeline: Using Jest and some mock datasets, I would test each function in `/src/lib/parseData.tsx` to verify they're supplying the correct data to view models. 




 Deployments: https://laminar-interview.vercel.app/

