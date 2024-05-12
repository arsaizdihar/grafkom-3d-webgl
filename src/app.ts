import { Camera } from "./lib/engine/camera";
import { Mesh } from "./lib/engine/mesh";
import { GLNode } from "./lib/engine/node";
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
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    const nodes: GLNode[] = [scene.rootNode];
    this.program.setUniforms({
      normalMat: [false, camera.projectionMatrix.el],
    });
    while (nodes.length) {
      const node = nodes.pop()!;
      if (node instanceof Mesh) {
        this.program.setUniforms(node.material.uniforms);
        this.program.setUniforms({ matrix: [false, node.worldMatrix.el] });
        this.program.setAttributes(node.geometry.attributes);
        const texture = node.material.textures[0];
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture.texture);
        this.gl.texImage2D(
          this.gl.TEXTURE_2D,
          0,
          this.gl.RGBA,
          this.gl.RGBA,
          this.gl.UNSIGNED_BYTE,
          texture.image.image
        );
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
      }
      nodes.push(...node.children);
    }
  }
}
