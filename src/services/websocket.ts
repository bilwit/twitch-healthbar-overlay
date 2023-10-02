import WebSocket from "ws";
import { Server } from "http";

export default (expressServer: Server) => {
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

    return websocketServer;
  } catch(err) {
    console.log(err);
  }
};