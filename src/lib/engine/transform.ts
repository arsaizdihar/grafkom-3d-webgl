import { Euler } from "../math/euler";
import { Quaternion } from "../math/quaternion";
import { Vector3 } from "./vector";

export class Transform {
  constructor(
    public position: Vector3 = new Vector3(),
    public rotation: Euler = new Euler(),
    public scale: Vector3 = new Vector3(1, 1, 1)
  ) {}

  get rotationQuaternion() {
    return Quaternion.fromEuler(this.rotation);
  }
}
