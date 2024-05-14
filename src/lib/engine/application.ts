import fragmentShaderSource from "@/shaders/fragment-shader.glsl";
import vertexShaderSource from "@/shaders/vertex-shader.glsl";
import { Program } from "../webgl/program";
import { Camera } from "./camera";
import { Mesh } from "./mesh";
import { GLNode } from "./node";
import { Scene } from "./scene";

export class Application {
  public gl;
  public program;

  constructor(public canvas: HTMLCanvasElement, private container: Element) {
    const gl = canvas.getContext("webgl");
    if (!gl) {
      throw new Error("WebGL not supported");
    }
    this.gl = gl;
    this.program = new Program({
      gl,
      fragmentShaderSource,
      vertexShaderSource,
      // TODO: use normal for phong material
      attributes: ["position", "texcoord"],
      uniforms: {
        matrix: { type: "uniformMatrix4fv" },
        normalMat: { type: "uniformMatrix4fv" },
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
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.enable(this.gl.CULL_FACE);

    const ro = new ResizeObserver(this.adjustCanvas.bind(this));
    ro.observe(container, { box: "content-box" });
  }

  adjustCanvas() {
    const dw = this.container.clientWidth;
    const dh = this.container.clientHeight;
    if (this.canvas.width !== dw || this.canvas.height !== dh) {
      this.canvas.width = dw;
      this.canvas.height = dh;
      this.gl.viewport(0, 0, dw, dh);
    }
  }

  render(scene: Scene, camera: Camera) {
    this.gl.clearColor(
      scene.background.value[0],
      scene.background.value[1],
      scene.background.value[2],
      scene.background.value[3]
    );
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    const nodes: GLNode[] = [...scene.children];
    this.program.setUniforms({
      normalMat: [false, camera.projectionMatrix.el],
    });
    while (nodes.length) {
      const node = nodes.pop()!;
      if (node instanceof Mesh) {
        this.program.setUniforms(node.material.uniforms);
        this.program.setUniforms({ matrix: [false, node.worldMatrix.el] });
        const geometry = node.geometry;
        this.program.setAttributes(geometry.attributes);
        const texture = node.material.textures[0];
        texture.bind(this.gl);
        if (geometry.indices) {
          this.program.bindIndexBuffer(geometry.indices);
          this.gl.drawElements(
            this.gl.TRIANGLES,
            geometry.indices.data.length,
            this.gl.UNSIGNED_SHORT,
            0
          );
        } else {
          const position = geometry.attributes.position;
          this.gl.drawArrays(this.gl.TRIANGLES, 0, position.count);
        }
      }
      nodes.push(...node.children);
    }
  }
}
