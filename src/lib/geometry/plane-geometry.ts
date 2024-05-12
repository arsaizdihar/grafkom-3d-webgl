import { BufferAttribute } from "../engine/buffer-attribute";
import { BufferGeometry } from "../engine/buffer-geometry";

export class PlaneGeometry extends BufferGeometry {
  width: number;
  height: number;

  constructor(width = 1, height = 1) {
    super();
    this.width = width;
    this.height = height;
    const hw = width / 2,
      hh = height / 2;
    const vertices = new Float32Array([
      -hw,
      0,
      -hh,
      hw,
      0,
      -hh,
      hw,
      0,
      hh,
      -hw,
      0,
      hh,
      -hw,
      0,
      -hh,
      hw,
      0,
      hh,
    ]);
    this.setAttribute("position", new BufferAttribute(vertices, 3));
    this.setAttribute(
      "texcoord",
      new BufferAttribute(
        new Float32Array([0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1]),
        2
      )
    );
    this.calculateNormals();
  }
}
