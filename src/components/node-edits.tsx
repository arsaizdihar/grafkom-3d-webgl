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
        <hr className="border-slate-400 my-4" />
        <LightEdits />
        <SceneEdits />
        <hr className="border-slate-400 my-4" />
      </>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-2">
        <label className="block font-semibold">Name</label>
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
      <hr className="border-slate-400 my-4" />
      <TransformEdits
        key={node.id + "transform"}
        transform={node.transform}
        triggerChange={() => {
          node.dirty();
        }}
      />
      <hr className="border-slate-400 my-4" />
      {node instanceof Mesh && <MeshEdits mesh={node} key={node.id + "mesh"} />}
      <hr className="border-slate-400 my-4" />
    </div>
  );
}
