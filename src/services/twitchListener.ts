import tmi, { Options } from 'tmi.js';
import dotenv from 'dotenv';
import EventEmitter from 'events';
import auth from './auth';

dotenv.config();

const triggers = (process.env.TRIGGERS || '').trim().split(',');

export default async function twitchListener (e: EventEmitter) {

  // Called every time a message comes in
  function onMessageHandler (_target: string, _context: any, msg: string, self: any) {
    if (self) { return; } // Ignore messages from the bot

    // Remove whitespace from chat message
    const message = msg.trim();

    // If the command is known, let's execute it
    for (const trigger of triggers) {
      if (message.includes(trigger)) {
        e.emit('increment', true);
      }
    }
  }

  // Called every time the bot connects to Twitch chat
  function onConnectedHandler (addr: string, port: number) {
    e.emit('connected', '* Connected to ' + addr + ':' + port + ' (' + process.env.BOT_LISTENER_USERNAME + ')');
  }

  try {
    // authenticate
    const tokens = await auth();

    if (tokens?.access_token && tokens?.refresh_token) {

      console.log(tokens);

      // // Define configuration options
      // const opts: Options = {
      //   identity: {
      //     username: process.env.BOT_CLIENT_USERNAME,
      //     password: 'oauth:' + tokens.access_token, //oauth:token
      //   },
      //   channels: [
      //     process.env.CHANNEL_NAME || '',
      //   ]
      // };

      // // Create a client with our options
      // const client = new tmi.client(opts);

      // // Register our event handlers (defined below)
      // client.on('message', onMessageHandler);
      // client.on('connected', onConnectedHandler);

      // // Connect to Twitch:
      // client.connect();
    }
  } catch (err) {
    console.error(err);
  }

}
