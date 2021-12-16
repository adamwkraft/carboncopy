import Peer from 'peerjs';
import { useRef, useState, useEffect } from 'react';
import { useMultiplayerScores } from '../components/Main';
import { useWebcam } from '../context/webcam';
import { MIN_NAME_LENGTH } from '../lib/constants';
import {
  getRandomId,
  makeNameOk,
  makePeerId,
  cleanPeerId
} from '../lib/peerUtils';
import * as localStorageCache from '../lib/localStorageCache';
import { useSnack } from './snack';

export const usePeerJSController = () => {
  const reconnectRef = useRef();
  const snack = useSnack();
  const webcam = useWebcam();
  const cachedLocalStorageNames = useRef({
    name: null,
    opponentName: null,
  });
  const lastName = useRef(null);
  const opponentConnectNameCache = useRef(null);
  const playerOneRef = useRef(false);
  const [myId, setId] = useState(null);
  const [peer, setPeer] = useState(null);
  const [masks, setMasks] = useState([[], []]);
  const [connection, setConnection] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [opponentName, setOpponentName] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [, setMultiplayerScores] = useMultiplayerScores();
  const [opponentClickedReset, setOpponentClickedReset] = useState(false);
  const [myName, setMyName] = useState(null);
  const [disableConnect, setDisableConnect] = useState(false);
  const [cachedOpponentName, setCachedOpponentName] = useState('');

  const generateRandomName = () => {
    updateName(makeNameOk(getRandomId()));
  };

  useEffect(() => {
    if (myName) {
      return;
    }

    const lsCache = localStorageCache.getLocalStorage();

    const okName = makeNameOk(lsCache.name || getRandomId());
    setMyName(okName);
    cachedLocalStorageNames.current.name = lsCache.name ? makeNameOk(lsCache.name) : null;
    cachedLocalStorageNames.current.opponentName = lsCache.opponentName ? makeNameOk(lsCache.opponentName) : null;
    if (lsCache.opponentName) {
      setCachedOpponentName(cachedLocalStorageNames.current.opponentName);
    }
  }, [myName]);

  const isPlayerOne = () => playerOneRef.current;

  const clearMasks = () => setMasks([[], []]);

  const triggerRestart = () => {
    clearMasks();
    setOpponentClickedReset(true);
  }
  
  const resetEverything = () => {
    opponentConnectNameCache.current = false;
    setConnection(null);
    setIsConnected(false);
    setIsConnecting(false);
    playerOneRef.current = false;
    setOpponentName(null);
    clearMasks();
    triggerRestart();
  }

  const handleConnect = (conn, initiated = false) => {
    setConnection(conn);
    setIsConnecting(true);

    conn.on('open', () => {
      console.log('CONN: open');
      setIsConnected(true);
      setIsConnecting(false);
      if (opponentConnectNameCache.current) {
        snack.info(`You've connected to ${opponentConnectNameCache.current}!`)
      }
    });

    conn.on('data', async data => {
      switch (data.eventName) {
        case 'initialMasks':
          const imageData = await Promise.all(
            data.maskDataURIs.map(webcam.dataUriToImageData)
          );

          setMasks((state) => {
            const playerOneMasks = playerOneRef.current ? state[0] : imageData;
            const playerTwoMasks = playerOneRef.current ? imageData : state[1];
            return [playerOneMasks, playerTwoMasks]
          });
          break;
        case 'results':
          const opponentPlayerIdx = isPlayerOne() ? 1 : 0;

          setMultiplayerScores((state) => {
            const newState = [...state];
            newState[opponentPlayerIdx] = [
              ...newState[opponentPlayerIdx],
              data.results,
            ];

            return newState;
          });
          break;
        case 'restart':
          triggerRestart();
          break;
        default:
          console.log('Unknown event:', data);
          break;
      }
    });

    conn.on('disconnected', (id) => {
      console.log('CONN: Got disconnected', id)
    })

    conn.on('close', (id) => {
      console.log('CONN: close', id);
      snack.error("Uh oh, it looks like the other player has left.")
      resetEverything();
    })

    conn.on('connection', _connection => {
      console.log("CONN connection:", _connection);
    });

    conn.on('error', err => {
      console.log('CONN: error', err);
    })
  }

  const init = (newName) => {
    const _peer = new Peer(makePeerId(newName || myName));
    setPeer(_peer);

    _peer.on('disconnected', (id) => {
      console.log('PEER: disconnected', id)
    })

    _peer.on('close', (id) => {
      console.log('PEER: close', id)
    })

    _peer.on('open', (id) => {
      console.log('PEER: open', id);
      reconnectRef.current = false;
      const cleanName = cleanPeerId(id);
      if (cleanName !== lastName.current) {
        snack.info(`Listening for connections as "${cleanName}"`);
      }

      lastName.current = cleanName;
      
      setDisableConnect(false);

      if (cachedLocalStorageNames.current.name !== cleanName) {
        localStorageCache.setLocalStorageName(cleanName);
      }

      setId(id);
    })

    _peer.on('connection', _connection => {
      console.log("PEER: connection", _connection);
      const cleanOpponentName = cleanPeerId(_connection.peer);
      setOpponentName(cleanOpponentName);
      snack.info(`${cleanOpponentName} connected with you!`);
      if (cachedLocalStorageNames.current.opponentName !== cleanOpponentName) {
        localStorageCache.setLocalStorageOpponentName(cleanOpponentName);
      }

      handleConnect(_connection);
    });

    _peer.on('error', err => {
      console.log('PEER: error', err);

      if (err.message.includes('ID') && err.message.includes('is taken')) {
        const stripped = err.message
          .replace('ID', '')
          .replace('is taken', '')
          .slice(1, -1);

        const takenName = cleanPeerId(stripped);
        snack.error(`The name ${takenName} is not available.`);
        console.log('Error: Name already taken:', takenName);
        generateRandomName();
      }

      // If error is that we couldn't connect, then unset the connection object
      if (err.message.includes("Could not connect to peer") ||
        err.message.includes("Called in wrong state")) {
        
        if (err.message.includes("Could not connect to peer")) {
          const peerName = err.message.replace('Could not connect to peer ');
          const cleanPeerName = cleanPeerId(peerName);
          snack.error(`Could not find user "${cleanPeerName}"`);
        }

        resetEverything();
      }
    })
  }

  const updateName = (newName) => {
    if (!newName || newName.length < MIN_NAME_LENGTH) {
      return;
    }

    reconnectRef.current = true;

    if (peer) {
      peer.destroy();
    }
    
    const myNewName = makeNameOk(newName);
    setMyName(myNewName);
    init(myNewName);
  }

  const connect = (requestedOpponent) => {
    if (reconnectRef.current) {
      console.log('Connecting too soon after name change. Hold your horses cowboy.');

      return;
    }

    console.log('Attempting to connect to peer:', requestedOpponent);
    const conn = peer.connect(makePeerId(requestedOpponent), {serialization: 'json'});
    setOpponentName(requestedOpponent);
    playerOneRef.current = true;
    opponentConnectNameCache.current = requestedOpponent
    handleConnect(conn);
  }

  const send = (message) => {
    connection.send(message)
  }

  const sendResults = (results) => send({
    eventName: 'results',
    results,
  });

  const resetGame = () => {
    clearMasks();
    send({ eventName: 'restart' });
  };

  return {
    generateRandomName,
    cachedOpponentName,
    init,
    connect,
    send,
    peer,
    connection,
    myName,
    updateName,
    disableConnect,
    setDisableConnect,
    peerId: cleanPeerId(myId),
    isConnecting,
    isConnected,
    isPlayerOne,
    opponentName,
    masks,
    setMasks,
    sendResults,
    resetGame,
    opponentClickedReset,
    setOpponentClickedReset,
  };
};
