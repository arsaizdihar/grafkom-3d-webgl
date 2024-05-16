import { GLNode } from "@/lib/engine/node";
import { useApp } from "@/state/app-store";
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

export function ComponentTree() {
  const scene = useApp((state) => state.scene);
  const _ = useApp((state) => state._rerenderSceneGraph);
  const { focusNode, rerenderSceneGraph } = useApp((state) => ({
    focusNode: state.focusedNode,
    rerenderSceneGraph: state.rerenderSceneGraph,
  }));
  const handleAddChildrenClick = () => {
    if (focusNode) {
      const newNode = new GLNode();
      newNode.name = "New Node";
      focusNode.addChild(newNode);
      rerenderSceneGraph();
    }
  };

  return (
    <div className="flex-1 h-1 overflow-y-auto">
      <h2 className="mb-2">Component Tree</h2>
      {scene && <NodeChildren nodes={scene.children} />}
        <Button
              size={"sm"}
              className="focus:outline-none w-auto mt-5"
              onClick={handleAddChildrenClick}
            >
              Add children
        </Button>
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
