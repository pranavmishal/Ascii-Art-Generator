export interface AsciiConfig {
  resolution: number; // characters per row (40-200)
  charset: CharacterSet;
  contrast: number; // 0.5 - 2.0
  invert: boolean;
  colorMode: 'monochrome' | 'colored';
}

export type CharacterSet = 'simple' | 'standard' | 'dense' | 'blocks';

export interface AsciiChar {
  char: string;
  color: string;
  x: number;
  y: number;
}

export interface AsciiResult {
  chars: AsciiChar[][];
  width: number;
  height: number;
  fontSize: number;
  lineHeight: number;
}

// Character sets ordered from darkest to lightest
const CHARACTER_SETS: Record<CharacterSet, string> = {
  simple: '@%#*+=-:. ',
  standard: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
  dense: '@QB#NgWM8RDHdOKq9$6khEPXwmeZS2eFaAU5Gbu3jynT[4oCJLfvrc1tI}zs7{?il|x/Y)*(<>=!+^";:-~_,\'`. ',
  blocks: '█▓▒░ ',
};

// Get character based on brightness (0-255)
function getCharForBrightness(brightness: number, charset: CharacterSet, invert: boolean): string {
  const chars = CHARACTER_SETS[charset];
  
  // Apply inversion if needed
  let adjustedBrightness = invert ? 255 - brightness : brightness;
  
  // Map brightness to character index
  const index = Math.floor((adjustedBrightness / 255) * (chars.length - 1));
  return chars[Math.min(index, chars.length - 1)];
}

// Apply contrast adjustment
function applyContrast(value: number, contrast: number): number {
  // Contrast formula: ((value/255 - 0.5) * contrast + 0.5) * 255
  const normalized = value / 255;
  const adjusted = (normalized - 0.5) * contrast + 0.5;
  return Math.max(0, Math.min(255, adjusted * 255));
}

// Calculate brightness from RGB using luminance formula
function getBrightness(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

// RGB to hex color
function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('')}`;
}

export async function convertImageToAscii(
  imageSource: string | HTMLImageElement,
  config: AsciiConfig
): Promise<AsciiResult> {
  return new Promise((resolve, reject) => {
    const img = typeof imageSource === 'string' ? new Image() : imageSource;
    
    const processImage = () => {
      try {
        // Create canvas for pixel sampling
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Calculate dimensions based on resolution
        const aspectRatio = img.height / img.width;
        const charWidth = config.resolution;
        // Adjust for character aspect ratio (chars are taller than wide)
        const charHeight = Math.floor(charWidth * aspectRatio * 0.5);
        
        // Set canvas to sample resolution
        canvas.width = charWidth;
        canvas.height = charHeight;
        
        // Draw and sample image
        ctx.drawImage(img, 0, 0, charWidth, charHeight);
        const imageData = ctx.getImageData(0, 0, charWidth, charHeight);
        const pixels = imageData.data;
        
        // Convert pixels to ASCII characters
        const chars: AsciiChar[][] = [];
        
        for (let y = 0; y < charHeight; y++) {
          const row: AsciiChar[] = [];
          
          for (let x = 0; x < charWidth; x++) {
            const idx = (y * charWidth + x) * 4;
            let r = pixels[idx];
            let g = pixels[idx + 1];
            let b = pixels[idx + 2];
            
            // Apply contrast
            r = applyContrast(r, config.contrast);
            g = applyContrast(g, config.contrast);
            b = applyContrast(b, config.contrast);
            
            const brightness = getBrightness(r, g, b);
            const char = getCharForBrightness(brightness, config.charset, config.invert);
            
            // Determine color
            let color: string;
            if (config.colorMode === 'colored') {
              color = rgbToHex(r, g, b);
            } else {
              // Monochrome - use brightness-based gray or fixed color
              const gray = config.invert ? 255 - brightness : brightness;
              color = rgbToHex(gray, gray, gray);
            }
            
            row.push({ char, color, x, y });
          }
          
          chars.push(row);
        }
        
        // Calculate font size based on resolution
        // Target width around 800px for default view
        const fontSize = Math.max(4, Math.min(16, Math.floor(800 / charWidth)));
        const lineHeight = fontSize * 1.1;
        
        resolve({
          chars,
          width: charWidth,
          height: charHeight,
          fontSize,
          lineHeight,
        });
      } catch (error) {
        reject(error);
      }
    };
    
    if (typeof imageSource === 'string') {
      img.crossOrigin = 'anonymous';
      img.onload = processImage;
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageSource;
    } else {
      processImage();
    }
  });
}

// Generate SVG string from ASCII result
export function generateAsciiSvg(result: AsciiResult, backgroundColor: string = '#0c0c0f'): string {
  const { chars, fontSize, lineHeight, width, height } = result;
  
  // Calculate SVG dimensions
  const charWidthPx = fontSize * 0.6; // Approximate monospace character width
  const svgWidth = width * charWidthPx;
  const svgHeight = height * lineHeight;
  
  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&amp;display=swap');
    text { font-family: 'JetBrains Mono', monospace; font-size: ${fontSize}px; }
  </style>
  <rect width="100%" height="100%" fill="${backgroundColor}"/>
  <g>`;
  
  for (let y = 0; y < chars.length; y++) {
    const row = chars[y];
    let currentColor = '';
    let currentText = '';
    let startX = 0;
    
    for (let x = 0; x < row.length; x++) {
      const { char, color } = row[x];
      
      if (color !== currentColor) {
        // Output previous text span if exists
        if (currentText) {
          const xPos = startX * charWidthPx;
          const yPos = (y + 1) * lineHeight;
          svgContent += `\n    <text x="${xPos}" y="${yPos}" fill="${currentColor}">${escapeXml(currentText)}</text>`;
        }
        currentColor = color;
        currentText = char;
        startX = x;
      } else {
        currentText += char;
      }
    }
    
    // Output remaining text
    if (currentText) {
      const xPos = startX * charWidthPx;
      const yPos = (y + 1) * lineHeight;
      svgContent += `\n    <text x="${xPos}" y="${yPos}" fill="${currentColor}">${escapeXml(currentText)}</text>`;
    }
  }
  
  svgContent += '\n  </g>\n</svg>';
  
  return svgContent;
}

// Escape XML special characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Default configuration
export const DEFAULT_CONFIG: AsciiConfig = {
  resolution: 100,
  charset: 'standard',
  contrast: 1.0,
  invert: false,
  colorMode: 'colored',
};

