import { Color } from "../engine/color";
import { Light } from "../engine/light";

export class PointLight extends Light {
  distance: number;
  decay: number;

  constructor(
    color: Color,
    intensity: number,
    distance = 0,
    decay = 2
  ) {
    super(color, intensity); // Setup Node

    this.distance = distance;
    this.decay = decay;
  }
}