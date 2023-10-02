import { 
  Image, MantineProvider
} from '@mantine/core';

import { useParams } from "react-router-dom";
import useGetMonsters from "../management/monsters/useGetMonsters";
import useWebSocket, { ReadyState } from 'react-use-websocket';

function Display() {
  const params = useParams();
  const { isLoading, monsters } = useGetMonsters(params?.['*']);

  const { lastJsonMessage } = useWebSocket('ws://' + window.location.hostname + ':888/ws');

  console.log(lastJsonMessage)

  return (
    <MantineProvider>
      {!isLoading && monsters && monsters.length === 1 && (
        <Image
          src={window.location.origin + '/api/avatar/' + monsters[0]?.avatar_url}
          alt={monsters[0].name + ' Avatar'}
        />
      )}
    </MantineProvider>
  );
}

export default Display;
