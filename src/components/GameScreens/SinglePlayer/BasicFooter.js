import React from 'react';

import { useGame } from '../../Game';
import ScoreResults from '../../ScoreResults';
import CapturedMasks from '../../CapturedMasks';

const BasicFooter = (props) => {
  const game = useGame();

  if (!game.mode) return null;

  const { simpleGame, captureMasks, handlePlayCapturedMasks, resultsText, name } = game.mode;

  const showResults = name === 'time attack' ? !game.loop.looping : true;

  return (
    <>
      {showResults && (
        <ScoreResults
          label={resultsText}
          results={simpleGame.scores}
          handleClose={simpleGame.clearScores}
        />
      )}
      {captureMasks && (
        <CapturedMasks captureMasks={captureMasks} handlePlay={handlePlayCapturedMasks} />
      )}
    </>
  );
};

export default BasicFooter;
