import { Application } from "../engine/application";
import { Color } from "../engine/color";
import { Light } from "../engine/light";

export class PointLight extends Light {
  constructor(
    program: Application["basicProgram"],
    public radius: number = 100,
    color?: Color
  ) {
    super(program, color);
  }
}
