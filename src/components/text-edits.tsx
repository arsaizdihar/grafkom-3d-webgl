import { Color } from "@/lib/engine/color";
import { TextNode } from "@/lib/engine/text-node";
import { Input } from "./ui/input";
import { InputDrag } from "./ui/input-drag";

export function TextEdits({ node }: { node: TextNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label>Text Content</label>
      <Input
        type="text"
        defaultValue={node.text}
        onChange={(e) => {
          node.text = e.target.value;
        }}
      />
      <label>Font Size</label>
      <InputDrag
        getValue={() => node.fontSize}
        onChange={(v) => {
          node.fontSize = v;
        }}
        min={1}
      />
      <div className="flex items-center gap-2">
        <label>Color</label>
        <input
          type="color"
          defaultValue={node.color.hexString}
          onChange={(e) => {
            node.color = Color.hexString(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
