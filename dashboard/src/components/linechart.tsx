"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";

interface LineChartDataPoint {
  tank: string
  date: string, 
  time_eff: number, 
  energy_eff: number, 
  water_eff: number
}

export default function LineChart({ linechartdata }: { linechartdata: { [tankName: string]: LineChartDataPoint[] } }) {
  // state variables
  const [lineChartData, setLineChartData] = useState(linechartdata);
  const [filteredData, setFilteredData] = useState<LineChartDataPoint[]>([]);
  const [dateRange, setDateRange] = useState<[string, string]>(['2025-10-10', '2025-12-20']);
  const [currTanks, setCurrTanks] = useState<string[]>(['Tank 1','Tank 2']);
  const [currMetric, setCurrMetric] = useState<'time_eff' | 'energy_eff' | 'water_eff'>('water_eff');

  // ref variables
  const svgRef = useRef<SVGSVGElement>(null);

  // callbacks
  const filterData = useCallback(() => {
    const [startDate, endDate] = dateRange;
    const result: LineChartDataPoint[] = [];
    Object.entries(lineChartData).forEach(([tank, points]) => {
      if (currTanks.includes(tank)) {
        const filteredPoints = points.filter(point => 
          point.date >= startDate && point.date <= endDate 
        );
        result.push(...filteredPoints);
      }
    });
    setFilteredData(result);
  }, [lineChartData, currTanks, dateRange]);

  // TODO: implement buttons to switch tanks, switch metrics and also input date range filter
  // TODO: implement d3 line generator to connect the scatter plot 

  // useEffects
  useEffect(() => {
    filterData();
  }, [filterData]);

  useEffect(() => {
    if (!filteredData.length || !svgRef.current) return;
    const margin = { top: 20, right: 5, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // const uniqueDates = Array.from(new Set(filteredData.map(d => d.date))).sort();
    // console.log(uniqueDates)

    const xScale = d3.scaleTime()
      .domain(d3.extent(filteredData, d => new Date(d.date)) as [Date, Date])
      .range([0, width]);
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(filteredData, d => d[currMetric]) || 1])
      .range([height, 0]);
    
    const xAxis = d3.axisBottom<Date>(xScale).ticks(d3.timeDay.every(2)).
    tickFormat(d3.timeFormat("%m/%d"))
    .tickSize(5);
    const yAxis = d3.axisLeft<number>(yScale);

    const gx = g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);
    gx.selectAll("path, line")
      .attr("stroke", "#111")
    gx.selectAll("text")
      .attr("fill", "#111")
      .attr("font-size", 12);

    const gy = g.append("g")
      .call(yAxis)
    gy.selectAll("path, line")
      .attr("stroke", "#111")
    gy.selectAll("text")
      .attr("fill", "#111")
      .attr("font-size", 12);

    const tanks = Array.from(new Set(filteredData.map(d => d.tank)));
    const color = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(tanks);

    g.selectAll("circle")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(new Date(d.date!)))
      .attr("cy", d => yScale(d[currMetric]))
      .attr("r", 4)
      .attr("fill", d => color(d.tank) as string)
      .attr("opacity", 0.7);
  }, [filteredData, currMetric]);

  // the line chart depends on 'filteredData' and 'currMetric'
  // filteredData depends on the filter critera 'currTank' or 'dataRange' and 
  // it also depends on if the 'parseData' has been refetched or changed.
  return (
    <div>
      <div style={{ color: "#111"}}>
        Tanks: {currTanks.join(', ')} | Metric: {currMetric}
      </div>
      <svg ref={svgRef} style={{ width: "100%", height: 450 }}></svg>
    </div>
  );
}
