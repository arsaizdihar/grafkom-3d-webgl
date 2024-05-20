import { Color } from "../engine/color";
import { Light } from "../engine/light";

export class PointLight extends Light {
  constructor(
    color: Color,
    intensity: number
  ) {
    super(color, intensity); // Setup Node
  }
}