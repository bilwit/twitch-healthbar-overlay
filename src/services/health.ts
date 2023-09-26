// Get Max Health - scale health based on number of chatters
// https://dev.twitch.tv/docs/api/reference/#get-chatters
import dotenv from 'dotenv';
import { Tokens } from './auth';
import consoleLogStyling from './consoleLogStyling';
dotenv.config();

const TWITCH_GET_CHATTERS_ADDRESS = 'https://api.twitch.tv/helix/chat/chatters';
const HEALTH_MULTIPLIER = 10;

export default async function health(tokens: Tokens, user_id: string): Promise<any> {
  try {
    // initialize health
    let MaxHealth = 1 * HEALTH_MULTIPLIER;
    let CurrentHealth = {
      maxHealth: MaxHealth,
      value: MaxHealth,
    };

    if (tokens?.access_token) {
      MaxHealth = (await fetchChatters(tokens, user_id)) * HEALTH_MULTIPLIER;

      setInterval(async () => {
        try {
          const MaxHealthUpdated = (await fetchChatters(tokens, user_id)) * HEALTH_MULTIPLIER;
          if (MaxHealth !== MaxHealthUpdated) {
            MaxHealth = MaxHealthUpdated;
            console.log(consoleLogStyling('health', 'Updated Max Health: ' + MaxHealthUpdated));
          }
        } catch (e) {
          console.log(consoleLogStyling('warning', '! Could not update Max Health'));
        }
      }, 15000);
    }

    console.log(consoleLogStyling('health', 'Initial Health: ' + MaxHealth));

    return function(amount: number) {
      if (CurrentHealth.maxHealth !== MaxHealth) {
        CurrentHealth.value = (CurrentHealth.value / CurrentHealth.maxHealth) * MaxHealth + amount;
        CurrentHealth.maxHealth = MaxHealth;
      }
      console.log(consoleLogStyling('health', 'Current Health: ' + CurrentHealth.value));
    }
  } catch (e) {
    console.log(e);
  }
}

async function fetchChatters(tokens: Tokens, user_id: string) {
  try {
    const response = await fetch(
      TWITCH_GET_CHATTERS_ADDRESS + '?broadcaster_id=' + tokens.BroadcasterId + '&moderator_id=' + user_id,
      {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + tokens.access_token,
          'Client-Id': process.env.BOT_CLIENT_ID || '',
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
