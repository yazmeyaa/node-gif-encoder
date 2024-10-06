import { ColorTable } from "./color_table";
import { ImageDataTable } from "./image_data_table";
import {
    ImageDescriptor,
    ImageDescriptorConstructor,
} from "./image_descriptor";
import { BytesEncoder } from "./types";

export class Image implements BytesEncoder {
    public readonly imageDescriptor: ImageDescriptor;
    public localColorTable: ColorTable | null = null;
    public readonly imageDataTable: ImageDataTable;

    constructor(descriptor: ImageDescriptorConstructor) {
        this.imageDescriptor = new ImageDescriptor(descriptor);
        this.imageDataTable = new ImageDataTable(this);
    }

    public toBuffer(): Buffer {
        const parts: Buffer[] = [this.imageDescriptor.toBuffer()];

        if (this.localColorTable) {
            parts.push(this.localColorTable.toBuffer());
        }

        return Buffer.concat(parts);
    }
}
