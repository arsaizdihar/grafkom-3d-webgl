import { LightType } from "@/lib/engine/scene";
import { useApp } from "@/state/app-store";
import { useReducer } from "react";
import { InputDrag } from "./ui/input-drag";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function LightEdits() {
  const scene = useApp((state) => state.scene);
  const [_, rerender] = useReducer((s) => s + 1, 0);
  if (!scene) {
    return null;
  }
  const lightType = scene.lightType;

  return (
    <div>
      <div className="flex flex-col gap-2">
        <Select
          defaultValue={scene.lightType.toString()}
          onValueChange={(value) => {
            scene.lightType = parseInt(value);
            rerender();
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Directional Light</SelectItem>
            <SelectItem value="1">Point Light</SelectItem>
          </SelectContent>
        </Select>
        {lightType === LightType.Point && (
          <>
            <label className="block">Position</label>
            <div className="flex space-x-4" key={scene.id}>
              <div className="flex items-center">
                <span className="mr-2">X</span>
                <InputDrag
                  getValue={() => scene.lightPos.x}
                  onChange={(value) => {
                    scene.lightPos.x = value;
                  }}
                  step={0.5}
                />
              </div>
              <div className="flex items-center">
                <span className="mr-2">Y</span>
                <InputDrag
                  getValue={() => scene.lightPos.y}
                  onChange={(value) => {
                    scene.lightPos.y = value;
                  }}
                  step={0.5}
                />
              </div>
              <div className="flex items-center">
                <span className="mr-2">Z</span>
                <InputDrag
                  getValue={() => scene.lightPos.z}
                  onChange={(value) => {
                    scene.lightPos.z = value;
                  }}
                  step={0.5}
                />
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-2">Radius</span>
              <InputDrag
                getValue={() => scene.lightRadius}
                onChange={(value) => {
                  scene.lightRadius = value;
                }}
                min={0}
              />
            </div>
          </>
        )}
        {lightType === LightType.Directional && (
          <>
            <label className="block">Direction</label>
            <div className="flex space-x-4" key={scene.id}>
              <div className="flex items-center">
                <span className="mr-2">X</span>
                <InputDrag
                  getValue={() => scene.lightDir.x}
                  onChange={(value) => {
                    scene.lightDir.x = value;
                  }}
                  step={0.5}
                />
              </div>
              <div className="flex items-center">
                <span className="mr-2">Y</span>
                <InputDrag
                  getValue={() => scene.lightDir.y}
                  onChange={(value) => {
                    scene.lightDir.y = value;
                  }}
                  step={0.5}
                />
              </div>
              <div className="flex items-center">
                <span className="mr-2">Z</span>
                <InputDrag
                  getValue={() => scene.lightDir.z}
                  onChange={(value) => {
                    scene.lightDir.z = value;
                  }}
                  step={0.5}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
