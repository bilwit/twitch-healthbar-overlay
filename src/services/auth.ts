import dotenv from 'dotenv';
import { writeFile, readFile } from 'fs';

export interface Tokens {
  access_token: string,
  refresh_token: string,
  BroadcasterId: string,
}

dotenv.config();

export default async function auth(BroadcasterId: string): Promise<Tokens> {

  function checkRefresh(): Promise<string> {
    return new Promise((resolve, _reject) => {
      readFile('src/storage/refresh_token', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          resolve('');
        } else {
          resolve(data);
        }
      })
    })
  }

  async function requestTokens(BroadcasterId: string, body: URLSearchParams): Promise<Tokens> {
    // request auth tokens
    const response = await fetch(
      'https://id.twitch.tv/oauth2/token',
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
        writeFile('src/storage/refresh_token', ret?.refresh_token, {
          flag: 'w',
        }, (err) => {
          if (err) {
            console.error('Could not save refresh_token');
          }
        })

        if (!BroadcasterId) {
          BroadcasterId =  await requestBroadcasterId(ret.access_token);
        }

        return {
          access_token: ret.access_token,
          refresh_token: ret.refresh_token,
          BroadcasterId: BroadcasterId,
        }
      } else {
        console.log(ret);
        throw new Error('Could not negotiate access tokens');
      }

    } else {
      throw new Error('Could not contact auth endpoint');
    }
  }

  async function requestBroadcasterId(access_token: string): Promise<string> {
    const response = await fetch(
      'https://api.twitch.tv/helix/users?login=' + process.env.CHANNEL_NAME,
      {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + access_token,
          'Client-Id': process.env.BOT_CLIENT_ID || '',
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
          client_id: process.env.BOT_CLIENT_ID || '',
          client_secret: process.env.BOT_CLIENT_SECRET || '',
          grant_type: 'refresh_token',
          refresh_token: encodeURIComponent(refresh),
        })
      );
    } else {
      return await requestTokens(
        BroadcasterId,
        new URLSearchParams({
          client_id: process.env.BOT_CLIENT_ID || '',
          client_secret: process.env.BOT_CLIENT_SECRET || '',
          code: process.env.BOT_CLIENT_AUTH || '',
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
      'https://id.twitch.tv/oauth2/validate',
      {
        method: 'GET',
        headers: {
          'Authorization': 'OAuth ' + access_token,
        },
      }
    );
  
    if (response) {
      const ret = await response.json();
      console.log(ret)
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