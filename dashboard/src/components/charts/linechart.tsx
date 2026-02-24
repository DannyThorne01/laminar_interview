"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { FinalLineChartProps, FinalLineChartRow } from "@/lib/types";

export default function LineChart({lineChartData, multi, xAxisLabel, yAxisLabel}: FinalLineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const LINE_CHART_OFFSET = 8

  useEffect(() => {
    if (!lineChartData.length || !svgRef.current || !containerRef.current) return;
    // handle dimensions of chart and svg 
    const margin = { top: 40, right: 80, bottom: 50, left: 80 };
    const width = containerRef.current.clientWidth - margin.left - margin.right -10;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", containerRef.current.clientWidth)  
     .attr("height", 450);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // handling the data to display 
    const groups = Array.from(new Set(lineChartData.map(d => d.class))).sort();
    const colorScale = d3.scaleOrdinal(d3.schemeDark2).domain(['Tank 1', 'Tank 2', 'Tank 3', 'Tank 4']);

    // handling scales, axes and labels
    const xScale = d3.scaleTime()
      .domain(d3.extent(lineChartData, d => new Date(d.timePeriod)) as [Date, Date])
      .range([0, width]);
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(lineChartData, d => d.value + LINE_CHART_OFFSET)  || 1])
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
      .attr("stroke-width", "2")
    gx.selectAll("text")
      .attr("fill", "#111")
      .attr("font-size", 12);

    const gy = g.append("g")
      .call(yAxis)
    gy.selectAll("path, line")
      .attr("stroke", "#111")
      .attr("stroke-width", "2")
    gy.selectAll("text")
      .attr("fill", "#111")
      .attr("font-size", 12);
    
    g.append("text")
      .attr('x', width/2)
      .attr('y', height + margin.bottom+5)
      .attr('text-anchor', 'middle')
      .attr("fill", "#494949")
      .attr("font-size", 15)
      .attr("font-weight", "bold")
      .text(xAxisLabel)

    g.append("text")
      .attr("transform", `rotate(-90)`)
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height/2))
      .attr('text-anchor', 'middle')
      .attr("fill", "#494949")
      .attr("font-size", 15)
      .attr("font-weight", "bold")
      .text(yAxisLabel)
    
    
    // d3 lineGenerator - could be excluded if this was scatterplot
    const line = d3.line<FinalLineChartRow>()
      .defined(d=>!isNaN(d.value))
      .x(d=>xScale(new Date(d.timePeriod)))
      .y(d=>yScale(d.value))
      .curve(d3.curveMonotoneX);

    const lines = d3.group(lineChartData, d=> d.class) // groups points by class or group
    //Map({Group1:points}, {Group2:points}..)

    // but then I need to shape into something acceptable for g.append
    // [{Group1:points}, {Group2:points} ... ] -- transformed for compatability
    let shaped_lines  = Array.from(lines, ([className,points])=>({className,points}))

    g.selectAll("linepath")
      .data(shaped_lines)
      .enter()
      .append("path")
      .attr("fill","none")
      .attr("stroke", d=>colorScale(d.className))
      .attr("stroke-width", "3")
      .attr("d", d=>line(d.points))

    // handling my tooltip, mouseovers, mouseenter and exits
    const tooltip = d3.select("body")
    .append("div")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("z-index", "9999")
    
    var mouseMove = (event: { pageX: number; pageY: number; }, d: { class: any; timePeriod: any; value: number; }) => {
      tooltip
      .html(
        `<div style="color: black;">
          <strong>Tank:</strong> ${d.class} <br/>
          <strong>Date:</strong> ${d.timePeriod} <br/>
          <strong>Value:</strong> ${Math.round(d.value)}%
        </div>`
      )
      .style("left", `${event.pageX + 10}px`)
      .style("top", `${event.pageY + 10}px`);
    };
    var mouseOver = (()=>tooltip.style("opacity",1))
    var mouseLeave = (()=>  tooltip.style("opacity", 0))

    // this is where I draw everything to svg
    g.selectAll("circle")
      .data(lineChartData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(new Date(d.timePeriod)))
      .attr("cy", d => yScale(d.value))
      .attr("r", 4)
      .attr("fill", d => colorScale(d.class))
      .attr("opacity", 0.7)
      .on("mouseover", mouseOver)
      .on("mousemove", mouseMove)
      .on("mouseleave", mouseLeave)

    // handling my legend
    g.selectAll("mylabels")
      .data(groups)
      .enter()
      .append("text")
        .attr("x", width+20 )
        .attr("y", (_,i) =>  100 + i*25) 
        .style("fill", d =>colorScale(d))
        .text(d=>d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

    g.selectAll("mydots")
      .data(groups)
      .enter()
      .append("circle")
      .attr("cx", width+10 )
      .attr("cy", (_,i) =>  100 + i*25) 
      .attr("r", 6)
      .style("fill", d =>colorScale(d))
  }, [lineChartData]);
  return (
    <div ref={containerRef} className="w-full">
      <svg ref={svgRef}></svg>
    </div>
  );
}
