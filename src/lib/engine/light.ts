import { Color } from "./color";
import { GLNode } from "./node";

export class Light extends GLNode {
  constructor(
    public color: Color,
    public intensity = 1
  ) {
    super();
  }
}
