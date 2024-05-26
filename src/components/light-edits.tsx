import { Color } from "@/lib/engine/color";
import { PointLight } from "@/lib/light/point-light";
import { InputDrag } from "./ui/input-drag";

export function LightEdits({ light }: { light: PointLight }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-semibold">Point Light</h2>
      <div className="flex items-center">
        <span className="mr-2">Radius</span>
        <InputDrag
          getValue={() => light.radius}
          onChange={(value) => {
            light.radius = value;
          }}
          min={0}
        />
      </div>
      <div className="flex items-center gap-2">
        <label>Color</label>
        <input
          type="color"
          defaultValue={light.color.hexString}
          onChange={(e) => {
            light.color = Color.hexString(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
