
interface DataPoint {
  start_time: string | any[]; 
  end_time: string | any[];
  id:number,
  tank_name: any; 
  metrics: { time: any; energy: any; Water: any; }; 
  savings: { time: any; energy: any; Water: any; }
}
interface AggregatedData{
  [key:string]:{
      id:number,
      tank_name: string,
      date:string|any,
      totalTimeSaved: number;
      totalEnergySaved: number;
      totalWaterSaved: number;
      totalTime: number;
      totalEnergy: number;
      totalWater: number;
  }
}
interface LineChartDataPoint {
  tank:string,
  date:string, 
  time_eff:number, 
  energy_eff:number, 
  water_eff:number
}
interface LineChartData {
  [tankName:string]: LineChartDataPoint[]
}
export function parseData (data:any){
  let byDayTank : AggregatedData = {};
  data.forEach((datapoint: DataPoint)=> {
    const dateStr = datapoint.start_time.slice(0, 10);
    const tank = datapoint.tank_name;
    const key = `${tank}-${dateStr}`;

    if (!byDayTank[key]){
      const entry = {
        id:0,
        tank_name: tank ,
        date: dateStr,
        totalTimeSaved :0, 
        totalEnergySaved: 0, 
        totalWaterSaved:0,
        totalTime: 0, 
        totalEnergy:0,
        totalWater:0,
      }
      byDayTank[key] = entry
    }
    const bucket = byDayTank[key];
    bucket.totalTime += datapoint.metrics.time || 0;
    bucket.totalEnergy += datapoint.metrics.energy || 0;
    bucket.totalWater += datapoint.metrics.Water || 0;

    bucket.totalTimeSaved += datapoint.savings.time || 0;
    bucket.totalEnergySaved += datapoint.savings.energy || 0;
    bucket.totalWaterSaved += datapoint.savings.Water || 0;
  })
return byDayTank;
}
export function exportLineChartData(data : AggregatedData){
  let linechart :LineChartData ={}
  Object.values(data).forEach(datapoint=>{
    if(!linechart[datapoint.tank_name]){
      linechart[datapoint.tank_name] = [{
      tank:datapoint.tank_name,
      date:datapoint.date,
      time_eff: datapoint.totalTimeSaved *100 / datapoint.totalTime,
      energy_eff: datapoint.totalEnergySaved *100 / datapoint.totalEnergy,
      water_eff: datapoint.totalWaterSaved *100 / datapoint.totalWater
    }] 
    }else{
      linechart[datapoint.tank_name].push({
      tank:datapoint.tank_name,
      date:datapoint.date,
      time_eff: datapoint.totalTimeSaved *100 / datapoint.totalTime,
      energy_eff: datapoint.totalEnergySaved *100 / datapoint.totalEnergy,
      water_eff: datapoint.totalWaterSaved *100 / datapoint.totalWater
    })
    }
  })
  return linechart;
}



