import inside from 'point-in-polygon';

export const polygonToArray = (polygon, width, height) => {
    const bytes = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < height * width; ++i) {
      const x = i % width;
      const y = parseInt(i / width);
      const isIn = Number(inside([x, y], polygon)) * 255;
      bytes[i*4] = isIn;
      bytes[i*4+1] = isIn;
      bytes[i*4+2] = isIn;
      bytes[i*4+3] = isIn ? 128 : 0;
    }
    return new ImageData(bytes, width, height);
}

export const getSegmentationOverlay = (segmentation, flipped) => {
  const {data, width, height} = segmentation;
  const bytes = new Uint8ClampedArray(segmentation.data.length * 4);

  for (let i = 0; i < height * width; ++i) {
    const x = i % width;
    const y = parseInt(i / width);

    const isPerson = data[i];
    const bytes_index  = (flipped ? (width - x) + (width * y) : i);

    bytes[bytes_index*4] = 0;  // red
    bytes[bytes_index*4+1] = 0;   // green
    bytes[bytes_index*4+2] = isPerson ? 255 : 0; // blue
    bytes[bytes_index*4+3] = isPerson ? 128 : 0; // alpha
  }

  const overlay = new ImageData(bytes, width, height);

  return overlay;
}
export const getBinaryOverlay = (segmentation, flipped) => {
  const {data, width, height} = segmentation;
  const bytes = new Uint8ClampedArray(segmentation.data.length * 4);

  for (let i = 0; i < height * width; ++i) {
    const x = i % width;
    const y = parseInt(i / width);
    
    const isPerson = data[i];
    const bytes_index  = (flipped ? (width - x) + (width * y) : i);

    bytes[bytes_index*4] = isPerson ? 255 : 0;
    bytes[bytes_index*4+1] = isPerson ? 255 : 0;
    bytes[bytes_index*4+2] = isPerson ? 255 : 0;
    bytes[bytes_index*4+3] = isPerson ? 255 : 0;
  }

  const overlay = new ImageData(bytes, width, height);

  return overlay;
};

export const getScoreAndOverlay = (polygon, segmentation, flipped) => {
  const {data, width, height} = segmentation;
  const bytes = new Uint8ClampedArray(segmentation.data.length * 4);
  const resolvedPolygon = (flipped ? flipPolygon(polygon, width) : polygon);

  let union = 0;
  let intersection = 0;

  for (let i = 0; i < height * width; ++i) {
    const x = i % width;
    const y = parseInt(i / width);

    const isPerson = data[i];
    const isInPolygon = inside([x, y], resolvedPolygon)
    const isIntersection = isInPolygon && isPerson;
    const isMissedPolygon = isInPolygon && !isPerson;
    const isPersonOutOfPolygon = !isInPolygon && isPerson;

    if (isIntersection) intersection++;
    if (isPerson || isInPolygon) union++;
    
    const bytes_index  = (flipped ? (width - x) + (width * y) : i);

    bytes[bytes_index*4] = isPersonOutOfPolygon ? 255 : 0;  // red
    bytes[bytes_index*4+1] = isIntersection? 255 : 0;   // green
    bytes[bytes_index*4+2] = isMissedPolygon ? 255 : 0; // blue
    bytes[bytes_index*4+3] = 128;                       // alpha
  }

  const score = Math.round(intersection / (union+0.0000001) * 100);
  const overlay = new ImageData(bytes, width, height);

  return { score, overlay };
};

export const getScoreAndOverlayForSegmentation = (targetSegmentation, segmentation, flipped) => {
  const {data, width, height} = segmentation;
  const bytes = new Uint8ClampedArray(segmentation.data.length * 4);

  let union = 0;
  let intersection = 0;

  for (let i = 0; i < height * width; ++i) {
    const x = i % width;
    const y = parseInt(i / width);

    const isPerson = data[i];
    const isInPolygon = targetSegmentation.data[i];
    const isIntersection = isInPolygon && isPerson;
    const isMissedPolygon = isInPolygon && !isPerson;
    const isPersonOutOfPolygon = !isInPolygon && isPerson;

    if (isIntersection) intersection++;
    if (isPerson || isInPolygon) union++;
    
    const bytes_index  = (flipped ? (width - x) + (width * y) : i);

    bytes[bytes_index*4] = isPersonOutOfPolygon ? 255 : 0;  // red
    bytes[bytes_index*4+1] = isIntersection? 255 : 0;   // green
    bytes[bytes_index*4+2] = isMissedPolygon ? 255 : 0; // blue
    bytes[bytes_index*4+3] = 128;                       // alpha
  }

  const score = Math.round(intersection / (union+0.0000001) * 100);
  const overlay = new ImageData(bytes, width, height);

  return { score, overlay };
};

export const getScoreAndOverlayForSegmentationAndImageData = (targetImageData, segmentation, flipped) => {
  const {data, width, height} = segmentation;
  const bytes = new Uint8ClampedArray(segmentation.data.length * 4);

  let union = 0;
  let intersection = 0;

  for (let i = 0; i < height * width; ++i) {
    const x = i % width;
    const y = parseInt(i / width);

    const bytes_index  = (flipped ? (width - x) + (width * y) : i);

    const isPerson = data[i];
    const isInPolygon = !!targetImageData.data[bytes_index*4+2];
    const isIntersection = isInPolygon && isPerson;
    const isMissedPolygon = isInPolygon && !isPerson;
    const isPersonOutOfPolygon = !isInPolygon && isPerson;

    if (isIntersection) intersection++;
    if (isPerson || isInPolygon) union++;
    
    bytes[bytes_index*4] = isPersonOutOfPolygon ? 255 : 0;  // red
    bytes[bytes_index*4+1] = isIntersection? 255 : 0;   // green
    bytes[bytes_index*4+2] = isMissedPolygon ? 255 : 0; // blue
    bytes[bytes_index*4+3] = 128;                       // alpha
  }

  const score = Math.round(intersection / (union+0.0000001) * 100);
  const overlay = new ImageData(bytes, width, height);

  return { score, overlay };
}

export const drawPolygon = (ctx, polygon, color='rgba(255, 255, 255, 0.5)') => {
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

export const inflatePolygon = (width, height) => polygon => polygon.map(([x, y]) => [x*width, y*height]);
