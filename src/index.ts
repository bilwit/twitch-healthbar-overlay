import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import EventEmitter from 'events';
import chatListener from './services/chatListener';
import consoleLogStyling from './services/consoleLogStyling';
import path from 'path';

dotenv.config();

const app: Express = express();

app.use(express.static(path.join(__dirname, '..', 'client/dist')));

app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(consoleLogStyling('important', '⚡️[server]: Server is running at http://localhost:' + process.env.PORT));

  // emitter to interface with twitch chat
  const TwitchEmitter = new EventEmitter();
  chatListener(TwitchEmitter); 

  TwitchEmitter.on('update', (update) => {
    // Update client with the updated health
  });
});

