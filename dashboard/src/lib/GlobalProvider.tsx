'use client'

import { ReactNode, useState } from "react";
import { Context, GlobalContext,  } from "./GlobalContext";
import { Metrics } from "./types";
export default function GlobalProvider ({children}: {children:ReactNode}) {
  const [dateRange, setDateRange] =  useState<[string, string]>(['2025-10-10', '2025-12-20']);
  const [currTanks, setCurrTanks] = useState<string[]>(['Tank 1', 'Tank 2']);
  const [currMetric, setCurrMetric] = useState<Metrics>('water_eff');

  const value: GlobalContext = {
    dateRange,
    setDateRange,
    currTanks,
    setCurrTanks,
    currMetric,
    setCurrMetric
  }; 
  return <Context.Provider value={value}>{children}</Context.Provider>;
};