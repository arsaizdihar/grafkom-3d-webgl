import { GLNode } from "@/lib/engine/node";
import { useApp } from "@/state/app-store";
import { useState } from "react";
import { Transform } from "../lib/engine/transform";

import { AnimationRunner } from "@/lib/engine/animation";
import { Scene } from "@/lib/engine/scene";
import { Vector3 } from "@/lib/engine/vector";
import { Euler } from "@/lib/math/euler";
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

export function ComponentTree() {
  const scene = useApp((state) => state.scene);
  const _ = useApp((state) => state._rerenderSceneGraph);
  const { focusNode, rerenderSceneGraph, animationEdit } = useApp((state) => ({
    focusNode: state.focusedNode,
    rerenderSceneGraph: state.rerenderSceneGraph,
    animationEdit: state.animationEdit,
  }));
  const node = animationEdit ? animationEdit.rootNode : scene;
  const isEditingAnimation = !!animationEdit;

  const handleAddChildrenClick = () => {
    let newNode;
    const transform = new Transform(
      new Vector3(0, 0, 0),
      new Euler(0, 0, 0),
      new Vector3(1, 1, 1)
    );

    switch (selectedOption) {
      case "cube":
        newNode = new GLNode(transform);
        newNode.name = "Cube Node";
        break;
      case "plane":
        newNode = new GLNode(transform);
        newNode.name = "Plane Node";
        break;
      case "pyramid":
        newNode = new GLNode(transform);
        newNode.name = "Pyramid Node";
        break;
      case "torus":
        newNode = new GLNode(transform);
        newNode.name = "Torus Node";
        break;
      case "parallelepiped":
          newNode = new GLNode(transform);
          newNode.name = "Parallelepiped Node";
          break;
      default:
        newNode = new GLNode(transform);
        newNode.name = "New Node";
        break;
    }

    if (focusNode) {
      focusNode.addChild(newNode);
    } else {
      scene?.addChild(newNode);
    }
    rerenderSceneGraph();
  };

  const [selectedOption, setSelectedOption] = useState("cube");

  const handleSelectChange = (option: string) => {
    setSelectedOption(option);
  };

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const handleCloseAccordion = () => {
    setIsAccordionOpen(false);
  };

  return (
    <div className="flex-1 h-1 overflow-y-auto">
      <h2 className="mb-2">Component Tree</h2>
      {node && (
        <NodeChildren nodes={node instanceof Scene ? node.children : [node]} />
      )}
      {!isEditingAnimation && (
        <div className="flex items-start mt-5">
          <Accordion asChild type="single" className="text-sm">
            <AccordionItem asChild value="add-node">
              <div>
                <AccordionTrigger
                  className="flex items-center mt-2 bg-gray-100 p-2 rounded"
                  onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                >
                  {selectedOption.charAt(0).toUpperCase() +
                    selectedOption.slice(1)}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-none pl-0">
                    <li>
                      <button
                        className={`w-full text-left p-2 ${selectedOption === "cube" ? "bg-slate-300" : ""}`}
                        onClick={() => handleSelectChange("cube")}
                      >
                        Cube
                      </button>
                    </li>
                    <li>
                      <button
                        className={`w-full text-left p-2 ${selectedOption === "plane" ? "bg-slate-300" : ""}`}
                        onClick={() => handleSelectChange("plane")}
                      >
                        Plane
                      </button>
                    </li>
                    <li>
                      <button
                        className={`w-full text-left p-2 ${selectedOption === "pyramid" ? "bg-slate-300" : ""}`}
                        onClick={() => handleSelectChange("pyramid")}
                      >
                        Pyramid
                      </button>
                    </li>
                    <li>
                      <button
                        className={`w-full text-left p-2 ${selectedOption === "torus" ? "bg-slate-300" : ""}`}
                        onClick={() => handleSelectChange("torus")}
                      >
                        Torus
                      </button>
                      <button
                        className={`w-full text-left p-2 ${selectedOption === "parallelepiped" ? "bg-slate-300" : ""}`}
                        onClick={() => handleSelectChange("parallelepiped")}
                      >
                        Parallelepiped
                      </button>
                    </li>
                  </ul>
                </AccordionContent>
              </div>
            </AccordionItem>
          </Accordion>
          <Button
            size={"sm"}
            className="focus:outline-none w-auto mt-2 ml-2"
            onClick={handleAddChildrenClick}
          >
            Add New Node
          </Button>
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
  } = useApp((state) => ({
    focusNode: state.focusedNode,
    setFocusedNode: state.setFocusedNode,
    rerenderSceneGraph: state.rerenderSceneGraph,
    animations: state.animations,
    animationEdit: state.animationEdit,
    setAnimationEdit: state.setAnimationEdit,
    setAnimations: state.setAnimations,
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
            "flex justify-between",
            focusNode === node ? "bg-slate-300" : "bg-slate-100"
          )}
        >
          <button
            key={node.id}
            className={clsx(
              "w-full flex flex-1 items-center justify-between py-2 font-medium transition-all [&[data-state=open]>svg]:rotate-180 pl-2"
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
          inset
          onSelect={() => {
            node.removeFromParent();
            if (focusNode === node) {
              setFocusedNode(null);
            }
            rerenderSceneGraph();
          }}
        >
          Delete
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
