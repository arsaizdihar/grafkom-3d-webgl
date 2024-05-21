import { Color } from "../engine/color";
import { Light } from "../engine/light";

export class DirectionalLight extends Light {
  constructor(
    color: Color,
    intensity: number
  ) {
    super(color, intensity);

    this.computeLocalMatrix();
  }  
}