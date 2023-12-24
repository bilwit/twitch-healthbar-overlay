
import { 
  Modal,
  Tabs,
  rem,
} from '@mantine/core';
import { Monster } from '../useGetData';
import { FaWrench } from 'react-icons/fa';
import { HiOutlineStatusOnline } from 'react-icons/hi';
import Properties from './properties';
import Status from './status';
import { useState } from 'react';
import { MdHealthAndSafety, MdHttp, MdPeople } from 'react-icons/md';
import Stages from './stages';
import Urls from './urls';
import Relations from './relations';

interface Props {
  isOpened: boolean,
  close: () => void,
  data?: Monster,
  setMonsters: React.Dispatch<React.SetStateAction<Monster[]>>,
}

const iconStyle = { width: rem(12), height: rem(12) };

function ItemModal(props: Props) {
  const [modalName, setModalName] = useState(props?.data?.name || 'Create Monster');

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
            {props?.data?.id && (
              <>
                <Tabs.Tab value="stages" leftSection={<MdHealthAndSafety style={iconStyle} />}>
                  Health Stages
                </Tabs.Tab>
                <Tabs.Tab value="relations" leftSection={<MdPeople style={iconStyle} />}>
                  Relations
                </Tabs.Tab>
              </>
            )}
            {props?.data?.id && (props.data.published) && (
              <>
                <Tabs.Tab value="urls" leftSection={<MdHttp style={iconStyle} />}>
                  URLs
                </Tabs.Tab>
                <Tabs.Tab value="status" leftSection={<HiOutlineStatusOnline style={iconStyle} />}>
                  Status
                </Tabs.Tab>
              </>
            )}
          </Tabs.List>

          <Tabs.Panel mt="md" value="properties">
            <Properties
              isOpened={props.isOpened}
              close={props.close}
              data={props?.data}
              setMonsters={props.setMonsters}
              setModalName={setModalName}
            />
          </Tabs.Panel>

          {props.data?.id && (
            <Tabs.Panel mt="md" value="stages">
              <Stages refId={props.data?.id} />
            </Tabs.Panel>
          )}

          <Tabs.Panel mt="md" value="urls">
            <Urls data={props.data} />
          </Tabs.Panel>

          <Tabs.Panel mt="md" value="status">
            <Status data={props.data} />
          </Tabs.Panel>

          <Tabs.Panel mt="md" value="relations">
            <Relations data={props.data} />
          </Tabs.Panel>
        </Tabs>
      </Modal>
    </>
  );
}

export default ItemModal;
