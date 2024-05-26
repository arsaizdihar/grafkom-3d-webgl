import { BufferAttribute } from "../engine/buffer-attribute";
import { BufferGeometry, GeometryData } from "../engine/buffer-geometry";

export class PlaneGeometry extends BufferGeometry {
  width: number;
  height: number;

  constructor(
    width = 50,
    height = 50,
    widthSegments = 50,
    heightSegments = 50,
    data?: GeometryData
  ) {
    super(data);
    this.width = width;
    this.height = height;
    if (data) {
      return;
    }
    const width_half = width / 2;
    const height_half = height / 2;

    const gridX = Math.floor(widthSegments);
    const gridZ = Math.floor(heightSegments);

    const gridX1 = gridX + 1;
    const gridZ1 = gridZ + 1;

    const segment_width = width / gridX;
    const segment_height = height / gridZ;

    //

    const indices = [];
    const vertices = [];
    const normals = [];
    const texcoords = [];

    for (let iz = 0; iz < gridZ1; iz++) {
      const z = iz * segment_height - height_half;

      for (let ix = 0; ix < gridX1; ix++) {
        const x = ix * segment_width - width_half;

        vertices.push(x, 0, z);

        normals.push(0, 1, 0);

        texcoords.push(ix / gridX);
        texcoords.push(iz / gridZ);
      }
    }

    for (let iy = 0; iy < gridZ; iy++) {
      for (let ix = 0; ix < gridX; ix++) {
        const a = ix + gridX1 * iy;
        const b = ix + gridX1 * (iy + 1);
        const c = ix + 1 + gridX1 * (iy + 1);
        const d = ix + 1 + gridX1 * iy;

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    const fVertices = [];
    const fTexcoords = [];
    const fNormals = [];

    for (let i = 0; i < indices.length; i++) {
      const index = indices[i];
      fVertices.push(
        vertices[index * 3],
        vertices[index * 3 + 1],
        vertices[index * 3 + 2]
      );
      fTexcoords.push(texcoords[index * 2], texcoords[index * 2 + 1]);
      fNormals.push(
        normals[index * 3],
        normals[index * 3 + 1],
        normals[index * 3 + 2]
      );
    }

    this.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(fVertices), 3)
    );
    this.setAttribute(
      "normal",
      new BufferAttribute(new Float32Array(fNormals), 3)
    );
    this.setAttribute(
      "texcoord",
      new BufferAttribute(new Float32Array(fTexcoords), 2)
    );
    this.calculateTangents();
  }
}
