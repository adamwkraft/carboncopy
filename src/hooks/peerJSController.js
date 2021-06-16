import Peer from 'peerjs';
import { useReducer, useRef, useState } from 'react';
import { useWebcam } from '../context/webcam';
import {
  getRandomId,
  makeNameOk,
  makePeerId,
  cleanPeerId
} from '../lib/peerUtils';

export const usePeerJSController = () => {
  const webcam = useWebcam();
  const [myName, setMyName] = useState(makeNameOk(getRandomId()));
  const [peer, setPeer] = useState(null);
  const [myId, setId] = useState(null);
  const [connection, setConnection] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const playerOneRef = useRef(false);
  const [opponentName, setOpponentName] = useState(null);
  const [masks, setMasks] = useState([[], []]);

  const isPlayerOne = () => playerOneRef.current;

  const resetEverything = () => {
    setConnection(null);
    setIsConnected(false);
    setIsConnecting(false);
    playerOneRef.current = false;
    setOpponentName(null);
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
      console.log('CONN: data:', data);
      // TODO: need to pass handler for accepting data
      if (data.eventName === 'initialMasks') {
        const imageData = await Promise.all(
          data.maskDataURIs.map((frenchFries) => webcam.dataUriToImageData(frenchFries))
        );
        setMasks((state) => {
          const playerOneMasks = playerOneRef.current ? state[0] : imageData;
          const playerTwoMasks = playerOneRef.current ? imageData : state[1];
          return [playerOneMasks, playerTwoMasks]
        });
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
    setMasks
  };
};
