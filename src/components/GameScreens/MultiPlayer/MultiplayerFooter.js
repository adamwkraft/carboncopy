import React from 'react';
import { makeStyles } from '@material-ui/core';

import ScoreResults from '../../ScoreResults';
import { useGame } from '../../Game';

const useStyles = makeStyles((theme) => ({
  root: ({ isFullScreen }) => ({
    minWidth: isFullScreen ? '50%' : 'auto',
    '& > div:first-of-type': {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  }),
}));

const MultiplayerFooter = (props) => {
  const game = useGame();
  const classes = useStyles(props);

  if (!game.mode) return null;
  const { simpleGame, multiplayerResultsText } = game.mode;

  return (
    !game.loop.looping && (
      <div className={classes.root}>
        <ScoreResults label={multiplayerResultsText[0]} results={simpleGame.multiplayerScores[0]} />
        <ScoreResults label={multiplayerResultsText[1]} results={simpleGame.multiplayerScores[1]} />
      </div>
    )
  );
};

export default MultiplayerFooter;
