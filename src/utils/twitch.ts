import { PrismaClient } from '@prisma/client';
import EventEmitter from 'events';
import chatListener from '../services/chatListener';

export async function connectToTwitch() {
  try {
    const prisma = new PrismaClient();
    const settings = await prisma.settings.findFirst({
      select: {
        listenerAuthCode: true,
        listenerClientId: true,
        listenerSecret: true,
        listenerUserName: true,
        channelName: true,
        connectToTwitch: true,
      },
    })
  
    if (settings && settings?.connectToTwitch) {
      // emitter to interface with twitch chat
      const TwitchEmitter = new EventEmitter();
      chatListener(TwitchEmitter, settings); 
    }
  } catch (e) {
    console.error(e);
  }
}

export interface Settings {
  id?: number,
  listenerAuthCode: string,
  listenerClientId: string,
  listenerSecret: string,
  listenerUserName: string,
  channelName: string,
  connectToTwitch: boolean,
}