# twitch-healthbar-overlay
OBS healthbar overlay controlled by Twitch emote/redeem events

# Pre-Requisites
1. Register the app by adding a new Developer Application here https://dev.twitch.tv/console/apps
  - `Name`: Anything unique to you, this is just for you to recognize when you authorize it manually
  - `OAuth Redirect URLs`: http://localhost:888 (this is the default port for this app, you can otherwise change it in the `docker-compose.yml` file)
  - `Category`: Chat Bot
  - Create
2. Choose to `Manage` the new app
  - Copy the `Client ID` and add it to the `BOT_CLIENT_ID` arg field in the `docker-compose.yml` file
  - Create a `New Secret` and add it to the `BOT_CLIENT_SECRET` arg field in the `docker-compose.yml` file
3. Generate your authorization code by going to:
  - `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=`BOT_CLIENT_ID`&redirect_uri=http://localhost:888&scope=channel:read:redemptions+moderator:read:chatters+chat:read&state=123`
  - Choose to authorize
  - It should redirect you to an invalid webpage. Copy the `?code=` value and add it to the `BOT_CLIENT_AUTH` arg field in the `docker-compose.yml` file
4. Enter your twitch username as the `CHANNEL_NAME` arg field in the `docker-compose.yml` file
