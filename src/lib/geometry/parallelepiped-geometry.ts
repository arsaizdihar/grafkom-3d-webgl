import { BufferAttribute } from "../engine/buffer-attribute";
import { BufferGeometry, GeometryData } from "../engine/buffer-geometry";

export class ParallelepipedGeometry extends BufferGeometry {
  size: number;

  constructor(size = 1, data?: GeometryData) {
    super(data);
    this.size = size;
    if (data) {
      return;
    }
    const hs = size / 2;
    const vertices = new Float32Array([
      // back
      -hs, -hs, -hs, // back left bottom
      -hs, hs, -hs, // back left top
      hs, -hs, -hs, // back right bottom
      hs, hs, -hs, // back right top
      // front
      -hs * 0.5, -hs * 0.5, hs, // front left bottom
      -hs * 0.5, hs * 0.5, hs, // front left top
      hs * 0.5, -hs * 0.5, hs, // front right bottom
      hs * 0.5, hs * 0.5, hs, // front right top
    ]);
    this.setAttribute("position", new BufferAttribute(vertices, 3));
    this.calculateNormals();
  }
}
