import { AggregatedData, DataPoint,RawLineChartData,RawBarChartData } from "./types";

/* parseData: aggregates the tank data by day. Accumulates the total of each metric
for a tank for all the days it was running. 
*/
export function parseData (data:any){
  let byDayTank : AggregatedData = {};
  data.forEach((datapoint: DataPoint)=> {
    const dateStr= datapoint.start_time.slice(0, 10);
    const tank = datapoint.tank_name;
    const key = `${tank}-${dateStr}`;
    if (!byDayTank[key]){
      const entry = {
        tank_name: tank ,
        date: dateStr as string,
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

/* extractUniqueDates: grabs all the unique dates for time-series data. */
export function extractUniqueDates(data: AggregatedData){
  let dates= Array.from(new Set((Object.values(data).map((d)=> d.date)))).sort()
  return dates
}

/* exportLineChartData: converts daily aggregated data to show daily average 
efficiency for each metric for each tank. Daily Average efficiency is calculated 
as follows:
  total<metric_type>Saved * 100 / (total<metric_type>Saved + total<metric_type>)
Returns a Map of entries type RawLineChartDataPoint
*/ 
export function exportLineChartData(data : AggregatedData){
  let linechart :RawLineChartData ={}
  Object.values(data).forEach(datapoint=>{
    if(!linechart[datapoint.tank_name]){
      linechart[datapoint.tank_name] = [{
      tank:datapoint.tank_name,
      date:datapoint.date,
      time_eff: datapoint.totalTimeSaved *100 / (datapoint.totalTime + datapoint.totalTimeSaved),
      energy_eff: datapoint.totalEnergySaved *100 / (datapoint.totalEnergy + datapoint.totalEnergySaved),
      water_eff: datapoint.totalWaterSaved *100 / (datapoint.totalWater + datapoint.totalWaterSaved)
    }] 
    }else{
      linechart[datapoint.tank_name].push({
      tank:datapoint.tank_name,
      date:datapoint.date,
      time_eff: datapoint.totalTimeSaved *100 / (datapoint.totalTime + datapoint.totalTimeSaved),
      energy_eff: datapoint.totalEnergySaved *100 / (datapoint.totalEnergy + datapoint.totalEnergySaved),
      water_eff: datapoint.totalWaterSaved *100 / (datapoint.totalWater + datapoint.totalWaterSaved)
    })
    }
  })
  return linechart;
}

/* exportBarChartData: converts daily aggregated data to show cumulative 
  usage and savings per tank. 
  Returns a Map of entries type RawBarChartDataPoint
 */
export function exportBarChartData(data : AggregatedData){
  const barChartData: RawBarChartData = {}
  const sortedRows = Object.values(data).sort((a, b) => 
    a.date.localeCompare(b.date)
  );
  sortedRows.forEach((point)=>{
    if (!barChartData[point.tank_name]){
      barChartData[point.tank_name] = [{
      date:point.date,
      tank_name:point.tank_name,
      cumlTimeSaved:0,
      cumlEnergySaved:0,
      cumlWaterSaved: 0,
      cumlTime: 0,
      cumlEnergy: 0,
      cumlWater: 0}]
    }
    const bucket = barChartData[point.tank_name][0] // accumulator helps track running sum
    const entry = {
      date: point.date,
      tank_name:point.tank_name,
      cumlTimeSaved: bucket.cumlTimeSaved + point.totalTimeSaved,
      cumlEnergySaved: bucket.cumlEnergySaved + point.totalEnergySaved,
      cumlWaterSaved: bucket.cumlWaterSaved + point.totalWaterSaved,
      cumlTime: bucket.cumlTime + point.totalTime,
      cumlEnergy: bucket.cumlEnergy + point.totalEnergy,
      cumlWater: bucket.cumlWater + point.totalWater
    }
    barChartData[point.tank_name].push(entry)
    barChartData[point.tank_name][0] = entry
  })

  // I removed the accumulator at the end
  Object.keys(barChartData).forEach(tankName => {
    barChartData[tankName].shift();
  });
  return barChartData
}
