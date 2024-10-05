import assert from "assert";
import test from "node:test";
import { GifHeader, GifHeaderTypes } from "../src/header";

test("Header buffering", (t) => {
    const header = new GifHeader(GifHeaderTypes.GIF89A);
    const buffer = header.toBuffer();
    const expected = Buffer.from('GIF89a', 'ascii');
    assert.strictEqual(expected.equals(buffer), true, "Buffers are not equals.");
})