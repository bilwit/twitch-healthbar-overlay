import Item from './Item';
import { useParams } from "react-router-dom";
import useGetData from "../../management/useGetData";
import useWsMonster from '../useWsMonster';
import WsContext from '../../../wsContext';

function Bars() {
  const params = useParams();
  const { isLoading, data: monsters } = useGetData('monsters/base', params?.['*']);

  const { 
    data,
    isConnected, 
    connectedSocket
  } = useWsMonster();  

  return (
    <WsContext.Provider value={{ data, isConnected, connectedSocket }}>
      <div style={{ backgroundColor: 'transparent' }}>
        {!isLoading && connectedSocket && monsters && monsters.length === 1 && monsters.map((item) => (
          <Item 
            key={item.id}
            data={item}
          />
        ))}
      </div>
    </WsContext.Provider>
  );
}

export default Bars;
