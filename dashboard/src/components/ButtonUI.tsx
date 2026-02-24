"use client";
import { useState, useContext, useEffect, useCallback } from "react";
import { Context } from "@/lib/GlobalContext";
import { ButtonUIProps, Metrics } from "@/lib/types";
import { RangeSlider } from "./ui/RangeSlider";

export default function ButtonUI({itemList}:ButtonUIProps){
  const context = useContext(Context);
  if (!context) throw new Error("LineChartUI must be used inside GlobalProvider");
  const {
    currTanks,
    currMetric,
    setCurrTanks,
    setCurrMetric,
    setDateRange
  } = context;
  const tankOptions = ["Tank 1", "Tank 2", "Tank 3", "Tank 4"];

  const toggleTanks = useCallback((tank:string)=>{
  let entry = currTanks.includes(tank)? 
                currTanks.filter((currTank) =>currTank!== tank) : [...currTanks,tank]
    setCurrTanks(entry)
  },[currTanks])

  return(
    <>
     <div className="flex flex-col gap-3 p-3" >
      <div className="flex flex-wrap gap-3">
        <select id='metric_button' value={currMetric} onChange={event=>{setCurrMetric(event.target.value as Metrics) }}
          className="w-45 px-4 py-1 text-gray-600 bg-white rounded-md border border-gray-300">
          <option value='time_eff'>Time Efficiency</option>
          <option value='water_eff'>Water Efficiency</option>
          <option value='energy_eff'>Energy Efficiency</option>
        </select>
        <span className="font-semibold text-lg px-3 py-2 text-gray-600">
          Tank Controls
        </span>
      </div>
        
      
      <div className="flex flex-wrap gap-3">
        {tankOptions.map(tank=>(
          <label key={tank} className="flex items-center gap-1.5">
            <input 
              type="checkbox"
              checked={currTanks.includes(tank)}
              onChange= {()=> toggleTanks(tank)}
              className="w-4 h-4 accent-gray-200"/>
              <span className="text-sm font-medium text-gray-700">{tank}</span>
          </label>
        ))}
    </div>
    <div className="flex flex-wrap">
      <RangeSlider items={itemList} onItemChange={(min:string, max:string) => setDateRange([min,max])} ></RangeSlider>
    </div>
    </div>
    </>
   
  );
}