import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface SliderProps {
  className?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  defaultValue: number;
  onChange: (value: number) => void;
}

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, min, max, step, value, defaultValue, onChange, ...props }, ref) => (
    <SliderPrimitive.Root
      className={cn(
        "relative flex items-center select-none touch-none w-full h-5",
        className
      )}
      min={min}
      max={max}
      step={step}
      defaultValue={[defaultValue]}
      value={[value]} // Pass value as an array
      onValueChange={(values) => onChange(values[0])} // Convert array to single value
      {...props}
    >
      <SliderPrimitive.Track className="relative w-full h-1 bg-gray-300 rounded">
        <SliderPrimitive.Range className="absolute h-full bg-blue-600 rounded" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="block w-5 h-5 bg-white border border-gray-300 rounded-full shadow"
        ref={ref}
      />
    </SliderPrimitive.Root>
  )
);

Slider.displayName = "Slider";