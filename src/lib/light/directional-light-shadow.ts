import { OrthographicCamera } from "../camera/orthographic-camera";
import { Color } from "../engine/color";
import { LightShadow } from "../engine/light-shadow";

export class DirectionalLightShadow extends LightShadow {
  constructor() {
    super(new OrthographicCamera(-5, 5, 5, -5, 0.5, 500));
  }  
}