import { useState, useEffect } from 'react';

export interface ReturnData {
  isConnected: boolean,
  connectedSocket?: WebSocket,
  data: MonsterData,
}

export interface MonsterData {
  [key: number]: {
    maxHealth: number,
    value: number,
    isPaused: boolean,
  }
}

function useWsMonster(): ReturnData {  
  const [isConnected, setIsConnected] = useState(false);
  const [connectedSocket, setConnectedSocket] = useState<WebSocket>();
  const [data, setData] = useState<MonsterData>({});

  useEffect(() => {
    const socket = new WebSocket('ws://' + window.location.hostname + ':888/ws');

    if (socket) {
      try {  
        socket.onopen = () => {
          // for some reaosn the socket can instantiate setIsConnected(true) BUT not be ready for events, causing components that trigger events to crash
          // thus a small delay is a hack to workaround this issue for now
          setTimeout(() => {
            setIsConnected(true);
          }, 100)
        }
  
        socket.onmessage = (e: any) => {
          const data = JSON.parse(e?.data);

          if (data?.update) {
            setData((prev) => ({
              ...prev,
              [data?.update?.id]: data?.update?.value,
            }));
          }
        }
        
        setConnectedSocket(socket);
  
      } catch (err) {
        console.log(err);
      }
    }
  }, [])

  return {
    data,
    isConnected,
    connectedSocket,
  }
}

export default useWsMonster;
