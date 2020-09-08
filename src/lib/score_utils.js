export const rawScoreToTenBinScore = (score) => {
  // Takes in score from [0-100] and returns score [1-10]
  const lowThresh = 25;
  const highThresh = 88;
  const p = (score - lowThresh) / (highThresh - lowThresh);
  return Math.max(1, Math.min(10, Math.round(p * 10)));
};

export const tenBinScoreToPercent = (score) => {
  return (score / 10) * 100;
};
