
"use client"
import { useState, useEffect} from "react";
import { parseData,exportLineChartData, exportBarChartData} from "@/lib/parseData";
import { LineChartUI } from "@/components/LineChartUI";
import { BarChartUI } from "@/components/BarChartUI";
import ButtonUI from "@/components/ButtonUI";
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
    <div className = "flex flex-wrap items-center gap-4">
      <div className="flex flex-wrap md:flex-row w-full border border-gray-200 rounded-xl bg-gray-100 shadow-sm">
        <div className="w-full md:basis-2/3 min-w-0"><LineChartUI linechartdata={lineChartData} /></div>
      <div className="w-full md: basis-1/3 min-w-0 "><BarChartUI barchartdata ={barChartData}/></div>  
      </div>
      <div className="border border-gray-100 rounded-xl bg-gray-100 shadow-sm">
            <ButtonUI></ButtonUI>
      </div>

    </div>
    </>: 
    (<div>Loading...</div>)
  );
}

