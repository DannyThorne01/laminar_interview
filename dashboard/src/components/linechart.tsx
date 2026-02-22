"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { FinalLineChartProps, FinalLineChartRow } from "@/lib/types";

export default function LineChart({lineChartData, multi, xAxisLabel, yAxisLabel}: FinalLineChartProps) {
  const data = lineChartData;
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;
    const margin = { top: 40, right: 5, bottom: 50, left: 80 };
    const width = 650 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.timePeriod)) as [Date, Date])
      .range([0, width]);
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value + 5)  || 1])
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
    
    g.append("text")
      .attr('x', width/2)
      .attr('y', height + margin.bottom+5)
      .text(xAxisLabel)

    g.append("text")
      .attr("transform", `rotate(-90)`)
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height/1.3))
      .text(yAxisLabel)
    
    const groups = Array.from(new Set(data.map(d => d.class)));
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(groups);

    const line = d3.line<FinalLineChartRow>()
    .defined(d=>!isNaN(d.value))
    .x(d=>xScale(new Date(d.timePeriod)))
    .y(d=>yScale(d.value))
    .curve(d3.curveMonotoneX);

    const lines = d3.group(data, d=> d.class) // groups points by class or group
    //Map({Group1:points}, {Group2:points}..)

    // but then I need to shape into something acceptable for g.append
    // [{Group1:points}, {Group2:points} ... ] -- transformed for compatibility
    let shaped_lines  = Array.from(lines, ([className,points])=>({className,points}))

    g.selectAll("linepath")
      .data(shaped_lines)
      .enter()
      .append("path")
      .attr("fill","none")
      .attr("stroke", d=>colorScale(d.className))
      .attr("stroke-width", "1")
      .attr("d", d=>line(d.points))

    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(new Date(d.timePeriod)))
      .attr("cy", d => yScale(d.value))
      .attr("r", 4)
      .attr("fill", d => colorScale(d.class))
      .attr("opacity", 0.7);g.selectAll("mydots")

    g.selectAll("mylabels")
      .data(groups)
      .enter()
      .append("text")
        .attr("x", width + margin.right+20)
        .attr("y", (_,i) =>  100 + i*25) 
        .style("fill", d =>colorScale(d))
        .text(d=>d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

    g.selectAll("mydots")
      .data(groups)
      .enter()
      .append("circle")
      .attr("cx", width + margin.right)
      .attr("cy", (_,i) =>  100 + i*25) 
      .attr("r", 6)
      .style("fill", d =>colorScale(d))
  }, [data]);
  return (
    <div>
      <svg ref={svgRef} style={{ width: "80%", height: 500 }}></svg>
    </div>
  );
}
