import { AsciiResult, generateAsciiSvg } from './ascii-converter';

export type ExportFormat = 'svg' | 'png' | 'jpg';
export type CopyFormat = 'svg' | 'png' | 'jpg';

// Download a file with the given content
function downloadFile(content: string | Blob, filename: string, mimeType: string): void {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Export as SVG
export function exportAsSvg(result: AsciiResult, filename: string = 'ascii-art.svg'): void {
  const svgContent = generateAsciiSvg(result);
  downloadFile(svgContent, filename, 'image/svg+xml');
}

// Export as PNG or JPG using canvas
export async function exportAsImage(
  result: AsciiResult,
  format: 'png' | 'jpg',
  filename?: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const { chars, fontSize, lineHeight, width, height } = result;
    
    // Calculate canvas dimensions
    const charWidthPx = fontSize * 0.6;
    const canvasWidth = Math.ceil(width * charWidthPx);
    const canvasHeight = Math.ceil(height * lineHeight);
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }
    
    // Set background
    ctx.fillStyle = format === 'jpg' ? '#0c0c0f' : '#0c0c0f';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Set font
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
    ctx.textBaseline = 'top';
    
    // Draw characters
    for (let y = 0; y < chars.length; y++) {
      const row = chars[y];
      for (let x = 0; x < row.length; x++) {
        const { char, color } = row[x];
        ctx.fillStyle = color;
        ctx.fillText(char, x * charWidthPx, y * lineHeight);
      }
    }
    
    // Convert to blob and download
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const quality = format === 'jpg' ? 0.92 : undefined;
    const defaultFilename = `ascii-art.${format}`;
    
    canvas.toBlob(
      (blob) => {
        if (blob) {
          downloadFile(blob, filename || defaultFilename, mimeType);
          resolve();
        } else {
          reject(new Error('Failed to create image blob'));
        }
      },
      mimeType,
      quality
    );
  });
}

// Main export function
export async function exportAsciiArt(
  result: AsciiResult,
  format: ExportFormat,
  filename?: string
): Promise<void> {
  switch (format) {
    case 'svg':
      exportAsSvg(result, filename || 'ascii-art.svg');
      break;
    case 'png':
      await exportAsImage(result, 'png', filename);
      break;
    case 'jpg':
      await exportAsImage(result, 'jpg', filename);
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

// Copy SVG to clipboard
export async function copySvgToClipboard(result: AsciiResult): Promise<void> {
  const svgContent = generateAsciiSvg(result);
  
  // Try to copy as both text/plain and image/svg+xml
  try {
    // Create a blob for the SVG
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
    
    // Try the modern clipboard API with ClipboardItem
    if (typeof ClipboardItem !== 'undefined') {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob([svgContent], { type: 'text/plain' }),
        }),
      ]);
    } else {
      // Fallback to writeText
      await navigator.clipboard.writeText(svgContent);
    }
  } catch {
    // Final fallback
    await navigator.clipboard.writeText(svgContent);
  }
}

// Generate image blob from ASCII result
async function generateImageBlob(
  result: AsciiResult,
  format: 'png' | 'jpg'
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const { chars, fontSize, lineHeight, width, height } = result;
    
    // Calculate canvas dimensions
    const charWidthPx = fontSize * 0.6;
    const canvasWidth = Math.ceil(width * charWidthPx);
    const canvasHeight = Math.ceil(height * lineHeight);
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }
    
    // Set background
    ctx.fillStyle = '#0c0c0f';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Set font
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
    ctx.textBaseline = 'top';
    
    // Draw characters
    for (let y = 0; y < chars.length; y++) {
      const row = chars[y];
      for (let x = 0; x < row.length; x++) {
        const { char, color } = row[x];
        ctx.fillStyle = color;
        ctx.fillText(char, x * charWidthPx, y * lineHeight);
      }
    }
    
    // Convert to blob
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const quality = format === 'jpg' ? 0.92 : undefined;
    
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create image blob'));
        }
      },
      mimeType,
      quality
    );
  });
}

// Copy PNG to clipboard
export async function copyPngToClipboard(result: AsciiResult): Promise<void> {
  const blob = await generateImageBlob(result, 'png');
  
  if (typeof ClipboardItem !== 'undefined') {
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob,
      }),
    ]);
  } else {
    throw new Error('Clipboard API not supported for images');
  }
}

// Copy JPG to clipboard (converts to PNG since clipboard only supports PNG)
export async function copyJpgToClipboard(result: AsciiResult): Promise<void> {
  // Note: Clipboard API only supports PNG for images, so we copy as PNG
  // but the visual result is the same
  const blob = await generateImageBlob(result, 'png');
  
  if (typeof ClipboardItem !== 'undefined') {
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob,
      }),
    ]);
  } else {
    throw new Error('Clipboard API not supported for images');
  }
}

// Main copy function
export async function copyAsciiArt(
  result: AsciiResult,
  format: CopyFormat
): Promise<void> {
  switch (format) {
    case 'svg':
      await copySvgToClipboard(result);
      break;
    case 'png':
      await copyPngToClipboard(result);
      break;
    case 'jpg':
      await copyJpgToClipboard(result);
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

