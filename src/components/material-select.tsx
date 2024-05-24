import { Color } from "@/lib/engine/color";
import { BasicMaterial } from "@/lib/material/basic-material";
import { PhongMaterial } from "@/lib/material/phong-material";
import { ShaderMaterial } from "@/lib/material/shader-material";
import { useApp } from "@/state/app-store";
import { Button } from "./ui/button";

export function MaterialSelect({
  onSelect,
  currentMaterial,
}: {
  onSelect: (material: ShaderMaterial) => void;
  currentMaterial?: ShaderMaterial;
}) {
  const scene = useApp((state) => state.scene);
  const app = useApp((state) => state.app);

  if (!scene || !app) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap text-sm gap-4">
        {scene.materials.map((mat) => (
          <Button
            key={mat.id}
            className="w-40 h-auto p-1"
            onClick={() => onSelect(mat)}
            disabled={currentMaterial === mat}
          >
            {mat.id} - {mat.type}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => {
            const newMaterial = new BasicMaterial(
              {
                color: Color.hex(0xffffff),
              },
              app.basicProgram
            );
            scene.materials.push(newMaterial);
            onSelect(newMaterial);
          }}
        >
          New Basic Material
        </Button>
        <Button
          onClick={() => {
            const newMaterial = new PhongMaterial(
              {
                ambient: Color.hex(0x000000),
                diffuse: Color.hex(0xffffff),
                shininess: 100,
                specular: Color.hex(0xffffff),
              },
              app.phongProgram
            );
            scene.materials.push(newMaterial);
          }}
        >
          New Phong Material
        </Button>
      </div>
    </div>
  );
}
