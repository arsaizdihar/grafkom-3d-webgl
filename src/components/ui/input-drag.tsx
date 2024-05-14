// source: https://github.com/designbyadrian/react-input-with-drag/blob/main/src/utils.ts

import type { CSSProperties } from "react";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Input, InputProps } from "./input";
type InputModifier = "shiftKey" | "altKey" | "ctrlKey" | "metaKey";
export type InputDragModifiers = {
  [key in InputModifier]?: number;
};
export type InputWithDragChangeHandler = (newValue: number) => void;

interface InputDragProps
  extends Omit<InputProps, "onChange" | "onInput" | "value"> {
  // mouseDragThreshold?: number;
  // tabletDragThreshold?: number;
  getValue: () => number;
  modifiers?: InputDragModifiers;
  onChange?: InputWithDragChangeHandler;
}
/*  * Input with drag functionality
@prop {number} mouseDragThreshold - The number of pixels that a User Interface element has to be moved before it is recognized.
@prop {number} tabletDragThreshold - The drag threshold for tablet events. */
export const InputDrag = forwardRef<HTMLInputElement, InputDragProps>(
  function InputDrag(
    {
      // mouseDragThreshold = 3,
      // tabletDragThreshold = 10,
      style: _style = {},
      modifiers: _modifiers = {},
      onChange,
      getValue,
      ...props
    },
    forwardRef
  ) {
    const [_, rerenderThis] = useReducer((x) => !x, false);
    const value = getValue();
    const [modifier, setModifier] = useState<InputModifier | "">("");
    const ref = useRef<HTMLInputElement>(null);
    const startValue = useRef(0);
    const step = props.step ? +props.step : 1;
    const modifiers: InputDragModifiers = useMemo(
      () => ({
        shiftKey: 0.1,
        ..._modifiers,
      }),
      [_modifiers]
    );
    const [, setStartPos] = useState<[number, number]>([0, 0]);
    const style: CSSProperties = { cursor: "ew-resize", ..._style };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.valueAsNumber;
      if (isNaN(value)) {
        value = 0;
      }
      if (props.min) value = Math.max(value, +props.min);
      if (props.max) value = Math.min(value, +props.max);
      onChange?.(value);
      e.target.valueAsNumber = value;
      rerenderThis();
    };
    const handleMove = useCallback(
      (e: MouseEvent) => {
        setStartPos((pos) => {
          const { clientX: x2, clientY: y2 } = e;
          const [x1, y1] = pos;
          const a = x1 - x2;
          const b = y1 - y2;
          let mod = 1;
          if (modifier) {
            mod = modifiers[modifier] || 1;
          }
          const stepModifer = step * mod;
          const decimals = countDecimals(stepModifer);
          let delta = Math.sqrt(a * a + b * b) * stepModifer;
          if (x2 < x1) delta = -delta;
          let newValue: number = startValue.current + delta;
          if (props.min) newValue = Math.max(newValue, +props.min);
          if (props.max) newValue = Math.min(newValue, +props.max);
          newValue = +newValue.toFixed(decimals);
          if (newValue) {
            onChange?.(newValue);
            if (ref.current) {
              ref.current.valueAsNumber = newValue;
            }
            rerenderThis();
          }
          return pos;
        });
      },
      [modifier, props.max, props.min, step, modifiers, onChange]
    );
    const handleMoveEnd = useCallback(() => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleMoveEnd);
    }, [handleMove]);
    const handleDown = useCallback(
      (e: React.MouseEvent<HTMLInputElement>) => {
        let _startValue = +value;
        if (isNaN(_startValue)) {
          _startValue = +(props.defaultValue || props.min || 0);
        }
        startValue.current = _startValue;
        setStartPos([e.clientX, e.clientY]);
        document.addEventListener("mousemove", handleMove);
        document.addEventListener("mouseup", handleMoveEnd);
      },
      [handleMove, handleMoveEnd, value, props.min, props.defaultValue]
    );
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey) {
        setModifier("metaKey");
      } else if (e.ctrlKey) {
        setModifier("ctrlKey");
      } else if (e.altKey) {
        setModifier("altKey");
      } else if (e.shiftKey) {
        setModifier("shiftKey");
      }
    };
    const handleKeyUp = () => {
      setModifier("");
    };
    useEffect(() => {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);
      return () => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleMoveEnd);
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
      <Input
        {...props}
        ref={(next) => {
          // @ts-expect-error - ref is a forwardRef
          ref.current = next;
          if (typeof forwardRef === "function") {
            forwardRef(next);
          } else if (forwardRef) {
            (
              forwardRef as React.MutableRefObject<HTMLInputElement | null>
            ).current = next;
          }
        }}
        defaultValue={value}
        type="number"
        style={style}
        onMouseDown={handleDown}
        onChange={handleInputChange}
        lang="en_EN"
      />
    );
  }
);

/**
 * Based on GIST: https://gist.github.com/fr-ser/ded7690b245223094cd876069456ed6c
 * by Sergej Herbert https://gist.github.com/fr-ser
 */
function countDecimals(value: number) {
  if (Math.floor(value) === value) return 0;

  const valueAsString = value.toString();
  return (
    valueAsString.split(".")[1].length ||
    valueAsString.split(",")[1].length ||
    0
  );
}
