import tmi, { Options } from 'tmi.js';
import dotenv from 'dotenv';
import EventEmitter from 'events';
import auth, { validate } from './auth';

dotenv.config();

const triggers = (process.env.TRIGGERS || '').trim().split(',');

export default async function chatListener (e: EventEmitter) {

  // Called every time a message comes in
  function onMessageHandler (_target: string, _context: any, msg: string, self: any) {
    if (self) { return; } // Ignore messages from the bot

    // Remove whitespace from chat message
    const message = msg.trim();

    // To Do
    console.log(message)

    // scale health based on number of chatters
    // https://dev.twitch.tv/docs/api/reference/#get-chatters

    // If the command is known, let's execute it
    for (const trigger of triggers) {
      if (message.includes(trigger)) {
        e.emit('increment', true);
      }
    }
  }

  // Called every time the bot connects to Twitch chat
  function onConnectedHandler (addr: string, port: number) {
    e.emit('connected', '* Connected to ' + addr + ':' + port + ' (' + process.env.CHANNEL_NAME + ')');
  }

  try {
    // authenticate
    const tokens = await auth();

    if (tokens?.access_token && tokens?.refresh_token && await validate(tokens.access_token)) {

      // Define configuration options
      const opts: Options = {
        identity: {
          username: process.env.BOT_CLIENT_USERNAME,
          password: 'oauth:' + tokens.access_token, //oauth:token
        },
        channels: [
          process.env.CHANNEL_NAME || '',
        ]
      };

      // Create a client with our options
      const client = new tmi.client(opts);

      // Register our event handlers (defined below)
      client.on('message', onMessageHandler);
      client.on('connected', onConnectedHandler);

      // Connect to Twitch:
      client.connect();

      // validate every hour as per TOS
      setInterval(async () => {
        const isValidated = await validate(tokens.access_token);
        if (!isValidated) {
          console.log('* Access token expired');
          // get new tokens if invalid
          const newTokens = await auth();
          console.log('* New tokens issued');
          tokens.access_token = newTokens.access_token;
          tokens.refresh_token = newTokens.refresh_token;

          // reconnect TMI client
          client.disconnect();
          client.connect();
        }
      }, 59*1000);

    }
  } catch (err) {
    console.error(err);
  }

}
