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
  displacementTexture?: Texture;
  displacementFactor?: number;
  displacementBias?: number;
}

export class PhongMaterial extends ShaderMaterial {
  public ambient: Color;
  public diffuse: Color;
  public specular: Color;
  public specularTexture?: Texture;
  public shininess: number;
  public normalTexture?: Texture;
  public displacementTexture?: Texture;
  public displacementFactor: number;
  public displacementBias: number;
  private _program;

  constructor(
    options: PhongMaterialOptions,
    program: Application["phongProgram"]
  ) {
    super(options, "phong");
    this.ambient = options.ambient;
    this.diffuse = options.diffuse;
    this.specular = options.specular;
    this.shininess = options.shininess;
    this.specularTexture = options.specularTexture;
    this.normalTexture = options.normalTexture;
    this._program = program;
    this.displacementTexture = options.displacementTexture;
    this.displacementFactor = options.displacementFactor ?? 1;
    this.displacementBias = options.displacementBias ?? 0;
  }

  public getUniforms(gl: WebGLRenderingContext) {
    return {
      ...super.getUniforms(gl),
      ambientColor: this.ambient.value,
      diffuseColor: this.diffuse.value,
      specularColor: this.specular.value,
      shininess: [this.shininess],
      specularTexture: [
        this.specularTexture?.texture ?? Texture.WHITE(gl).texture,
      ],
      normalTexture: [
        this.normalTexture?.texture ?? Texture.NORMAL(gl).texture,
      ],
      displacementTexture: [
        this.displacementTexture?.texture ?? Texture.BLACK(gl).texture,
      ],
      displacementFactor: [this.displacementFactor],
      displacementBias: [this.displacementBias],
    };
  }

  get program() {
    return this._program;
  }
}
