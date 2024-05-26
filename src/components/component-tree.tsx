import { GLNode } from "@/lib/engine/node";
import { useApp } from "@/state/app-store";
import { useRef, useState } from "react";

import { AnimationRunner } from "@/lib/engine/animation";
import { BufferGeometry } from "@/lib/engine/buffer-geometry";
import { Color } from "@/lib/engine/color";
import { Mesh } from "@/lib/engine/mesh";
import { Scene } from "@/lib/engine/scene";
import { TextNode } from "@/lib/engine/text-node";
import { CubeGeometry } from "@/lib/geometry/cube-geometry";
import { ParallelepipedGeometry } from "@/lib/geometry/parallelepiped-geometry";
import { PlaneGeometry } from "@/lib/geometry/plane-geometry";
import { PyramidHollowGeometry } from "@/lib/geometry/pyramid-hollow-geometry";
import { SphereGeometry } from "@/lib/geometry/sphere-geometry";
import { TorusGeometry } from "@/lib/geometry/torus-geometry";
import { loadGLTF } from "@/lib/gltf/loader";
import { saveGLTF } from "@/lib/gltf/saver";
import { PointLight } from "@/lib/light/point-light";
import { BasicMaterial } from "@/lib/material/basic-material";
import clsx from "clsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { ParallelepipedHollowGeometry } from "@/lib/geometry/parallelepiped-hollow-geometry";

const meshOptions = {
  cube: "Cube",
  plane: "Plane",
  pyramid: "Pyramid Hollow",
  torus: "Torus",
  parallelepiped: "Parallelepiped",
  sphere: "Sphere",
  parallelepipedhollow: "Parallelepiped Hollow",
  node: "Node",
  text: "Text",
  light: "Point Light",
};

export function ComponentTree() {
  const scene = useApp((state) => state.scene);
  const _ = useApp((state) => state._rerenderSceneGraph);

  const { focusNode, rerenderSceneGraph, animationEdit, app, setAnimations } =
    useApp((state) => ({
      focusNode: state.focusedNode,
      rerenderSceneGraph: state.rerenderSceneGraph,
      animationEdit: state.animationEdit,
      app: state.app,
      setAnimations: state.setAnimations,
    }));
  const node = animationEdit ? animationEdit.rootNode : scene;
  const isEditingAnimation = !!animationEdit;

  const handleAddChildrenClick = () => {
    if (!app) {
      return;
    }
    let newNode: GLNode;
    let geometry: BufferGeometry | undefined;
    const material = new BasicMaterial(
      { color: Color.WHITE },
      app.basicProgram
    );
    const name = meshOptions[selectedOption as keyof typeof meshOptions];
    switch (selectedOption) {
      case "cube":
        geometry = new CubeGeometry();
        break;
      case "plane":
        geometry = new PlaneGeometry();
        break;
      case "pyramid":
        geometry = new PyramidHollowGeometry();
        break;
      case "torus":
        geometry = new TorusGeometry();
        break;
      case "parallelepiped":
        geometry = new ParallelepipedGeometry();
        break;
      case "sphere":
        geometry = new SphereGeometry();
        break;
      case "parallelepipedhollow":
        geometry = new ParallelepipedHollowGeometry();
        break;
    }
    if (geometry) {
      newNode = new Mesh(geometry, material);
    } else if (selectedOption === "text") {
      newNode = new TextNode("Text", 12, Color.WHITE);
    } else if (selectedOption === "light") {
      if (scene && scene.lights.length > 2) {
        alert("You can only have 3 lights in a scene");
        return;
      }
      newNode = new PointLight(app.basicProgram);
      scene?.lights.push(newNode as PointLight);
    } else {
      newNode = new GLNode();
    }
    newNode.name = name;

    if (focusNode) {
      focusNode.addChild(newNode);
    } else if (scene) {
      scene.addChild(newNode);
    }
    rerenderSceneGraph();
  };

  const [selectedOption, setSelectedOption] = useState("cube");
  const loadRef = useRef<HTMLInputElement>(null);

  const handleSelectChange = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className="flex-1 h-1">
      <h2 className="mb-2 font-semibold">Component Tree</h2>
      {node && (
        <NodeChildren nodes={node instanceof Scene ? node.children : [node]} />
      )}
      {!isEditingAnimation && (
        <div className="flex flex-col gap-2 mt-5">
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger className="flex items-center mt-2 bg-gray-100 p-2 rounded">
              {selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)}
            </SelectTrigger>
            <SelectContent>
              {Object.keys(meshOptions).map((option) => (
                <SelectItem key={option} value={option} disableIndicator>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size={"sm"}
            className="focus:outline-none w-auto"
            onClick={handleAddChildrenClick}
          >
            Add
          </Button>
          <Button
            onClick={() => {
              loadRef.current?.click();
            }}
          >
            Load node
          </Button>
          <input
            ref={loadRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              if (!app || !scene) {
                return;
              }
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = async () => {
                try {
                  const data = reader.result as string;
                  const results = await loadGLTF(JSON.parse(data), app, false);
                  if (results.length === 2) {
                    throw new Error("Failed to load GLTF");
                  }
                  const [node, animations, materials, geometries, textures] =
                    results;
                  if (focusNode) {
                    focusNode.addChild(node);
                  } else {
                    scene.addChild(node);
                  }
                  scene.materials.push(...materials);
                  scene.geometries.push(...geometries);
                  scene.textures.push(...textures);
                  setAnimations((prev) => [...prev, ...animations]);
                } catch (e) {
                  if (e instanceof Error) {
                    alert(e.message);
                  } else {
                    console.error(e);
                  }
                }
              };
              reader.readAsText(file);
            }}
            accept=".json"
          />
        </div>
      )}
    </div>
  );
}

function Node({ node }: { node: GLNode }) {
  const {
    focusNode,
    setFocusedNode,
    rerenderSceneGraph,
    animationEdit,
    setAnimationEdit,
    animations,
    setAnimations,
    scene,
  } = useApp((state) => ({
    focusNode: state.focusedNode,
    setFocusedNode: state.setFocusedNode,
    rerenderSceneGraph: state.rerenderSceneGraph,
    animations: state.animations,
    animationEdit: state.animationEdit,
    setAnimationEdit: state.setAnimationEdit,
    setAnimations: state.setAnimations,
    scene: state.scene,
  }));

  const handleClick = () => {
    // If the node is already focused, set the focused node to null
    if (focusNode === node) {
      setFocusedNode(null);
    } else {
      setFocusedNode(node);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={clsx(
            "flex justify-between rounded-md",
            focusNode === node ? "bg-slate-300" : "bg-slate-100"
          )}
        >
          <button
            key={node.id}
            className={clsx(
              "w-full flex items-center justify-between py-2.5 font-medium transition-all [&[data-state=open]>svg]:rotate-180 pl-2"
            )}
            onClick={handleClick}
          >
            {node.name}
          </button>

          {node.children.length > 0 && (
            <AccordionTrigger className={clsx("px-2")}></AccordionTrigger>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onSelect={() => {
            if (node instanceof TextNode) {
              node.el?.remove();
              node.el = null;
            } else if (node instanceof PointLight) {
              if (scene) {
                scene.lights = scene.lights.filter((l) => l !== node);
              }
            }
            node.removeFromParent();
            if (focusNode === node) {
              setFocusedNode(null);
            }
            rerenderSceneGraph();
          }}
        >
          Delete
        </ContextMenuItem>
        <ContextMenuItem
          onSelect={async () => {
            const json = await saveGLTF(
              node,
              animations.filter((a) => isAnimationRunnerInNode(node, a))
            );
            const a = document.createElement("a");
            const file = new Blob([JSON.stringify(json, null, 2)], {
              type: "application/json",
            });
            a.href = URL.createObjectURL(file);

            a.download = node.name + ".json";
            a.click();
          }}
        >
          Save
        </ContextMenuItem>
        {!animationEdit && (
          <ContextMenuItem
            onSelect={() => {
              const newAnimation = new AnimationRunner(
                {
                  name: "animation",
                  frames: [],
                },
                node,
                { fps: 1, tween: "linear" }
              );
              setAnimations([...animations, newAnimation]);
              setAnimationEdit(newAnimation);
            }}
          >
            Add new animation
          </ContextMenuItem>
        )}
        <ContextMenuItem
          onSelect={() => {
            if (!scene) {
              return;
            }
            scene.toControl = node;
          }}
        >
          Control
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function NodeChildren({ nodes }: { nodes: GLNode[] }) {
  return (
    <Accordion asChild type="multiple" className="text-sm">
      <ul>
        {nodes.map((node) =>
          node.children.length > 0 ? (
            <AccordionItem asChild key={node.id} value={node.id}>
              <li>
                <Node node={node} />
                <AccordionContent>
                  <div className="ml-2">
                    <NodeChildren nodes={node.children} />
                  </div>
                </AccordionContent>
              </li>
            </AccordionItem>
          ) : (
            <li key={node.id}>
              <Node node={node} />
            </li>
          )
        )}
      </ul>
    </Accordion>
  );
}

function isAnimationRunnerInNode(
  node: GLNode,
  animation: AnimationRunner
): boolean {
  return node.children.some((child) => {
    if (child === animation.rootNode) {
      return true;
    }
    return isAnimationRunnerInNode(child, animation);
  });
}
