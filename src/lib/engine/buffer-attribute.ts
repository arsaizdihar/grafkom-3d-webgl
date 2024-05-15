import { WebGLType } from "../webgl/types";

export type TypedArray =
  | Float32Array
  | Uint8Array
  | Uint16Array
  | Uint32Array
  | Int8Array
  | Int16Array
  | Int32Array;

export class BufferAttribute {
  private _data: TypedArray;
  private _size: number;
  private _dtype: number;
  private _normalize = false;
  private _stride = 0;
  private _offset = 0;

  /**
   * Creates an instance of BufferAttribute.
   * @param {TypedArray} data Typed array data.
   * @param {number} size Size of each element in the buffer.
   * @param {object} options Options for attribute.
   * @memberof BufferAttribute
   */
  constructor(
    data: TypedArray,
    size: number,
    options: {
      dtype?: number;
      normalize?: boolean;
      stride?: number;
      offset?: number;
    } = {}
  ) {
    this._data = data;
    this._size = size;
    this._dtype = options.dtype || WebGLType.FLOAT;
    this._normalize = options.normalize || false;
    this._stride = options.stride || 0;
    this._offset = options.offset || 0;
  }

  // Public get accessor to private properties.
  get data() {
    return this._data;
  }
  get size() {
    return this._size;
  }
  get dtype() {
    return this._dtype;
  }
  get normalize() {
    return this._normalize;
  }
  get stride() {
    return this._stride;
  }
  get offset() {
    return this._offset;
  }
  // Public set accessor to private properties.
  // Should toggle isDirty flag to true.
  set data(data: TypedArray) {
    this._data = data;
  }
  set size(size: number) {
    this._size = size;
  }
  set dtype(dtype: number) {
    this._dtype = dtype;
  }
  set normalize(normalize: boolean) {
    this._normalize = normalize;
  }
  set stride(stride: number) {
    this._stride = stride;
  }
  set offset(offset: number) {
    this._offset = offset;
  }

  /**
   * Jumlah elemen dalam buffer (elemen = data.length / size).
   */
  get count() {
    return this._data.length / this._size;
  }

  /**
   * Panjang dari buffer (data.length = elemen * size).
   */
  get length() {
    return this._data.length;
  }

  set(index: number, data: number[]) {
    this._data.set(data, this.offset + index * (this.stride + this._size));
  }

  get(index: number, size?: number) {
    index *= this._size + this.stride;
    if (!size) size = this._size;
    const data: number[] = [];

    for (let i = 0; i < size; i++) {
      data.push(this._data[this.offset + index + i]);
    }

    return data;
  }
}
