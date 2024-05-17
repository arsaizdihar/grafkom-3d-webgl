import { ObliqueCamera } from "@/lib/camera/oblique-camera";
import { OrthographicCamera } from "@/lib/camera/orthographic-camera";
import { PerspectiveCamera } from "@/lib/camera/perspective-camera";
import { GLNode } from "@/lib/engine/node";
import { degToRad } from "@/lib/math/math-utils";
import { useApp } from "@/state/app-store";
import { useEffect } from "react";

export const cameraNode = new GLNode();

export function useCamera() {
  const { app, setParams, params, setCurrentCamera, currentCamera } = useApp(
    (state) => ({
      app: state.app,
      setParams: state.setCameraParams,
      params: state.cameraParams,
      setCurrentCamera: state.setCurrentCamera,
      currentCamera: state.currentCamera,
    })
  );

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
      cameraNode.clearChildren();
      cameraNode.addChild(camera);
      camera.transform.position.z = params.zPos * 500;

      camera.dirty();
      setCurrentCamera(camera);
    }
  }, [
    app,
    params.fovy,
    params.aspect,
    params.zPos,
    setCurrentCamera,
    setParams,
  ]);

  useEffect(() => {
    const angleYInDegree = params.cameraAngleDegreeY;
    const angleXInDegree = params.cameraAngleDegreeX;
    const zPos = params.zPos;

    if (currentCamera) {
      cameraNode.transform.rotation.y = angleYInDegree;
      cameraNode.transform.rotation.x = angleXInDegree;

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
        }
      }

      currentCamera.dirty();
    }
  }, [
    params.cameraAngleDegreeY,
    params.cameraAngleDegreeX,
    params.zPos,
    app?.canvas,
    currentCamera,
  ]);

  useEffect(() => {
    const canvas = app?.canvas;
    if (!canvas) {
      return;
    }
    let clicked = false;

    function mouseDown() {
      clicked = true;
    }

    function mouseUp() {
      clicked = false;
    }

    function mouseMove(e: MouseEvent) {
      if (clicked) {
        setParams((prevParams) => {
          let y = prevParams.cameraAngleDegreeY + e.movementX * 1;
          let x = prevParams.cameraAngleDegreeX + e.movementY * 1;
          if (y > 360) {
            y -= 360;
          } else if (y < 0) {
            y += 360;
          }

          if (x > 360) {
            x -= 360;
          } else if (x < 0) {
            x += 360;
          }
          return {
            ...prevParams,
            cameraAngleDegreeY: y,
            cameraAngleDegreeX: x,
          };
        });
      }
    }

    canvas.addEventListener("mousedown", mouseDown);

    canvas.addEventListener("mouseup", mouseUp);

    canvas.addEventListener("mousemove", mouseMove);

    return () => {
      canvas.removeEventListener("mousedown", mouseDown);
      canvas.removeEventListener("mouseup", mouseUp);
      canvas.removeEventListener("mousemove", mouseMove);
    };
  }, [app?.canvas, setParams]);
}
