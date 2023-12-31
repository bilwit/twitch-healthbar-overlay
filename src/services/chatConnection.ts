import { client as WebSocketClient, connection } from 'websocket';
import dotenv from 'dotenv';
import EventEmitter from 'events';
import auth, { validate } from '../utils/chatConnection/authChat';
import { PrismaClient } from '@prisma/client';
import consoleLogStyling from '../utils/consoleLogStyling';
import parser from '../utils/chatConnection/parser';
import getMonsters, { Monster_CB, getMonster } from './monsters';
import { fetchChatters } from '../utils/chatConnection/fetchChatters';
import EventConnection from './eventConnection';

const TWITCH_IRC_ADDRESS = 'ws://irc-ws.chat.twitch.tv:80';

dotenv.config();

export default async function ChatConnection (db: PrismaClient) {
  try {
    const settings = await db.settings.findFirst({
      select: {
        listener_auth_code: true,
        listener_client_id: true,
        listener_secret: true,
        listener_user_name: true,
        channel_name: true,
        is_connected: true,
      },
    })
    if (settings) {
      // authenticate
      const tokens = await auth('', settings, db);

      let user_id = '';
      if (tokens?.access_token) {
        user_id = await validate(tokens?.access_token);
      }

      if (tokens && tokens?.access_token && tokens?.refresh_token && user_id) {
        return (TwitchEmitter: EventEmitter) => {
          let connection: connection | undefined = undefined;

          TwitchEmitter.on('getStatus', () => {
            TwitchEmitter.emit('status', connection ? true : false);
          });

          TwitchEmitter.on('disconnect', () => {
            if (connection) {
              connection.close(1001);
              connection = undefined;
            }
          });

          TwitchEmitter.on('connect', async () => {
            const client = new WebSocketClient();
            connection = await SocketConnection(client);
            
            if (connection) {
              // subscribe to Twitch EventSub to listen for channel point redeem events
              EventConnection(TwitchEmitter, tokens.access_token, user_id, settings.listener_client_id);
              
              // authenticate
              // connection.sendUTF('CAP REQ :twitch.tv/membership'); // track chatters on join/leave -- it doesn't give you the initial list of chatters & massive delay on join/leave
              connection.sendUTF('PASS oauth:' + tokens.access_token);
              connection.sendUTF('NICK ' + settings.listener_user_name);   
      
              connection.sendUTF('JOIN #' + settings.channel_name);
      
              connection.on('error', (error) => {
                console.log(consoleLogStyling('error', '! [IRC] Connection Error: ' + error.toString()));
              });
      
              connection.on('close', async (eCode) => {
                console.log(consoleLogStyling('warning', '! [IRC] Connection Closed'));
                if (eCode === 1006) {
                  const d = await db.refresh_token.deleteMany();
                  console.log(d)
                }

                if (connection) {
                  console.log(consoleLogStyling('warning', `! [IRC]    Description: ${connection.closeDescription}`));
                  console.log(consoleLogStyling('warning', `! [IRC]    Code: ${connection.closeReasonCode}`));
                }
              }); 
      
              try {
                // initial max health for viewer-scaled hp monster types
                let MaxHealthScaled = (await fetchChatters(tokens, user_id, settings.listener_client_id));
      
                // update MaxHealthScaled every 15s according to viewer count
                setInterval(async () => {
                  try {
                    const MaxHealthScaledUpdated = (await fetchChatters(tokens, user_id, settings.listener_client_id));
                    if (MaxHealthScaled !== MaxHealthScaledUpdated) {
                      MaxHealthScaled = MaxHealthScaledUpdated;
                      console.log(consoleLogStyling('health', '[IRC] Updated Chatters: ' + MaxHealthScaledUpdated));
                    }
                  } catch (e) {
                    console.log(consoleLogStyling('warning', '! [IRC]  Could not update Max Health'));
                  }
                }, 15000);
      
                const monsters: Map<number, Monster_CB> = await getMonsters(TwitchEmitter, db);

                TwitchEmitter.on('publish', async (data) => {
                  if (data.status === true) {
                    const addedMonster: Monster_CB | null = await getMonster(data.id, TwitchEmitter, db);
                    if (addedMonster) {
                      monsters.set(Number(data.id), addedMonster) ;
                      console.log(consoleLogStyling('health', '[IRC] (' + data.id + ')' + ' Monster Added'));
                    }
                  }
                  if (data.status === false) {
                    monsters.delete(Number(data.id));
                    console.log(consoleLogStyling('health', '[IRC] (' + data.id + ')' + ' Monster Disabled'));
                  }
                })
          
                connection.on('message', (message) => {
                  const parsed = parser(message, settings.channel_name);
      
                  if (parsed) {
                    switch (parsed.command.command) {
                      case 'PING': // keepalive
                        console.log(consoleLogStyling('black', '* [IRC] KeepAlive'));
                        if (connection) {
                          connection.sendUTF('PONG ' + parsed.parameters);
                        }
                        break;
                      case 'PRIVMSG': // chatter message
                        if (monsters.size > 0) {
                          for (let [_key, monster] of monsters) {
                            updateMonster(parsed.parameters, monster.trigger_words, monster, MaxHealthScaled);
                          }
                        }
                        break;
                      default:
                        break;
                    }
                  }
                });
              } catch (e) {
                console.log(consoleLogStyling('error', '! [IRC] Error: ' + e));
              }

              // validate every hour as per TOS
              setInterval(async () => {
                const isValidated = await validate(tokens.access_token);
                if (!isValidated) {
                  console.log(consoleLogStyling('warning', '! [IRC] Access token expired'));
                  // get new tokens if invalid
                  const newTokens = await auth(tokens.BroadcasterId, settings, db);
                  console.log(consoleLogStyling('success', '* [IRC] New tokens issued'));
                  tokens.access_token = newTokens.access_token;
                  tokens.refresh_token = newTokens.refresh_token;
        
                  // reconnect client
                  client.connect(TWITCH_IRC_ADDRESS);
                } else {
                  console.log(consoleLogStyling('black', '! [IRC] Token validated'));
                }
              }, 60*60*1000-100);

            }

          });
        }
      } else {
        throw new Error('Could not authenticate');
      }
    } else {
      throw new Error('No authentication settings');
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function updateMonster(parameters: any, trigger_words: string, monster: Monster_CB, MaxHealth: any) {
  const numOfTriggers = checkTriggerWords(parameters, trigger_words);
  if (numOfTriggers > 0) {
    monster.update(-numOfTriggers, MaxHealth);
  }
}

function SocketConnection(client: WebSocketClient): Promise<connection> {
  return new Promise((resolve, _reject) => {
    client.connect(TWITCH_IRC_ADDRESS);
    client.on('connect', (connection) => {
      console.log(consoleLogStyling('success', '* [IRC] Connected to ' + TWITCH_IRC_ADDRESS));
      resolve(connection);
    });
  })
}

// counts the amount of times trigger words are found in the message
function checkTriggerWords (message: string, triggerWords: string): number {
  const triggers = triggerWords.trim().split(',');
  let triggerCount = 0;

  for (const trigger of triggers) {
    const triggerFound = message.split(trigger).length-1;
    if (triggerFound > 0) {
      triggerCount += triggerFound;
    }
  }
  if (triggerCount > 0) {
    return triggerCount;
  }
  return 0;
}
