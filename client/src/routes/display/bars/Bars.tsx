  import { useParams } from "react-router-dom";
import useGetData, { Monster } from "../../management/useGetData";
import useWebSocket from '../useWebSocket';
import Basic from './themes/Basic';

function Bars() {
  const params = useParams();
  const { isLoading, data: monsters } = useGetData('monsters/base', params?.['*']);

  const { data } = useWebSocket(String(monsters?.[0]?.id));

  const theme = (monster: Monster) => {
    switch (monster.bar_theme) {
      default:
      case 'basic':
        return (
          <Basic
            isLoading={isLoading}
            value={data.value}
            maxHealth={data.maxHealth}
          />
        )
    }
  }

  return (
    <>
      {!isLoading && monsters && monsters.length === 1 && (
        <>{theme(monsters[0])}</>
      )}
    </>
  );
}

export default Bars;
