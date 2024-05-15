import { Color } from "./color";
import { GLNode } from "./node";
import { Vector3 } from "./vector";

export class Scene extends GLNode {
  constructor(
    public background: Color,
    public lightPos = new Vector3()
  ) {
    super();
  }
}
