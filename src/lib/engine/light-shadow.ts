import { Camera } from "./camera";

export class LightShadow {
  camera: Camera;
  bias: number;
  normalBias: number;
  radius: number;
  blurSamples: number;

  map: any;
  mapPass: any;

  constructor(camera: Camera) {
    this.camera = camera;

    this.bias = 0;
    this.normalBias = 0;
    this.radius = 1;
    this.blurSamples = 8;

    this.map = null;
    this.mapPass = null;
  }

  dispose() {
    if (this.map) {
      this.map.dispose();
    }
  }
}