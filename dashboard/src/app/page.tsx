
"use client"
import { useState, useEffect, useContext} from "react";

import { Context } from "@/lib/GlobalContext";
import { LineChartUI } from "@/components/LineChartUI";
import { BarChartUI } from "@/components/BarChartUI";
import ButtonUI from "@/components/ButtonUI";
import StatusMessage from "@/components/ui/StatusMessage";

import { parseData,exportLineChartData, exportBarChartData, extractUniqueDates} from "@/lib/parseData";
import { AggregatedData, RawLineChartDataPoint, RawBarChartData } from "@/lib/types"

export default function Home() {
  const context = useContext(Context);
      if (!context) throw new Error("LineChartUI must be used inside GlobalProvider");
      const {
        setDateRange
      } = context;
  const [lineChartData, setLineChartData] = useState< RawLineChartDataPoint[]>([]);
  const [barChartData, setBarChartData] = useState< RawBarChartData | null>(null);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uniqueDates, setUniqueDates] = useState<string[]>([])
  
  const fetchData = (async ()=>{
    try {
        setLoading(true)
        setError(null);
        const res = await fetch("/example.json")
        if (!res.ok) throw new Error(`Failed to load data (HTTP ${res.status})`)
        const rawData = await res.json();
        const ogData : AggregatedData = parseData(rawData); 
        const dates = extractUniqueDates(ogData);
        if (dates.length >= 2) {
          setUniqueDates(dates);
          setDateRange([dates[0], dates[dates.length - 1]]);
        }else{
          setUniqueDates([])
        }
        const lineChartData: RawLineChartDataPoint[] = Object.values(exportLineChartData(ogData)).flat()
        const barChartData : RawBarChartData= exportBarChartData(ogData);
      
        setLineChartData(lineChartData);
        setBarChartData(barChartData);
      }
      catch(e:any){
        setError(e.message)
        console.log(`Error in Data Processing ${e.message}`)
      }
      finally{
        setLoading(false);
      }
  });
  useEffect(()=>{
   fetchData();
  },[]);

  if(loading) return <StatusMessage> Loading Insights ... </StatusMessage>
  if(error) return <StatusMessage> Error Loading Data : {error} </StatusMessage>
  if (!barChartData) {
    return <StatusMessage> Missing Bar Chart Data! </StatusMessage> 
  }
  if(lineChartData.length===0){
    return <StatusMessage> Missing Line Chart Data!</StatusMessage>
  }
  if(uniqueDates.length===0){
    return <StatusMessage> Missing Dates or Indices! </StatusMessage>
  }
  

  return (
    <>
    <div className = "flex flex-wrap items-center gap-4 p-2">
      <div className="flex flex-wrap md:flex-row w-full p-2 border border-gray-200 rounded-xl bg-gray-100 shadow-sm">
        <div className="w-full md:basis-2/3 min-w-0 "><LineChartUI linechartdata={lineChartData} /></div>
      <div className="w-full md: basis-1/3 min-w-0 "><BarChartUI barchartdata ={barChartData}/></div>  
      </div>
      <div className="border border-gray-100 rounded-xl bg-gray-100 shadow-sm">
            <ButtonUI itemList={uniqueDates}></ButtonUI>
      </div>

    </div>
    </>
  );
}

