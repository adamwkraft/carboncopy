import Particles from 'particlesjs';
import { hot } from 'react-hot-loader';
import { CssBaseline } from '@material-ui/core';
import React, { useEffect, useState, useRef } from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import Main from '../components/Main';
import WebcamProvider from '../context/webcam';
import BodyPixProvider from '../context/bodyPix';

const theme = createMuiTheme({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
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
          <>
            <CssBaseline />
            <Main cvReady={cvReady} />
          </>
        </BodyPixProvider>
      </WebcamProvider>
    </MuiThemeProvider>
  );
}

export default process.env.NODE_ENV === 'production' ? App : hot(module)(App);
