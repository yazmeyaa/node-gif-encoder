import test from "node:test";
import { ImageDescriptor } from "../src/image_descriptor";
import assert from "assert";

test("Image Descriptor", async (t) => {
    const descriptor = new ImageDescriptor({
        imageHeigt: 100,
        imageWidth: 50,
        imageLeftPosition: 10,
        imageTopPosition: 20
    });
    const buffer = descriptor.toBuffer();

    await t.test("Image separator", () => {
        const separator = buffer.subarray(0x0, 0x1);
        const expectedValues = Buffer.from(',', 'ascii');
        assert(expectedValues.equals(separator));
    })

    await t.test("Image Positions", () => {
        const values = buffer.subarray(0x1, 0x5);
        const expectedValues = Buffer.from(new Uint16Array([10, 20]).buffer)
        assert(expectedValues.equals(values));
    })

    await t.test("Image sizes", () => {
        const values = buffer.subarray(0x5, 0x9);
        const expectedValues = Buffer.from(new Uint16Array([50, 100]).buffer)
        assert(expectedValues.equals(values));
    })

    await t.test("Packed fields", () => {
        const expectedValue = Buffer.from(new Uint8Array([0b00000111]).buffer);
        const value = buffer.subarray(0x9, 10)
        
        assert(expectedValue.equals(value));
    })
})