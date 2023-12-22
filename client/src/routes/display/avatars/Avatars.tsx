import { 
  MantineProvider,
} from '@mantine/core';
import Item from './Item';
import { useParams } from "react-router-dom";
import useGetData from "../../management/useGetData";

function Bars() {
  const params = useParams();
  const { isLoading, data: monsters } = useGetData('monsters/base', params?.['*']);

  return (
    <MantineProvider>
      {!isLoading && params?.['*'] && monsters && monsters.length === 1 && monsters.map((item) => (
        <Item 
          key={item.id}
          data={item}
        />
      ))}
    </MantineProvider>
  );
}

export default Bars;
