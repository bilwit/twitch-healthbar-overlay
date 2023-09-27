import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import consoleLogStyling from './utils/consoleLogStyling';
import path from 'path';
import { connectToTwitch } from './utils/twitch';

dotenv.config();

const app: Express = express();

app.use(express.static(path.join(__dirname, '..', 'client/dist')));

app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(consoleLogStyling('important', '⚡️[server]: Server is running at http://localhost:' + process.env.PORT));

  connectToTwitch();

});

