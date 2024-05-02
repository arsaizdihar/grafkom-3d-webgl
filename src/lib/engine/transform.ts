import { Vector3 } from "./vector";

export class Transform {
  constructor(
    public translation: Vector3 = new Vector3(),
    public rotation: Vector3 = new Vector3(),
    public scaling: Vector3 = new Vector3(1, 1, 1)
  ) {}
}
