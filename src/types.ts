import { Buffer } from 'buffer'

export interface BytesEncoder {
    /**
     * Bufferize this structure
     * @returns {Buffer} Buffered variant of this structure
     */
    toBuffer: () => Buffer;
}