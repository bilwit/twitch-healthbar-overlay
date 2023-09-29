
import { 
  Modal,
} from '@mantine/core';
import { Settings as Interface_Settings } from './useGetSettings';

interface Props {
  settings?: Interface_Settings
  isOpened: boolean,
  close: () => void,
}

function Settings(props: Props) {
  
  return (
    <Modal 
      opened={props.isOpened} 
      onClose={props.close} 
      title="Settings"
      size="xl"
    >
      {/* Modal content */}
    </Modal>
  );
}

export default Settings;
