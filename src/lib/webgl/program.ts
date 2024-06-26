import { BufferAttribute } from "../engine/buffer-attribute";

type UniformTypes =
  | `uniform${1 | 2 | 3 | 4}${"i" | "f"}${"v" | ""}`
  | `uniformMatrix${2 | 3 | 4}fv`
  | "texture";

type AttributeSingleDataType = BufferAttribute | Float32Array | number[];
type AttributeDataType = [AttributeSingleDataType] | number[];
export type AttributeSetters = (...v: AttributeDataType) => void;

export class Program<
  TAttribs extends string,
  TUniforms extends Record<
    string,
    {
      type: UniformTypes;
    }
  >,
> {
  public gl: WebGLRenderingContext;
  public indexBuffer: WebGLBuffer | null;
  private attributeSetters: Record<TAttribs, AttributeSetters>;

  public get a() {
    return this.attributeSetters;
  }

  private uniforms: {
    [K in keyof TUniforms]: {
      type: TUniforms[K]["type"];
      location: WebGLUniformLocation | null;
      unit?: number;
    };
  };

  public get u() {
    return this.uniforms;
  }

  public program: WebGLProgram;

  constructor({
    gl,
    fragmentShaderSource,
    vertexShaderSource,
    attributes,
    uniforms,
  }: {
    gl: WebGLRenderingContext;
    vertexShaderSource: string;
    fragmentShaderSource: string;
    attributes: TAttribs[];
    uniforms: TUniforms;
  }) {
    this.gl = gl;
    this.program = this.createProgram(vertexShaderSource, fragmentShaderSource);
    this.gl.useProgram(this.program);
    this.attributeSetters = {} as typeof this.attributeSetters;
    attributes.forEach((attribName) => {
      this.attributeSetters[attribName] = this.createAttributeSetter(
        "a_" + attribName
      );
    });

    this.uniforms = {} as typeof this.uniforms;
    let textureUnit = 0;

    Object.entries(uniforms).forEach(([uniformName, obj]) => {
      const location = this.gl.getUniformLocation(
        this.program,
        "u_" + uniformName
      );
      if (obj.type === "texture") {
        this.uniforms[uniformName as keyof TUniforms] = {
          type: obj.type,
          location,
          unit: textureUnit++,
        };
      } else {
        this.uniforms[uniformName as keyof TUniforms] = {
          type: obj.type,
          location,
        };
      }
    });

    this.indexBuffer = this.gl.createBuffer();
  }

  private createProgram(
    vertexShaderSource: string,
    fragmentShaderSource: string
  ) {
    const program = this.gl.createProgram()!;
    const vertexShader = this.createShader(
      this.gl.VERTEX_SHADER,
      vertexShaderSource
    );
    const fragmentShader = this.createShader(
      this.gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    const success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
    if (success) {
      return program;
    }

    this.gl.deleteProgram(program);
    throw new Error("Invalid to share program");
  }

  private createShader(type: number, source: string) {
    const shader = this.gl.createShader(type)!;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    console.log(this.gl.getShaderInfoLog(shader));

    this.gl.deleteShader(shader);
    throw new Error("Failed to create shader");
  }

  private createAttributeSetter(name: string): AttributeSetters {
    // Initialization Time
    const loc = this.gl.getAttribLocation(this.program, name);
    return (...values) => {
      // Render Time (saat memanggil setAttributes() pada render loop)
      const v = values[0];
      if (v instanceof BufferAttribute) {
        v._buffer = v._buffer || this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, v._buffer);
        if (v.isDirty) {
          // Data Changed Time (note that buffer is already binded)
          this.gl.bufferData(this.gl.ARRAY_BUFFER, v.data, this.gl.STATIC_DRAW);
          v.consume();
        }
        this.gl.enableVertexAttribArray(loc);
        this.gl.vertexAttribPointer(
          loc,
          v.size,
          v.dtype,
          v.normalize,
          v.stride,
          v.offset
        );
      } else {
        this.gl.disableVertexAttribArray(loc);
        if (v instanceof Float32Array)
          this.gl[`vertexAttrib${v.length}fv` as "vertexAttrib4fv"](loc, v);
        else
          this.gl[`vertexAttrib${values.length}f` as "vertexAttrib4f"](
            loc,
            ...(values as [number, number, number, number])
          );
      }
    };
  }

  /**
   * Set the uniforms in the shader
   * @param uniforms uniforms to set and the args to pass to the uniform
   *
   * @example
   * ```ts
   * program.setUniforms({
   *  color: [1, 0, 0, 1]
   * })
   * ```
   */
  public setUniforms(uniforms: {
    [K in keyof TUniforms]?: any[];
  }) {
    Object.entries(uniforms).forEach(([item, args]) => {
      if (!args) {
        return;
      }
      const uniform = this.uniforms[item];
      if (!uniform || !uniform.location) {
        return;
      }
      const type = uniform.type;
      if (type === "texture") {
        const texture = args[0] as WebGLTexture;
        if (!texture) {
          return;
        }
        this.gl.uniform1i(uniform.location, uniform.unit!);
        this.gl.activeTexture(this.gl.TEXTURE0 + uniform.unit!);
        this.gl.bindTexture(this.gl.TEXTURE_2D, args[0] as WebGLTexture);
      } else {
        (this.gl[type as keyof typeof this.gl] as any)(
          uniform.location,
          ...args
        );
      }
    });
  }

  bindIndexBuffer(bufferData: BufferAttribute) {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      bufferData.data,
      this.gl.STATIC_DRAW
    );
  }

  setAttributes(attributes: {
    [K in TAttribs]?: AttributeSingleDataType;
  }) {
    Object.entries<AttributeSingleDataType | undefined>(attributes).forEach(
      ([name, args]) => {
        if (!args) {
          return;
        }
        this.attributeSetters[name as TAttribs](args);
      }
    );
  }
}
