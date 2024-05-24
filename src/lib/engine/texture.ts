import { Color } from "./color";
import { GLImage } from "./image";

export type TextureOptions = {
  image?: GLImage;
  color?: Color;
};

function isPowerOf2(value: number) {
  return (value & (value - 1)) === 0;
}

export class Texture {
  private static white: Texture;
  private static normal: Texture;
  private static black: Texture;
  public texture;
  constructor(
    private options: TextureOptions,
    gl: WebGLRenderingContext
  ) {
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    if (this.options.image) {
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        this.image!.image
      );
      if (
        this.options.image.height === this.options.image.width &&
        isPowerOf2(this.options.image.height)
      ) {
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
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

  get color() {
    return this.options.color;
  }

  static WHITE(gl: WebGLRenderingContext) {
    if (!Texture.white) {
      Texture.white = new Texture(
        {
          color: Color.hex(0xffffff),
        },
        gl
      );
    }
    return Texture.white;
  }

  static NORMAL(gl: WebGLRenderingContext) {
    if (!Texture.normal) {
      Texture.normal = new Texture(
        {
          color: Color.hex(0x8080ff),
        },
        gl
      );
    }
    return Texture.normal;
  }

  static BLACK(gl: WebGLRenderingContext) {
    if (!Texture.black) {
      Texture.black = new Texture(
        {
          color: Color.hex(0x000000),
        },
        gl
      );
    }
    return Texture.black;
  }

  toString() {
    return `Texture(${this.options.image?.src ?? this.options.color?.hexString})`;
  }
}
