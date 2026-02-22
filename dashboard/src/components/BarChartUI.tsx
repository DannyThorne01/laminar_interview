"use client";
import { useState, useContext, useEffect, useCallback} from "react";
import { Context } from "@/lib/GlobalContext";
import { RawBarChartProps, FinalBarChartRow} from "@/lib/types";
import BarChart from "./barchart";

export function BarChartUI({barchartdata}: RawBarChartProps){
    const context = useContext(Context);
    if (!context) throw new Error("LineChartUI must be used inside GlobalProvider");
    const {
      dateRange,
      currTanks,
      currMetric
    } = context;

    const [dataForChart, setDataForChart] = useState<FinalBarChartRow[]>([]);
    const [xAxisLabel,setXAxisLabel] = useState('Tank Number')
    const [yAxisLabel,setYAxisLabel] = useState('')


    const filterData = useCallback(() => {
        const [startDate, endDate] = dateRange;
        const data = barchartdata;
        const result: FinalBarChartRow[]= []

        Object.entries(data).forEach(([tankName,tankAgg])=>{
          const dateFilter = tankAgg.filter((point) => point.date >= startDate && point.date <= endDate)
 
          const length = dateFilter.length;
          if (length < 2) {
            result.push({ xAxis: tankName, Used: 0,Saved: 0 });
            return;
          }
          const saved = currMetric === 'time_eff'
          ? dateFilter[length - 1].cumlTimeSaved - dateFilter[1].cumlTimeSaved
          : currMetric === 'energy_eff'
          ? dateFilter[length - 1].cumlEnergySaved - dateFilter[1].cumlEnergySaved
          : dateFilter[length - 1].cumlWaterSaved - dateFilter[1].cumlWaterSaved;

          const used = currMetric === 'time_eff'
            ? dateFilter[length - 1].cumlTime - dateFilter[1].cumlTime
            : currMetric === 'energy_eff'
            ? dateFilter[length - 1].cumlEnergy - dateFilter[1].cumlEnergy
            : dateFilter[length - 1].cumlWater - dateFilter[1].cumlWater;

        
          const yAxisLabel = currMetric === 'time_eff' ? 'Cumulative Time in Seconds' :
          currMetric === 'energy_eff' ? 'Cumulative Energy in Kilowatt hours' : 'Cumualtive Water in Gallons'
          setYAxisLabel(yAxisLabel);

          const tankData:FinalBarChartRow= {
            xAxis: tankName, Used:used, Saved:saved}
          result.push(tankData)
        })
        setDataForChart(result);
      }, [barchartdata, currTanks, dateRange, currMetric]);

    useEffect(() => {
    filterData();
    }, [filterData]);
    return(
      <>
      <BarChart barChartData={dataForChart} xAxisLabel={xAxisLabel} yAxisLabel={yAxisLabel}></BarChart>
      </>
    );
  }
