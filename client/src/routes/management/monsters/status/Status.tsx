
import { 
  Button,
} from '@mantine/core';
import useWebSocket from '../../../display/useWebSocket';
import { theme } from '../../../../theme';
import { Monster } from '../../useGetData';

interface Props {
  data?: Monster,
}

function Status(props: Props) {
  const { data, isConnected, connectedSocket } = useWebSocket(String(props?.data?.id));
  
  return (
    <>
      {isConnected && (
        <>
          {(data.value / data.maxHealth * 100) + '%'}
          <Button 
            variant="gradient"
            gradient={{ from: theme.colors.blue[9], to: 'green', deg: 90 }}
            onClick={async (e) => {
              e.preventDefault();
              if (connectedSocket && props?.data?.id) {
                connectedSocket.send(JSON.stringify({ 
                  message: 'reset',
                  id: props?.data?.id,
                }));
              }
            }}
          >
            Reset Health
          </Button>
        </>
      )}
    </>
  );
}

export default Status;
