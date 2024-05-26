import { BufferAttribute } from "../engine/buffer-attribute";
import { BufferGeometry, GeometryData } from "../engine/buffer-geometry";
import { addCube } from "./pyramid-hollow-geometry";

export class ParallelepipedHollowGeometry extends BufferGeometry {
  constructor(
    public size: number = 50,
    public thickness: number = 0.1,
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
    
    const hs = this.size / 2; // half size
    const ht = this.thickness / 2; // half thickness

    const shearX: number = size;
    const shearZ: number = size;
    
    // bottom and top faces
    for (let j = 0; j < 2; j++) {
      const y = j === 0 ? -hs : hs;
      const top = y + ht;
      const bottom = y - ht;

      // front and back faces
      for (let i = 0; i < 2; i++) {
        const z = i === 0 ? hs : -hs;
        const front = z + ht;
        const back = z - ht;
        const left = -hs - ht;
        const right = hs + ht;
        const shearTopX = j === 0 ? 0 : shearX;
        const shearTopZ = j === 0 ? 0 : shearZ;
        addCube(vertices, texcoord, front, back, top, bottom, left, right, shearTopX, shearTopZ);
      }

      // left and right faces
      for (let i = 0; i < 2; i++) {
        const x = i === 0 ? -hs : hs;
        const left = x - ht;
        const right = x + ht;
        const front = hs + ht;
        const back = -hs - ht;
        const shearTopX = j === 0 ? 0 : shearX;
        const shearTopZ = j === 0 ? 0 : shearZ;
        addCube(vertices, texcoord, front, back, top, bottom, left, right, shearTopX, shearTopZ);
      }
    }

    // Vertical edges
    for (let i = 0; i < 2; i++) {
      const x = i === 0 ? -hs : hs;
      for (let k = 0; k < 2; k++) {
        const z = k === 0 ? hs : -hs;
        const front = z + ht;
        const back = z - ht;
        const top = hs + ht;
        const bottom = -hs - ht;
        const left = x - ht;
        const right = x + ht;
        addCube(vertices, texcoord, front, back, top, bottom, left, right, shearX, shearZ);
      }
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
