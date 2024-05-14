import { Mesh } from "@/lib/engine/mesh";
import { useApp } from "@/state/app-store";
import { MeshEdits } from "./mesh-edits";
import { TransformEdit } from "./transform-edit";

export function NodeEdits() {
  const node = useApp((state) => state.focusedNode);
  const rerender = useApp((state) => state.rerenderReact);

  if (!node) {
    return null;
  }

  return (
    <div>
      <div>
        <label className="block">Name</label>
        <input
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
