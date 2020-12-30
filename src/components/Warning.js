import PropTypes from 'prop-types';
import React, { memo } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/styles';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  title: {
    color: 'red',
    fontStyle: 'italic',
  },
  actions: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  dialogContent: {
    fontStyle: 24,
  },
  group: {
    marginTop: theme.spacing(2),
  },
}));

const Warning = ({ open, handleClose }) => {
  const classes = useStyles();

  return (
    <Dialog aria-labelledby="warning" open={open}>
      <MuiDialogTitle disableTypography id="warning" className={classes.title}>
        <Typography variant="h5">Warning!</Typography>
      </MuiDialogTitle>
      <MuiDialogContent dividers className={classes.dialogContent}>
        <Typography component="h2" variant="h6">
          physically demanding
        </Typography>
        <Typography gutterBottom>
          Be careful when moving. Consider consulting a medical professional before playing.
        </Typography>
        <div className={classes.group}>
          <Typography component="h2" variant="h6">
            Large Space Required
          </Typography>
          <Typography gutterBottom>
            Ensure that you have a large open playing area that will allow you to move around
            safely.
          </Typography>
        </div>
      </MuiDialogContent>
      <DialogActions className={classes.actions}>
        <Button color="secondary" onClick={handleClose} variant="contained">
          Acknowledge
        </Button>
      </DialogActions>
    </Dialog>
  );
};

Warning.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default memo(Warning);
