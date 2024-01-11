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
import wsClientEventHandler from './utils/wsClientEventHandler';
import { deleteObsoleteEntries, upsertRedeems } from './services/redeems';

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

// out of scope with connect/disconnect interfaces so that we can re-initialize it with new db settings
let WsTwitchChatConnection: ((e: EventEmitter) => void) | null | undefined = null;

async function connectWsTwitch() {
  WsTwitchChatConnection = await ChatConnection(prisma);

  if (WsTwitchChatConnection) {
    WsTwitchChatConnection(TwitchEmitter);
    TwitchEmitter.emit('connect');
  }
}

function disconnectWsTwitch() {
  if (WsTwitchChatConnection) {
    TwitchEmitter.emit('disconnect');
    WsTwitchChatConnection = null;
  }
}

// any: for some reason I can't extend Request type to use custom properties
app.use((req: any, _res, next) => {
  req['db'] = prisma;
  req['TwitchEmitter'] = TwitchEmitter;
  req['TwitchEmitterConnection'] = {
    connect: connectWsTwitch,
    disconnect: disconnectWsTwitch,
  };
  return next();
});

app.use('/api', require('./routes/router')());

const server = app.listen(Number(process.env.PORT), async () => {
  console.log(consoleLogStyling('important', '⚡️[server]: Server is running at http://localhost:' + process.env.PORT));

  try {
    // initialize twitch chat connection if settings exist
    await connectWsTwitch();

    // websocket server for client connection
    const WebSocketServer = websocket(server);

    if (WebSocketServer) {
      WebSocketServer.on('connection', (WsClientConnection, _connectionRequest) => {
        console.log(consoleLogStyling('black', '+ Client Connected'));
      
        TwitchEmitter.on('update', (data) => {
          WsClientConnection.send(JSON.stringify({ update: data }));
        });

        TwitchEmitter.on('status', (data) => {
          WsClientConnection.send(JSON.stringify({ status: data }));
        });

        // sync local redeem database with Twitch
        TwitchEmitter.emit('getRedeems');
        TwitchEmitter.on('sendRedeems', async (data: any) => {
          try {
            if (data) {
              const upsertedRedeems = await upsertRedeems(data, prisma);
      
              if (upsertedRedeems) {
                deleteObsoleteEntries(upsertedRedeems, prisma);
              }
            }
          } catch (_e) {
            null;
          }
        })

        WsClientConnection.addEventListener('message', (event: any) => {
          if (event) {
            const eventData = JSON.parse(event.data);
            wsClientEventHandler(
              eventData, 
              TwitchEmitter, 
              { 
                connect: connectWsTwitch, 
                disconnect: disconnectWsTwitch 
              }
            );
          }
        });

      });
    }

  } catch (e) {
    console.log(e);
  }
  
});
