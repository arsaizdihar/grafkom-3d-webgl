import { Application } from "../engine/application";
import { Color } from "../engine/color";
import { MaterialOptions, ShaderMaterial } from "./shader-material";

export interface BasicMaterialOptions extends MaterialOptions {
  color: Color;
}

export class BasicMaterial extends ShaderMaterial {
  public color: Color;
  private _program;

  constructor(
    options: BasicMaterialOptions,
    program: Application["basicProgram"]
  ) {
    super(options);
    this.color = options.color;
    this._program = program;
  }

  public getUniforms(gl: WebGLRenderingContext) {
    return {
      ...super.getUniforms(gl),
      color: this.color.value,
      lightColor: Color.WHITE.value,
    };
  }

  public get program() {
    return this._program;
  }
}
