import { useEffect, useRef } from "react";
import { ComponentTree } from "./components/component-tree";
import { Load } from "./components/load";
import { NodeEdits } from "./components/node-edits";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { PerspectiveCamera } from "./lib/camera/perspective-camera";
import { Application } from "./lib/engine/application";
import { GLNode } from "./lib/engine/node";
import { loadGLTF } from "./lib/gltf/loader";
import { degToRad } from "./lib/math/math-utils";
import { useApp } from "./state/app-store";

const GLTF_FILE = "/scenes/1-cube.json";

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
  const {
    app,
    setApp,
    scene,
    setScene,
    currentCamera,
    setCurrentCamera,
    setFocusedNode,
    animations,
    setAnimations,
  } = useApp();

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
      const [scene, animations] = await loadGLTF(
        await fetch(GLTF_FILE).then((res) => res.json()),
        app
      );
      // const camera = new OrthographicCamera(
      //   app.canvas.width / -2,
      //   app.canvas.width / 2,
      //   -app.canvas.height / 2,
      //   app.canvas.height / 2,
      //   100,
      //   -100
      // );
      const camera = new PerspectiveCamera(
        degToRad(60),
        app.canvas.width / app.canvas.height,
        1,
        2000
      );
      camera.transform.position.z = 500;
      camera.dirty();
      setScene(scene);
      setCurrentCamera(camera);
      setAnimations(animations);
      setFocusedNode(null);
    }
    load();
  }, [app, setCurrentCamera, setScene, setFocusedNode, setAnimations]);

  useEffect(() => {
    if (!app || !scene || !currentCamera) {
      return;
    }
    const interval = setInterval(() => {
      recomputeIfDirty(scene);
      if (currentCamera.isCameraDirty) {
        currentCamera.computeProjectionMatrix();
        currentCamera.cameraClean();
      }
      app.render(scene, currentCamera, animations);
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [app, scene, currentCamera, animations]);

  return (
    <>
      <div
        className="flex-1 canvas-container max-w-3/4 overflow-hidden"
        ref={containterRef}
      >
        <canvas ref={canvasRef}></canvas>
      </div>
      <div className="bg-slate-200 w-72">
        <Tabs defaultValue="component-tree" className="h-full flex flex-col">
          <TabsList>
            <TabsTrigger value="component-tree">Tree</TabsTrigger>
            <TabsTrigger value="animations">Animations</TabsTrigger>
          </TabsList>
          <TabsContent value="component-tree" className="px-4 pb-4 flex-1">
            <ComponentTree />
            <NodeEdits />
            <Load />
          </TabsContent>
          <TabsContent value="animations" className="px-4 pb-4 flex-1">
            Animations
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default App;
