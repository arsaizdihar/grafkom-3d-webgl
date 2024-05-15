import { useApp } from "@/state/app-store";
import { Dropdown } from "./ui/dropdown";
import { PerspectiveCamera } from "@/lib/camera/perspective-camera";
import { degToRad, radToDeg } from "@/lib/math/math-utils";
import { OrthographicCamera } from "@/lib/camera/orthographic-camera";
import { ObliqueCamera } from "@/lib/camera/oblique-camera";
import { useEffect, useState } from "react";
import { Slider } from "./ui/slider";
import { Matrix4 } from "@/lib/math/m4";
import { Vector3 } from "@/lib/engine/vector";
import { GLNode } from "@/lib/engine/node";

export function CameraEdits() {
  const { app, currentCamera, setCurrentCamera, focusedNode } = useApp((state) => ({
    app: state.app,
    currentCamera: state.currentCamera,
    setCurrentCamera: state.setCurrentCamera,
    focusedNode: state.focusedNode
  }));

  const [params, setParams] = useState({
    fovy: 60,
    aspect: 0,
    near: 1,
    far: 2000,

    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    
    theta: degToRad(75),
    phi: degToRad(75),

    cameraAngleRadians: 0,
    cameraRadius: 200,

    zPos: 1
  });

  useEffect(() => {
    if (app?.canvas) {
      setParams((prevParams) => ({
        ...prevParams,
        left: app.canvas.width * -0.5,
        right: app.canvas.width * 0.5,
        top: app.canvas.height * 0.5,
        bottom: app.canvas.height * -0.5,
        aspect: app.canvas.width / app.canvas.height,
      }));
    }
  }, [app]);

  const [node, setNode] = useState(new GLNode());

  useEffect(() => {
    const angleInRadians = degToRad(params.cameraAngleRadians);
    const zPos = params.zPos;

    if (currentCamera) {
      node.transform.rotation.y = params.cameraAngleRadians;

      // zPos
      if (currentCamera instanceof PerspectiveCamera) {
        currentCamera.transform.position.z = zPos * 500;
      } else if (
        currentCamera instanceof OrthographicCamera ||
        currentCamera instanceof ObliqueCamera
      ) {
        currentCamera.transform.position.z = zPos * 100;
      }

      currentCamera.dirty();
    }
  }, [params.cameraAngleRadians, params.zPos]);

  const cameraTypes = [
    { value: "Perspective", label: "Perspective" },
    { value: "Orthographic", label: "Orthographic" },
    { value: "Oblique", label: "Oblique" },
  ];

  const handleChange = (value: string | number) => {
    if (value === "Perspective") {
      const cameraPerspective = new PerspectiveCamera(
        degToRad(params.fovy),
        params.aspect,
        params.near,
        params.far
      );
      node.addChild(cameraPerspective);
      node.computeWorldMatrix(false, true);
      cameraPerspective.transform.position.z = 500;
      node.transform.rotation.y = params.cameraAngleRadians;

      setNode(node);
      // cameraPerspective.transform.rotation.y = params.cameraAngleRadians;
      cameraPerspective.dirty();
      setCurrentCamera(cameraPerspective);
    } else if (value === "Orthographic") {
      const cameraOrthographic = new OrthographicCamera(
        params.left,
        params.right,
        params.top,
        params.bottom,
        params.near,
        params.far
      );
      // cameraOrthographic.transform.position.z = 100;
      // cameraOrthographic.transform.rotation.y = params.cameraAngleRadians;
      node.addChild(cameraOrthographic);
      node.computeWorldMatrix(false, true);
      cameraOrthographic.transform.position.z = 100;
      node.transform.rotation.y = params.cameraAngleRadians;
      cameraOrthographic.dirty();
      setCurrentCamera(cameraOrthographic);
    } else if (value === "Oblique") {
      const cameraOblique = new ObliqueCamera(
        params.left,
        params.right,
        params.top,
        params.bottom,
        params.near,
        params.far,
        params.theta,
        params.phi
      );
      // cameraOblique.transform.position.z = 100;
      // cameraOblique.transform.rotation.y = params.cameraAngleRadians;
      node.addChild(cameraOblique);
      node.computeWorldMatrix(false, true);
      cameraOblique.transform.position.z = 100;
      node.transform.rotation.y = params.cameraAngleRadians;
      cameraOblique.dirty();
      setCurrentCamera(cameraOblique);
    }
  };

  const currentCameraType =
    currentCamera instanceof PerspectiveCamera
      ? "Perspective"
      : currentCamera instanceof OrthographicCamera
      ? "Orthographic"
      : currentCamera instanceof ObliqueCamera 
      ? "Oblique" : undefined;

  return (
    <>
      {!focusedNode && (
        <div className="h-fit overflow-y-auto flex flex-col gap-2">
          <div>
            <h2>Camera</h2>
            <Dropdown
              list={cameraTypes}
              selectedVal={currentCameraType}
              onChange={handleChange}
            />
          </div>
          <div className="text-sm">
            <p>Camera Angle</p>
            <p>{Math.floor(params.cameraAngleRadians)}</p>
            <Slider
              min={0}
              max={360}
              step={1}
              defaultValue={params.cameraAngleRadians}
              value={params.cameraAngleRadians}
              onChange={(value) => {
                setParams((prevParams) => ({
                  ...prevParams,
                  cameraAngleRadians: value,
                }));
              }}
            />
          </div>
          <div className="text-sm">
            <p>Z Position</p>
            <p>{params.zPos}</p>
            <Slider
              min={0}
              max={5}
              step={0.1}
              defaultValue={params.zPos}
              value={params.zPos}
              onChange={(value) => {
                setParams((prevParams) => ({
                  ...prevParams,
                  zPos: value,
                }));
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}