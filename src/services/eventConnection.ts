import { client as WebSocketClient, connection } from 'websocket';
import EventEmitter from 'events';
import consoleLogStyling from '../utils/consoleLogStyling';

const TWITCH_EVENTSUB_ADDRESS = 'wss://eventsub.wss.twitch.tv/ws';
const TWITCH_EVENTSUB_SUBSCRIPTION = 'https://api.twitch.tv/helix/eventsub/subscriptions';

export default async function EventConnection(TwitchEmitter: EventEmitter, access_token: string, user_id: string, listener_client_id: string) {
  let connection: connection | undefined = undefined;

  const client = new WebSocketClient();
  connection = await SocketConnection(client);
  
  if (connection) {

    try {
      connection.on('message', async (message: any) => {
        const msg = JSON.parse(message?.utf8Data);
        if (msg) {
          if (msg?.metadata?.message_type) {
            switch(msg.metadata.message_type) {
              case 'session_keepalive':
                // console.log(consoleLogStyling('black', '* [EventSub] KeepAlive'));
                break;
              case 'session_welcome':
                // find and DELETE all existing subscriptions, as each new websocket connection must have a new subscription and subscriptions persist without the ability to re-use
                await getSubscriptions(access_token, listener_client_id);

                createSubscription(msg?.payload?.session?.id, access_token, user_id, listener_client_id);
                break;
              case 'notification':
                if (msg.metadata.subscription_type === 'channel.channel_points_custom_reward_redemption.add') {
                  // TO DO: check if redeem is applicable to monsters and adjust health accordingly
                  // list of available redeems & their IDs: https://dev.twitch.tv/docs/api/reference/#get-custom-reward
                  // redeem notification payload example: https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchannel_points_custom_reward_redemptionadd
                }
                break;
              default:
                console.log(msg)
                break;
            }
          } else {
            // catch PING message? 
            console.log(msg)
          }
        }
      });

      connection.on('close', async (eCode) => {
        console.log(consoleLogStyling('warning', '! [EventSub] Connection Closed'));
        if (connection) {
          console.log(consoleLogStyling('warning', `! [EventSub]    Description: ${connection.closeDescription}`));
          console.log(consoleLogStyling('warning', `! [EventSub]    Code: ${connection.closeReasonCode}`));
        }
      }); 

    } catch (e) {
      console.log(e);
    }

  }
}

function SocketConnection(client: WebSocketClient): Promise<connection> {
  return new Promise((resolve, _reject) => {
    client.connect(TWITCH_EVENTSUB_ADDRESS + '?keepalive_timeout_seconds=10');
    client.on('connect', (connection) => {
      console.log(consoleLogStyling('success', '* [EventSub] Connected to ' + TWITCH_EVENTSUB_ADDRESS));
      resolve(connection);
    });
  })
}

async function createSubscription(sessionId: string, access_token: string, user_id: string, listener_client_id: string) {
  if (sessionId && access_token && user_id && listener_client_id) {
    try {
      const response = await fetch(
        TWITCH_EVENTSUB_SUBSCRIPTION,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + access_token,
            'Client-Id': listener_client_id,
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
        if (ret?.total > 0) {
          console.log(consoleLogStyling('black', '* [EventSub] Subscribed to Channel Point Redeems'));
          return true;
        } else {
          console.log(ret);
          throw 'Could not create subscription';
        }
      }
    } catch (e) {
      console.log(consoleLogStyling('warning', '* [EventSub] Could not create subscription'));
      console.log(e);
    }
  }
}

async function getSubscriptions(access_token: string, listener_client_id: string) {
  if (access_token && listener_client_id) {
    try {
      const response = await fetch(
        TWITCH_EVENTSUB_SUBSCRIPTION,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + access_token,
            'Client-Id': listener_client_id,
          },
        }
      );
  
      if (response) {
        const ret = await response.json();
        if (ret?.total > 0 && ret?.data) {
          for (const sub of ret.data) {
            deleteSubscription(sub.id, access_token, listener_client_id);
          }
          return true;
        } else {
          return false;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
}

async function deleteSubscription(subId: string, access_token: string, listener_client_id: string) {
  if (subId && access_token && listener_client_id) {
    try {
      const response = await fetch(
        TWITCH_EVENTSUB_SUBSCRIPTION + '?id=' + subId,
        {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + access_token,
            'Client-Id': listener_client_id,
          },
        }
      );
  
      if (response) {
        return true;
      }
    } catch (e) {
      console.log(e);
    }
  }
}
