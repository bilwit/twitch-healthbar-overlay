import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import EventEmitter from 'events';
import chatListener from './services/chatListener';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);

  // emitter to interface with twitch chat
  const twitchEmitter = new EventEmitter();
  chatListener(twitchEmitter); 

  twitchEmitter.on('connected', (ret: string) => {
    console.log(ret);
  });

  twitchEmitter.on('increment', (ret: boolean) => {
    // to do
  });
});

