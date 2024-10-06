import test from "node:test";
import { ColorTable } from "../src/color_table";
import { Color, getNearColor } from "../src/colors";
import assert from "assert";

test("Color", async (t) => {
    const table = new ColorTable();
    const colors = [
        new Color(0, 0, 0),
        new Color(255, 255, 255),
        new Color(10, 20, 30),
    ];
    colors.forEach((c) => table.addColor(c));

    await t.test("Find closest color from table", () => {
        const color = new Color(50, 50, 50);
        const expectedColor = table.colors[2]; // rgb(10, 20, 30) is closest color;

        const nearColor = getNearColor(color, table);
        assert(nearColor.toBuffer().equals(expectedColor.toBuffer()));
    });
    await t.test("Find closest color from table (2)", () => {
        const color = new Color(1, 1, 1);
        const expectedColor = table.colors[0]; // rgb(10, 20, 30) is closest color;

        const nearColor = getNearColor(color, table);
        assert(nearColor.toBuffer().equals(expectedColor.toBuffer()), "Got unexpected color. It was not closest color.");
    });
});
