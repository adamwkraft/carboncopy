import { useCallback, useRef, useMemo } from 'react';

import { useSpeech } from './speech';

export const useLapTimer = () => {
  const lapTimer = useRef();
  const speech = useSpeech();

  const useTimer = useCallback(
    ({
      onBeforeStartLap,
      onLap,
      onEnd,
      maxLaps,
      lapDuration = 3000,
      postLapDelay = 1000,
      printSeconds = true,
      announceSeconds = true,
    } = {}) => {
      if (onLap && !lapTimer.current) {
        lapTimer.current = {
          onBeforeStartLap,
          onBeforeComplete: false,
          onBeforeStarted: false,
          onLap,
          onEnd,
          maxLaps,
          numLaps: 0,
          lapDuration,
          postLapDelay,
          printSeconds,
          announceSeconds,
        };
      }
    },
    [],
  );

  const handleLap = useCallback(
    async ({ time, webcam, predict, stop }) => {
      // handleLoop called useTimer
      if (lapTimer.current) {
        // if they've provided an initialization function,
        // run it and don't start the first lap until it resolves
        if (lapTimer.current.onBeforeStartLap && !lapTimer.current.onBeforeComplete) {
          if (lapTimer.current.onBeforeStarted) return;
          else {
            lapTimer.current.onBeforeStarted = true;

            await lapTimer.current.onBeforeStartLap({ time, webcam, predict, stop });
            lapTimer.current.onBeforeComplete = true;
            time.resetLapTime();
            return;
          }
        }

        if (lapTimer.current.maxLaps && lapTimer.current.numLaps === lapTimer.current.maxLaps) {
          if (lapTimer.current.onEnd) {
            await lapTimer.current.onEnd({ time, webcam, predict, stop });
          }

          lapTimer.current = null;
          return stop();
        }

        const secondsPassed = Math.floor(time.lapTime / 1000);

        // we get a single instance of -1 so set min to 0
        const countdown = Math.max(lapTimer.current.lapDuration / 1000 - secondsPassed, 0);

        // display the integer seconds remaining in the lap in the top left corner of the canvas
        if (lapTimer.current.printSeconds) {
          const { ctx } = webcam;
          ctx.font = '40px Arial';
          ctx.fillStyle = 'white';
          ctx.clearRect(0, 0, 50, 50);

          if (countdown) {
            // don't print if 0
            ctx.fillText(countdown, 10, 40);
          }
        }

        // announce the current countdown time (if not announced yet and requested)
        if (
          countdown &&
          lapTimer.current.announceSeconds &&
          lapTimer.current.lastSpeech !== countdown
        ) {
          lapTimer.current.lastSpeech = countdown;
          speech.say(`${countdown}`);
        }

        // Once we've reached the end of the lap
        // fire the provided onLap handler and set handlerCalled so we don't call it again until next lap
        if (time.lapTime >= lapTimer.current.lapDuration && !lapTimer.current.handlerCalled) {
          lapTimer.current.numLaps++;
          lapTimer.current.handlerCalled = true;
          lapTimer.current.handlerResolved = false;
          await lapTimer.current.onLap({
            time,
            webcam,
            predict,
            stop,
            lapNum: lapTimer.current.numLaps,
          });
          lapTimer.current.handlerResolved = true;
        } else if (
          time.lapTime >= lapTimer.current.lapDuration + lapTimer.current.postLapDelay &&
          lapTimer.current.handlerResolved
        ) {
          // we've already called the lap handler
          // and the handler has resolved
          // and delayed an additional amount of time
          // so we reset the lapTime and mark the handler as ready to be called again
          time.resetLapTime();
          lapTimer.current.handlerCalled = false;
          lapTimer.current.handlerResolved = false;
        }
      }
    },
    [speech],
  );

  const clear = useCallback(() => {
    lapTimer.current = null;
  }, []);

  return useMemo(
    () => ({
      clear,
      useTimer,
      handleLap,
    }),
    [clear, useTimer, handleLap],
  );
};
