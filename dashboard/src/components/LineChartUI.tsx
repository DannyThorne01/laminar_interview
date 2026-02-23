"use client";
import { useState, useContext, useEffect, useCallback } from "react";
import { Context } from "@/lib/GlobalContext";
import LineChart from "./linechart";
import { FinalLineChartRow, RawLineChartDataPoint,RawLineChartDataProps } from "@/lib/types";

export function LineChartUI(linechartdata: RawLineChartDataProps){
    const context = useContext(Context);
    if (!context) throw new Error("LineChartUI must be used inside GlobalProvider");
    const {
      dateRange,
      currTanks,
      currMetric,
      setCurrMetric,
    } = context;

    const [dataForChart, setDataForChart] = useState<FinalLineChartRow[]>([]);
    const [xAxisLabel,setXAxisLabel] = useState('Date-MM-DD')
    const [yAxisLabel,setYAxisLabel] = useState('')
  
    const filterData = useCallback(() => {
        const [startDate, endDate] = dateRange;
        const data = linechartdata.linechartdata;
        const tankFilter = data.filter((point)=>currTanks.includes(point.tank))
        const dateFilter = tankFilter.filter((point) => point.date >= startDate && point.date <= endDate)
        const sorted = dateFilter.sort((a,b) => 
          a.date.localeCompare(b.date)
        )
        const final:FinalLineChartRow[] = sorted.map((point:RawLineChartDataPoint) =>({
              timePeriod: point.date, class:point.tank, value:point[currMetric]}))
        
        const yAxisLabel = currMetric === 'time_eff' ? 'Daily Time Efficiency %' :
        currMetric === 'energy_eff' ? 'Daily Energy Efficiency %' : 'Daily Water Efficiency %'

        setYAxisLabel(yAxisLabel);
        setDataForChart(final);
      }, [linechartdata, currTanks, dateRange, currMetric]);

    useEffect(() => {
    filterData();
    }, [filterData]);

    return (
      <>
      <LineChart lineChartData={dataForChart} multi={true} xAxisLabel={xAxisLabel} yAxisLabel={yAxisLabel}/>
      </>
    )
}

  