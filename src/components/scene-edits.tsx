import { Color } from "@/lib/engine/color";
import { useApp } from "@/state/app-store";

export function SceneEdits() {
  const scene = useApp((state) => state.scene);

  if (!scene) {
    return null;
  }

  return (
    <div>
      <div className="flex gap-2 items-center mt-4">
        <label className="block">Background Color</label>
        <input
          key={scene.id}
          type="color"
          defaultValue={"#" + scene.background.hex.toString(16)}
          onChange={(e) => {
            scene.background = Color.hex(parseInt(e.target.value.slice(1), 16));
          }}
        />
      </div>
    </div>
  );
}
