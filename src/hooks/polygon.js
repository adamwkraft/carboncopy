import { useRef, useState, useEffect, useCallback } from "react";

import { inflatePolygon } from '../lib/util';
import { useWebcam } from "../context/webcam";

const defaultPolygons = [
  [
    [0.25, .25],
    [0.75, .25],
    [0.75, .5],
    [0.5, .5],
    [0.5, 1],
    [0.25, 1],
  ],
  [
    [0.1, 0.1],
    [0.5, 0.1],
    [0.5, 0.5],
    [0.75, 0.5],
    [0.75, 0.8],
    [0.5, 1],
  ]
];

export const usePolygon = () => {
  const webcam = useWebcam();
  const [polygons, setPolygons] = useState([]);

  useEffect(() => {
    const width = webcam?.canvasRef?.current?.width;
    const height = webcam?.canvasRef?.current?.height;
    
    // ensures that the video is initialized, otherwise width and height will be default
    if (!(width && height && webcam.videoStream) || polygons.length) return;

    const inflatedPolygons = defaultPolygons.map(inflatePolygon(width, height));
    
    setPolygons(inflatedPolygons);
    polygonRef.current = inflatedPolygons[0];
  }, [webcam, polygons]);

  const polygonRef = useRef(null);
  const polygonIdxRef = useRef(0);

  const next = useCallback(() => {
    polygonIdxRef.current++;
    if (polygonIdxRef.current > polygons.length - 1) {
      polygonIdxRef.current = 0;
    }

    polygonRef.current = polygons[polygonIdxRef.current];
  }, [polygons]);

  return { polygonRef, next };
};
