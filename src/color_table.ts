import { BytesEncoder } from "./types";
import { getValueByRange } from "./utils";


export class Color implements BytesEncoder {
    public readonly red: number;
    public readonly green: number;
    public readonly blue: number;

    constructor(red: number, green: number, blue: number) {
        const maxValue = (2 ** 8) - 1; //0-based 8bit value;
        this.red = getValueByRange(red, 0, maxValue);
        this.green = getValueByRange(green, 0, maxValue);
        this.blue = getValueByRange(blue, 0, maxValue);
    }

    public toBuffer(): Buffer {
        const colorsArr = new Uint8Array([this.red, this.green, this.blue]);
        return Buffer.from(colorsArr);
    };


    public toHexString(separator = '.'): string {
        const red = this.red.toString(16);
        const green = this.green.toString(16);
        const blue = this.blue.toString(16);

        return [red, green, blue].join(separator);
    }

    static fromString(string: string, separator = '.'): Color {
        const parts = string.split(separator);
        if (parts.length !== 3) throw new Error('Malformed color signature.');
        const [red, green, blue] = parts.map(Number.parseInt);

        return new Color(
            getValueByRange(red, 0, 255),
            getValueByRange(green, 0, 255),
            getValueByRange(blue, 0, 255),
        );
    }
}

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
            console.warn('Global Colors Table is overflowed. Color was not added.');
            return;
        }
        this.colors.push(color);
    }

    public toBuffer(): Buffer {
        const buffer = Buffer.alloc(this.colors.length * 3);

        for (let i = 0; i < this.colors.length; i++) {
            const color = this.colors[i];
            const cbuff = color.toBuffer()
            const idx = i * 3;

            buffer[idx] = cbuff[0];
            buffer[idx + 1] = cbuff[1];
            buffer[idx + 2] = cbuff[2];
        }

        return buffer;
    };
}