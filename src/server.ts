import express, { Express } from 'express';
import dotenv from 'dotenv';
import consoleLogStyling from './utils/consoleLogStyling';
import path from 'path';
import cors from 'cors';
import compression from 'compression';
import { PrismaClient } from '@prisma/client';
import { EventEmitter } from 'stream';
import ChatConnection from './services/chatConnection';
import websocket from './services/websocket';
import socketEventHandler from './utils/socketEventHandler';

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

// any: for some reason I can't extend Request type to use custom properties
app.use((req: any, _res, next) => {
  req['db'] = prisma;
  req['TwitchEmitter'] = TwitchEmitter;
  return next();
})

app.use('/api', require('./routes/router')());

let WsTwitchChatConnection: ((TwitchEmitter: EventEmitter) => void) | null | undefined = null;
const server = app.listen(Number(process.env.PORT), async () => {
  console.log(consoleLogStyling('important', '⚡️[server]: Server is running at http://localhost:' + process.env.PORT));

  try {
    // initialize twitch chat connection if settings exist
    WsTwitchChatConnection = await ChatConnection(prisma);

    if (WsTwitchChatConnection) {
      WsTwitchChatConnection(TwitchEmitter);
      TwitchEmitter.emit('connect');
    }

    // websocket server for client connection
    const WebSocketServer = websocket(server);

    if (WebSocketServer) {
      WebSocketServer.on("connection", (websocketConnection, _connectionRequest) => {
        console.log(consoleLogStyling('black', '+ Client Connected'));
      
        TwitchEmitter.on('update', (data) => {
          websocketConnection.send(JSON.stringify({ update: data }));
        })

        websocketConnection.addEventListener('message', (event: any) => {
          if (event) {
            const eventData = JSON.parse(event.data);
            socketEventHandler(eventData, TwitchEmitter);
          }
        });

      });
    }

  } catch (e) {
    console.log(e);
  }
  
});
