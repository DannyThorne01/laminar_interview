# laminar_interview
Problem and Solution - Provided a series of timestamped data from tank operation cycles, design a small analytics dashboard. 

Technical Setup - So I am in the very early stages of this product, so I opted to go with the barebones html + d3.js setup, just to flesh out my initial ideas. My final product I intend to use, React.js with D3, which will allow me to build my modular components/charts, and eventually combine them into an analytics dashboard. I am using the atomic system design, opting to make smaller molecules (individual charts), which are then used to make the complete organism (dashboard). 

Chart Design - Initially I've opted for a time series chart to show the efficiency improvements overtime for the tanks. However as I graphed this out, I'm noticing huge gaps between data points, since each itself is about an hour or less, but the entire time period is over a span of days. 
To address wide data gaps, I tried implement capped zoom, restricting full zoom out and distortion of the data points. However this doesn't seem to help. 

New Proposed chart design- Given these wide data gaps, I will reduce the temporal resolution to days instead of hours and aggregate the data points for each specific tank according to the respective day. To my understand the specific datapoint doesn't matter in the grand scheme of things, rather the average of the datapoints over the period of the days, to track whether there was an increae or decrease. As such I will be implementing a line-graph to show "efficiency" (y-axis) over days. 
I haven't finalised a formula for efficiency as yet, but my initial draft would be "amount of water saved that day by tank_x / amount of water used that day by tank_x + amount of water saved that day by tank_x." Currently still workshopping that formulae.

Tradeoffs- With this new design I'm making the tradeoff of fine-grained data analysis for a more trend analysis.

How I ran the file: I used a VS Code extension called Live Server -> right click in index.html -> run using Live Server