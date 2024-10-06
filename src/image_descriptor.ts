import { BytesEncoder } from "./types";

export type ImageDescriptorConstructor = {
    imageSeparator?: string;
    imageLeftPosition?: number;
    imageTopPosition?: number;
    imageWidth: number;
    imageHeigt: number;
    localColorTableFlag?: boolean;
    interlanceFlag?: boolean;
    sortFlag?: boolean;
    sizeOfLocalColorTable?: number;
};

export type ImageDescriptorConstructorDefaultValues = Required<
    Pick<
        ImageDescriptorConstructor,
        | "imageSeparator"
        | "imageLeftPosition"
        | "imageTopPosition"
        | "interlanceFlag"
        | "sortFlag"
        | "localColorTableFlag"
        | "sizeOfLocalColorTable"
    >
>;

export const IMAGE_DESCRIPTOR_DEFAULT_VALUES: ImageDescriptorConstructorDefaultValues =
    {
        imageTopPosition: 0,
        imageLeftPosition: 0,
        imageSeparator: ",",
        interlanceFlag: false,
        localColorTableFlag: false,
        sortFlag: false,
        sizeOfLocalColorTable: 7,
    };

/**
 * Each image in the Data Stream is composed of an Image
 * Descriptor, an optional Local Color Table, and the image data.  Each
 * image must fit within the boundaries of the Logical Screen, as defined
 * in the Logical Screen Descriptor.
 *
 * The Image Descriptor contains the parameters necessary to process a table
 * based image. The coordinates given in this block refer to coordinates
 * within the Logical Screen, and are given in pixels. This block is a
 * Graphic-Rendering Block, optionally preceded by one or more Control
 * blocks such as the Graphic Control Extension, and may be optionally
 * followed by a Local Color Table; the Image Descriptor is always followed
 * by the image data.
 *
 * This block is REQUIRED for an image.  Exactly one Image Descriptor must
 * be present per image in the Data Stream.  An unlimited number of images
 * may be present per Data Stream.
 */
export class ImageDescriptor implements BytesEncoder {
    public imageSeparator: string;
    public imageLeftPosition: number;
    public imageTopPosition: number;
    public imageWidth: number;
    public imageHeight: number;

    public localColorTableFlag: boolean;
    public interlanceFlag: boolean;
    public sortFlag: boolean;
    public sizeOfLocalColorTable: number;

    constructor(props: ImageDescriptorConstructor) {
        this.imageWidth = props.imageWidth;
        this.imageHeight = props.imageHeigt;
        this.imageSeparator =
            props.imageSeparator ??
            IMAGE_DESCRIPTOR_DEFAULT_VALUES.imageSeparator;
        this.imageLeftPosition =
            props.imageLeftPosition ??
            IMAGE_DESCRIPTOR_DEFAULT_VALUES.imageLeftPosition;
        this.imageTopPosition =
            props.imageTopPosition ??
            IMAGE_DESCRIPTOR_DEFAULT_VALUES.imageTopPosition;
        this.localColorTableFlag =
            props.localColorTableFlag ??
            IMAGE_DESCRIPTOR_DEFAULT_VALUES.localColorTableFlag;
        this.interlanceFlag =
            props.interlanceFlag ??
            IMAGE_DESCRIPTOR_DEFAULT_VALUES.interlanceFlag;
        this.sortFlag =
            props.sortFlag ?? IMAGE_DESCRIPTOR_DEFAULT_VALUES.sortFlag;
        this.sizeOfLocalColorTable =
            props.sizeOfLocalColorTable ??
            IMAGE_DESCRIPTOR_DEFAULT_VALUES.sizeOfLocalColorTable;
    }

    private packageFields(): Buffer {
        const lctfOffset = 7; // 0000000X
        const ifOffset = 6; // 000000X0
        const sortOffset = 5; // 00000X00
        const reservOffset = 3; // 000XX000
        const slctOffset = 0; // XXX00000

        const lctf = (this.localColorTableFlag ? 1 : 0) << lctfOffset;
        const iflag = (this.interlanceFlag ? 1 : 0) << ifOffset;
        const sort = (this.sortFlag ? 1 : 0) << sortOffset;
        const reserved = 0x00 << reservOffset;
        const slct = (0b00000111 & this.sizeOfLocalColorTable) << slctOffset;

        const result = lctf | iflag | sort | reserved | slct;

        return Buffer.from(new Uint8Array([result]).buffer);
    }

    public toBuffer(): Buffer {
        const parts: Buffer[] = [
            Buffer.from(this.imageSeparator),
            Buffer.from(
                new Uint16Array([
                    this.imageLeftPosition,
                    this.imageTopPosition,
                    this.imageWidth,
                    this.imageHeight,
                ]).buffer,
            ),
            this.packageFields(),
        ];

        return Buffer.concat(parts);
    }
}
