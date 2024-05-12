import { Application } from "./app";
import { OrthographicCamera } from "./lib/camera/orthographic-camera";
import { Color } from "./lib/engine/color";
import { GLImage } from "./lib/engine/image";
import { Mesh } from "./lib/engine/mesh";
import { GLNode } from "./lib/engine/node";
import { Scene } from "./lib/engine/scene";
import { Texture } from "./lib/engine/texture";
import { PlaneGeometry } from "./lib/geometry/plane-geometry";
import { BasicMaterial } from "./lib/material/basic-material";
import "./style.css";

const canvasContainer = document.querySelector(".canvas-container")!;
const canvas = canvasContainer.querySelector("canvas")!;
canvas.width = canvasContainer.clientWidth;
canvas.height = canvasContainer.clientHeight;

const app = new Application(canvas);
const rootNode = new GLNode();
const scene = new Scene(rootNode);
const camera = new OrthographicCamera(
  canvas.width * -0.5,
  canvas.width * 0.5,
  canvas.height * 0.5,
  canvas.height * -0.5,
  -10,
  10
);
rootNode.addChild(camera);
const texture = new Texture({ image: new GLImage("/f-texture.png") }, app.gl);
const geometry = new PlaneGeometry(50, 50);
const material = new BasicMaterial({
  textures: [texture],
  color: Color.hex(0xffffff),
  id: "basic",
});
const mesh = new Mesh(geometry, material);
mesh.transform.rotation.x = Math.PI / 2;
mesh.transform.position.y = 25;
mesh.transform.position.x = 25;
mesh.transform.position.z = 0;
mesh.computeLocalMatrix();
mesh.computeWorldMatrix();
rootNode.addChild(mesh);

setInterval(() => {
  mesh.transform.rotation.y += 0.03;
  mesh.transform.rotation.z += 0.1;
  mesh.computeLocalMatrix();
  mesh.computeWorldMatrix();
  app.render(scene, camera);
}, 1000 / 30);
