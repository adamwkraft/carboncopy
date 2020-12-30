import PropTypes from 'prop-types';
import React, { memo } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/styles';

import IconButton from '@material-ui/core/IconButton';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  ever: {
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
}));

const HelpDialog = ({ open, handleClose }) => {
  const classes = useStyles();

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="information"
      open={open}
      className={classes.dialogRoot}
    >
      <MuiDialogTitle disableTypography id="information">
        <Typography variant="h5">Carbon Copy Fun!</Typography>
        <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </MuiDialogTitle>
      <MuiDialogContent dividers className={classes.dialogContent}>
        <Typography component="h2" variant="h6">
          Setup
        </Typography>
        <Typography gutterBottom>
          Place your webcam so that your entire body fits within the frame, and ensure there is
          enough space around you to move safely.
        </Typography>
        <Typography gutterBottom>
          Be prepared to move side to side, forward and back, and even to jump and crouch.
        </Typography>
        <Typography component="h2" variant="h6">
          Performance
        </Typography>
        <Typography gutterBottom>
          This game relies on state-of-the-art computer vision algorithms in order to detect the
          location of your body. This requires significant compute power. Don't be afraid if you
          hear your computer making noise.
        </Typography>
        <Typography component="h2" variant="h6">
          Privacy
        </Typography>
        <Typography gutterBottom>
          Although this game requires your webcam to function, no personal images or data are
          collected by this application.
        </Typography>
      </MuiDialogContent>
    </Dialog>
  );
};

HelpDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default memo(HelpDialog);
