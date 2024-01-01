
import { 
  Alert,
  AspectRatio,
  Button, Card, Center, Grid, Group, Stack, Title,
} from '@mantine/core';
import { theme } from '../../../../theme';
import useGetData, { Monster } from '../../useGetData';
import Item from '../../../display/avatars/Item';
import { BiInfoCircle } from 'react-icons/bi';
import { GrPowerReset } from 'react-icons/gr';
import classes from '../../../../css/Nav.module.css';
import { MdOutlinePause, MdPlayArrow } from 'react-icons/md';
import { RiRestartFill } from "react-icons/ri";
import Themes from '../../../display/bars/themes';
import { useContext, useEffect } from 'react';
import WsContext from '../../../../wsContext';

interface Props {
  data: Monster,
}

function Status(props: Props) {
  const WsConnection = useContext(WsContext);
  const { isLoading, data: monsters } = useGetData('monsters/base', String(props?.data?.id)); 

  useEffect(() => {
    if (WsConnection?.isConnected && WsConnection?.connectedSocket) {
      try {
        WsConnection?.connectedSocket.send(JSON.stringify({ 
          message: 'current',
          id: props?.data?.id,
        }));
      } catch (e) {
        console.error(e);
      }
    }
  }, [WsConnection?.isConnected]);
  
  return (
    <>
      {!isLoading && WsConnection?.isConnected && (
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


          <Grid>
            <Grid.Col style={{ maxWidth: '150px' }}>
              <Card.Section m={0}>
                <AspectRatio maw={150} m={0}>
                  <Item 
                    key={props?.data?.id}
                    data={monsters[0]}
                  />
                </AspectRatio>
                <AspectRatio maw={50} m={0}>
                  {props.data?.bar_theme && (
                    <Themes monster={props.data} />
                  )}
                </AspectRatio>
              </Card.Section>
            </Grid.Col>
            <Grid.Col style={{ maxWidth: '50%' }}>
              <Center>
                <Stack 
                  mb="xl" 
                  justify='center'
                >
                  <Title order={2}>
                    {props?.data?.name}
                  </Title>
                  <Title order={3}>
                    {WsConnection?.data && 'HP: ' + (WsConnection?.data?.[props?.data?.id]?.maxHealth === 0 ? 0 : (WsConnection?.data?.[props?.data?.id]?.value / WsConnection?.data?.[props?.data?.id]?.maxHealth * 100)).toFixed(0) + (WsConnection?.data?.[props?.data?.id]?.isPaused ? ' (Paused)' : '')}
                  </Title>
                </Stack>
              </Center>
            </Grid.Col>
          </Grid>


          <Group mt="md" justify='center'>
            <Button 
              variant="gradient"
              gradient={{ from: theme.colors.blue[9], to: 'indigo', deg: 90 }}
              onClick={async (e) => {
                e.preventDefault();
                if (WsConnection?.connectedSocket && props?.data?.id) {
                  WsConnection.connectedSocket.send(JSON.stringify({ 
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

            {props?.data?.relations_id && (
              <Button 
                variant="gradient"
                gradient={{ from: theme.colors.blue[9], to: 'purple', deg: 90 }}
                onClick={async (e) => {
                  e.preventDefault();
                  if (WsConnection?.connectedSocket && props?.data?.id) {
                    WsConnection.connectedSocket.send(JSON.stringify({ 
                      message: 'reset',
                      relations_id: props?.data?.relations_id,
                    }));
                  }
                }}
                leftSection={
                  <RiRestartFill   
                    size="1rem" 
                    stroke={1.5}
                  />
                }
              >
                Reset All
              </Button>
            )}

            {WsConnection?.data?.[props?.data?.id]?.isPaused === true ? (
              <Button 
                variant="gradient"
                gradient={{ from: 'grey', to: theme.colors.blue[9], deg: 90 }}
                onClick={async (e) => {
                  e.preventDefault();
                  if (WsConnection?.connectedSocket && props?.data?.id) {
                    if (props?.data?.relations_id) {
                      WsConnection.connectedSocket.send(JSON.stringify({ 
                        message: 'unpause',
                        relations_id: props?.data?.relations_id || props?.data?.id,
                      }));
                    } else {
                      WsConnection.connectedSocket.send(JSON.stringify({ 
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
                  if (WsConnection?.connectedSocket && props?.data?.id) {
                    if (props?.data?.relations_id) {
                      WsConnection.connectedSocket.send(JSON.stringify({ 
                        message: 'pause',
                        relations_id: props?.data?.relations_id || props?.data?.id,
                      }));
                    } else {
                      WsConnection.connectedSocket.send(JSON.stringify({ 
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
