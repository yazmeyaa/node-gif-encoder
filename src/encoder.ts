/**
 * @license
 * Copyright (C) 2024 yazmeyaa
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import { Buffer } from "buffer";
import { GifHeader, GifHeaderTypes } from "./header";
import { LogicalDisplayDescriptor } from "./logical_display_descriptor";
import { Color, ColorTable } from "./color_table";
import { Image } from "./image";
import { ImageType } from "./image_decoder";

export class GifBuilder {
  public readonly header: GifHeader = new GifHeader(GifHeaderTypes.GIF89A);
  public readonly displayDescriptor: LogicalDisplayDescriptor;
  public readonly globalColorTable = new ColorTable();
  public readonly images: Image[] = [];

  constructor(width: number, height: number) {
    this.displayDescriptor = new LogicalDisplayDescriptor({ width, height });
  }

  public create(): Buffer {
    return this.makeGif89a();
  }

  private makeGif89a(): Buffer {
    const parts: Buffer[] = [
      this.header.toBuffer(),
      this.displayDescriptor.toBuffer(),
    ];

    if (this.displayDescriptor.globalColorTableFlag) {
      parts.push(this.globalColorTable.toBuffer());
    }

    parts.push(Buffer.from(";")); // Add GIF-terminator at the end of file.
    return Buffer.concat(parts);
  }

  public addFrame(image: Buffer, type: ImageType): void {}

  /**
   * Add color to Global Color Table.
   */
  public addColor(color: Color): void {
    if (!this.displayDescriptor.globalColorTableFlag) {
      console.warn(
        "GLOBAL_COLOR_TABLE_FLAG has disabled state. Can't add color.",
      );
      return;
    }
    this.globalColorTable.addColor(color);
  }
}

const gifBuilder = new GifBuilder(100, 100);

const gif = gifBuilder.create();
console.log(gif);
console.log(gif.toString());
