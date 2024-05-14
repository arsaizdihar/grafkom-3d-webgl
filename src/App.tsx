import React, { useEffect, useRef, useState } from "react";
import { Application } from "./app";
import { Camera } from "./lib/engine/camera";
import { Scene } from "./lib/engine/scene";
import { loadGLTF } from "./lib/gltf/loader";

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
    </>
  );
}

export default App;
