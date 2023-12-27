import { useParams } from "react-router-dom";
import useGetData from "../../management/useGetData";
import useWebSocket from '../useWebSocket';
import { useEffect } from "react";
import { theme } from "../theme";

function Bars() {
  const params = useParams();
  const { isLoading, data: monsters } = useGetData('monsters/base', params?.['*']);

  const { data, connectedSocket } = useWebSocket(String(monsters?.[0]?.id));

  useEffect(() => {
    return () => {
      if (connectedSocket) {
        connectedSocket.close();
      }
    }
  }, [connectedSocket]);

  return (
    <>
      {!isLoading && monsters && monsters.length === 1 && (
        <>{theme(monsters[0].bar_theme, isLoading, data.value, data.maxHealth)}</>
      )}
    </>
  );
}

export default Bars;
