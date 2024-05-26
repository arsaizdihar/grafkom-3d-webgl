import { Color } from "./color";
import { GLNode } from "./node";

export class TextNode extends GLNode {
  public el: HTMLSpanElement | null = null;
  constructor(
    public text: string,
    public fontSize: number,
    public color: Color
  ) {
    super();
  }

  update() {
    if (!this.el) {
      return;
    }
    this.el.textContent = this.text;
    this.el.style.color = this.color.hexString;
  }

  restart(): void {
    this.el = null;
    super.restart();
  }
}
