import { Color } from "@/lib/engine/color";
import { BasicMaterial } from "@/lib/material/basic-material";
import { PhongMaterial } from "@/lib/material/phong-material";
import { ShaderMaterial } from "@/lib/material/shader-material";
import { useReducer, useState } from "react";
import { TextureSelect } from "./texture-select";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { InputDrag } from "./ui/input-drag";

type TextureKey = Extract<keyof PhongMaterial, "texture" | `${string}Texture`>;

export function MaterialEdits({ material }: { material: ShaderMaterial }) {
  const [textureToChange, setTextureToChange] = useState<null | TextureKey>();
  const [_, rerender] = useReducer((x) => !x, false);

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="flex flex-col gap-2 mt-4">
      <h2 className="font-semibold underline">Material Type: {capitalizeFirstLetter(material.type)} Material</h2>
      <div className="flex gap-4 items-center">
        <label className="block font-semibold">Texture</label>
        {material.texture && <div>{material.texture.toString()}</div>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button 
          size={"md"}
          onClick={() => setTextureToChange("texture")}
        >
          {material.texture ? "Change" : "Add"}
        </Button>
        {material.texture && (
          <Button
            variant={"destructive"}
            onClick={() => {
              material.texture = undefined;
              rerender();
            }}
          >
            Remove
          </Button>
        )}
      </div>
      {material instanceof BasicMaterial && (
        <div className="flex flex-col gap-2">
          <label className="block font-semibold">Texture Color</label>
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
            <label className="block">Texture</label>
            {material.specularTexture && (
              <div>{material.specularTexture.toString()}</div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => setTextureToChange("specularTexture")}>
              {material.specularTexture ? "Change" : "Add"}
            </Button>
            {material.specularTexture && (
              <Button
                variant={"destructive"}
                onClick={() => {
                  material.specularTexture = undefined;
                  rerender();
                }}
              >
                Remove
              </Button>
            )}
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
          <div className="flex gap-4 items-center">
            <label className="block">Normal</label>
            {material.normalTexture && (
              <div>{material.normalTexture.toString()}</div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => setTextureToChange("normalTexture")}>
              {material.normalTexture ? "Change" : "Add"}
            </Button>
            {material.normalTexture && (
              <Button
                variant={"destructive"}
                onClick={() => {
                  material.normalTexture = undefined;
                  rerender();
                }}
              >
                Remove
              </Button>
            )}
          </div>
          <div className="flex gap-4 items-center">
            <label className="block">Displacement</label>
            {material.displacementTexture && (
              <div>{material.displacementTexture.toString()}</div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => setTextureToChange("displacementTexture")}>
              {material.displacementTexture ? "Change" : "Add"}
            </Button>
            {material.displacementTexture && (
              <Button
                variant={"destructive"}
                onClick={() => {
                  material.displacementTexture = undefined;
                  rerender();
                }}
              >
                Remove
              </Button>
            )}
          </div>
          <div className="flex gap-4 items-center">
            <label className="block">Displacement Factor</label>
            <InputDrag
              getValue={() => material.displacementFactor}
              onChange={(value) => {
                material.displacementFactor = value;
              }}
              min={0}
              step={0.1}
            />
          </div>
          <div className="flex gap-4 items-center">
            <label className="block">Displacement Bias</label>
            <InputDrag
              getValue={() => material.displacementBias}
              onChange={(value) => {
                material.displacementBias = value;
              }}
            />
          </div>
        </>
      )}
      <Dialog
        open={!!textureToChange}
        onOpenChange={(open) => {
          if (!open) {
            setTextureToChange(null);
          }
        }}
      >
        <DialogContent>
          <TextureSelect
            onSelect={(texture) => {
              if (textureToChange && textureToChange in material) {
                // @ts-expect-error its ok
                material[textureToChange] = texture;
                setTextureToChange(null);
              }
            }}
            // @ts-expect-error its ok
            currentTexture={material[textureToChange ?? "texture"]}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
