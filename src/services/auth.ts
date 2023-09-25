import dotenv from 'dotenv';
import { Options } from 'tmi.js';

dotenv.config();

function randString (): String {
  return Math.random().toString(36).substring(2,7);
}

export default async function auth (): Promise<Options> {
  // Define configuration options
  const opts: Options = {
    identity: {
      username: process.env.BOT_CLIENT_USERNAME,
      password: '', //oauth:token
    },
    channels: [
      process.env.CHANNEL_NAME || '',
    ]
  };

  // Get auth code in order to request auth tokens
  async function getCode () {
    const state = randString();
    try {
      const response = await fetch(
        'https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=' + (process.env.BOT_CLIENT_ID || '') + '&redirect_uri=http://localhost:' + process.env.PORT + '&scope=channel:read:redemptions+moderator:read:chatters+chat:read&state=' + state,
        {
          method: 'GET',
          redirect: 'follow',
        }
      );
      if (response?.url) {
        const params = new URLSearchParams(response.url);
        if (params.get('state') !== state) {
          throw new Error('CSRF Invalid');
        } else {
          return params.get('code');
        }
      } else {
        throw true;
      }
    } catch (e) {
      throw(e);
    }
  }

  try {
    const code = await getCode();

    throw new Error("To Do");

    // if (code) {
    //   // request auth tokens
    //   const response = await fetch(
    //     'https://id.twitch.tv/oauth2/token',
    //     {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    //       },
    //       body: new URLSearchParams({
    //         client_id: process.env.BOT_CLIENT_ID || '',
    //         client_secret: process.env.BOT_CLIENT_SECRET || '',
    //         code: code,
    //         grant_type: 'authorization_code',
    //         redirect_uri: 'http://localhost:' + process.env.PORT,
    //       })
    //     }
    //   );
    //   if (response) {
    //     return await response.json();
    //   } else {
    //     throw true;
    //   }
    // }

  } catch (e) {
    console.log(e);
    throw(e);
  }

  return opts;
}

