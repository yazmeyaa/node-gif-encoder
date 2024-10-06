import test from "node:test";
import { ColorTable } from "../src/color_table";
import assert from "assert";
import { Color } from "../src/colors";

test("Color Table", async (t) => {
    const gct = new ColorTable();
    const colorsCount = 3;

    for (let i = 0; i < colorsCount; i++) {
        const color = new Color(i, i, i);
        gct.addColor(color);
    }

    const buffer = gct.toBuffer();

    await t.test("Buffering", () => {
        const expectedBuffer = Buffer.from(
            new Uint8Array([0, 0, 0, 1, 1, 1, 2, 2, 2]).buffer,
        );
        assert.strictEqual(buffer.length, colorsCount * 3);
        assert(expectedBuffer.equals(buffer));
    });

    await t.test("Find near color", () => {
        const color = new Color(5, 5, 5);
        const expectedColor = gct.colors[2];

        assert.strictEqual(gct.getNearColor(color), expectedColor);
    });
});
