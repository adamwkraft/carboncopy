import React, { useCallback } from 'react'
import Button from '@material-ui/core/Button';

import Webcam from './Webcam';
import WebcamSelect from './WebcamSelect';

import { useBodyPix } from '../hooks/bodyPix';

const Main = (props) => {
  const bodyPix = useBodyPix();

  const handleClickStartStop = useCallback(async () => (bodyPix.running
    ? bodyPix.stop()
    : bodyPix.start()
  ), [bodyPix]);

  return (
    <div>
      <div>
        <WebcamSelect />
        <Button
          color={ bodyPix.running ? 'secondary' : 'primary' }
          variant='contained'
          disabled={!bodyPix.ready}
          onClick={handleClickStartStop}
        >
          { bodyPix.running ? 'Stop' : 'Start' }
        </Button>
      </div>
      <Webcam width={1280} />
    </div>
  );
};

export default Main;
