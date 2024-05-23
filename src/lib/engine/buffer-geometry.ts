import { BufferAttribute } from "./buffer-attribute";
import { Vector3 } from "./vector";

export type GeometryData = {
  position: number[];
  texcoord: number[];
};

export class BufferGeometry {
  private _attributes: { [name: string]: BufferAttribute };
  private _indices?: BufferAttribute;

  constructor(data?: GeometryData) {
    if (data) {
      this._attributes = {
        position: new BufferAttribute(new Float32Array(data.position), 3),
        texcoord: new BufferAttribute(new Float32Array(data.texcoord), 2),
      };
      this.calculateNormals();
    } else {
      this._attributes = {};
    }
  }

  get attributes() {
    return this._attributes;
  }

  get indices() {
    return this._indices;
  }

  setIndices(indices: BufferAttribute) {
    this._indices = indices;
    return this;
  }

  removeIndices() {
    this._indices = undefined;
    return this;
  }

  setAttribute(name: string, attribute: BufferAttribute) {
    this._attributes[name] = attribute;
    return this;
  }

  getAttribute(name: string) {
    return this._attributes[name];
  }

  deleteAttribute(name: string) {
    delete this._attributes[name];
    return this;
  }

  calculateNormals(forceNewAttribute = false) {
    const position = this.getAttribute("position");
    if (!position) return;
    let normal = this.getAttribute("normal");
    if (forceNewAttribute || !normal) {
      normal = new BufferAttribute(
        new Float32Array(position.length),
        position.size
      );
    } else {
      normal.data.fill(0);
    }

    const pA = new Vector3(),
      pB = new Vector3(),
      pC = new Vector3();
    const nA = new Vector3(),
      nB = new Vector3(),
      nC = new Vector3();
    const cb = new Vector3(),
      ab = new Vector3();

    const indices = this.indices;
    if (indices) {
      for (let i = 0, il = indices.count; i < il; i += 3) {
        const [vA] = indices.get(i);
        const [vB] = indices.get(i + 1);
        const [vC] = indices.get(i + 2);

        pA.fromBufferAttribute(position, vA);
        pB.fromBufferAttribute(position, vB);
        pC.fromBufferAttribute(position, vC);

        cb.subVectors(pC, pB);
        ab.subVectors(pA, pB);
        cb.cross(ab);

        nA.fromBufferAttribute(normal, vA);
        nB.fromBufferAttribute(normal, vB);
        nC.fromBufferAttribute(normal, vC);

        nA.add(cb);
        nB.add(cb);
        nC.add(cb);

        normal.set(vA, [nA.x, nA.y, nA.z]);
        normal.set(vB, [nB.x, nB.y, nB.z]);
        normal.set(vC, [nC.x, nC.y, nC.z]);
      }
    } else {
      for (let i = 0, il = position.count; i < il; i += 3) {
        pA.fromBufferAttribute(position, i);
        pB.fromBufferAttribute(position, i + 1);
        pC.fromBufferAttribute(position, i + 2);

        cb.subVectors(pC, pB);
        ab.subVectors(pA, pB);
        cb.cross(ab);

        cb.normalize();

        normal.set(i, [cb.x, cb.y, cb.z]);
        normal.set(i + 1, [cb.x, cb.y, cb.z]);
        normal.set(i + 2, [cb.x, cb.y, cb.z]);
      }
    }

    this.setAttribute("normal", normal);
    this.calculateTangents();
  }

  private calculateTangents() {
    // NOT SUPPORTING INDICES, FK IT
    const position = this.getAttribute("position");
    const texcoord = this.getAttribute("texcoord");
    if (!position || !texcoord) return;

    let tangents = this.getAttribute("tangent");
    if (!tangents) {
      tangents = new BufferAttribute(
        new Float32Array(position.length),
        position.size
      );
    } else {
      tangents.data.fill(0);
    }

    let bitangents = this.getAttribute("bitangent");
    if (!bitangents) {
      bitangents = new BufferAttribute(
        new Float32Array(position.length),
        position.size
      );
    } else {
      bitangents.data.fill(0);
    }

    const tangent = new Vector3(),
      bitangent = new Vector3(),
      pos1 = new Vector3(),
      pos2 = new Vector3(),
      pos3 = new Vector3(),
      uv1 = new Vector3(),
      uv2 = new Vector3(),
      uv3 = new Vector3(),
      nm = new Vector3(),
      edge1 = new Vector3(),
      edge2 = new Vector3(),
      deltaUV1 = new Vector3(),
      deltaUV2 = new Vector3();
    for (let i = 0, il = position.count; i < il; i += 3) {
      pos1.fromBufferAttribute(position, i);
      pos2.fromBufferAttribute(position, i + 1);
      pos3.fromBufferAttribute(position, i + 2);

      uv1.fromBufferAttribute(texcoord, i);
      uv2.fromBufferAttribute(texcoord, i + 1);
      uv3.fromBufferAttribute(texcoord, i + 2);

      edge1.subVectors(pos2, pos1);
      edge2.subVectors(pos3, pos1);
      deltaUV1.subVectors(uv2, uv1);
      deltaUV2.subVectors(uv3, uv1);

      const f = 1.0 / (deltaUV1.x * deltaUV2.y - deltaUV2.x * deltaUV1.y);
      tangent.x = f * (deltaUV2.y * edge1.x - deltaUV1.y * edge2.x);
      tangent.y = f * (deltaUV2.y * edge1.y - deltaUV1.y * edge2.y);
      tangent.z = f * (deltaUV2.y * edge1.z - deltaUV1.y * edge2.z);

      bitangent.x = f * (-deltaUV2.x * edge1.x + deltaUV1.x * edge2.x);
      bitangent.y = f * (-deltaUV2.x * edge1.y + deltaUV1.x * edge2.y);
      bitangent.z = f * (-deltaUV2.x * edge1.z + deltaUV1.x * edge2.z);

      tangents.set(i, [tangent.x, tangent.y, tangent.z]);
      tangents.set(i + 1, [tangent.x, tangent.y, tangent.z]);
      tangents.set(i + 2, [tangent.x, tangent.y, tangent.z]);

      bitangents.set(i, [bitangent.x, bitangent.y, bitangent.z]);
      bitangents.set(i + 1, [bitangent.x, bitangent.y, bitangent.z]);
      bitangents.set(i + 2, [bitangent.x, bitangent.y, bitangent.z]);
    }

    this.setAttribute("tangent", tangents);
    this.setAttribute("bitangent", bitangents);
  }
}
