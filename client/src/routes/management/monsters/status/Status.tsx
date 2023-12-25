
import { 
  Alert,
  AspectRatio,
  Button, Card, Center, Stack, Title,
} from '@mantine/core';
import useWebSocket from '../../../display/useWebSocket';
import { theme } from '../../../../theme';
import useGetData, { Monster } from '../../useGetData';
import Item from '../../../display/avatars/Item';
import Basic from '../../../display/bars/themes/Basic';
import { BiInfoCircle } from 'react-icons/bi';
import classes from '../../../../css/Nav.module.css';
import { useEffect } from 'react';

interface Props {
  data?: Monster,
}

function Status(props: Props) {
  const { data, isConnected, connectedSocket } = useWebSocket(String(props?.data?.id));
  
  const { isLoading, data: monsters } = useGetData('monsters/base', String(props?.data?.id));
  
  useEffect(() => {
    return () => {
      if (connectedSocket) {
        connectedSocket.close();
      }
    }
  }, [connectedSocket]);
  
  return (
    <>
      {!isLoading && isConnected && (
        <>
          <Alert 
            className={classes['margin-bottom-1']}
            variant="light" 
            color="indigo" 
            title="Preview" 
            icon={
              <BiInfoCircle 
                size="1rem" 
                stroke={1.5} 
              />
            }
          />

          <AspectRatio ratio={1080 / 720} maw={300} mx="auto">
            <Item 
              key={props?.data?.id}
              data={monsters[0]}
            />
          </AspectRatio>
        
          <AspectRatio ratio={1080 / 720} maw={300} mx="auto">
            <Basic
              isLoading={isLoading}
              value={data.value}
              maxHealth={data.maxHealth}
            />
          </AspectRatio>

          <Card>
            <Center>
              <Stack 
                mb="xl" 
                justify='center'
              >
                <Title order={1}>
                  {'HP: ' + (data.value / data.maxHealth * 100) + '%'}
                </Title>
              </Stack>
            </Center>
          </Card>

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
