"use client";
import { useContext,useMemo} from "react";
import { Context } from "@/lib/GlobalContext";
import { RawBarChartProps, FinalBarChartRow, axisLabels} from "@/lib/types";
import BarChart from "./barchart";

export function BarChartUI({barchartdata}: RawBarChartProps){
    const context = useContext(Context);
    if (!context) throw new Error("LineChartUI must be used inside GlobalProvider");
    const {
      dateRange,
      currTanks,
      currMetric
    } = context;

    const X_AXIS_LABEL = 'Tank Number';
    const yAxisLabel = axisLabels[currMetric].barchart;

    const dataForChart = useMemo(() => {
        const [startDate, endDate] = dateRange;
        const finalData: FinalBarChartRow[]= []

        Object.entries(barchartdata).forEach(([tankName,tankAgg])=>{
          const dateFilter = tankAgg.filter((point) => point.date >= startDate && point.date <= endDate)
         
          const length = dateFilter.length;
          if (length < 2) {
            finalData.push({ xAxis: tankName, Used: 0,Saved: 0 });
            return;
          }

          const saved = currMetric === 'time_eff'
          ? dateFilter[length - 1].cumlTimeSaved - dateFilter[0].cumlTimeSaved
          : currMetric === 'energy_eff'
          ? dateFilter[length - 1].cumlEnergySaved - dateFilter[0].cumlEnergySaved
          : dateFilter[length - 1].cumlWaterSaved - dateFilter[0].cumlWaterSaved;

          const used = currMetric === 'time_eff'
          ? dateFilter[length - 1].cumlTime - dateFilter[0].cumlTime
          : currMetric === 'energy_eff'
          ? dateFilter[length - 1].cumlEnergy - dateFilter[0].cumlEnergy
          : dateFilter[length - 1].cumlWater - dateFilter[0].cumlWater;

            const tankData:FinalBarChartRow= {
              xAxis: tankName, Used:used, Saved:saved}
            finalData.push(tankData)
        })
       return finalData
      }, [barchartdata, dateRange, currMetric]);
    return(
      <>
      <BarChart barChartData={dataForChart} xAxisLabel={X_AXIS_LABEL} yAxisLabel={yAxisLabel}></BarChart>
      </>
    );
  }
