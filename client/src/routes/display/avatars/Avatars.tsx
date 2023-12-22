import { 
    MantineProvider
  } from '@mantine/core';
  
  import { useParams } from "react-router-dom";
  import useGetData, { Monster } from "../../management/useGetData";
  import useWebSocket from '../useWebSocket';
  
  function Bars() {
    const params = useParams();
    const { isLoading, data: monsters } = useGetData('monsters', params?.['*']);
  
    const { data } = useWebSocket(String(monsters?.[0]?.id));
  
    console.log(monsters[0])
  
    return (
      <MantineProvider>
        {!isLoading && monsters && monsters.length === 1 && (
          <>hello</>
        )}
      </MantineProvider>
    );
  }
  
  export default Bars;
  