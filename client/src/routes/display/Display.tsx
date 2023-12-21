import { 
  MantineProvider
} from '@mantine/core';

import { useParams } from "react-router-dom";
import useGetData from "../management/useGetData";
import useWebSocket from './useWebSocket';

function Display() {
  const params = useParams();
  const { isLoading, data: monsters } = useGetData('monsters', params?.['*']);

  const { data } = useWebSocket(String(monsters?.[0]?.id));

  return (
    <MantineProvider>
      {!isLoading && monsters && monsters.length === 1 && (
        <>
          <svg className="healthbar" xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 38 9" shape-rendering="crispEdges">
            <metadata>Made with Pixels to Svg https://codepen.io/shshaw/pen/XbxvNj</metadata>
            <path stroke="#222034" d="M2 2h1M3 2h32M3  3h1M2 3h1M35 3h1M3 4h1M2 4h1M35 4h1M3  5h1M2 5h1M35 5h1M3 6h32M3" />
            
            <path stroke="#323c39" d="M3 3h32" />
            <path stroke="#494d4c" d="M3 4h32M3 5h32" />

            <svg x="3" y="2.5" width="32" height="3">
              <rect 
                className="healthbar_fill" 
                height="3" 
                style={{
                  fill: '#6aff03',
                  transition: 'width 0.1s ease-in, fill 0.2s linear',
                  width: String(data.value / data.maxHealth * 100) + '%',
                }}
              />
            </svg>
          </svg>
        </>
      )}
    </MantineProvider>
  );
}

export default Display;
