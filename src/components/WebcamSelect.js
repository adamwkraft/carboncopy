import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import React, { useMemo, useCallback } from 'react';

import SelectAndCheck from './SelectAndCheck';
import { useWebcam } from '../context/webcam';

const useStyles = makeStyles((theme) => ({
  root: (props) => ({}),
}));

const WebcamSelect = (props) => {
  const webcam = useWebcam();
  const classes = useStyles({ ...props, ...webcam });

  const selectedCamera = useMemo(() => {
    let _selectedCamera = { deviceId: null, label: null, none: true };

    if (!webcam.currentDeviceId) {
      return _selectedCamera;
    }

    webcam.cameras.some((camera) => {
      if (camera.deviceId === webcam.currentDeviceId) {
        _selectedCamera = camera;

        return true;
      }

      return false;
    });

    return _selectedCamera;
  }, [webcam.cameras, webcam.currentDeviceId]);

  const handleSelectCamera = useCallback(
    (deviceId) => {
      if (webcam.currentDeviceId !== deviceId) {
        webcam.startVideo({ deviceId });
      }
    },
    [webcam],
  );

  const handleSetDefaultCamera = useCallback(
    (deviceId) => {
      if (webcam.autoStartDeviceId === deviceId) {
        webcam.clearAutoStartDeviceId();
      } else {
        webcam.setAutoStartDeviceId(deviceId);
        handleSelectCamera(deviceId);
      }
    },
    [webcam, handleSelectCamera],
  );

  return (
    <div className={classes.root}>
      <SelectAndCheck
        activeTitle="Select Camera"
        title={
          webcam.cameras?.length
            ? selectedCamera.label || 'No Camera Selected'
            : 'No Cameras Detected'
        }
        onSelect={handleSelectCamera}
        onClickCheckbox={handleSetDefaultCamera}
        options={webcam.cameras.map((camera) => ({
          key: camera.label,
          value: camera.deviceId,
          text: camera.label || 'Unknown Device',
          selected: camera.deviceId === webcam.currentDeviceId,
          checked: webcam.autoStartDeviceId === camera.deviceId,
          tooltipTitle:
            webcam.autoStartDeviceId === camera.deviceId ? 'Remove Default' : 'Set Default',
        }))}
      />
    </div>
  );
};

WebcamSelect.propTypes = {
  styles: PropTypes.object,
};

export default WebcamSelect;
