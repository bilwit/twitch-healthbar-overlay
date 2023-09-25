import dotenv from 'dotenv';

interface tokens {
  access_token: string,
  refresh_token: string,
}

dotenv.config();

function randString (): String {
  return Math.random().toString(36).substring(2,7);
}

export default async function auth (): Promise<tokens> {

  // Get auth code in order to request auth tokens
  async function getCode () {
    const state = randString();
    try {
      const response = await fetch(
        'https://id.twitch.tv/oauth2/authorize?' + 
        'response_type=code' + '&' +
        'client_id=' + (process.env.BOT_CLIENT_ID || '') + '&' +
        'redirect_uri=http://localhost:' + process.env.PORT + '&' +
        'scope=channel:read:redemptions+moderator:read:chatters+chat:read&state=' + state,
        {
          method: 'GET',
          redirect: 'follow',
        }
      );
      if (response?.url) {

        const params = new URLSearchParams(response.url);

        if (params.get('state') !== state || !params.get('code')) {
          if (params.get('redirect_params')) {
            throw new Error('Auth Code has probably already been issued...')
          }
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

    if (code) {
      // request auth tokens
      const response = await fetch(
        'https://id.twitch.tv/oauth2/token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: new URLSearchParams({
            client_id: process.env.BOT_CLIENT_ID || '',
            client_secret: process.env.BOT_CLIENT_SECRET || '',
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: 'http://localhost:' + process.env.PORT,
          })
        }
      );

      if (response) {
        const ret = await response.json();
        if (ret?.access_token && ret?.refresh_token) {
          return {
            access_token: ret.access_token,
            refresh_token: ret.refresh_token,
          }
        } else {
          throw new Error('Could not negotiate access tokens');
        }

      } else {
        throw new Error('Could not contact auth endpoint');
      }
    } else {
      throw new Error('Could not negotiate authorization code');
    }

  } catch (e) {
    throw(e);
  }

}

