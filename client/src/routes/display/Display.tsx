import { 
  Image, MantineProvider
} from '@mantine/core';

import { useParams } from "react-router-dom";
import useGetMonsters from "../management/monsters/useGetMonsters";

function Display() {
  const params = useParams();
  const { isLoading, monsters } = useGetMonsters(params?.['*']);

  return (
    <MantineProvider>
      {!isLoading && monsters && monsters.length === 1 && (
        <Image
          src={window.location.origin + '/api/monsters/avatar/' + monsters[0]?.avatar_url}
          alt={monsters[0].name + ' Avatar'}
        />
      )}
    </MantineProvider>
  );
}

export default Display;
