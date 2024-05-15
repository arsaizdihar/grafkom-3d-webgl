import { BufferAttribute } from "../engine/buffer-attribute";
import { BufferGeometry } from "../engine/buffer-geometry";

export class CubeHollowGeometry extends BufferGeometry {
  constructor(public size: number = 1, public thickness: number = 0.1) {
    super();
    this.size = Math.max(this.size, 1);
    this.thickness = Math.min(this.thickness, this.size / 4);

    const vertices: number[] = [];

    const hs = size / 2;
    const ht = this.thickness / 2;

    for (let j = 0; j < 2; j ++) {
      // bottom front and back
      for (let i = 0; i < 2; i++) {
        const z = i === 0 ? hs : -hs;
        const front = z + ht;
        const back = z - ht;
        const top = j == 0 ? -hs + ht : hs + ht;
        const bottom = j == 0 ? -hs - ht : hs - ht;
        const left = -hs - ht;
        const right = hs + ht;
        addCube(vertices, front, back, top, bottom, left, right);
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
        addCube(vertices, front, back, top, bottom, left, right);
      }
    }

    // Rusuk tegak
    for (let i = 0; i < 2; i++) {
      const front = hs + ht;
      const back = hs - ht;
      const top = hs + ht;
      const bottom = -hs + ht;
      const left = i == 0 ? -hs - ht : hs - ht;
      const right = i == 0 ? -hs + ht: hs + ht;
      console.log(front, back, top, bottom, left, right);
      addCube(vertices, front, back, top, bottom, left, right);
    }

    // bottom front and back
    for (let i = 0; i < 2; i++) {
      const front = -hs + ht;
      const back = -hs - ht;
      const top = hs + ht;
      const bottom = -hs + ht;
      const left = i == 0 ? -hs - ht : hs - ht;
      const right = i == 0 ? -hs + ht: hs + ht;
      console.log(front, back, top, bottom, left, right);
      addCube(vertices, front, back, top, bottom, left, right);
    }

    this.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(vertices), 3)
    );
    this.setAttribute(
      "texcoord",
      new BufferAttribute(
        new Float32Array(
          Array.from<number>({ length: (vertices.length / 3) * 2 }).fill(0.5)
        ),
        2
      )
    );
    this.calculateNormals();
  }
}

function addCube(
  vertices: number[],
  front: number,
  back: number,
  top: number,
  bottom: number,
  left: number,
  right: number,
  shearX: number = 0,
  shearZ: number = 0
) {
  vertices.push(
    left,
    bottom,
    back, // back left bottom
    left + shearX,
    top,
    back + shearZ, // back left top
    right,
    bottom,
    back, // back right bottom
    left + shearX,
    top,
    back + shearZ, // back left top
    right + shearX,
    top,
    back + shearZ, // back right top
    right,
    bottom,
    back // back right bottom
  );
  // front
  vertices.push(
    left,
    bottom,
    front, // front left bottom
    right,
    bottom,
    front, // front right bottom
    left + shearX,
    top,
    front + shearZ, // front left top
    left + shearX,
    top,
    front + shearZ, // front left top
    right,
    bottom,
    front, // front right bottom
    right + shearX,
    top,
    front + shearZ // front right top
  );
  // top
  vertices.push(
    left + shearX,
    top,
    back + shearZ, // back left top
    left + shearX,
    top,
    front + shearZ, // front left top
    right + shearX,
    top,
    back + shearZ, // back right top
    left + shearX,
    top,
    front + shearZ, // front left top
    right + shearX,
    top,
    front + shearZ, // front right top
    right + shearX,
    top,
    back + shearZ // back right top
  );
  // bottom
  vertices.push(
    left,
    bottom,
    back, // back left bottom
    right,
    bottom,
    back, // back right bottom
    left,
    bottom,
    front, // front left bottom
    left,
    bottom,
    front, // front left bottom
    right,
    bottom,
    back, // back right bottom
    right,
    bottom,
    front // front right bottom
  );
  // left
  vertices.push(
    left,
    bottom,
    back, // back left bottom
    left,
    bottom,
    front, // front left bottom
    left + shearX,
    top,
    back + shearZ, // back left top
    left,
    bottom,
    front, // front left bottom
    left + shearX,
    top,
    front + shearZ, // front left top
    left + shearX,
    top,
    back + shearZ // back left top
  );
  // right
  vertices.push(
    right,
    bottom,
    back, // back right bottom
    right + shearX,
    top,
    back + shearZ, // back right top
    right,
    bottom,
    front, // front right bottom
    right,
    bottom,
    front, // front right bottom
    right + shearX,
    top,
    back + shearZ, // back right top
    right + shearX,
    top,
    front + shearZ // front right top
  );
}
