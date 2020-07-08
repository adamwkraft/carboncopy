import * as bodyPix from '@tensorflow-models/body-pix';

let net = null;

export async function load() {
  net = await bodyPix.load({
    architecture: 'ResNet50', //'MobileNetV1',
    outputStride: 16,
    multiplier: 1,
    quantBytes: 4,
  });

  return true;
};

export async function predict(videoSource) {
  if (!net) {
    throw new Error('Please wait for the model to load before calling "predict"');
  }

  const segmentation = await net.segmentPerson(videoSource, {
    internalResolution: 'medium',
  });
  
  return segmentation;
};
