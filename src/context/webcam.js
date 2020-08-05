import React, {
  createContext,
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useContext,
} from 'react';

export const webcamContext = createContext();

export const useWebcam = () => {
  const state = useContext(webcamContext);

  if (!state) {
    throw new Error('useWebcam must be used within a WebcamProvider');
  }

  return state;
};

const VIDEO_WIDTH = 1280;
const VIDEO_HEIGHT = 720;
const AUTOSTART_KEY = 'AutoStartId';
const hasVideo = !!navigator?.mediaDevices?.getUserMedia;

const WebcamProvider = ({ children }) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [ctx, setCtx] = useState(null);
  const [flipX, setFlipX] = useState(true);
  const [ready, setReady] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [hidden, _setHidden] = useState(true);
  const [scratchpad, setScratchpad] = useState(null);
  const [videoError, setVideoError] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const [currentDeviceId, setCurrentDeviceId] = useState(undefined);
  const [autoStartDeviceId, _setAutoStartDeviceId] = useState(undefined);

  useEffect(() => {
    if (canvasRef.current && !ctx) {
      setCtx(canvasRef.current.getContext('2d'));
    } else if (ctx && !canvasRef.current) {
      setCtx(null);
    }
  }, [ctx]);

  // create a scratchpad for performing image transformations
  // without cluttering the main canvas
  useEffect(() => {
    if (ready && !scratchpad) {
      const canvas = document.createElement('canvas');
      canvas.width = canvasRef.current.width;
      canvas.height = canvasRef.current.height;
      const _ctx = canvas.getContext('2d');

      setScratchpad({ ctx: _ctx, canvas });
    }
  }, [scratchpad, ready]);

  const setVisible = useCallback(() => {
    _setHidden(false);
  }, []);

  const setHidden = useCallback(() => {
    _setHidden(true);
  }, []);

  const clearScratchpad = useCallback(() => {
    scratchpad.ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, [scratchpad]);

  const clearCanvas = useCallback(() => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, [ctx]);

  const stopVideo = useCallback(() => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
    }

    setVideoError(null);
    setVideoStream(null);
    setReady(false);
    setCurrentDeviceId(undefined);
  }, [videoStream]);

  const startVideo = useCallback(
    async (userConstraintsOrDeviceIdx) => {
      stopVideo();

      if (!hasVideo) {
        const message = 'Video not supported';

        console.error(message);
        setVideoError(message);

        return;
      }

      const isDeviceIdx = typeof userConstraintsOrDeviceIdx === 'number';

      const userConstraints = isDeviceIdx ? {} : userConstraintsOrDeviceIdx || {};
      const deviceIdx = isDeviceIdx ? userConstraintsOrDeviceIdx : userConstraints.deviceIdx;

      try {
        console.log('Getting Webcam...');
        const constraints = {
          video: {
            width: { exact: userConstraints.width || VIDEO_WIDTH },
            height: { exact: userConstraints.height || VIDEO_HEIGHT },
          },
          audio: false,
        };

        if (deviceIdx !== undefined) {
          userConstraints.deviceId = cameras[deviceIdx]?.deviceId;
        }

        if (userConstraints.deviceId) {
          constraints.video.deviceId = { exact: userConstraints.deviceId };
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const deviceId = stream.getTracks()[0]?.getCapabilities()?.deviceId;

        console.log('Got Webcam!');
        setVideoStream(stream);
        setCurrentDeviceId(deviceId);
        videoRef.current.srcObject = stream;
      } catch (e) {
        const message = 'Error starting video.';
        console.error(message);
        console.error(e.message);
        setVideoStream(null);
        setReady(false);
        setVideoError(message);

        return;
      }

      return await Promise.all([
        new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => resolve();
        }),
        new Promise((resolve) => {
          videoRef.current.onloadeddata = () => resolve();
        }),
      ]).then(() => setReady(true));
    },
    [stopVideo, videoRef, cameras],
  );

  const start = useCallback(async () => startVideo({ deviceId: autoStartDeviceId }), [
    autoStartDeviceId,
    startVideo,
  ]);

  const discoverCameras = useCallback(async () => {
    const enumerateDevices = navigator?.mediaDevices?.enumerateDevices;

    if (!enumerateDevices) {
      console.error('Cannot get cameras.');

      return [];
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    const foundCameras = devices
      .filter(
        ({ kind, label }) => kind === 'videoinput' && !label.includes('CamTwist'), // filter by video elements and remove CamTwist virtual devices
      )
      .map((currentCamera) => {
        let label;
        const idx = currentCamera.label.lastIndexOf(' (');
        if (idx > -1) label = currentCamera.label.slice(0, idx);

        return label ? { deviceId: currentCamera.deviceId, label } : currentCamera;
      });

    setCameras(foundCameras);

    return foundCameras;
  }, []);

  const toggleFlipX = useCallback(() => setFlipX((state) => !state), []);

  const setAutoStartDeviceId = useCallback((deviceId) => {
    window.localStorage.setItem(AUTOSTART_KEY, deviceId);
    _setAutoStartDeviceId(deviceId);
  }, []);

  const clearAutoStartDeviceId = useCallback(() => {
    window.localStorage.removeItem(AUTOSTART_KEY);
    _setAutoStartDeviceId(null);
  }, []);

  const imageDataToDataUri = useCallback(
    (imageData) => {
      clearScratchpad();
      scratchpad.ctx.putImageData(imageData, 0, 0);
      const dataUri = scratchpad.canvas.toDataURL('image/png');
      clearScratchpad();

      return dataUri;
    },
    [scratchpad, clearScratchpad],
  );

  const dataUriToImageData = useCallback(
    async (dataUri) => {
      clearScratchpad();
      const img = new Image();
      img.src = dataUri;

      await new Promise((resolve) => {
        img.onload = () => {
          scratchpad.ctx.drawImage(img, 0, 0);
          resolve();
        };
      });

      const imageData = scratchpad.ctx.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
      clearScratchpad();

      return imageData;
    },
    [clearScratchpad, scratchpad],
  );

  const getVideoAsImageData = useCallback(() => {
    clearScratchpad();
    scratchpad.ctx.drawImage(videoRef.current, 0, 0);
    const imageData = scratchpad.ctx.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height,
    );
    clearScratchpad();

    return imageData;
  }, [clearScratchpad, scratchpad]);

  useEffect(() => {
    discoverCameras().then((foundCameras) => {
      const autoStartId = window.localStorage.getItem(AUTOSTART_KEY);

      const foundDeviceId = foundCameras.reduce(
        (acc, { deviceId, label }, idx) =>
          acc ||
          (deviceId === autoStartId ||
          (!autoStartId && foundCameras.length === 1 && idx === 0) ||
          (!autoStartId && label.includes('Built-in'))
            ? deviceId
            : null),
        null,
      );

      if (foundDeviceId) {
        setAutoStartDeviceId(foundDeviceId);
      } else if (!foundDeviceId && autoStartId) clearAutoStartDeviceId();
    });
  }, []); // eslint-disable-line

  const context = useMemo(
    () => ({
      ctx,
      ready,
      flipX,
      start,
      hidden,
      cameras,
      setFlipX,
      videoRef,
      hasVideo,
      setHidden,
      canvasRef,
      stopVideo,
      setVisible,
      startVideo,
      videoError,
      scratchpad,
      clearCanvas,
      toggleFlipX,
      videoStream,
      currentDeviceId,
      stop: stopVideo,
      discoverCameras,
      autoStartDeviceId,
      imageDataToDataUri,
      dataUriToImageData,
      getVideoAsImageData,
      setAutoStartDeviceId,
      clearAutoStartDeviceId,
    }),
    [
      ctx,
      ready,
      flipX,
      start,
      hidden,
      cameras,
      setFlipX,
      setHidden,
      stopVideo,
      setVisible,
      startVideo,
      videoError,
      scratchpad,
      toggleFlipX,
      clearCanvas,
      videoStream,
      currentDeviceId,
      discoverCameras,
      autoStartDeviceId,
      imageDataToDataUri,
      dataUriToImageData,
      getVideoAsImageData,
      setAutoStartDeviceId,
      clearAutoStartDeviceId,
    ],
  );

  return <webcamContext.Provider value={context}>{children}</webcamContext.Provider>;
};

export default WebcamProvider;
