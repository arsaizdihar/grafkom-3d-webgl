import { BufferAttribute } from "../engine/buffer-attribute";
import { BufferGeometry, GeometryData } from "../engine/buffer-geometry";

export class TorusGeometry extends BufferGeometry {
  constructor(
    public slices: number = 20,
    public loops: number = 20,
    public innerRad: number = 5,
    public outerRad: number = 25,
    data?: GeometryData
  ) {
    super();
    this.slices = 20;
    this.loops = 50;
    this.innerRad = 10;
    this.outerRad = 20;

    // if (data) {
    //   return;
    // }

    const vertices: number[] = [];
    const texCoords: number[] = [];
    const indices: number[] = [];

    for (let slice = 0; slice <= this.slices; ++slice) {
      const v = slice / this.slices;
      const sliceAngle = v * 2 * Math.PI;
      const cosSlice = Math.cos(sliceAngle);
      const sinSlice = Math.sin(sliceAngle);
      const sliceRad = this.outerRad + this.innerRad * cosSlice;

      for (let loop = 0; loop <= this.loops; ++loop) {
        const u = loop / this.loops;
        const loopAngle = u * 2 * Math.PI;
        const cosLoop = Math.cos(loopAngle);
        const sinLoop = Math.sin(loopAngle);

        const x = sliceRad * cosLoop;
        const y = sliceRad * sinLoop;
        const z = this.innerRad * sinSlice;

        vertices.push(x, y, z);
        texCoords.push(u, v);
      }
    }

    const vertsPerSlice = this.loops + 1;
    for (let i = 0; i < this.slices; ++i) {
      let v1 = i * vertsPerSlice;
      let v2 = v1 + vertsPerSlice;

      for (let j = 0; j < this.loops; ++j) {
        indices.push(v1);
        indices.push(v1 + 1);
        indices.push(v2);

        indices.push(v2);
        indices.push(v1 + 1);
        indices.push(v2 + 1);

        v1 += 1;
        v2 += 1;
      }
    }

    const verticesResult: number[] = [];
    const texCoordsResult: number[] = [];

    indices.forEach((index) => {
      verticesResult.push(vertices[index * 3]);
      verticesResult.push(vertices[index * 3 + 1]);
      verticesResult.push(vertices[index * 3 + 2]);

      texCoordsResult.push(texCoords[index * 2]);
      texCoordsResult.push(texCoords[index * 2 + 1]);
    });

    // not using indices because it will generate weird normals
    // this.setIndices(new BufferAttribute(new Uint16Array(indices), 3));
    this.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(verticesResult), 3)
    );
    this.setAttribute(
      "texcoord",
      new BufferAttribute(new Float32Array(texCoordsResult), 2)
    );
    this.calculateNormals();
  }
}
