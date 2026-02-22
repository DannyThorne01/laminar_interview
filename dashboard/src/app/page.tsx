
"use client"
import { useState, useEffect} from "react";
import { parseData,exportLineChartData, exportBarChartData} from "@/lib/parseData";
import { LineChartUI } from "@/components/LineChartUI";
import { BarChartUI } from "@/components/BarChartUI";
import { AggregatedData, RawLineChartDataPoint, RawBarChartData } from "@/lib/types"

export default function Home() {
  const [lineChartData, setLineChartData] = useState< RawLineChartDataPoint[]>([]);
  const [barChartData, setBarChartData] = useState< RawBarChartData>();

  useEffect(() => {
    fetch(`/example.json`)
      .then(res => res.json())
      .then(rawData => {
        const ogData: AggregatedData = parseData(rawData);
        const lineChartData: RawLineChartDataPoint[] = Object.values(exportLineChartData(ogData)).flat()
        const barChartData : RawBarChartData= exportBarChartData(ogData)
        
        setLineChartData(lineChartData);
        setBarChartData(barChartData);
      })
      .catch(err => console.error("Fetch Error:", err));
  }, []);

  return (
    lineChartData && barChartData? 
    <>
      <LineChartUI linechartdata={lineChartData} />
      <BarChartUI barchartdata ={barChartData}/>
    </>: 
    (<div>Loading...</div>)
  );
}

