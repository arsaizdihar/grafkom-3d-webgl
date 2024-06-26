import { Light } from "@/lib/engine/light.ts";
import { Mesh } from "@/lib/engine/mesh";
import { TextNode } from "@/lib/engine/text-node.ts";
import { PointLight } from "@/lib/light/point-light.ts";
import { useApp } from "@/state/app-store";
import { CameraEdits } from "./camera-edits";
import { LightEdits } from "./light-edits.tsx";
import { MeshEdits } from "./mesh-edits";
import { SceneEdits } from "./scene-edits.tsx";
import { SceneLightEdits } from "./scene-light-edits.tsx";
import { TextEdits } from "./text-edits.tsx";
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
        <SceneLightEdits />
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
      {node instanceof Mesh && !(node instanceof Light) && (
        <MeshEdits mesh={node} key={node.id + "mesh"} />
      )}
      {node instanceof PointLight && (
        <LightEdits light={node} key={node.id + "light"} />
      )}
      {node instanceof TextNode && (
        <TextEdits node={node} key={node.id + "text"} />
      )}
      <hr className="border-slate-400 my-4" />
    </div>
  );
}
