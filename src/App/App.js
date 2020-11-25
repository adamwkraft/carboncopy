import Particles from 'particlesjs';
import { hot } from 'react-hot-loader';
import { CssBaseline } from '@material-ui/core';
import React, { useEffect, useState, useRef } from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import primary from '@material-ui/core/colors/deepPurple';

import Main from '../components/Main';
import WebcamProvider from '../context/webcam';
import BodyPixProvider from '../context/bodyPix';
import AudioProvider from '../context/audio';
import CarbonProvider from '../context/carbon';

const theme = createMuiTheme({
  palette: {
    primary,
  },
});

function App() {
  const [cvReady, setCvReady] = useState(false);
  const particlesRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.cvReady) {
        setCvReady(true);
        clearInterval(interval);
      }
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!particlesRef.current) {
      particlesRef.current = true;
      Particles.init({
        selector: '.background',
      });
    }
  });

  return (
    <MuiThemeProvider theme={theme}>
      <WebcamProvider>
        <BodyPixProvider>
          <AudioProvider>
            <CarbonProvider>
              <>
                <CssBaseline />
                <Main cvReady={cvReady} />
              </>
            </CarbonProvider>
          </AudioProvider>
        </BodyPixProvider>
      </WebcamProvider>
    </MuiThemeProvider>
  );
}

export default process.env.NODE_ENV === 'production' ? App : hot(module)(App);
