import WsContext from "../../../wsContext";
import useGetData, { Monster, Stage } from "../../management/useGetData";
import { useContext, useEffect, useState } from 'react';

interface Props {
  data: Monster,
}

function Item(props: Props) {
  const { 
    isLoading,
    data: stages, 
  } = useGetData('monsters/stages', String(props.data.id));
  const WsConnection = useContext(WsContext);

  const [sorted, setSorted] = useState<Stage[]>([]);

  useEffect(() => {
    if (stages) {
      setSorted(stages.sort((a, b) => a.hp_value < b.hp_value ? -1 : 1));
    }
  }, [stages]);

  useEffect(() => {
    if (props?.data?.id && WsConnection?.isConnected && WsConnection?.connectedSocket) {
      try {
        WsConnection?.connectedSocket.send(JSON.stringify({ 
          message: 'current',
          id: props?.data?.id,
        }));
      } catch (e) {
        console.error(e);
      }
    }
  }, [WsConnection?.connectedSocket, WsConnection?.isConnected, props?.data?.id]);

  const displayHealth = () => {
    const percentage = WsConnection?.data ? WsConnection?.data?.[props?.data?.id]?.value / WsConnection?.data?.[props?.data?.id]?.maxHealth * 100 : 0;

    for (const stage of sorted) {
      if (percentage <= stage.hp_value) {
        return (
          <img
            src={window.location.origin + '/api/avatar/' + stage.avatar_url}
            alt={props.data.name + ' Avatar'}
          />
        );
      }
    }

    return (
      <img
        src={window.location.origin + '/api/avatar/' + props.data.avatar_url}
        alt={props.data.name + ' Avatar'}
      />
    );
  }

  return (
    <>
      {!isLoading && props.data && (
        <>
        {displayHealth()}
        </>
      )}
    </>
  );
}

export default Item;
