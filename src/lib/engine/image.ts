export class GLImage {
  public image: HTMLImageElement;
  private promise: Promise<HTMLImageElement> | null;
  constructor(public src: string) {
    const image = new Image();
    this.image = image;
    image.src = src;
    this.promise = new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(image);
      };
      image.onerror = () => {
        reject(new Error(`Failed to load image: ${src}`));
      };
    });
  }

  async load() {
    if (this.promise) {
      this.image = await this.promise;
      this.promise = null;
    }
    return this;
  }

  get width() {
    return this.image.width;
  }

  get height() {
    return this.image.height;
  }
}
