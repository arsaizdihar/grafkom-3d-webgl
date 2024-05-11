import { Color } from "../engine/color";
import { MATERIAL_TYPE } from "./material-type";
import { MaterialOptions, ShaderMaterial } from "./shader-material";

export interface PhongMaterialOptions extends MaterialOptions {
  ambient: Color;
  diffuse: Color;
  specular: Color;
  shininess: number;
}

export class PhongMaterial extends ShaderMaterial {
  public ambient: Color;
  public diffuse: Color;
  public specular: Color;
  public shininess: number;

  constructor(options: PhongMaterialOptions) {
    super(options);
    this.ambient = options.ambient;
    this.diffuse = options.diffuse;
    this.specular = options.specular;
    this.shininess = options.shininess;
  }

  public get materialType() {
    return MATERIAL_TYPE.PHONG;
  }
}
