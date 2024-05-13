import { Application } from "./app";
import { PerspectiveCamera } from "./lib/camera/perspective-camera";
import { Color } from "./lib/engine/color";
import { GLImage } from "./lib/engine/image";
import { Mesh } from "./lib/engine/mesh";
import { Scene } from "./lib/engine/scene";
import { Texture } from "./lib/engine/texture";
import { Vector3 } from "./lib/engine/vector";
import { CubeGeometry } from "./lib/geometry/cube-geometry";
import { BasicMaterial } from "./lib/material/basic-material";
import { Matrix4 } from "./lib/math/m4";
import { degToRad, radToDeg } from "./lib/math/math-utils";
import "./style.css";

const canvasContainer = document.querySelector(".canvas-container")!;
const canvas = canvasContainer.querySelector("canvas")!;
canvas.width = canvasContainer.clientWidth;
canvas.height = canvasContainer.clientHeight;

const app = new Application(canvas);
const scene = new Scene(Color.hex(0x000000));

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

var radio = {
  orthographic: document.getElementById("ortographic") as HTMLInputElement,
  perspective: document.getElementById("perspective") as HTMLInputElement,
  oblique: document.getElementById("oblique") as HTMLInputElement
}

var slider = {
  slider_camera: document.querySelector("#slider-camera") as HTMLInputElement,
  slider_cameraR: document.querySelector("#slider-cameraR") as HTMLInputElement,
  slider_fov: document.querySelector("#slider-fov") as HTMLInputElement,
}

var value = {
  value_camera: document.querySelector("#value-camera") as HTMLElement,
  value_cameraR: document.querySelector("#value-cameraR") as HTMLElement,
  value_fov: document.querySelector("#value-fov") as HTMLElement,
}

// if (slider.value_fov) {
//   (slider.value_fov as HTMLInputElement).oninput = updateFov();
// }

var params = {
  cameraAngleRadians: degToRad(0),
  cameraRadius: 300,
}

radio.perspective.checked = true;

value.value_camera.innerHTML = params.cameraAngleRadians.toString();
slider.slider_camera.value = radToDeg(params.cameraAngleRadians).toString();

value.value_cameraR.innerHTML = params.cameraRadius.toString();
slider.slider_cameraR.value = params.cameraRadius.toString();

const updateCameraAngle = () => {
  return function(event) {
    var angleInDegrees = event.target.value;
    var angleInRadians = degToRad(angleInDegrees);
    if (value.value_camera) {
      value.value_camera.innerHTML = angleInDegrees;
    }

    const eye = new Vector3(0, 0, -params.cameraRadius);

    camera.transform.rotation.y = angleInRadians;
    camera.transform.position = eye;
    camera.computeLocalMatrix();
    camera.computeWorldMatrix();
    camera.computeProjectionMatrix();
    app.render(scene, camera);
  };
}

if (slider.slider_camera) {
  (slider.slider_camera as HTMLInputElement).oninput = updateCameraAngle();
}

// if (slider.slider_cameraR) {
//   (slider.slider_cameraR as HTMLInputElement).oninput = updateCameraR();
// }

const eye = new Vector3(0, 0, -params.cameraRadius);

const camera = new PerspectiveCamera(fovy, aspect, near, far);

scene.addChild(camera);

camera.transform.rotation.set(degToRad(0), degToRad(0), degToRad(0));
camera.transform.position = eye;
camera.computeLocalMatrix();
camera.computeWorldMatrix();
camera.computeProjectionMatrix();

const image = new GLImage("/f-texture.png");
await image.load();
const texture = new Texture({
  image,
  texture: app.gl.createTexture(),
});
// const geometry = new PlaneGeometry(50, 50);
const geometry = new CubeGeometry(30);
const material = new BasicMaterial({
  textures: [texture],
  color: Color.hex(0xffffff),
  id: "basic",
});
const mesh = new Mesh(geometry, material);
// mesh.transform.rotation.y = degToRad(-90);
// mesh.transform.rotation.x = degToRad(-90);
mesh.transform.position.y = 0;
mesh.transform.position.x = 0;
mesh.transform.position.z = -250;
mesh.transform.scale.set(3, 3, 3);
mesh.computeLocalMatrix();
mesh.computeWorldMatrix();
scene.addChild(mesh);

app.render(scene, camera);

setInterval(() => {
  // mesh.transform.rotation.y += 0.03;
  // mesh.transform.rotation.z += 0.1;
  // mesh.computeLocalMatrix();
  // mesh.computeWorldMatrix();
  // camera.transform.rotation.y += 0.01;
  camera.computeLocalMatrix();
  camera.computeWorldMatrix();
  camera.computeProjectionMatrix();
  app.render(scene, camera);
}, 1000 / 30);

// async function fromGLTF() {
//   const json = await fetch("/scenes/cube.json").then((res) => res.json());
//   const [scene, camera] = await loadGLTF(json, app);
//   scene.computeWorldMatrix(false, true);
//   app.render(scene, camera);
//   console.log(scene);
// }

// fromGLTF();
