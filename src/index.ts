import express, { Express, Request } from 'express';
import dotenv from 'dotenv';
import consoleLogStyling from './utils/consoleLogStyling';
import path from 'path';
import cors from 'cors';
import compression from 'compression';
import { PrismaClient } from '@prisma/client';
import { EventEmitter } from 'stream';
import ChatConnection from './services/chatConnection';

dotenv.config();

const app: Express = express();
const prisma = new PrismaClient();

app.set('trust proxy', true);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  express.raw({
    inflate: true,
    type: 'application/x-www-form-urlencoded',
  }),
);
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'client/dist')));

const TwitchEmitter = new EventEmitter();

// some reason I can't extend Request type to use custom properties
app.use((req: any, _res, next) => {
  req['db'] = prisma;
  req['TwitchEmitter'] = TwitchEmitter;
  return next()
})

app.use('/api/monsters', require('./routes/monsters.api'));
app.use('/api/settings', require('./routes/settings.api'));

// serve React client directly from Express
// app.get('/', (_req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
// });

app.listen(process.env.PORT, () => {
  console.log(consoleLogStyling('important', '⚡️[server]: Server is running at http://localhost:' + process.env.PORT));
  
  ChatConnection(prisma).then((connection) => {
    if (connection) {
      connection(TwitchEmitter);
      TwitchEmitter.emit('connect');
    }
  }).catch((err) => {
    console.error(err);
  });
  
});
