import React from 'react';
import { hot } from 'react-hot-loader';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'

import Main from '../components/Main';
import WebcamProvider from '../context/webcam';

const theme = createMuiTheme({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <WebcamProvider>
        <Main />
      </WebcamProvider>
    </MuiThemeProvider>
  );
}

export default process.env.NODE_ENV === 'production' ? App : hot(module)(App);
