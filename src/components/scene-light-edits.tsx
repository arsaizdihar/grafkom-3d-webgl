import { Color } from "@/lib/engine/color";
import { useApp } from "@/state/app-store";
import { useReducer } from "react";
import { InputDrag } from "./ui/input-drag";

export function SceneLightEdits() {
  const scene = useApp((state) => state.scene);
  const [_, rerender] = useReducer((s) => s + 1, 0);
  if (!scene) {
    return null;
  }
  // const lightType = scene.lightType;

  return (
    <div>
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">Directional Light</h2>
        {/* {lightType === LightType.Point && (
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
        )} */}
        <label className="block">Direction</label>
        <div className="flex space-x-4" key={scene.id}>
          <div className="flex items-center">
            <span className="mr-2">X</span>
            <InputDrag
              getValue={() => scene.directionalDir.x}
              onChange={(value) => {
                scene.directionalDir.x = value;
              }}
              step={0.5}
            />
          </div>
          <div className="flex items-center">
            <span className="mr-2">Y</span>
            <InputDrag
              getValue={() => scene.directionalDir.y}
              onChange={(value) => {
                scene.directionalDir.y = value;
              }}
              step={0.5}
            />
          </div>
          <div className="flex items-center">
            <span className="mr-2">Z</span>
            <InputDrag
              getValue={() => scene.directionalDir.z}
              onChange={(value) => {
                scene.directionalDir.z = value;
              }}
              step={0.5}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <label>Color</label>
        <input
          type="color"
          defaultValue={scene.directionalColor.hexString}
          onChange={(e) => {
            scene.directionalColor = Color.hexString(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
