import { Camera } from "./lib/engine/camera";
import { Scene } from "./lib/engine/scene";
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
      attributes: ["position", "texcoord"],
      uniforms: {
        normal: { type: "uniform3f" },
        matrix: { type: "uniformMatrix4fv" },
        normalMat: { type: "uniformMatrix3fv" },
        ambientColor: { type: "uniform4f" },
        diffuseColor: { type: "uniform4f" },
        specularColor: { type: "uniform4f" },
        shininess: { type: "uniform1f" },
        materialType: { type: "uniform1i" },
        lightDirection: { type: "uniform3f" },
        color: { type: "uniform4f" },
        texture: { type: "uniform1i" },
      },
    });

    this.adjustCanvas();
    const ro = new ResizeObserver(this.adjustCanvas.bind(this));
    ro.observe(canvas, { box: "content-box" });
  }

  adjustCanvas() {
    const dw = this.canvas.clientWidth;
    const dh = this.canvas.clientHeight;
    if (this.canvas.width !== dw || this.canvas.height !== dh) {
      this.canvas.width = dw;
      this.canvas.height = dh;
      this.gl.viewport(0, 0, dw, dh);
    }
  }

  render(scene: Scene, camera: Camera) {
    this.gl.clearColor(1, 1, 1, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
