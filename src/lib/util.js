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

export const drawResult = (polygon, segmentation) => {
  const bytes = new Uint8ClampedArray(segmentation.data.length * 4);
  const {data, width, height} = segmentation; 
  for (let i = 0; i < height * width; ++i) {
    const x = i % width;
    const y = parseInt(i / width);
    const isIn = inside([x, y], polygon)
    const isPerson = data[i];
    const isIntersection = isIn && isPerson;
    bytes[i*4] = isIntersection * 255;
    bytes[i*4+1] = isIntersection * 255;
    bytes[i*4+2] = isIntersection * 255;
    bytes[i*4+3] = isIntersection ? 128 : 0;
  }
  return new ImageData(bytes, width, height);

}

export const drawResultFlipped = (polygon, segmentation) => {
  const bytes = new Uint8ClampedArray(segmentation.data.length * 4);
  const {data, width, height} = segmentation; 
  for (let i = 0; i < height * width; ++i) {
    const x = i % width;
    const y = parseInt(i / width);
    const isIn = inside([x, y], polygon)
    const isPerson = data[i];
    const isIntersection = isIn && isPerson;
    const isMissedPolygon = isIn && !isPerson;
    const isFalseDetection = !isIn && isPerson;
    const bytes_index  = (width - x) + (width * y);
    bytes[bytes_index*4] = isFalseDetection ? 255 : 0;
    bytes[bytes_index*4+1] = isIntersection? 255 : 0;
    bytes[bytes_index*4+2] = isMissedPolygon ? 255 : 0;
    bytes[bytes_index*4+3] = 128;
  }
  return new ImageData(bytes, width, height);

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
