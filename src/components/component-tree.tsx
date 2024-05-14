import { GLNode } from "@/lib/engine/node";
import { useApp } from "@/state/app-store";
import { Button } from "./ui/button";

export function ComponentTree() {
  const scene = useApp((state) => state.scene);

  return (
    <div className="h-1/2 overflow-y-auto">
      <h2>Component Tree</h2>
      {scene && <NodeChildren nodes={scene.children} />}
    </div>
  );
}

function Node({ node }: { node: GLNode }) {
  const { focusNode, setFocusedNode } = useApp((state) => ({
    focusNode: state.focusedNode,
    setFocusedNode: state.setFocusedNode,
    rerender: state._rerender,
  }));

  return (
    <Button
      size={"sm"}
      onClick={() => setFocusedNode(node)}
      variant={focusNode === node ? "default" : "outline"}
      className="w-full text-left justify-start"
    >
      {node.name}
    </Button>
  );
}

function NodeChildren({ nodes }: { nodes: GLNode[] }) {
  return (
    <ul>
      {nodes.map((node) => (
        <li key={node.id}>
          <Node node={node} />
          <div className="ml-2">
            <NodeChildren nodes={node.children} />
          </div>
        </li>
      ))}
    </ul>
  );
}
