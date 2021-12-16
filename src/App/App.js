import Particles from 'particlesjs';
import { BrowserView, MobileView } from 'react-device-detect';
import { hot } from 'react-hot-loader';
import { CssBaseline, Typography } from '@material-ui/core';
import React, { useEffect, useState, useRef } from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {SnackbarProvider} from 'notistack';

import Main from '../components/Main';
import WebcamProvider from '../context/webcam';
import BodyPixProvider from '../context/bodyPix';
import AudioProvider from '../context/audio';
import CarbonProvider from '../context/carbon';

export const getFonts = (...fonts) =>
  [
    ...fonts,
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(',');

const theme = createMuiTheme({
  palette: {
    primary: { main: '#FFFFFF' },
    secondary: { main: '#000000' },
  },
  typography: {
    useNextVariants: true,
    fontFamily: getFonts('Orbitron'),
    body1: {
      fontWeight: 600,
      fontFamily: getFonts('Rajdhani'),
      fontSize: 18,
    },
  },
  overrides: {},
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
      <BrowserView>
        <SnackbarProvider maxSnack={3}>
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
        </SnackbarProvider>
      </BrowserView>
      <MobileView>
        <div style={{
          display: 'flex',
          width: '100vw',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Typography component="h1" variant="h6" style={{textAlign: 'center'}}>
            To play Carbon Copy, open this site on a laptop or desktop computer.
          </Typography>
        </div>
      </MobileView>
    </MuiThemeProvider>
  );
}

export default process.env.NODE_ENV === 'production' ? App : hot(module)(App);
