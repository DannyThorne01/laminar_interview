import { useState,useRef, useContext, useEffect, useCallback, SetStateAction } from "react";

interface RangeSliderProps{
  items: string[];
  onItemChange: (min:string, max:string) => void;
}
export const RangeSlider=({items, onItemChange}: RangeSliderProps)=>{
  const maxIndex = items.length - 1;
  const [minValue,setMinValue] = useState<number>(0);
  const [maxValue,setMaxValue] = useState<number>(maxIndex);
 
  const handleMax= useCallback((e: { target: { value: string; }; }) =>{
    let val = Math.min(8, parseInt(e.target.value))
    val = Math.max(val,minValue)
    setMaxValue(val)
    onItemChange(items[minValue], items[val])
  },[minValue])
  const handleMin = useCallback((e: { target: { value: string; }; }) =>{
    let val = Math.max(0, parseInt(e.target.value))
    val = Math.min(val,maxValue)
    onItemChange(items[val], items[maxValue])
    setMinValue(val)
  },[maxValue])

   return (
    <div className="flex flex-col gap-2 p-4 text-sm text-gray-700">
      <div className="flex items-center gap-3">
        <span className="w-24 text-gray-400">Initial Date</span>
        <input type="range" min="0" max={maxIndex} step="1" value={minValue} onChange={handleMin} className="flex-1" />
        <span className="w-20 text-right">{items[minValue]}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-24 text-gray-400">End Date</span>
        <input type="range" min="0" max={maxIndex} step="1" value={maxValue} onChange={handleMax} className="flex-1" />
        <span className="w-20 text-right">{items[maxValue]}</span>
      </div>
    </div>
  );
}