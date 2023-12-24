
import { 
  Alert,
  Space,
} from '@mantine/core';
import { BiInfoCircle } from 'react-icons/bi';
import { Monster } from '../../useGetData';
import CopyURL from './CopyURL';

interface Props {
  data?: Monster,
}

function Urls(props: Props) {
  return (
    <>
      <Alert 
        mt="xl"
        variant="light" 
        color="indigo" 
        title="Display in OBS" 
        icon={
          <BiInfoCircle 
            size="1rem" 
            stroke={1.5} 
          />
        }
      >
        <div style={{ display: 'flex' }}>
          Copy the URL below to add as a
          <Space w="xs" />
          <b>browser source</b>
          <Space w="xs" />
          in OBS.
        </div>
        <div style={{ display: 'flex' }}>
          When enabled, the Twitch chat bot will actively count trigger strings to affect its health.
        </div>
      </Alert>

      <CopyURL
        url={props?.data?.id ? window.location.origin + '/display/bars/' + props.data.id : '?'}
        details={{
          label: "Health Bar",
          description: "OBS Overlay URL",
        }}
      />

      <CopyURL
        url={props?.data?.id ? window.location.origin + '/display/avatars/' + props.data.id : '?'}
        details={{
          label: "Avatar",
          description: "OBS Overlay URL",
        }}
      />
    </>
  );
}

export default Urls;
