import { useRef, useState, useEffect, useCallback } from 'react';

import { useWebcam } from '../context/webcam';

// eslint-disable-next-line import/no-webpack-loader-syntax
import BodyPixWorker from 'workerize-loader!../worker/bodyPix';

const bodyPixWorker = BodyPixWorker();

export const useBodyPixController = () => {
  const webcam = useWebcam();

  const loadRef = useRef();
  const preloadRef = useRef();
  const [netReady, setNetReady] = useState(false);
  const [netPreloaded, setNetPreloaded] = useState(false);

  // load the model on the first mount
  useEffect(() => {
    if (!loadRef.current && webcam.ready) {
      loadRef.current = true;
      bodyPixWorker
        .load()
        .then(() => {
          console.log('BodyPix loaded');
          setNetReady(true);
        })
        .catch(console.error);
    }
  }, [webcam]);

  // TODO: Make it possible to tweak bodyPix settings
  const predict = useCallback(async () => {
    if (!netReady) {
      throw new Error('Please wait for the model to load before calling "predict"');
    }

    const segmentation = await bodyPixWorker.predict(webcam.getVideoAsImageData());

    // console.log({segmentation});

    return segmentation;
  }, [netReady, webcam]);

  // pre load the model by running a first prediction
  useEffect(() => {
    if (netReady && !preloadRef.current && !netPreloaded) {
      preloadRef.current = true;
      predict().then(() => {
        setNetPreloaded(true);
      });
    }
  }, [predict, netReady, netPreloaded]);

  // don't return the prediction fn until the model has processed the first frame
  return netPreloaded ? predict : null;
};
