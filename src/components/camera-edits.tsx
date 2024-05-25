import { cameraNode } from "@/hooks/camera";
import { ObliqueCamera } from "@/lib/camera/oblique-camera";
import { OrthographicCamera } from "@/lib/camera/orthographic-camera";
import { PerspectiveCamera } from "@/lib/camera/perspective-camera";
import { degToRad } from "@/lib/math/math-utils";
import { useApp } from "@/state/app-store";
import { Button } from "./ui/button";
import { Dropdown } from "./ui/dropdown";
import { Slider } from "./ui/slider";

export function CameraEdits() {
  const {
    app,
    currentCamera,
    setCurrentCamera,
    focusedNode,
    params,
    setParams,
  } = useApp((state) => ({
    app: state.app,
    currentCamera: state.currentCamera,
    setCurrentCamera: state.setCurrentCamera,
    focusedNode: state.focusedNode,
    params: state.cameraParams,
    setParams: state.setCameraParams,
  }));

  const cameraTypes = [
    { value: "Perspective", label: "Perspective" },
    { value: "Orthographic", label: "Orthographic" },
    { value: "Oblique", label: "Oblique" },
  ];

  const handleChange = (value: string | number) => {
    cameraNode.removeAllChildren();
    cameraNode.computeWorldMatrix(false, true);
    cameraNode.transform.rotation.y = params.cameraAngleDegreeY;

    if (value === "Perspective") {
      const cameraPerspective = new PerspectiveCamera(
        degToRad(params.fovy),
        params.aspect,
        1,
        2000
      );
      cameraNode.clearChildren();
      cameraNode.addChild(cameraPerspective);
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
      cameraNode.clearChildren();
      cameraNode.addChild(cameraOrthographic);
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
      cameraNode.clearChildren();
      cameraNode.addChild(cameraOblique);
      cameraOblique.transform.position.z = 0;

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
          ? "Oblique"
          : undefined;

  const handleResetView = () => {
    const value = currentCameraType;

    setParams((prevParams) => ({
      ...prevParams,
      cameraAngleDegreeY: 0,
      cameraAngleDegreeX: 0,
      zPos: 1,
    }));
    cameraNode.transform.rotation.y = 0;
    cameraNode.transform.rotation.x = 0;

    if (value === "Perspective" && currentCamera instanceof PerspectiveCamera) {
      currentCamera.transform.position.z = 500;
      currentCamera.dirty();
    } else if (
      value === "Orthographic" &&
      currentCamera instanceof OrthographicCamera
    ) {
      currentCamera.transform.position.z = 100;
      currentCamera.dirty();
    } else if (value === "Oblique" && currentCamera instanceof ObliqueCamera) {
      currentCamera.transform.position.z = 0;
      currentCamera.dirty();
    }
  };

  return (
    <>
      {!focusedNode && (
        <div className="h-fit overflow-y-auto flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold">Camera Type</h2>
            <Dropdown
              list={cameraTypes}
              selectedVal={currentCameraType}
              onChange={handleChange}
            />
          </div>
          <div className="text-sm flex flex-col gap-1">
            <p className="text-base mt-1 mb-2 font-semibold">Camera Angle</p>
            <div className="flex">
              <p>Y:&nbsp; </p>
              <p>{Math.floor(params.cameraAngleDegreeY)}</p>
            </div>
            <Slider
              min={0}
              max={360}
              step={1}
              defaultValue={params.cameraAngleDegreeY}
              value={params.cameraAngleDegreeY}
              onChange={(value) => {
                setParams((prevParams) => ({
                  ...prevParams,
                  cameraAngleDegreeY: value,
                }));
              }}
            />
            <div className="flex">
              <p>X:&nbsp; </p>
              <p>{Math.floor(params.cameraAngleDegreeX)}</p>
            </div>
            <Slider
              min={0}
              max={360}
              step={1}
              defaultValue={params.cameraAngleDegreeX}
              value={params.cameraAngleDegreeX}
              onChange={(value) => {
                setParams((prevParams) => ({
                  ...prevParams,
                  cameraAngleDegreeX: value,
                }));
              }}
            />
            <div className="flex">
              <p>Z:&nbsp; </p>
              <p>{params.zPos}</p>
            </div>
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
            size={"md"}
            onClick={handleResetView}
            className="w-full text-center mt-2"
          >
            Reset to Default View
          </Button>
        </div>
      )}
    </>
  );
}
