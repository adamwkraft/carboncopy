import React from 'react';

import Main from '../components/Main';
import WebcamProvider from '../context/webcam';


function App() {
  return (
    <WebcamProvider>
      <Main />
    </WebcamProvider>
  );
}

export default App;
