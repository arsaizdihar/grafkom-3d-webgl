import { GLImage } from "./image";

export interface TextureOptions {
  image: GLImage;
  texture: WebGLTexture | null;
  // wrapS: number;
  // wrapT: number;
  // magFilter: number;
  // minFilter: number;
  // format: WebGLTexture;
  // type: WebGLType;
  // generateMipmaps: boolean;
}

export class Texture {
  public texture: WebGLTexture | null;
  public image: GLImage;
  constructor(options: TextureOptions) {
    this.texture = options.texture;
    this.image = options.image;
  }
}
