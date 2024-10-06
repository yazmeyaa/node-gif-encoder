import { ColorTable } from "./color_table";
import { BytesEncoder } from "./types";
import { getValueByRange } from "./utils";

export class Color implements BytesEncoder {
    public readonly red: number;
    public readonly green: number;
    public readonly blue: number;

    constructor(red: number, green: number, blue: number) {
        const maxValue = 2 ** 8 - 1; //0-based 8bit value;
        this.red = getValueByRange(red, 0, maxValue);
        this.green = getValueByRange(green, 0, maxValue);
        this.blue = getValueByRange(blue, 0, maxValue);
    }

    public toBuffer(): Buffer {
        const colorsArr = new Uint8Array([this.red, this.green, this.blue]);
        return Buffer.from(colorsArr);
    }

    public toHexString(separator = "."): string {
        const red = this.red.toString(16).padStart(2, "0");
        const green = this.green.toString(16).padStart(2, "0");
        const blue = this.blue.toString(16).padStart(2, "0");

        return [red, green, blue].join(separator);
    }

    static fromString(string: string, separator = "."): Color {
        const parts = string.split(separator);
        if (parts.length !== 3) throw new Error("Malformed color signature.");
        const [red, green, blue] = parts.map((part) =>
            Number.parseInt(part, 16),
        );

        return new Color(
            getValueByRange(red, 0, 255),
            getValueByRange(green, 0, 255),
            getValueByRange(blue, 0, 255),
        );
    }
}

export function getNearColor(color: Color, table: ColorTable): Color {
    let minDistance = Number.POSITIVE_INFINITY;
    let closestColor = table.colors[0];

    const colorDistance = (color1: Color, color2: Color) =>
        Math.abs(color1.red - color2.red) +
        Math.abs(color1.green - color2.green) +
        Math.abs(color1.blue - color2.blue);

    for (const _color of table.colors) {
        const distance = colorDistance(_color, color);
        if (distance < minDistance) {
            minDistance = distance;
            closestColor = _color;
        }

        if (distance === 0) break;
    }

    return closestColor;
}
