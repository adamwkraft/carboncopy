import hexToRGB from 'hex-rgb';

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

export const scoreToColor = (score, alpha) => {
  // Returns a hex color value from reg to green based on score from 0-100
  // Using from: https://gist.github.com/mlocati/7210513
  var r,
    g,
    b = 0;
  if (score < 50) {
    r = 255;
    g = Math.round(5.1 * score);
  } else {
    g = 255;
    r = Math.round(510 - 5.1 * score);
  }
  var h = r * 0x10000 + g * 0x100 + b * 0x1;
  const hex = '#' + ('000000' + h.toString(16)).slice(-6);

  if (alpha) {
    const { red, green, blue } = hexToRGB(hex);

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  return hex;
};

export const rawScoreToColor = (score, alpha) =>
  scoreToColor(tenBinScoreToPercent(rawScoreToTenBinScore(score)), alpha);
