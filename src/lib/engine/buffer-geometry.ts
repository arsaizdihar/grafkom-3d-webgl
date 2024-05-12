import { BufferAttribute } from "./buffer-attribute";
import { Vector3 } from "./vector";

export class BufferGeometry {
  private _attributes: { [name: string]: BufferAttribute };
  private _indices?: BufferAttribute;

  constructor() {
    this._attributes = {};
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

        normal.set(i, [cb.x, cb.y, cb.z]);
        normal.set(i + 1, [cb.x, cb.y, cb.z]);
        normal.set(i + 2, [cb.x, cb.y, cb.z]);
      }
    }

    // this.setAttribute("normal", normal);
  }
}
