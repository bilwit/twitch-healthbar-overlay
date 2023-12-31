import BarBasic from "./Basic";
import CounterRaw from "./CounterRaw";
import CounterPercentage from "./CounterPercentage";
import { useContext, useEffect } from 'react';
import WsContext from "../../../../wsContext";

interface Props {
  monster: any,
}

function Themes(props: Props) {
  const WsConnection = useContext(WsContext);

  useEffect(() => {
    if (props?.monster?.id && WsConnection?.isConnected && WsConnection?.connectedSocket) {
      try {
        WsConnection?.connectedSocket.send(JSON.stringify({ 
          message: 'current',
          id: props?.monster?.id,
        }));
      } catch (e) {
        console.error(e);
      }
    }
  }, [WsConnection?.connectedSocket, WsConnection?.isConnected, props?.monster?.id]);

  const theme = (theme: string, isLoading: boolean, value: number, maxHealth: number) => {
    switch (theme) {
      default:
      case 'bar_basic':
        return (
          <BarBasic
            isLoading={isLoading}
            value={value}
            maxHealth={maxHealth}
          />
        );
      case 'counter_raw':
        return (
          <CounterRaw
            isLoading={isLoading}
            value={value}
          />
        );
      case 'counter_percentage':
        return (
          <CounterPercentage
            isLoading={isLoading}
            value={value}
            maxHealth={maxHealth}
          />
        );
    }
  }  
  
  return (
    <>
      {WsConnection?.data && theme(props.monster.bar_theme, props.monster.isLoading, WsConnection?.data?.[props?.monster?.id]?.value, WsConnection?.data?.[props?.monster?.id]?.maxHealth)}
    </>
  );
}

export default Themes;
