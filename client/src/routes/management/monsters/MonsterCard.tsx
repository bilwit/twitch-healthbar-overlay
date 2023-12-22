import { 
  Badge,
  Button,
  Card,
  Space,
  Text,
  Avatar,
  Stack,
} from '@mantine/core';
import { Monster } from '../useGetData';
import { useDisclosure } from '@mantine/hooks';
import ItemModal from './ItemModal';
import { GiMonsterGrasp } from 'react-icons/gi';

interface Props {
  item: Monster,
  setMonsters: React.Dispatch<React.SetStateAction<Monster[]>>,
}

function Monsters(props: Props) {
  const [isOpened, { open, close }] = useDisclosure(false);
  
  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Badge
          color={props.item.published ? 'green' : 'dark'} 
          variant="light"
        >
          {props.item.published ? 'Enabled' : 'Disabled'}
        </Badge>

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
              <Button 
                justify='end'
                variant="light" 
                color="indigo" 
                radius="md"
                onClick={(e) => {
                  e.preventDefault();
                  open();
                }}
              >
                Edit
              </Button>
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

            <div style={{ display: 'flex', width: 'auto' }}>

            </div>

          </div>
                    
        </Card.Section>
      </Card>

      {isOpened && (
        <ItemModal
          isOpened={isOpened}
          close={close}
          data={props.item}
          setMonsters={props.setMonsters}
        />
      )}
    </>
  );
}

export default Monsters;
