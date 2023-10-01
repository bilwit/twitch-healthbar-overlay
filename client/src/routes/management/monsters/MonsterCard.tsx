
import { 
  Badge,
  Button,
  Card,
  Group,
  Space,
  Text,
} from '@mantine/core';
import { Monster } from './useGetMonsters';
import { useDisclosure } from '@mantine/hooks';
import ItemModal from './ItemModal';

interface Props {
  item: Monster,
  setMonsters: React.Dispatch<React.SetStateAction<Monster[]>>,
}

function Monsters(props: Props) {
  const [isOpened, { open, close }] = useDisclosure(false);
  
  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          {/* <Image
            src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            height={160}
            alt="Norway"
          /> */}
        </Card.Section>

        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500}>{props.item.name}</Text>
          <Badge color={props.item.published ? 'green' : 'dark'} variant="light">
            {props.item.published ? 'Enabled' : 'Disabled'}
          </Badge>
        </Group>

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
        <Text size="sm" c="dimmed">
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
