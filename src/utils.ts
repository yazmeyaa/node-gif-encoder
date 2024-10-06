import { Buffer } from "buffer";

export const boolToBuf = (v: boolean): Buffer => Buffer.from([v ? 1 : 0]);

export const getValueByRange = (x: number, min: number, max: number) => {
    if (x < min) return min;
    if (x > max) return max;
    return x;
};
