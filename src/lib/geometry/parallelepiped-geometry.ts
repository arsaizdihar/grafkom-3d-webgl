import { BufferAttribute } from "../engine/buffer-attribute";
import { BufferGeometry, GeometryData } from "../engine/buffer-geometry";

export class ParallelepipedGeometry extends BufferGeometry {
  size: number;

  constructor(size = 50, data?: GeometryData) {
    super(data);
    this.size = size;
    if (data) {
      return;
    }
    const hs = size / 2;

    // const vertices = new Float32Array([
    //   // back
    //   -hs, -hs, -hs, // back left bottom
    //   -hs, hs, -hs, // back left top
    //   hs, -hs, -hs, // back right bottom
    //   hs, hs, -hs, // back right top
    //   -hs * 0.5, -hs * 0.5, hs, // front left bottom
    //   -hs * 0.5, hs * 0.5, hs, // front left top
    //   hs * 0.5, -hs * 0.5, hs, // front right bottom
    //   hs * 0.5, hs * 0.5, hs, // front right top
    // ]);

    const vertices = new Float32Array([
      -hs,
      -hs,
      -hs,
      -hs,
      hs,
      0,
      hs,
      -hs,
      -hs,
      -hs,
      hs,
      0,
      hs,
      hs,
      0,
      hs,
      -hs,
      -hs,
      -hs,
      -hs,
      hs,
      hs,
      -hs,
      hs,
      -hs,
      hs,
      size,
      -hs,
      hs,
      size,
      hs,
      -hs,
      hs,
      hs,
      hs,
      size,
      -hs,
      hs,
      0,
      -hs,
      hs,
      size,
      hs,
      hs,
      0,
      -hs,
      hs,
      size,
      hs,
      hs,
      size,
      hs,
      hs,
      0,
      -hs,
      -hs,
      -hs,
      hs,
      -hs,
      -hs,
      -hs,
      -hs,
      hs,
      -hs,
      -hs,
      hs,
      hs,
      -hs,
      -hs,
      hs,
      -hs,
      hs,
      -hs,
      -hs,
      -hs,
      -hs,
      -hs,
      hs,
      -hs,
      hs,
      0,
      -hs,
      -hs,
      hs,
      -hs,
      hs,
      size,
      -hs,
      hs,
      0,
      hs,
      -hs,
      -hs,
      hs,
      hs,
      0,
      hs,
      -hs,
      hs,
      hs,
      -hs,
      hs,
      hs,
      hs,
      0,
      hs,
      hs,
      size,
    ]);

    const indices = new Uint16Array([
      // back face
      0, 1, 2, 2, 1, 3,
      // front face
      4, 5, 6, 6, 5, 7,
      // left face
      0, 1, 4, 4, 1, 5,
      // right face
      2, 3, 6, 6, 3, 7,
      // top face
      1, 5, 3, 3, 5, 7,
      // bottom face
      0, 4, 2, 2, 4, 6,
    ]);

    this.setAttribute("position", new BufferAttribute(vertices, 3));
    this.setIndices(new BufferAttribute(indices, 1));
    this.calculateNormals();
  }
}
