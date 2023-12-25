import { 
  Image,
} from '@mantine/core';
import useGetData, { Monster, Stage } from "../../management/useGetData";
import useWebSocket from '../useWebSocket';
import { useEffect, useState } from 'react';

interface Props {
  data: Monster,
}

function Item(props: Props) {
  const { 
    isLoading, 
    data: stages, 
  } = useGetData('monsters/stages', String(props.data.id));
  const { data, connectedSocket } = useWebSocket(String(props.data.id));

  const [sorted, setSorted] = useState<Stage[]>([]);

  useEffect(() => {
    if (stages) {
      setSorted(stages.sort((a, b) => a.hp_value < b.hp_value ? -1 : 1));
    }
  }, [stages])

  useEffect(() => {
    return () => {
      if (connectedSocket) {
        connectedSocket.close();
      }
    }
  }, [connectedSocket]);

  const displayHealth =  (value: number, maxHealth: number) => {
    const percentage = value / maxHealth * 100;

    for (const stage of sorted) {
      if (percentage <= stage.hp_value) {
        return (
          <Image
            src={window.location.origin + '/api/avatar/' + stage.avatar_url}
            alt={props.data.name + ' Avatar'}
          />
        );
      }
    }

    return (
      <Image
        src={window.location.origin + '/api/avatar/' + props.data.avatar_url}
        alt={props.data.name + ' Avatar'}
      />
    );
  }

  return (
    <>
      {!isLoading && props.data && (
        <>
        {displayHealth(data.value, data.maxHealth)}
        </>
      )}
    </>
  );
}

export default Item;
