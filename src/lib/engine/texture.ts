import { GLImage } from "./image";

export interface TextureOptions {
  image: GLImage;
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
  constructor(private options: TextureOptions, gl: WebGLRenderingContext) {
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    if (options.image.isLoaded) {
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        options.image.image
      );
    } else {
      options.image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          options.image.image
        );
      };
    }
  }
}
