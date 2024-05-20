import { useApp } from "@/state/app-store";
import { InputDrag } from "./ui/input-drag";
import { Button } from "./ui/button";

export function LightEdits() {
  const scene = useApp((state) => state.scene);
  if (!scene) {
    return null;
  }

  return (
    <div>
      <hr className="border-slate-400 my-4" />
      <div className="flex flex-col gap-2">
        <h3>Light</h3>
        <div className="flex space-x-4">
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
      </div>
    </div>
  );
}
