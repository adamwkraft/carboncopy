import React, { useMemo } from 'react';
import { useGame } from '../../Game';
import ScoreResults from '../../ScoreResults';
import CapturedMasks from '../../CapturedMasks';
import { tenBinScoreToColor } from '../../../lib/score';

const BasicFooter = (props) => {
  const game = useGame();

  const showTimeAttackResults = useMemo(
    () =>
      game?.mode?.name === 'time attack'
        ? {
            getPaperProps: ({ score }) => ({
              style: { background: tenBinScoreToColor(Math.max(10.5 - score, 0), 0.4) },
            }),
          }
        : {},
    [game],
  );

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
          {...showTimeAttackResults}
        />
      )}
      {captureMasks && (
        <CapturedMasks captureMasks={captureMasks} handlePlay={handlePlayCapturedMasks} />
      )}
    </>
  );
};

export default BasicFooter;
