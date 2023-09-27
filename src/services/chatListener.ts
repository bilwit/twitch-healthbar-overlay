import { client as WebSocketClient } from 'websocket';
import dotenv from 'dotenv';
import EventEmitter from 'events';
import auth, { validate } from './auth';
import parser from './parser';
import consoleLogStyling from '../utils/consoleLogStyling';
import { Settings, fetchChatters } from '../utils/twitch';
import getMonsters, { Monster_CB } from './monsters';

const TWITCH_IRC_ADDRESS = 'ws://irc-ws.chat.twitch.tv:80';

dotenv.config();

export default async function chatListener (e: EventEmitter, settings: Settings) {
  try {
    // authenticate
    const tokens = await auth('', settings);

    const user_id = await validate(tokens.access_token);

    if (tokens?.access_token && tokens?.refresh_token && user_id) {

      const client = new WebSocketClient();

      // Register our event handlers (defined below)
      client.on('connect', async (connection) => {
        
        console.log(consoleLogStyling('success', '* Connected to ' + TWITCH_IRC_ADDRESS));

        // authenticate
        // connection.sendUTF('CAP REQ :twitch.tv/membership'); // track chatters on join/leave -- it doesn't give you the initial list of chatters & massive delay on join/leave
        connection.sendUTF('PASS oauth:' + tokens.access_token);
        connection.sendUTF('NICK ' + settings.listener_user_name);   

        connection.sendUTF('JOIN #billywhitmore');

        connection.on('error', (error) => {
          console.log(consoleLogStyling('error', '! Connection Error: ' + error.toString()));
        });

        connection.on('close', () => {
          console.log(consoleLogStyling('warning', '! Connection Closed'));
          console.log(consoleLogStyling('warning', `!   Description: ${connection.closeDescription}`));
          console.log(consoleLogStyling('warning', `!   Code: ${connection.closeReasonCode}`));
        });

        try {
          // initial MaxHealth
          let MaxHealth = (await fetchChatters(tokens, user_id, settings.listener_client_id));

          setInterval(async () => {
            try {
              const MaxHealthUpdated = (await fetchChatters(tokens, user_id, settings.listener_client_id));
              if (MaxHealth !== MaxHealthUpdated) {
                MaxHealth = MaxHealthUpdated;
                console.log(consoleLogStyling('health', 'Updated Max Health: ' + MaxHealthUpdated));
              }
            } catch (e) {
              console.log(consoleLogStyling('warning', '! Could not update Max Health'));
            }
          }, 15000);

          const monsters: Monster_CB[] = await getMonsters(MaxHealth);
    
          connection.on('message', (message) => {
            const parsed = parser(message);

            if (parsed) {
              switch (parsed.command.command) {
                case 'PING': // keepalive
                  console.log(consoleLogStyling('black', '* KeepAlive'));
                  connection.sendUTF('PONG ' + parsed.parameters);
                  break;
                case 'PRIVMSG': // chatter message
                  if (monsters.length > 0) {
                    for (const monster of monsters) {
                      const numOfTriggers = checkTriggerWords(parsed.parameters, monster.trigger_words);
                      if (numOfTriggers > 0) {
                        monster.update(-numOfTriggers, MaxHealth);
                      }
                    }
                  }
                  break;
                default:
                  break;
              }
            }
          });
        } catch (e) {
          console.log(consoleLogStyling('error', '! Error: ' + e));
        }
      });

      // Connect to Twitch:
      client.connect(TWITCH_IRC_ADDRESS);

      // validate every hour as per TOS
      setInterval(async () => {
        const isValidated = await validate(tokens.access_token);
        if (!isValidated) {
          console.log(consoleLogStyling('warning', '! Access token expired'));
          // get new tokens if invalid
          const newTokens = await auth(tokens.BroadcasterId, settings);
          console.log(consoleLogStyling('success', '* New tokens issued'));
          tokens.access_token = newTokens.access_token;
          tokens.refresh_token = newTokens.refresh_token;

          // reconnect client
          client.connect(TWITCH_IRC_ADDRESS);
        }
      }, 59*1000);

    }
  } catch (err) {
    console.error(err);
  }

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
