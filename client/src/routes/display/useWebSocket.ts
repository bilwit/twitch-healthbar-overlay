import { useState, useEffect } from 'react';

interface ResponseData {
  maxHealth: number,
  value: number,
}

interface ReturnData {
  data: ResponseData,
  isConnected: boolean,
}

function useWebSocket(listenId: string): ReturnData {
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState({
    maxHealth: 100,
    value: 100,
  })

  useEffect(() => {
    let socket: any = undefined;
    if (listenId) {
      try {
        socket = new WebSocket('ws://' + window.location.hostname + ':888/ws');
  
        socket.onopen = () => {
          setIsConnected(true);
        }
  
        socket.onmessage = (event: any) => {
          const data = JSON.parse(event?.data);

          if (data?.update?.id === Number(listenId)) {
            setData(data?.update?.value);
          }
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
  }
}

export default useWebSocket;
