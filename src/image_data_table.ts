import { Color } from "./colors";
import { Image } from "./image";
import { BytesEncoder } from "./types";

export class SubBlock implements BytesEncoder {
    public lzwMinCodeSize: number;
    private pixels: Color[];
    public colors: Map<string, number>;
    private indexes: number[];

    constructor() {
        this.lzwMinCodeSize = 0;
        this.pixels = [];
        this.colors = new Map();
        this.indexes = [];
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

    public addIndex(idx: number): void {
        if (idx > 2 ** 8)
            throw new Error(
                `Unexpected color index value. Expected value from 0 to 255. Got: ${idx}`,
            );

        if (this.indexes.length > 2 ** 8 - 1)
            throw new Error("Cannot add index: sub-block overflowed.");

        this.indexes.push(idx);
    }

    public toBuffer(): Buffer {
        const parts = [
            Buffer.from(new Uint8Array(this.lzwMinCodeSize).buffer),
            Buffer.from(new Uint8Array(this.indexes).buffer),
        ];

        return Buffer.concat(parts);
    }
}

export class ImageDataTable implements BytesEncoder {
    private image: Image;
    private subBlocks: SubBlock[] = [];
    public get colors(): Map<string, number> {
        const map = new Map<string, number>();

        for (const subBlock of this.subBlocks) {
            for (const [key, value] of subBlock.colors.entries()) {
                if (!map.has(key)) map.set(key, 0);
                const val = map.get(key)!;
                map.set(key, val + value);
            }
        }

        return map;
    }

    constructor(image: Image) {
        this.image = image;
        this.subBlocks = [];
    }
    public toBuffer(): Buffer {
        return Buffer.from("");
    }
}
