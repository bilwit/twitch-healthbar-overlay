import { createContext } from "react";
import { MonsterData } from "./routes/display/useWsMonster";

interface IntWsContext {
  data: MonsterData | null,
  isConnected: boolean,
  connectedSocket: WebSocket | undefined,
}

const WsContext = createContext<IntWsContext>({
  data: null,
  isConnected: false,
  connectedSocket: undefined,
});

export default WsContext;
