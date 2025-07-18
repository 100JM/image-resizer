# @100jm/image-resizer

A TypeScript library for resizing images in both browser and Node.js environments with automatic environment detection.

## Features

- 🖼️ **Cross-platform**: Works in both browser and Node.js environments
- 🔄 **Auto-detection**: Automatically detects environment and uses appropriate method
- 📦 **TypeScript**: Full TypeScript support with type definitions
- ⚡ **Promise-based**: Modern async/await API
- 🔧 **Configurable**: Quality, format, and smoothing options
- 📏 **Aspect ratio preservation**: Maintains image proportions
- 🚀 **Lightweight**: No heavy dependencies

## Installation

```bash
npm install @100jm/image-resizer
```

## Usage

### Basic Usage

```typescript
import { resizer } from '@100jm/image-resizer';

// Resize an image file
const result = await resizer(imageFile, 800, 600, {
  quality: 0.8,
  format: 'jpeg'
});

console.log(`Resized from ${result.originalWidth}x${result.originalHeight} to ${result.width}x${result.height}`);
```

### Browser Environment

```typescript
import { resizer } from '@100jm/image-resizer';

// Handle file input
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const file = fileInput.files[0];

if (file) {
  try {
    const result = await resizer(file, 1024, 768, {
      quality: 0.9,
      format: 'jpeg',
      imageSmoothingQuality: 'high'
    });
    
    // Use the resized image blob
    const img = document.createElement('img');
    img.src = URL.createObjectURL(result.data);
    document.body.appendChild(img);
    
    console.log('Resized successfully:', result);
  } catch (error) {
    console.error('Image resize failed:', error);
  }
}
```

### Node.js Environment

```typescript
import { resizer } from '@100jm/image-resizer';
import { readFileSync, writeFileSync } from 'fs';

// Read image file
const imageBuffer = readFileSync('./input.jpg');

// Resize image
const result = await resizer(imageBuffer, 800, 600, {
  quality: 0.8
});

// Save resized image
writeFileSync('./output.jpg', result.data);
console.log('Resized successfully:', result);
```

## API Reference

### `resizer(file, maxWidth, maxHeight, options?)`

Resizes an image file or buffer while maintaining aspect ratio.

#### Parameters

- `file` (File | Buffer): The image to resize
- `maxWidth` (number): Maximum width in pixels
- `maxHeight` (number): Maximum height in pixels
- `options` (object, optional): Configuration options

#### Options

```typescript
interface ResizeOptions {
  quality?: number;                    // Image quality (0.1 - 1.0, default: 0.7)
  format?: 'jpeg' | 'png' | 'webp';    // Output format (browser only, default: 'jpeg')
  imageSmoothingEnabled?: boolean;     // Enable image smoothing (default: true)
  imageSmoothingQuality?: 'low' | 'medium' | 'high'; // Smoothing quality (browser only, default: 'high')
}
```

#### Returns

**Browser Environment:**
```typescript
{
  data: Blob;           // Resized image as Blob
  width: number;        // Final width
  height: number;       // Final height
  originalWidth: number; // Original width
  originalHeight: number; // Original height
}
```

**Node.js Environment:**
```typescript
{
  data: Blob;       // Resized image as Blob
  width: number;        // Final width
  height: number;       // Final height
  originalWidth: number; // Original width
  originalHeight: number; // Original height
}
```

## Examples

### Maintain Aspect Ratio

```typescript
// Only specify max dimensions, aspect ratio is preserved
const result = await resizer(imageFile, 800, 600);
console.log(`Resized to ${result.width}x${result.height}`);
```

### High Quality Output

```typescript
const result = await resizer(imageFile, 800, 600, {
  quality: 0.95,
  imageSmoothingQuality: 'high'
});
```

### Different Formats (Browser)

```typescript
// PNG format
const pngResult = await resizer(imageFile, 800, 600, {
  format: 'png',
  quality: 0.9
});

// WebP format
const webpResult = await resizer(imageFile, 800, 600, {
  format: 'webp',
  quality: 0.8
});
```

### Node.js with Buffer

```typescript
import { resizer } from '@100jm/image-resizer';

const imageBuffer = Buffer.from('...'); // Your image buffer
const result = await resizer(imageBuffer, 800, 600, {
  quality: 0.8
});
```

## Environment Detection

The library automatically detects the environment:

- **Browser**: Uses Canvas API with `document.createElement('canvas')`
- **Node.js**: Uses `canvas` package with `createCanvas()`

No manual configuration required!

## Browser Support

- Chrome 51+
- Firefox 42+
- Safari 10+
- Edge 79+

## Node.js Support

- Node.js 14.0.0+
- Requires `canvas` package for image processing

## Development

```bash
# Install dependencies
npm install @100jm/image-resizer

# Build the library (CommonJS + ES Modules)
npm run build

# Run tests
npm test

# Development mode with watch
npm run dev

# Clean build directory
npm run clean
```

- **TypeScript Target**: ES6
- **Module Systems**: CommonJS + ES Modules (dual build)
- **Build Output**:
  - `dist/cjs/` - CommonJS modules for Node.js
  - `dist/mjs/` - ES Modules for modern bundlers

The library uses conditional exports to provide the optimal module format:
- CommonJS environments: Uses `dist/cjs/` files
- ES Modules environments: Uses `dist/mjs/` files

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Issues

If you find any issues, please report them on the [GitHub issues page](https://github.com/100JM/image-resizer/issues).