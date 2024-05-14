import { ObliqueCamera } from "./lib/camera/oblique-camera";
import { OrthographicCamera } from "./lib/camera/orthographic-camera";
import { PerspectiveCamera } from "./lib/camera/perspective-camera";
import { Application } from "./lib/engine/application";
import { Camera } from "./lib/engine/camera";
import { Color } from "./lib/engine/color";
import { GLImage } from "./lib/engine/image";
import { Mesh } from "./lib/engine/mesh";
import { Scene } from "./lib/engine/scene";
import { Texture } from "./lib/engine/texture";
import { Vector3 } from "./lib/engine/vector";
import { CubeGeometry } from "./lib/geometry/cube-geometry";
import { BasicMaterial } from "./lib/material/basic-material";
import { degToRad } from "./lib/math/math-utils";

export async function debugApp(app: Application) {
  const scene = new Scene(Color.hex(0xf9f9f9));
  const canvas = app.canvas;

  /* Projection */
  const left = canvas.width * -0.5;
  const right = canvas.width * 0.5;
  const bottom = canvas.height * 0.5;
  const top = canvas.height * -0.5;
  const near = 10;
  const far = 2000;

  const aspect = canvas.clientWidth / canvas.clientHeight;

  const params = {
    projection: "perspective", // ni keknya bisa gausah pake string
    cameraAngleRadians: degToRad(0),
    cameraRadius: 200,

    fovy: 45, // in degrees
  };

  const eye = new Vector3(0, 0, -params.cameraRadius);

  const cameraPerspective = new PerspectiveCamera(
    degToRad(params.fovy),
    aspect,
    near,
    far
  );
  const cameraOrthographic = new OrthographicCamera(
    canvas.width * -0.5,
    canvas.width * 0.5,
    canvas.height * 0.5,
    canvas.height * -0.5,
    near,
    far
  );
  const cameraOblique = new ObliqueCamera(
    left,
    right,
    bottom,
    top,
    near,
    far,
    0,
    45
  );

  let camera: Camera = cameraPerspective;

  scene.addChild(camera);

  camera.transform.rotation.set(degToRad(0), degToRad(0), degToRad(0));
  camera.transform.position = eye;
  // camera.computeLocalMatrix();
  // camera.computeWorldMatrix();
  // camera.computeProjectionMatrix();

  const image = new GLImage("/f-texture.png");
  await image.load();
  const texture = new Texture({
    image,
    texture: app.gl.createTexture(),
    generateMipmaps: true,
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
  mesh.transform.rotation.x = degToRad(-45);
  mesh.transform.position.y = 0;
  mesh.transform.position.x = 0;
  mesh.transform.position.z = -250;
  mesh.transform.scale.set(3, 3, 3);
  mesh.computeLocalMatrix();
  mesh.computeWorldMatrix();

  scene.addChild(mesh);

  return [scene, camera] as const;

  // app.render(scene, camera);

  // setInterval(() => {
  //   // mesh.transform.rotation.y += 0.03;
  //   // mesh.transform.rotation.z += 0.1;
  //   // mesh.computeLocalMatrix();
  //   // mesh.computeWorldMatrix();
  //   // camera.transform.rotation.y += 0.01;
  //   scene.computeWorldMatrix(false, true);
  //   camera.computeLocalMatrix();
  //   camera.computeWorldMatrix();
  //   camera.computeProjectionMatrix();
  //   app.render(scene, camera);
  // }, 1000 / 30);
}
