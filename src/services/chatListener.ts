import { client as WebSocketClient } from 'websocket';
import dotenv from 'dotenv';
import EventEmitter from 'events';
import auth, { validate } from './auth';
import parser from './parser';
import health from './health';
import consoleLogStyling from './consoleLogStyling';

const TWITCH_IRC_ADDRESS = 'ws://irc-ws.chat.twitch.tv:80';

dotenv.config();

export default async function chatListener (e: EventEmitter) {

  const triggers = 'CurseLit,lit'.trim().split(','); // (process.env.TRIGGERS || '').trim().split(',');

  // counts the amount of times trigger words are found in the message
  function checkTriggerWords (message: string, Health: any) {
    let triggerCount = 0;
    for (const trigger of triggers) {
      const triggerFound = message.split(trigger).length-1;
      if (triggerFound > 0) {
        triggerCount += triggerFound;
      }
    }
    if (triggerCount > 0) {
      Health(-triggerCount);
      // e.emit('increment', triggerCount);
    }
  }

  try {
    // authenticate
    const tokens = await auth('');

    const user_id = await validate(tokens.access_token);

    if (tokens?.access_token && tokens?.refresh_token && user_id) {

      const client = new WebSocketClient();

      // Register our event handlers (defined below)
      client.on('connect', async (connection) => {
        
        console.log(consoleLogStyling('success', '* Connected to ' + TWITCH_IRC_ADDRESS));

        // authenticate
        // connection.sendUTF('CAP REQ :twitch.tv/membership'); // track chatters on join/leave -- it doesn't give you the initial list of chatters & massive delay on join/leave
        connection.sendUTF('PASS oauth:' + tokens.access_token);
        connection.sendUTF('NICK ' + process.env.BOT_CLIENT_USERNAME);   

        connection.sendUTF('JOIN #billywhitmore');

        connection.on('error', (error) => {
          console.log(consoleLogStyling('error', '! Connection Error: ' + error.toString()));
        });

        connection.on('close', () => {
          console.log(consoleLogStyling('warning', '! Connection Closed'));
          console.log(consoleLogStyling('warning', `!   Description: ${connection.closeDescription}`));
          console.log(consoleLogStyling('warning', `!   Code: ${connection.closeReasonCode}`));
        });

        const Health = await health(tokens, user_id);
  
        connection.on('message', (message) => {
          const parsed = parser(message);

          if (parsed) {
            switch (parsed.command.command) {
              case 'PING': // keepalive
                console.log(consoleLogStyling('black', '* KeepAlive'));
                connection.sendUTF('PONG ' + parsed.parameters);
                break;
              case 'PRIVMSG': // chatter message
                checkTriggerWords(parsed.parameters, Health);
                break;
              default:
                break;
            }
          }
        });
      });

      // Connect to Twitch:
      client.connect(TWITCH_IRC_ADDRESS);

      // validate every hour as per TOS
      setInterval(async () => {
        const isValidated = await validate(tokens.access_token);
        if (!isValidated) {
          console.log(consoleLogStyling('warning', '! Access token expired'));
          // get new tokens if invalid
          const newTokens = await auth(tokens.BroadcasterId);
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
