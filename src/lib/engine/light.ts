import { CubeGeometry } from "../geometry/cube-geometry";
import { BasicMaterial } from "../material/basic-material";
import { Application } from "./application";
import { Color } from "./color";
import { Mesh } from "./mesh";
import { Vector3 } from "./vector";

export class Light extends Mesh {
  private _worldPos: Vector3 = new Vector3();
  constructor(
    program: Application["basicProgram"],
    public color: Color = Color.WHITE
  ) {
    super(
      new CubeGeometry(5),
      new BasicMaterial({ color: Color.rgb(255, 255, 0) }, program)
    );
  }

  get worldPos() {
    return this._worldPos;
  }

  computeWorldMatrix(updateParent?: boolean, updateChildren?: boolean): void {
    super.computeWorldMatrix(updateParent, updateChildren);
    this._worldPos.set(0, 0, 0);
    this.worldMatrix.applyVector3(this._worldPos);
  }
}
