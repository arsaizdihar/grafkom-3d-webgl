import { GLImage } from "@/lib/engine/image";
import { Texture } from "@/lib/engine/texture";
import { useApp } from "@/state/app-store";
import { useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function TextureSelect({
  onSelect,
  currentTexture,
}: {
  onSelect: (texture: Texture) => void;
  currentTexture?: Texture;
}) {
  const scene = useApp((state) => state.scene);
  const app = useApp((state) => state.app);
  const urlRef = useRef<HTMLInputElement>(null);

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
                  className="w-6 h-6 inline-block rounded-full ml-2"
                ></span>
              </>
            ) : (
              <>
                Image{" "}
                <img
                  src={texture.image!.src}
                  width={24}
                  height={24}
                  className="w-6 h-6 inline-block ml-2 object-contain"
                />
              </>
            )}
          </Button>
        ))}
      </div>
      <Input type="text" name="url" ref={urlRef} placeholder="New Image URL" />
      <div className="flex flex-col">
        <Button
          onClick={async () => {
            const url = urlRef.current?.value;
            if (!url) {
              return;
            }
            const image = new GLImage(url);
            try {
              await image.load();
              const newTexture = new Texture({ image }, app.gl);
              scene.textures.push(newTexture);
              onSelect(newTexture);
            } catch (e) {
              alert("Failed to load image");
            }
          }}
        >
          New Texture
        </Button>
      </div>
    </div>
  );
}
