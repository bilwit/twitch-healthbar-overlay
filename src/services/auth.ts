import dotenv from 'dotenv';
import { Settings } from '../utils/twitch';
import { PrismaClient } from '@prisma/client';

export interface Tokens {
  access_token: string,
  refresh_token: string,
  BroadcasterId: string,
}

dotenv.config();
const prisma = new PrismaClient();

const TWITCH_GET_BROADCASTER_ID = 'https://api.twitch.tv/helix/users?login=';
const TWITCH_GET_OAUTH2 = 'https://id.twitch.tv/oauth2/';

export default async function auth(BroadcasterId: string, settings: Settings): Promise<Tokens> {

  async function checkRefresh(): Promise<string> {
    try {
      const refresh_token = await prisma.refresh_token.findFirst({
        select: {
          value: true,
        },
      })
    
      if (refresh_token && refresh_token?.value) {
        return refresh_token.value;
      } else {
        return '';
      }
    } catch (e) {
      console.error(e);
      return '';
    }
  }

  async function requestTokens(BroadcasterId: string, body: URLSearchParams): Promise<Tokens> {
    // request auth tokens
    const response = await fetch(
      TWITCH_GET_OAUTH2 + 'token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: body
      }
    );

    if (response) {
      const ret = await response.json();
      if (ret?.access_token && ret?.refresh_token) {

        updateRefresh(ret.refresh_token);

        if (!BroadcasterId) {
          BroadcasterId =  await requestBroadcasterId(ret.access_token, settings);
        }

        return {
          access_token: ret.access_token,
          refresh_token: ret.refresh_token,
          BroadcasterId: BroadcasterId,
        }
      } else {
        console.log(ret);
        await prisma.refresh_token.deleteMany();

        throw new Error('Could not negotiate access tokens');
      }

    } else {
      throw new Error('Could not contact auth endpoint');
    }
  }

  async function requestBroadcasterId(access_token: string, settings: Settings): Promise<string> {
    const response = await fetch(
      TWITCH_GET_BROADCASTER_ID + settings.channel_name,
      {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + access_token,
          'Client-Id': settings.listener_client_id || '',
        },
      }
    );

    if (response) {
      const ret = await response.json();

      if (ret?.data && Array.isArray(ret.data) && ret.data.length > 0) {
        return ret.data[0].id;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  try {

    const refresh = await checkRefresh();

    if (refresh) {
      return await requestTokens(
          BroadcasterId,
          new URLSearchParams({
          client_id: settings.listener_client_id || '',
          client_secret: settings.listener_secret || '',
          grant_type: 'refresh_token',
          refresh_token: encodeURIComponent(refresh),
        })
      );
    } else {
      return await requestTokens(
        BroadcasterId,
        new URLSearchParams({
          client_id: settings.listener_client_id || '',
          client_secret: settings.listener_secret || '',
          code: settings.listener_auth_code || '',
          grant_type: 'authorization_code',
          redirect_uri: 'http://localhost:' + process.env.PORT,
        })
      );
    }

  } catch (e) {
    throw(e);
  }

}

export async function validate(access_token: string): Promise<string> {
  try {
    const response = await fetch(
      TWITCH_GET_OAUTH2 + 'validate',
      {
        method: 'GET',
        headers: {
          'Authorization': 'OAuth ' + access_token,
        },
      }
    );
  
    if (response) {
      const ret = await response.json();
      if (ret?.client_id && ret?.client_id && ret?.user_id) {
        return ret.user_id;
      } else {
        throw new Error('Could not validate Access Token');
      }
  
    } else {
      throw new Error('Could not reach validation server');
    }
    
  } catch (e) {
    console.log(e);
    return '';
  }
}

async function updateRefresh(updated_token: string): Promise<boolean> {
  try {
    const refresh_token = await prisma.refresh_token.upsert({
      where: {
        id: 1,
      },
      create: {
        id: 1,
        value: updated_token,
      },
      update: {
        value: updated_token,
      }
    });
  
    if (refresh_token && refresh_token?.value) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
}

prisma.$disconnect();