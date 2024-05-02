import { Program } from "./lib/webgl/program";
import fragmentShaderSource from "./shaders/fragment-shader.glsl";
import vertexShaderSource from "./shaders/vertex-shader.glsl";

export class Application {
  public gl;
  public program;

  constructor(public canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl");
    if (!gl) {
      throw new Error("WebGL not supported");
    }
    this.gl = gl;
    this.program = new Program({
      gl,
      fragmentShaderSource,
      vertexShaderSource,
      attributes: {
        position: {
          size: 3,
        },
      },
      uniforms: {
        color: {
          type: "uniform4f",
        },
      },
    });
  }

  draw() {
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.program.setUniforms({ color: [1, 0, 0, 1] });

    this.program.bindBufferStaticDraw(
      this.program.a.position.buffer,
      [-1, -1, 0, 1, -1, 0, 0, 1, 0]
    );
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }
}
