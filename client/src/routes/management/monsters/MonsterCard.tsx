
import { 
  Badge,
  Button,
  Card,
  Group,
  Space,
  Text,
  Image,
} from '@mantine/core';
import { Monster } from './useGetMonsters';
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
        <Group justify="space-between" mb="xs">
          <Text fw={600}>{props.item.name}</Text>
          <Badge
            color={props.item.published ? 'green' : 'dark'} 
            variant="light"
          >
            {props.item.published ? 'Enabled' : 'Disabled'}
          </Badge>
        </Group>

        <Card.Section>
          {props?.item?.avatar_url ? (
            <Image
              src={window.location.origin + '/api/avatar/' + props.item.avatar_url}
              height={150}
              alt={props.item.name + ' Avatar'}
            />
          ) : (
            <Group justify='center'>
              <GiMonsterGrasp size={150} />
            </Group>
          )}
        </Card.Section>

        <Space h="sm" />

        <Text size="xs" c="dimmed">
          Created
        </Text>
        <Text size="sm">
          {(new Date(props.item.created_at)).toDateString()}
        </Text>
        <Space h="xs" />
        <Text size="xs" c="dimmed">
          Health Multiplier
        </Text>
        <Text size="sm">
          {props.item.hp_multiplier}
        </Text>

        <Button 
          variant="light" 
          color="indigo" 
          fullWidth 
          mt="md" 
          radius="md"
          onClick={(e) => {
            e.preventDefault();
            open();
          }}
        >
          Edit
        </Button>
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
