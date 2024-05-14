import React, { useEffect, useRef, useState } from "react";
import { Application } from "./app";
import { Camera } from "./lib/engine/camera";
import { Scene } from "./lib/engine/scene";
import { loadGLTF, saveGLTF } from "./lib/gltf/loader";

const GLTF_FILE = "/scenes/cube.json";

function App() {
  const containterRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [app, setApp] = useState<Application | null>();
  const [scene, setScene] = useState<Scene | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);

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
  }, [app]);

  useEffect(() => {
    async function load() {
      if (!app) {
        return;
      }
      const [scene, camera] = await loadGLTF(
        await fetch(GLTF_FILE).then((res) => res.json()),
        app
      );
      // const [scene, camera] = await debugApp(app);
      setScene(scene);
      setCamera(camera);
    }
    load();
  }, [app]);

  useEffect(() => {
    if (!app || !scene || !camera) {
      return;
    }
    const interval = setInterval(() => {
      scene.computeWorldMatrix(false, true);
      camera.computeProjectionMatrix();
      app.render(scene, camera);
    }, 1000 / 30);

    return () => clearInterval(interval);
  }, [app, scene, camera]);

  return (
    <>
      <div
        className="flex-1 canvas-container max-w-3/4 overflow-hidden"
        ref={containterRef}
      >
        <canvas ref={canvasRef}></canvas>
      </div>
      <div className="bg-slate-200 w-1/4 flex flex-col p-4">
        <div className="flex flex-col gap-2 text-sm">
          <p>Select camera:</p>
          <div className="flex flex-row gap-2">
            <input
              id="orthographic"
              type="radio"
              name="camera"
              value="orthographic"
            />
            <label htmlFor="orthographic">Orthographic</label>

            <input
              id="perspective"
              type="radio"
              name="camera"
              value="perspective"
            />
            <label htmlFor="perspective">Perspective</label>

            <input id="oblique" type="radio" name="camera" value="oblique" />
            <label htmlFor="oblique">Oblique</label>
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
          <button
            onClick={() => {
              if (!app || !scene || !camera) {
                return;
              }
              saveGLTF(scene, camera).then((res) => {
                console.log(res);
              });
            }}
          >
            save
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
