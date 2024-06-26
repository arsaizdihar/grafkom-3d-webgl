import basicFragment from "@/shaders/basic/basic-fragment.glsl";
import basicVertex from "@/shaders/basic/basic-vertex.glsl";
import phongFragment from "@/shaders/phong/phong-fragment.glsl";
import phongVertex from "@/shaders/phong/phong-vertex.glsl";
import { BasicMaterial } from "../material/basic-material";
import { PhongMaterial } from "../material/phong-material";
import { Program } from "../webgl/program";
import { AnimationRunner } from "./animation";
import { Camera } from "./camera";
import { Mesh } from "./mesh";
import { GLNode } from "./node";
import { Scene } from "./scene";
import { TextNode } from "./text-node";
import { Vector3 } from "./vector";

export class Application {
  public gl;
  public phongProgram;
  public basicProgram;
  private currentProgram:
    | Application["phongProgram"]
    | Application["basicProgram"];
  private time = performance.now();
  private pressedKeys = new Set<string>();
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
    this.basicProgram = new Program({
      gl,
      fragmentShaderSource: basicFragment,
      vertexShaderSource: basicVertex,
      attributes: ["position", "texcoord"],
      uniforms: {
        matrix: { type: "uniformMatrix4fv" },
        texture: { type: "texture" },
        viewProjectionMat: { type: "uniformMatrix4fv" },
        color: { type: "uniform4f" },
        lightColor: { type: "uniform4f" },
      },
    });
    this.phongProgram = new Program({
      gl,
      fragmentShaderSource: phongFragment,
      vertexShaderSource: phongVertex,
      attributes: ["position", "texcoord", "normal", "tangent", "bitangent"],
      uniforms: {
        matrix: { type: "uniformMatrix4fv" },
        ambientColor: { type: "uniform4f" },
        diffuseColor: { type: "uniform4f" },
        specularColor: { type: "uniform4f" },
        specularTexture: { type: "texture" },
        normalTexture: { type: "texture" },
        shininess: { type: "uniform1f" },
        lightDir: { type: "uniform3f" },
        enableDirLight: { type: "uniform1i" },
        lightColor: { type: "uniform4f" },
        texture: { type: "texture" },
        viewProjectionMat: { type: "uniformMatrix4fv" },
        normalMat: { type: "uniformMatrix4fv" },
        viewPos: { type: "uniform3f" },
        displacementTexture: {
          type: "texture",
        },
        displacementFactor: {
          type: "uniform1f",
        },
        displacementBias: {
          type: "uniform1f",
        },
        cameraPos: {
          type: "uniform3f",
        },
        numLights: {
          type: "uniform1i",
        },
        "lights[0].position": {
          type: "uniform3f",
        },
        "lights[0].color": {
          type: "uniform4f",
        },
        "lights[0].radius": {
          type: "uniform1f",
        },
        "lights[1].position": {
          type: "uniform3f",
        },
        "lights[1].color": {
          type: "uniform4f",
        },
        "lights[1].radius": {
          type: "uniform1f",
        },
        "lights[2].position": {
          type: "uniform3f",
        },
        "lights[2].color": {
          type: "uniform4f",
        },
        "lights[2].radius": {
          type: "uniform1f",
        },
      },
    });
    this.currentProgram = this.phongProgram;

    this.adjustCanvas();
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.fpsEl = document.getElementById("fps")!;

    const ro = new ResizeObserver(this.adjustCanvas.bind(this));
    ro.observe(container, { box: "content-box" });

    window.addEventListener("keydown", (e) => {
      this.pressedKeys.add(e.key);
    });

    window.addEventListener("keyup", (e) => {
      this.pressedKeys.delete(e.key);
    });
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

  restart(scene: Scene) {
    this.container.querySelectorAll("span").forEach((el) => {
      el.remove();
    });
    scene.restart();
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
      const delta = (time - this.time) / 1000;
      animations.forEach((runner) => {
        runner.update(delta);
      });

      let y = 0;
      if (this.pressedKeys.has("ArrowDown")) {
        y = 1;
      } else if (this.pressedKeys.has("ArrowUp")) {
        y = -1;
      }
      let x = 0;
      if (this.pressedKeys.has("ArrowLeft")) {
        x = -1;
      } else if (this.pressedKeys.has("ArrowRight")) {
        x = 1;
      }

      const jump = this.pressedKeys.has(" ");
      scene.updateController(y, x, jump, delta);

      frames += 1;
      if (time - lastFps >= 1000) {
        this.fpsEl.textContent = `FPS: ${((frames / (time - lastFps)) * 1000).toFixed(2)}`;
        frames = 0;
        lastFps = time;
      }
      this.time = time;

      this.setupUniforms(scene, camera);

      // set point thickness
      while (nodes.length) {
        const node = nodes.pop()!;
        if (node instanceof Mesh) {
          const program = node.material.program;
          if (program !== this.currentProgram) {
            this.currentProgram = program;
            this.gl.useProgram(program.program);
            this.setupUniforms(scene, camera);
          }
          if (node.material instanceof PhongMaterial) {
            const program = node.material.program;
            program.setUniforms(node.material.getUniforms(this.gl));
            program.setUniforms({
              matrix: [false, node.worldMatrix.el],
              normalMat: [false, node.worldInvTransposeMatrix.el],
            });
            const geometry = node.geometry;
            program.setAttributes(geometry.attributes);
            const position = geometry.attributes.position;
            this.gl.drawArrays(this.gl.TRIANGLES, 0, position.count);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
          } else if (node.material instanceof BasicMaterial) {
            const program = node.material.program;
            program.setUniforms(node.material.getUniforms(this.gl));
            program.setUniforms({
              matrix: [false, node.worldMatrix.el],
            });
            const geometry = node.geometry;
            program.setAttributes({
              position: geometry.attributes.position,
              texcoord: geometry.attributes.texcoord,
            });
            const position = geometry.attributes.position;
            this.gl.drawArrays(this.gl.TRIANGLES, 0, position.count);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
          }
        } else if (node instanceof TextNode) {
          let el = node.el;
          if (!el) {
            el = document.createElement("span");
            el.className = "absolute select-none block";
            this.container.appendChild(el);
          }
          node.el = el;
          node.update();
          const mat = camera.viewProjectionMatrix
            .clone()
            .multiply(node.worldMatrix);
          const position = mat.applyVector3(new Vector3(0, 0, 0));
          position.x = (position.x / position.z + 1) / 2;
          position.y = (-position.y / position.z + 1) / 2;
          el.style.left = `${position.x * this.container.clientWidth - el.clientWidth / 2}px`;
          el.style.top = `${position.y * this.container.clientHeight - el.clientHeight / 2}px`;
          el.style.fontSize = `${node.fontSize}px`;
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

  private setupUniforms(scene: Scene, camera: Camera) {
    this.currentProgram.setUniforms({
      viewProjectionMat: [false, camera.viewProjectionMatrix.el],
    });
    if (this.currentProgram === this.phongProgram) {
      this.currentProgram.setUniforms({
        cameraPos: camera.position,
        lightDir: scene.directionalDir.toArray(),
        enableDirLight: [scene.onDirectional ? 1 : 0],
        lightColor: scene.directionalColor.value,
        numLights: [scene.lights.length],
      });

      scene.lights.forEach((light, index) => {
        this.currentProgram.setUniforms({
          [`lights[${index}].position`]: light.worldPos.toArray(),
          [`lights[${index}].color`]: light.color.value,
          [`lights[${index}].radius`]: [light.radius],
        });
      });
    }
  }
}
