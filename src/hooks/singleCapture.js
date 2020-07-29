import { useCallback } from 'react';

import { useWebcam } from '../context/webcam';
import { useBodyPix } from '../context/bodyPix';
import { getSegmentationeOverlayAndBinaryImageData } from '../lib/util';

export const useSingleCapture = () => {
  const webcam = useWebcam();
  const predict = useBodyPix();

  const handleClick = useCallback(async () => {
    const segmentation = await predict(webcam.videoRef.current);
    const { overlayImageData } = getSegmentationeOverlayAndBinaryImageData(
      segmentation,
      webcam.flipX,
    );

    webcam.clearCanvas();
    webcam.ctx.putImageData(overlayImageData, 0, 0);
  }, [predict, webcam]);

  return handleClick;
};
