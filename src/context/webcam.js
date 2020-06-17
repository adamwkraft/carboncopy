import React, { createContext, useState, useMemo, useCallback, useRef, useEffect, useContext } from 'react';

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
const hasVideo = !!(navigator?.mediaDevices?.getUserMedia);

const WebcamProvider = ({children}) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [flipX, setFlipX] = useState(true);
  const [cameras, setCameras] = useState([]);
  const [videoError, setVideoError] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const [currentDeviceId, setCurrentDeviceId] = useState(null);
  const [autoStartDeviceId, _setAutoStartDeviceId] = useState(null);

  const clearCanvas = useCallback(() => {
    const context = canvasRef.current.getContext('2d');
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, []);

  const stopVideo = useCallback(() => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
    }

    setVideoError(null);
    setVideoStream(null);
    setVideoStarted(false);
    setCurrentDeviceId(null);
  }, [videoStream])

  const startVideo = useCallback(async (userConstraintsOrDeviceIdx) => {
    stopVideo();

    if (!hasVideo) {
      const message = 'Video not supported';

      console.error(message);
      setVideoError(message);

      return;
    }

    const isDeviceIdx = (typeof userConstraintsOrDeviceIdx === 'number');

    const userConstraints = (isDeviceIdx ? {} : userConstraintsOrDeviceIdx || {});
    const deviceIdx = (isDeviceIdx ? userConstraintsOrDeviceIdx : userConstraints.deviceIdx);

    try {
      console.log('Getting Webcam...');
      const constraints = {
        video: { 
          width: { 
            exact: userConstraints.width || VIDEO_WIDTH
          }, 
          height: { 
            exact: userConstraints.height || VIDEO_HEIGHT 
          } 
        },
        audio: false,
      };

      if (deviceIdx !== undefined) {
        userConstraints.deviceId = cameras[deviceIdx]?.deviceId
      }

      if (userConstraints.deviceId) {
        constraints.video.deviceId = { exact: userConstraints.deviceId }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const deviceId = stream.getTracks()[0]?.getCapabilities()?.deviceId

      console.log('Got Webcam!');
      setVideoStream(stream);
      setCurrentDeviceId(deviceId);
      videoRef.current.srcObject = stream;
    } catch (e) {
      const message = 'Error starting video.';
      console.error(message);
      console.error(e.message);
      setVideoStream(null);
      setVideoStarted(false);
      setVideoError(message);

      return;
    }

    return new Promise(resolve => {
      videoRef.current.onloadedmetadata = () => {
        setVideoStarted(true);
        resolve();
      };
    });
  }, [stopVideo, videoRef, cameras]);

  const discoverCameras = useCallback(async () => {
    const enumerateDevices = navigator?.mediaDevices?.enumerateDevices;

    if (!enumerateDevices) {
      console.error('Cannot get cameras.');

      return [];
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    const foundCameras = devices.filter(({ kind }) => kind === 'videoinput');

    setCameras(foundCameras);

    return foundCameras;
  }, []);

  const toggleFlipX = useCallback(() => setFlipX(state => !state), []);

  const setAutoStartDeviceId = useCallback((deviceId) => {
    window.localStorage.setItem(AUTOSTART_KEY, deviceId);
    _setAutoStartDeviceId(deviceId);
  }, []);

  const clearAutoStartDeviceId = useCallback(() => {
    window.localStorage.removeItem(AUTOSTART_KEY);
    _setAutoStartDeviceId(null);
  }, []);

  const imageDataToDataUri = useCallback((imageData) => {
    const ctx = canvasRef.current.getContext('2d');

    ctx.putImageData(imageData, 0, 0);
    const dataUri = canvasRef.current.toDataURL('image/png');
    clearCanvas();

    return dataUri;
  }, [clearCanvas]);

  const dataUriToImageData = useCallback(async (dataUri) => {
    const ctx = canvasRef.current.getContext('2d');

    const img = new Image();
    img.src = dataUri;
    await new Promise((resolve) => {
      img.onload = () => {
        ctx.drawImage(img,0,0);
        resolve();
      };
    });

    const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    clearCanvas();

    return imageData;
  }, [clearCanvas]);

  useEffect(() => { 
    discoverCameras()
      .then((foundCameras) => {
        const autoStartId = window.localStorage.getItem(AUTOSTART_KEY);
        _setAutoStartDeviceId(autoStartId);
        const foundCamera = !!(foundCameras.filter(({ deviceId }) => deviceId === autoStartId).length);

        if (foundCamera) startVideo({ deviceId: autoStartId });
      })
  }, []); // eslint-disable-line

  const context = useMemo(() => ({
    flipX,
    cameras,
    setFlipX,
    videoRef,
    hasVideo,
    canvasRef,
    stopVideo,
    startVideo,
    videoError,
    clearCanvas,
    toggleFlipX,
    videoStream,
    videoStarted,
    currentDeviceId,
    stop: stopVideo,
    discoverCameras,
    autoStartDeviceId,
    start: startVideo,
    imageDataToDataUri,
    dataUriToImageData,
    setAutoStartDeviceId,
    clearAutoStartDeviceId,
  }), [
      flipX,
      cameras,
      setFlipX,
      stopVideo,
      startVideo,
      videoError,
      toggleFlipX,
      clearCanvas,
      videoStream,
      videoStarted,
      setAutoStartDeviceId,
      currentDeviceId,
      discoverCameras,
      imageDataToDataUri,
      dataUriToImageData,
      clearAutoStartDeviceId,
      autoStartDeviceId,
  ]);
    
  return (
    <webcamContext.Provider value={context}>
      {children}
    </webcamContext.Provider>
  )
}

export default WebcamProvider;
