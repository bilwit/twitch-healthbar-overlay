import { PrismaClient } from '@prisma/client';
import { Tokens } from '../services/auth';

const TWITCH_GET_CHATTERS_ADDRESS = 'https://api.twitch.tv/helix/chat/chatters';

const prisma = new PrismaClient();

export interface Settings {
  id?: number,
  listener_auth_code: string,
  listener_client_id: string,
  listener_secret: string,
  listener_user_name: string,
  channel_name: string,
  is_connected: boolean,
}

export async function fetchChatters(tokens: Tokens, user_id: string, listenerClientId: string) {
  try {
    const response = await fetch(
      TWITCH_GET_CHATTERS_ADDRESS + '?broadcaster_id=' + tokens.BroadcasterId + '&moderator_id=' + user_id,
      {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + tokens.access_token,
          'Client-Id': listenerClientId || '',
        },
      }
    );
  
    if (response) {
      const ret = await response.json();

      if (ret?.total) {
        return ret.total;
      } else {
        return 1;
      }
  
    } else {
      throw new Error('Could not reach helix endpoint');
    }
    
  } catch (e) {
    throw(e);
  }
}

prisma.$disconnect();
