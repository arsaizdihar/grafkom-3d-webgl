export type MaterialOptions = {
  emmisiveFactor?: number[];
  alphaMode?: string;
  alphaCutoff?: number;
  doubleSided?: boolean;
  name?: string;
  color?: number;
};

export class ShaderMaterial {
  public emmisiveFactor: number[] = [0, 0, 0];
  public alphaMode: string = "OPAQUE";
  public alphaCutoff: number = 0.5;
  public doubleSided: boolean = false;
  public name: string = "";

  constructor(options: MaterialOptions = {}) {
    if (options.emmisiveFactor !== undefined)
      this.emmisiveFactor = options.emmisiveFactor;
    if (options.alphaMode !== undefined) this.alphaMode = options.alphaMode;
    if (options.alphaCutoff !== undefined)
      this.alphaCutoff = options.alphaCutoff;
    if (options.doubleSided !== undefined)
      this.doubleSided = options.doubleSided;
    if (options.name !== undefined) this.name = options.name;
  }
}
