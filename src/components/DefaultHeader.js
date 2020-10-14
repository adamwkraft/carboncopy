import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { useGame } from '../components/Game';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(2),
  },
  heading: {
    marginBottom: theme.spacing(1),
  },
}));

const DefaultHeader = (props) => {
  const classes = useStyles();

  const game = useGame();

  const text =
    game?.screen?.state?.mode ||
    (game?.screen?.state?.screen === 'play' ? 'Choose Mode' : 'Select Players');

  return (
    <header className={classes.root}>
      <Typography component="h1" variant="h6" className={classes.heading}>
        {text}
      </Typography>
    </header>
  );
};

DefaultHeader.propTypes = {};

export default DefaultHeader;
