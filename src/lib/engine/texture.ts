import { GLImage } from "./image";

export interface TextureOptions {
  image: GLImage;
  texture: WebGLTexture | null;
  wrapS?: number;
  wrapT?: number;
  magFilter?: number;
  minFilter?: number;
  // format?: WebGLTexture;
  // type: WebGLType;
  generateMipmaps?: boolean;
}

export class Texture {
  constructor(private options: TextureOptions) {}

  get image() {
    return this.options.image;
  }

  get texture() {
    return this.options.texture;
  }

  bind(gl: WebGLRenderingContext) {
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    if (this.options.generateMipmaps) {
      gl.generateMipmap(gl.TEXTURE_2D);
    }
    if (this.options.wrapS !== undefined) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.options.wrapS);
    }

    if (this.options.wrapT !== undefined) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.options.wrapT);
    }

    if (this.options.magFilter !== undefined) {
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MAG_FILTER,
        this.options.magFilter
      );
    }

    if (this.options.minFilter !== undefined) {
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        this.options.minFilter
      );
    }
  }
}
