import { useCallback } from 'react';

function makeSound(src) {
  // Create a instance of AudioContext interface
  window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
  var context = new AudioContext();
  const source = context.createBufferSource();

  var myRequest = new Request(src);

  return fetch(myRequest)
    .then(function (response) {
      return response.arrayBuffer();
    })
    .then(function (buffer) {
      context.decodeAudioData(buffer, function (decodedData) {
        source.buffer = decodedData;
        source.connect(context.destination);
      });
      return source.start(0);
    });
}

export const useSfx = (audioRef) => {
  if (!audioRef) {
    throw new Error('audioRef is required when calling useSfx');
  }

  const play = useCallback(
    (soundName) => {
      if (!audioRef.current) return;
      return makeSound(soundName);
    },
    [audioRef],
  );

  const playSuccessSound = useCallback(
    () => play(process.env.PUBLIC_URL + '/sounds/metallic_clank.ogg'),
    [play],
  );

  const playFailureSound = useCallback(
    () => play(process.env.PUBLIC_URL + '/sounds/glass_shatter.ogg'),
    [play],
  );

  const playCameraSound = useCallback(() => play(process.env.PUBLIC_URL + '/sounds/camera.ogg'), [
    play,
  ]);

  return { playSuccessSound, playFailureSound, playCameraSound };
};
