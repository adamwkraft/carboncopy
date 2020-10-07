import React from 'react';

import ScoreResults from '../../ScoreResults';
import { useGame } from '../../Game';
import { getSurvivalPaperProps } from './Survival';

const SurvivalFooter = (props) => {
  const game = useGame();
  if (!game.mode) return null;

  const { simpleGame, resultsText } = game.mode;

  return (
    !game.loop.looping && (
      <ScoreResults
        label={resultsText}
        getImageChild={null}
        results={simpleGame.scores}
        handleClose={simpleGame.clearScores}
        getPaperProps={getSurvivalPaperProps}
      />
    )
  );
};

export default SurvivalFooter;
