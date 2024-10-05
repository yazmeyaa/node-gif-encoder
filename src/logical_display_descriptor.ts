import { BytesEncoder } from "./types";
import { Buffer } from 'buffer'


export type LogicalDisplayDescriptorConstructor = {
    width: number;
    height: number;
    backgroundColorIndex?: number;
    pixelAspectRatio?: number;
    colorResolution?: number;
    sizeOfGlobalColorTable?: number;
    sortFlag?: boolean;
    globalColorTableFlag?: boolean;
}

type DefaultLDDValues = Required<Pick<LogicalDisplayDescriptorConstructor,
    'backgroundColorIndex' |
    'colorResolution' |
    'globalColorTableFlag' |
    'pixelAspectRatio' |
    'sizeOfGlobalColorTable' |
    'sortFlag'
>>

export const DEFAULT_LOGICAL_DESCRIPTOR_VALUES: DefaultLDDValues = {
    pixelAspectRatio: 0,
    backgroundColorIndex: 0,
    globalColorTableFlag: true,
    colorResolution: 7,
    sortFlag: false,
    sizeOfGlobalColorTable: 7,
}

/**
 *  The Logical Screen Descriptor contains the parameters
 * necessary to define the area of the display device within which the
 * images will be rendered.  The coordinates in this block are given with
 * respect to the top-left corner of the virtual screen; they do not
 * necessarily refer to absolute coordinates on the display device.  This
 * implies that they could refer to window coordinates in a window-based
 * environment or printer coordinates when a printer is used.
 * 
 * @see https://www.martinreddy.net/gfx/2d/GIF89a.txt
 */

export class LogicalDisplayDescriptor implements BytesEncoder {
    /**
     * Width, in pixels, of the Logical Screen
     * where the images will be rendered in the displaying device.
    */
    public width: number;
    /**
     * Height, in pixels, of the Logical
     * Screen where the images will be rendered in the displaying device.
     */
    public height: number;

    /**
     * Flag indicating the presence of a
     * Global Color Table; if the flag is set, the Global Color Table will
     * immediately follow the Logical Screen Descriptor. This flag also
     * selects the interpretation of the Background Color Index; if the
     * flag is set, the value of the Background Color Index field should
     * be used as the table index of the background color. (This field is
     * the most significant bit of the byte.)
     * 
     * Values:
     * 0 (false) - No Global Color Table follows, the Background
     * Color Index field is meaningless.
     * 1 (true) - A Global Color Table will immediately follow, the
     * Background Color Index field is meaningful.
     */
    public globalColorTableFlag: boolean;
    /**
     * Sort Flag - Indicates whether the Global Color Table is sorted.
     * If the flag is set, the Global Color Table is sorted, in order of
     * decreasing importance. Typically, the order would be decreasing
     * frequency, with most frequent color first. This assists a decoder,
     * with fewer available colors, in choosing the best subset of colors;
     * the decoder may use an initial segment of the table to render the
     * graphic.
     */
    public sortFlag: boolean;
    /**
     * Index into the Global Color Table for
     * the Background Color. The Background Color is the color used for
     * those pixels on the screen that are not covered by an image. If the
     * Global Color Table Flag is set to (zero), this field should be zero
     * and should be ignored.
     */
    public backgroundColorIndex: number;
    /**
     * Factor used to compute an approximation
     * of the aspect ratio of the pixel in the original image.  If the
     * value of the field is not 0, this approximation of the aspect ratio
     * is computed based on the formula:
     * Aspect Ratio = (Pixel Aspect Ratio + 15) / 64
     * 
     * The Pixel Aspect Ratio is defined to be the quotient of the pixel's
     * width over its height.  The value range in this field allows
     * specification of the widest pixel of 4:1 to the tallest pixel of
     * 1:4 in increments of 1/64th.
     * 
     * Values :        0 -   No aspect ratio information is given.
     *                 1..255 -   Value used in the computation.

     */
    public pixelAspectRatio: number;
    /**
     * Number of bits per primary color available
     * to the original image, minus 1. This value represents the size of
     * the entire palette from which the colors in the graphic were
     * selected, not the number of colors actually used in the graphic.
     * For example, if the value in this field is 3, then the palette of
     * the original image had 4 bits per primary color available to create
     * the image.  This value should be set to indicate the richness of
     * the original palette, even if not every color from the whole
     * palette is available on the source machine.
     */
    public colorResolution: number;
    /**
     * If the Global Color Table Flag is
     * set to 1, the value in this field is used to calculate the number
     * of bytes contained in the Global Color Table. To determine that
     * actual size of the color table, raise 2 to [the value of the field +
     * 1].
     * Even if there is no Global Color Table specified, set this
     * field according to the above formula so that decoders can choose
     * the best graphics mode to display the stream in.  (This field is
     * made up of the 3 least significant bits of the byte.)
     */
    public sizeOfGlobalColorTable: number


    constructor(data: LogicalDisplayDescriptorConstructor) {
        const maxSizeValue = 2 ** 16; // 16 bytes uint
        if (data.width > maxSizeValue || data.height > maxSizeValue) throw new Error(`Unsupported virtual display resolition. Expected values in range (0..${maxSizeValue})`);
        this.width = data.width;
        this.height = data.height;
        this.globalColorTableFlag = data.globalColorTableFlag ?? DEFAULT_LOGICAL_DESCRIPTOR_VALUES.globalColorTableFlag;
        this.backgroundColorIndex = data.backgroundColorIndex ?? DEFAULT_LOGICAL_DESCRIPTOR_VALUES.backgroundColorIndex;
        this.pixelAspectRatio = data.pixelAspectRatio ?? DEFAULT_LOGICAL_DESCRIPTOR_VALUES.pixelAspectRatio;
        this.sortFlag = data.sortFlag ?? DEFAULT_LOGICAL_DESCRIPTOR_VALUES.sortFlag;
        this.colorResolution = data.colorResolution ?? DEFAULT_LOGICAL_DESCRIPTOR_VALUES.colorResolution;
        this.sizeOfGlobalColorTable = data.sizeOfGlobalColorTable ?? DEFAULT_LOGICAL_DESCRIPTOR_VALUES.sizeOfGlobalColorTable;
    }

    /**
     *  *Packed Fields*
     *  - Global Color Table Flag       1 Bit
     *  - Color Resolution              3 Bits
     *  - Sort Flag                     1 Bit
     *  - Size of Global Color Table    3 Bits
     * @returns {Buffer} Packet fields in 8-bit value
     * 
     */
    private packageFields(): Buffer {
        const gctOffset = 7;  // 0000000x
        const crOffset = 4;   // 0000xxx0
        const sortOffset = 3; // 0XXX0000
        const gctfOffset = 0; // X0000000

        const gcts = (this.globalColorTableFlag ? 1 : 0) << gctOffset;
        const cr = (0b00000111 & this.colorResolution) << crOffset;
        const sort = (this.sortFlag ? 1 : 0) << sortOffset;
        const gctf = (0b00000111 & this.sizeOfGlobalColorTable) << gctfOffset;

        const result = gcts | cr | sort | gctf;

        return Buffer.from([result]);
    }



    public toBuffer(): Buffer {
        const screenSize = Buffer.from(new Uint16Array([this.width, this.height]).buffer);
        const packedFields = this.packageFields();
        const bg = Buffer.from(new Int8Array([this.backgroundColorIndex]).buffer)
        const pixelAspectRatio = Buffer.from(new Int8Array([this.pixelAspectRatio]).buffer)

        return Buffer.concat([screenSize, packedFields, bg, pixelAspectRatio])
    }
}