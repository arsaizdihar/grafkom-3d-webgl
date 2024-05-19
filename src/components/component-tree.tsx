import { GLNode } from "@/lib/engine/node";
import { useApp } from "@/state/app-store";
import { CubeGeometry } from "../lib/geometry/cube-geometry";
import { CubeHollowGeometry } from "../lib/geometry/cube-hollow-geometry";
import { PlaneGeometry } from "../lib/geometry/plane-geometry";
import { PyramidHollowGeometry } from "../lib/geometry/pyramid-hollow-geometry";
import { TorusGeometry } from "../lib/geometry/torus-geometry"
import { BasicMaterial } from "../lib/material/basic-material"
import { Mesh } from "../lib/engine/mesh"
import { Transform } from "../lib/engine/transform"
import { BufferGeometry } from "../lib/engine/buffer-geometry"
import { useState } from 'react';

import clsx from "clsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { Button } from "./ui/button";
import { Color } from "@/lib/engine/color";
import { Vector3 } from "@/lib/engine/vector";
import { Euler } from "@/lib/math/euler";
import { Matrix4 } from "@/lib/math/m4";

export function ComponentTree() {
  const scene = useApp((state) => state.scene);
  const _ = useApp((state) => state._rerenderSceneGraph);
  const { focusNode, rerenderSceneGraph } = useApp((state) => ({
    focusNode: state.focusedNode,
    rerenderSceneGraph: state.rerenderSceneGraph,
  }));
  
  const handleAddChildrenClick = () => {
    let newNode;
    const transform = new Transform(new Vector3(0, 0, 0), new Euler(0, 0, 0), new Vector3(1, 1, 1));

    switch (selectedOption) {
      case 'cube':
        newNode = new GLNode(transform);
        newNode.name = "Cube Node";
        break;
      case 'plane':
        newNode = new GLNode(transform);
        newNode.name = "Plane Node";
        break;
      case 'pyramid':
        newNode = new GLNode(transform);
        newNode.name = "Pyramid Node";
        break;
      case 'torus':
        newNode = new GLNode(transform);
        newNode.name = "Torus Node";
        break;
      default:
        newNode = new GLNode(transform);
        newNode.name = "New Node";
        break;
    }

    if (focusNode) {
      focusNode.addChild(newNode);
    } else {
      scene.addChild(newNode);
    }
    rerenderSceneGraph();
  };

  const [selectedOption, setSelectedOption] = useState('cube');

  const handleSelectChange = (option) => {
    setSelectedOption(option);
  };

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const handleCloseAccordion = () => {
    setIsAccordionOpen(false);
  };

  return (
    <div className="flex-1 h-1 overflow-y-auto">
      <h2 className="mb-2">Component Tree</h2>
      {scene && <NodeChildren nodes={scene.children} />}
      <div className="flex items-start mt-5">
      <Accordion asChild type="single" className="text-sm">
        <AccordionItem asChild value="add-node">
          <div>
            <AccordionTrigger
              className="flex items-center mt-2 bg-gray-100 p-2 rounded"
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            >
              {selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-none pl-0">
                <li>
                  <button
                    className={`w-full text-left p-2 ${selectedOption === 'cube' ? 'bg-slate-300' : ''}`}
                    onClick={() => handleSelectChange('cube')}
                  >
                    Cube
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left p-2 ${selectedOption === 'plane' ? 'bg-slate-300' : ''}`}
                    onClick={() => handleSelectChange('plane')}
                  >
                    Plane
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left p-2 ${selectedOption === 'pyramid' ? 'bg-slate-300' : ''}`}
                    onClick={() => handleSelectChange('pyramid')}
                  >
                    Pyramid
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left p-2 ${selectedOption === 'torus' ? 'bg-slate-300' : ''}`}
                    onClick={() => handleSelectChange('torus')}
                  >
                    Torus
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
    </div>
  );
}

function Node({ node }: { node: GLNode }) {
  const { focusNode, setFocusedNode, rerenderSceneGraph } = useApp((state) => ({
    focusNode: state.focusedNode,
    setFocusedNode: state.setFocusedNode,
    rerenderSceneGraph: state.rerenderSceneGraph,
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
