import { Color } from "./colors";

export enum ImageType {
    WEBP = "webp",
}

export class DecodedImage {
    public width: number;
    public height: number;
    public colors: Color[];

    constructor(width: number, height: number, colors: Color[]) {
        this.width = width;
        this.height = height;
        this.colors = colors;
    }
}

export class ImageDecoder {
    public static decode(type: ImageType, data: Buffer): DecodedImage {
        switch (type) {
            case ImageType.WEBP:
                return ImageDecoder.decodeWebp(data);
            default:
                throw new Error("Unexpected type of image.");
        }
    }

    private static decodeWebp(data: Buffer): DecodedImage {
        return new WebpDecoder(data).decode();
    }
}

class WebpDecoder {
    private data: Buffer;
    constructor(data: Buffer) {
        this.data = data;
    }

    public decode(): DecodedImage {
        throw new Error("not implemented");
    }
}
