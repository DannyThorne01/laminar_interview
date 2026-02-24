"use client";
import { useContext, useMemo } from "react";
import { Context } from "@/lib/GlobalContext";
import LineChart from "./linechart";
import { FinalLineChartRow, RawLineChartDataPoint,RawLineChartDataProps, axisLabels } from "@/lib/types";

export function LineChartUI({linechartdata}: RawLineChartDataProps){
    const context = useContext(Context);
    if (!context) throw new Error("LineChartUI must be used inside GlobalProvider");
    const {
      dateRange,
      currTanks,
      currMetric,
    } = context;
    const X_AXIS_LABEL = 'Date-MM-DD';
    const yAxisLabel  = axisLabels[currMetric].linechart
    const dataForChart = useMemo(() => {
        const [startDate, endDate] = dateRange;
        const tankSet = new Set(currTanks)
        const processedData =linechartdata
                        .filter((point)=>tankSet.has(point.tank))
                        .filter((point) => point.date >= startDate && point.date <= endDate)
                        .slice()
                        .sort((a,b) => a.date.localeCompare(b.date))

        const finalData:FinalLineChartRow[] = processedData.map((point:RawLineChartDataPoint) =>({
              timePeriod: point.date, class:point.tank, value:point[currMetric]}))
        return finalData
      }, [linechartdata, currTanks, dateRange, currMetric]);
    return (
      <>
      <LineChart lineChartData={dataForChart} multi={true} xAxisLabel={X_AXIS_LABEL} yAxisLabel={yAxisLabel}/>
      </>
    )
}

  