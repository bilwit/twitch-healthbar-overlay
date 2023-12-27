
import { 
  Alert,
  AspectRatio,
  Button, Card, Center, Group, Stack, Title,
} from '@mantine/core';
import useWebSocket from '../../../display/useWebSocket';
import { theme } from '../../../../theme';
import useGetData, { Monster } from '../../useGetData';
import Item from '../../../display/avatars/Item';
import { BiInfoCircle } from 'react-icons/bi';
import { GrPowerReset } from 'react-icons/gr';
import classes from '../../../../css/Nav.module.css';
import { useEffect } from 'react';
import { MdOutlinePause, MdPlayArrow } from 'react-icons/md';
import { theme as bars } from '../../../display/theme';

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
          >
            Manage and visualize the avatar and bar overlays.
          </Alert>
 
          <AspectRatio ratio={1080 / 720} maw={300} mx="auto">
            <Item 
              key={props?.data?.id}
              data={monsters[0]}
            />
          </AspectRatio>
        
          <AspectRatio ratio={1080 / 720} maw={300} mx="auto">
            {props.data?.bar_theme && bars(props.data?.bar_theme, isLoading, data.value, data.maxHealth)}
          </AspectRatio>

          <Card>
            <Center>
              <Stack 
                mb="xl" 
                justify='center'
              >
                <Title order={1}>
                  {'HP: ' + (data.value / data.maxHealth * 100) + '%' + (data.isPaused ? ' (Paused)' : '')}
                </Title>
              </Stack>
            </Center>
          </Card>

          <Group mt="md">
            <Button 
              variant="gradient"
              gradient={{ from: theme.colors.blue[9], to: 'indigo', deg: 90 }}
              onClick={async (e) => {
                e.preventDefault();
                if (connectedSocket && props?.data?.id) {
                  connectedSocket.send(JSON.stringify({ 
                    message: 'reset',
                    id: props?.data?.id,
                  }));
                }
              }}
              leftSection={
                <GrPowerReset  
                  size="1rem" 
                  stroke={1.5}
                />
              }
            >
              Reset Health
            </Button>

            {data?.isPaused ? (
              <Button 
                variant="gradient"
                gradient={{ from: 'grey', to: theme.colors.blue[9], deg: 90 }}
                onClick={async (e) => {
                  e.preventDefault();
                  if (connectedSocket && props?.data?.id) {
                    if (props?.data?.relations_id) {
                      connectedSocket.send(JSON.stringify({ 
                        message: 'unpause',
                        relations_id: props?.data?.relations_id || props?.data?.id,
                      }));
                    } else {
                      connectedSocket.send(JSON.stringify({ 
                        message: 'unpause',
                        id: props?.data?.id,
                      }));
                    }
                  }
                }}
                leftSection={
                  <MdPlayArrow   
                    size="1rem" 
                    stroke={1.5}
                  />
                }
              >
                Play
              </Button>
            ) : (
              <Button 
                variant="gradient"
                gradient={{ from: theme.colors.blue[9], to: 'grey', deg: 90 }}
                onClick={async (e) => {
                  e.preventDefault();
                  if (connectedSocket && props?.data?.id) {
                    if (props?.data?.relations_id) {
                      connectedSocket.send(JSON.stringify({ 
                        message: 'pause',
                        relations_id: props?.data?.relations_id || props?.data?.id,
                      }));
                    } else {
                      connectedSocket.send(JSON.stringify({ 
                        message: 'pause',
                        id: props?.data?.id,
                      }));
                    }
                  }
                }}
                leftSection={
                  <MdOutlinePause   
                    size="1rem" 
                    stroke={1.5}
                  />
                }
              >
                Pause
              </Button>
            )}

          </Group>
        </>
      )}
    </>
  );
}

export default Status;
