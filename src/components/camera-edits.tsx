import { useApp } from "@/state/app-store";
import { Dropdown } from "./ui/dropdown";
import { PerspectiveCamera } from "@/lib/camera/perspective-camera";
import { degToRad } from "@/lib/math/math-utils";
import { OrthographicCamera } from "@/lib/camera/orthographic-camera";
import { ObliqueCamera } from "@/lib/camera/oblique-camera";
import { useEffect, useState } from "react";
import { Slider } from "./ui/slider";
import { GLNode } from "@/lib/engine/node";
import { Button } from "./ui/button";

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

      // Initial camera
      const camera = new PerspectiveCamera(
        degToRad(params.fovy),
        app.canvas.width / app.canvas.height,
        1,
        2000
      );
      camera.transform.position.z = 500;
      camera.dirty();
      
      node.addChild(camera);
      camera.transform.position.z = params.zPos * 500;

      camera.dirty();
      setCurrentCamera(camera);
    }
  }, [app]);

  const [node, setNode] = useState(new GLNode());

  useEffect(() => {
    const angleInDegree = params.cameraAngleRadians;
    const zPos = params.zPos;

    if (currentCamera) {
      node.transform.rotation.y = angleInDegree;

      // zPos
      if (currentCamera instanceof PerspectiveCamera) {
        currentCamera.transform.position.z = zPos * 500;
      } else if (
        currentCamera instanceof OrthographicCamera ||
        currentCamera instanceof ObliqueCamera
      ) {      
        if (app?.canvas) {
          const zoom = zPos / 1;

          // Update camera frustum based on zoom
          currentCamera.left = -app.canvas.width * 0.5 * zoom;
          currentCamera.right = app.canvas.width * 0.5 * zoom;
          currentCamera.top = app.canvas.height * 0.5 * zoom;
          currentCamera.bottom = -app.canvas.height * 0.5 * zoom;

          currentCamera.computeProjectionMatrix();
        }
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
    node.removeAllChildren();
    node.computeWorldMatrix(false, true);
    node.transform.rotation.y = params.cameraAngleRadians;

    if (value === "Perspective") {
      const cameraPerspective = new PerspectiveCamera(
        degToRad(params.fovy),
        params.aspect,
        params.near,
        params.far
      );
      node.addChild(cameraPerspective);
      cameraPerspective.transform.position.z = params.zPos * 500;

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
      node.addChild(cameraOrthographic);
      cameraOrthographic.transform.position.z = 100;

      if (app?.canvas) {
        const zoom = params.zPos / 1;

        cameraOrthographic.left = -app.canvas.width * 0.5 * zoom;
        cameraOrthographic.right = app.canvas.width * 0.5 * zoom;
        cameraOrthographic.top = app.canvas.height * 0.5 * zoom;
        cameraOrthographic.bottom = -app.canvas.height * 0.5 * zoom;

        cameraOrthographic.computeProjectionMatrix();
      }

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
      node.addChild(cameraOblique);
      cameraOblique.transform.position.z = 100;

      if (app?.canvas) {
        const zoom = params.zPos / 1;

        cameraOblique.left = -app.canvas.width * 0.5 * zoom;
        cameraOblique.right = app.canvas.width * 0.5 * zoom;
        cameraOblique.top = app.canvas.height * 0.5 * zoom;
        cameraOblique.bottom = -app.canvas.height * 0.5 * zoom;

        cameraOblique.computeProjectionMatrix();
      }
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

  const handleResetView = () => {
    const value = currentCameraType;

    node.computeWorldMatrix(false, true);
    setParams((prevParams) => ({
      ...prevParams,
      cameraAngleRadians: 0,
      zPos: 1,
    }));
    node.transform.rotation.y = 0;

    if (value === "Perspective" && currentCamera instanceof PerspectiveCamera) {
      currentCamera.transform.position.z = 500;
      currentCamera.dirty();
    } else if (value === "Orthographic" && currentCamera instanceof OrthographicCamera) {
      currentCamera.transform.position.z = 100;
      currentCamera.dirty();
    } else if (value === "Oblique" && currentCamera instanceof ObliqueCamera) {
      currentCamera.transform.position.z = 100;
      currentCamera.dirty();
    }
  }

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
          <Button
            size={"sm"}
            onClick={handleResetView}
            className="w-full text-center"
          >
            Reset to Default View
          </Button>
        </div>
      )}
    </>
  );
}