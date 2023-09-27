import { PrismaClient } from '@prisma/client';
import EventEmitter from 'events';
import chatListener from '../services/chatListener';

export async function connectToTwitch() {
  try {
    const prisma = new PrismaClient();
    const settings = await prisma.settings.findFirst({
      select: {
        listener_auth_code: true,
        listener_client_id: true,
        listener_secret: true,
        listener_user_name: true,
        channel_name: true,
        is_connected: true,
      },
    })
  
    if (settings && settings?.is_connected) {
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
  listener_auth_code: string,
  listener_client_id: string,
  listener_secret: string,
  listener_user_name: string,
  channel_name: string,
  is_connected: boolean,
}