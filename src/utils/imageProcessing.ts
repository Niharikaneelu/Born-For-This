/**
 * Image processing utilities for puzzle game
 * Handles image resizing and splitting into grid pieces
 */

export interface PuzzleImage {
  pieces: string[]; // Array of data URLs for each piece (3x3 = 9 pieces)
  originalDataUrl: string; // Full image data URL for reveal
  gridSize: number; // Should be 3 for 3x3 grid
  pieceWidth: number;
  pieceHeight: number;
}

/**
 * Resize image to fit within maxSize while maintaining aspect ratio
 */
function resizeImage(
  dataUrl: string,
  maxSize: number = 1000
): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions maintaining aspect ratio
      if (width > height) {
        if (width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

      resolve({ dataUrl: resizedDataUrl, width, height });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * Split image into 3x3 grid pieces
 */
function splitImageIntoPieces(
  dataUrl: string,
  gridSize: number = 3
): Promise<PuzzleImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      try {
        // Resize image first for performance
        const { dataUrl: resizedDataUrl, width, height } = await resizeImage(
          dataUrl,
          1000
        );

        const resizedImage = new Image();
        resizedImage.src = resizedDataUrl;
        await new Promise<void>((loadResolve, loadReject) => {
          resizedImage.onload = () => loadResolve();
          resizedImage.onerror = () => loadReject(new Error('Failed to load resized image'));
        });

        // Draw directly from the resized image so the puzzle keeps the original orientation.
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        ctx.drawImage(resizedImage, 0, 0, width, height);

        const fullImageDataUrl = canvas.toDataURL('image/jpeg', 0.85);

        // Calculate piece dimensions
        const pieceWidth = width / gridSize;
        const pieceHeight = height / gridSize;

        // Extract pieces
        const pieces: string[] = [];
        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            const pieceCanvas = document.createElement('canvas');
            pieceCanvas.width = Math.round(pieceWidth);
            pieceCanvas.height = Math.round(pieceHeight);

            const pieceCtx = pieceCanvas.getContext('2d');
            if (!pieceCtx) {
              throw new Error('Failed to get piece canvas context');
            }

            pieceCtx.drawImage(
              canvas,
              col * pieceWidth,
              row * pieceHeight,
              pieceWidth,
              pieceHeight,
              0,
              0,
              pieceCanvas.width,
              pieceCanvas.height
            );

            pieces.push(pieceCanvas.toDataURL('image/jpeg', 0.85));
          }
        }

        resolve({
          pieces,
          originalDataUrl: fullImageDataUrl,
          gridSize,
          pieceWidth,
          pieceHeight,
        });
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * Convert file to data URL
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Validate image file
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 5
): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a JPG or PNG image',
    };
  }

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Image must be smaller than ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Process image for puzzle game
 * Validates, resizes, and splits into pieces
 */
export async function processImageForPuzzle(
  file: File
): Promise<PuzzleImage> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid image file');
  }

  const dataUrl = await fileToDataUrl(file);
  const puzzleImage = await splitImageIntoPieces(dataUrl, 3);

  return puzzleImage;
}
