import dotenv from 'dotenv';
import { writeFile, readFile } from 'fs';

interface tokens {
  access_token: string,
  refresh_token: string,
}

dotenv.config();

export default async function auth(): Promise<tokens> {

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

  async function requestTokens(body: URLSearchParams): Promise<tokens> {
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
        return {
          access_token: ret.access_token,
          refresh_token: ret.refresh_token,
        }
      } else {
        console.log(ret);
        throw new Error('Could not negotiate access tokens');
      }

    } else {
      throw new Error('Could not contact auth endpoint');
    }
  }

  try {

    const refresh = await checkRefresh();

    if (refresh) {
      return await requestTokens(new URLSearchParams({
        client_id: process.env.BOT_CLIENT_ID || '',
        client_secret: process.env.BOT_CLIENT_SECRET || '',
        grant_type: 'refresh_token',
        refresh_token: encodeURIComponent(refresh),
      }));
    } else {
      return await requestTokens(new URLSearchParams({
        client_id: process.env.BOT_CLIENT_ID || '',
        client_secret: process.env.BOT_CLIENT_SECRET || '',
        code: process.env.BOT_CLIENT_AUTH || '',
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:' + process.env.PORT,
      }));
    }

  } catch (e) {
    throw(e);
  }

}

