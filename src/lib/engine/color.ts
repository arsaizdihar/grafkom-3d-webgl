export class Color {
  public value: number[] = [1, 1, 1, 1];

  get hex() {
    return (
      ((this.value[0] * 255) << 16) +
      ((this.value[1] * 255) << 8) +
      this.value[2] * 255
    );
  }

  get hexString() {
    return "#" + this.hex.toString(16).padStart(6, "0");
  }

  private constructor(value: number[] = [1, 1, 1, 1]) {
    this.value = value;
  }

  public static rgb(r: number, g: number, b: number) {
    return new Color([r / 255, g / 255, b / 255, 1]);
  }

  public static rgba(r: number, g: number, b: number, a: number) {
    return new Color([r / 255, g / 255, b / 255, a]);
  }

  public static hex(hex: number) {
    const r = (hex >> 16) & 255;
    const g = (hex >> 8) & 255;
    const b = hex & 255;
    return new Color([r / 255, g / 255, b / 255, 1]);
  }

  public static hexString(hex: string) {
    return Color.hex(parseInt(hex.slice(1), 16));
  }

  public static fromArray(arr: number[]) {
    return new Color(arr);
  }

  static WHITE = Color.hex(0xffffff);
}
