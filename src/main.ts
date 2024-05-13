import { Application } from "./app";
import { PerspectiveCamera } from "./lib/camera/perspective-camera";
import { Color } from "./lib/engine/color";
import { GLImage } from "./lib/engine/image";
import { Mesh } from "./lib/engine/mesh";
import { GLNode } from "./lib/engine/node";
import { Scene } from "./lib/engine/scene";
import { Texture } from "./lib/engine/texture";
import { Vector3 } from "./lib/engine/vector";
import { PlaneGeometry } from "./lib/geometry/plane-geometry";
import { BasicMaterial } from "./lib/material/basic-material";
import { Matrix4 } from "./lib/math/m4";
import { degToRad } from "./lib/math/math-utils";
import "./style.css";

const canvasContainer = document.querySelector(".canvas-container")!;
const canvas = canvasContainer.querySelector("canvas")!;
canvas.width = canvasContainer.clientWidth;
canvas.height = canvasContainer.clientHeight;

const app = new Application(canvas);
const rootNode = new GLNode();
const scene = new Scene(rootNode);

/* Projection */
const left = canvas.width * -0.5;
const right = canvas.width * 0.5;
const bottom = canvas.height * 0.5;
const top = canvas.height * -0.5;
const near = 10;
const far = 2000;

const aspect = canvas.clientWidth / canvas.clientHeight;
const fovy = degToRad(45);

// const camera = new OrthographicCamera(
//   canvas.width * -0.5,
//   canvas.width * 0.5,
//   canvas.height * 0.5,
//   canvas.height * -0.5,
//   -10,
//   10
// );
// const camera = new ObliqueCamera(
//   left,
//   right,
//   bottom,
//   top,
//   near,
//   far,
//   0,
//   45
// );
const camera = new PerspectiveCamera(
  fovy,
  aspect,
  near,
  far
);

const radius = 200;
 
const cameraAngleRadians = degToRad(10);

const eye = new Vector3(0, 0, radius);
const target = new Vector3(0, 0, 0);
const up = new Vector3(0, 1, 0);

// Compute a matrix for the camera
let cameraMatrix = Matrix4.identity();

console.log(cameraMatrix);
console.log(Matrix4.yRotation(cameraAngleRadians).el);
cameraMatrix = cameraMatrix.multiply(Matrix4.yRotation(cameraAngleRadians));
console.log(cameraMatrix.el)

cameraMatrix = Matrix4.translate(cameraMatrix, eye.x, eye.y, eye.z);

const cameraPos = new Vector3(
  cameraMatrix.el[12],
  cameraMatrix.el[13],
  cameraMatrix.el[14]
);

cameraMatrix.lookAt(cameraPos, target, up);

// // Make a view matrix from the camera matrix
// const viewMatrix = Matrix4.invert(cameraMatrix);

// // Compute a view projection matrix
// const viewProjectionMatrix = Matrix4.multiply(camera.projectionMatrix, viewMatrix);

// camera.viewProjectionMatrix = viewProjectionMatrix;

// camera.projectionMatrix = camera
camera.computeLocalMatrix();
camera.computeWorldMatrix();
camera.computeProjectionMatrix();

rootNode.addChild(camera);
const image = new GLImage("/f-texture.png");
await image.load();
const texture = new Texture({
  image,
  texture: app.gl.createTexture(),
});
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
mesh.transform.position.z = -100;
mesh.transform.scaling.set(3, 3, 3);
mesh.computeLocalMatrix();
mesh.computeWorldMatrix();
rootNode.addChild(mesh);

app.render(scene, camera);

// setInterval(() => {
//   mesh.transform.rotation.y += 0.03;
//   mesh.transform.rotation.z += 0.1;
//   mesh.computeLocalMatrix();
//   mesh.computeWorldMatrix();
//   app.render(scene, camera);
// }, 1000 / 30);
