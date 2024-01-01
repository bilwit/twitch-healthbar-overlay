import { useParams } from "react-router-dom";
import useGetData from "../../management/useGetData";
import Themes from "./themes";
import WsContext from "../../../wsContext";
import useWsMonster from "../useWsMonster";

function Bars() {
  const params = useParams();
  const { 
    data,
    isConnected, 
    connectedSocket
  } = useWsMonster();  
  
  const { isLoading, data: monsters } = useGetData('monsters/base', params?.['*']);

  return (
    <WsContext.Provider value={{ data, isConnected, connectedSocket }}>
      {!isLoading && monsters && monsters.length === 1 && (
        <Themes 
          monster={monsters?.[0]} 
        />
      )}
    </WsContext.Provider>
  );
}

export default Bars;
