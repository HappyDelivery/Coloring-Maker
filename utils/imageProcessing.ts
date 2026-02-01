/**
 * Image Processing Utilities
 * Uses 'Color Dodge' method with Levels Adjustment to create clean, single-stroke coloring book pages.
 */

/**
 * Converts image data to grayscale.
 */
export const toGrayscale = (data: Uint8ClampedArray) => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Luminance formula
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }
};

/**
 * Inverts the colors.
 */
export const invertColors = (data: Uint8ClampedArray) => {
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
};

/**
 * Fast Box Blur.
 * Radius determines line thickness in the sketch effect.
 */
export const fastBlur = (data: Uint8ClampedArray, width: number, height: number, radius: number) => {
  if (radius < 1) return;

  const size = width * height * 4;
  const tempData = new Uint8ClampedArray(size);
  tempData.set(data);

  const boxBlurH = (scl: Uint8ClampedArray, tcl: Uint8ClampedArray, w: number, h: number, r: number) => {
    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        let val = 0;
        let count = 0;
        for (let k = j - r; k <= j + r; k++) {
          if (k >= 0 && k < w) {
            val += scl[(i * w + k) * 4];
            count++;
          }
        }
        const idx = (i * w + j) * 4;
        const avg = val / count;
        tcl[idx] = avg; tcl[idx + 1] = avg; tcl[idx + 2] = avg; tcl[idx + 3] = 255;
      }
    }
  };

  const boxBlurV = (scl: Uint8ClampedArray, tcl: Uint8ClampedArray, w: number, h: number, r: number) => {
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        let val = 0;
        let count = 0;
        for (let k = j - r; k <= j + r; k++) {
          if (k >= 0 && k < h) {
            val += scl[(k * w + i) * 4];
            count++;
          }
        }
        const idx = (j * w + i) * 4;
        const avg = val / count;
        tcl[idx] = avg; tcl[idx + 1] = avg; tcl[idx + 2] = avg; tcl[idx + 3] = 255;
      }
    }
  };

  boxBlurH(data, tempData, width, height, radius);
  boxBlurV(tempData, data, width, height, radius);
};

/**
 * Color Dodge Blending.
 * Creates the sketch look by dividing base by inverse of blend.
 */
export const colorDodge = (base: Uint8ClampedArray, blend: Uint8ClampedArray, target: Uint8ClampedArray) => {
  for (let i = 0; i < base.length; i += 4) {
    const b = base[i];
    const l = blend[i];
    // Dodge formula: B / (1 - L)
    let val = 0;
    if (l === 255) {
      val = 255;
    } else {
      val = Math.min(255, (b / (255 - l)) * 255);
    }
    target[i] = val;
    target[i + 1] = val;
    target[i + 2] = val;
    target[i + 3] = 255;
  }
};

/**
 * Levels Adjustment (Thresholding).
 * Forces light gray areas to white to remove shading.
 * Darkens dark lines to be true black.
 */
export const applyLevels = (data: Uint8ClampedArray, whitePoint: number) => {
  // whitePoint: 0-100 input mapped to approx 150-255 pixel value
  // If a pixel is brighter than 'level', make it 255.
  // Then stretch the remaining range to 0-255.
  
  const level = 255 - (whitePoint * 1.5); // Map slider 0-100 to range ~255 down to ~105
  
  for (let i = 0; i < data.length; i += 4) {
    let v = data[i];
    
    // 1. High-Pass: Remove noise
    if (v > level) {
      v = 255;
    } else {
      // 2. Contrast Stretch (Darken lines)
      // Map 0..level to 0..240 (keep a little anti-aliasing)
      v = (v / level) * 240; 
      
      // 3. Gamma Correction (make midtones darker)
      // v = Math.pow(v / 255, 0.5) * 255; // Optional
    }
    
    // Make lines purely monochrome if very dark? No, keep gray for anti-aliasing.
    
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
  }
};

export const processImageToSketch = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  thickness: number,    // Controls Blur Radius
  cleanliness: number   // Controls White Point Threshold
): string => {
  const originalImageData = ctx.getImageData(0, 0, width, height);
  const grayData = new Uint8ClampedArray(originalImageData.data);
  const invertedData = new Uint8ClampedArray(originalImageData.data);
  
  // 1. Grayscale
  toGrayscale(grayData);

  // 2. Create Inverted Copy for Blur
  invertedData.set(grayData);
  invertColors(invertedData);

  // 3. Blur the Inverted Copy (Controls Line Thickness)
  // Map 0-100 slider to 0-50 radius (approx)
  const radius = Math.max(1, Math.floor(thickness / 2)); 
  fastBlur(invertedData, width, height, radius);

  // 4. Color Dodge (The "Sketch" Magic)
  // Writes result into originalImageData
  colorDodge(grayData, invertedData, originalImageData.data);

  // 5. Clean up (Threshold/Levels)
  // This removes the gray fills
  applyLevels(originalImageData.data, cleanliness);

  // 6. Render
  ctx.putImageData(originalImageData, 0, 0);
  
  return ctx.canvas.toDataURL("image/png");
};
