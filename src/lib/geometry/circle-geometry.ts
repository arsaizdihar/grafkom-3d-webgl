import { BufferAttribute } from "../engine/buffer-attribute";
import { BufferGeometry } from "../engine/buffer-geometry";
import { Vector3 } from "../engine/vector";

class CircleGeometry extends BufferGeometry {
  constructor(
    public radius = 25,
    segments = 32,
    thetaStart = 0,
    thetaLength = Math.PI * 2
  ) {
    super();

    segments = Math.max(3, segments);

    // buffers

    const indices = [];
    const vertices = [];
    const normals = [];
    const uvs = [];

    // helper variables

    const vertex = new Vector3();
    const uv = new Vector3();

    // center point

    vertices.push(0, 0, 0);
    normals.push(0, 0, 1);
    uvs.push(0.5, 0.5);

    for (let s = 0, i = 3; s <= segments; s++, i += 3) {
      const segment = thetaStart + (s / segments) * thetaLength;

      // vertex

      vertex.x = radius * Math.cos(segment);
      vertex.y = radius * Math.sin(segment);

      vertices.push(vertex.x, vertex.y, vertex.z);

      // normal

      normals.push(0, 0, 1);

      // uvs

      uv.x = (vertices[i] / radius + 1) / 2;
      uv.y = (vertices[i + 1] / radius + 1) / 2;

      uvs.push(uv.x, uv.y);
    }

    // indices

    for (let i = 1; i <= segments; i++) {
      indices.push(i, i + 1, 0);
    }

    // build geometry
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

export { CircleGeometry };
