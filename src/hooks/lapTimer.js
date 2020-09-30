import { useCallback, useRef, useMemo } from 'react';
import { useAudio } from '../context/audio';
import { scoreToColor } from '../lib/score';

const initialColor = scoreToColor(100);

export const useLapTimer = () => {
  const lapTimer = useRef();
  const {
    handlers: { speech },
  } = useAudio();

  const useTimer = useCallback(
    ({
      onBeforeStartLap,
      onLap,
      onEnd,
      maxLaps,
      setLapTimeInfo,
      lapDuration = 3000,
      postLapDelay = 1000,
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
          setLapTimeInfo,
          announceSeconds,
        };
        if (setLapTimeInfo) {
          const lapInfo = {
            percent: 0.0,
            percentRemaining: 100.0,
            color: initialColor,
            secondsRemaining: lapDuration,
          };
          lapTimer.current.setLapTimeInfo(lapInfo);
        }
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

        const secondsPassed = Math.floor(time.lapTime / 100) / 10;

        // we get a single instance of -1 so set min to 0
        const countdown = +Math.max(lapTimer.current.lapDuration / 1000 - secondsPassed, 0).toFixed(
          1,
        );

        if (lapTimer.current.setLapTimeInfo) {
          const percentRemaining = (Number(countdown) / lapTimer.current.lapDuration) * 100000;
          const percent = 100 - percentRemaining;
          const color = scoreToColor(percentRemaining);
          const secondsRemaining = countdown.toFixed(1);
          const lapInfo = {
            percent,
            percentRemaining,
            color,
            secondsRemaining,
          };
          lapTimer.current.setLapTimeInfo(lapInfo);
        }

        // announce the current countdown time (if not announced yet and requested)
        if (
          countdown &&
          lapTimer.current.announceSeconds &&
          lapTimer.current.lastSpeech !== countdown &&
          parseInt(countdown, 10) === Number(countdown) // only speak ints
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
      timerRef: lapTimer,
    }),
    [clear, useTimer, handleLap, lapTimer],
  );
};
