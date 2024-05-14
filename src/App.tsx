import { useEffect, useRef } from "react";
import { ComponentTree } from "./components/component-tree";
import { Load } from "./components/load";
import { NodeEdits } from "./components/node-edits";
import { OrthographicCamera } from "./lib/camera/orthographic-camera";
import { Application } from "./lib/engine/application";
import { GLNode } from "./lib/engine/node";
import { loadGLTF } from "./lib/gltf/loader";
import { useApp } from "./state/app-store";

const GLTF_FILE = "/scenes/cube.json";

function recomputeIfDirty(node: GLNode) {
  if (node.isDirty) {
    node.computeWorldMatrix(false, true);
    node.clean();
  } else {
    node.children.forEach(recomputeIfDirty);
  }
}

function App() {
  const containterRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { app, setApp, scene, setScene, currentCamera, setCurrentCamera } =
    useApp();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containterRef.current;
    if (!canvas || !container) return;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }, []);

  useEffect(() => {
    if (app) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas || !containterRef.current) {
      return;
    }

    setApp(new Application(canvas, containterRef.current));
  }, [app, setApp]);

  useEffect(() => {
    async function load() {
      if (!app) {
        return;
      }
      const scene = await loadGLTF(
        await fetch(GLTF_FILE).then((res) => res.json()),
        app
      );
      const camera = new OrthographicCamera(
        app.canvas.width / -2,
        app.canvas.width / 2,
        -app.canvas.height / 2,
        app.canvas.height / 2,
        100,
        -100
      );
      setScene(scene);
      setCurrentCamera(camera);
    }
    load();
  }, [app, setCurrentCamera, setScene]);

  useEffect(() => {
    if (!app || !scene || !currentCamera) {
      return;
    }
    const interval = setInterval(() => {
      recomputeIfDirty(scene);
      if (currentCamera.isDirty) {
        currentCamera.computeWorldMatrix();
      }
      if (currentCamera.isCameraDirty) {
        currentCamera.computeProjectionMatrix();
      }
      app.render(scene, currentCamera);
    }, 1000 / 30);

    return () => clearInterval(interval);
  }, [app, scene, currentCamera]);

  return (
    <>
      <div
        className="flex-1 canvas-container max-w-3/4 overflow-hidden"
        ref={containterRef}
      >
        <canvas ref={canvasRef}></canvas>
      </div>
      <div className="bg-slate-200 w-64 flex flex-col p-4">
        <ComponentTree />
        <NodeEdits />
        <Load />
        {/* <div className="flex flex-col gap-2 text-sm">
          <p>Select camera:</p>
          <div className="flex flex-row gap-2 flex-wrap">
            <div className="flex gap-2">
              <input
                id="orthographic"
                type="radio"
                name="camera"
                value="orthographic"
              />
              <label htmlFor="orthographic">Orthographic</label>
            </div>
            <div className="flex gap-2">
              <input
                id="perspective"
                type="radio"
                name="camera"
                value="perspective"
              />
              <label htmlFor="perspective">Perspective</label>
            </div>
            <div className="flex gap-2">
              <input id="oblique" type="radio" name="camera" value="oblique" />
              <label htmlFor="oblique">Oblique</label>
            </div>
          </div>

          <p>camera</p>
          <div id="value-camera"></div>
          <input id="slider-camera" type="range" min="0" max="360" step="1" />

          <p>camera radius</p>
          <div id="value-camera-radius"></div>
          <input
            id="slider-camera-radius"
            type="range"
            min="0"
            max="360"
            step="1"
          />

          <p>FOV</p>
          <div id="value-fov"></div>
          <input id="slider-fov" type="range" min="1" max="179" step="1" />
          <Button
            onClick={() => {
              if (!app || !scene || !currentCamera) {
                return;
              }
              saveGLTF(scene, currentCamera).then((res) => {
                console.log(res);
              });
            }}
          >
            save
          </Button>
        </div> */}
      </div>
    </>
  );
}

export default App;
