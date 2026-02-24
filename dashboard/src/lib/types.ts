export interface RawLineChartDataPoint {
  tank: string
  date: string, 
  time_eff: number, 
  energy_eff: number, 
  water_eff: number
}
export interface RawLineChartData {
  [tankName: string]: RawLineChartDataPoint[];
}
export interface RawLineChartDataProps{
  linechartdata: RawLineChartDataPoint[]
}
export type FinalLineChartRow = 
{class:string, timePeriod:string, value:number}
export interface FinalLineChartProps{
  lineChartData:FinalLineChartRow[]
  multi: boolean
  xAxisLabel: string;
  yAxisLabel:string
}

export interface RawBarChartData{
  [tankName:string]: [{
    date:string|any,
    tank_name:string,
    cumlTimeSaved: number;
    cumlEnergySaved: number;
    cumlWaterSaved: number;
    cumlTime: number;
    cumlEnergy: number;
    cumlWater: number;
  }]
}
export interface RawBarChartProps{
    barchartdata : RawBarChartData
}
export interface FinalBarChartRow{
  xAxis:string;
  [yKeys:string]:number | string;
}
export interface FinalBarChartProps{
  barChartData:FinalBarChartRow[]
  xAxisLabel: string;
  yAxisLabel:string
}

export interface ButtonUIProps{
  itemList: string[]
}

export type Metrics = 'time_eff' | 'energy_eff' | 'water_eff';

export const axisLabels = {
  'time_eff' : {linechart: 'Daily Time Efficiency %',
                barchart: 'Cumulative Time in Seconds'}, 
  'energy_eff' : {linechart:'Daily Energy Efficiency %', 
                  barchart:'Cumulative Energy in Kilowatt hours'},
  'water_eff' : {linechart:'Daily Water Efficiency %', 
                  barchart:'Cumualtive Water in Gallons' }
} as const

export interface DataPoint {
  start_time: string | any[]; 
  end_time: string | any[];
  id:number,
  tank_name: any; 
  metrics: { time: any; energy: any; Water: any; }; 
  savings: { time: any; energy: any; Water: any; }
}

export interface AggregatedData {
  [key: string]: {
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


