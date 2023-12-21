
import { 
  Modal,
  Tabs,
  rem,
} from '@mantine/core';
import { HealthBar } from '../useGetData';
import { FaWrench } from 'react-icons/fa';
import Properties from './Properties';
import { useState } from 'react';

interface Props {
  isOpened: boolean,
  close: () => void,
  data?: HealthBar,
  setData: React.Dispatch<React.SetStateAction<HealthBar[]>>,
}

const iconStyle = { width: rem(12), height: rem(12) };

function ItemModal(props: Props) {
  const [modalName, setModalName] = useState(props?.data?.name || 'Create Health Bar');

  return (
    <>
      <Modal 
        opened={props.isOpened} 
        onClose={() => {
          props.close();
        }} 
        title={modalName}
        size="xl"
      >
        <Tabs defaultValue="properties" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="properties" leftSection={<FaWrench style={iconStyle} />}>
              Properties
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel mt="md" value="properties">
            <Properties
              isOpened={props.isOpened}
              close={props.close}
              data={props?.data}
              setData={props.setData}
              setModalName={setModalName}
            />
          </Tabs.Panel>
        </Tabs>
      </Modal>
    </>
  );
}

export default ItemModal;
