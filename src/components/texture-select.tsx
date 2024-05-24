import { Color } from "@/lib/engine/color";
import { Texture } from "@/lib/engine/texture";
import { useApp } from "@/state/app-store";
import { Button } from "./ui/button";

export function TextureSelect({
  onSelect,
  currentTexture,
}: {
  onSelect: (texture: Texture) => void;
  currentTexture?: Texture;
}) {
  const scene = useApp((state) => state.scene);
  const app = useApp((state) => state.app);

  if (!scene || !app) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap text-sm gap-4">
        {scene.textures.map((texture, idx) => (
          <Button
            key={idx}
            className="w-40 h-auto p-1"
            onClick={() => onSelect(texture)}
            disabled={currentTexture === texture}
          >
            {texture.color ? (
              <>
                Color{" "}
                <span
                  style={{ backgroundColor: texture.color.hexString }}
                  className="w-4 h-4 inline-block rounded-full"
                ></span>
              </>
            ) : (
              "Image texture"
            )}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => {
            const newTexture = new Texture(
              { color: Color.hex(0xffffff) },
              app.gl
            );
            scene.textures.push(newTexture);
            onSelect(newTexture);
          }}
        >
          New Texture
        </Button>
      </div>
    </div>
  );
}
