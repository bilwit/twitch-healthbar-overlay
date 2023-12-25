import { 
  Badge,
  Button,
  Card,
  Space,
  Text,
  Avatar,
  Stack,
  Group,
} from '@mantine/core';
import { Monster } from '../useGetData';
import { useDisclosure } from '@mantine/hooks';
import ItemModal from './ItemModal';
import { GiMonsterGrasp } from 'react-icons/gi';
import { MdEdit } from 'react-icons/md';

interface Props {
  item: Monster,
  setMonsters: React.Dispatch<React.SetStateAction<Monster[]>>,
  editRelations: (ref_model: Monster) => void,
}

function Monsters(props: Props) {
  const [isOpened, { open, close }] = useDisclosure(false);
  
  return (
    <>
      <Card
        shadow="sm" 
        padding="lg" 
        radius={0} 
        mr="1" 
        pb="xs" 
        withBorder
      >
        <Card.Section mt={0} mb="xs">
          <div style={{ display: 'flex' }}>
            {props?.item?.avatar_url ? (
              <Avatar 
                src={window.location.origin + '/api/avatar/' + props.item.avatar_url} 
                radius="xl" 
                size="lg" 
                ml="lg"
                mt="sm"
              />
            ) : (
              <GiMonsterGrasp size={150} />
            )}

            <Space w="md" />

            <Stack gap="0">
              <Text fw={600} mb="sm">{props.item.name}</Text>
              <Badge
                color={props.item.published ? 'green' : 'dark'} 
                variant="light"
              >
                {props.item.published ? 'Enabled' : 'Disabled'}
              </Badge>
            </Stack>

            <Stack gap="0" ml="lg">
              <Text size="xs" c="dimmed">
                Created
              </Text>
              <Text size="sm">
                {(new Date(props.item.created_at)).toDateString()}
              </Text>

              <Text size="xs" c="dimmed" mt="sm">
                Health Multiplier
              </Text>

              <Text size="sm">
                {props.item.hp_multiplier}
              </Text>
            </Stack>

            <Space w="md" />

            <Group>
              <Button 
                justify='end'
                variant="light" 
                color="indigo" 
                radius="md"
                ml="xl"
                onClick={(e) => {
                  e.preventDefault();
                  open();
                }}
                leftSection={
                  <MdEdit 
                    size="1rem" 
                    stroke={1.5} 
                  />
                }
              >
                Edit
              </Button>
            </Group>
          </div>
                    
        </Card.Section>
      </Card>

      {isOpened && (
        <ItemModal
          isOpened={isOpened}
          close={close}
          data={props.item}
          setMonsters={props.setMonsters}
          editRelations={props.editRelations}
        />
      )}
    </>
  );
}

export default Monsters;
