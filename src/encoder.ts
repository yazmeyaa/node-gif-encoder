import { Buffer } from "buffer";
import { GifHeader, GifHeaderTypes } from "./header";
import { LogicalDisplayDescriptor } from "./logical_display_descriptor";
import { ColorTable } from "./color_table";
import { Image } from "./image";
import { ImageType } from "./image_decoder";

export class GifBuilder {
    public readonly header: GifHeader = new GifHeader(GifHeaderTypes.GIF89A);
    public readonly displayDescriptor: LogicalDisplayDescriptor;
    public readonly globalColorTable = new ColorTable();
    public readonly images: Image[] = [];

    constructor(width: number, height: number) {
        this.displayDescriptor = new LogicalDisplayDescriptor({
            width,
            height,
        });
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

    public addFrame(image: Buffer, type: ImageType): void {
        console.log(image, type);
    }
}

const gifBuilder = new GifBuilder(100, 100);

const gif = gifBuilder.create();
console.log(gif);
console.log(gif.toString());
