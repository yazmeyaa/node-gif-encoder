import { Color, getNearColor } from "./colors";
import { BytesEncoder } from "./types";

/**
 * This block contains a color table, which is a sequence of
 * bytes representing red-green-blue color triplets. The Global Color Table
 * is used by images without a Local Color Table and by Plain Text
 * Extensions. Its presence is marked by the Global Color Table Flag being
 * set to 1 in the Logical Screen Descriptor; if present, it immediately
 * follows the Logical Screen Descriptor and contains a number of bytes
 * equal to
 * 3 x 2^(Size of Global Color Table+1).
 *
 * This block is OPTIONAL; at most one Global Color Table may be present
 * per Data Stream.
 */
export class ColorTable implements BytesEncoder {
    public colors: Color[] = [];

    public addColor(color: Color): void {
        if (this.colors.length >= 256) {
            console.warn(
                "Global Colors Table is overflowed. Color was not added.",
            );
            return;
        }
        this.colors.push(color);
    }

    public getNearColor(color: Color): Color {
        return getNearColor(color, this);
    }

    public toBuffer(): Buffer {
        const buffer = Buffer.alloc(this.colors.length * 3);

        for (let i = 0; i < this.colors.length; i++) {
            const color = this.colors[i];
            const cbuff = color.toBuffer();
            const idx = i * 3;

            buffer[idx] = cbuff[0];
            buffer[idx + 1] = cbuff[1];
            buffer[idx + 2] = cbuff[2];
        }

        return buffer;
    }
}
