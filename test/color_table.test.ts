import test from "node:test";
import { Color, ColorTable } from "../src/color_table";
import assert from "assert";

test('Buffering Global Color Table', () => {
    const gct = new ColorTable();
    const colorsCount = 3;

    for (let i = 0; i < colorsCount; i++) {
        const color = new Color(i, i, i)
        gct.addColor(color);
    }

    const buffer = gct.toBuffer();
    const expectedBuffer = Buffer.from(new Uint8Array([
        0, 0, 0,
        1, 1, 1,
        2, 2, 2,
    ]).buffer);
    assert.strictEqual(buffer.length, colorsCount * 3);
    assert.strictEqual(expectedBuffer.equals(buffer), true);
})