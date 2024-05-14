import { Mesh } from "@/lib/engine/mesh";
import { useApp } from "@/state/app-store";
import { MeshEdits } from "./mesh-edits";
import { TransformEdit } from "./transform-edit";
import { Input } from "./ui/input";
import { CameraEdits } from "./camera-edits";
import { Button } from "./ui/button";

export function NodeEdits() {
  const node = useApp((state) => state.focusedNode);
  const rerender = useApp((state) => state.rerenderReact);

  if (!node) {
    return <CameraEdits />;
  }

  return (
    <div>
      <div>
        <label className="block">Name</label>
        <Input
          key={node.id}
          type="text"
          defaultValue={node.name}
          onChange={(e) => {
            node.name = e.target.value;
            rerender();
          }}
        />
      </div>
      <TransformEdit
        key={node.id + "transform"}
        transform={node.transform}
        triggerChange={() => {
          node.dirty();
        }}
      />
      {node instanceof Mesh && <MeshEdits mesh={node} key={node.id + "mesh"} />}
    </div>
  );
}
