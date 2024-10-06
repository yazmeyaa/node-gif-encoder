import { Color } from "./color_table";
import { Image } from "./image";
import { BytesEncoder } from "./types";

export class ImageData {}

export class SubBlock {
  public lzwMinCodeSize: number;
  private pixels: Color[];
  public colors: Map<string, number>;
  public indexes: Uint8Array;

  constructor() {
    this.lzwMinCodeSize = 0;
    this.pixels = [];
    this.colors = new Map();
    this.indexes = new Uint8Array();
  }

  private getLZWMinCodeSize(colorsCount: number): number {
    return Math.ceil(Math.log2(colorsCount));
  }

  private countColor(color: Color): void {
    const key = color.toHexString();
    if (!this.colors.has(key)) {
      this.colors.set(key, 0);
    }
    const value = this.colors.get(key)!;

    this.colors.set(key, value + 1);
  }

  public addPixel(color: Color): void {
    this.pixels.push(color);
    this.lzwMinCodeSize = this.getLZWMinCodeSize(this.pixels.length);
    this.countColor(color);
  }
}

export class ImageDataTable implements BytesEncoder {
  private image: Image;
  private subBlocks: SubBlock[] = [];

  constructor(image: Image) {
    this.image = image;
    this.subBlocks = [];
  }
  public toBuffer(): Buffer {
    return Buffer.from("");
  }
}
