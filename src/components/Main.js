import React, { useRef } from 'react'
import { useWebcam } from '../context/webcam';
import Webcam from './Webcam';
import WebcamSelect from './WebcamSelect';
import * as bodyPix from '@tensorflow-models/body-pix';
import { Button } from '@material-ui/core';
import inside from 'point-in-polygon';
import { polygonToArray, drawResult, drawResultFlipped} from '../lib/util';

const drawPolygon = (ctx, polygon) => {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.beginPath();
  ctx.moveTo(polygon[0][0], polygon[0][1]);
  const vertices = polygon.slice(1);
  vertices.forEach(([x, y]) => {
    ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();
}

const flipPolygon = (polygon, width) => polygon.map(([x, y]) => [width - x, y])


const Main = (props) => {
  const webcam = useWebcam();
  const net = useRef();
  const running = useRef();

  const makePrediction = async () => {
    const segmentation = await net.current.segmentPerson(webcam.videoRef.current);
    console.log("Segmentation!", segmentation);
    const coloredPartImage = bodyPix.toMask(segmentation);
    const opacity = 0.7;
    const maskBlurAmount = 0;

    const template = [
      [0, 0],
      [webcam?.canvasRef?.current?.width/2, 0],
      [webcam?.canvasRef?.current?.width/2, webcam?.canvasRef?.current?.height],
      [0, webcam?.canvasRef?.current?.height]];

    const flippedTemplate = flipPolygon(template, webcam?.canvasRef?.current?.width);
    
    const ctx = webcam.canvasRef.current.getContext('2d');
    // Create an array from the template.
    // const image = polygonToArray(template,
    //   webcam?.canvasRef?.current?.width,
    //   webcam?.canvasRef?.current?.height);
    const image = drawResultFlipped(
      flippedTemplate,
      segmentation)

    ctx.putImageData(image, 0, 0);

    // bodyPix.drawMask(
    //  webcam.canvasRef.current, webcam.videoRef.current, coloredPartImage, opacity, maskBlurAmount,
    //   webcam.flipX);


    // drawPolygon(ctx, template);
    // ctx.fillRect(0, 0, webcam.canvasRef.current.width/2, webcam.canvasRef.current.height);

    if (running.current) {
      requestAnimationFrame(makePrediction);
    } else{
      // Clear canvas.
      webcam.clearCanvas();
    }
  };

  const handleClickStartAButtonPressFun = async () => {
    if (!net.current) {
      net.current = await bodyPix.load();
    }
    running.current = true;
    makePrediction();
  }

  const handleClickStopAButtonPressFun = async () => {
    running.current = false;
  }

  return (
    <div>
      <div>
        <WebcamSelect />
        <Button variant='contained' onClick={handleClickStartAButtonPressFun}>Start</Button>
        <Button variant='contained' onClick={handleClickStopAButtonPressFun}>Stop</Button>
      </div>
      <Webcam width={1280} withCanvas={true} />
    </div>
  );
};

export default Main;
