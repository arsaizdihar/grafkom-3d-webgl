import fragmentShaderSource from "@/shaders/fragment-shader.glsl";
import vertexShaderSource from "@/shaders/vertex-shader.glsl";
import { Program } from "../webgl/program";
import { AnimationRunner } from "./animation";
import { Camera } from "./camera";
import { Mesh } from "./mesh";
import { GLNode } from "./node";
import { Scene } from "./scene";

export class Application {
  public gl;
  public program;
  private time = performance.now();
  private fpsEl;

  constructor(
    public canvas: HTMLCanvasElement,
    private container: Element
  ) {
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
      attributes: ["position", "texcoord", "normal"],
      uniforms: {
        matrix: { type: "uniformMatrix4fv" },
        ambientColor: { type: "uniform4f" },
        diffuseColor: { type: "uniform4f" },
        specularColor: { type: "uniform4f" },
        specularTexture: { type: "texture" },
        normalTexture: { type: "texture" },
        shininess: { type: "uniform1f" },
        materialType: { type: "uniform1i" },
        lightPos: { type: "uniform3f" },
        color: { type: "uniform4f" },
        texture: { type: "uniform1i" },
        viewProjectionMat: { type: "uniformMatrix4fv" },
        normalMat: { type: "uniformMatrix4fv" },
      },
    });

    this.adjustCanvas();
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.fpsEl = document.getElementById("fps")!;

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

  recomputeIfDirty(node: GLNode) {
    if (node.isDirty) {
      node.computeWorldMatrix(false, true);
      node.clean();
    } else {
      node.children.forEach(this.recomputeIfDirty.bind(this));
    }
  }

  render(scene: Scene, camera: Camera, animations: AnimationRunner[] = []) {
    let end = false;
    let lastFps = this.time;
    let frames = 0;
    const runRender: FrameRequestCallback = (time) => {
      this.recomputeIfDirty(scene);

      if (camera.isDirty || camera.isCameraDirty) {
        camera.computeWorldMatrix(true, false);
        camera.computeProjectionMatrix();
        camera.clean();
      }
      this.gl.clearColor(
        scene.background.value[0],
        scene.background.value[1],
        scene.background.value[2],
        scene.background.value[3]
      );
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      const nodes: GLNode[] = [...scene.children];
      this.program.setUniforms({
        viewProjectionMat: [false, camera.viewProjectionMatrix.el],
      });
      this.program.setUniforms({
        lightPos: scene.lightPos.toArray(),
      });
      const delta = time - this.time;
      animations.forEach((runner) => {
        runner.update(delta / 1000);
      });
      frames += 1;
      if (time - lastFps >= 1000) {
        this.fpsEl.textContent = `FPS: ${((frames / (time - lastFps)) * 1000).toFixed(2)}`;
        frames = 0;
        lastFps = time;
      }
      this.time = time;

      // set point thickness
      while (nodes.length) {
        const node = nodes.pop()!;
        if (node instanceof Mesh) {
          this.program.setUniforms(node.material.getUniforms(this.gl));
          this.program.setUniforms({
            matrix: [false, node.worldMatrix.el],
            normalMat: [false, node.worldInvTransposeMatrix.el],
          });
          const geometry = node.geometry;
          this.program.setAttributes(geometry.attributes);
          const texture = node.material.texture;
          this.program.setUniforms({
            texture: [texture.texture],
          });
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
      if (!end) {
        requestAnimationFrame(runRender.bind(this));
      }
    };
    requestAnimationFrame(runRender.bind(this));
    return () => {
      end = true;
    };
  }
}
