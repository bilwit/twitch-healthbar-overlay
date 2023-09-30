
import { 
  Alert,
  Button,
  Modal,
} from '@mantine/core';
import classes from '../../../css/Nav.module.css';
import { AiOutlineFileAdd } from 'react-icons/ai';
import { useDisclosure } from '@mantine/hooks';

function Monsters() {
  const [isOpened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button
        leftSection={
          <AiOutlineFileAdd 
            size="1rem" 
            stroke={1.5} 
          />
        }
        onClick={(e) => {
          e.preventDefault();
          open();
        }}
      >
        Create
      </Button>

      <Modal 
        opened={isOpened} 
        onClose={close} 
        title="Create Monster"
        size="xl"
      >
        hello
      </Modal>
    </>
  );
}

export default Monsters;
