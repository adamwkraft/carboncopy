/* global cv:false */
import inside from 'point-in-polygon';

export const polygonToArray = (polygon, width, height) => {
  const bytes = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < height * width; ++i) {
    const x = i % width;
    const y = parseInt(i / width);
    const isIn = Number(inside([x, y], polygon)) * 255;
    bytes[i * 4] = isIn;
    bytes[i * 4 + 1] = isIn;
    bytes[i * 4 + 2] = isIn;
    bytes[i * 4 + 3] = isIn ? 128 : 0;
  }
  return new ImageData(bytes, width, height);
};

export const getOpenCvMaskFromSegmentation = (segmentation, flipped) => {
  const { data, width, height } = segmentation;
  const binaryBytes = new Uint8ClampedArray(segmentation.data.length * 4);
  // TODO: See if we can directly create CVMat from segmentation.data.

  for (let i = 0; i < height * width; ++i) {
    const x = i % width;
    const y = parseInt(i / width);

    const isPerson = data[i];
    const bytes_index = flipped ? width - x + width * y : i;

    binaryBytes[bytes_index * 4] = isPerson ? 255 : 0; // red
    binaryBytes[bytes_index * 4 + 1] = isPerson ? 255 : 0; // green
    binaryBytes[bytes_index * 4 + 2] = isPerson ? 255 : 0; // blue
    binaryBytes[bytes_index * 4 + 3] = isPerson ? 255 : 0; // alpha
  }
  let binaryImageData = new ImageData(binaryBytes, width, height);

  // Load data into Mat.
  let segData = cv.matFromImageData(binaryImageData);

  // Create a single channel mask.
  let rgbaPlanes = new cv.MatVector();
  cv.split(segData, rgbaPlanes);
  let pre_mask = new cv.Mat();
  // Threshold on one channel (doesn't matter which one)
  cv.threshold(rgbaPlanes.get(0), pre_mask, 128, 1, cv.THRESH_BINARY); // Mask is 0s and 1s, type CV_8UC1

  // Use findContours/drawContours to remove small blobs.
  // See example: https://docs.opencv.org/3.4/d5/daa/tutorial_js_contours_begin.html
  // TODO: This only updates the overlay. Also update the Mask.
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(pre_mask, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
  let mask = cv.Mat.zeros(pre_mask.rows, pre_mask.cols, cv.CV_8UC1);
  let area = 0;
  let minAreaThreshold = 10000; // Can change this, starting off with 100x100.
  for (let i = 0; i < contours.size(); ++i) {
    area = cv.contourArea(contours.get(i));
    if (area > minAreaThreshold) {
      cv.drawContours(mask, contours, i, [1, 1, 1, 1], -1 /*fill*/, cv.LINE_8, hierarchy, 100);
    }
  }

  // Cleanup
  segData.delete();
  rgbaPlanes.delete();

  return mask;
};

export const getSegmentationeOverlayAndBinaryImageData = (segmentation, flipped) => {
  const mask = getOpenCvMaskFromSegmentation(segmentation, flipped);

  // Create a Blue opaque overlay with a solid Green border.
  // NOTE: Images are in RGBA format
  let rgbaPlanes = new cv.MatVector();
  let overlay = cv.Mat.zeros(mask.rows, mask.cols, cv.CV_8UC4);
  cv.split(overlay, rgbaPlanes);
  // Fill blue channel and alpha using the mask.
  rgbaPlanes.get(2).setTo([255, 0, 0, 0], mask); // Blue
  rgbaPlanes.get(3).setTo([128, 0, 0, 0], mask); // Alpha
  // Get a border mask.
  let borderSize = 10;
  let borderMask = new cv.Mat();
  let M = cv.Mat.ones(borderSize, borderSize, cv.CV_8U);
  let anchor = new cv.Point(-1, -1);
  cv.dilate(mask, borderMask, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
  cv.subtract(borderMask, mask, borderMask);
  // Fill solid green using the border mask.
  rgbaPlanes.get(2).setTo([255, 0, 0, 0], borderMask); // Blue
  // rgbaPlanes.get(1).setTo([255, 0, 0, 0], borderMask); // Green
  rgbaPlanes.get(1).setTo([255, 0, 0, 0], borderMask); // Green
  rgbaPlanes.get(3).setTo([255, 0, 0, 0], borderMask); // Alpha
  // Merge into final result.
  cv.merge(rgbaPlanes, overlay);
  const overlayImageData = new ImageData(
    new Uint8ClampedArray(overlay.data),
    overlay.cols,
    overlay.rows,
  );
  // Cleanup
  rgbaPlanes.delete();
  mask.delete();
  overlay.delete();
  M.delete();
  borderMask.delete();

  // TODO: only return one image here.
  return { overlayImageData, binaryImageData: overlayImageData };
};

export const getScoreAndOverlayForSegmentationAndImageData = (
  targetImageData,
  segmentation,
  flipped,
) => {
  // Create a visualization of the new segmentation.
  const segmentationMask = getOpenCvMaskFromSegmentation(segmentation, flipped);
  let rgbaPlanes = new cv.MatVector();
  let segOverlay = cv.Mat.zeros(segmentationMask.rows, segmentationMask.cols, cv.CV_8UC4);
  cv.split(segOverlay, rgbaPlanes);
  // Fill green channel and alpha using the mask.
  rgbaPlanes.get(1).setTo([255, 0, 0, 0], segmentationMask); // Green
  rgbaPlanes.get(3).setTo([128, 0, 0, 0], segmentationMask); // Alpha
  // Get a border mask.
  let borderSize = 10;
  let borderMask = new cv.Mat();
  let M = cv.Mat.ones(borderSize, borderSize, cv.CV_8U);
  let anchor = new cv.Point(-1, -1);
  cv.dilate(
    segmentationMask,
    borderMask,
    M,
    anchor,
    1,
    cv.BORDER_CONSTANT,
    cv.morphologyDefaultBorderValue(),
  );
  cv.subtract(borderMask, segmentationMask, borderMask);
  // Fill solid green using the border mask.
  rgbaPlanes.get(1).setTo([255, 0, 0, 0], borderMask); // Green
  rgbaPlanes.get(3).setTo([255, 0, 0, 0], borderMask); // Alpha
  // Merge into final result.
  cv.merge(rgbaPlanes, segOverlay);
  const segOverlayImageData = new ImageData(
    new Uint8ClampedArray(segOverlay.data),
    segOverlay.cols,
    segOverlay.rows,
  );

  // Create a mask from the targetImageData.
  let targetData = cv.matFromImageData(targetImageData);
  let targetRgbaPlanes = new cv.MatVector();
  cv.split(targetData, targetRgbaPlanes);

  // Merge the two images.
  let mergedImage = new cv.Mat();
  cv.addWeighted(segOverlay, 0.5, targetData, 0.5, 0.0, mergedImage);
  const mergedOverlayImageData = new ImageData(
    new Uint8ClampedArray(mergedImage.data),
    mergedImage.cols,
    mergedImage.rows,
  );

  const { data, width, height } = segmentation;
  const bytes = new Uint8ClampedArray(segmentation.data.length * 4);

  let union = 0;
  let intersection = 0;

  for (let i = 0; i < height * width; ++i) {
    const x = i % width;
    const y = parseInt(i / width);

    const bytes_index = flipped ? width - x + width * y : i;

    const isPerson = data[i];
    const isInPolygon = !!targetImageData.data[bytes_index * 4 + 2];
    const isIntersection = isInPolygon && isPerson;
    const isMissedPolygon = isInPolygon && !isPerson;
    const isPersonOutOfPolygon = !isInPolygon && isPerson;
    const isInteresting = isPersonOutOfPolygon || isIntersection || isMissedPolygon;

    if (isIntersection) intersection++;
    if (isPerson || isInPolygon) union++;

    bytes[bytes_index * 4] = isPersonOutOfPolygon ? 255 : 0; // red
    bytes[bytes_index * 4 + 1] = isIntersection ? 255 : 0; // green
    bytes[bytes_index * 4 + 2] = isMissedPolygon ? 255 : 0; // blue
    bytes[bytes_index * 4 + 3] = isInteresting ? 128 : 0; // alpha
  }

  const score = Math.round((intersection / (union + 0.0000001)) * 100);

  // Cleanup
  rgbaPlanes.delete();
  segmentationMask.delete();
  segOverlay.delete();
  M.delete();
  borderMask.delete();
  mergedImage.delete();

  return { score, targetOverlay: mergedOverlayImageData, segOverlay: segOverlayImageData };
};

export const drawPolygon = (ctx, polygon, color = 'rgba(255, 255, 255, 0.5)') => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(polygon[0][0], polygon[0][1]);
  const vertices = polygon.slice(1);
  vertices.forEach(([x, y]) => {
    ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();
};

export const flipPolygon = (polygon, width) => polygon.map(([x, y]) => [width - x, y]);

export const inflatePolygon = (width, height) => (polygon) =>
  polygon.map(([x, y]) => [x * width, y * height]);

export const saveAs = (blob, filename) => {
  if (typeof navigator.msSaveOrOpenBlob !== 'undefined') {
    return navigator.msSaveOrOpenBlob(blob, filename);
  } else if (typeof navigator.msSaveBlob !== 'undefined') {
    return navigator.msSaveBlob(blob, filename);
  } else {
    var elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    elem.style = 'display:none;opacity:0;color:transparent;';
    (document.body || document.documentElement).appendChild(elem);
    if (typeof elem.click === 'function') {
      elem.click();
    } else {
      elem.target = '_blank';
      elem.dispatchEvent(
        new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
        }),
      );
    }
    URL.revokeObjectURL(elem.href);
  }
};
