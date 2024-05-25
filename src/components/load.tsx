import { Scene } from "@/lib/engine/scene";
import { loadGLTF } from "@/lib/gltf/loader";
import { saveGLTF } from "@/lib/gltf/saver";
import { useApp } from "@/state/app-store";
import { useRef } from "react";
import { Button } from "./ui/button";

export function Load() {
  const fileRef = useRef<HTMLInputElement>(null);
  const { app, setAnimations, setScene, setFocusedNode } = useApp((state) => ({
    app: state.app,
    setScene: state.setScene,
    setAnimations: state.setAnimations,
    setFocusedNode: state.setFocusedNode,
  }));
  return (
    <div className="mt-5 flex gap-2">
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          if (!app) {
            return;
          }
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = async () => {
            try {
              const data = reader.result as string;
              const [scene, animations] = await loadGLTF(JSON.parse(data), app);
              setScene(scene as Scene);
              setAnimations(animations);
              setFocusedNode(null);
            } catch (e) {
              console.error(e);
            }
          };
          reader.readAsText(file);
        }}
        accept=".json"
      />
      <Button
        size={"md"}
        onClick={() => {
          fileRef.current?.click();
        }}
        className="flex-1 text-center"
      >
        Load
      </Button>

      <Button
        size={"md"}
        onClick={async () => {
          const { scene, animations } = useApp.getState();
          if (!scene) return;
          const json = await saveGLTF(scene, animations);
          const a = document.createElement("a");
          const file = new Blob([JSON.stringify(json, null, 2)], {
            type: "application/json",
          });
          a.href = URL.createObjectURL(file);

          a.download = "scene.json";
          a.click();
        }}
        className="flex-1 text-center"
      >
        Save
      </Button>
    </div>
  );
}
