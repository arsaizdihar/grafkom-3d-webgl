import { BufferAttribute } from "../engine/buffer-attribute";
import { BufferGeometry, GeometryData } from "../engine/buffer-geometry";

export class CubeGeometry extends BufferGeometry {
  size: number;

  constructor(size = 50, data?: GeometryData) {
    super(data);
    this.size = size;
    if (data) {
      return;
    }
    const hs = size / 2;
    const vertices = new Float32Array([
      // back
      -hs,
      -hs,
      -hs, // back left bottom
      -hs,
      hs,
      -hs, // back left top
      hs,
      -hs,
      -hs, // back right bottom
      -hs,
      hs,
      -hs, // back left top
      hs,
      hs,
      -hs, // back right top
      hs,
      -hs,
      -hs, // back right bottom
      // front
      -hs,
      -hs,
      hs, // front left bottom
      hs,
      -hs,
      hs, // front right bottom
      -hs,
      hs,
      hs, // front left top
      -hs,
      hs,
      hs, // front left top
      hs,
      -hs,
      hs, // front right bottom
      hs,
      hs,
      hs, // front right top
      // top
      -hs,
      hs,
      -hs, // back left top
      -hs,
      hs,
      hs, // front left top
      hs,
      hs,
      -hs, // back right top
      -hs,
      hs,
      hs, // front left top
      hs,
      hs,
      hs, // front right top
      hs,
      hs,
      -hs, // back right top
      // bottom
      -hs,
      -hs,
      -hs, // back left bottom
      hs,
      -hs,
      -hs, // back right bottom
      -hs,
      -hs,
      hs, // front left bottom
      -hs,
      -hs,
      hs, // front left bottom
      hs,
      -hs,
      -hs, // back right bottom
      hs,
      -hs,
      hs, // front right bottom
      // left
      -hs,
      -hs,
      -hs, // back left bottom
      -hs,
      -hs,
      hs, // front left bottom
      -hs,
      hs,
      -hs, // back left top
      -hs,
      -hs,
      hs, // front left bottom
      -hs,
      hs,
      hs, // front left top
      -hs,
      hs,
      -hs, // back left top
      // right
      hs,
      -hs,
      -hs, // back right bottom
      hs,
      hs,
      -hs, // back right top
      hs,
      -hs,
      hs, // front right bottom
      hs,
      -hs,
      hs, // front right bottom
      hs,
      hs,
      -hs, // back right top
      hs,
      hs,
      hs, // front right top
    ]);
    this.setAttribute("position", new BufferAttribute(vertices, 3));
    this.setAttribute(
      "texcoord",
      new BufferAttribute(
        new Float32Array([
          // back
          0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1,
          // front
          0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0,
          // // top
          0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1,
          // bottom
          0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0,
          // left
          0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0,
          // right
          1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0,
        ]),
        2
      )
    );
    this.calculateNormals();
  }
}
