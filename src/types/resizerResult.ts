export type BrowserResizerResult = {
    blob: Blob;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
};

export type NodeResizerResult = {
    buffer: Buffer;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
};