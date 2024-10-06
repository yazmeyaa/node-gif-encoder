import { Buffer } from "buffer";
import { BytesEncoder } from "./types";

export enum GifHeaderTypes {
  GIF87A = "GIF87a",
  GIF89A = "GIF89a",
}

export class GifHeader implements BytesEncoder {
  public value: GifHeaderTypes;

  constructor(value: GifHeaderTypes) {
    this.value = value;
  }

  public toBuffer(): Buffer {
    return Buffer.from(this.value, "ascii");
  }
}
