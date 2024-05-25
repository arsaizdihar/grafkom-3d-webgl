import { useEffect, useRef } from "react";
import { AnimationEdits } from "./components/animation-edits";
import { Animations } from "./components/animations";
import { ComponentTree } from "./components/component-tree";
import { Load } from "./components/load";
import { NodeEdits } from "./components/node-edits";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { useCamera } from "./hooks/camera";
import { AnimationRunner } from "./lib/engine/animation";
import { Application } from "./lib/engine/application";
import { Color } from "./lib/engine/color";
import { Scene } from "./lib/engine/scene";
import { useApp } from "./state/app-store";

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
    isEditing: isEditingAnimation,
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
    isEditing: !!state.animationEdit,
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
      const scene = new Scene(Color.hex(0x171717));
      const animations: AnimationRunner[] = [];
      setScene(scene);
      setAnimations(animations);
      setFocusedNode(null);
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
      <div className="bg-slate-200 w-64 flex flex-col p-4 h-screen overflow-y-auto">
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
        {isEditingAnimation ? (
          <AnimationEdits />
        ) : (
          <Tabs defaultValue="edit" className="h-screen flex flex-col">
            <TabsList className="rounded-none rounded-b-lg">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="animations">Animations</TabsTrigger>
            </TabsList>
            <TabsContent
              value="edit"
              className="px-4 pb-4 flex-1 overflow-y-auto"
            >
              <NodeEdits />
              <Load />
            </TabsContent>
            <TabsContent value="animations" className="px-4 pb-4 flex-1">
              <Animations />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
}

export default App;
