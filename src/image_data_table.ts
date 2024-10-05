import { Color } from "./color_table";
import { Image } from "./image";

export class ImageData {

}

export class SubBlock {
    public lzwMinCodeSize: number;
    private pixels: Color[];
    public colorsCountMap: Map<string, number>;
    public indexes: Uint8Array;

    constructor() {
        this.lzwMinCodeSize = 0;
        this.pixels = [];
        this.colorsCountMap = new Map();
        this.indexes = new Uint8Array();
    }

    private getLZWMinCodeSize(colorsCount: number): number {
        return Math.ceil(Math.log2(colorsCount));
    }

    private countColor(color: Color): void {
        const key = color.toHexString();
        if (!this.colorsCountMap.has(key)) {
            this.colorsCountMap.set(key, 0);
        }
        const value = this.colorsCountMap.get(key)!;

        this.colorsCountMap.set(key, value + 1)
    }

    public addPixel(color: Color): void {
        this.pixels.push(color);
        this.lzwMinCodeSize = this.getLZWMinCodeSize(this.pixels.length);
        this.countColor(color);
    }
}

export class ImageDataTable  {
    private image: Image;
    private subBlocks: SubBlock[];

    constructor(image: Image) {
        this.image = image;
        this.subBlocks = [];
    }
}