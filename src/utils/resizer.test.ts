import { readFileSync } from 'fs';
import { join } from 'path';
import { resizer } from './resizer';

describe('resizer', () => {
    it('should be defined', async () => {
        const imagePath = join(__dirname, '../../tests/fixtures/test-image.jpg');
        const imageBuffer = readFileSync(imagePath);

        const result = await resizer(imageBuffer, 300, 200, { imageSmoothingEnabled: false, quality: 1 }) as {width: number, height: number};
        console.log(result);

    });
});