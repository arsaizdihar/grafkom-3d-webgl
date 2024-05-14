import { useApp } from "@/state/app-store";
import { useEffect, useRef } from "react";

export function NodeEdits() {
  const node = useApp((state) => state.focusedNode);
  const rerender = useApp((state) => state.rerenderReact);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (node && inputRef.current) {
      inputRef.current.value = node.name;
    }
  }, [node]);

  if (!node) {
    return null;
  }

  return (
    <div>
      <div>
        <label className="block">Name</label>
        <input
          type="text"
          ref={inputRef}
          defaultValue={node.name}
          onChange={(e) => {
            node.name = e.target.value;
            rerender();
          }}
        />
      </div>
    </div>
  );
}
