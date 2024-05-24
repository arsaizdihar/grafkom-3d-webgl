import { Mesh } from "@/lib/engine/mesh";
import { useApp } from "@/state/app-store";
import { CameraEdits } from "./camera-edits";
import { LightEdits } from "./light-edits.tsx";
import { MeshEdits } from "./mesh-edits";
import { SceneEdits } from "./scene-edits.tsx";
import { TransformEdits } from "./transform-edits.tsx";
import { Input } from "./ui/input";

export function NodeEdits() {
  const node = useApp((state) => state.focusedNode);
  const rerender = useApp((state) => state.rerenderSceneGraph);

  if (!node) {
    return (
      <>
        <CameraEdits />
        <LightEdits />
        <SceneEdits />
      </>
    );
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
      <TransformEdits
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
