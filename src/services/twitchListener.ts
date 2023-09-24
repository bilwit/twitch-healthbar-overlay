import tmi, { Options } from 'tmi.js';
import dotenv from 'dotenv';
import EventEmitter from 'events';

dotenv.config();

// Define configuration options
const opts: Options = {
  identity: {
    username: process.env.BOT_LISTENER_USERNAME,
    password: process.env.BOT_LISTENER_TOKEN,
  },
  channels: [
    process.env.CHANNEL_NAME || '',
  ]
};

const triggers = (process.env.TRIGGERS || '').trim().split(',');

export default function twitchListener (e: EventEmitter) {

  // Create a client with our options
  const client = new tmi.client(opts);

  // Register our event handlers (defined below)
  client.on('message', onMessageHandler);
  client.on('connected', onConnectedHandler);

  // Connect to Twitch:
  client.connect();

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
    e.emit('connected', '* Connected to ' + addr + ':' + port + ' (' + process.env.CHANNEL_NAME + ')');
  }

}
