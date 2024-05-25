import { BufferAttribute } from "../engine/buffer-attribute";
import { BufferGeometry, GeometryData } from "../engine/buffer-geometry";
import { addCube } from "./pyramid-hollow-geometry";

export class CubeHollowGeometry extends BufferGeometry {
  constructor(
    public size: number = 50,
    public thickness: number = 5,
    data?: GeometryData
  ) {
    super(data);
    this.size = Math.max(this.size, 1);
    this.thickness = Math.min(this.thickness, this.size / 4);
    if (data) {
      return;
    }

    const vertices: number[] = [];
    const texcoord: number[] = [];

    const hs = size / 2;
    const ht = this.thickness / 2;

    for (let j = 0; j < 2; j++) {
      // bottom front and back
      for (let i = 0; i < 2; i++) {
        const z = i === 0 ? hs : -hs;
        const front = z + ht;
        const back = z - ht;
        const top = j == 0 ? -hs + ht : hs + ht;
        const bottom = j == 0 ? -hs - ht : hs - ht;
        const left = -hs - ht;
        const right = hs + ht;
        addCube(vertices, texcoord, front, back, top, bottom, left, right);
      }

      // left and right
      for (let i = 0; i < 2; i++) {
        const x = i === 0 ? -hs : hs;
        const front = hs + ht;
        const back = -hs - ht;
        const top = j == 0 ? -hs + ht : hs + ht;
        const bottom = j == 0 ? -hs - ht : hs - ht;
        const left = x - ht;
        const right = x + ht;
        addCube(vertices, texcoord, front, back, top, bottom, left, right);
      }
    }

    // Rusuk tegak
    for (let i = 0; i < 2; i++) {
      const front = hs + ht;
      const back = hs - ht;
      const top = hs + ht;
      const bottom = -hs + ht;
      const left = i == 0 ? -hs - ht : hs - ht;
      const right = i == 0 ? -hs + ht : hs + ht;
      addCube(vertices, texcoord, front, back, top, bottom, left, right);
    }

    // bottom front and back
    for (let i = 0; i < 2; i++) {
      const front = -hs + ht;
      const back = -hs - ht;
      const top = hs + ht;
      const bottom = -hs + ht;
      const left = i == 0 ? -hs - ht : hs - ht;
      const right = i == 0 ? -hs + ht : hs + ht;
      addCube(vertices, texcoord, front, back, top, bottom, left, right);
    }

    this.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(vertices), 3)
    );
    this.setAttribute(
      "texcoord",
      new BufferAttribute(new Float32Array(texcoord), 2)
    );
    this.calculateNormals();
  }
}
