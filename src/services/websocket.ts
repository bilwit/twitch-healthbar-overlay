import WebSocket from "ws";
import { Server } from "http";
import consoleLogStyling from "../utils/consoleLogStyling";

export default async (expressServer: Server) => {
  try {
    const websocketServer = new WebSocket.Server({
      noServer: true,
      path: "/ws",
    });
  
    expressServer.on("upgrade", (request, socket, head) => {
      websocketServer.handleUpgrade(request, socket, head, (websocket) => {
        websocketServer.emit("connection", websocket, request);
      });
    });
  
    websocketServer.on("connection", (websocketConnection, _connectionRequest) => {
        console.log(consoleLogStyling('black', '+ Client Connected'));
        websocketConnection.send(JSON.stringify({ message: 'There be gold in them thar hills.' }));
      }
    );

    return websocketServer;
  } catch(err) {
    console.log(err);
  }
};