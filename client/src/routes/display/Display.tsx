import { 
  MantineProvider
} from '@mantine/core';

import { useParams } from "react-router-dom";
import useGetData from "../management/useGetData";
import useWebSocket from './useWebSocket';
import Basic from './bars/Basic';

function Display() {
  const params = useParams();
  const { isLoading, data: monsters } = useGetData('monsters', params?.['*']);

  const { data } = useWebSocket(String(monsters?.[0]?.id));

  return (
    <MantineProvider>
      {!isLoading && monsters && monsters.length === 1 && (
        <Basic
          isLoading={isLoading}
          value={data.value}
          maxHealth={data.maxHealth}
        />
      )}
    </MantineProvider>
  );
}

export default Display;
