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
      <h3>Edit Transform</h3>
      <InputDrag
        getValue={() => transform.rotation.x}
        onChange={(value) => {
          transform.rotation.x = value;
          triggerChange();
        }}
        step={0.1}
      />
      <InputDrag
        getValue={() => transform.rotation.y}
        onChange={(value) => {
          transform.rotation.y = value;
          triggerChange();
        }}
        step={0.1}
      />
    </div>
  );
}
