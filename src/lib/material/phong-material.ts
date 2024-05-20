import { Color } from "../engine/color";
import { Texture } from "../engine/texture";
import { MATERIAL_TYPE } from "./material-type";
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
  public diffuseTexture?: Texture;
  public specular: Color;
  public specularTexture?: Texture;
  public shininess: number;
  public normalTexture?: Texture;

  constructor(options: PhongMaterialOptions) {
    super(options);
    this.ambient = options.ambient;
    this.diffuse = options.diffuse;
    this.specular = options.specular;
    this.shininess = options.shininess;
    this.specularTexture = options.specularTexture;
    this.normalTexture = options.normalTexture;
  }

  public get materialType() {
    return MATERIAL_TYPE.PHONG;
  }

  public getUniforms(gl: WebGLRenderingContext) {
    return {
      ...super.getUniforms(gl),
      ambientColor: this.ambient.value,
      diffuseColor: this.diffuse.value,
      specular: this.specular.value,
      shininess: [this.shininess],
      // specularTexture: [
      //   this.specularTexture?.texture ?? Texture.WHITE(gl).texture,
      // ],
      // normalTexture: [this.normalTexture?.texture ?? Texture.WHITE(gl).texture],
    };
  }
}
