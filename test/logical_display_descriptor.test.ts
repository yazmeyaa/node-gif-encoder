import test from "node:test";
import assert from "node:assert";
import { LogicalDisplayDescriptor } from "../src/logical_display_descriptor";

test("Buffering Logical Display Descriptor (LDD)", async (t) => {
    const ldd = new LogicalDisplayDescriptor({ height: 50, width: 100 });
    const buffer = ldd.toBuffer();

    await t.test("Testing LDD sizes", () => {
        const width = buffer.subarray(0x0, 0x2);
        const height = buffer.subarray(0x2, 0x4);

        const expectWidth = Buffer.from(new Uint16Array([100]).buffer);
        const expectHeight = Buffer.from(new Uint16Array([50]).buffer);

        assert.strictEqual(
            width.equals(expectWidth),
            true,
            "After buffering LDD width is not equals expected values",
        );
        assert.strictEqual(
            height.equals(expectHeight),
            true,
            "After buffering LDD width is not equals expected values",
        );
    });

    await t.test("Check packed fields", () => {
        const expectedValue = Buffer.from(new Uint8Array([0b11110111]).buffer);
        const value = buffer.subarray(0x4, 0x5);

        assert.strictEqual(
            expectedValue.equals(value),
            true,
            "Packed fields are not equal expected value",
        );
    });

    await t.test("Background color index", () => {
        const expectedValue = Buffer.from(new Uint8Array([0]).buffer);
        assert.strictEqual(
            buffer.subarray(0x5, 0x6).equals(expectedValue),
            true,
            "Background color index is not equals to expected values",
        );
    });

    await t.test("Pixel Aspect Ratio", () => {
        const expectedValue = Buffer.from(new Uint8Array([0]));
        const value = buffer.subarray(0x6, 0x7);

        assert.strictEqual(
            expectedValue.equals(value),
            true,
            "Pixel Aspect Ration not equals expected value",
        );
    });
});
