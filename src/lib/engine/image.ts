export class GLImage {
  public image: HTMLImageElement;
  public isLoaded = false;
  public onload: () => void = () => {};
  constructor(public src: string) {
    const image = new Image();
    this.image = image;
    image.src = src;
    image.onload = () => {
      this.isLoaded = true;
      this.onload();
    };
  }

  get width() {
    return this.image.width;
  }

  get height() {
    return this.image.height;
  }
}
