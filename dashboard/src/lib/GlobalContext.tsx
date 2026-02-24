import { SetStateAction, createContext } from "react";
import { Metrics } from "./types";
export type SetState<T> = React.Dispatch<SetStateAction<T>>;

export type GlobalContext ={
    dateRange : [string, string]
    setDateRange : SetState<[string, string]>
    currTanks : string[]
    setCurrTanks : SetState<string[]>
    currMetric : Metrics
    setCurrMetric : SetState<Metrics>
}
export const Context = createContext<GlobalContext | null>(null);