import { useEffect, useRef } from "react";
import { Animations } from "./components/animations";
import { ComponentTree } from "./components/component-tree";
import { Load } from "./components/load";
import { NodeEdits } from "./components/node-edits";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { useCamera } from "./hooks/camera";
import { Application } from "./lib/engine/application";
import { loadGLTF } from "./lib/gltf/loader";
import { useApp } from "./state/app-store";
import { Mesh } from "./lib/engine/mesh";
import { PlaneGeometry } from "./lib/geometry/plane-geometry";
import { BasicMaterial } from "./lib/material/basic-material";
import { Color } from "./lib/engine/color";
import { Texture } from "./lib/engine/texture";
import { DirectionalLight } from "./lib/light/directional-light";

const GLTF_FILE = "/scenes/steve.json";

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
    setCameraParams,
  } = useApp((state) => ({
    app: state.app,
    setApp: state.setApp,
    scene: state.scene,
    setScene: state.setScene,
    currentCamera: state.currentCamera,
    setCurrentCamera: state.setCurrentCamera,
    setFocusedNode: state.setFocusedNode,
    animations: state.animations,
    setAnimations: state.setAnimations,
    setCameraParams: state.setCameraParams,
  }));

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
      setScene(scene);
      setAnimations(animations);
      setFocusedNode(null);

      // Plane          
      // const text = new Texture(
      //   { color: Color.hex(0xffffff) },
      //   app.gl
      // );

      // const plane = new Mesh(
      //   new PlaneGeometry(800, 800),
      //   new BasicMaterial({
      //     color: Color.hex(0xffffff),
      //     texture: text,
      //     id: "basic",
      //   })
      // );
      // plane.name = "plane";

      // plane.transform.position.y = -100;
      // plane.transform.scale.z = -1;
      // scene.addChild(plane);

      // Light
      // const color = Color.hex(0xffffff);
      // const intensity = 1;
      // const light = new DirectionalLight(
      //   color,
      //   intensity
      // );
      // light.name = "light";

      // light.transform.position.set(-1, 100, 4);
      // scene.addChild(light);
    }

    load();
  }, [app, setCurrentCamera, setScene, setFocusedNode, setAnimations]);

  useEffect(() => {
    if (!app || !scene || !currentCamera) {
      return;
    }

    const cleanup = app.render(scene, currentCamera, animations);
    return cleanup;
  }, [app, scene, currentCamera, animations]);

  useCamera();

  return (
    <>
      <div className="bg-slate-200 w-64 flex flex-col p-4">
        <ComponentTree />

        <div
          className="w-full text-green-500 font-mono text-center"
          id="fps"
        ></div>
      </div>
      <div
        className="flex-1 canvas-container max-w-3/4 overflow-hidden"
        ref={containterRef}
      >
        <canvas ref={canvasRef}></canvas>
      </div>
      <div className="bg-slate-200 w-72">
        <Tabs defaultValue="edit" className="h-full flex flex-col">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="animations">Animations</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="px-4 pb-4 flex-1">
            <NodeEdits />
            <Load />
          </TabsContent>
          <TabsContent value="animations" className="px-4 pb-4 flex-1">
            <Animations />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default App;
