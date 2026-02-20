"use client"
import {CartesianGrid, Legend, Line, LineChart, XAxis, YAxis} from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

  interface AggregatedData{
  [key:string]:{
      id:number,
      tank_name: any,
      date:string,
      totalTimeSaved: number;
      totalEnergySaved: number;
      totalWaterSaved: number;
      totalTime: number;
      totalEnergy: number;
      totalWater: number;
  }
}
interface LineGraphProps {
  data: AggregatedData;
}

  export default function LineGraph({data}:LineGraphProps){
    const line_graph_data = Object.values(data)
    console.log(line_graph_data)
    return (
      <LineChart
      style={{width:'100%', aspectRatio:1.618, maxWidth:600}}
      responsive
      data={line_graph_data}
      margin={{
        top: 20,
        right: 20,
        bottom: 5,
        left: 0,
      }}>
      <CartesianGrid stroke="#aaa" strokeDasharray="5 5" />
      <Line type="monotone" dataKey="totalTimeSaved" stroke="purple" strokeWidth={2} name="My data series name" />
      <XAxis dataKey="date" />
      <YAxis width="auto" label={{ value: 'UV', position: 'insideLeft', angle: -90 }} />
      <Legend align="right" />
      <RechartsDevtools />
      </LineChart>
    )
  }