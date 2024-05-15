import { Transform } from "@/lib/engine/transform";
import { InputDrag } from "./ui/input-drag";

export function TransformEdits({
  transform,
  triggerChange,
}: {
  transform: Transform;
  triggerChange: () => void;
}) {
  return (
    <div>
      <h3 className="mt-2">Transform</h3>

      <h4>Position</h4>
      <div className="flex space-x-3">
        <div className="flex items-center flex-1">
          <span className="mr-2">X</span>
          <InputDrag
            getValue={() => transform.position.x}
            onChange={(value) => {
              transform.position.x = value;
              triggerChange();
            }}
            step={0.5}
          />
        </div>
        <div className="flex items-center flex-1">
          <span className="mr-2">Y</span>
          <InputDrag
            getValue={() => transform.position.y}
            onChange={(value) => {
              transform.position.y = value;
              triggerChange();
            }}
            step={0.5}
          />
        </div>
        <div className="flex items-center flex-1">
          <span className="mr-2">Z</span>
          <InputDrag
            getValue={() => transform.position.z}
            onChange={(value) => {
              transform.position.z = value;
              triggerChange();
            }}
            step={0.5}
          />
        </div>
      </div>

      <h4>Rotation</h4>
      <div className="flex space-x-3">
        <div className="flex items-center flex-1">
          <span className="mr-2">X</span>
          <InputDrag
            getValue={() => transform.rotation.x}
            onChange={(value) => {
              transform.rotation.x = value;
              triggerChange();
            }}
            step={0.5}
          />
        </div>
        <div className="flex items-center flex-1">
          <span className="mr-2">Y</span>
          <InputDrag
            getValue={() => transform.rotation.y}
            onChange={(value) => {
              transform.rotation.y = value;
              triggerChange();
            }}
            step={0.5}
          />
        </div>
        <div className="flex items-center flex-1">
          <span className="mr-2">Z</span>
          <InputDrag
            getValue={() => transform.rotation.z}
            onChange={(value) => {
              transform.rotation.z = value;
              triggerChange();
            }}
            step={0.5}
          />
        </div>
      </div>

      <h4>Scale</h4>
      <div className="flex space-x-3">
        <div className="flex items-center flex-1">
          <span className="mr-2">X</span>
          <InputDrag
            getValue={() => transform.scale.x}
            onChange={(value) => {
              transform.scale.x = value;
              triggerChange();
            }}
            min={0}
            step={0.1}
          />
        </div>
        <div className="flex items-center flex-1">
          <span className="mr-2">Y</span>
          <InputDrag
            getValue={() => transform.scale.y}
            onChange={(value) => {
              transform.scale.y = value;
              triggerChange();
            }}
            min={0}
            step={0.1}
          />
        </div>
        <div className="flex items-center flex-1">
          <span className="mr-2">Z</span>
          <InputDrag
            getValue={() => transform.scale.z}
            onChange={(value) => {
              transform.scale.z = value;
              triggerChange();
            }}
            min={0}
            step={0.1}
          />
        </div>
      </div>
    </div>
  );
}
