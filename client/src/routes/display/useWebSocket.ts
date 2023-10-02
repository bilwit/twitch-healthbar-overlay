import { useState, useEffect } from 'react';

interface ResponseData {
  maxHealth: number,
  value: number,
}

interface ReturnData {
  data: ResponseData,
  isConnected: boolean,
  connectedSocket?: WebSocket,
}

function useWebSocket(listenId: string): ReturnData {
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState({
    maxHealth: 100,
    value: 100,
  });
  const [connectedSocket, setConnectedSocket] = useState<WebSocket>();


  useEffect(() => {
    let socket: WebSocket | undefined = undefined;
    if (listenId) {
      try {
        socket = new WebSocket('ws://' + window.location.hostname + ':888/ws');
  
        if (socket) {
          socket.onopen = () => {
            setIsConnected(true);
          }
    
          socket.onmessage = (event: any) => {
            const data = JSON.parse(event?.data);
  
            if (data?.update?.id === Number(listenId)) {
              setData(data?.update?.value);
            }
          }
  
          setConnectedSocket(socket);

        }
  
      } catch (err) {
        console.log(err);
      }
    }

    return () => {
      if (socket) {
        socket.close();
      }
    }
  }, [listenId])

  return {
    data,
    isConnected,
    connectedSocket,
  }
}

export default useWebSocket;
