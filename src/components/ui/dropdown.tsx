import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

interface DropdownProps {
  className?: string;
  list: Array<{ value: any; label: string }>;
  selectedVal: any;
  onChange: (value: any) => void;
}

export const Dropdown = React.forwardRef<HTMLButtonElement, DropdownProps>(
  ({ className, list, selectedVal, onChange, ...props }, ref) => (
    <DropdownMenu.Root {...props}>
      <DropdownMenu.Trigger asChild>
        <button
          ref={ref}
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground p-2",
            className
          )}
        >
          {selectedVal}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="z-10 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
        {list.map((item) => (
          <DropdownMenu.Item
            key={item.value}
            className={cn(
              "p-2 hover:bg-gray-200 cursor-pointer",
              item.value === selectedVal && "bg-gray-100"
            )}
            onSelect={() => onChange(item.value)}
          >
            {item.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
);

Dropdown.displayName = "Dropdown";