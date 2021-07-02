import Peer from 'peerjs';
import { useRef, useState } from 'react';
import { useMultiplayerScores } from '../components/Main';
import { useWebcam } from '../context/webcam';
import {
  getRandomId,
  makeNameOk,
  makePeerId,
  cleanPeerId
} from '../lib/peerUtils';

export const usePeerJSController = () => {
  const webcam = useWebcam();
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
  const [myName, setMyName] = useState(makeNameOk(getRandomId()));

  const isPlayerOne = () => playerOneRef.current;

  const clearMasks = () => setMasks([[], []]);

  const triggerRestart = () => {
    clearMasks();
    setOpponentClickedReset(true);
  }
  
  const resetEverything = () => {
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

    conn.on('open', (dunno) => {
      console.log('CONN: open', dunno);
      setIsConnected(true);
      setIsConnecting(false);
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
      resetEverything();
    })

    conn.on('connection', _connection => {
      console.log("CONN connection:", _connection);
    });

    conn.on('error', err => {
      console.log('CONN: error', err);
    })
  }

  const init = () => {
    const _peer = new Peer(makePeerId(myName));
    setPeer(_peer);

    _peer.on('disconnected', (id) => {
      console.log('PEER: disconnected', id)
    })

    _peer.on('close', (id) => {
      console.log('PEER: close', id)
    })

    _peer.on('open', (id) => {
      console.log('PEER: open', id);
      setId(id);
    })

    _peer.on('connection', _connection => {
      console.log("PEER: connection", _connection);
      setOpponentName(cleanPeerId(_connection.peer))
      handleConnect(_connection);
    });

    _peer.on('error', err => {
      console.log('PEER: error', err);

      // If error is that we couldn't connect, then unset the connection object
      if (err.message.includes("Could not connect to peer") ||
        err.message.includes("Called in wrong state")) {
        resetEverything();
      }
    })
  }

  const connect = (id) => {
    console.log('Connecting to peer:', id);
    const conn = peer.connect(makePeerId(id), {serialization: 'json'});
    setOpponentName(id);
    playerOneRef.current = true;
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
    init,
    connect,
    send,
    peer,
    connection,
    myName,
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
