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

  const cameraTypes = [
    { value: "perspective", label: "Perspective" },
    { value: "orthographic", label: "Orthographic" },
    { value: "oblique", label: "Oblique" },
  ];

  const [params, setParams] = useState({
    fovy: 0,
    aspect: 0,
    near: 0,
    far: 0,

    left: app?.canvas.width ? app.canvas.width * -0.5 : 0,
    right: app?.canvas.width ? app.canvas.width * 0.5 : 0,
    top: app?.canvas.height ? app.canvas.height * 0.5 : 0,
    bottom: app?.canvas.height ? app.canvas.height * -0.5 : 0,

    theta: 0,
    phi: 0,

    cameraAngleRadians: degToRad(0),
    cameraRadius: 200,
  });

  const cameraPerspective = new PerspectiveCamera(
    degToRad(params.fovy),
    params.aspect,
    params.near,
    params.far
  );
  const cameraOrthographic = new OrthographicCamera(
    params.left,
    params.right,
    params.top,
    params.bottom,
    params.near,
    params.far
  );
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

  useEffect(() => {
    if (currentCamera instanceof PerspectiveCamera) {
      setParams((prevParams) => ({
        ...prevParams,
        fovy: currentCamera.fovy,
        aspect: currentCamera.aspect,
        near: currentCamera.near,
        far: currentCamera.far,
      }));
    } else if (currentCamera instanceof OrthographicCamera) {
      setParams((prevParams) => ({
        ...prevParams,
        left: currentCamera.left,
        right: currentCamera.right,
        top: currentCamera.top,
        bottom: currentCamera.bottom,
        near: currentCamera.near,
        far: currentCamera.far,
      }));
    } else if (currentCamera instanceof ObliqueCamera) {
      setParams((prevParams) => ({
        ...prevParams,
        left: currentCamera.left,
        right: currentCamera.right,
        top: currentCamera.top,
        bottom: currentCamera.bottom,
        near: currentCamera.near,
        far: currentCamera.far,
        theta: currentCamera.theta,
        phi: currentCamera.phi
      }));
    }
  }, [currentCamera]);

  const handleChange = (value: string | number) => {
    if (value === "perspective") {
      setCurrentCamera(cameraPerspective);
    } else if (value === "orthographic") {
      setCurrentCamera(cameraOrthographic);
    } else if (value === "oblique") {
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