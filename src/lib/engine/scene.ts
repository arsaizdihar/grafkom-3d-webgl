import { Color } from "./color";
import { GLNode } from "./node";

export class Scene extends GLNode {
  constructor(public background: Color) {
    super();
  }
}
