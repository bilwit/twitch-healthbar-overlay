
import { 
  Button, Stack, Title,
} from '@mantine/core';
import useWebSocket from '../../../display/useWebSocket';
import { theme } from '../../../../theme';
import useGetData, { Monster } from '../../useGetData';
import Item from '../../../display/avatars/Item';
import Basic from '../../../display/bars/themes/Basic';

interface Props {
  data?: Monster,
}

function Status(props: Props) {
  const { data, isConnected, connectedSocket } = useWebSocket(String(props?.data?.id));
  
  const { isLoading, data: monsters } = useGetData('monsters/base', String(props?.data?.id));
  
  return (
    <>
      {!isLoading && isConnected && (
        <>
          <Item 
            key={props?.data?.id}
            data={monsters[0]}
          />
        
          <Basic
            isLoading={isLoading}
            value={data.value}
            maxHealth={data.maxHealth}
          />

          <div style={{ display: 'flex' }}>
            <Stack 
              mb="xl" 
              justify='center'
            >
              <Title order={1}>
                {'HP: ' + (data.value / data.maxHealth * 100) + '%'}
              </Title>
            </Stack>
          </div>

          <Stack>
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
          </Stack>
        </>
      )}
    </>
  );
}

export default Status;
