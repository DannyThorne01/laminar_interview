# laminar_interview
Problem and Solution - Provided a series of timestamped data from tank operation cycles, design a small analytics dashboard. 

Update #2 

Technical Setup - I converted to a Next.js + D3.js project. Here is the file setup:
/dashboard - the next project
  /src- 
    /app
      layout.tsx - wrapper for my main page
      page.tsx - main page where the final UI will be. Right now it only has the components I've      built so far
    /components - UI components like charts, or graphs etc
      /line-graph.tsx - I was experimenting with ReCharts.js
      /linechart.tsx - My LineChart component in D3.js, with state management
    /lib
      parseData.ts - contains most of my logic data for parsing, and aggregating the data the 
      way that I understand.


Chart Design - Currently still building upon previous chart design, by implementing a line chart with aggregated metric data for each tank( aggregated by day - see previous update for reasons). 

Next updates: 
  - I'm considering implementing a ContextStore to store my state variables, especially since I'm going to implement another graph (maybe a pie chart or a heatmap, still thinking about it), it would probably need info from other files. So I defintely plan to expand my state management through a context store. MY repeated interfaces and types will be added to the store as well.
  - Next chart to display more KPIs. My next chart will be more of a stable chart showing a general overview of all the tanks over the entire time period.
  - Considerations for large data input- So I tried to structure my data ingestion into "fetching" and then "processing", where the fetching occurs in page.tsx, and then it's processed into 'LineChartData' and sent to as props to the LineChart component. I wanted to decouple the LineChsrt from the data ingestion, so that the chart is it's own component. If there's a large data set, and data needs to be paginated that I can adjust for that in the page.tsx section without affecting the chart components. 