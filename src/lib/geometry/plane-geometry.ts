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
      -hh, // back left
      hw,
      0,
      -hh, // back right
      hw,
      0,
      hh, // front right
      -hw,
      0,
      hh, // front left
      -hw, // use indices instead
      0,
      -hh, // back left
      hw,
      0,
      hh, // front right
    ]);
    // TODO: indices
    // this.setIndices(
    //   new BufferAttribute(new Uint16Array([0, 1, 2, 3, 0, 2]), 1)
    // );
    this.setAttribute("position", new BufferAttribute(vertices, 3));
    this.setAttribute(
      "texcoord",
      new BufferAttribute(new Float32Array([0, 0, 0, 1, 1, 1, 0, 1]), 2)
    );
    this.calculateNormals();
  }
}
