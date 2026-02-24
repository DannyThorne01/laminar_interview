"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import {  FinalBarChartProps} from "@/lib/types";


export default function BarChart({barChartData, xAxisLabel, yAxisLabel}: FinalBarChartProps)
{

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if (!barChartData.length || !svgRef.current || !containerRef.current) return;
    // handle dimensions of chart and svg 
    const margin = { top: 20, right: 100, bottom: 50, left: 100 };
    const width =  containerRef.current.clientWidth  - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", containerRef.current.clientWidth)  
        .attr("height", 450);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // handling the data to display 
    const groups = Array.from(new Set(barChartData.map(d => d.category))).sort()
    const subgroups_set = new Set<string>()
    const yDomain : number[]= []
    barChartData.forEach((point)=>{
      let f_keys = Object.keys(point).filter(key=>key!=='category')
      let totalStackHeight = 0
      f_keys.forEach(f_key => {
        subgroups_set.add(f_key)
        if (typeof point[f_key]  === 'number'){
          totalStackHeight = point[f_key] + totalStackHeight + 500
        }
      })
      yDomain.push(totalStackHeight)
    })
    const subgroups:string[] = Array.from(subgroups_set)

    // d3.stack data structure - example if I'm stacking 2 classes for 3 categories (a, b, c)
    // the structure is as follows
    // stackedData = 
    // [[0,a1,a_data], [0,b1,b_data], [0,c1,c_data]] ---> Array 1
    // [[a1,a2,a_data], [b1,b2,b_data], [c1,c2,c_data]] ---> Array 2
    // where a1, b1 ... c2  are the positions for the rectangles (bars)
    const stackedData = d3.stack()
      .keys(subgroups as string[])(barChartData as Iterable<{[key: string]: number}>);
    console.log(stackedData)

    // handling scales, axes and labels
    const colourScale = d3.scaleOrdinal(d3.schemeCategory10).domain(subgroups); 
    const xScale = d3.scaleBand()
      .domain(groups)
      .range([0,width])
    const yScale = d3.scaleLinear()
      .domain([0, Math.max(...yDomain)])
      .range([height,0])

    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    const gx = g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);
    gx.selectAll("path, line")
    .attr("stroke", "#787777")
    .attr("stroke-width", "1")
    gx.selectAll("text")
      .attr("fill", "#111")
      .attr("font-size", 12);
     
    const gy = g.append("g")
        .call(yAxis)
    gy.selectAll("path, line")
      .attr("stroke", "#787777")
      .attr("stroke-width", "1")
    gy.selectAll("text")
      .attr("fill", "#111")
      .attr("font-size", 12);

    g.append("text")
      .attr('x', width/2)
      .attr('y', height + margin.bottom-10)
      .attr('text-anchor', 'middle')
      .attr("fill", "#494949")
      .attr("font-size", 15)
      .attr("font-weight", "bold")
      .text(xAxisLabel)
        
    g.append("text")
      .attr("transform", `rotate(-90)`)
      .attr("y", 0 - margin.left + 30)
      .attr("x", 0 -(height / 2))
      .attr('text-anchor', 'middle')
      .attr("fill", "#494949")
      .attr("font-size", 15)
      .attr("font-weight", "bold")
      .text(yAxisLabel)

    // handling my tooltip, mouseovers, mouseenter and exits
    d3.select("body").selectAll(".tooltip").remove();
    const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("z-index", "9999")
            
    var mouseMove = (event:any,d:any) => {
    tooltip
    .html(
      `<div style="color: black;">
        <strong>Tank:</strong> ${d.data.category} <br/>
        <strong>Used:</strong> ${d.data.Used} <br/>
        <strong>Saved:</strong> ${d.data.Saved}
      </div>`
    )
      .style("left", `${event.pageX + 10}px`)
      .style("top", `${event.pageY + 10}px`);
      };
    var mouseOver = (()=>tooltip.style("opacity",1))
    var mouseLeave = (()=>  tooltip.style("opacity", 0))

    // this is where I draw everything to svg
    const barWidth = xScale.bandwidth() * 0.5;
    const barOffset = (xScale.bandwidth() - barWidth) / 2

    const bars = g.append("g")
      .selectAll("g")
      .data(stackedData)
      .enter()
      .append("g")
      .attr("fill", d => colourScale(d.key) as string);
    bars.selectAll("rect")
      .data(d=>d)
      .enter()
      .append("rect")
      .attr("x", d => xScale((d.data as any).category)! + barOffset)
      .attr("y", d => yScale(d[1]))
      .attr("opacity", 0.85)
      .attr("rx", 2)         
      .attr("ry", 2)
      .attr("height", d => yScale(d[0]) - yScale(d[1]))
      .attr("width", barWidth)
      .on("mouseover", mouseOver)
      .on("mousemove", mouseMove)
      .on("mouseleave", mouseLeave)

    // handling my legend
    g.selectAll("mydots")
    .data(subgroups)
    .enter()
    .append("circle")
    .attr("cx", width )
    .attr("cy", (_,i) =>  100 + i*25) 
    .attr("r", 6)
    .style("fill", d =>colourScale(d))

    g.selectAll("mylabels")
    .data(subgroups)
    .enter()
    .append("text")
      .attr("x", width+10)
      .attr("y", (_,i) =>  100 + i*25) 
      .style("fill", d =>colourScale(d))
      .text(d=>d)
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
  }, [barChartData]);
  return (
     <div ref={containerRef} className="w-full">
      <svg ref={svgRef}></svg>
    </div>
  )
}