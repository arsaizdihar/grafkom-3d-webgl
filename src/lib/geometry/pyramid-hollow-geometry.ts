import { BufferAttribute } from "../engine/buffer-attribute";
import { BufferGeometry } from "../engine/buffer-geometry";

export class PyramidHollowGeometry extends BufferGeometry {
  constructor(public size: number = 1, public thickness: number = 0.1) {
    super();
    this.size = Math.max(this.size, 1);
    this.thickness = Math.min(this.thickness, this.size / 4);

    const vertices: number[] = [];

    const hs = size / 2;
    const ht = this.thickness / 2;

    // bottom front and back
    for (let i = 0; i < 2; i++) {
      const z = i === 0 ? -hs : hs;
      const front = z + ht;
      const back = z - ht;
      const top = -hs + ht;
      const bottom = -hs - ht;
      const left = -hs - ht;
      const right = hs + ht;
      addCube(vertices, front, back, top, bottom, left, right, [
        "left",
        "right",
      ]);
    }

    // left and right
    for (let i = 0; i < 2; i++) {
      const x = i === 0 ? -hs : hs;
      let front = hs + ht;
      let back = -hs - ht;
      const top = -hs + ht;
      const bottom = -hs - ht;
      const left = x - ht;
      const right = x + ht;
      addCube(
        vertices,
        front,
        back,
        top,
        bottom,
        left,
        right,
        i === 0 ? ["right"] : ["left"]
      );
      front -= this.thickness;
      back += this.thickness;
      const all: CubeFace[] = [
        "front",
        "back",
        "top",
        "bottom",
        "left",
        "right",
      ];
      if (i === 0) {
        all.splice(all.indexOf("right"), 1);
      } else {
        all.splice(all.indexOf("left"), 1);
      }
      addCube(vertices, front, back, top, bottom, left, right, all);
    }

    // front left to top
    let front = hs + ht;
    let back = hs - ht;
    let top = hs + ht;
    let bottom = -hs + ht;
    let left = -hs - ht;
    let right = -hs + ht;

    addCubeShear(vertices, front, back, top, bottom, left, right, hs, [
      "bottom",
    ]);

    // front right to top
    left = hs - ht;
    right = hs + ht;
    addCubeShear(vertices, front, back, top, bottom, left, right, -hs, [
      "bottom",
    ]);

    // back right to top
    front = -hs + ht;
    back = -hs - ht;
    addCubeShear(vertices, front, back, top, bottom, left, right, -hs, [
      "bottom",
    ]);

    // back left to top
    left = -hs - ht;
    right = -hs + ht;
    addCubeShear(vertices, front, back, top, bottom, left, right, hs, [
      "bottom",
    ]);

    this.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(vertices), 3)
    );
    this.setAttribute(
      "texcoord",
      new BufferAttribute(
        new Float32Array(
          Array.from<number>({ length: (vertices.length / 3) * 2 }).fill(0)
        ),
        2
      )
    );
    this.calculateNormals();
  }
}

type CubeFace = "front" | "back" | "top" | "bottom" | "left" | "right";

function addCube(
  vertices: number[],
  front: number,
  back: number,
  top: number,
  bottom: number,
  left: number,
  right: number,
  excludes: CubeFace[] = []
) {
  // back
  if (!excludes.includes("back")) {
    vertices.push(
      left,
      bottom,
      back, // back left bottom
      left,
      top,
      back, // back left top
      right,
      bottom,
      back, // back right bottom
      left,
      top,
      back, // back left top
      right,
      top,
      back, // back right top
      right,
      bottom,
      back // back right bottom
    );
  }
  if (!excludes.includes("front")) {
    // front
    vertices.push(
      left,
      bottom,
      front, // front left bottom
      right,
      bottom,
      front, // front right bottom
      left,
      top,
      front, // front left top
      left,
      top,
      front, // front left top
      right,
      bottom,
      front, // front right bottom
      right,
      top,
      front // front right top
    );
  }
  if (!excludes.includes("top")) {
    // top
    vertices.push(
      left,
      top,
      back, // back left top
      left,
      top,
      front, // front left top
      right,
      top,
      back, // back right top
      left,
      top,
      front, // front left top
      right,
      top,
      front, // front right top
      right,
      top,
      back // back right top
    );
  }
  if (!excludes.includes("bottom")) {
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
  }
  if (!excludes.includes("left")) {
    // left
    vertices.push(
      left,
      bottom,
      back, // back left bottom
      left,
      bottom,
      front, // front left bottom
      left,
      top,
      back, // back left top
      left,
      bottom,
      front, // front left bottom
      left,
      top,
      front, // front left top
      left,
      top,
      back // back left top
    );
  }
  if (!excludes.includes("right")) {
    // right
    vertices.push(
      right,
      bottom,
      back, // back right bottom
      right,
      top,
      back, // back right top
      right,
      bottom,
      front, // front right bottom
      right,
      bottom,
      front, // front right bottom
      right,
      top,
      back, // back right top
      right,
      top,
      front // front right top
    );
  }
}

function addCubeShear(
  vertices: number[],
  front: number,
  back: number,
  top: number,
  bottom: number,
  left: number,
  right: number,
  shear: number,
  excludes: CubeFace[] = []
) {
  // back
  if (!excludes.includes("back")) {
    vertices.push(
      left,
      bottom,
      back, // back left bottom
      left + shear,
      top,
      back, // back left top
      right,
      bottom,
      back, // back right bottom
      left + shear,
      top,
      back, // back left top
      right + shear,
      top,
      back, // back right top
      right,
      bottom,
      back // back right bottom
    );
  }
  if (!excludes.includes("front")) {
    // front
    vertices.push(
      left,
      bottom,
      front, // front left bottom
      right,
      bottom,
      front, // front right bottom
      left + shear,
      top,
      front, // front left top
      left + shear,
      top,
      front, // front left top
      right,
      bottom,
      front, // front right bottom
      right + shear,
      top,
      front // front right top
    );
  }
  if (!excludes.includes("top")) {
    // top
    vertices.push(
      left + shear,
      top,
      back, // back left top
      left + shear,
      top,
      front, // front left top
      right + shear,
      top,
      back, // back right top
      left + shear,
      top,
      front, // front left top
      right + shear,
      top,
      front, // front right top
      right + shear,
      top,
      back // back right top
    );
  }
  if (!excludes.includes("bottom")) {
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
  }
  if (!excludes.includes("left")) {
    // left
    vertices.push(
      left,
      bottom,
      back, // back left bottom
      left,
      bottom,
      front, // front left bottom
      left + shear,
      top,
      back, // back left top
      left,
      bottom,
      front, // front left bottom
      left + shear,
      top,
      front, // front left top
      left + shear,
      top,
      back // back left top
    );
  }
  if (!excludes.includes("right")) {
    // right
    vertices.push(
      right,
      bottom,
      back, // back right bottom
      right + shear,
      top,
      back, // back right top
      right,
      bottom,
      front, // front right bottom
      right,
      bottom,
      front, // front right bottom
      right + shear,
      top,
      back, // back right top
      right + shear,
      top,
      front // front right top
    );
  }
}
