import { Color } from "@/lib/engine/color";
import { BasicMaterial } from "@/lib/material/basic-material";
import { PhongMaterial } from "@/lib/material/phong-material";
import { ShaderMaterial } from "@/lib/material/shader-material";
import { InputDrag } from "./ui/input-drag";

export function MaterialEdits({ material }: { material: ShaderMaterial }) {
  return (
    <div className="flex flex-col gap-2 mt-4">
      <h2>{material.type} material</h2>
      {material instanceof BasicMaterial && (
        <div className="flex gap-4 items-center">
          <label className="block">Color</label>
          <input
            type="color"
            defaultValue={material.color.hexString}
            onChange={(e) => {
              material.color = Color.hexString(e.target.value);
            }}
          />
        </div>
      )}
      {material instanceof PhongMaterial && (
        <>
          <div className="flex gap-4 items-center">
            <label className="block">Ambient</label>
            <input
              type="color"
              defaultValue={material.ambient.hexString}
              onChange={(e) => {
                material.ambient = Color.hexString(e.target.value);
              }}
            />
          </div>
          <div className="flex gap-4 items-center">
            <label className="block">Diffuse</label>
            <input
              type="color"
              defaultValue={material.diffuse.hexString}
              onChange={(e) => {
                material.diffuse = Color.hexString(e.target.value);
              }}
            />
          </div>
          <div className="flex gap-4 items-center">
            <label className="block">Specular</label>
            <input
              type="color"
              defaultValue={material.specular.hexString}
              onChange={(e) => {
                material.specular = Color.hexString(e.target.value);
              }}
            />
          </div>
          <div className="flex gap-4 items-center">
            <label className="block">Shininess</label>
            <InputDrag
              getValue={() => material.shininess}
              onChange={(value) => {
                material.shininess = value;
              }}
              min={0}
              max={100}
            />
          </div>
        </>
      )}
    </div>
  );
}
