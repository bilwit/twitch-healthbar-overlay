
import { 
  Modal,
  Tabs,
  rem,
} from '@mantine/core';
import { Monster } from './useGetMonsters';
import { FaWrench } from 'react-icons/fa';
import { HiOutlineStatusOnline } from 'react-icons/hi';
import Properties from './Properties';
import Status from './Status';

interface Props {
  isOpened: boolean,
  close: () => void,
  data?: Monster,
  setMonsters: React.Dispatch<React.SetStateAction<Monster[]>>,
}

const iconStyle = { width: rem(12), height: rem(12) };

function ItemModal(props: Props) {
  return (
    <>
      <Modal 
        opened={props.isOpened} 
        onClose={() => {
          props.close();
        }} 
        title={props?.data?.name || 'Create Monster'}
        size="xl"
      >
        <Tabs defaultValue="properties" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="properties" leftSection={<FaWrench style={iconStyle} />}>
              Properties
            </Tabs.Tab>
            {props?.data?.id && (props.data.published) && (
              <Tabs.Tab value="status" leftSection={<HiOutlineStatusOnline style={iconStyle} />}>
                Status
              </Tabs.Tab>
            )}
          </Tabs.List>

          <Tabs.Panel mt="md" value="properties">
            <Properties
              isOpened={props.isOpened}
              close={props.close}
              data={props?.data}
              setMonsters={props.setMonsters}
            />
          </Tabs.Panel>

          <Tabs.Panel mt="md" value="properties">
            <Status data={props.data} />
          </Tabs.Panel>
        </Tabs>
      </Modal>
    </>
  );
}

export default ItemModal;
