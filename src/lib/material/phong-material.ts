import { Application } from "../engine/application";
import { Color } from "../engine/color";
import { Texture } from "../engine/texture";
import { MaterialOptions, ShaderMaterial } from "./shader-material";

export interface PhongMaterialOptions extends MaterialOptions {
  ambient: Color;
  diffuse: Color;
  specular: Color;
  shininess: number;
  specularTexture?: Texture;
  normalTexture?: Texture;
}

export class PhongMaterial extends ShaderMaterial {
  public ambient: Color;
  public diffuse: Color;
  public specular: Color;
  public specularTexture?: Texture;
  public shininess: number;
  public normalTexture?: Texture;
  private _program;

  constructor(
    options: PhongMaterialOptions,
    program: Application["phongProgram"]
  ) {
    super(options);
    this.ambient = options.ambient;
    this.diffuse = options.diffuse;
    this.specular = options.specular;
    this.shininess = options.shininess;
    this.specularTexture = options.specularTexture;
    this.normalTexture = options.normalTexture;
    this._program = program;
  }

  public getUniforms(gl: WebGLRenderingContext) {
    return {
      ...super.getUniforms(gl),
      ambientColor: this.ambient.value,
      diffuseColor: this.diffuse.value,
      specular: this.specular.value,
      shininess: [this.shininess],
      specularTexture: [
        this.specularTexture?.texture ?? Texture.WHITE(gl).texture,
      ],
      normalTexture: [
        this.normalTexture?.texture ?? Texture.NORMAL(gl).texture,
      ],
    };
  }

  get program() {
    return this._program;
  }
}
