import { OrthographicCamera } from "./lib/camera/orthographic-camera";
import { Camera } from "./lib/engine/camera";
import { Node as GLNode } from "./lib/engine/node";
import { Scene } from "./lib/engine/scene";
import { Program } from "./lib/webgl/program";
import fragmentShaderSource from "./shaders/fragment-shader.glsl";
import vertexShaderSource from "./shaders/vertex-shader.glsl";

export class Application {
  public gl;
  public program;
  public scene: Scene;
  public camera: Camera;

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
      attributes: ["position", "vertexColor"],
      uniforms: {},
    });
    this.adjustCanvas();
    const ro = new ResizeObserver(this.adjustCanvas.bind(this));
    ro.observe(canvas, { box: "content-box" });
    const rootNode = new GLNode();
    this.scene = new Scene(rootNode);
    this.camera = new OrthographicCamera(-1, 1, -1, 1, -1, 1);
    rootNode.addChild(this.camera);
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

  draw() {
    this.gl.clearColor(1, 1, 1, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
