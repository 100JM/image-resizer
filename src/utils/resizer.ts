import { createCanvas, loadImage } from 'canvas';


export const resizer = (
    file: File | Buffer,
    maxWidth: number,
    maxHeight: number,
    options: {
        quality?: number;
        format?: 'jpeg' | 'png' | 'webp';
        imageSmoothingEnabled?: boolean;
        imageSmoothingQuality?: 'low' | 'medium' | 'high';
    } = {}
) => {
    const isBrowser = typeof window !== 'undefined' &&
        typeof document !== 'undefined' &&
        typeof navigator !== 'undefined' &&
        !navigator.userAgent.includes('jsdom');

    if (isBrowser) {
        return browserResizer(file, maxWidth, maxHeight, options);
    } else {
        return nodeResizer(file, maxWidth, maxHeight, options);
    }
};


const browserResizer = (
    file: File | Buffer,
    maxWidth: number,
    maxHeight: number,
    options: {
        quality?: number;
        format?: 'jpeg' | 'png' | 'webp';
        imageSmoothingEnabled?: boolean;
        imageSmoothingQuality?: 'low' | 'medium' | 'high';
    } = {}
) => {
    return new Promise((resolve, reject) => {

        const { 
            quality = 0.7, 
            format = 'jpeg', 
            imageSmoothingEnabled = true,
            imageSmoothingQuality = 'high'
        } = options;

        const isFile = file instanceof File;
        const isBuffer = Buffer.isBuffer(file);

        if (!isFile && !isBuffer) {
            reject(new Error('File or Buffer is required'));
            return;
        }

        const processImage = async (dataUrl: string) => {

            const img = new Image();

            img.onload = () => {
                try {
                    let width = img.width;
                    let height = img.height;
                    let originalWidth = img.width;
                    let originalHeight= img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    }

                    width = Math.max(Math.round(width), 1);
                    height = Math.max(Math.round(height), 1);

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');

                    if (!ctx) {
                        throw new Error('Failed to get canvas context');
                    }

                    ctx.imageSmoothingEnabled = imageSmoothingEnabled ?? true;
                    ctx.imageSmoothingQuality = imageSmoothingQuality ?? 'high';

                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve({
                            blob,
                            width,
                            height,
                            originalWidth,
                            originalHeight
                        });
                    }, `image/${format}`, quality);


                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = () => reject(new Error('Image loading failed'));
            img.src = dataUrl;
        };

        if (isFile) {
            const imgReader = new FileReader();

            imgReader.onload = (event) => {
                const dataUrl = event.target?.result as string;
                processImage(dataUrl);
            };

            imgReader.onerror = () => reject(new Error('File reading failed'));
            imgReader.readAsDataURL(file);

        } else {
            const dataUrl = `data:image/jpeg;base64,${file.toString('base64')}`;
            processImage(dataUrl);
        }
    });
};

const nodeResizer = (
    file: File | Buffer,
    maxWidth: number,
    maxHeight: number,
    options: {
        quality?: number;
        imageSmoothingEnabled?: boolean;
    } = {}
) => {

    return new Promise((resolve, reject) => {

        const { 
            quality = 0.7, 
            imageSmoothingEnabled = true,
        } = options;

        const isFile = file instanceof File;
        const isBuffer = Buffer.isBuffer(file);

        if (!isFile && !isBuffer) {
            reject(new Error('File or Buffer is required'));
            return;
        }

        const processImage = async (dataUrl: string) => {

            const img = await loadImage(dataUrl);

            try {
                let width = img.width;
                let height = img.height;
                let originalWidth = img.width;
                let originalHeight= img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                }

                width = Math.max(Math.round(width), 1);
                height = Math.max(Math.round(height), 1);

                const canvas = createCanvas(width, height);
                const ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = imageSmoothingEnabled || true;

                ctx.drawImage(img, 0, 0, width, height);
                
                const buffer = canvas.toBuffer('image/jpeg', {
                    quality: quality * 100
                });

                resolve({
                    buffer,
                    width,
                    height,
                    originalWidth,
                    originalHeight
                });

            } catch (error) {
                reject(error);
            }

            img.onerror = () => reject(new Error('Image loading failed'));
            img.src = dataUrl;
        };

        if (isFile) {
            const imgReader = new FileReader();

            imgReader.onload = (event) => {
                const dataUrl = event.target?.result as string;
                processImage(dataUrl);
            };

            imgReader.onerror = () => reject(new Error('File reading failed'));
            imgReader.readAsDataURL(file);

        } else {
            const dataUrl = `data:image/jpeg;base64,${file.toString('base64')}`;
            processImage(dataUrl);
        }
    });
};