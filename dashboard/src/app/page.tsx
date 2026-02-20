
"use client"
import LineChart from "@/components/linechart";
import { useState, useEffect} from "react";
import { parseData,exportLineChartData} from "@/lib/parseData";


interface AggregatedData {
  [key: string]: {
    id: number;
    tank_name: string;
    date: string;
    totalTimeSaved: number;
    totalEnergySaved: number;
    totalWaterSaved: number;
    totalTime: number;
    totalEnergy: number;
    totalWater: number;
  }
}

interface LineChartDataPoint {
  tank: string
  date: string, 
  time_eff: number, 
  energy_eff: number, 
  water_eff: number
}

interface LineChartData {
  [tankName: string]: LineChartDataPoint[];
}

export default function Home() {
  const [lineChartData, setLineChartData] = useState<LineChartData | null>(null);

  useEffect(() => {
    fetch(`/example.json`)
      .then(res => res.json())
      .then(rawData => {
        const ogData: AggregatedData = parseData(rawData);
        const lineChartData: LineChartData = exportLineChartData(ogData)
        setLineChartData(lineChartData);
      })
      .catch(err => console.error("Fetch Error:", err));
  }, []);

  return (
    lineChartData ? 
    (<LineChart linechartdata={lineChartData} />) : 
    (<div>Loading...</div>)
  );
}

