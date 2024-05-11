import { WebGLType } from "../webgl/types";

export interface TextureOptions {
  // TODO: change image to Image rather than string
  image: string;
  wrapS: number;
  wrapT: number;
  magFilter: number;
  minFilter: number;
  format: WebGLTexture;
  type: WebGLType;
  generateMipmaps: boolean;
}

export class Texture {}
