import { BufferAttribute } from "../engine/buffer-attribute";
import { BufferGeometry } from "../engine/buffer-geometry";
import { Vector3 } from "../engine/vector";

export class SphereGeometry extends BufferGeometry {
  constructor(
    public radius = 25,
    public widthSegments = 32,
    public heightSegments = 16,
    public phiStart = 0,
    public phiLength = Math.PI * 2,
    public thetaStart = 0,
    public thetaLength = Math.PI
  ) {
    super();
    widthSegments = Math.max(3, Math.floor(widthSegments));
    heightSegments = Math.max(2, Math.floor(heightSegments));

    const thetaEnd = Math.min(thetaStart + thetaLength, Math.PI);

    let index = 0;
    const grid = [];

    const vertex = new Vector3();
    const normal = new Vector3();

    // buffers
    const indices = [];
    const vertices = [];
    const normals = [];
    const uvs = [];

    // generate vertices, normals and uvs
    for (let iy = 0; iy <= heightSegments; iy++) {
      const verticesRow = [];

      const v = iy / heightSegments;

      // special case for the poles

      let uOffset = 0;

      if (iy === 0 && thetaStart === 0) {
        uOffset = 0.5 / widthSegments;
      } else if (iy === heightSegments && thetaEnd === Math.PI) {
        uOffset = -0.5 / widthSegments;
      }

      for (let ix = 0; ix <= widthSegments; ix++) {
        const u = ix / widthSegments;

        // vertex

        vertex.x =
          -radius *
          Math.cos(phiStart + u * phiLength) *
          Math.sin(thetaStart + v * thetaLength);
        vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
        vertex.z =
          radius *
          Math.sin(phiStart + u * phiLength) *
          Math.sin(thetaStart + v * thetaLength);

        vertices.push(vertex.x, vertex.y, vertex.z);

        // normal

        normal.copy(vertex).normalize();
        normals.push(normal.x, normal.y, normal.z);

        // uv

        uvs.push(u + uOffset, 1 - v);

        verticesRow.push(index++);
      }

      grid.push(verticesRow);
    }

    // indices

    for (let iy = 0; iy < heightSegments; iy++) {
      for (let ix = 0; ix < widthSegments; ix++) {
        const a = grid[iy][ix + 1];
        const b = grid[iy][ix];
        const c = grid[iy + 1][ix];
        const d = grid[iy + 1][ix + 1];

        if (iy !== 0 || thetaStart > 0) indices.push(a, b, d);
        if (iy !== heightSegments - 1 || thetaEnd < Math.PI)
          indices.push(b, c, d);
      }
    }
    const fvertices = [];
    const fnormals = [];
    const fuvs = [];

    for (let i = 0; i < indices.length; i++) {
      fvertices.push(vertices[indices[i] * 3]);
      fvertices.push(vertices[indices[i] * 3 + 1]);
      fvertices.push(vertices[indices[i] * 3 + 2]);

      fnormals.push(normals[indices[i] * 3]);
      fnormals.push(normals[indices[i] * 3 + 1]);
      fnormals.push(normals[indices[i] * 3 + 2]);

      fuvs.push(uvs[indices[i] * 2]);
      fuvs.push(uvs[indices[i] * 2 + 1]);
    }

    this.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(fvertices), 3)
    );
    this.setAttribute(
      "normal",
      new BufferAttribute(new Float32Array(fnormals), 3)
    );
    this.setAttribute(
      "texcoord",
      new BufferAttribute(new Float32Array(fuvs), 2)
    );
    this.calculateTangents();
  }
}
