import { Color } from "./color";
import { GLImage } from "./image";

export type TextureOptions = {
  image?: GLImage;
  wrapS?: number;
  wrapT?: number;
  magFilter?: number;
  minFilter?: number;
  // format?: WebGLTexture;
  // type: WebGLType;
  generateMipmaps?: boolean;
  color?: Color;
};

export class Texture {
  private static white: Texture;
  public texture;
  constructor(
    private options: TextureOptions,
    gl: WebGLRenderingContext
  ) {
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    if (this.options.image) {
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
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        this.image!.image
      );
    } else if (this.options.color) {
      const color = this.options.color;
      const data = new Uint8Array(color.value.map((v) => v * 255));
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        data
      );
      gl.bindTexture(gl.TEXTURE_2D, null);
    } else {
      throw new Error("Texture must have image or color");
    }
  }

  get image() {
    return this.options.image;
  }

  get wrapS() {
    return this.options.wrapS;
  }

  get wrapT() {
    return this.options.wrapT;
  }

  get magFilter() {
    return this.options.magFilter;
  }

  get minFilter() {
    return this.options.minFilter;
  }

  get generateMipmaps() {
    return this.options.generateMipmaps;
  }

  static WHITE(gl: WebGLRenderingContext) {
    if (!Texture.white) {
      Texture.white = new Texture(
        {
          color: Color.hex(0xffffff),
          generateMipmaps: true,
        },
        gl
      );
    }
    return Texture.white;
  }
}
