import { useApp } from "@/state/app-store";
import { Dropdown } from "./ui/dropdown";
import { Camera } from "@/lib/engine/camera";
import { PerspectiveCamera } from "@/lib/camera/perspective-camera";
import { degToRad } from "@/lib/math/math-utils";
import { OrthographicCamera } from "@/lib/camera/orthographic-camera";
import { ObliqueCamera } from "@/lib/camera/oblique-camera";
import { useEffect, useState } from "react";

export function CameraEdits() {
  const { app, currentCamera, setCurrentCamera } = useApp((state) => ({
    app: state.app,
    currentCamera: state.currentCamera,
    setCurrentCamera: state.setCurrentCamera,
    rerender: state._rerender,
  }));

  // console.log(app?.canvas.width)
  const [params, setParams] = useState({
    fovy: 0,
    aspect: 0,
    near: 100,
    far: -100,

    left: app?.canvas.width,
    right: app?.canvas.width,
    bottom: app?.canvas.height,
    top: app?.canvas.height,
    
    theta: degToRad(75),
    phi: degToRad(75),

    cameraAngleRadians: degToRad(0),
    cameraRadius: 200,
  });

  const cameraTypes = [
    { value: "perspective", label: "Perspective" },
    { value: "orthographic", label: "Orthographic" },
    { value: "oblique", label: "Oblique" },
  ];

  const handleChange = (value: string | number) => {
    if (value === "perspective") {
      const cameraPerspective = new PerspectiveCamera(
        degToRad(params.fovy),
        params.aspect,
        params.near,
        params.far
      );
      setCurrentCamera(cameraPerspective);
    } else if (value === "orthographic") {
      const cameraOrthographic = new OrthographicCamera(
        params.left,
        params.right,
        params.bottom,
        params.top,
        params.near,
        params.far
      );
      console.log(params);

      const camera = new OrthographicCamera(
        app?.canvas.width ? app.canvas.width * -0.5 : 0,
        app?.canvas.width ? app.canvas.width * 0.5 : 0,
        app?.canvas.height ? app.canvas.height * -0.5 : 0,
        app?.canvas.height ? app.canvas.height * 0.5 : 0,
        100,
        -100
      );
      setCurrentCamera(camera);
      // setCurrentCamera(cameraOrthographic);
    } else if (value === "oblique") {
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
      setCurrentCamera(cameraOblique);
    }
  };

  const currentCameraType =
    currentCamera instanceof PerspectiveCamera
      ? "perspective"
      : currentCamera instanceof OrthographicCamera
      ? "orthographic"
      : "oblique";

  return (
    <div className="h-1/4 overflow-y-auto">
      <h2>Camera</h2>
      <Dropdown
        list={cameraTypes}
        selectedVal={currentCameraType}
        onChange={handleChange}
      />
    </div>
  );
}