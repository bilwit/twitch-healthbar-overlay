import { client as WebSocketClient, connection } from 'websocket';
import EventEmitter from 'events';
import consoleLogStyling from '../utils/consoleLogStyling';

const TWITCH_EVENTSUB_ADDRESS = 'wss://eventsub.wss.twitch.tv/ws';
const TWITCH_EVENTSUB_SUBSCRIPTION = 'https://api.twitch.tv/helix/eventsub/subscriptions';

export default async function EventConnection(TwitchEmitter: EventEmitter, access_token: string, user_id: string) {
  let connection: connection | undefined = undefined;

  const client = new WebSocketClient();
  connection = await SocketConnection(client);
  
  if (connection) {

    try {
      connection.on('message', (message: any) => {
        const msg = JSON.parse(message?.utf8Data);
        if (msg) {
          if (msg?.metadata?.message_type) {
            switch(msg.metadata.message_type) {
              default:
                console.log(msg)
                break;
              case 'session_welcome':
                createSubscription(msg?.payload?.session?.id, access_token, user_id);
                break;
            }
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

function SocketConnection(client: WebSocketClient): Promise<connection> {
  return new Promise((resolve, _reject) => {
    client.connect(TWITCH_EVENTSUB_ADDRESS);
    client.on('connect', (connection) => {
      console.log(consoleLogStyling('success', '* Connected to ' + TWITCH_EVENTSUB_ADDRESS + '?keepalive_timeout_seconds=10'));
      resolve(connection);
    });
  })
}

async function createSubscription(sessionId: string, access_token: string, user_id: string) {
  if (sessionId && access_token && user_id) {
    try {
      const response = await fetch(
        TWITCH_EVENTSUB_SUBSCRIPTION,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: 'channel.channel_points_custom_reward_redemption.add',
            version: 1,
            condition: {
              broadcaster_user_id: user_id,
            },
            transport: {
              method: 'websocket',
              session_id: sessionId,
            }
          }),
        }
      );
  
      if (response) {
        const ret = await response.json();
        if (ret?.data?.status) {
          return true;
        } else {
          throw 'Could not create subscription';
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
}